import {
  iqcList,
  asnDetails,
  ableOperate,
  fetchAsnDetailsList,
  visibleList,
  reviewQualityConfirm,
  importIQC,
  exportIQC,
  qualityDocCheck,
  logicQualityResult,
  logicQualityConfirm
} from '@/services/rms/iqc';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'iqc',

  state: {
    iqcList: {},
    asnDetails: {},
    iqcDetailsList: {},
    visibleIQCList: {},
    deliveryDetails: {},
    delivery: {}
  },

  effects: {
    // ASN管理列表：
    *iqcList({ payload, callback }, { call, put }) {
      const response = yield call(iqcList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            iqcList: {
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
    // IQC操作
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
        yield put({
          type: 'detailsShow',
          payload: {
            iqcDetailsList: {
              [payload.id]: {
                list: response.data
              },
            }
          },
        });
        callback && callback(list);
      }
    },
    // IQC 质检审核弹框数据
    *visibleList({ payload, callback }, { call, put }) {
      const response = yield call(visibleList, payload);
      if (response.code === 0) {
        // const {  pageSize, total, pageNum } = response.data;
        yield put({
          type: 'all',
          payload: {
            visibleIQCList: response.data,
          },
        });
        callback && callback(response.data);
      }
    },
    //IQC 质检审核弹框确认
    *reviewQualityConfirm({ payload, callback }, { call, put }) {
      const response = yield call(reviewQualityConfirm, payload)
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
    //导入
    *importIQC({ payload, callback }, { call, put }) {
      const response = yield call(importIQC, payload)
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
    //导出
    *exportIQC({ payload, callback }, { call, put }) {
      yield call(exportIQC, payload)
    },


    // iqcTask 存储信息
    *qualityDocCheck({ payload, callback, finallyFn }, { call, put }) {
      const response = yield call(qualityDocCheck, payload);
      if (response.code === 0) {
        callback && callback(response.data);
      }
      finallyFn && finallyFn()
    },
    // iqcTask 计算
    *logicQualityResult({ payload, callback, finallyFn }, { call, put }) {
      const response = yield call(logicQualityResult, payload);
      if (response.code === 0) {
        callback && callback(response.data);
      }
      finallyFn && finallyFn()
    },
    // iqcTask 确定
    *logicQualityConfirm({ payload, callback, finallyFn }, { call, put }) {
      const response = yield call(logicQualityConfirm, payload);
      if (response.code === 0) {
        callback && callback(response.data);
      }
      finallyFn && finallyFn()
    },
  },
  reducers: {
    all(state, { payload }) {
      // console.log('payload.visibleIQCList--',payload.visibleIQCList)
      return {
        ...state,
        visibleIQCList: payload.visibleIQCList,
      }

    },
    // ASN列表数据
    show(state, { payload }) {
      return {
        ...state,
        iqcList: payload.iqcList,
      };
    },
    // ASN详情数据
    detail(state, { payload }) {
      return {
        ...state,
        asnDetails: { ...state.asnDetails, ...payload.asnDetails },
      };
    },
    // ASN详情列表数据
    detailsShow(state, { payload }) {
      return {
        ...state,
        iqcDetailsList: { ...state.iqcDetailsList, ...payload.iqcDetailsList },
      };
    },
  },
};

