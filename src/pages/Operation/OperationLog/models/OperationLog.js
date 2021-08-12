import prompt from '@/components/Prompt';
import {
  selectList,
  abledOperate,
  
} from '@/services/operation/operationLog';

export default {
  namespace: 'OperationLog',
  state: {
    
    selectList: {}, // list列表
   
    formValues: {},
    
  },
//Effect :Action 处理器，处理异步动作，基于 Redux-saga 实现。
  effects: {
    // 
    // 1、查询 货主信息列表 

    *selectList({ payload, callback }, { call, put }) {
      const response = yield call(selectList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          selectList: {
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
    },
   

    // 3、启用|禁用 货主信息
    *abledOperate({ payload, callback }, { call }) {
      const response = yield call(abledOperate, payload);
      const { code, data, message } = response;
      const content = `${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(response);
    },

  

    

  },

  //Reducer 是 Action 处理器，用来处理同步操作，
  reducers: {
    //设置表单参数
    saveAllValus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    
    detail(state, { payload }) {
      let param = '';
      for (let k in payload) {
        param = k;
      }
      return {
        ...state,
        [param]: { ...state[param], ...payload[param] },
      };
    },
  },
};
