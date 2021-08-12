import { Modal } from 'antd';
import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import { keyValue } from '@/utils/utils';
import router from 'umi/router';



export const codes = {
  select: 'ENDORSELISTSELECT',
  showDetail: 'ENDORSELIST_VIEW',
  confirm:'ENDORSELIST_CONF',
  remove:'ENDORSELIST_DEL',
  add: 'ENDORSELIST_ADD',
  addEndorse:'ENDORSE_ADD',
  edit: 'ENDORSELIST_UPD',
  upload: 'ENDORSELIST_IMPORT',
  page: 'ENDORSELIST',
  bill: 'ENDORSELIST_GENERATE',
  import:'ENDORSELIST_IMPORT',
  export:'ENDORSELIST_EXPORT',
};



export const routeUrl = {
  detail: '/billing/sellLedger/createBilling',
};
export const SelectCloseType=[
  {code:'Normal',value:'Normal'},
  {code:'IQC Scrap',value:'IQC Scrap'},
  {code:'APRH Scrap',value:'APRH Scrap'},
  {code:'Repair Scrap',value:'Repair Scrap'},
  {code:'Hard Close',value:'Hard Close'},
]
export const SelectOrderType=[
  {code:'CON',value:'CON'},
  {code:'STO',value:'STO'},
  {code:'PO',value:'PO'},
  {code:'CO',value:'CO'},
  {code:'SELL',value:'SELL'},
]
export const SelectStatus=[
  {code:'OPEN',value:'OPEN'},
  {code:'CONFIRMED',value:'CONFIRMED'},
  {code:'RECORDED',value:'RECORDED'},
  {code:'CANCEL',value:'CANCEL'},
]
export const SelectType=[
  {code:'RECEIVABLE',value:'RECEIVABLE'},
  {code:'PAYABLE',value:'PAYABLE'},
  
]
export const SelectColumns = [
  {
    title:'code',
    dataIndex:'code',
    width:80,
  },
  {
    title:'name',
    dataIndex:'name',
    width:80,
  },
  {
    title:'price',
    dataIndex:'unitPrice',
    width:80,
  },
  {
    title:'currency',
    dataIndex:'currency',
    width:80,
  },
]

export const allDispatchType = {
  //请求的url
  list: 'SellLedger/selectChargeDetail',
  detailList:'SellLedger/selectBuyLedgerDetailList',
  detail: 'SellLedger/viewChargeDetail',
  abled: 'SellLedger/abledStatus',
  // detailList:'ChargeType/selectChargeTypeDelivery',
  
};



export function selectList({ payload = {}, props,typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type:allDispatchType.list ,
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
    type:allDispatchType.detailList ,
    payload,
    callback: data => {
      if (!data) return;
      // queryPerson({ data, props: props, url: allUrl.userList });
    },
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
  title:'ChargeDetail.field.ledgerNo',
  dataIndex: 'ledgerNo',
  
  // render: (text, record) => (
  //   <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
  // ),
},
{
  title: 'Common.field.status',
  dataIndex: 'status',
},
{
  title: 'BuyLedger.field.billDate',
  dataIndex: 'bizDate',
},
{
  title: 'partData.field.warehouse',
  dataIndex: 'warehouseCode',
},


{
  title: 'ASN.field.orderType',
  dataIndex: 'orderType',
},
{
  title: 'SellLedger.field.closeType',
  dataIndex: 'closeType',
},

{
  title: 'CoList.field.bizCoNo',
  dataIndex: 'coNo',
},
{
  title: 'ASNDetail.field.soNo',
  dataIndex: 'soNo',
},

{
  title: 'Delivery.field.soId',
  dataIndex: 'soId',
},

{
  title: 'RMO.field.partNo',
  dataIndex: 'partNo',
},
{
  title: 'ASNDetail.field.partDesc',
  dataIndex: 'partDesc',
},
{
  title: 'BlockQueue.field.quantity',
  dataIndex: 'qty',
render:text=>(<span>{parseInt(text)}</span>)
},
// {
//   title: 'ASNDetail.field.unitPrice',
//   dataIndex: 'unitPrice',
// },
{
  title: 'shippingDetail.field.unitPrice',
  dataIndex: 'unitPrice',
},
{
  title: 'ChargeType.field.currency',
  dataIndex: 'currency',
},
{
  title: 'BuyLedger.field.amount',
  dataIndex: 'amount',
 
},
{
  title: 'ChargeDetail.field.billingNo',
  dataIndex: 'billingNo',
},
{
  title: 'MoveTaskList.field.lotInvoiceNo',
  dataIndex: 'invoiceNo',
},

{
  title:'SellLedger.field.invoiceCreatedDate',
  dataIndex: 'invoiceCreatedDate',
},
{
  title: 'SellLedger.field.soCreatedDate',
  dataIndex: 'soCreatedDate',
},

{
  title: 'CoReport.field.orderStatus',
  dataIndex: 'orderStatus',
},
{
  title: 'SellLedger.field.shipDate',
  dataIndex: 'shipDate',
},
{
  title: 'SellLedger.field.closeDate',
  dataIndex: 'closeDate',
},

{
  title: 'SellLedger.field.soIdMaterialDescription',
  dataIndex: 'soIdMaterialDescription',
},
{
  title: 'SellLedger.field.soIdCC',
  dataIndex: 'soIdCC',
},
{
  title: 'SN.field.stockId',
  dataIndex: 'stockId',
},
{

  title: 'SellLedger.field.isReturn',
  dataIndex: 'isReturn',
},
  {
    title: 'CoReport.field.dispositionCode',
    dataIndex: 'dispositionCode',
  },
  {
    title: 'CoReport.field.redemptionCode',
    dataIndex: 'redemptionCode',
  },
  {
    title: 'SellLedger.field.rmaStatusCode',
    dataIndex: 'rmaStatusCode',
  },
  {
    title: 'CoReport.field.returnPN',
    dataIndex: 'returnPN',
  },{
    title: 'SellLedger.field.returnQTY',
    dataIndex: 'returnQTY',
  },{
    title: 'PoList.title.list',
    dataIndex: 'po',
  },
  {
    title: 'SellLedger.field.popn',
    dataIndex: 'popn',
  },
  {
    title: 'SellLedger.field.poUnitPrice',
    dataIndex: 'poUnitPrice',
  },
  {
    title: 'SellLedger.field.poQTY',
    dataIndex: 'poQTY',
  },{
    title: 'SellLedger.field.poDate',
    dataIndex: 'poDate',
  },

  {
    title: 'Common.field.createBy',
    dataIndex: 'createBy',
  },
  {
    title: 'Common.field.createTime',
    dataIndex: 'createTime',
    render: (text) => <span>{text}</span>,
  },
  {
    title: 'Common.field.updateBy',
    dataIndex: 'updateBy',
    render: (text) => <span>{text}</span>,
  },
  {
    title: 'Common.field.updateTime',
    dataIndex: 'updateTime',
    render: (text) => <span>{text}</span>,
  },
];



