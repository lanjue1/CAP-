import prompt from '@/components/Prompt';
import {
  selectPacking,
  abledLoad,
  selectCarton,
  viewLoad,
  operateLoad,
  insertCancelDelivery,
  selectDelivery,
  abledDelivery,
  selectDeliveryQty,
  
} from '@/services/outbound/packing';

export default {
  namespace: 'Packing',
  state: {
    packingList: {}, // list列表
    cartonList:{},
    loadDetail: {},
    deliveryList:{},
   // archivesDetail: {},
    formValues: {},
    qtyDelivery:{},
  },
//Effect :Action 处理器，处理异步动作，基于 Redux-saga 实现。
  effects: {
    // 
    *selectDeliveryQty({ payload, callback }, { call, put }){
      const response = yield call(selectDeliveryQty, payload);
      const { code, data } = response;
      if (code !== 0) return;
      yield put({
        type:'saveAllValus',
        payload:{qtyDelivery:data}
      })
      callback && callback(data);
    },
    // 1、查询 货主信息列表 

    *selectPacking({ payload, callback }, { call, put }) {
      const response = yield call(selectPacking, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          packingList: {
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
    *selectCarton({ payload, callback }, { call, put }) {
      const response = yield call(selectCarton, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'detail',
        payload: {
          cartonList: {[payload.loadingListId]:data},
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
        type: 'detail',
        payload: {
          deliveryList: {[payload.id]:data},
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
      callback && callback(data);
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
