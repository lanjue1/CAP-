import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询 货主信息列表 wms-operation-log/selectWmsOperationLogList
 * @param params
 */
export async function selectList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request('/server/api/wms-operation-log/selectWmsOperationLogList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

/**
 * 启用|禁用 货主信息 禁用：/wms-contact-unit/disabledWmsLoad
 * @param params
 */


export async function abledOperate(params) {
  const { type, ...param } = params;
  let url = ''
  switch (type) {
    case 'cancel':
      url = 'bms-billing/cancelBilling'
      break;
    case 'check':
      url = 'bms-billing/checkBilling'
      break;
    case 'cancelCheck':
      url = 'bms-billing/cancelCheckedBilling'
      break;
    case 'billing':
      url = 'bms-billing/billing'
      break;
    case 'accept':
      url = 'bms-billing/acceptBilling'
      break;
    case 'cancelAccept':
      url = 'bms-billing/cancelAcceptBilling'
      break;
  }

  return request(`/server/api/${url}`, {
    method: 'POST',
    body: param,
  });
}






