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
  edit: '/billing/logisticsLedger/createBilling',
};
export const BillingStatus=[
  {code:'OPEN',value:'OPEN'},
  {code:'ACCEPT',value:'ACCEPT'},
  {code:'CHECKED_BILL',value:'CHECKED_BILL'},
  {code:'INVOICE_FINISHED',value:'INVOICE_FINISHED'},
  {code:'PAYMENT_FINISHED',value:'PAYMENT_FINISHED'},
  {code:'CANCELED',value:'CANCELED'},
]
export const SelectColumns = [
  {
    title:'BillTypeList.field.code',
    dataIndex:'code',
    width:120,
  },
  {
    title:'BillTypeList.field.name',
    dataIndex:'name',
    width:150,
  },
]

export const allDispatchType = {
  //请求的url
  list: 'LogisticsBilling/selectBuyBilling',
  
  operate:'LogisticsBilling/operateReceipt',


};



export function selectList({ payload = {}, props,typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type:allDispatchType.list ,
    payload,
    callback: data => {
      if (!data) return;
      queryPerson({ data, props: props, url: allUrl.userList });
    },
  });
}

export const columnsBilling = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
},
{
  title: 'ChargeDetail.field.billingNo',
  dataIndex: 'billingNo',
  render: (text,record) => <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>,
},
{
  title: 'Common.field.status',
  dataIndex: 'status',
  render: (text) => <span>{text}</span>,
},
{
  title: 'BuyLedger.field.payer',
  dataIndex: 'payer',
},
{
  title: 'BuyLedger.field.payee',
  dataIndex: 'payee',
},
{
  title: 'BuyLedger.field.billingCycle',
  dataIndex: 'billingCycle',
},
{
  title: 'Receipt.field.billingDate',
  dataIndex: 'billingStartDate',
 render:(text,record)=>(<span>{`${text} - ${record.billingEndDate} `}</span>)
},
{
  title: 'MoveTaskList.field.lotInvoiceNo',
  dataIndex: 'invoiceNo',
},
{
  title: 'ChargeDetail.field.calculateAmount',
  dataIndex: 'totalAmount',
},
{
  title: 'ChargeType.field.currency',
  dataIndex: 'totalAmountCurrency',
},
  {
    title:'BuyLedger.field.tax',
    dataIndex: 'tax',
  },
  {
    title: 'BuyLedger.field.adjustmentPer',
    dataIndex: 'adjustPer',
  },
  {
    title: 'BuyLedger.field.adjustmentAmount',
    dataIndex: 'adjustAmount',
  },
  {
    title:'ChargeDetail.field.actualAmount',
    dataIndex: 'actualAmount',
  },
  {
    title: 'Common.field.remarks',
    dataIndex: 'remarks',
  },
  {
    title: 'BuyLedger.field.paymentDueDate',
    dataIndex: 'paymentTime',
  },
  
  {
    title: 'Common.field.createBy',
    dataIndex: 'createBy',
    render: (text) => <span>{text}</span>,
  },
 
  {
    title: 'Common.field.createTime',
    dataIndex: 'createTime',
    render: (text) => <span>{text}</span>,
  },
  {
    title: 'Common.field.updateBy',
    dataIndex: 'updateBy',
  },
  {
    title: 'Common.field.updateTime',
    dataIndex: 'updateTime',
    render: (text) => <span>{text}</span>,
  },
  
];


