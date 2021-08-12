import prompt from '@/components/Prompt';
import {
  selectDelivery,
  viewDelivery,
  viewDeliveryDetail,
  cancelDelivery,
  selectDeliverySerial,
  selectDeliveryDetail,
  abledDelivery,
} from '@/services/outbound/delivery';

export default {
  namespace: 'Delivery',
  state: {
    deliveryList: {}, // list列表
    deliverySerial:[], //serial数据
    deliveryDetailList:{}, //detaillist数据
    deliveryDetail: {},
    
    formValues: {},

  },
  //Effect :Action 处理器，处理异步动作，基于 Redux-saga 实现。
  effects: {
    // 
    // 1、查询 出库单列表 

    *selectDelivery({ payload, callback }, { call, put }) {
      const response = yield call(selectDelivery, payload);
      const { code, data } = response;
      if (code !== 0) return;
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
    // 2、查询详情 出库单
    *viewDelivery({ payload, callback }, { call, put }) {
      const response = yield call(viewDelivery, payload);
      const { code, data } = response;
      if (code !== 0) return;
      let newData = data;

      yield put({
        type: 'detail',
        payload: { deliveryDetail: { [payload.id]: newData } },
      });
      callback && callback(newData);
    },
    
    // 2.2、查询序列号详情  出库单
    *selectDeliverySerial({ payload, callback }, { call, put }) {
      const response = yield call(selectDeliverySerial, payload);
      const { code, data } = response;
      if (code !== 0) return;

      // const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          deliverySerial:data
        },
      });
      callback && callback(data);
    },
    //  2.1、查询出库单详情  明细列表

    *selectDeliveryDetail({ payload, callback }, { call, put }) {
      const response = yield call(selectDeliveryDetail, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'detail',
        payload: {
          deliveryDetailList: {[payload.deliveryId]:data },
        },
      });
      callback && callback(data);
    },

   //取消出库 cancelDelivery
   *cancelDelivery({payload},{call}){
    const response = yield call(cancelDelivery,payload)
    const {code,data,message}=response
    if(code!==0) return
    prompt({content:message})
   },
   // signDelivery
   *abledDelivery({payload,callback},{call}){
    const response = yield call(abledDelivery,payload)
    const {code,data,message}=response
    if(code!==0) return
    prompt({content:message})
    callback(response)
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
