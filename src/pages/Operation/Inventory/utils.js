import { Modal } from 'antd';
import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import { keyValue } from '@/utils/utils';
import router from 'umi/router';

export const formate = 'YYYY-MM-DD HH:mm:ss';
export const formateNOSecond = 'YYYY-MM-DD HH:mm';
const { confirm } = Modal;


export const Status = [
  { code: 'ENABLE', value: '启用' },
  { code: 'ENABLED', value: '启用' },
  { code: 'DISABLE', value: '禁用' },
];
export const freezeStatus = [
  { code: 'FREEZE', value: 'FREEZE' },
  { code: 'UNFREEZE', value: 'UNFREEZE' },
]

export const routeUrl = {
  add: '/basicData/warehouseBin/warehouseBinAdd',
  edit: '/basicData/warehouseBin/warehouseBinEdit',


};

export const allDispatchType = {
  //请求的url
  list: 'Inventory/selectInventory',
  detail: 'Inventory/viewInventory',
  confirm:'Inventory/stockMoveConfim',

};
export const codes = {
  page: 'ENDORSELIST',
  stockMove:'Inventory_Management_Stock_Move',
  stockPutaway:'inventory_Management_Stock_Putaway',
  lock:'Inventory_Management_Lock_Inventory',
  unlock:'Inventory_Management_Unlock_Inventory',
  importMove:'Inventory_Management_importMove',
};


export function selectList({ payload = {}, props, typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.list,
    payload,
    callback: data => {
      if (!data) return;
      queryPerson({ data, props: props, url: allUrl.userList });
    },
  });

}



export function saveAllValues({ payload = {}, props } = {}) {
  const { dispatch } = props;
  dispatch({
    type: 'MoveTask/allValus',
    payload,
  });
}



export const columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },

  {
    title: 'InventoryList.field.partCode',
    dataIndex: 'partCode',
    width: 120,
  },
  {
    title: 'partData.field.price',
    dataIndex: 'lotUnitPrice',
    width: 120,
  },
  {
    title: 'InventoryList.field.partName',
    dataIndex: 'partName',
    width: 120,

  },
  {
    title: 'InventoryList.field.warehouseName',
    dataIndex: 'warehouseName',
    width: 120,
  },
  {
    title: 'InventoryList.field.binTypeCode',
    dataIndex: 'binTypeCode',
    width: 120,
  },
  {
    title: 'InventoryList.field.binCode',
    dataIndex: 'binCode',
    width: 120,
  },
  {
    title: 'Delivery.field.lotCartonNo',
    dataIndex: 'lotCartonNo',
    width: 160,
  },
  {
    title: 'InventoryList.field.inventoryQty',
    dataIndex: 'inventoryQty',
    width: 120,
  },
  {
    title: 'InventoryList.field.allocatable',
    dataIndex: 'allocatable',
    width: 120,
  },
  {
    title: 'InventoryList.field.pickAllocatedQty',
    dataIndex: 'pickAllocatedQty',
    width: 150,
  },{
    title: 'InventoryList.field.PutawayAllocatedQty',
    dataIndex: 'putawayAllocatedQty',
    width: 180,
  },
  {
    title: 'InventoryList.field.controlStatus',
    dataIndex: 'controlStatus',
    width: 120,
  },
  {
    title: 'InventoryLog.field.asnNo',
    dataIndex: 'asnNo',
    width: 160,
  },
  {
    title: 'InventoryList.field.commodity',
    dataIndex: 'commodity',
    width: 160,
  },
  {
    title: 'InventoryList.field.commodityDesc',
    dataIndex: 'commodityDesc',
    width: 160,
  },
  {
    title: 'InventoryList.field.lotSoi',
    dataIndex: 'lotSoi',
    width: 120,
  },
  {
    title: 'InventoryList.field.storageDate',
    dataIndex: 'storageDate',
    width: 180,
  },
  {
    title: 'InventoryList.field.itemStatus',
    dataIndex: 'partStatus',
    //是否显示type为from时的输入框，不写默认显示（用在新增编辑）
    width: 120,
  },
  {
    title: 'InventoryList.field.lotLocation',
    dataIndex: 'lotLocation',
    width: 120,

  },
  {
    title: 'InventoryList.field.lotCoo',
    dataIndex: 'lotCoo',
    width: 120,

  },
  {
    title: 'InventoryList.field.lotDnNo',
    dataIndex: 'lotDnNo',
    width: 120,
  },
  
  // {
  //   title: 'InventoryList.field.lotInfo',
  //   dataIndex: 'lotInfo',
  //   width: 120,
  // }, {
  //   title: 'InventoryList.field.lotInvoiceNo',
  //   dataIndex: 'lotInvoiceNo',
  //   width: 120,
  // }, {
  //   title: 'InventoryList.field.lotLocation',
  //   dataIndex: 'lotLocation',
  //   width: 120,
  // },
  // {
  //   title: 'InventoryList.field.lotNo',
  //   dataIndex: 'lotNo',
  //   width: 120,
  // },

  // {
  //   title: 'InventoryList.field.lotVendorCode',
  //   dataIndex: 'lotVendorCode',
  //   width: 120,
  // },{
  //   title: 'InventoryList.field.lotVendorName',
  //   dataIndex: 'lotVendorName',
  //   width: 120,
  // },
  {
    title: 'InventoryList.field.referenceCode',
    dataIndex: 'referenceCode',
    width: 180,
  },
  {
    title: 'InventoryList.field.referenceBillType',
    dataIndex: 'referenceBillType',
    width: 180,
  },
  {
    title: 'InventoryList.field.createBy',
    dataIndex: 'createBy',
    width: 120,
  },
  {
    title: 'InventoryList.field.createTime',
    dataIndex: 'createTime',
    width: 120,
  },
  {
    title: 'InventoryList.field.updateBy',
    dataIndex: 'updateBy',
    width: 120,
  },
  {
    title: 'InventoryList.field.updateTime',
    dataIndex: 'updateTime',
    width: 120,
  },
  {
    title: 'InventoryList.field.remarks',
    dataIndex: 'remarks',
    width: 120,
  },

];

export const columnsWare=[
  {
    title:'AllocateInventory.field.binCode',
    dataIndex:'code',

  },
  // {
  //   title:'areaName',
  //   dataIndex:'areaName',
  //   width:80
  // },
  // {
  //   title:'warehouseName',
  //   dataIndex:'warehouseName',
  //   width:80
  // },
]
