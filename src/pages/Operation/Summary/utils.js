import { Modal } from 'antd';
import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import { keyValue } from '@/utils/utils';
import router from 'umi/router';



export const codes = {
  page: 'ENDORSELIST',
  confirm:'Summary_Management_Confirm',
  createReceipt:'Summary_Management_Create_Receipt',
  revocation:'Summary_Management_Revocation',
};



export const routeUrl = {
  add: '/outbound/load/AddLoad',
  edit: '/outbound/load/editLoad',
};
export const SelectColumns = [
  {
    title:'Code',
    dataIndex:'code',
    width:120,
  },
  {
    title:'Name',
    dataIndex:'name',
    width:150,
  },
]
export const receiptStatus=[
  {code:true,value:'Y'},
  {code:false,value:'N'},
]
export const Year=['2018','2019','2020','2021','2022']
export const allDispatchType = {
  //请求的url
  list: 'Summary/selectSummary',
  // detail: 'Receipt/viewReceipt',
  // operate:'Receipt/operateReceipt',

  abled: 'Receipt/abledSnapshot',
  // detailList:'Receipt/selectReceiptDelivery',
  
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

export const columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
},
  {
    title:'Summary.field.summaryNo',
    dataIndex: 'summaryNo',
    // render: (text, record) => (
    //   <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
    // ),
  },
  {
    title: 'Common.field.status',
    dataIndex: 'status',
  },
  {
    title: 'Summary.field.warehouse',
    dataIndex: 'warehouseCode',
    render: (text) => <span>{text}</span>,
  },
  {
    title:'Summary.field.summaryDate',
    dataIndex: 'summaryDate',
  },
  {
    title:'Summary.field.summaryDays',
    dataIndex: 'summaryDays',
  },
  {
    title:'Summary.field.summaryMonth',
    dataIndex: 'summaryMonth',
  },
  {
    title: 'Summary.field.summaryYear',
    dataIndex: 'summaryYear',
  },
  {
    title: 'Summary.field.summaryQty',
    dataIndex: 'summaryQty',
  },
  {
    title: 'Summary.field.averageQty',
    dataIndex: 'averageQty',
  },
  {
    title: 'Summary.field.beReceipt',
    dataIndex: 'beReceipt',
   
  },
  {
    title: 'Summary.field.receiptDate',
    dataIndex: 'receiptDate',
  },
  {
    title: 'Common.field.remarks',
    dataIndex: 'remarks',
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


