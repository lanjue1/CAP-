import {
  asnList,
  asnDetails,
  ableOperate,
  fetchAsnDetailsList,
  fetchDeliveryDetails,
  receiveWmsAsnDetails,
  fetchDelivery,
  generateWmsMoveDoc,
  asnReceiveConfirm,
  asnCancel,
  saveShipmentArrivalTime
} from '@/services/inbound/asn';
import { memberExpression } from '@babel/types';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'asn',

  state: {
    asnList: {},
    asnDetails: {},
    asnDetailsList: {},
    deliveryDetails: {},
    delivery: {}
  },

  effects: {
    // ASN管理列表：
    *asnList({ payload, callback }, { call, put }) {
      const response = yield call(asnList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            asnList: {
              pagination: {
                current: pageNum,
                pageSize,
                total,
              },
              list
            },
          },
        });
        callback && callback(list);
      }
    },
    // ASN操作（新增/编辑）
    *warehouseOperate({ payload, callback }, { call }) {
      const response = yield call(warehouseOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    // ASN详情
    *asnDetails({ payload, callback }, { call, put }) {
      const response = yield call(asnDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            asnDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    // ASN确定录入/取消录入
    *ableOperate({ payload, callback }, { call }) {
      const response = yield call(ableOperate, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },

    // ASN详情管理列表：
    *fetchAsnDetailsList({ payload, callback }, { call, put }) {
      const response = yield call(fetchAsnDetailsList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'detailsShow',
          payload: {
            asnDetailsList: {[payload.asnId]: response.data},
          },
        });
        callback && callback(list);
      }
    },
    // 收货详情：
    *fetchDeliveryDetails({ payload, callback }, { call, put }) {
      const response = yield call(fetchDeliveryDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'deliveryDetailShow',
          payload: {
            deliveryDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    // 收货登记
    *receiveWmsAsnDetails({ payload, callback }, { call }) {
      const response = yield call(receiveWmsAsnDetails, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
    // 明细详情
    *fetchDelivery({ payload, callback }, { call, put }) {
      const response = yield call(fetchDelivery, payload);
      if (response.code === 0) {
        yield put({
          type: 'deliveryShow',
          payload: {
            delivery: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    // 生成上架单
    *generateWmsMoveDoc({ payload, callback }, { call }) {
      const response = yield call(generateWmsMoveDoc, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
     // 收货入账
     *asnReceiveConfirm({ payload, callback }, { call }) {
      const response = yield call(asnReceiveConfirm, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
    *asnCancel({ payload, callback }, { call }) {
      const response = yield call(asnCancel, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
    *saveShipmentArrivalTime({ payload, callback }, { call }) {
      const response = yield call(saveShipmentArrivalTime, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
  },
  reducers: {
    // ASN列表数据
    show(state, { payload }) {
      return {
        ...state,
        asnList: payload.asnList,
      };
    },
    // ASN详情数据
    detail(state, { payload }) {
      return {
        ...state,
        asnDetails: { ...state.asnDetails, ...payload.asnDetails },
      };
    },
    // 收货明细详情数据
    deliveryDetailShow(state, { payload }) {
      return {
        ...state,
        deliveryDetails: { ...state.deliveryDetails, ...payload.deliveryDetails },
      };
    },
    // ASN详情列表数据
    detailsShow(state, { payload }) {
      return {
        ...state,
        asnDetailsList: { ...state.asnDetailsList, ...payload.asnDetailsList },

      };
    },
    deliveryShow(state, { payload }) {
      return {
        ...state,
        delivery: { ...state.delivery, ...payload.delivery },
      };
    },
  },
};
