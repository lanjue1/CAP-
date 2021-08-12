import prompt from '@/components/Prompt';
import {
  selectBillingLog,
  fetchBillingDetails
} from '@/services/billing/billingLog';

export default {
  namespace: 'billingLog',
  state: {
    billingLogList: {}, // list列表
    billingDetails: {},
    formValues: {},
  },
  //Effect :Action 处理器，处理异步动作，基于 Redux-saga 实现。
  effects: {
    // 结算日志
    *selectBillingLog({ payload, callback }, { call, put }) {
      const response = yield call(selectBillingLog, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          billingLogList: {
            pagination: {
              current: pageNum,
              pageSize,
              total,
            },
            list,
          },
        },
      });
      callback && callback(list);
    },

    // 结算详情
    *fetchBillingDetails({ payload, callback }, { call, put }) {
      const response = yield call(fetchBillingDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            billingDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    /**
     * 设置表单参数
     */
    *allValus({ payload }, { _, put }) {
      yield put({
        type: 'saveAllValus',
        payload,
      });
    },

  },

  //Reducer 是 Action 处理器，用来处理同步操作，
  reducers: {
    //设置表单参数
    saveAllValus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    oilCard(state, { payload }) {
      return {
        ...state,
        oilCardList: payload.oilCardList,
      };
    },
    detail(state, { payload }) {
      let param = '';
      for (let k in payload) {
        param = k;
      }
      return {
        ...state,
        [param]: { ...state[param], ...payload[param] },
      };
    },
  },
};
