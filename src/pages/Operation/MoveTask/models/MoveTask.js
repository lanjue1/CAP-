import prompt from '@/components/Prompt';
import {
  selectMoveTask,
 
  confirmMoveTask,
  abledStatus,
  
 
} from '@/services/operation/moveTask';

export default {
  namespace: 'MoveTask',
  state: {
    moveTaskList: {}, // list列表

    moveTaskDetail: {},
    formValues: {},
    
  },
//Effect :Action 处理器，处理异步动作，基于 Redux-saga 实现。
  effects: {
    // 
    // 1、查询 货主信息列表 

    *selectMoveTask({ payload, callback }, { call, put }) {
      const response = yield call(selectMoveTask, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          moveTaskList: {
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
    // 2、作业确认 确认按钮
    *confirmMoveTask({ payload, callback }, { call, put }) {
      const response = yield call(confirmMoveTask, payload);
      const { code, data,message } = response;
      if (code !== 0) return;
     
      const content =message ;
      prompt({ content });
      callback && callback(response);
    },
    *abledStatus({ payload, callback }, { call, put }){
      const response = yield call(abledStatus  , payload);
      const { code, data,message } = response;
      if (code !== 0) return;
      const content = message;
      prompt({ content });
      callback && callback(response);
    },

  


    /**
     * 设置表单参数
     */
    *allValus({ payload }, { _, put }) {
      yield put({
        type: 'saveAllValus',
        payload,
      });
    },


    *selectFileList({ payload, callback }, { call }) {
      const response = yield call(selectFileList, payload);
      const { code, message, data } = response;
      if (code === 0) {
        if (callback) callback(data);
      }
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
    oilCard(state, { payload }) {
      return {
        ...state,
        oilCardList: payload.oilCardList,
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
