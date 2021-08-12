import request from '@/utils/request';
export async function queryComponentList(payload) {
  const { params, url } = payload;
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: params,
  });
}

export async function queryOwnCompany() {
  return request(`/server/api/d-customer/selectCompany`, {
    method: 'POST',
    body: {},
  });
}

export async function querytDictByCode(params) {
  return request(`/server/api/mds-dict-data/selectDictByCode`, {
    method: 'POST',
    body: params,
  });
}

export async function querytReport(params) {
  return request(`/server/api/BiReport/getBiReportURI`, {
    method: 'POST',
    body: params,
  });
}
