import { Modal } from 'antd';
import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import { keyValue } from '@/utils/utils';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import { transferLanguage } from '@/utils/utils'

import router from 'umi/router';



export const formate = 'YYYY-MM-DD HH:mm:ss';
export const formateNOSecond = 'YYYY-MM-DD HH:mm';
const { confirm } = Modal;

export const codes = {
  page: 'EVENTSPAGE',
  manual:'Picking_Management_Manual_Allocate',
  auto:'Picking_Management_Auto_Allocate',
  printSDI:'Picking_Management_Print_SDI',
  printPicking:'Picking_Management_Print_Picking',
  printVirtualSN:'Picking_Management_Print_VirtualSN',
  printDummySN:'Picking_Management_Print_DummySN',
  taskPick:'Picking_Management_Task_Picking',
  assignWorker:'Picking_Management_Assign_Worker',
};
// UNSEALED 草稿、 SUBMITTED 已提交、 CONFIRM 已确认  CANCEL 作废

export const Status = [
  { code: 'OPEN', value: 'OPEN' },  // 打开
  { code: 'PARTALLOCATED', value: 'PARTALLOCATED' }, // 部分分配
  { code: 'ALLOCATED', value: 'ALLOCATED' }, // 整单分配
  { code: 'WAITWORK', value: 'WAITWORK' }, // 待作业
  { code: 'WORKING', value: 'WORKING' }, // 作业中
  { code: 'FINISHED', value: 'FINISHED' }, // 完成
  { code: 'CANCELED', value: 'CANCELED' }, // 取消
];
export const isTrue = [
  { code: false, value: 'N' },
  { code: true, value: 'Y' },
]

export const SelectColumns1 = [
  {
    title: 'BillTypeList.field.code',
    dataIndex: 'code',
    width:60,
  },
  {
    title: 'BillTypeList.field.name',
    dataIndex: 'name',
    width: 150,
  },
]


export const columns1 = [
  {
    title: 'User ID',
    dataIndex: 'loginName',
    render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
    width: 80
  },
  {
    title: 'User Name',
    dataIndex: 'sysName',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 80
  }
]

export const routeUrl = {
  // add: '/inbound/moveDoc/moveDocAdd',
  edit: '/outbound/picking/pickingEdit',
  detail: '/outbound/picking/pickingDetail',

};

export const allDispatchType = {
  //请求的url selectManualAllot
  list: 'Picking/selectPicking',
  detail: 'Picking/viewPickDetail',
  detailList: 'Picking/selectPickDetail',
  manuaList: 'Picking/selectMoveDocDetailList',
  cancelManuaList: 'Picking/cancelAllocationList',
  modSecondList: 'Picking/selectInventoryList',

  // 按钮
  manualAllot: 'Picking/manualAllocation', //手工分配
  cancelAllot: 'Picking/cancelAllocation',  // 取消分配cancelAllocation

  selfAllot: 'Picking/autoAllocation', //自动分配 autoAllocation
  confim: 'Picking/moveConfirm', //作业下发 moveConfirm
  cancel: 'Picking/moveCancel', //作业取消下发 moveCancel
  print: 'Picking/pickingPrint'//打印详情
};



