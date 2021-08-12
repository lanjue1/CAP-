import request from '@/utils/request';
import { getPageSize } from '@/utils/common';
import {stringify} from 'qs'
// 仓库管理列表查询
export async function wmspoList(params) {

  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/wms-po/selectWmsPoList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'

  });
}

// 新增编辑
export async function wmspoOperate(params) {
  const url = params.id ? 'wms-po/updateWmsPo' : 'wms-po/insertWmsPo';
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
      url = 'wms-po/confirmWmsPo';
      break;
    case 'cancel':
      url = 'wms-po/cancelWmsPo';
      break;
    case 'obsolete':
      url = 'wms-po/obsoleteWmsPo';
      break;
    case 'cancelDetail':
      url='wms-po-detail/cancelWmsPoDetail';
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

// 详情
export async function wmspoDetails(params) {
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
    type: 'enableEnum'
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
// 导出 PoReport/exportInventoryReport
export async function exportPo(params) {
  params.token=localStorage.getItem('token')
  let url=`/server/api/wms-po/exportWmsPoBySearch?${stringify(params)}`
  window.open(url)
}
