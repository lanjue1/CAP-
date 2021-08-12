import { Modal } from 'antd';
import {Fragment} from 'react'
import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import { keyValue } from '@/utils/utils';
import router from 'umi/router';
import { Typography, Icon } from 'antd'
const { Paragraph } = Typography

export const codes = {
  page: 'ENDORSELIST',
};

export const routeUrl = {
  // add: '/outbound/load/AddLoad',
  edit: '/billing/buyLedger/createBilling',
};
export const BillingStatus = [
  { code: 'OPEN', value: 'OPEN' },
  { code: 'ACCEPT', value: 'ACCEPT' },
  { code: 'CHECKED_BILL', value: 'CHECKED_BILL' },
  { code: 'INVOICE_FINISHED', value: 'INVOICE_FINISHED' },
  { code: 'PAYMENT_FINISHED', value: 'PAYMENT_FINISHED' },
  { code: 'CANCELED', value: 'CANCELED' },
]
export const SelectColumns = [
  {
    title: 'BillTypeList.field.code',
    dataIndex: 'code',
    width: 120,
  },
  {
    title: 'BillTypeList.field.name',
    dataIndex: 'name',
    width: 150,
  },
]

export const allDispatchType = {
  //请求的url
  list: 'OperationLog/selectList',
  operate: 'OperationLog/abledOperate',
};



export function selectList({ payload = {}, props, typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.list,
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
    title: 'OperationLog.field.id',
    dataIndex: 'id',
    // render: (text,record) => <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>,
  },
  {
    title: 'OperationLog.field.source',
    dataIndex: 'source',
    render: (text) => <span>{text}</span>,
  },
  {
    title: 'OperationLog.field.type',
    dataIndex: 'type',
  },
  {
    title: 'OperationLog.field.url',
    dataIndex: 'url',
  },
  {
    title: 'OperationLog.field.json',
    dataIndex: 'requestJson',
    width:250,
    render: (text, record) => {
      let copyable={text:text,}
      // console.log('copyable--',copyable.text,record.id)
      return(
      <div style={{display:'flex'}}>
        <Paragraph copyable={copyable}></Paragraph>
        <div style={{marginLeft:'5px'}}>{text}</div>
      </div>
      )
    }
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


