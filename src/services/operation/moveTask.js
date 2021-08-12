import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/** 
 * 查询 作业任务列表 /wms-move-task/selectWmsMoveTaskList
 * @param params
 */
export async function selectMoveTask(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request('/server/api/wms-move-task/selectWmsMoveTaskList', {
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
//  MarkSkip
export async function abledStatus(params) {
  let url=''
  switch(params.type){
    case 'markSkip':
      url='wms-move-task/markSkip'
      break;
  }
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: {
      ...params,
    //   method: 'post',
    },
  });
}

