import {
  biConfigList,
  biConfigOperate,
  viewBiConfigDetails,
  deleteBiConfig
} from '@/services/system/biconfig';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'biconfigs',

  state: {
    biconfigLists: {},
    biconfigDetails: {}
  },

  effects: {
    //  查询BI报表配置表列表
    *selectBiConfigList({ payload, callback }, { call, put }) {
      const response = yield call(biConfigList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        list.forEach((item) => {
          item.beGlobal = String(item.beGlobal)
        })
        yield put({
          type: 'show',
          payload: {
            biconfigLists: {
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
    *biConfigOperate({ payload, callback }, { call }) {
      const response = yield call(biConfigOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    // 详情
    *viewBiConfigDetails({ payload, callback }, { call, put }) {
      const response = yield call(viewBiConfigDetails, payload);

      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            biconfigDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    //删除bi配置
    *deleteOperate({ payload, callback }, { call }) {
      const response = yield call(deleteBiConfig, payload);
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
        biconfigLists: payload.biconfigLists,
      };
    },
    // 详情数据
    detail(state, { payload }) {
      return {
        ...state,
        biconfigDetails: { ...state.biconfigDetails, ...payload.biconfigDetails },
      };
    },
  },
};


