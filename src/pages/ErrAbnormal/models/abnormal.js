import {
  abnormalList,
  userList,
  abnormalDetail,
  abnormalAdd,
  abnormalEdit,
  abnormalInfoAdd,
  // addAbnormalTrading,
  addPayment,
  addReceivables,
  abnormalInfoEdit,
  abnormalInfoList,
  abnormalInfoPayList,
  abnormalInfoDetail,
  confirmFinish,
  selectFileList,
  deleteFollowUp,
  deleteAbnormalTrading,
} from '@/services/abnormal';
import { checkLogin } from '@/services/api';
import prompt from '@/components/Prompt';

export default {
  namespace: 'abnormal',

  state: {
    abnormalList: {},
    userList: {},
    detail: {},
    abnormalInfoList: {},
    abnormalInfoPayList: {},
    infoDetail: {},
  },

  effects: {
    *checkLogin({ payload, callback }, { call }) {
      const response = yield call(checkLogin, payload);
      if (response.code === 0) callback(response.data);
    },
    *abnormalList({ payload, callback }, { call, put }) {
      const response = yield call(abnormalList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'list',
          payload: {
            abnormalList: {
              pagination: {
                current: pageNum,
                pageSize,
                total,
              },
              list,
            },
          },
        });
        if (callback) callback(list);
      }
    },

    *userList({ payload }, { call, put }) {
      const response = yield call(userList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'user',
          payload: {
            userList: {
              pagination: {
                current: pageNum,
                pageSize,
                total,
              },
              list,
            },
          },
        });
      }
    },

    *abnormalDetail({ payload, callback }, { call, put }) {
      const response = yield call(abnormalDetail, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            detail: { [payload.id]: response.data },
          },
        });
        // callback && callback(response.data.attachments);
        callback && callback(response.data);
      }
    },
    *selectFileList({ payload, callback }, { call }) {
      const response = yield call(selectFileList, payload);
      if (response.code === 0) {
        callback && callback(response.data);
      }
    },
    *deleteFollowUp({ payload, callback }, { call }) {
      const response = yield call(deleteFollowUp, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback && callback(response.data);
      }
    },
    *deleteAbnormalTrading({ payload, callback }, { call }) {
      const response = yield call(deleteAbnormalTrading, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback && callback(response.data);
      }
    },
    *abnormalInfoDetail({ payload }, { call, put }) {
      const response = yield call(abnormalInfoDetail, payload);
      if (response.code === 0) {
        yield put({
          type: 'infoDetailPut',
          payload: {
            infoDetail: response.data,
          },
        });
      }
    },
    *abnormalInfoList({ payload, callback }, { call, put }) {
      const response = yield call(abnormalInfoList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'info',
          payload: {
            abnormalInfoList: {
              [payload.id]: {
                pagination: {
                  current: pageNum,
                  pageSize,
                  total,
                },
                list,
              },
            },
          },
        });
        if (callback) callback(list);
      }
    },
    *abnormalInfoPayList({ payload, callback }, { call, put }) {
      const response = yield call(abnormalInfoPayList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'infoPay',
          payload: {
            abnormalInfoPayList: {
              [payload.id]: {
                pagination: {
                  current: pageNum,
                  pageSize,
                  total,
                },
                list,
              },
            },
          },
        });
        if (callback) callback(list);
      }
    },
    *abnormalInfoOperate({ payload, callback }, { call }) {
      const response = yield call(abnormalInfoAdd, payload);
      const message = `新增${response.message}`;
      if (response.code === 0) {
        prompt({ content: message });
        if (callback) callback('success');
      }
    },
    *abnormalInfoPayOperate({ payload, callback }, { call }) {
      const response = yield call(payload.type == 'pay' ? addPayment : addReceivables, payload);
      const message = `新增${response.message}`;
      if (response.code === 0) {
        prompt({ content: message });
        if (callback) callback('success');
      }
    },

    *abnormalOperate({ payload, callback }, { call }) {
      const response = yield call(payload.id ? abnormalEdit : abnormalAdd, payload);
      const message = response.message;
      if (response.code === 0) {
        prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    *confirmFinish({ payload, callback }, { call }) {
      const response = yield call(confirmFinish, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        if (callback) callback();
      }
    },
  },

  reducers: {
    infoDetailPut(state, { payload }) {
      return {
        ...state,
        infoDetail: payload.infoDetail,
      };
    },
    list(state, { payload }) {
      return {
        ...state,
        abnormalList: payload.abnormalList,
      };
    },
    user(state, { payload }) {
      return {
        ...state,
        userList: payload.userList,
      };
    },
    info(state, { payload }) {
      return {
        ...state,
        abnormalInfoList: { ...state.abnormalInfoList, ...payload.abnormalInfoList },
      };
    },
    infoPay(state, { payload }) {
      return {
        ...state,
        abnormalInfoPayList: { ...state.abnormalInfoPayList, ...payload.abnormalInfoPayList },
      };
    },
    detail(state, { payload }) {
      return {
        ...state,
        detail: { ...state.detail, ...payload.detail },
      };
    },
  },
};
