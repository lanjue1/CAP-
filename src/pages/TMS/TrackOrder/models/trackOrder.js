import {
  ableOperate,
  trackOrderDetails,
  trackOrderList,
  wmspoOperate,
  fetchTrackList,
  fetchTrackDetails,
  insertTrackOrder,
  updateTrackOrder,
  exportPo,
  deleteTrack
} from '@/services/tms/trackOrder';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'trackOrder',
  state: {
    trackOrderList: {},
    trackOrderDetails: {},
    TrackList: {},
    deliveryDetails: {}
  },

  effects: {
    // 仓库管理列表：
    *trackOrderList({ payload, callback }, { call, put }) {
      const response = yield call(trackOrderList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            trackOrderList: {
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
    *trackOrderDetails({ payload, callback }, { call, put }) {
      const response = yield call(trackOrderDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            trackOrderDetails: { [payload.id]: response.data },
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
    *fetchTrackList({ payload, callback }, { call, put }) {
      const response = yield call(fetchTrackList, payload);
      console.log('response', response)
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'detailsListShow',
          payload: {
            TrackList: {
              [payload.orderId]: {
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
    *fetchTrackDetails({ payload, callback }, { call, put }) {
      const response = yield call(fetchTrackDetails, payload);
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
    *insertTrackOrder({ payload, callback }, { call, put }) {
      const response = yield call(insertTrackOrder, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response.data);
      }
    },
    // 编辑po明细：
    *updateTrackOrder({ payload, callback }, { call, put }) {
      const response = yield call(updateTrackOrder, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response.data);
      }
    },
    *deleteTrack({ payload, callback }, { call, put }) {
      const response = yield call(deleteTrack, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response.data);
      }
    },
    * exportPo({ payload, callback }, { call, put }) {
      yield call(exportPo, payload)
    },
  },
  reducers: {
    // 列表数据
    show(state, { payload }) {
      return {
        ...state,
        trackOrderList: payload.trackOrderList,
      };
    },
    // 明细列表
    detailsListShow(state, { payload }) {
      return {
        ...state,
        TrackList: { ...state.TrackList, ...payload.TrackList },
      };
    },
    // 详情数据
    detail(state, { payload }) {
      return {
        ...state,
        trackOrderDetails: { ...state.trackOrderDetails, ...payload.trackOrderDetails },
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
