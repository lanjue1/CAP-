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
  detail: '/billing/buyLedger/createBilling',
};
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
export const SelectOrderType=[
  {code:'PO',value:'PO'},
  {code:'CON',value:'CON'},
]
export const SelectColumns = [
  {
    title:'Code',
    dataIndex:'code',
    width:80,
  },
  {
    title:'Name',
    dataIndex:'name',
    width:80,
  },
]

export const allDispatchType = {
  //请求的url
  list: 'BuyLedger/selectChargeDetail',
  detailList:'BuyLedger/selectBuyLedgerDetailList',
  detail: 'BuyLedger/viewChargeDetail',
  abled: 'BuyLedger/abledStatus',
  popupList:'BuyLedger/selectBillinglList'
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
export function popupDetailList({ payload = {}, props,typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type:allDispatchType.popupList ,
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
  dataIndex: 'billDate',
},
{
  title: 'partData.field.warehouse',
  dataIndex: 'warehouseCode',
},
{
  title: 'ASN.field.orderType',
  dataIndex: 'poOrderType',
},
{
  title: 'PoReport.field.businessModel',
  dataIndex: 'poBusinessModel',
},
{
  title: 'ASNDetail.field.poNo',
  dataIndex: 'poNo',
},
{
  title: 'ASNDetail.field.prNo',
  dataIndex: 'prId',
},
{
  title: 'ASNDetail.field.soNo',
  dataIndex: 'soNo',
},

{
  title: 'ASN.field.shipFromWmCode',
  dataIndex: 'fromCode',
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
  title:'PoList.field.consigner',
  dataIndex: 'consigner',
},
{
  title: 'ASN.field.asnNo',
  dataIndex: 'asnNo',
},

{
  title: 'ASNDetail.field.dn',
  dataIndex: 'dn',
},
{
  title: 'MoveTaskList.field.lotInvoiceNo',
  dataIndex: 'invoiceNo',
},{
  title: 'BuyLedger.field.invoicePrice',
  dataIndex: 'invoicePrice',
},


{
  title: 'BuyLedger.field.invoiceAmount',
  dataIndex: 'invoiceAmount',
},{
  title: 'BuyLedger.field.invoiceDate',
  dataIndex: 'invoiceDate',
},{
  title: 'BuyLedger.field.giDate',
  dataIndex: 'giDate',
},
{
  title: 'ASN.field.bolNo',
  dataIndex: 'bolNo',
},
{
  title: 'ASN.field.forwarder',
  dataIndex: 'forward',
},
{

  title: 'PoReport.field.hawb',
  dataIndex: 'hawb',
},
  {
    title: 'BuyLedger.field.notificationDate',
    dataIndex: 'notificationDate',
  },
  {
    title: 'BuyLedger.field.pickUpTime',
    dataIndex: 'pickUpTime',
  },
  {
    title: 'ChargeDetail.field.billingNo',
    dataIndex: 'billingNo',
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
export const statusColumns=[
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
},
  {
    title:'Document Number',
    dataIndex:'documentNumber',
  },
  {
    title:'Document currency',
    dataIndex:'documentCurrency',
  },
  {
    title:'Amount in doc. curr.',
    dataIndex:'amountInDocCurr',
  },
  {
    title:'Document Date',
    dataIndex:'documentDate',
  },
  {
    title:'Posting Date',
    dataIndex:'postingDate',
  },
  {
    title:'Net due date',
    dataIndex:'netDueDate',
  },
]
