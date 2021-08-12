import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询 拣货单列表 /wms-move-doc/selectPickingList
 * @param params
 */
export async function selectPicking(params) {
  params.pageSize = params.pageSize || getPageSize();

  return request('/server/api/wms-move-doc/selectPickingList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}
export async function abledStatus(params){
  const {type,...param}=params
  let url=''
  switch(type){
    case 'printVirtualSN':
      url='wms-serial-no/printSerialNo'
      break;
  }
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: {
      ...param,
    },
  });
}

/**
 * 查询详情 拣货单 /wms-move-doc/viewWmsMoveDocDetails 
 * @param params
 */
export async function viewMoveDoc(params) {

  return request('/server/api/wms-move-doc/viewWmsMoveDocDetails', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


//selectWmsUnallocatedList
// 拣货单列表页：  根据拣货单id查询拣货单明细列表  selectWmsUnallocatedList    
export async function selectMoveDocDetailList(params) {
  params.pageSize = params.pageSize || getPageSize();

  return request('/server/api/wms-move-doc-detail/selectWmsUnallocatedList', {
    method: 'POST',
    body: params,
  });
}

// 拣货单列表页：  根据拣货单明细查询库存列表  selectWmsInventoryListByMoveDetailId    
export async function selectInventoryList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request('/server/api/wms-inventory/selectWmsInventoryListByMoveDetailId', {
    method: 'POST',
    body: params,
  });
}

// 拣货单列表页： 手工分配 manualPutawayAllocate   /wms-move-doc/manualPickingAllocate 
export async function manualAllocation(params) {
  return request('/server/api/wms-move-doc/manualPickingAllocate', {
    method: 'POST',
    body: params,
  });
}
// 拣货单列表页： 取消分配list 列表 selectWmsAllocatedList   /wms-move-doc/selectWmsAllocatedList     
export async function cancelAllocationList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request('/server/api/wms-move-doc-detail/selectWmsAllocatedList', {
    method: 'POST',
    body: params,
  });
}

  // 拣货单列表页： 取消分配 cancelPickAllocate   /wms-move-doc/cancelPickingAllocate     
  export async function cancelAllocation(params) {
    
    return request('/server/api/wms-move-doc/cancelPickingAllocate', {
      method: 'POST',
      body: params,
    });
  }
  // 拣货单列表页：自动分配 autoPutawayAllocate /wms-move-doc/autoPickingAllocate 
  export async function autoAllocation(params) {
    
    return request('/server/api/wms-move-doc/autoPickingAllocate', {
      method: 'POST',
      body: params,
    });
  }
  // 拣货单列表页：作业下发 moveConfirm  /wms-move-doc/pickingConfirm
  export async function moveConfirm(params) {
    
    return request('/server/api/wms-move-doc/pickingConfirm', {
      method: 'POST',
      body: params,
    });
  }
  // 拣货单列表页：取消下发 moveCancel  /wms-move-doc/pickingCancel
  export async function moveCancel(params) {
    
    return request('/server/api/wms-move-doc/pickingCancel', {
      method: 'POST',
      body: params,
    });
  }

  //打印详情 接口 /print/selectWmMovePrintData
  export async function pickingPrint(params) {
    return request('/server/api/print/selectWmMovePrintDatas', {
      method: 'POST',
      body: params,
    });
  } 
  //getBiReport
  export async function getBiReport(params) {
    return request(`/server/api/BiReport/getBiReportURI`, {
      method: 'POST',
      body: params,
    });
  }
  // 分配工作人员
export async function fetchPickingAllot(params) {
  return request('/server/api/wms-move-doc/pickingAllot', {
    method: 'POST',
    body: params,
  });

}

//详情页
export async function viewPickDetail(params){
  return request(`/server/api/wms-move-doc/viewWmsMoveDocDetails`,{
    method:'POST',
    body:params
  })
}

//详情页列表
export async function selectPickDetail(params){
  params.pageSize = params.pageSize || getPageSize();
  
  return request(`/server/api/wms-move-task/selectWmsMoveTaskList`,{
    method:'POST',
    body:params
  })
}
export async function selectPickSerial(params) {
  params.pageSize = params.pageSize || getPageSize();
  // return request('/server/api/wms-serial-no/selectPDADeliverySerialNoList', {
    return request('/server/api/wms-serial-no/viewWmsSerialNoDetailsByDeliveryDetailId', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

