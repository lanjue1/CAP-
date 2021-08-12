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
  add: '/outbound/load/AddLoad',
  edit: '/outbound/load/editLoad',
};
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
  list: 'ChargeType/selectChargeType',
  detail: 'ChargeType/viewChargeType',
  operate:'ChargeType/operateChargeType',

  abled: 'ChargeType/abledChargeType',
  // detailList:'ChargeType/selectChargeTypeDelivery',
  
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
    title:'partData.field.code',
    dataIndex: 'code',
    width: 100,
    // render: (text, record) => (
    //   <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
    // ),
  },
 
  {
    title: 'Common.field.name',
    dataIndex: 'name',
    width: 100,
   
  },
  
  {
    title:'CoDetailList.field.category',
    dataIndex: 'category',
    width: 100,
  },
  {
    title: 'Common.field.type',
    dataIndex: 'type',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'ChargeType.field.currency',
    dataIndex: 'currency',
    width: 150,
  },
  {
    title:'Common.field.status',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: 'Common.field.createBy',
    dataIndex: 'createBy',
    width: 100,
  },
  {
    title: 'Common.field.createTime',
    dataIndex: 'createTime',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'Common.field.updateBy',
    dataIndex: 'updateBy',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'Common.field.updateTime',
    dataIndex: 'updateTime',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
];