export function selectList({ payload = {}, props, typeUrl } = {}) {
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
export function selectDetailList({ payload = {}, props, typeUrl } = {}) {
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

export function selectMoveDocDetailList({ payload = {}, props, typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.manuaList,
    payload,
    callback: data => {
      if (!data) return;
    },
  });
}
export function selectModSecondList({ payload = {}, props, typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.modSecondList,
    payload,
    callback: data => {
      if (!data) return;
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

export function selectSerialList({ payload = {}, props, typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.seriaList,
    payload,
    callback: data => {
      if (!data) return;
    },
  });
}
//list 页面
export const columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: 'Picking.field.pickingNo',
    dataIndex: 'pickingNo',
    width: 150,
    render:(text,record)=>(<a onClick={()=>router.push(`${routeUrl.detail}/${record.id}`)}>{text}</a>)
   
  },
  {
    title: 'Picking.field.beActive',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: 'ASN.field.orderType',
    dataIndex: 'orderType',
    width: 100,
  },
  {
    title: 'ASNRecord.field.workerName',
    dataIndex: 'workId',
    width: 100,
  },
  {
    title: 'Picking.field.planPickingBin',
    dataIndex: 'planPickingBin',
    width: 100,
  }, {
    title: 'CoDetailList.field.soDetailNo',
    dataIndex: 'soId',
    width: 100,
  }, {
    title: 'CoList.field.bizSoNo',
    dataIndex: 'soNo',
    width: 100,
  }, {
    title: 'CoList.field.bizCoNo',
    dataIndex: 'coNo',
    width: 100,
  }, {
    title: 'PoDetailList.field.partNo',
    dataIndex: 'partNo',
    width: 100,
  },
  {
    title: 'PoDetailList.field.partDesc',
    dataIndex: 'partDesc',
    width: 100,
  },
  {
    title: 'PoDetailList.field.pieceQty',
    dataIndex: 'planQuantity',
    width: 100,
  }, {
    title: 'Picking.field.openQty',
    dataIndex: 'openQty',
    width: 100,
  },
  // {
  //   title: 'PoDetailList.field.grossWeight',
  //   dataIndex: 'grossWeight',
  //   width: 100,
  // }, {
  //   title: 'PoDetailList.field.netWeight',
  //   dataIndex: 'netWeight',
  //   width: 100,
  // }, {
  //   title: 'PoDetailList.field.volume',
  //   dataIndex: 'volume',
  //   width: 100,
  // }, {
  //   title: 'PoDetailList.field.unitPrice',
  //   dataIndex: 'unitPrice',
  //   width: 100,
  // },
  {
    title: 'PoDetailList.field.etd',
    dataIndex: 'etd',
    width: 100,
  },
  {
    title: 'Picking.field.soprioritycode',
    dataIndex: 'soprioritycode',
    width: 150,
  },
  {
    title: 'Picking.field.sodeliverytype',
    dataIndex: 'sodeliverytype',
    width: 120,
  },
  {
    title: 'Picking.field.servicelevel',
    dataIndex: 'servicelevel',
    width: 120,
  },
  {
    title: 'Picking.field.shippingmethod',
    dataIndex: 'shippingmethod',
    width: 120,

  },
  {
    title: 'Picking.field.pmcustomerind',
    dataIndex: 'pmcustomerind',
    width: 120,
    render: (text) => {
      return (<text>{text ? 'true' : 'false'}</text>)
    }
  },
  {
    title: 'Picking.field.altshiptoname',
    dataIndex: 'altshiptoname',
    width: 120,
  },
  {
    title: 'Picking.field.altshiptocity',
    dataIndex: 'altshiptocity',
    width: 100,
  },

  {
    title: 'Picking.field.altshiptopostcode',
    dataIndex: 'altshiptopostcode',
    width: 150,
  },
  {
    title: 'Picking.field.altshiptocontactor',
    dataIndex: 'altshiptocontactor',
    width: 120,
  },
  {
    title: 'Picking.field.altshiptoemail',
    dataIndex: 'altshiptoemail',
    width: 120,
  },
  {
    title: 'Picking.field.altshiptophone',
    dataIndex: 'altshiptophone',
    width: 120,

  },
  {
    title: 'Picking.field.altshiptoadd',
    dataIndex: 'altshiptoadd',
    width: 120,
  },
  {
    title: 'Picking.field.remarks',
    dataIndex: 'remarks',
    width: 120,
  },
  {
    title: 'Picking.field.updateBy',
    dataIndex: 'updateBy',
    width: 120,
  },
  {
    title: 'Picking.field.updateTime',
    dataIndex: 'updateTime',
    width: 120,
  },

];
//分配 页面 手工分配+取消分配
export const columnsAllot = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: 'PickingAllocate.field.binTypeCode',
    dataIndex: 'binTypeCode',
    width: 150,
  },
  {
    title: 'PickingAllocate.field.allocatable',
    dataIndex: 'allocatable',
    width: 150,
  },
  {
    title: 'PickingAllocate.field.binCode',
    dataIndex: 'binCode',
    width: 150,
  },
  {
    title: 'PickingAllocate.field.allotQty',
    dataIndex: 'allotQty',
    width: 150,
    render: (text, record) => {
      const { disabled, commonParams } = this.props
      return (
        <AntdFormItem
          label=" "
          code={`allotQty-${record.id}`}
          initialValue={text}
          {...commonParams}
        >
          <AntdInput
            disabled={disabled}
          // onChange={value => this.handleFieldChange(value, 'miscellaneousNo', record.id)}
          // placeholder="保存后系统自动生成"
          />
        </AntdFormItem>

      )
    }
  },
  {
    title: 'PickingAllocate.field.cargoOwnerName  ',
    dataIndex: 'cargoOwnerName  ',
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
    title: 'PickingAllocate.field.itemCode',
    dataIndex: 'partCode',
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
    title: 'PickingAllocate.field.inventoryQty',
    dataIndex: 'inventoryQty',
    width: 100,
  },
  {
    title: 'PickingAllocate.field.itemStatus',
    dataIndex: 'partStatus',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.lotCoo',
    dataIndex: 'lotCoo',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.lotDnNo',
    dataIndex: 'lotDnNo',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.lotInfo',
    dataIndex: 'lotInfo',
    width: 120,

  },
  {
    title: 'PickingAllocate.field.lotInvoiceNo',
    dataIndex: 'lotInvoiceNo',
    width: 120,
  },



  {
    title: 'PickingAllocate.field.lotLocation',
    dataIndex: 'lotLocation',
    width: 120,

  },

  {
    title: 'PickingAllocate.field.lotNo',
    dataIndex: 'lotNo',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.lotSoi',
    dataIndex: 'lotSoi',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.lotUom',
    dataIndex: 'lotUom',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.lotVendorCode',
    dataIndex: 'lotVendorCode',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.lotVendorName',
    dataIndex: 'lotVendorName',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.pickAllocatedQty',
    dataIndex: 'pickAllocatedQty',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.PICKINGAllocatedQty',
    dataIndex: 'PICKINGAllocatedQty',
    width: 120,
  }, {
    title: 'PickingAllocate.field.referenceBillType',
    dataIndex: 'referenceBillType',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.referenceCode',
    dataIndex: 'referenceCode',
    width: 120,
  },
  {
    title: 'PickingAllocate.field.storageDate',
    dataIndex: 'storageDate',
    width: 180,
  },
  {
    title: 'PickingAllocate.field.warehouseName',
    dataIndex: 'warehouseName',
    width: 150,
  },
  {
    title: 'PickingAllocate.field.remarks',
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
    width: 150,
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
export const columnsBin = [
  {
    title: 'code',
    dataIndex: 'code',
  },
]
export const columnsSerial=[
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: 'Delivery.field.serialNo',
    dataIndex: 'serialNo',
    width: 120,
    
  },
  {
    title: 'Delivery.field.asnNo',
    dataIndex: 'asnNo',
    width: 120,
    
  },
  {
    title: 'Delivery.field.beReturn',
    dataIndex: 'beReturn',
    width: 120,
    
  },
  {
    title: 'Delivery.field.beShipAdd',
    dataIndex: 'beShipAdd',
    width: 120,
  },
  {
    title: 'Delivery.field.deliveryNo',
    dataIndex: 'deliveryNo',
    width: 120,
  },
  {
    title: 'Delivery.field.itemCode',
    dataIndex: 'itemCode',
    width: 120,
  },

  {
    title: 'Delivery.field.lotCartonNo',
    dataIndex: 'lotCartonNo',
    width: 120,
  },{
    title: 'Delivery.field.lotCoo',
    dataIndex: 'lotCoo',
    width: 120,
  },{
    title: 'Delivery.field.lotDnNo',
    dataIndex: 'lotDnNo',
    width: 120,
  },
  {
    title: 'Delivery.field.lotInfo',
    dataIndex: 'lotInfo',
    width: 120,
  },
  {
    title: 'Delivery.field.lotInvoiceNo',
    dataIndex: 'lotInvoiceNo',
    width: 120,

  },
  {
    title: 'Delivery.field.lotLocation',
    dataIndex: 'lotLocation',
    width: 120,
  },
  {
    title: 'Delivery.field.lotNo',
    dataIndex: 'lotNo',
    width: 120,

  }, {
    title: 'Delivery.field.lotSoi',
    dataIndex: 'lotSoi',
    width: 120,

  },
  {
    title: 'Delivery.field.lotUom',
    dataIndex: 'lotUom',
    width: 120,

  },
  {
    title: 'Delivery.field.lotVendorCode',
    dataIndex: 'lotVendorCode',
    width: 120,
  }, {
    title: 'Delivery.field.lotVendorName',
    dataIndex: 'lotVendorName',
    width: 120,
  },{
    title: 'Delivery.field.quantity',
    dataIndex: 'quantity',
    width: 120,
  },{
    title: 'Delivery.field.receiveDate',
    dataIndex: 'receiveDate',
    width: 120,
  }, {
    title: 'Delivery.field.receiveWorker',
    dataIndex: 'receiveWorker',
    width: 120,
  },{
    title: 'Delivery.field.shipDate',
    dataIndex: 'shipDate',
    width: 120,
  },
  {
    title: 'Delivery.field.shipWorker',
    dataIndex: 'shipWorker',
    width: 120,
  },
  {
    title: 'Delivery.field.status',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: 'Delivery.field.createBy',
    dataIndex: 'createBy',
    width: 120,
  },
  {
    title: 'Delivery.field.createTime',
    dataIndex: 'createTime',
    width: 120,
  },
  {
    title: 'Delivery.field.updateBy',
    dataIndex: 'updateBy',
    width: 120,
  },
  {
    title: 'Delivery.field.updateTime',
    dataIndex: 'updateTime',
    width: 120,
  },
  {
    title: 'Delivery.field.remarks',
    dataIndex: 'remarks',
    width: 120,
  },
]



