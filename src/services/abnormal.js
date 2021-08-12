import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

export async function abnormalList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/ems/abnormal-info/selectList`, {
    method: 'POST',
    body: params,
  });
}

export async function abnormalDetail(params) {
  const { type, ...body } = params;
  const url = type === 'open' ? 'open/selectViewDetails' : 'abnormal-info/viewDetails';
  return request(`/server/api/ems/${url}`, {
    method: 'POST',
    body: params,
  });
}
//新增异常差错
export async function abnormalAdd(params) {
  return request(
    `/server/api/ems/abnormal-info/addAbnormalInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//编辑异常差错
export async function abnormalEdit(params) {
  return request(
    `/server/api/ems/abnormal-info/updateAbnormalInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//新增跟进记录
export async function abnormalInfoAdd(params) {
  return request(
    `/server/api/ems/abnormal-follow-up/addAbnormalFollowUp`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//新增收付款
// export async function addAbnormalTrading(params) {
//   return request(
//     `/server/api/ems/abnormal-trading/addAbnormalTrading`,
//     {
//       method: 'POST',
//       body: params,
//     },
//     true
//   );
// }
//收款
export async function addReceivables(params) {
  return request(`/server/api/ems/abnormal-trading/addReceivables`, {
    method: 'POST',
    body: params,
  });
}
//付款
export async function addPayment(params) {
  return request(`/server/api/ems/abnormal-trading/addPayment`, {
    method: 'POST',
    body: params,
  });
}
//查询跟进
export async function abnormalInfoList(params) {
  const { type, ...body } = params;
  const url = type === 'open' ? 'open/selectFlowUpList' : 'abnormal-follow-up/selectList';
  return request(`/server/api/ems/${url}`, {
    method: 'POST',
    body: body,
  });
}
//查询收付款
export async function abnormalInfoPayList(params) {
  const { type, ...body } = params;
  const url = type === 'open' ? 'open/selectTradingList' : 'abnormal-trading/selectList';
  return request(`/server/api/ems/${url}`, {
    method: 'POST',
    body: body,
  });
}

export async function abnormalInfoDetail(params) {
  return request(`/server/api/ems/abnormal-info/viewDetails`, {
    method: 'POST',
    body: params,
  });
}
//用户列表
export async function userList(params) {
  return request(`/server/api/mds-user/selectList`, {
    method: 'POST',
    body: params,
  });
}
//处理完成：
export async function confirmFinish(params) {
  return request(`/server/api/ems/abnormal-info/confirmFinish`, {
    method: 'POST',
    body: params,
  });
}
//附件列表：
export async function selectFileList(params) {
  const { type, ...body } = params;
  const url = type === 'open' ? 'open/selectAttachmentList' : 'attachment/selectFileList';
  return request(`/server/api/ems/${url}`, {
    method: 'POST',
    body: params,
  });
}
//跟进删除
export async function deleteFollowUp(params) {
  return request(`/server/api/ems/abnormal-follow-up/deleteFollowUp`, {
    method: 'POST',
    body: params,
  });
}
//收付款删除
export async function deleteAbnormalTrading(params) {
  return request(`/server/api/ems/abnormal-trading/deleteAbnormalTrading`, {
    method: 'POST',
    body: params,
  });
}
