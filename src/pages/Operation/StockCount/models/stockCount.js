import {
  stockCountList,
  stockCountDetails,
  stockCountOperate,
  fetchstockCountDetailsList,
  selectWmsCountPlanInfo,
  insertWmsCountDetail,
  ableOperate
} from '@/services/operation/stockCount';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'stockCount',

  state: {
    stockCountList: {},
    stockCountDetails: {},
    stockCountDetailsList: {},
    visiblestockCountList: {},
    deliveryDetails: {},
    countPlanInfo: {}
  },

  effects: {
    // 盘点管理列表：
    *stockCountList({ payload, callback }, { call, put }) {
      const response = yield call(stockCountList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            stockCountList: {
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
    // 详情
    *stockCountDetails({ payload, callback }, { call, put }) {
      const response = yield call(stockCountDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            stockCountDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    // 详情
    *selectWmsCountPlanInfo({ payload, callback }, { call, put }) {
      const response = yield call(selectWmsCountPlanInfo, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'detailList',
          payload: {
            countPlanInfo: {
              pagination: {
                current: pageNum,
                pageSize,
                total,
              },
              list
            },
          },
        });
        callback && callback(response.data);
      }
    },
    // stockCount操作
    *stockCountOperate({ payload, callback }, { call }) {
      const response = yield call(stockCountOperate, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
    *insertWmsCountDetail({ payload, callback }, { call }) {
      const response = yield call(insertWmsCountDetail, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
    *ableOperate({ payload, callback }, { call }) {
      const response = yield call(ableOperate, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },

    *fetchstockCountDetailsList({ payload, callback }, { call, put }) {
      const response = yield call(fetchstockCountDetailsList, payload);
      if (response.code === 0) {
        yield put({
          type: 'detailsShow',
          payload: {
            stockCountDetailsList: {
              [payload.countPlanId]: {
                list: response.data.list
              },
            }
          },
        });
        callback && callback(list);
      }
    },

  },
  reducers: {
    all(state, { payload }) {
      // console.log('payload.visiblestockCountList--',payload.visiblestockCountList)
      return {
        ...state,
        visiblestockCountList: payload.visiblestockCountList,
      }

    },
    // ASN列表数据
    show(state, { payload }) {
      return {
        ...state,
        stockCountList: payload.stockCountList,
      };
    },
    // ASN详情数据
    detail(state, { payload }) {
      return {
        ...state,
        stockCountDetails: { ...state.stockCountDetails, ...payload.stockCountDetails },
      };
    },
    detailList(state, { payload }) {
      return {
        ...state,
        countPlanInfo: { ...state.countPlanInfo, ...payload.countPlanInfo },
      };
    },
    // ASN详情列表数据
    detailsShow(state, { payload }) {
      return {
        ...state,
        stockCountDetailsList: { ...state.stockCountDetailsList, ...payload.stockCountDetailsList },
      };
    },
  },
};

