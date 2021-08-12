import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/** 
 * 查询 作业任务日志 列表 /wms-move-task-log/selectWmsMoveTaskLogList
 * @param params
 */
export async function selectMoveTaskLog(params) {
  params.pageSize = params.pageSize || getPageSize();

  return request('/server/api/wms-move-task-log/selectWmsMoveTaskLogList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}



/**
 *  作业任务 确认按钮 /wms-move-task/workConform
 * @param params
 */
export async function confirmMoveTask(params) {
  
  return request('/server/api/wms-move-task/workConfirm', {
    method: 'POST',
    body: {
      ...params,
    //   method: 'post',
    },
     
  });
}
//作业任务日志 详情 /wms-move-task-log/viewWmsMoveTaskLogDetails
export async function viewMoveTaskLog(params) {
  
  return request('/server/api/wms-move-task-log/viewWmsMoveTaskLogDetails', {
    method: 'POST',
    body: {
      ...params,
    //   method: 'post',
    },
     
  });
}

/**
 * 新增、修改  仓库库位 /wms-warehouse-bin/insertWmsWarehouseBin、/wms-warehouse-bin/updateWmsWarehouseBin
 * @param params
 */
export async function operateWarehouseBin(params) {
  let url= params.id ? 'updateWmsWarehouseBin' : 'insertWmsWarehouseBin';
  return request(`/server/api/wms-warehouse-bin/${url}`, {
    method: 'POST',
    body: {
      ...params,
      // method: 'post',
    },
  });
}


