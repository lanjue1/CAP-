import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import Prompt from '@/components/Prompt';

import {
  fakeAccountLogin,
  fakeWarehounse,
  getFakeCaptcha,
  fakeAccountLogout,
  checkLogin,
  ddLogin,
} from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    user: {},
  },

  effects: {
    *login({callback, payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code === 0) {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        // yield put(routerRedux.replace(redirect || '/'));
        // window.location.reload(true);
        window.location.href = '/';
        callback && callback(response.data)
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
    *warehounse({ payload, callback }, { call, put }) {
      const response = yield call(fakeWarehounse, payload)
      const {code,message,data}=response
      if(code!==0){
        Prompt({content:message,type:'warn'})
        return
      }
      
      callback&&callback(response);
    },
    *checkLogin({ payload, callback }, { call, put }) {
      const response = yield call(checkLogin, payload);
      if (response.data) {
        yield put({
          type: 'saveUser',
          payload: {
            user: response.data,
          },
        });
      }
      callback(response);
    },

    *logout(_, { call, put }) {
      const response = yield call(fakeAccountLogout);

      if (response.code === 0) {
        // localStorage.clear();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('changeToken');
        localStorage.removeItem('openToken');
        localStorage.removeItem('timeZone');
        localStorage.removeItem('language');

        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        // reloadAuthorized();
        // redirect
        if (window.location.pathname !== '/user/login') {
          yield put(
            routerRedux.replace({
              pathname: '/user/login',
              // search: stringify({
              //   redirect: window.location.href,
              // }),
            })
          );
        }
      }
    },
  },

  reducers: {
    saveUser(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLoginStatus(state, { payload }) {
      //setAuthority(payload.currentAuthority);

      if (payload.code === 0) {
        localStorage.setItem('token', payload.data);
        localStorage.setItem('flag', true)
        // setAuthority('aa');
      }
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
