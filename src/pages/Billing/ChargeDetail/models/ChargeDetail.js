import prompt from '@/components/Prompt';
import {
  selectChargeDetail,
  abledStatus,
  viewChargeDetail,
  operateChargeDetail,
  insertCancelDelivery,
} from '@/services/billing/chargeDetail';

export default {
  namespace: 'ChargeDetail',
  state: {
    
    chargeDetailList: {}, // list列表
    loadDetailList:{},
    chargeDetailDetail: {},
   // archivesDetail: {},
    formValues: {},
    
  },
//Effect :Action 处理器，处理异步动作，基于 Redux-saga 实现。
  effects: {
    // 
    // 1、查询 货主信息列表 

    *selectChargeDetail({ payload, callback }, { call, put }) {
      const response = yield call(selectChargeDetail, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          chargeDetailList: {
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
    
    // 2、查询详情 货主信息
    *viewChargeDetail({ payload, callback }, { call, put }) {
      const response = yield call(viewChargeDetail, payload);
      const { code, data } = response;
      if (code !== 0) return;
      let newData = data;
      
      yield put({
        type: 'detail',
        payload: { chargeDetailDetail: { [payload.id]: newData } },
      });
      callback && callback(newData);
    },


    // 3、启用|禁用 货主信息
    *abledStatus({ payload, callback }, { call }) {
      const response = yield call(abledStatus, payload);
      const { code, data, message } = response;
      const content = `${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(response);
    },

    // 4、新增 货主信息  操作：新增、编辑 archivesOperate
    *operateChargeDetail({ payload, callback }, { call }) {
      const response = yield call(operateChargeDetail, payload);
      const { code, data, message } = response;
      const content = payload.id ? `编辑${message}` : `新增${message}`;
      if (code !== 0) return;
      if (payload.operateType == 'save') {
        prompt({ content });
      }
      callback && callback(data);
    },
    *insertCancelDelivery({ payload, callback }, { call }){
      const response = yield call(insertCancelDelivery, payload);
      const { code, data, message } = response;
      if (code === 0){
        prompt({ content:message });
        callback(response)
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


    *selectFileList({ payload, callback }, { call }) {
      const response = yield call(selectFileList, payload);
      const { code, message, data } = response;
      if (code === 0) {
        if (callback) callback(data);
      }
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
