import prompt from '@/components/Prompt';
import {
  selectInventory,
  stockMoveConfim,
  viewInventory,
  abledStatus,
  viewInventoryDetail,
} from '@/services/operation/Inventory';

export default {
  namespace: 'Inventory',
  state: {
    inventoryList: {}, // list列表

    inventoryDetail: {},
    formValues: {},
    
  },
//Effect :Action 处理器，处理异步动作，基于 Redux-saga 实现。
  effects: {
    // 
    // 1、查询 货主信息列表 

    *selectInventory({ payload, callback }, { call, put }) {
      const response = yield call(selectInventory, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          inventoryList: {
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
    *viewMoveTask({ payload, callback }, { call, put }) {
      const response = yield call(viewMoveTask, payload);
      const { code, data } = response;
      if (code !== 0) return;
      let newData = data;
      
      yield put({
        type: 'detail',
        payload: { moveTaskDetail: { [payload.id]: newData } },
      });
      callback && callback(newData);
    },
  *viewInventoryDetail({ payload, callback }, { call, put }){
    const response = yield call(viewInventoryDetail, payload);
    const { code, data } = response;
    if (code !== 0) return;
    let newData = data;
    yield put({
      type: 'detail',
      payload: { inventoryDetail: { [payload.id]: newData } },
    });
    callback && callback(newData);
  },
  //3.stockMOve
  *stockMoveConfim({payload,callback},{call,put}){
     const response=yield call(stockMoveConfim,payload)
     const { code, data,message } = response;
      if (code !== 0) return;
      prompt({content:message})
      callback && callback(response);
  },
  *abledStatus({payload,callback},{call,put}){
    const response=yield call(abledStatus,payload)
    const { code, data,message } = response;
     if (code !== 0) return;
     prompt({content:message})
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
