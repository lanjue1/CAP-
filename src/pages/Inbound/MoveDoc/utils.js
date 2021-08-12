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

export const codes = {
 
  page: 'ENDORSELIST',
  manual:'Putaway_Manual_Allocate',
  cancel:'Putaway_Cancel_Allocation',
  auto:'Putaway_Auto_Allocate',
  taskPutaway:'Putaway_Task_Putaway',
  print:'Putaway_Print'
};
// UNSEALED 草稿、 SUBMITTED 已提交、 CONFIRM 已确认  CANCEL 作废

export const Status = [
  { code: 'ENABLE', value: '启用' }, 
  { code: 'ENABLED', value: '启用' }, 
{ code: 'DISABLED', value: '禁用' },
];
export const isTrue=[
  {code:false,value:'否'},
  {code:true,value:'是'},
]

export const routeUrl = {
  add: '/inbound/moveDoc/moveDocAdd',
  edit: '/inbound/putaway/putawayEdit',
  
  
};

export const allDispatchType = {
  //请求的url selectManualAllot
  list: 'MoveDoc/selectMoveDoc',
  detail: 'MoveDoc/viewMoveDoc',
  detailList:'MoveDoc/selectMoveDocDetail', 
  manuaList:'MoveDoc/selectManualAllot',
  cancelManuaList: 'MoveDoc/cancelAllocationList',

  // 按钮
  manualAllot:'MoveDoc/manualAllocation', //手工分配
  cancelAllot:'MoveDoc/cancelAllocation',  // 取消分配cancelAllocation

  selfAllot:'MoveDoc/autoAllocation', //自动分配 autoAllocation
  confim:'MoveDoc/moveConfirm', //作业下发 moveConfirm
  cancel:'MoveDoc/moveCancel', //作业取消下发 moveCancel

};



export function renderTableAdSearch({ value, props }) {
  if (!value || !searchValue) return '';
  const { searchValue } = props;
  const params = {
    onlyRead: true,
    value: searchValue[value],
    label: 'loginName',
    name: 'sysName',
  };
  return <AdSearch {...params} />;
}

export function selectList({ payload = {}, props,typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.list,
    payload,
    callback: data => {
      if (!data) return;
      // queryPerson({ data, props: props, url: allUrl.userList });
    },
  });
  
}
export function selectDetailList({ payload = {}, props,typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.detailList,
    payload,
    callback: data => {
      if (!data) return;
      // queryPerson({ data, props: props, url: allUrl.userList });
    },
  });
}

export function selectManualAllotList({ payload = {}, props,typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.manuaList,
    payload,
    callback: data => {
      if (!data) return;
      // queryPerson({ data, props: props, url: allUrl.userList });
    },
  });
}
export function selectModThirdList({ payload = {}, props, typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.cancelManuaList,
    payload,
    callback: data => {
      if (!data) return;
    },
  });
}

export function saveAllValues({ payload = {}, props } = {}) {
  const { dispatch } = props;
  dispatch({
    type: 'WarehouseBin/allValus',
    payload,
  });
}

//时间判断：  date1:小日期   date2:大日期
export function DateMinus(date1, date2) {
  if (date1 && date2) {
    var sdate = new Date(date1);
    var now = new Date(date2);
    var days = Number(now.getTime()) - Number(sdate.getTime());
    var day = parseFloat(days / (1000 * 60 * 60 * 24));
    return day.toString();
  }
}

