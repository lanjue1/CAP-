module.exports = {
  navTheme: 'dark', // theme for nav menu
  primaryColor: '#1890FF', // primary color of ant design
  layout: 'sidemenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fluid', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: false, // sticky header
  autoHideHeader: false, // auto hide header
  fixSiderbar: true, // sticky siderbar
  menu: {
    // disableLocal: true,  
    // 开启国际化框架 如果 disableLocal= false,那么name=formatMessage({ id: locale, defaultMessage: item.name });
    // const name = menu.disableLocal
    // ? item.name
    // : formatMessage({ id: locale, defaultMessage: item.name });
   locale:false,
   
  },
  title: 'Lenovo - CAP',
  pwa: false,
  // Your custom iconfont Symbol script Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理
  // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
  iconfontUrl: '',
};
