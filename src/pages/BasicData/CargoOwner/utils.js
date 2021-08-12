import { Modal } from 'antd';
import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import { keyValue } from '@/utils/utils';
import router from 'umi/router';



export const formate = 'YYYY-MM-DD HH:mm:ss';
export const formateNOSecond = 'YYYY-MM-DD HH:mm';
const { confirm } = Modal;
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
  {
    title:'Common.field.type',
    dataIndex:'businessType',
    width:80,
  },
]
export const codes = {
  page: 'ENDORSELIST',
  edit:'Cargo_Owner_Detail_Edit',
};
// UNSEALED 草稿、 SUBMITTED 已提交、 CONFIRM 已确认  CANCEL 作废
export const archivesStatusList = [
  { code: 'CANCEL', value: '作废' },
  { code: 'UNSEALED', value: '草稿' },
  { code: 'CONFIRM', value: '已确认' },
  { code: 'SUBMITTED', value: '已提交' },
];
export const Status = [
  { code: 'ENABLE', value: '启用' }, 
  { code: 'ENABLED', value: '启用' }, 
{ code: 'DISABLE', value: '禁用' },
];
export const isTrue=[
  {code:false,value:'否'},
  {code:true,value:'是'},
]

export const routeUrl = {
  add: '/basicData/cargoOwner/cargoOwnerAdd',
  edit: '/basicData/cargoOwner/cargoOwnerEdit',
  
  
};

export const allDispatchType = {
  //请求的url
  list: 'CargoOwner/selectCargoOwner',
  detail: 'CargoOwner/viewCargoOwner',
  operate:'CargoOwner/operateCargoOwner',

  abled: 'CargoOwner/abledCargoOwner',

  
};



export function selectList({ payload = {}, props,typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: 'CargoOwner/selectCargoOwner',
    payload,
    callback: data => {
      if (!data) return;
      queryPerson({ data, props: props, url: allUrl.userList });
    },
  });
  
}



export function saveAllValues({ payload = {}, props } = {}) {
  const { dispatch } = props;
  dispatch({
    type: 'WarehouseBin/allValus',
    payload,
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
    title:'CargoOwner.field.code',
    dataIndex: 'code',
    width: 100,
    render: (text, record) => (
      <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
    ),
  },
  {
    title: 'CargoOwner.field.fullName',
    dataIndex: 'fullName',
    width: 200,
  },
  {
    title: 'CargoOwner.field.shortName',
    dataIndex: 'shortName',
    width: 200,
   
  },
  {
    title:'CargoOwner.field.status',
    dataIndex: 'status',
    width: 100,
    // valueEnum: {
    //  0: {key: 'ENABLE',value: '启用',},
    //  1:{ key: 'DISABLE', value: '禁用', },
    // },
    
    // render: (text) => <span>{keyValue(Status, text)}</span>,
  },
  {
    title: 'CargoOwner.field.paymentType',
    dataIndex: 'paymentType',
    width: 120,
   
    
  },
  
  {
    title: 'CargoOwner.field.ownerAttr',
    dataIndex: 'ownerAttr',
    render: (text) => <span>{text}</span>,
    width: 200,
  },
  {
    title: 'CargoOwner.field.address',
    dataIndex: 'address',
    width: 200,
  },
  {
    title: 'CargoOwner.field.phone',
    dataIndex: 'phone',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'CargoOwner.field.description',
    dataIndex: 'description',
    render: (text) => <span>{text}</span>,
    width: 200,
  },
  {
    title: 'CargoOwner.field.createBy',
    dataIndex: 'createBy',
    width: 100,
  },{
    title: 'CargoOwner.field.createTime',
    dataIndex: 'createTime',
    width: 200,
  },{
    title: 'CargoOwner.field.updateBy',
    dataIndex: 'updateBy',
    width: 100,
  },
  {
    title: 'CargoOwner.field.updateTime',
    dataIndex: 'updateTime',
    width: 200,
  },
  
  {
    title: 'CargoOwner.field.remarks',
    dataIndex: 'remarks',
    width: 200,
  },
 
];