export const columns = [
  {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => (<span>{index + 1}</span>),
      width: 50
  },
  {
      title:'PutAway.field.moveNo',
      dataIndex: 'moveNo',
      
      //表格列的宽度
      width: 150,
      // render: (text, record) => (
      //   <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
      // ),
    },
    
    {
      title: 'PutAway.field.asnNos',
      dataIndex: 'originalBillNo',
      width: 150,
    },
    {
      title:'PutAway.field.beActive',
      dataIndex: 'status',
      width: 100,
    },
    {
      title: 'PutAway.field.planQuantity',
      dataIndex: 'planQuantity',
      width: 120,
    },
    {
      title: 'PutAway.field.allocatedQuantity',
      dataIndex: 'allocatedQuantity',
      width: 120,
    },
    {
      title: 'PutAway.field.movedQuantity',
      dataIndex: 'movedQuantity',
      width: 120,
      
    },
    {
      title: 'PutAway.field.warehouseName',
      dataIndex: 'warehouseName',
      width: 120,
    },
    {
      title: 'PutAway.field.createBy',
      dataIndex: 'createBy',
      width: 120,
    },
    {
      title: 'PutAway.field.createTime',
      dataIndex: 'createTime',
      width: 120,
    },
    {
      title: 'PutAway.field.updateBy',
      dataIndex: 'updateBy',
      width: 120,
    },
    {
      title: 'PutAway.field.updateTime',
      dataIndex: 'updateTime',
      width: 120,
    },
    {
      title: 'PutAway.field.remarks',
      dataIndex: 'remarks',
      width: 120,
    },
];
export const columnsDetail = [
  {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => (<span>{index + 1}</span>),
      width: 50
  },
  {
      title:'PutAwayDetailList.field.moveNo',
      dataIndex: 'moveNo',
      key:'moveNo_2',
     
      //表格列的宽度
      width: 120,
      
    },
    {
      title: 'PutAwayDetailList.field.movedQuantity',
      dataIndex: 'movedQuantity',
      key:'movedQuantity_2',
      width: 120,
    },
    {
      title: 'PutAwayDetailList.field.allocatedQuantity',
      dataIndex: 'allocatedQuantity',
      width: 120,
    },
    {
      title: 'PutAwayDetailList.field.binCode',
      dataIndex: 'binCode',
      width: 120,
    },
    {
      title: 'PutAwayDetailList.field.cargoOwnerName',
      dataIndex: 'cargoOwnerName',
      width: 120,
    },
    {
      title: 'PutAwayDetailList.field.controlStatus',
      dataIndex: 'controlStatus',
      width: 120,
    },
    {
      title: 'PutAwayDetailList.field.coo',
      dataIndex: 'coo',
      width: 120,
    },
    // {
    //   title: 'destCargoOwnerId',
    //   dataIndex: 'destCargoOwnerId',
    //   width: 120,
    // },
    {
      title: 'PutAwayDetailList.field.invoiceNo',
      dataIndex: 'invoiceNo',
      width: 120,
    },
    {
      title: 'PutAwayDetailList.field.itemName',
      dataIndex: 'partName',
      width: 120,
    },{
      title: 'PutAwayDetailList.field.itemStatus',
      dataIndex: 'partStatus',
      width: 120,
    },{
      title: 'PutAwayDetailList.field.lotInfo',
      dataIndex: 'lotInfo',
      width: 120,
    },

    {
      title: 'PutAwayDetailList.field.lotLocation',
      dataIndex: 'lotLocation',
      width: 120,
    },{
      title: 'PutAwayDetailList.field.lotNo',
      dataIndex: 'lotNo',
      width: 120,
    },{
      title: 'PutAwayDetailList.field.soi',
      dataIndex: 'soi',
      width: 120,
    },
    {
      title: 'PutAwayDetailList.field.toBinCode',
      dataIndex: 'toBinCode',
      width: 120,
    },{
      title: 'PutAwayDetailList.field.uom',
      dataIndex: 'uom',
      width: 120,
    },{
      title: 'PutAwayDetailList.field.vendorCode',
      dataIndex: 'vendorCode',
      width: 120,
    },
    {
      title: 'PutAwayDetailList.field.vendorName',
      dataIndex: 'vendorName',
      width: 150,
    },{
      title: 'PutAwayDetailList.field.warehouseName',
      dataIndex: 'warehouseName',
      width: 120,
    },

    {
      title: 'PutAwayDetailList.field.createBy',
      dataIndex: 'createBy',
      width: 100,
    },
    {
      title: 'PutAwayDetailList.field.createTime',
      dataIndex: 'createTime',
      width: 150,
    },
    {
      title: 'PutAwayDetailList.field.updateBy',
      dataIndex: 'updateBy',
      width: 150,
    },
    {
      title: 'PutAwayDetailList.field.updateTime',
      dataIndex: 'updateTime',
      width: 150,
    },
    {
      title: 'PutAwayDetailList.field.remarks',
      dataIndex: 'remarks',
      width: 150,
    },
];


