import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询 货主信息列表 bms-charge-detail/selectBmsChargeDetailList
 * @param params
 */
export async function selectChargeDetail(params) {
  params.pageSize = params.pageSize || getPageSize();
  let url='bms-part-buy/selectBmsPartBuyChargeList'
  
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}
export async function selectBuyLedgerDetailList(params) {
  params.pageSize = params.pageSize || getPageSize();
  let url='bms-part-buy/selectBmsPartBuyChargeList'
  if (params.status) url='bms-statement/selectBmsStatementList'
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}
export async function selectBillinglList(params) {
  let pageSize=localStorage.getItem('BillingListMod_defaultPagesize')
  params.pageSize = params.pageSize || getPageSize(pageSize);
  return request('/server/api/bms-part-buy/selectPartBuyBmsBillingList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}
/**
 * 启用|禁用 货主信息 禁用：/wms-contact-unit/disabledWmsLoad
 * @param params
 */


export async function abledStatus(params) {
  const { type, ...param} = params;
  let url=''
  switch(type){
    case 'updateBilling':
      url='bms-billing/updateBmsBilling'
      break;
    case 'createBilling':
      url='bms-part-buy/createBillingByChargeDetail';
      break;
    case 'remove':
      url='bms-part-buy/chargeDetailRemoveToBilling'
      break;
    case 'addToBilling':
      url='bms-part-buy/chargeDetailAddToBilling'
      break;
    case 'addLedger':
      url='bms-part-buy/chargeDetailAddToBilling'
      break;
    case 'statusNum':
      url='bms-statement/selectBmsStatementListByStatus'
  }
  return request(`/server/api/${url}`, {
    method: 'POST',
    body:param,
    
  });
}

/**
 * 查询详情 货主信息 /wms-loading-list/viewWmsLoadingListDetails
 * @param params
 */
export async function viewChargeDetail(params) {
  return request('/server/api/bms-billing/viewBmsBillingDetail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function exportUrl(params) {
  params.token=localStorage.getItem('token')
  let url=`/server/api/wms-po/exportWmsPoBySearch?${stringify(params)}`
  window.open(url)
}






