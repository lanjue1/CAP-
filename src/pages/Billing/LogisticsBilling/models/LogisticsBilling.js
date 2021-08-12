import prompt from '@/components/Prompt';
import {
  selectBuyBilling,
  abledOperate,
  
} from '@/services/billing/logisticsBilling';

export default {
  namespace: 'LogisticsBilling',
  state: {
    
    receiptList: {}, // list列表
   
    formValues: {},
    
  },
//Effect :Action 处理器，处理异步动作，基于 Redux-saga 实现。
  effects: {
    // 
    // 1、查询 货主信息列表 

    *selectBuyBilling({ payload, callback }, { call, put }) {
      const response = yield call(selectBuyBilling, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          receiptList: {
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
   

    // 3、启用|禁用 货主信息
    *abledOperate({ payload, callback }, { call }) {
      const response = yield call(abledOperate, payload);
      const { code, data, message } = response;
      const content = `${message}`;
      if (code !== 0) {
        callback && callback(response);
        return
      };
      prompt({ content });
      callback && callback(response);
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
