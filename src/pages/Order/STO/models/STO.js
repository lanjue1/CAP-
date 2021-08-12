import {
  ableOperate,
  wmscoDetails,
  wmscoList,
  wmscoOperate,
  fetchWmsCoDetailsList,
  fetchDeliveryDetails,
  insertWmsCoDetail,
  updateWmsCoDetail,
  lockingInventory,
  generateShipping,
  cancelDetail,
  cancelSTO
} from '@/services/order/sto';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'sto',

  state: {
    wmscoList: {},
    wmscoDetails: {},
    coDetailsList: {},
    deliveryDetails: {}
  },

  effects: {
    // 仓库管理列表：
    *wmscoList({ payload, callback }, { call, put }) {
      const response = yield call(wmscoList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            wmscoList: {
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
    *wmscoOperate({ payload, callback }, { call }) {
      const response = yield call(wmscoOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    // 详情
    *wmscoDetails({ payload, callback }, { call, put }) {
      const response = yield call(wmscoDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            wmscoDetails: { [payload.id]: response.data },
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
    *fetchWmsCoDetailsList({ payload, callback }, { call, put }) {
      const response = yield call(fetchWmsCoDetailsList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'detailsListShow',
          payload: {
            coDetailsList: {
              [payload.coId]: {
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
    *insertWmsCoDetail({ payload, callback }, { call, put }) {
      const response = yield call(insertWmsCoDetail, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response.data);
      }
    },
    // 编辑po明细：
    *updateWmsCoDetail({ payload, callback }, { call, put }) {
      const response = yield call(updateWmsCoDetail, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response.data);
      }
    },
    //lockingInventory 锁定按钮
    *lockingInventory({ payload, callback }, { call, put }) {
      const response = yield call(lockingInventory, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response.data);
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
    *cancelDetail({ payload, callback }, { call }){
      const response = yield call(cancelDetail, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback(response);
      }
    },
    *cancelSTO({ payload, callback }, { call }){
      const response = yield call(cancelSTO, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback(response);
      }
    },
  },
  reducers: {
    // 列表数据
    show(state, { payload }) {
      return {
        ...state,
        wmscoList: payload.wmscoList,
      };
    },
    // 明细列表
    detailsListShow(state, { payload }) {
      return {
        ...state,
        coDetailsList: { ...state.coDetailsList, ...payload.coDetailsList },
      };
    },
    // 详情数据
    detail(state, { payload }) {
      return {
        ...state,
        wmscoDetails: { ...state.wmscoDetails, ...payload.wmscoDetails },
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
