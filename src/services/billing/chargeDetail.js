import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询 货主信息列表 bms-charge-detail/selectBmsChargeDetailList
 * @param params
 */
export async function selectChargeDetail(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request('/server/api/bms-charge-detail/selectBmsChargeDetailList', {
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
  // const { type, ids } = params;
  // const url =
  //   type 
  //     ? '/server/api/wms-loading-list/confirmWmsDelivery'
  //     : '/server/api/bms-charge-detail/chargeConfirm';  
  let url='/server/api/bms-charge-detail/chargeConfirm'
  return request(url, {
    method: 'POST',
    body:params,
    
  });
}

/**
 * 查询详情 货主信息 /wms-loading-list/viewWmsLoadingListDetails
 * @param params
 */
export async function viewChargeDetail(params) {
  return request('/server/api/bms-charge-detail/viewBmsChargeDetailDetails', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


/**
 * 新增、修改   bms-charge-detail/insertBmsChargeDetail
 * @param params
 */
export async function operateChargeDetail(params) {
  let url= params.id ? 'updateBmsChargeDetail' : 'insertBmsChargeDetail';
  return request(`/server/api/bms-charge-detail/${url}`, {
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




