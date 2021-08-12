import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

export async function bireportSign(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/mds-fr/getSignature/${params}/sign_str`, {
    method: 'get',
  });
}
