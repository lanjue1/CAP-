import prompt from '@/components/Prompt';
import {
  selectMoveDoc,
  viewMoveDoc,
  selectMoveDocDetail,
  
  manualAllocation,
  cancelAllocation,
  autoAllocation,
  moveConfirm,
  moveCancel,
  selectManualAllot,
  cancelAllocationList,
} from '@/services/inbound/moveDoc';

export default {
  namespace: 'MoveDoc',
  state: {
    moveDocList: {}, // list列表

    moveDocDetail: {},
    moveDocDetailList: {},
    manualAllotList:{},
    formValues: {},
    cancelAllocationList:{},
    
  },
//Effect :Action 处理器，处理异步动作，基于 Redux-saga 实现。
  effects: {
    // 
    // 1、查询 移位单列表 

    *selectMoveDoc({ payload, callback }, { call, put }) {
      const response = yield call(selectMoveDoc, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          moveDocList: {
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
    // 2、查询详情 移位单
    *viewMoveDoc({ payload, callback }, { call, put }) {
      const response = yield call(viewMoveDoc, payload);
      // console.log('response==详情',response)
      const { code, data } = response;
      if (code !== 0) return;
      let newData = data;
      yield put({
        type: 'detail',
        payload: { moveDocDetail: { [payload.id]: newData } },
      });
      callback && callback(newData);
    },
   // 3、查询 移位单详情列表 

    *selectMoveDocDetail({ payload, callback }, { call, put }) {
      const response = yield call(selectMoveDocDetail, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          moveDocDetailList: {
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
     
    //4.1 移位表列表：手工分配确认按钮 manualAllocation
    *manualAllocation({payload,callback},{put,call}){
      const response = yield call(manualAllocation,payload)
      const {code,data,message} = response
      const content ='manualAllocate : '+  message;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(response);
    },
    // 4.1.1 移位单列表：手工分配列表 
    *selectManualAllot({ payload, callback }, { call, put }) {
      const response = yield call(selectManualAllot, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          manualAllotList: {
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
    //4.1 移位表列表：取消分配 cancelAllocation
    *cancelAllocation({payload,callback},{put,call}){
      const response = yield call(cancelAllocation,payload)
      const {code,data,message} = response
      const content = 'cancelAllocat '+ message;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(response);
    },
    *cancelAllocationList({ payload, callback }, { call, put }) {
      const response = yield call(cancelAllocationList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          cancelAllocationList: {
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
    //4.2 移位表列表：自动分配 autoAllocation
    *autoAllocation({payload,callback},{put,call}){
      const response = yield call(autoAllocation,payload)
      const {code,data,message} = response
      const content = `autoAllocate  ${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(response);
    },
    //4.3 移位表列表：作业下发 moveConfirm
    *moveConfirm({payload,callback},{put,call}){
      const response = yield call(moveConfirm,payload)
      const {code,data,message} = response
      const content = 'taskSend  '+message;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(response);
    },
    //4.4 移位表列表：取消下发 moveCancel
    *moveCancel({payload,callback},{put,call}){
      const response = yield call(moveCancel,payload)
      const {code,data,message} = response
      const content = 'taskCancelSend '+message;
      if (code !== 0) return;
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
