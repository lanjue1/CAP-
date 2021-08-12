import { func } from 'prop-types';
import AdSelect from '@/components/AdSelect';
import router from 'umi/router';

export const codes = {
  // select: 'ETCCHANGESELECT',
  // showDetail: 'ETCCHANGESELECT_VIEW',
  // add: 'ETCCHANGESELECT_ADD',
  // edit: 'ETCCHANGESELECT_UPD',
  // upload: 'ETCCHANGESELECT_IMPORT',
  page: 'EVENTSPAGE',
  cancelConfirm:'ASN_Managemenrt_Cancel_Confirm',
  cancel:'ASN_Managemenrt_Cancel',
  confirm:'ASN_Managemenrt_Confirm',
  createReceipt:'ASN_Managemenrt_Create_Receipt',
  receiptPart:'ASN_Management_Receive_All',
  createPutaway:'ASN_Management_Create_Putaway',
  closeASN:'ASN_Management_Reconfirm_Close_ASN',
  importReceive:'ASN_Managemenrt_Import_Receive',
  import:'ASN_Managemenrt_Import',
  detailReceive:'ASN_Managemenrt_detailReceive',
};

export const ReceivedPackageUnit = [
  { code: 'PALLET', value: '板' },
  { code: 'BOX', value: '箱' },
  { code: 'PCS', value: 'pcs' },
];
export const asnType=[
  {code:'POU',value:'POU'},
  {code:'REPAIR',value:'REPAIR'},
  {code:'APRH',value:'APRH'},
  {code:'APRH_VIRTUAL',value:'APRH_VIRTUAL'},
]
//通知方式
export const Type = [
  { code: 'NORMAL', value: '正常入库' },
  { code: 'RETURN', value: '退货入库' },
];
//状态
export const Status = [
  { code: 'OPEN', value: 'OPEN' },
  { code: 'CONFIRMED', value: 'CONFIRMED' },
  { code: 'RECEIVING', value: 'RECEIVING' },
  { code: 'RECEIVED', value: 'RECEIVED' },
];
//请求类型
export const RequestType = [{ code: 'SEND', value: '发送' }, { code: 'RECEIVE', value: '接收' }];

//事件类型
export const EventType = [
  { code: 'INTERFACE-EXCEPTION', value: '接口异常' },
  { code: 'BUSINESS-REMINDERS', value: '业务提醒' },
];

export const Putaway = [
  { 'WAIT_WORK': '待作业' },
  { 'WAIT_PUYAWAY': '待上架' },
  { 'PUYAWAYING': '上架中' },
  { 'FINISHED': '上架完成' },
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
export const SelectColumns = [
  {
    title: 'BillTypeList.field.code',
    dataIndex: 'code',
    width: 60,
  },
  {
    title: 'BillTypeList.field.name',
    dataIndex: 'name',
    width: 120,
  },
]

export const Columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: 'ASNDetail.field.soNo',
    dataIndex: 'soNo',
    width: 100,
  },
  // {
  //   title: 'ASNDetail.field.prNo',
  //   dataIndex: 'soId',
  //   render: (text, record) => {
  //     let _text = record.prNo + '/' + text
  //     return <span>{_text}</span>
  //   },
  //   width: 180,
  // },
  {
    title: 'ASNDetail.field.prNo',
    dataIndex: 'prNo',
    width: 100,
  },
  {
    title: 'RMO.field.soId',
    dataIndex: 'soId',
    width: 120,
  },
  {
    title: 'ASNDetail.field.poNo',
    dataIndex: 'poNo',
    width: 100,
  },
  {
    title: 'ASNDetail.field.partNo',
    dataIndex: 'partNo',
    width: 150,
  },
  {
    title: 'ASNDetail.field.partDesc',
    dataIndex: 'partDesc',
    width: 100,
  },
  {
    title: 'ASN.field.planPieceQty',
    dataIndex: 'planPieceQty',
    width: 100,
  },
  {
    title: 'PoList.field.openQty',
    dataIndex: 'openPieceQty',
    render: text => <span title={text}>{text}</span>,
    width: 100,
  },
  {
    title: 'ASN.field.arrivedPieceQty',
    dataIndex: 'arrivedPieceQty',
    render: text => <span title={text}>{text}</span>,
    width: 120,
  },
  {
    title: 'Delivery.field.serialNo',
    dataIndex: 'serialNo',
    width: 120
  },

  {
    title: 'ASNDetail.field.lotCartonNo',
    dataIndex: 'lotCartonNo',
    width: 180
  },
  {
    title: 'ASNDetail.field.transportPriority',
    dataIndex: 'transportPriority',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  {
    title: 'ASN.field.bolNo',
    dataIndex: 'bolNo',
    width: 120
  },
  {
    title: 'ASN.field.forwarder',
    dataIndex: 'forwarder',
    width: 120
  },
  {
    title: 'ASNDetail.field.coo',
    dataIndex: 'lotCoo',
    render: text => <span title={text}>{text}</span>,
    width: 150,
  },
  {
    title: 'ASNDetail.field.dn',
    dataIndex: 'lotDn',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  {
    title: 'ASNDetail.field.deliveryText',
    dataIndex: 'deliveryText',
    render: text => <span title={text}>{text}</span>,
    width: 100,
  },
  {
    title: 'ASNDetail.field.remarks',
    dataIndex: 'remarks',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },

  {
    title: 'ASNDetail.field.updateBy',
    dataIndex: 'updateBy',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  {
    title: 'ASNDetail.field.updateTime',
    dataIndex: 'updateTime',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 150,
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
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 80
  }
]

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
