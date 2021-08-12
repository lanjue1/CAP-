import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * @author xmgdty
 * @description 查询BI报表配置表列表
 * @param params
 * @time  2021/4/20
 */
export async function biConfigList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/biConfig/selectBiConfigList`, {
        method: 'POST',
        body: params,
    });
}


/**
 * @author xmgdty
 * @description 修改、新增BI报表配置表  updateBiConfig(修改) insertBiConfig(新增)
 * @param params
 * @time  2021/4/20
 */
export async function biConfigOperate(params) {
    const url = params.id ? '/biConfig/updateBiConfig' : '/biConfig/insertBiConfig';
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
 * @author xmgdty
 * @description 查询BI报表配置表详情
 * @param params
 * @time  2021/4/20
 */
export async function viewBiConfigDetails(params) {
    return request(
        `/server/api/biConfig/viewBiConfigDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}


/**
 * @author xmgdty
 * @description 删除BI报表配置表记录
 * @param params
 * @time  2021/4/20
 */
export async function deleteBiConfig(params) {
    return request(
        `/server/api/biConfig/deleteBiConfig`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}
