import { func } from 'prop-types';
import AdSelect from '@/components/AdSelect';
import router from 'umi/router';

export const codes = {
  page: 'EVENTSPAGE',
  cancelConfirm: 'IQC_Management_cancel_confirmation',
  confirm: 'IQC_Management_confirm',
  onHold: 'IQC_Management_on_hold',
  cancelOnHold: 'IQC_Management_cancel_on_hold',
  qualityCheck: 'IQC_Management_quality_check',
  reviewIQC: 'IQC_Management_review_iqc',
  createOB: 'IQC_Management_create_obnotice',
  cancelOB: 'IQC_Management_cancel_obnotice',
  cancelCheck: 'IQC_Management_cancel_check',
  createReceipt: 'IQC_Management_create_receipt',

};
export const SelectColumns = [
  {
    title: 'BillTypeList.field.code',
    dataIndex: 'code',
    width: 60,
  },
  {
    title: 'BillTypeList.field.name',
    dataIndex: 'name',
    width: 150,
  },
]


export const Type = [
  { code: 'FIRST_COUNT', value: 'FIRSTCOUNT' },
  { code: 'SECOND_COUNT', value: 'SECONDCOUNT' },
];
export const partType = [
  { code: 'NORMAL_PART', value: 'NORMAL_PART' },
  { code: 'CONSIGNMENT_PART', value: 'CONSIGNMENT_PART' },
];
//状态
export const Status = [
  { code: 'OPEN', value: 'OPEN' },
  { code: 'ACCEPT', value: 'ACCEPT' },
  { code: 'IQCING', value: 'IQCING' },
  { code: 'IQCFINISHED', value: 'IQCFINISHED' },
  { code: 'CLOSE', value: 'CLOSE' },
];

export const binStatus = [
  { code: true, value: 'FREEZE' },
  { code: false, value: 'UNFREEZE' },
];

export const Method = [
  { code: 'ALL_WAREHOUSE', value: 'ALLWAREHOUSE' },
  { code: 'NORMAL_BIN', value: 'NORMALBIN' },
  { code: 'EXCEPTION_BIN', value: 'EXCEPTIONBIN' },
  { code: 'TOUCH_BIN', value: 'TOUCHBIN' },
  { code: 'CYCLE_BIN', value: 'CYCLEBIN' },
];

export const Mode = [
  { code: 'BRIGHT_COUNT', value: 'BRIGHTCOUNT' },
  { code: 'BLIND_COUNT', value: 'BLINDCOUNT' },
];

export const Lock = [
  { code: 'UNLOCK', value: 'UNLOCK' },
  { code: 'LOCK', value: 'LOCK' },
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
