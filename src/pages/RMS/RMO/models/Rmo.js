import {
  rmoList,
  asnDetails,
  ableOperate,
  fetchAsnDetailsList,
  visibleList,
  reviewQualityConfirm,
  importRMO,
  exportRMO,
  viewOBNticeShip,
  forceClose
} from '@/services/rms/rmo';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'Rmo',
  state: {
    rmoList: {},
    asnDetails: {},
    iqcDetailsList: {},
    visibleIQCList:{},
    deliveryDetails: {},
    delivery: {},
    OBNticeDetail:{},
  },

  effects: {
    // ASN管理列表：
    *selectRmoList({ payload, callback }, { call, put }) {
      const response = yield call(rmoList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            rmoList: {
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
    // ASN详情
    *asnDetails({ payload, callback }, { call, put }) {
      const response = yield call(asnDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            asnDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    // IQC操作
    *ableOperate({ payload, callback }, { call }) {
      const response = yield call(ableOperate, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
    *forceClose({ payload, callback }, { call }) {
      const response = yield call(forceClose, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
    *viewOBNticeShip({ payload, callback }, { call ,put}){
      const response = yield call(viewOBNticeShip, payload);
      if (response.code === 0) {
        yield put({
          type:'show',
          payload:{OBNticeDetail:response.data}
        })
        callback && callback(response.data);
        
      }
    },
    // ASN详情管理列表：
    *fetchAsnDetailsList({ payload, callback }, { call, put }) {
      const response = yield call(fetchAsnDetailsList, payload);
      if (response.code === 0) {
        yield put({
          type: 'detailsShow',
          payload: {
            iqcDetailsList: {
              [payload.id]: {
                list: response.data
              },
            }
          },
        });
        callback && callback(list);
      }
    },
    // IQC 质检审核弹框数据
    *visibleList({payload,callback},{call,put}){
      const response = yield call(visibleList, payload);
      if (response.code === 0) {
        // const {  pageSize, total, pageNum } = response.data;
        yield put({
          type: 'all',
          payload: {
            visibleIQCList:response.data ,
          },
        });
        callback && callback(response.data);
      }
    },
    //IQC 质检审核弹框确认
    *reviewQualityConfirm({payload,callback},{call,put}){
      const response = yield call(reviewQualityConfirm, payload)
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
    //导入
    *importRMO({payload,callback},{call,put}){
      const response = yield call(importRMO, payload)
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback && callback(response);
      }
    },
    //导出
    *exportRMO({payload,callback},{call,put}){
      
      yield call(exportRMO,payload)
    },
  },
  reducers: {

    all(state, { payload }){
      // console.log('payload.visibleIQCList--',payload.visibleIQCList)
      return{
        ...state,
        visibleIQCList:payload.visibleIQCList,
      }

    },
    // ASN列表数据
    show(state, { payload }) {
      // console.log('show(state---',payload)
      return {
        ...state,
        ...payload,
      };
    },
    // ASN详情数据
    detail(state, { payload }) {
      return {
        ...state,
        asnDetails: { ...state.asnDetails, ...payload.asnDetails },
      };
    },
    // ASN详情列表数据
    detailsShow(state, { payload }) {
      return {
        ...state,
        iqcDetailsList: { ...state.iqcDetailsList, ...payload.iqcDetailsList },
      };
    },
  },
};

