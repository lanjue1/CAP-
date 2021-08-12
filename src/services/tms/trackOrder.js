import request from '@/utils/request';
import { getPageSize } from '@/utils/common';
import {stringify} from 'qs'
// 仓库管理列表查询
export async function trackOrderList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/tms-track-order/selectTmsTrackOrderList`, {
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
  const {type,...param}=params
  switch (type) {
    case 'confirm':
      url = 'wms-po/confirmWmsPo';
      break;
    case 'cancel':
      url = 'wms-po/cancelWmsPo';
      break;
    case 'obsolete':
      url = 'wms-po/obsoleteWmsPo';
      break;
    case 'insertTrack':
      url='tms-track-order-tracking/insertTmsTrackingByTrackOrder'
      break;
    default:
      break;
  }
  // const url = params.type ? 'wms-po/enableWmsWarehouse' : 'wms-po/disabledWmsWarehouse';
  return request(
    `/server/api/${url}`,
    {
      method: 'POST',
      body: param,
    },
    true
  );
}

// 详情
export async function trackOrderDetails(params) {
  return request(
    `/server/api/tms-track-order/viewTmsTrackOrderDetails`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// po明细列表
export async function fetchTrackList(params) {
  // params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/tms-track-order-tracking/selectTmsTrackOrderTrackingList
  `, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

// po明细详情
export async function fetchTrackDetails(params) {
  // params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/tms-track-order-tracking/viewTmsTrackOrderTrackingDetails`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function deleteTrack(params) {
  // params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/tms-track-order-tracking/deleteTmsTrackOrderTracking`, {
    method: 'POST',
    body: params,
  });
}


// 新增轨迹
export async function insertTrackOrder(params) {
  return request(`/server/api/tms-track-order-tracking/insertTmsTrackOrderTracking`, {
    method: 'POST',
    body: params,
  });
}

// 编辑轨迹
export async function updateTrackOrder(params) {
  return request(`/server/api/tms-track-order-tracking/updateTmsTrackOrderTracking`, {
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
