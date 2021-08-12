import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询 出库单列表 /wms-shipping-notice/selectWmsShippingNoticeList
 * @param params
 */
export async function selectDelivery(params) {
  //localStorage.getItem(`${className}_defaultPagesize`)
  let pageSize=localStorage.getItem('DeliveryList_defaultPagesize')
  params.pageSize = params.pageSize || getPageSize(pageSize);
  // console.log('pageSize???',pageSize,getPageSize(pageSize))

  return request('/server/api/wms-delivery/selectWmsDeliveryList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}


/**
 * 查询详情 出库单 /wms-shipping-notice/viewWmsShippingNoticeDetails
 * @param params
 */
export async function viewDelivery(params) {
  return request('/server/api/wms-delivery/viewWmsDeliveryDetails', {
    method: 'POST',
    body: {
      ...params,
      //   method: 'post',
      type: 'enableEnum'

    },

  });
}

/** /wms-delivery/deleteWmsDelivery
 * 查询详情 出库单明细 /wms-shipping-notice-detail/selectWmsShippingNoticeDetailList
 * @param params
 */

export async function viewDeliveryDetail(params) {
  return request('/server/api/wms-delivery-detail/selectWmsDeliveryDetailList', {
    method: 'POST',
    body: {
      ...params,
      //   method: 'post',
      type: 'enableEnum'

    },

  });
}
// 查询出库单详情--明细列表 wms-delivery-detail/selectWmsDeliveryDetailList
export async function selectDeliveryDetail(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request('/server/api/wms-delivery-detail/selectWmsDeliveryDetailList', {
    method: 'POST',
    body: {
      ...params,
      //   method: 'post',
      type: 'enableEnum'
    },

  });
}
//查询出库单详情--序列号 wms-serial-no/viewWmsSerialNoDetailsByDeliveryDetailId
export async function selectDeliverySerial(params) {
  params.pageSize = params.pageSize || getPageSize();

  // return request('/server/api/wms-serial-no/selectPDADeliverySerialNoList', {
  return request('/server/api/wms-serial-no/viewWmsSerialNoDetailsByDeliveryDetailId', {
    method: 'POST',
    body: {
      ...params,
      //   method: 'post',
    },

  });
}
/** 
 * 删除 出库单明细 /wms-delivery/deleteWmsDelivery
 * @param params
 */
export async function cancelDelivery(params) {
  return request('/server/api/wms-delivery/deleteWmsDelivery', {
    method: 'POST',
    body: {
      ...params,
      //   method: 'post',
    },

  });
}

export async function abledDelivery(params) {

  console.log('params---', params.type)
  const { type, ...param } = params
  let url = ''
  switch (params.type) {
    case 'sign':
      url = 'wms-delivery/sign'
      break;
    case 'createLoadlist':
      url = 'wms-delivery/generateLoadingList'
      break;
    case 'reviewerDelivery':
      url = 'wms-delivery/confirmWmsDeliveryBatch'
      break;
    case 'revocationDelivery':
      url = 'wms-delivery/resetScanWmsDeliveryBatch'
      break;
    case 'shipDelivery':
      url = 'wms-delivery/shipConfirmWmsDeliveryBatch'
      break;
    case 'createLoadlistByOne':
      url='wms-delivery/generateLoadingListByOneToOne'
      break;
    case 'createLoadlistByName':
      url='wms-delivery/generateLoadingListByContact'
      break;
    case 'pickBack':
      url='wms-delivery/pickBackBatch'
      break;
  }
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: {
      ...param,
      //   method: 'post',
    },

  });
}


