import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 查询盘点计划表列表
export async function stockCountList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-count-plan/selectWmsCountPlanList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}

// 详情
export async function stockCountDetails(params) {
    return request(
        `/server/api/wms-count-plan/viewWmsCountPlanDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}
// 盘点计划明细
export async function fetchstockCountDetailsList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-count-detail/selectWmsCountDetailList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}


// stockCount操作
export async function stockCountOperate(params) {
    let url = params.id ? 'wms-count-plan/updateWmsCountPlan' : 'wms-count-plan/insertWmsCountPlan'
    return request(`/server/api/${url}`, {
        method: 'POST',
        body: params,
    });
}


export async function selectWmsCountPlanInfo(params) {
    return request(`/server/api/wms-count-plan/selectWmsCountPlanInfo`, {
        method: 'POST',
        body: params,
    });
}

export async function insertWmsCountDetail(params) {
    return request(`/server/api/wms-count-detail/insertWmsCountDetail`, {
        method: 'POST',
        body: params,
    });
}

export async function ableOperate(params) {
    let url = params.type === 'confirm' ? 'wms-count-plan/confirm' : 'wms-count-plan/cancelConfirm'
    return request(`/server/api/${url}`, {
        method: 'POST',
        body: params,
    });
}


