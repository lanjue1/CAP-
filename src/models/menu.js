import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import { getMenuAuthority } from '@/services/api';
import { menu } from '../defaultSettings';

const { check } = Authorized;

// Conversion router to menu. 
//formatter()用于遍历routes，和子路由，并处理权限+国际化
function formatter(data, parentAuthority, parentName) {
  if (!data) {
    return undefined;
  }
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      //国际化 语言配置 相关的local
      let locale = 'menu';
      if (parentName && parentName !== '/') {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      // if enableMenuLocale use item.name,
      // close menu international
      const name = menu.disableLocal
        ? item.name
        : formatMessage({ id: locale, defaultMessage: item.name });
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

// 后台返回路由的数据处理，提取出 itemList数组中的所有item
function formatterMenu(data){
  if(!data) return
  return data.map(item=>{
    const {children,...result}=item
    if(children&&children.length>0){
      let newChild=[]
      children.forEach(v=>{
        if(v.itemList){
          newChild=newChild.concat(v.itemList) // 当有多个二级菜单时 全部用 concat装起来
        }else{
          newChild.push(v)
        }
      })
      result.children=newChild
    }
  })
  
}
/**
 * get SubMenu or Item 获得子路由
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    routerData: [],
    breadcrumbNameMap: {},
    menuAuthority: [],
  },

  effects: {
    *getMenuData({ payload }, { put }) {

      const { routes, authority, path } = payload;
      const originalMenuData = memoizeOneFormatter(routes, authority, path);
      const menuData = filterMenuData(originalMenuData);
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, routerData: routes },
      });
    },
    *getMenuAuthority({ _ }, { call, put }) {
      const response = yield call(getMenuAuthority);
      //   let route=[]
      // route=response.data.map((v,index)=>{
      //   let obj={}
      //       obj.path=v.path
      //       obj.name=v.name
      //       obj.icon=v.icon
      //       obj.code=v.code
      //       if(v.menuBODetail&&v.menuBODetail.length>0){
      //         obj.menuBODetail=(v.menuBODetail).map((item) =>{
      //           let obj2={}
      //           if(item.menuBODetail && item.menuBODetail.length>0){
      //             obj2.menuBODetail=item.menuBODetail.map(o=>{
      //               return {
      //                 path: o.path,
      //                 name:o.name,
      //                 hideInMenu: o.hideInMenu ,
      //                 component: o.component,
      //                 code:o.code
      //               }
      //             })
      //           }else{
      //             obj2.component=item.component
      //           }
      //           obj2. path= item.path
      //           obj2. name=item.name
      //           obj2. hideInMenu= item.hideInMenu 
      //           obj2. component= item.component
      //           obj2.code=item.code
      //           return obj2
      //         })
      //       }else{
      //         obj.component=v.component
      //       }
      //       if(v.path=='/user'){
      //         obj.layout=false
      //       }
      //       return obj
      // })
      if (response.code === 0) {
        yield put({
          type: 'menuAuthority',
          payload: { menuAuthority: response.data },
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    menuAuthority(state, action) {
      return {
        ...state,
        menuAuthority: action.payload.menuAuthority,
      };
    },
  },
};
