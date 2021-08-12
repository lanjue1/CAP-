import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

//一、仓库管理列表查询
export async function fetchReceivingList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-asn-log/selectWmsAsnLogList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}
