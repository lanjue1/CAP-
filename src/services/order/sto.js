import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 仓库管理列表查询
export async function wmscoList(params) {

  params.pageSize = params.pageSize || getPageSize();
  params.type = 'STO'
  return request(`/server/api/wms-co/selectWmsCoList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

// 新增编辑
export async function wmscoOperate(params) {
  const url = params.id ? 'wms-co/updateWmsCo' : 'wms-co/insertWmsCo';
  return request(
    `/server/api/${url}`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
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

// 详情
export async function wmscoDetails(params) {
  return request(
    `/server/api/wms-co/viewWmsCoDetails`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// co明细列表
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
//lockingInvertory 锁定 
export async function lockingInventory(params) {
  let typeUrl = params.type ? 'unLockingInventory' : 'lockingInventory'
  return request(`/server/api/wms-co/${typeUrl}`, {
    method: 'POST',
    body: params,
  });
}

// 生成ASN
export async function generateShipping(params) {
  const {type,...param}=params
  let url=''
  switch(type){
    case 'generate':
      url='wms-outbound-notice/createOutboundNoticeByCo'
      break;
    case 'autoDistribution':
      url='wms-co/automaticDistribution'
      break;

  }
  return request(
    `/server/api/${url}`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

//cancelDetail
export async function cancelDetail(params) {
  return request(`/server/api/wms-co-detail/updateWmsCoDetail`, {
    method: 'POST',
    body: params,
  });
}

//cancelSTO
export async function cancelSTO(params) {
  return request(`/server/api/wms-co/obsoleteWmsCo`, {
    method: 'POST',
    body: params,
  });
}