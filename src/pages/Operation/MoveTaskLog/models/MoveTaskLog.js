import prompt from '@/components/Prompt';
import {
  selectMoveTaskLog,
 
  confirmMoveTask,
  viewMoveTaskLog,
  
 
} from '@/services/operation/moveTaskLog';

export default {
  namespace: 'MoveTaskLog',
  state: {
    moveTaskLogList: {}, // list列表

    moveTaskLogDetail: {},
    formValues: {},
    
  },
//Effect :Action 处理器，处理异步动作，基于 Redux-saga 实现。
  effects: {
    // 
    // 1、查询 货主信息列表 

    *selectMoveTaskLog({ payload, callback }, { call, put }) {
      const response = yield call(selectMoveTaskLog, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          moveTaskLogList: {
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
    // *confirmMoveTask({ payload, callback }, { call, put }) {
    //   const response = yield call(confirmMoveTask, payload);
    //   const { code, data,message } = response;
    //   if (code !== 0) return;
     
    //   const content = `手工分配${message}`;
    //   if (code !== 0) return;
    //   prompt({ content });
    //   callback && callback(response);
    // },
    // 3. 查询详情 
    *viewMoveTaskLog({ payload, callback }, { call, put }) {
      const response = yield call(viewMoveTaskLog, payload);
      const { code, data } = response;
      if (code !== 0) return;
      let newData = data;
      
      yield put({
        type: 'detail',
        payload: { moveTaskLogDetail: { [payload.id]: newData } },
      });
      callback && callback(newData);
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
