import { func } from 'prop-types';
import AdSelect from '@/components/AdSelect';
import router from 'umi/router';

export const codes = {
  page: 'EVENTSPAGE',
  cancel:'Obnotice_Management_Cancel_Activation',
  active:'Obnotice_Management_Active',
  pick:'Obnotice_Management_Create_Picking',
  delivery:'Obnotice_Management_Create_Delivery',
  receipt:'Obnotice_Management_Create_Receipt',
  
};

export const ReceivedPackageUnit = [
  { code: 'PALLET', value: '板' },
  { code: 'BOX', value: '箱' },
  { code: 'PCS', value: 'pcs' },
];

//通知方式
export const Type = [
  { code: 'NORMAL', value: '正常入库' },
  { code: 'RETURN', value: '退货入库' },
];
//状态
export const Status = [
  { code: 'OPEN', value: 'OPEN' },
  { code: 'ACTIVE', value: 'ACTIVE' },
  { code: 'WORKING', value: 'WORKING' },
  { code: 'FINISHED', value: 'FINISHED' },
];
//请求类型
export const RequestType = [{ code: 'SEND', value: '发送' }, { code: 'RECEIVE', value: '接收' }];

//事件类型
export const EventType = [
  { code: 'INTERFACE-EXCEPTION', value: '接口异常' },
  { code: 'BUSINESS-REMINDERS', value: '业务提醒' },
];

export const Putaway = [
  { 'WAIT_WORK': 'WAIT_WORK' },
  { 'WAIT_PUYAWAY': 'WAIT_PUYAWAY' },
  { 'PUYAWAYING': 'PUYAWAYING' },
  { 'FINISHED': 'FINISHED' },
]

export function formatStatus(n) {
  switch (n) {
    case 'ENABLE':
      return '启用';
      break;
    case 'DISABLE':
      return '禁用';
      break;
    default:
      return '';
  }
}

export const Columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: 'CoDetailList.field.SOID',
    dataIndex: 'soId',
    // render: (text, record) => (
    //   <a onClick={e => { router.push(`/outbound/shipping/detailInfo/${record.id}`) }} title={text}>
    //     {text}
    //   </a>
    // ),
    width: 150,
  },
  {
    title: 'shipping.field.status',
    dataIndex: 'status',
    render: text => <span title={text}>{text}</span>,
    width: 100,
  },
  // {
  //   title: 'shipping.field.bizType',
  //   dataIndex: 'bizType',
  //   render: text => <span title={text}>{text}</span>,
  //   width: 110,
  // },
  // {
  //   title: 'CoDetailList.field.item',
  //   dataIndex: 'item',
    
  //   width: 150,
  // },
  // {
  //   title: 'CoDetailList.field.referenceItem',
  //   dataIndex: 'referenceitemid',
    
  //   width: 100,
  // },
  
  {
    title: 'CoDetailList.field.partNo',
    dataIndex: 'partNo',
    
    width: 100,
  },
  {
    title: 'CoDetailList.field.partDesc',
    dataIndex: 'partDesc',
    
    width: 100,
  },
  {
    title: 'CoDetailList.field.pieceQty',
    dataIndex: 'planPieceQty',
    
    width: 100,

  },
  {
    title: 'CoDetailList.field.meas',
    dataIndex: 'lineitemqtyunit',
    
    width: 100,

  },
  // {
  //   title: 'CoDetailList.field.unitPrice',
  //   dataIndex: 'unitPrice',
    
  //   width: 100,
  // },
  {
    title: 'CoDetailList.field.subParts',
    dataIndex: 'nonsubpartind',
    width: 100,
  },
  {
    title:'CoDetailList.field.milkrun',
    dataIndex: 'beMilkrun',
  },
  {
    title: 'CoDetailList.field.return',
    dataIndex: 'beReturn',
    // render:(text,record)=>(<AdSelect data={text} value={text} onlyRead={true} />)
  },
  {
    title: 'CoDetailList.field.returnStatus',
    dataIndex: 'returnStatus',
    
  },

  {
    title: 'PoDetailList.field.eta',
    dataIndex: 'eta',
    
  },
  {
    title: 'CoDetailList.field.category',
    dataIndex: 'itemcategory',
    
  },
  {
    title: 'CoDetailList.field.partsSn',
    dataIndex: 'partserialnumber',
    
  },
  {
    // title: '毛重',
    title: 'CoDetailList.field.grossWeight',
    dataIndex: 'grossWeight',
    
  },
  {
    // title: '净重',
    title: 'CoDetailList.field.netWeight',
    dataIndex: 'netWeight',
    
  },
  {
    // title: '体积',
    title: 'CoDetailList.field.volume',
    dataIndex: 'volume',
    
  },
  {
    title: 'CoDetailList.field.forwarder',
    dataIndex: 'forwarder',
    
  },
  {
    // title: '货物运输跟踪单号',
    title: 'ASN.field.bolNo',
    dataIndex: 'bolNo',
    render: text => <span title={text}>{text}</span>,
  },
  {
    // title: '备注',
    title: 'CoDetailList.field.remarks',
    dataIndex: 'remarks',
  },
  {
    title: 'CoList.field.committedTime',
    dataIndex: 'committedsericedate',
  },
  {
    title: 'CoDetailList.field.updateBy',
    dataIndex: 'updateBy',
  },
  {
    title: 'CoDetailList.field.updateTime',
    dataIndex: 'updateTime',
  },
]

export const columns1 = [
  {
    title: 'userId',
    dataIndex: 'loginName',
    render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
    width: 80
  },
  {
    title: 'userName',
    dataIndex: 'sysName',
    
    width: 80
  }
]

export const columnCargoOwner = [
  {
    title: 'BillTypeList.field.code',
    dataIndex: 'code',
    width:180
  },
  {
    title: 'BillTypeList.field.name',
    dataIndex: 'fullName' || 'name',
    width:120
  }]

export const columnShipTo = [{
  title: 'BillTypeList.field.code',
  dataIndex: 'code',
  width:180
}, {
  title: 'BillTypeList.field.name',
  dataIndex: 'name',
  width:120

}]

export function formatRequestType(n) {
  switch (n) {
    case 'SEND':
      return '发送';
      break;
    case 'RECEIVE':
      return '接收';
      break;
    default:
      return '';
  }
}
