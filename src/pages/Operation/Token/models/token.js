import {
  tokenList,
  tokenOperate,
  ableOperate
} from '@/services/operation/token';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'token',

  state: {
    tokenList: {},
  },

  effects: {
    // 盘点管理列表：
    *tokenList({ payload, callback }, { call, put }) {
      const response = yield call(tokenList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            tokenList: {
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

    
    // token操作
    *tokenOperate({ payload, callback }, { call }) {
      const response = yield call(tokenOperate, payload);
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


  },
  reducers: {
    // 列表数据
    show(state, { payload }) {
      return {
        ...state,
        tokenList: payload.tokenList,
      };
    },
  },
};

