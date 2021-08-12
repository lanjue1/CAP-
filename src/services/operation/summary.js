import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询 货主信息列表 wms-inventory-summary/selectWmsInventorySummaryList
 * @param params
 */
export async function selectSummary(params) {
  params.pageSize = params.pageSize || getPageSize();

  return request('/server/api/wms-inventory-summary/selectWmsInventorySummaryList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

/**
 * 启用|禁用 货主信息 禁用：/wms-contact-unit/disabledWmsLoad
 * @param params
 */


export async function abledSnapshot(params) {
  const { type, ...param} = params;
  let url=''
  switch(type){
    case 'initSnapshot':
      url='wms-inventory-snapshot/initWmsInventorySnapshotDetails'
      break;
    case 'confim':
      url='wms-inventory-summary/confirm'
      break;
    case 'createReceipt':
      url='wms-inventory-summary/createReceiptBySummary'
      break;
    case 'revocation':
      url='wms-inventory-summary/revocation'
      break;
    case 'createSummary':
      url='wms-inventory-summary/createSummary'
      break;
  }
  
  return request(`/server/api/${url}`, {
    method: 'POST',
    body:param
  });
}

/**
 * 查询详情 货主信息 /wms-loading-list/viewWmsLoadingListDetails
 * @param params
 */
export async function viewLoad(params) {
  return request('/server/api/wms-loading-list/viewWmsLoadingListDetails', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function selectLoadDelivery(params) {
  return request('/server/api/wms-loading-list/selectWmsDeliveryList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 新增、修改   /wms-loading-list/updateWmsLoadingList
 * @param params
 */
export async function operateLoad(params) {
  let url= params.id ? 'updateWmsLoadingList' : 'insertWmsLoadingList';
  return request(`/server/api/wms-loading-list/${url}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//addDetail&&cancel
export async function insertCancelDelivery(params) {
  let url= params.type ? 'removeWmsDeliveryBatch' : 'insertWmsDeliveryBatch';
  return request(`/server/api/wms-loading-list/${url}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}




