import {
  shippingList,
  shippingDetails,
  ableOperate,
  fetchShippingDetailsList,
  fetchDeliveryDetails,
  fetchDelivery,
  generateWmsMoveDoc,
  createDelivery,
  createReceipt
} from '@/services/outbound/shipping';
import { memberExpression } from '@babel/types';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'shipping',

  state: {
    shippingList: {},
    shippingDetails: {},
    shippingDetailsList: {},
    deliveryDetails: {},
    delivery: {}
  },

  effects: {
    // ASN管理列表：
    *shippingList({ payload, callback }, { call, put }) {
      const response = yield call(shippingList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            shippingList: {
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

    // Shipping 详情
    *shippingDetails({ payload, callback }, { call, put }) {
      const response = yield call(shippingDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            shippingDetails: { [payload.id]: response.data },
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

    // shipping详情管理列表：
    *fetchShippingDetailsList({ payload, callback }, { call, put }) {
      const response = yield call(fetchShippingDetailsList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'detailsShow',
          payload: {
            shippingDetailsList: {
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
    *createDelivery({ payload, callback }, { call }){
      const response = yield call(createDelivery, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
    *createReceipt({ payload, callback }, { call }){
      const response = yield call(createReceipt, payload);
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
        shippingList: payload.shippingList,
      };
    },
    // ASN详情数据
    detail(state, { payload }) {
      return {
        ...state,
        shippingDetails: { ...state.shippingDetails, ...payload.shippingDetails },
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
        shippingDetailsList: { ...state.shippingDetailsList, ...payload.shippingDetailsList },
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

