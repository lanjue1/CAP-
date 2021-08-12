import {ableOperate,
  obplanDetails,
  obplanList,
  // obplanOperate,
  fetchWmsCoDetailsList,
  fetchDeliveryDetails,
  insertWmsCoDetail,
  generateShipping} from '@/services/outbound/obplan';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'obplan',

  state: {
    obplanList: {},
    obplanDetails: {},
    coDetailsList: {},
    deliveryDetails:{}
  },

  effects: {

    *obplanList({ payload, callback }, { call, put }) {
      const response = yield call(obplanList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            obplanList: {
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
    // 详情
    *obplanDetails({ payload, callback }, { call, put }) {
      const response = yield call(obplanDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            obplanDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    // 启用禁用
    *ableOperate({ payload, callback }, { call }) {
      const response = yield call(ableOperate, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback(response);
      }
    },

    // 生成ASN
    *generateShipping({ payload, callback }, { call }) {
      const response = yield call(generateShipping, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback(response);
      }
    },
    // po明细列表
    *fetchWmsCoDetailsList({ payload, callback }, { call, put }) {
      const response = yield call(fetchWmsCoDetailsList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'detailsListShow',
          payload: {
            coDetailsList: {
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
    // po明细详情：
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
    // 新增po明细：
    *insertWmsCoDetail({ payload, callback }, { call, put }) {
      const response = yield call(insertWmsCoDetail, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response.data);
      }
    },
  },
  reducers: {
    // 列表数据
    show(state, { payload }) {
      return {
        ...state,
        obplanList: payload.obplanList,
      };
    },
    // 明细列表
    detailsListShow(state, { payload }) {
      return {
        ...state,
        coDetailsList: payload.coDetailsList,
      };
    },
    // 详情数据
    detail(state, { payload }) {
      return {
        ...state,
        obplanDetails: { ...state.obplanDetails, ...payload.obplanDetails },
      };
    },
    // 明细详情数据
    deliveryDetailShow(state, { payload }) {
      return {
        ...state,
        deliveryDetails: { ...state.deliveryDetails, ...payload.deliveryDetails },
      };
    },
  },
};
