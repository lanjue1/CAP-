import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 查询盘点计划表列表
export async function tokenList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-operation-token/selectWmsOperationTokenList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}



// token操作
export async function tokenOperate(params) {
    let url = params.id ? 'wms-operation-token/updateWmsOperationToken' : 'wms-operation-token/insertWmsOperationToken'
    return request(`/server/api/${url}`, {
        method: 'POST',
        body: params,
    });
}



export async function ableOperate(params) {
    let url = params.type === 'confirm' ? '/wms-operation-token/affirmWmsOperationToken' : '/wms-operation-token/deleteWmsOperationToken'
    return request(`/server/api/${url}`, {
        method: 'POST',
        body: params,
    });
}


