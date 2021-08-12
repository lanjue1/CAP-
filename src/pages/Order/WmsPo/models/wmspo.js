import {
  ableOperate,
  wmspoDetails,
  wmspoList,
  wmspoOperate,
  fetchWmsPoDetailsList,
  fetchDeliveryDetails,
  insertWmsPoDetail,
  updateWmsPoDetail,
  exportPo,
} from '@/services/order/wmspo';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'wmspo',

  state: {
    wmspoList: {},
    wmspoDetails: {},
    poDetailsList: {},
    deliveryDetails: {}
  },

  effects: {
    // 仓库管理列表：
    *wmspoList({ payload, callback }, { call, put }) {
      const response = yield call(wmspoList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            wmspoList: {
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
    // 操作（新增/编辑）
    *wmspoOperate({ payload, callback }, { call }) {
      const response = yield call(wmspoOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    // 详情
    *wmspoDetails({ payload, callback }, { call, put }) {
      const response = yield call(wmspoDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            wmspoDetails: { [payload.id]: response.data },
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
    // po明细列表
    *fetchWmsPoDetailsList({ payload, callback }, { call, put }) {
      const response = yield call(fetchWmsPoDetailsList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'detailsListShow',
          payload: {
            poDetailsList: {
              [payload.poId]: {
                pagination: {
                  current: pageNum,
                  pageSize,
                  total,
                },
                list,
              },
            },
          }
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
    // 编辑po明细：
    *updateWmsPoDetail({ payload, callback }, { call, put }) {
      const response = yield call(updateWmsPoDetail, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response.data);
      }
    },
    *exportPo({ payload, callback }, { call, put }){
      yield call(exportPo, payload)
    },
  },
  reducers: {
    // 列表数据
    show(state, { payload }) {
      return {
        ...state,
        wmspoList: payload.wmspoList,
      };
    },
    // 明细列表
    detailsListShow(state, { payload }) {
      return {
        ...state,
        poDetailsList: {...state.poDetailsList,...payload.poDetailsList},
      };
    },
    // 详情数据
    detail(state, { payload }) {
      return {
        ...state,
        wmspoDetails: { ...state.wmspoDetails, ...payload.wmspoDetails },
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
