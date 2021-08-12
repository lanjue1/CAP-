import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 上架单列表查询
export async function shippingList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-outbound-notice/selectWmsOutboundNoticeList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}

// 确定生效|取消生效
export async function ableOperate(params) {
    const url = params.type ? '/wms-outbound-notice/activeOutboundNotice' : '/wms-outbound-notice/cancelActiveOutboundNotice';
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
export async function shippingDetails(params) {
    return request(
        `/server/api/wms-outbound-notice/viewWmsOutboundNoticeDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}
//shipping明细
export async function fetchShippingDetailsList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-outbound-notice-detail/selectWmsOutboundNoticeDetailList`, {
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

export async function fetchDelivery(params) {
    return request(`/server/api/wms-outbound-notice-detail/viewWmsOutboundNoticeDetail`, {
        method: 'POST',
        body: params,
    });
}

export async function generateWmsMoveDoc(params) {
    return request(`/server/api/wms-move-doc/generatePicking`, {
        method: 'POST',
        body: params,
    });
}
//createDelivery /wms-delivery/generateDelivery
export async function createDelivery(params) {
    return request(`/server/api/wms-delivery/generateDelivery`, {
        method: 'POST',
        body: params,
    });
}

//createReceipt
export async function createReceipt(params) {
    return request(`/server/api/wms-outbound-notice/createReceiptByOBNotice`, {
        method: 'POST',
        body: params,
    });
}