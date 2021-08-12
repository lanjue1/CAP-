import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询 货主信息列表 bms-BillingLog/selectBmsBillingLogList
 * @param params
 */
export async function selectBillingLog(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request('/server/api/bms-billing-log/selectBmsBillingLogList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}


export async function fetchBillingDetails(params) {
  return request('/server/api/bms-billing-log/viewBmsBillingLogDetails', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}