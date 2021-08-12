import {
  partRelationExceptionList,
    itemRelationOperate,
    itemRelationDetails,
    itemRelationDelete,
    ableOperate,
  } from '@/services/basicData/partRelationException';
  import { memberExpression } from '@babel/types';
  import Prompt from '@/components/Prompt';
  
  export default {
    namespace: 'partRelationException',
  
    state: {
      partRelationExceptionList: {},
      itemRelationDetails: {},
    },
  
    effects: {
      //替代料关联列表查询：
      *partRelationExceptionList({ payload, callback }, { call, put }) {
        const response = yield call(partRelationExceptionList, payload);
        if (response.code === 0) {
          const { list, pageSize, total, pageNum } = response.data;
          yield put({
            type: 'show',
            payload: {
              partRelationExceptionList: {
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
      *itemRelationOperate({ payload, callback }, { call }) {
        const response = yield call(itemRelationOperate, payload);
        const message = response.message;
        if (response.code === 0) {
          Prompt({ content: message });
          if (callback) callback(response.data);
        }
      },
      //详情
      *itemRelationDetails({ payload, callback }, { call, put }) {
        const response = yield call(itemRelationDetails, payload);
        if (response.code === 0) {
          yield put({
            type: 'detail',
            payload: {
                itemRelationDetails: { [payload.id]: response.data },
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
    //删除
    *itemRelationDelete({ payload, callback }, { call }){
        const response = yield call(itemRelationDelete, payload);
        if (response.code === 0) {
          Prompt({ content: response.message });
          callback(response);
        }
    },
    reducers: {
      //列表数据
      show(state, { payload }) {
        return {
          ...state,
          partRelationExceptionList: payload.partRelationExceptionList,
        };
      },
      //详情数据
      detail(state, { payload }) {
        return {
          ...state,
          itemRelationDetails: { ...state.itemRelationDetails, ...payload.itemRelationDetails },
        };
      },
    },
  };
  