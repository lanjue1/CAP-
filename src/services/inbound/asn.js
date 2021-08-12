import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 仓库管理列表查询
export async function asnList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-asn/selectWmsAsnList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}

// 确定录入|取消确定
export async function ableOperate(params) {
    // console.log('params.type???',params.type)
    let url=''
    switch(params.type){
        case 'cancel':
            url='wms-asn/cancelConfirmWmsAsn'
            break;
        case 'confirm':
            url='wms-asn/confirmWmsAsn'
            break;
        case 'createReceipt':
            url='wms-asn/createAsnReceipt'
            break;
        case 'allPartReceive':
            url=params.secondType?'wms-asn/asnClosed':'wms-asn/asnAllPartReceive'
            break;
    }
    return request(
        `/server/api/${url}`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}

// 详情
export async function asnDetails(params) {
    return request(
        `/server/api/wms-asn/viewWmsAsnDetail`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}
//asn明细
export async function fetchAsnDetailsList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-asn-details/selectWmsAsnDetailList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'

    });
}

//收货详情
export async function fetchDeliveryDetails(params) {
    return request(`/server/api/wms-asn-details/getWmsAsnDetailReceive`, {
        method: 'POST',
        body: params,
    });
}

export async function receiveWmsAsnDetails(params) {
    return request(`/server/api/wms-asn-details/receiveWmsAsnDetails`, {
        method: 'POST',
        body: params,
    });
}

export async function fetchDelivery(params) {
    return request(`/server/api/wms-asn-details/viewWmsAsnDetailDetails`, {
        method: 'POST',
        body: params,
    });
}

export async function generateWmsMoveDoc(params) {
    return request(`/server/api/wms-move-doc/generateWmsMoveDoc`, {
        method: 'POST',
        body: params,
    });
}

export async function asnReceiveConfirm(params) {
    return request(`/server/api/wms-asn/wmsAsnReceiveConfirm`, {
        method: 'POST',
        body: params,
    });
}

export async function asnCancel(params) {
    return request(`/server/api/wms-asn/cancelWmsAsn`, {
        method: 'POST',
        body: params,
    });
}
export async function saveShipmentArrivalTime(params) {
    return request(`/server/api/wms-asn/saveShipmentArrivalTime`, {
        method: 'POST',
        body: params,
    });
}