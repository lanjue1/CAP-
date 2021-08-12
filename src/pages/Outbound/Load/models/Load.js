import prompt from '@/components/Prompt';
import {
  selectLoad,
  abledLoad,
  selectLoadDelivery,
  viewLoad,
  operateLoad,
  insertCancelDelivery,
  selectDelivery,
  abledDelivery,
} from '@/services/outbound/load';

export default {
  namespace: 'Load',
  state: {
    loadList: {}, // list列表
    loadDetailList:{},
    loadDetail: {},
    deliveryList:{},
   // archivesDetail: {},
    formValues: {},
    
  },
//Effect :Action 处理器，处理异步动作，基于 Redux-saga 实现。
  effects: {
    // 
    // 1、查询 货主信息列表 

    *selectLoad({ payload, callback }, { call, put }) {
      const response = yield call(selectLoad, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          loadList: {
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
    *selectLoadDelivery({ payload, callback }, { call, put }) {
      const response = yield call(selectLoadDelivery, payload);
      const { code, data } = response;
      if (code !== 0) return;
      console.log('')
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          loadDetailList: {
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
    *selectDelivery({ payload, callback }, { call, put }) {
      const response = yield call(selectDelivery, payload);
      const { code, data } = response;
      if (code !== 0) return;
      console.log('')
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          deliveryList: {
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
    *viewLoad({ payload, callback }, { call, put }) {
      const response = yield call(viewLoad, payload);
      const { code, data } = response;
      if (code !== 0) return;
      let newData = data;
      
      yield put({
        type: 'detail',
        payload: { loadDetail: { [payload.id]: newData } },
      });
      callback && callback(newData);
    },


    // 3、启用|禁用 货主信息
    *abledLoad({ payload, callback }, { call }) {
      const response = yield call(abledLoad, payload);
      const { code, data, message } = response;
      const content = `${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(response);
    },

    // 4、新增 货主信息  操作：新增、编辑 archivesOperate
    *operateLoad({ payload, callback }, { call }) {
      const response = yield call(operateLoad, payload);
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
        prompt({ content:'Success' });
        callback(response)
      }
    },
    *abledDelivery({ payload, callback }, { call }){
      const response = yield call(abledDelivery, payload);
      const { code, data, message } = response;
      if (code === 0){
        prompt({ content:'Success' });
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
