import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/** 
 * 查询 作业任务列表 /wms-move-task/selectWmsPickingTaskList
 * @param params
 */
export async function selectPickingTask(params) {
  params.pageSize = params.pageSize || getPageSize();

    return request('/server/api/wms-move-task/pickingPutawayList', {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}



/**
 *  作业任务 确认按钮 /wms-move-task/workConform
 * @param params
 */
export async function confirmPickingTask(params) {
    return request('/server/api/wms-move-task/workConfirm', {
        method: 'POST',
        body: {
            ...params,
            //   method: 'post',
        },
    });
}

//  MarkSkip
export async function abledStatus(params) {
    let url = ''
    switch (params.type) {
        case 'markSkip':
            url = 'wms-move-task/markSkip'
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

export async function pickingTaskSave(params) {
    return request('/server/api/wms-move-task/pickingPutawayWorkConfirm', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}


export async function markSkip(params) {
    return request('/server/api/wms-move-task/markSkip', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}