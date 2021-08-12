import request from '@/utils/request';
import {getPageSize} from '@/utils/common';

// 采购计划详情列表查询
export async function obplanList(params) {

    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-co-detail/selectWmsCoDetailList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}


// 启用禁用
export async function ableOperate(params) {
    let url;
    switch (params.type) {
      case 'confirm':
        url = 'wms-co/confirmWmsCo';
        break;
      case 'cancel':
        url = 'wms-co/cancelWmsCo';
        break;
      case 'obsolete':
        url = 'wms-co/obsoleteWmsCo';
        break;
      default:
        break;
    }
    // const url = params.type ? 'wms-co/enableWmsWarehouse' : 'wms-co/disabledWmsWarehouse';
    return request(
        `/server/api/${url}`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}


// 生成ASN
export async function generateShipping(params) {

  return request(
    `/server/api/wms-outbound-notice/createOutboundNoticeByCoDetail`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}


// 详情
export async function obplanDetails(params) {
    return request(
        `/server/api/wms-co/viewWmsCoDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}

// po明细列表
export async function fetchWmsCoDetailsList(params) {
  // params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/wms-co-detail/selectWmsCoDetailList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

// po明细详情
export async function fetchDeliveryDetails(params) {
  // params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/wms-co-detail/viewWmsCoDetailDetails`, {
    method: 'POST',
    body: params,
  });
}


// 新增明细详情
export async function insertWmsCoDetail(params) {
  return request(`/server/api/wms-co-detail/insertWmsCoDetail`, {
    method: 'POST',
    body: params,
  });
}

// 编辑明细详情
export async function updateWmsCoDetail(params) {
  return request(`/server/api/wms-co-detail/updateWmsCoDetail`, {
    method: 'POST',
    body: params,
  });
}
