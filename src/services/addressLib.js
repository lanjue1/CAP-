import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询地址库列表
 */
export async function selectAddressLibList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/mds-address-lib/selectMdsAddressLibList`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 新增编辑地址
 */
export async function addressLibOperate(params) {
  const url = params.id
    ? 'mds-address-lib/updateMdsAddressLib'
    : 'mds-address-lib/insertMdsAddressLib';

  return request(
    `/server/api/${url}`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

/**
 * 审核地址
 */
export async function checkAddress(params) {
  return request(`/server/api/mds-address-lib/auditAddress`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 地址库详情
 */
export async function addressLibDetail(params) {
  return request(
    `/server/api/mds-address-lib/viewMdsAddressLibDetails`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
