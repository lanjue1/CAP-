import {
  selectPendingReceiving,
  selectPendingPutaway,
  selectPutaway,
  selectOutbound,
  selectTotalOrder,
  selectUnpickedOrder,
  selectCurrentInventory,
  dataList
} from '@/services/home/home';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'home',

  state: {
    pendingReceivingList: {},
    pendingPutawayList: {},
    putawayList: {},
    outboundList: {},
    totalOrderList: {},
    unpickedOrderList: {},
    currentInventorys: 0,
    dataList:{},
  },

  effects: {
    *dataList({ payload, callback }, { call, put }) {
      const response = yield call(dataList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            dataList: {
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
      }
    },
    // PendingReceiving
    *selectPendingReceiving({ payload, callback }, { call, put }) {
      const response = yield call(selectPendingReceiving, payload);
      if (response.code === 0) {
        yield put({
          type: 'pendingReceiving',
          payload: {
            pendingReceivingList: response.data
          },
        });
        callback && callback(list);
      }
    },
    // PendingPutaway
    *selectPendingPutaway({ payload, callback }, { call, put }) {
      const response = yield call(selectPendingPutaway, payload);
      if (response.code === 0) {
        yield put({
          type: 'pendingPutaway',
          payload: {
            pendingPutawayList: response.data
          },
        });
        callback && callback(list);
      }
    },
    // putaway
    *selectPutaway({ payload, callback }, { call, put }) {
      const response = yield call(selectPutaway, payload);
      if (response.code === 0) {
        yield put({
          type: 'putaway',
          payload: {
            putawayList: response.data
          },
        });
        callback && callback(list);
      }
    },
    // outbound
    *selectOutbound({ payload, callback }, { call, put }) {
      const response = yield call(selectOutbound, payload);
      if (response.code === 0) {
        yield put({
          type: 'outbound',
          payload: {
            outboundList: response.data
          },
        });
        callback && callback(list);
      }
    },
    // totalOrder
    *selectTotalOrder({ payload, callback }, { call, put }) {
      const response = yield call(selectTotalOrder, payload);
      if (response.code === 0) {
        yield put({
          type: 'totalOrder',
          payload: {
            totalOrderList: response.data
          },
        });
        callback && callback(list);
      }
    },
    // UnpickedOrder
    *selectUnpickedOrder({ payload, callback }, { call, put }) {
      const response = yield call(selectUnpickedOrder, payload);
      if (response.code === 0) {
        yield put({
          type: 'unpickedOrder',
          payload: {
            unpickedOrderList: response.data
          },
        });
        callback && callback(list);
      }
    },
    // CurrentInventory
    *selectCurrentInventory({ payload, callback }, { call, put }) {
      const response = yield call(selectCurrentInventory, payload);
      if (response.code === 0) {
        yield put({
          type: 'currentInventory',
          payload: {
            currentInventorys: response.data
          },
        });
        callback && callback(list);
      }
    },

    
  },
  reducers: {
    // 列表数据
    show(state, { payload }) {
      return {
        ...state,
        dataList: payload.dataList,
      };
    },
    // PendingReceiving
    pendingReceiving(state, { payload }) {
      return {
        ...state,
        pendingReceivingList: payload.pendingReceivingList,
      };
    },
    // pendingPutaway
    pendingPutaway(state, { payload }) {
      return {
        ...state,
        pendingPutawayList: payload.pendingPutawayList,
      };
    },
    // putaway
    putaway(state, { payload }) {
      return {
        ...state,
        putawayList: payload.putawayList,
      };
    },
    // outbound
    outbound(state, { payload }) {
      return {
        ...state,
        outboundList: payload.outboundList,
      };
    },
    // totalOrder
    totalOrder(state, { payload }) {
      return {
        ...state,
        totalOrderList: payload.totalOrderList,
      };
    },
    // unpickedOrder
    unpickedOrder(state, { payload }) {
      return {
        ...state,
        unpickedOrderList: payload.unpickedOrderList,
      };
    },
    // currentInventory
    currentInventory(state, { payload }) {
      return {
        ...state,
        currentInventorys: payload.currentInventorys,
      };
    },
  },
};

