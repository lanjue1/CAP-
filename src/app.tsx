import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { notification, Layout } from 'antd';
import { history, RequestConfig } from 'umi';
// import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { ResponseError } from 'umi-request';
import { queryCurrent } from './services/user';
import defaultSettings from '../config/defaultSettings';
import TarsController from '@/components/TabsController'
import logo from '@/assets/hicainLogo_write.png';
import '@ant-design/compatible/assets/index.css';

const { Content } = Layout;

export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  settings?: LayoutSettings;
}> {
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    try {
      const currentUser = await queryCurrent();
      console.log('currentUser====',currentUser)

      if (currentUser.code === 0) {
        localStorage.setItem('user', JSON.stringify(currentUser.data))
      }
      return {
        currentUser: currentUser.data,
        settings: defaultSettings,
      };
    } catch (error) {
      console.log('error', error)
      history.push('/user/login');
    }
  }
  return {
    settings: defaultSettings,
  };
}
// const {
//   children,
//   location,
//   isMobile,
//   breadcrumbNameMap,
//   dispatch,
//   collapsed,
//   match,
//   currentUser,
// } = props;
// const tabsParams = {
//   dispatch,
//   match,
//   location,
//   showHeader,
//   showOrHideHeader: this.showOrHideHeader,
//   collapsed,
//   isMobile,
//   onCollapse: this.handleMenuCollapse,
//   currentUser,
//   ...this.matchParamsPath(pathname, breadcrumbNameMap),
//   component: children,
// };

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <></>,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser?.id && history.location.pathname !== '/user/login') {
        console.log('???=======', initialState)
        history.push('/user/login');
      }
    },

    logo: () => (<div style={{ width: '200px' }} ><img style={{ height: '48px', marginRight: '46px' }} src={logo} alt='logo' /></div>),
    menuHeaderRender: undefined,
    headerContentRender: () => (<Content
    ><TarsController collapsed={false} />{console.log('setting', initialState)}</Content>),
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

export const request: RequestConfig = {
  errorHandler,
};
