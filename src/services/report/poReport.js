import request from '@/utils/request';
import { stringify } from 'qs';
import { getPageSize } from '@/utils/common';

export async function poReportList(params) {
	params.pageSize = params.pageSize || getPageSize();

	return request(`/server/api/PoReport/selectWmsOutboundNoticeList`, {
		method: 'POST',
		body: params,
		type: 'enableEnum'
	});
}

export async function exportFile(params) {
	params.token = localStorage.getItem('token');
	const url = `/server/api/PoReport/exportInventoryReport?${stringify(params)}`;
	window.open(url);
}