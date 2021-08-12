import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { urlToList } from '../_utils/pathTools';
import { getMenuMatches } from './SiderMenuUtils';
import { isUrl, transferLanguage } from '@/utils/utils';
import styles from './index.less';
import router from 'umi/router';
import IconFont from '@/components/IconFont';
import { connect } from 'dva';

const { SubMenu } = Menu;

const getIcon = icon => {
  if (typeof icon === 'string') {
    if (isUrl(icon)) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon} />} />;
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} />;
  }
  return icon;
};

@connect(({ menu, i18n }) => ({ menuAuthority: menu.menuAuthority, language: i18n.language }))
export default class BaseMenu extends PureComponent {
  state = {
    mouseOver: ''
  }
  componentDidMount() {
    const { dispatch } = this.props;
    if (!localStorage.getItem('language')) {
      dispatch({
        type: 'i18n/fetch',
        payload: { type: localStorage.getItem('language_type') ? localStorage.getItem('language_type') : 'en-US' },
        callback: (res) => {
          localStorage.setItem('language', JSON.stringify(res));
        }
      });
    }
    dispatch({
      type: 'login/checkLogin',
      callback: res => {
        if (res.code === 0) {
          localStorage.setItem('user', JSON.stringify(res.data));
          dispatch({
            type: 'menu/getMenuAuthority',
          });
        } else {
          // localStorage.clear();
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('changeToken');
          localStorage.removeItem('openToken');
          localStorage.removeItem('timeZone');
          router.push('/user/login');
        }
      },
    });

  }
  // 给菜单排序
  compare1 = (value1, value2) => {
    let v1 = value1.sort;
    let v2 = value2.sort;
    return v1 - v2
  }
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = menusData => {
    const { menuAuthority } = this.props;
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    const { menuAuthority, language } = this.props;
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const index = menuAuthority.findIndex(v => v.code === item.code);
      if (index === -1) {
        return;
      }
      const newAuthority = [];
      item.sort = menuAuthority[index].sort
      item.children.filter(child => {
        menuAuthority[index].menuBODetail.filter(menu => {
          //  if (child.path === menu.path) {
          //   newAuthority.push(child);
          //  }
          if (child.code === menu.code) {
            child.sort = menu.sort
            newAuthority.push(child);
          }
        });
      });
      const { name } = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{transferLanguage(name, language)}</span>
              </span>
            ) :
              transferLanguage(name, language)

          }
          key={item.path}
        >
          {this.getNavMenuItems(newAuthority)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { language } = this.props
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{transferLanguage(name, language)}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
        <Link
          className={styles.link}
          style={{ width: '100%' }}
          to={itemPath}
          target={target}
          replace={itemPath === location.pathname}
          onMouseOver={() => { this.setState({ mouseOver: item.path }) }}
          onClick={
            isMobile
              ? (e) => {
                onCollapse(true);
              }
              : undefined
          }
        >
          {icon}
          <span>{transferLanguage(name, language)}</span>
          {this.state.mouseOver === itemPath && < a className={styles.link} style={{ float: 'right', color: 'rgba(255, 255, 255, 0.65)' }} onClick={(e) => { e.stopPropagation(); }} href={itemPath} target="_blank" >
          <Icon style={{
            display: 'inline-block', mozTtransform: 'scaleX(-1)',
            webkitTransform: 'scaleX(-1)',
            oTransform: 'scaleX(-1)',
            transform: 'scaleX(-1)'
          }} type='select' />
        </a>}
        </Link>
    );
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
      className,
      collapsed,
      language
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }

    let props = {};
    if (openKeys && !collapsed) {
      props = {
        openKeys: openKeys.length === 0 ? [...selectedKeys] : openKeys,
      };
    }
    const { handleOpenChange, style, menuData, menuAuthority } = this.props;

    // let _menuData = menuData.sort(this.compare1)
    let _menuData = menuData
    // console.log('_menuData%%%%%',_menuData,menuAuthority)
    const cls = classNames(className, {
      'top-nav-menu': mode === 'horizontal',
    });

    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        className={cls}
        {...props}
      >
        {this.getNavMenuItems(_menuData)}
        {/* {this.getNavMenuItems(route)} */}
      </Menu>
    );
  }
}
