import request from '@/utils/request';
import { stringify } from 'qs';
import { getPageSize } from '@/utils/common';


export async function coReportList(params) {
  params.pageSize = params.pageSize || getPageSize();

  return request(`/server/api/CoReport/selectWmsCoReportList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

export async function exportFile(params) {
  params.token = localStorage.getItem('token');
  const url = `/server/api/CoReport/exportCoReport?${stringify(params)}`;
  window.open(url);
}