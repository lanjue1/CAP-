import request from '@/utils/request';
import { getPageSize } from '@/utils/common';
import { FundTwoTone } from '@ant-design/icons';

/** 
 * 查询 库存列表 /wms-inventory/selectWmsInventoryList
 * @param params
 */
export async function selectInventory(params) {
  params.pageSize = params.pageSize || getPageSize();

  return request('/server/api/wms-inventory/selectWmsInventoryList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}



/**
 * 查询详情 库存 /wms-inventory/viewWmsInventoryDetails
 * @param params
 */
export async function viewInventory(params) {
  return request('/server/api/wms-inventory/viewWmsInventoryDetails', {
    method: 'POST',
    body: {
      ...params,
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
export async function stockMoveConfim(params) {
  let url=''
  switch(params.type){
    case 'stockMove':
      url='stockMove/StockMoveWorkConfirm'
      break;
    case 'stockPutaway':
      url='wms-inventory/stockPutawayWorkConfirm'
      break;
  }
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function abledStatus(params){
  let url= ''
  const {urlType,...param}=params
  switch(urlType){
    case 'lockInventory':
      url='wms-inventory/lockInventory'
      break;
  }
  return request(`/server/api/${url}`, {
    method: 'POST',
    body:param
  });
}

export async function viewInventoryDetail(params){
  return request(`/server/api/wms-inventory/viewWmsInventoryDetails`,{
    method: 'POST',
    body:params
  })
}


