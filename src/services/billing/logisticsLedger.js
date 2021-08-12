import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询 货主信息列表 bms-charge-detail/selectBmsChargeDetailList
 * @param params
 */
export async function selectChargeDetail(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request('/server/api/bms-Logistics-charge/selectBmsChargeDetailList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}
export async function selectBuyLedgerDetailList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request('/server/api/bms-Logistics-charge/selectBmsChargeDetailList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}
export async function selectBillinglList(params) {
  let pageSize=localStorage.getItem('BillingListMod_defaultPagesize')
  params.pageSize = params.pageSize || getPageSize(pageSize);
  return request('/server/api/bms-billing/selectBmsLogisticsBillingList', {
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
      url='bms-Logistics-charge/createBillingByChargeDetail';
      break;
    case 'remove':
      url='bms-Logistics-charge/chargeDetailRemoveToBilling'
      break;
    case 'addToBilling':
      url='bms-Logistics-charge/chargeDetailAddToBilling'
      break;
    case 'addLedger':
      url='bms-Logistics-charge/chargeDetailAddToBilling'
      break;
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