export const columnsAllot = [
  {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => (<span>{index + 1}</span>),
      width: 50
  },
  {
    title: 'PutAwayModal.field.binTypeCode', 
    dataIndex: 'binTypeCode',
    width: 150,
  },
  {
    title: 'PutAwayModal.field.allocatable',
    dataIndex: 'allocatable',
    width: 150,
  },
  {
    title: 'PutAwayModal.field.binCode',
    dataIndex: 'binCode',
    width: 150,
  },
  {
      title:'PutAwayModal.field.cargoOwnerName',
      dataIndex: 'cargoOwnerName',
      //表格列的宽度
      width: 150,
      // render: (text, record) => (
      //   <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
      // ),
    },
    
    {
      title: 'PutAwayModal.field.controlStatus',
      dataIndex: 'controlStatus',
      width: 150,
    },
    {
      title: 'PutAwayModal.field.itemCode',
      dataIndex: 'partCode',
      width: 150,
    },
   
    {
      title: 'PutAwayModal.field.itemName',
      dataIndex: 'partName',
      width: 150,
    },
    {
      title:'PutAwayModal.field.inventoryQty',
      dataIndex: 'inventoryQty',
      width: 100,
    },
    {
      title: 'PutAwayModal.field.itemStatus',
      dataIndex: 'partStatus',
      width: 120,
    },
    {
      title: 'PutAwayModal.field.lotCoo',
      dataIndex: 'lotCoo',
      width: 120,
    },
    {
      title: 'PutAwayModal.field.lotDnNo',
      dataIndex: 'lotDnNo',
      width: 120,
    },
    {
      title: 'PutAwayModal.field.lotInfo',
      dataIndex: 'lotInfo',
      width: 120,
      
    },
    {
      title: 'PutAwayModal.field.lotInvoiceNo',
      dataIndex: 'lotInvoiceNo',
      width: 120,
    },



    {
      title: 'PutAwayModal.field.lotLocation',
      dataIndex: 'lotLocation',
      width: 120,
    
    },

    {
      title: 'PutAwayModal.field.lotNo',
      dataIndex: 'lotNo',
      width: 120,
    },
    {
      title: 'PutAwayModal.field.lotSoi',
      dataIndex: 'lotSoi',
      width: 120,
    },
    {
      title: 'PutAwayModal.field.lotUom',
      dataIndex: 'lotUom',
      width: 120,
    },
    {
      title: 'PutAwayModal.field.lotVendorCode',
      dataIndex: 'lotVendorCode',
      width: 120,
    },
    {
      title: 'PutAwayModal.field.lotVendorName',
      dataIndex: 'lotVendorName',
      width: 120,
    },
    {
      title: 'PutAwayModal.field.pickAllocatedQty',
      dataIndex: 'pickAllocatedQty',
      width: 120,
    },
    {
      title: 'PutAwayModal.field.putawayAllocatedQty',
      dataIndex: 'putawayAllocatedQty',
      width: 120,
    }, {
      title: 'PutAwayModal.field.referenceBillType',
      dataIndex: 'referenceBillType',
      width: 120,
    },
    {
      title: 'PutAwayModal.field.referenceCode',
      dataIndex: 'referenceCode',
      width: 120,
    },
    {
      title: 'PutAwayModal.field.storageDate',
      dataIndex: 'storageDate',
      width: 180,
    },
    {
      title: 'PutAwayModal.field.warehouseName',
      dataIndex: 'warehouseName',
      width: 150,
    },
    {
      title: 'PutAwayModal.field.remarks',
      dataIndex: 'remarks',
      width: 120,
    },
    
];
export const columnsAllotOne = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: 'PickingAllocate.field.allocatedQuantity',
    dataIndex: 'allocatedQuantity',
    width: 150,
  },
  {
    title: 'PickingAllocate.field.binCode',
    dataIndex: 'binCode',
    width: 150,
  },
  {
    title: 'PickingAllocate.field.cargoOwnerName',
    dataIndex: 'cargoOwnerName',
    //表格列的宽度
    width: 150,
    // render: (text, record) => (
    //   <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
    // ),
  },

  {
    title: 'PickingAllocate.field.controlStatus',
    dataIndex: 'controlStatus',
    width: 150,
  },
  {
    title: 'PickingAllocate.field.coo',
    dataIndex: 'coo',
    width: 150,
  },
  // {
  //   title: 'destCargoOwnerName',
  //   dataIndex: 'destCargoOwnerName',
  //   width: 150,
  // },
  {
    title: 'PickingAllocate.field.invoiceNo',
    dataIndex: 'invoiceNo',
    width: 150,
  },
  {
    title: 'ASNDetail.field.partNo',
    dataIndex: 'partNo',
    width: 150,
  },
  {
    title: 'PickingAllocate.field.itemName',
    dataIndex: 'partName',
    width: 150,
  },

  {
    title: 'PickingAllocate.field.itemStatus',
    dataIndex: 'partStatus',
    width: 150,
  }, {
    title: 'lotDnNo',
    dataIndex: 'lotDnNo',
    width: 150,
  }, {
    title: 'PickingAllocate.field.lotInfo',
    dataIndex: 'lotInfo',
    width: 150,
  }, {
    title: 'PickingAllocate.field.lotLocation',
    dataIndex: 'lotLocation',
    width: 150,
  }, {
    title: 'PickingAllocate.field.lotNo',
    dataIndex: 'lotNo',
    width: 150,
  }, {
    title: 'PickingAllocate.field.moveNo',
    dataIndex: 'moveNo',
    width: 150,
  },
  {
    title: 'PickingAllocate.field.movedQuantity',
    dataIndex: 'movedQuantity',
    width: 150,
  },

  {
    title: 'PickingAllocate.field.planQuantity',
    dataIndex: 'planQuantity',
    width: 150,
  },
  {
    title: 'PickingAllocate.field.status',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: 'PickingAllocate.field.soi',
    dataIndex: 'soi',
    width: 100,
  }, {
    title: 'PickingAllocate.field.toBinCode',
    dataIndex: 'toBinCode',
    width: 100,
  }, {
    title: 'PickingAllocate.field.uom',
    dataIndex: 'uom',
    width: 100,
  }, {
    title: 'PickingAllocate.field.vendorCode',
    dataIndex: 'vendorCode',
    width: 100,
  },
  {
    title: 'PickingAllocate.field.vendorName',
    dataIndex: 'vendorName',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.warehouseName',
    dataIndex: 'warehouseName',
    width: 150,
  },
  {
    title: 'PickingAllocate.field.createBy',
    dataIndex: 'createBy',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.createTime',
    dataIndex: 'createTime',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.updateBy',
    dataIndex: 'updateBy',
    width: 150,
  }, {
    title: 'PickingAllocate.field.updateTime',
    dataIndex: 'updateTime',
    width: 150,
  },

  {
    title: 'PickingAllocate.field.remarks',
    dataIndex: 'remarks',
    width: 120,
  },

];
export const columnsBin=[
  {
    title:'code',
    dataIndex:'code',
  },
]



