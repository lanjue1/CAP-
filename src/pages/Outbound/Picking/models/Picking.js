import prompt from '@/components/Prompt';
import {
  selectPicking,
  viewMoveDoc,
  cancelAllocationList,
  selectMoveDocDetailList,
  selectInventoryList,
  fetchPickingAllot,
  manualAllocation,
  cancelAllocation,
  autoAllocation,
  moveConfirm,
  moveCancel,
  pickingPrint,
  getBiReport,

  viewPickDetail,
  selectPickDetail,
  abledStatus
} from '@/services/outbound/picking';

export default {
  namespace: 'Picking',
  state: {
    pickingList: {}, // list列表


    moveDocDetailList: {},
    inventoryList: {},
    cancelAllocationList: {},
    pickingPrintDetail: [],
    pickingDetail:{},
    pickingDetailList:{},
    pickingSerial:[], //serial数据
    
  },
  //Effect :Action 处理器，处理异步动作，基于 Redux-saga 实现。
  effects: {
    // 
    *abledStatus({ payload, callback }, { call, put }){
      const response = yield call(abledStatus, payload);
      const { code, data, message } = response
      const content =  message;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(data);
    },
    // 1、查询 拣货单列表 

    *selectPicking({ payload, callback }, { call, put }) {
      const response = yield call(selectPicking, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          pickingList: {
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

    *viewPickDetail({ payload, callback }, { call, put }){
      const response = yield call(viewPickDetail, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type:'detail',
        payload:{
          pickingDetail:{[payload.id]:data}
        }
      })
    },

    *selectPickDetail({ payload, callback }, { put, call }){
      const response = yield call(selectPickDetail, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type:'detail',
        payload:{
          pickingDetailList:{[payload.moveDocId]:data}
        }
      })
      callback&&callback(data)
    },
    *selectPickSerial({ payload, callback }, { call, put }) {
      const response = yield call(selectPickSerial, payload);
      const { code, data } = response;
      if (code !== 0) return;
      yield put({
        type: 'saveAllValus',
        payload: {
          pickingSerial:data
        },
      });
      callback && callback(data);
    },
    //4.1 移位表列表：手工分配确认按钮 manualAllocation
    *manualAllocation({ payload, callback }, { put, call }) {
      const response = yield call(manualAllocation, payload)
      const { code, data, message } = response
      const content = 'manualAllocate  ' + message;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(response);
    },
    // 4.1.1 拣货单列表：弹框列表 
    *selectMoveDocDetailList({ payload, callback }, { call, put }) {
      const response = yield call(selectMoveDocDetailList, payload);
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
    // 4.1.2 拣货单列表：弹框列表--选中值后显示下发列表值  
    *selectInventoryList({ payload, callback }, { call, put }) {
      const response = yield call(selectInventoryList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          inventoryList: {
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
    //4.1.3 拣货单列表：取消分配 cancelAllocation
    *cancelAllocation({ payload, callback }, { put, call }) {
      const response = yield call(cancelAllocation, payload)
      const { code, data, message } = response
      const content = 'cancelAllocate ' + message;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(response);
    },
    //4.1.4 拣货单列表：取消分配List列表  cancelAllocation
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
    *autoAllocation({ payload, callback }, { put, call }) {
      const response = yield call(autoAllocation, payload)
      const { code, data, message } = response
      const content = 'autoAllocate ' + message;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(response);
    },
    //4.3 移位表列表：作业下发 moveConfirm
    *moveConfirm({ payload, callback }, { put, call }) {
      const response = yield call(moveConfirm, payload)
      const { code, data, message } = response
      const content = 'taskSend ' + message;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(response);
    },
    //4.4 移位表列表：取消下发 moveCancel
    *moveCancel({ payload, callback }, { put, call }) {
      const response = yield call(moveCancel, payload)
      const { code, data, message } = response
      const content = 'cancelSend  ' + message;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(response);
    },
    //5. 打印-详情
    *pickingPrint({ payload, callback }, { put, call }) {
      const response = yield call(pickingPrint, payload)
      const { code, data, message } = response
      if (code !== 0) return;
      yield put({
        type: 'saveAllValus',
        payload: {
          pickingPrintDetail: data,
        },
      });
      callback && callback(data);
    },
    *getBiReport({ payload, callback }, { call }){
      const response = yield call(getBiReport, payload);
      const { code, data } = response;
      if (code === 0) {
        callback(data);
      }
    },

    /**
     * 设置表单参数 操作redux中的数据
     */
    *allValus({ payload, callback }, { _, put }) {
      yield put({
        type: 'saveAllValus',
        payload,
      });
      callback && callback('清空了')
    },


    *selectFileList({ payload, callback }, { call }) {
      const response = yield call(selectFileList, payload);
      const { code, message, data } = response;
      if (code === 0) {
        if (callback) callback(data);
      }
    },

    // 分配人员
    *fetchPickingAllot({ payload, callback }, { put, call }) {
      const response = yield call(fetchPickingAllot, payload)
      const { code, data, message } = response
      const content = message;

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
