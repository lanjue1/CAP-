import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// iqc管理列表查询
export async function iqcList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-quality-doc/selectWmsQualityDocList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}

// 确定录入|取消确定
export async function ableOperate(params) {
    let url;
    switch (params.type) {
        case 'confirm':
            url = 'wms-quality-doc/confirmQualityDoc'
            break;
        case 'cancel':
            url = 'wms-quality-doc/cancelConfirmQualityDoc'
            break;
        case 'recordQuality':
            url = 'wms-quality-doc/recordQualityDoc'
            break;
        case 'reviewQuality':
            url = 'wms-quality-doc/reviewQualityDoc'
            break;
        case 'shipToAPRH':
            url = 'wms-quality-doc/createOutboundDocuments'
            break;
        case 'createRmaNo':
            url = 'wms-quality-doc/createRmaNo'
            break;
        case 'createReceipt':
            url = 'wms-quality-doc/createIqcReceipt'
            break;
        case 'onHold':
            url = 'wms-quality-doc/holdQualityDoc'
            break;
        case 'unOnHold':
            url = 'wms-quality-doc/cancelHoldQualityDoc'
            break;
        case 'cancelAPRH':
            url='wms-quality-doc/cancelOutboundDocuments'
            break;
        case 'cancelCheck':
            url='wms-quality-doc/qualityDocCancel'
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
        `/server/api/wms-quality-doc/viewWmsQualityDocDetails`,
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
export async function importIQC(params) {
    return request(`/server/api/exportWmsQuality/importWmsQuality`, {
        method: 'POST',
        body: params,
    });
}
//IQC 导出 wms-quality-doc/exportWmsQuality
export async function exportIQC(params) {
    params.token = localStorage.getItem('token')
    let url = `/server/api/wms-quality-doc/exportWmsQuality?${stringify(params)}`
    window.open(url)
}

// IQCTask 存储
export async function qualityDocCheck(params) {
    return request(`/server/api/wms-quality-doc/qualityDocCheck`, {
        method: 'POST',
        body: params,
    });
}

// IQCTask 计算
export async function logicQualityResult(params) {
    return request(`/server/api/wms-quality-doc/logicQualityResult`, {
        method: 'POST',
        body: params,
    });
}

// IQCTask 确定
export async function logicQualityConfirm(params) {
    return request(`/server/api/wms-quality-doc/logicQualityResultConfirm`, {
        method: 'POST',
        body: params,
    });
}



