import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询列表
 */
export async function selectDataPermList(params) {
  params.pageSize = params.pageSize || 10;
  return request(`/server/api/mds-dateperm/selectDataPermList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

/**
 * 查询详情
 */
export async function selectDetails(params) {
  return request(`/server/api/mds-dateperm/selectDetails`, {
    method: 'POST',
    body: params,
  });
}
//保存操作
export async function saveSequence(params) {
  const { ...body } = params;
  const url = params.id ? 'updateDatePerm' : 'insertDatePerm';
  return request(`/server/api/mds-dateperm/${url}`, {
    method: 'POST',
    body,
  });
}
//启用禁用：
export async function enableDataAuthority(params) {
  const { type, enable, ...body } = params;
  const url = enable ? 'startDatePerm' : 'stopDataPerm';
  return request(
    `/server/api/mds-dateperm/${url}`,
    {
      method: 'POST',
      body,
    },
    true
  );
}
