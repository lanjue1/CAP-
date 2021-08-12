import {ableOperate,
  ibplanDetails,
  ibplanList,
  // ibplanOperate,
  fetchWmsPoDetailsList,
  fetchDeliveryDetails,
  insertWmsPoDetail,
  generateAsn
} from '@/services/inbound/ibplan';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'ibplan',

  state: {
    ibplanList: {},
    ibplanDetails: {},
    poDetailsList: {},
    deliveryDetails:{}
  },

  effects: {
    // 仓库管理列表：
    *ibplanList({ payload, callback }, { call, put }) {
      const response = yield call(ibplanList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            ibplanList: {
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
    *ibplanDetails({ payload, callback }, { call, put }) {
      const response = yield call(ibplanDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            ibplanDetails: { [payload.id]: response.data },
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
    *generateAsn({ payload, callback }, { call }) {
      const response = yield call(generateAsn, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback(response);
      }
    },
    // po明细列表
    *fetchWmsPoDetailsList({ payload, callback }, { call, put }) {
      const response = yield call(fetchWmsPoDetailsList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'detailsListShow',
          payload: {
            poDetailsList: {
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
    *insertWmsPoDetail({ payload, callback }, { call, put }) {
      const response = yield call(insertWmsPoDetail, payload);
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
        ibplanList: payload.ibplanList,
      };
    },
    // 明细列表
    detailsListShow(state, { payload }) {
      return {
        ...state,
        poDetailsList: payload.poDetailsList,
      };
    },
    // 详情数据
    detail(state, { payload }) {
      return {
        ...state,
        ibplanDetails: { ...state.ibplanDetails, ...payload.ibplanDetails },
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
