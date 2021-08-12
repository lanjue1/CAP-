import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 序列号列表查询
export async function fetchSerialNoList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-serial-no/selectWmsSerialNoList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}
