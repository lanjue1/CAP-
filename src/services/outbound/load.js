import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询 货主信息列表 wms-loading-list/selectWmsLoadingListList
 * @param params
 */
export async function selectLoad(params) {
  params.pageSize = params.pageSize || getPageSize();

  return request('/server/api/wms-loading-list/selectWmsLoadingListList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

/**
 * 启用|禁用 货主信息 禁用：/wms-contact-unit/disabledWmsLoad
 * @param params
 */
export async function abledLoad(params) {
  const { type, ...param } = params;
  let url = ''
  switch (type) {
    case 'register':
      url = 'wms-loading-list/registerWmsDelivery'
      break;
    case 'confim':
      url = 'wms-loading-list/confirmWmsDelivery'
      break;
    case 'accept':
      url = 'wms-loading-list/acceptWmsLoadingList'
      break;
    case 'reviewerDelivery':
      url = 'wms-loading-list/confirmWmsLoadingListBatch'
      break;
    case 'revocationDelivery':
      url = 'wms-loading-list/resetScanWmsLoadingListBatch'
      break;
    case 'cancelDelivery':
      url = 'wms-loading-list/cancelWmsLoadingListBatch'
      break;
    case 'shipDelivery':
      url = 'wms-loading-list/shipConfirmWmsLoadingListBatch'
      break;
  }
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: {
      ...param
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
  params.pageSize = params.pageSize || getPageSize();

  return request('/server/api/wms-loading-list/selectWmsDeliveryDetailList', {
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
  let url = params.id ? 'updateWmsLoadingList' : 'insertWmsLoadingList';
  return request(`/server/api/wms-loading-list/${url}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//addDetail&&cancel
export async function insertCancelDelivery(params) {
  let url = params.type ? 'removeWmsDeliveryBatch' : 'insertWmsDeliveryBatch';
  return request(`/server/api/wms-loading-list/${url}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 详情的delivery 列表
export async function selectDelivery(params) {
  params.pageSize = params.pageSize || getPageSize();

  return request('/server/api/wms-loading-list/selectWmsDeliveryList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//装车单新增出库单 移除
export async function abledDelivery(params) {
  let url=''
  const {type,...param}=params
  switch(type){
    case 'insert':
      url='wms-loading-list/insertWmsDeliveryBatch'
      break;
    case 'remove':
      url='wms-loading-list/removeWmsDeliveryBatch'
      break;
  }
  return request(`/server/api/wms-loading-list/${url}`, {
    method: 'POST',
    body: {
      ...param,
    },
  });
}




