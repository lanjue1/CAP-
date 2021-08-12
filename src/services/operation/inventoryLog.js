import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/** 
 * 查询 库存日志列表 /wms-inventory-log/selectWmsInventoryLogList
 * @param params
 */
export async function selectInventoryLog(params) {
  params.pageSize = params.pageSize || getPageSize();
  

  return request('/server/api/wms-inventory-log/selectWmsInventoryLogList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}



/**
 * 查询详情 库存日志 /wms-inventory-log/viewWmsInventoryLogDetails
 * @param params
 */
export async function viewInventoryLog(params) {
  
  return request('/server/api/wms-inventory-log/viewWmsInventoryLogDetails', {
    method: 'POST',
    body: {
      ...params,
    //   method: 'post',
    },
     
  });
}

/**
 * 新增、修改  仓库库位 /wms-warehouse-bin/insertWmsWarehouseBin、/wms-warehouse-bin/updateWmsWarehouseBin
 * @param params
 */
export async function operateWarehouseBin(params) {
  let url= params.id ? 'updateWmsWarehouseBin' : 'insertWmsWarehouseBin';
  return request(`/server/api/wms-warehouse-bin/${url}`, {
    method: 'POST',
    body: {
      ...params,
      // method: 'post',
    },
  });
}


