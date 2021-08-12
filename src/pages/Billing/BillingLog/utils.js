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
  confirm: 'ENDORSELIST_CONF',
  remove: 'ENDORSELIST_DEL',
  add: 'ENDORSELIST_ADD',
  addEndorse: 'ENDORSE_ADD',
  edit: 'ENDORSELIST_UPD',
  upload: 'ENDORSELIST_IMPORT',
  page: 'ENDORSELIST',
  bill: 'ENDORSELIST_GENERATE',
  import: 'ENDORSELIST_IMPORT',
  export: 'ENDORSELIST_EXPORT',
};



export const routeUrl = {
  add: '/outbound/load/AddLoad',
  edit: '/outbound/load/editLoad',
};
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
  list: 'billingLog/selectBillingLog',
  detail: 'billingLog/viewBillingLog',
  operate: 'billingLog/operateBillingLog',

  abled: 'billingLog/abledBillingLog',
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

export const columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: 'BillingLog.field.bizNo',
    dataIndex: 'bizNo',
    width: 100,
    render: (text, record, index) => (<a href='#' onClick={() => router.push(`/billing/billingLog/detailsBillingLog/${record.id}`)} >{text}</a>),
  },
  {
    title: 'BillingLog.field.billingLog',
    dataIndex: 'billingLog',
    width: 150,
  },
  {
    title: 'BillingLog.field.bizDate',
    dataIndex: 'bizDate',
    width: 100,

  },
  {
    title: 'BillingLog.field.bizType',
    dataIndex: 'bizType',
    width: 100,
  },
  {
    title: 'BillingLog.field.elapsedMillisecond',
    dataIndex: 'elapsedMillisecond',
    width: 100,
  },
  {
    title: 'BillingLog.field.startDate',
    dataIndex: 'startDate',
    width: 100,
  },
  {
    title: 'BillingLog.field.endDate',
    dataIndex: 'endDate',
    width: 100,
  },
  {
    title: 'BillingLog.field.exceptionLog',
    dataIndex: 'exceptionLog',
    width: 120,
  },

  {
    title: 'BillingLog.field.receiptId',
    dataIndex: 'receiptId',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'BillingLog.field.receiptNo',
    dataIndex: 'receiptNo',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'BillingLog.field.receiptType',
    dataIndex: 'receiptType',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'BillingLog.field.remarks',
    dataIndex: 'remarks',
    render: (text) => <span>{text}</span>,
    width: 100,
  }
];

export const receiptTypeList = ['INBOUND', 'OUTBOUND', 'IQC', 'RMA', 'INVENTORY']

export const bizTypeList = ['CON', 'STO', 'PO', 'CO', 'SELL', 'REVERSE']
