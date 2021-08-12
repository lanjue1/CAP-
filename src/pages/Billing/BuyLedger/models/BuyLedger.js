import prompt from '@/components/Prompt';
import {
  selectChargeDetail,
  selectBuyLedgerDetailList,
  selectBillinglList,
  abledStatus,
  viewChargeDetail,
  exportUrl
} from '@/services/billing/buyLedger';

export default {
  namespace: 'BuyLedger',
  state: {
    
    chargeDetailList: {}, // list列表
    buyLedgerDetailList:{},//detailList列表
    billinglList:{},
    loadDetailList:{},
    chargeDetailDetail: {},
   // archivesDetail: {},
    formValues: {},
    statusList:{},
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
    *selectBuyLedgerDetailList({ payload, callback }, { call, put }) {
      const response = yield call(selectBuyLedgerDetailList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      if(payload.status){
        yield put({
          type: 'saveAllValus',
          payload: {
            statusList: {
              pagination: {
                current: pageNum,
                pageSize,
                total,
              },
              list,
            },
          },
        });
      }else{
        yield put({
          type: 'saveAllValus',
          payload: {
            buyLedgerDetailList: {
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
      callback && callback(list);
    },
    *selectBillinglList({ payload, callback }, { call, put }) {
      const response = yield call(selectBillinglList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          billinglList: {
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
      if (code !== 0) {
        callback && callback(response);
        return
      };
      payload.type!=='statusNum'&& prompt({ content });
      callback && callback(response);
    },
    *exportUrl({ payload, callback }, { call, put }){
      yield call(exportUrl, payload)
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
