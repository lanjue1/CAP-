import {
  wmsItemTypeList,
  wmsItemTypeOperate,
  wmsItemTypeDetails,
  ableOperate,
} from '@/services/basicData/wmsItemType';
import { memberExpression } from '@babel/types';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'wmsItemType',

  state: {
    wmsItemTypeList: {},
    wmsItemTypeDetails: {},
  },

  effects: {
    //仓库管理列表：
    *wmsItemTypeList({ payload, callback }, { call, put }) {
      const response = yield call(wmsItemTypeList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            wmsItemTypeList: {
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
    //操作（新增/编辑）
    *wmsItemTypeOperate({ payload, callback }, { call }) {
      const response = yield call(wmsItemTypeOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    //详情
    *wmsItemTypeDetails({ payload, callback }, { call, put }) {
      const response = yield call(wmsItemTypeDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            wmsItemTypeDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    //启用禁用
    *ableOperate({ payload, callback }, { call }) {
      const response = yield call(ableOperate, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback(response);
      }
    },
  },
  reducers: {
    //列表数据
    show(state, { payload }) {
      return {
        ...state,
        wmsItemTypeList: payload.wmsItemTypeList,
      };
    },
    //详情数据
    detail(state, { payload }) {
      return {
        ...state,
        wmsItemTypeDetails: { ...state.wmsItemTypeDetails, ...payload.wmsItemTypeDetails },
      };
    },
  },
};
