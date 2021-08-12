import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 采购计划详情列表查询
export async function ibplanList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/wms-po-detail/selectWmsPoDetailList`, {
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
      url = 'wms-po/confirmWmsPo';
      break;
    case 'cancel':
      url = 'wms-po/cancelWmsPo';
      break;
    case 'obsolete':
      url = 'wms-po/obsoleteWmsPo';
      break;
    default:
      break;
  }
  // const url = params.type ? 'wms-po/enableWmsWarehouse' : 'wms-po/disabledWmsWarehouse';
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
export async function generateAsn(params) {
  let url=''
  switch(params.type){
    case 'autoASN':
      url='wms-asn/autoWmsAsnByPo'
      break;
    case 'createASN':
      url='wms-asn/insertWmsAsnByPo'
      break;
  }
  // console.log('????',params.type,url)
  return request(
    `/server/api/${url}`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}


// 详情
export async function ibplanDetails(params) {
  return request(
    `/server/api/wms-po/viewWmsPoDetails`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// po明细列表
export async function fetchWmsPoDetailsList(params) {
  // params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/wms-po-detail/selectWmsPoDetailList`, {
    method: 'POST',
    body: params,
  });
}

// po明细详情
export async function fetchDeliveryDetails(params) {
  // params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/wms-po-detail/viewWmsPoDetailDetails`, {
    method: 'POST',
    body: params,
  });
}


// 新增明细详情
export async function insertWmsPoDetail(params) {
  return request(`/server/api/wms-po-detail/insertWmsPoDetail`, {
    method: 'POST',
    body: params,
  });
}

// 编辑明细详情
export async function updateWmsPoDetail(params) {
  return request(`/server/api/wms-po-detail/updateWmsPoDetail`, {
    method: 'POST',
    body: params,
  });
}
