import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// iqc管理列表查询
export async function rmoList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-quality-rmo/selectWmsQualityRmoList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}
//shipto obnotice 的查询接口 wms-quality-rmo/getOBNoticeShip
export async function viewOBNticeShip(params) {
    return request(
        `/server/api/wms-quality-rmo/getOBNoticeShip`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}
// 确定录入|取消确定
export async function ableOperate(params) {
    const {type,...param}=params
    let url;
    switch (type) {
        case 'shipToAPRH':
            url = 'wms-quality-rmo/createOutboundDocuments'
            break;
        case 'createRmaNo':
            url = 'wms-quality-rmo/createRmaNo'
            break;
        case 'createReceipt':
            url='wms-quality-rmo/createAsnReceipt'
            break;
        case 'updateRMA':
            url='wms-quality-rmo/updateRmaNo'
            break;
        case 'cancelAPRH':
            url='wms-quality-rmo/cancelOutboundDocuments'
            break;
    }
    return request(
        `/server/api/${url}`,
        {
            method: 'POST',
            body: param,
        },
        true
    );
}

// 详情 wms-quality-rmo/viewWmsQualityRmoDetails
export async function asnDetails(params) {
    return request(
        `/server/api/wms-quality-rmo/viewWmsQualityRmoDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}
// iqc明细
export async function fetchAsnDetailsList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-quality-doc/viewWmsQualityrecordDetails`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}
//IQC 弹框详情 
export async function visibleList(params) {
    return request(`/server/api/wms-quality-doc/reviewQualityDocView`, {
        method: 'POST',
        body: params,
    });
}
//IQC 弹框 质检审核确认 /wms-quality-doc/reviewQualityDoc
export async function reviewQualityConfirm(params) {
    return request(`/server/api/wms-quality-doc/reviewQualityDoc`, {
        method: 'POST',
        body: params,
    });
}
//IQC 导入 exportWmsQuality/importWmsQuality
export async function importRMO(params) {
    return request(`/server/api/exportWmsQuality/importWmsQuality`, {
        method: 'POST',
        body: params,
    });
}
//IQC 导出 wms-quality-doc/exportWmsQuality
export async function exportRMO(params) {
    // const {ids}=params
    // if(Array.isArray(ids)&&ids.length>0){
    //     ids.forEach((v,index)=>`params.ids[${index}]=${v}`)
    // }
    console.log('params==',params)
    params.token=localStorage.getItem('token')
    let url=`/server/api/wms-quality-doc/exportWmsQuality?${stringify(params)}`
    window.open(url)

    // return request(`/server/api/wms-quality-doc/exportWmsQuality`, {
    //     method: 'POST',
    //     body: params,
    //     type:'File',
    // });
}

export async function forceClose(params) {
    return request(`/server/api/wms-quality-rmo/forceCloseOrder`, {
        method: 'POST',
        body: params,
    });
}
