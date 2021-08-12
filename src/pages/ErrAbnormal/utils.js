export const codes = {
  select: 'ABNORMALSELECT',
  showDetail: 'ABNORMALSELECT_VIEW',
  add: 'ABNORMALSELECT_ADD',
  edit: 'ABNORMALSELECT_UPD',
  finish: 'ABNORMALSELECT_FINISH',
  deleteFollow: 'ABNORMAL_FOLLOWUP_DEL',
  addFollow: 'ABNORMAL_FOLLOWUP_ADD',
  delectRecord: 'ABNORMAL_TRADING_DEL',
  addCollection: 'ABNORMAL_TRADING_SK',
  addPayment: 'ABNORMAL_TRADING_FK',
  page: 'ABNORMALPAGE',
};
export const statusMap = {
  待处理: 'error',
  处理中: 'processing',
  已关闭: 'default',
  PENDING: 'success',
};
// 状态
export const currentStateCode = [
  { code: 'PROCESSING', value: '处理中' },
  { code: 'PENDING', value: '待处理' },
  { code: 'CLOSED', value: '已关闭' },
];

//跟进记录类型
export const recodeTypeCode = [
  { code: 'FOLLOWUP', value: '跟进' },
  { code: 'NEW', value: '新建' },
  { code: 'CLOSED', value: '已关闭' },
];
//收、付款
export const payCode = [{ code: 'RECEIVABLES', value: '收款' }, { code: 'PAYMENT', value: '付款' }];
