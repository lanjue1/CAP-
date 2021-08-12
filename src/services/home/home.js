import request from '@/utils/request';
import { getPageSize } from '@/utils/common';
export async function dataList(params) {

    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-index/selectOtherOrder`, {
      method: 'POST',
      body: params,
      type: 'enableEnum'
  
    });
  }
// Pending Receiving
export async function selectPendingReceiving(params) {
    return request(`/server/api/wms-index/selectPendingReceiving`, {
        method: 'POST',
        body: params,
    });
}
// Pending Putaway
export async function selectPendingPutaway(params) {
    return request(`/server/api/wms-index/selectPendingPutaway`, {
        method: 'POST',
        body: params,
    });
}

// Putaway
export async function selectPutaway(params) {
    return request(`/server/api/wms-index/selectPutaway`, {
        method: 'POST',
        body: params,
    });
}

// Outbound
export async function selectOutbound(params) {
    return request(`/server/api/wms-index/selectOutbound`, {
        method: 'POST',
        body: params,
    });
}
// CurrentInventory
export async function selectCurrentInventory  (params) {
    return request(`/server/api/wms-index/selectCurrentInventory`, {
        method: 'POST',
        body: params,
    });
}
// TotalOrder
export async function selectTotalOrder(params) {
    return request(`/server/api/wms-index/selectTotalOrder`, {
        method: 'POST',
        body: params,
    });
}
// UnpickedOrder
export async function selectUnpickedOrder(params) {
    return request(`/server/api/wms-index/selectUnpickedOrder`, {
        method: 'POST',
        body: params,
    });
}
