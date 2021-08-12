import request from '@/utils/request';
import { getPageSize } from '@/utils/common';


/**
 * 查询 移位单列表 /wms-move-doc/selectWmsMoveDocList selectPutawayList
 * @param params
 */
export async function selectMoveDoc(params) {
  params.pageSize = params.pageSize || getPageSize();

  return request('/server/api/wms-move-doc/selectPutawayList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}


/**
 * 查询详情 移位单 /wms-move-doc/viewWmsMoveDocDetails 
 * @param params
 */
export async function viewMoveDoc(params) {

  return request('/server/api/wms-move-doc/viewWmsMoveDocDetails', {
    method: 'POST',
    body: {
      ...params,
      //   method: 'post',
      type: 'enableEnum'

    },

  });
}

/**
 * 查询 移位单详情列表 /wms-move-doc-detail/selectWmsMoveDocDetailList
 * @param params
 */
export async function selectMoveDocDetail(params) {
  return request('/server/api/wms-move-doc-detail/selectWmsMoveDocDetailList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'

  });
}
// 移位单列表页： 手工分配列表页 即库存列表 /wms-inventory/selectWmsInventoryList    
export async function selectManualAllot(params) {

  return request('/server/api/wms-inventory/selectWmsInventoryList', {
    method: 'POST',
    body: params,
  });
}

// 移位单列表页： 手工分配 manualPutawayAllocate    
export async function manualAllocation(params) {

  return request('/server/api/wms-move-doc/manualPutawayAllocate', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}
// 移位单列表页： 取消分配 cancelPickAllocate        
export async function cancelAllocation(params) {
  return request('/server/api/wms-move-doc/cancelPutawayAllocate', {
    method: 'POST',
    body: params,
  });
}
// 移位单列表页：自动分配 autoPutawayAllocate  
export async function autoAllocation(params) {
  return request('/server/api/wms-move-doc/autoPutawayAllocate', {
    method: 'POST',
    body: params,
  });
}
// 移位单列表页：作业下发 moveConfirm  
export async function moveConfirm(params) {

  return request('/server/api/wms-move-doc/moveConfirm', {
    method: 'POST',
    body: params,
  });
}
// 移位单列表页：取消下发 moveCancel  
export async function moveCancel(params) {

  return request('/server/api/wms-move-doc/moveCancel', {
    method: 'POST',
    body: params,
  });
}

//cancelAllocationList
export async function cancelAllocationList  (params) {
  return request('/server/api/wms-move-doc-detail/selectWmsAllocatedList', {
    method: 'POST',
    body: params,
  });
}