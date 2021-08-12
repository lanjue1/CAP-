import { func } from 'prop-types';
import AdSelect from '@/components/AdSelect';
import router from 'umi/router';

export const codes = {
  page: 'EVENTSPAGE',
  createRMA:'RMO_Management_create_rma',
  updateRMA:'RMO_Management_update_rma',
  createOB:'RMO_Management_create_obnotice',
  createReceipt:'RMO_Management_create_receipt',
  importStatus:'RMO_Management_import_status',
  importRMA:'RMO_Management_import_rma',
  export:'RMO_Management_export',
  cancelOB:'RMO_Management_cancel_obnotice',
};



//通知方式
export const Type = [
  { code: 'NORMAL', value: '正常入库' },
  { code: 'RETURN', value: '退货入库' },
];
//状态
export const Status = [
  { code: 'OPEN', value: 'OPEN' },
  { code: 'UNRETURN', value: 'UNRETURN' },
  { code: 'REDEMPTIONCODEUPDATE', value: 'REDEMPTIONCODEUPDATE' },
  { code: 'COMPLETED', value: 'COMPLETED' },
  { code: 'RETURNED', value: 'RETURNED' },
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
export const SelectColumns = [
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

export const ASNDetailsColumns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  /*   {
      title: '实际收货箱数',
      dataIndex: 'arrivedBoxQty',
      render: text => <span title={text}>{text}</span>,
      width: 200,
    },
    {
      title: '实际收货板数',
      dataIndex: 'arrivedPalletQty',
      render: text => <span title={text}>{text}</span>,
      width: 200,
    }, */
  {
    //标题
    title: 'ASNDetail.field.itemName',
    //数据字段
    dataIndex: 'partName',
    width: 150,
  },
  {
    title: 'ASN.field.itemStatus',
    dataIndex: 'partStatus',
    render: text => <span title={text}>{text}</span>,
    width: 200,
  },
  {
    title: 'ASNDetail.field.controlStatus',
    dataIndex: 'controlStatus',
    render: text => <span title={text}>{text}</span>,
    width: 150,
  },
  {
    title: 'ASNDetail.field.lotCoo',
    dataIndex: 'lotCoo',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 150,
  },
  {
    title: 'ASNDetail.field.lotInfo',
    dataIndex: 'lotInfo',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  {
    title: 'ASNDetail.field.lotInvoiceNo',
    dataIndex: 'lotInvoiceNo',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  {
    title: 'ASNDetail.field.lotLocation',
    dataIndex: 'lotLocation',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  {
    title: 'ASNDetail.field.lotNo',
    dataIndex: 'lotNo',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  {
    title: 'ASNDetail.field.lotSoi',
    dataIndex: 'lotSoi',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  {
    title: 'ASNDetail.field.lotUom',
    dataIndex: 'lotUom',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,

  },
  {
    title: 'ASNDetail.field.lotVendorCode',
    dataIndex: 'lotVendorCode',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  {
    title: 'ASNDetail.field.lotVendorName',
    dataIndex: 'lotVendorName',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  // {
  //   title: '预计箱数-预留',
  //   dataIndex: 'planBoxQty',
  //   render: text => <AdSelect value={text} onlyRead={true} />,
  // },
  // {
  //   title: '预计板数-预留',
  //   dataIndex: 'planPalletQty',
  //   render: text => <AdSelect value={text} onlyRead={true} />,
  // },
  // {
  //   title: '上架箱数-预留',
  //   dataIndex: 'putawayBoxQty',
  //   render: text => <AdSelect value={text} onlyRead={true} />,
  // },
  // {
  //   title: '上架板数-预留',
  //   dataIndex: 'putawayPalletQty',
  //   render: text => <AdSelect value={text} onlyRead={true} />,
  // },
  {
    title: 'ASNDetail.field.qualifiedQuantity',
    dataIndex: 'qualifiedQuantity',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,

  },
  {
    title: 'ASNDetail.field.qualifiedStatus',
    dataIndex: 'qualifiedStatus',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,

  },
  {
    title: 'ASNDetail.field.qualityItemName',
    dataIndex: 'qualityPartName',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  {
    title: 'ASNDetail.field.qualityReordDate',
    dataIndex: 'qualityReordDate',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  {
    title: 'ASNDetail.field.qualitySort',
    dataIndex: 'qualitySort',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  {
    title: 'ASNDetail.field.remarks',
    dataIndex: 'remarks',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
  {
    title: 'ASNDetail.field.storageDate',
    dataIndex: 'storageDate',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 100,
  },
]

export const columns1 = [
  {
    title: 'userId',
    dataIndex: 'loginName',
    render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
    width:80
  },
  {
    title: 'userName',
    dataIndex: 'sysName',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width:80
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
