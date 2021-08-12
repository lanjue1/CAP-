import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 序列号列表查询
export async function selectList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-operation-log/selectWmsOperationLogList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}
export async function abledOperate(params) {
    const {type,...param}=params
    let url=''
    switch(type){
        case '':
            url=''
            break;
    }
    return request(`/server/api/${url}`, {
        method: 'POST',
        body: params,
    });
}
