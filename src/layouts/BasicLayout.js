import React, { Suspense } from 'react';
import { Layout, Spin } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Media from 'react-media';
import logo from '../assets/hicainLogo_write.png';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/SiderMenu';
import pathToRegexp from 'path-to-regexp';
import getPageTitle from '@/utils/getPageTitle';
import TabsController from '@/components/TabsController';
import router from 'umi/router';
import styles from './BasicLayout.less';

// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};
const tabss = props => {
  return props;
};
class Tabss extends React.Component {
  render() {
    return;
  }
}
class BasicLayout extends React.Component {
  state = {
    showHeader: false,
  };
  componentDidMount() {
    const {
      dispatch,
      route: { routes, path, authority },
      location: { pathname },
    } = this.props;
    // dispatch({
    //   type: 'user/fetchCurrent',
    // });

    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, path, authority },
    });
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '200px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer = () => {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    if (process.env.NODE_ENV === 'production' && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  };

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  showOrHideHeader = showHeader => {
    this.setState({
      showHeader,
    });
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location,
      isMobile,
      menuData,
      breadcrumbNameMap,
      fixedHeader,
      dispatch,
      collapsed,
      match,
      currentUser,
      spin,
    } = this.props;
    const { pathname } = location;
    const { showHeader } = this.state;
    const tabsParams = {
      dispatch,
      match,
      location,
      showHeader,
      showOrHideHeader: this.showOrHideHeader,
      collapsed,
      isMobile,
      onCollapse: this.handleMenuCollapse,
      currentUser,
      ...this.matchParamsPath(pathname, breadcrumbNameMap),
      component: children,
    };
    const isTop = PropsLayout === 'topmenu';
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          {showHeader && (
            <Header
              menuData={menuData}
              handleMenuCollapse={this.handleMenuCollapse}
              logo={logo}
              isMobile={isMobile}
              {...this.props}
            />
          )}
          <Content
            className={!showHeader ? styles.hideHeaderContent : styles.content}
            style={contentStyle}
          >
            <Spin spinning={spin}>
              <TabsController {...tabsParams} />
              {/* <div className={styles.tabContent}>{children}</div> */}
            </Spin>
          </Content>
          {/* <Footer /> */}
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        <Suspense fallback={null}>{this.renderSettingDrawer()}</Suspense>
      </React.Fragment>
    );
  }
}

export default connect(({ user, global, common, setting, menu: menuModel }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  spin: common.spin,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => (
      // <Spin spinning={props.spin}>
      //   <BasicLayout {...props} isMobile={isMobile} />
      // </Spin>
      <BasicLayout {...props} isMobile={isMobile} />
    )}
  </Media>
));
