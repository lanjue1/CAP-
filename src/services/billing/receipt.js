import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询 货主信息列表 bms-receipt/selectBmsReceiptList
 * @param params
 */
export async function selectReceipt(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request('/server/api/bms-receipt/selectBmsReceiptList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

/**
 * 启用|禁用 货主信息 禁用：/wms-contact-unit/disabledWmsLoad
 * @param params
 */


export async function abledReceipt(params) {
  const { type, ids } = params;
  const url =
    type 
      ? '/server/api/wms-loading-list/confirmWmsDelivery'
      : '/server/api/bms-receipt/reBilling';
  return request(url, {
    method: 'POST',
    body: {
      ids,
    },
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




