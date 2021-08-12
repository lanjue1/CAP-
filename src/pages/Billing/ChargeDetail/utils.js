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
  add: '/billing/chargeDetail/addChargeDetail',
  edit: '/billing/chargeDetail/editChargeDetail',
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
  list: 'ChargeDetail/selectChargeDetail',
  detail: 'ChargeDetail/viewChargeDetail',
  operate:'ChargeDetail/operateChargeDetail',

  abled: 'ChargeDetail/abledStatus',
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
  title:'ChargeDetail.field.ledgerNo',
  dataIndex: 'ledgerNo',
  
  render: (text, record) => (
    <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
  ),
},
{
  title: 'Common.field.status',
  dataIndex: 'status',
},
{
  title: 'ChargeDetail.field.chargeName',
  dataIndex: 'name',
},
{
  title: 'Common.field.type',
  dataIndex: 'type',
  render: (text) => <span>{text}</span>,
},
{
  title: 'shipping.field.bizDate',
  dataIndex: 'bizDate',
},
{
  title: 'PoList.title.list',
  dataIndex: 'poNo',
},
{
  title: 'ASNDetail.field.soNo',
  dataIndex: 'poSoNo',
},
{
  title: 'CoDetailList.field.soDetailNo',
  dataIndex: 'soDetailNo',
},
{
  title: 'RMO.field.partNo',
  dataIndex: 'partCode',
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
  title: 'ChargeDetail.field.chargeRate',
  dataIndex: 'chargeRate',
},
{
  title: 'ChargeType.field.currency',
  dataIndex: 'currency',
},
{
  title: 'ChargeDetail.field.calculateAmount',
  dataIndex: 'calculateAmount',
 
},
{
  title:'ChargeDetail.field.actualAmount',
  dataIndex: 'actualAmount',
},
{
  title: 'ChargeDetail.field.billingName',
  dataIndex: 'billingName',
},

{
  title: 'Receipt.field.bizNo',
  dataIndex: 'bizNo',
},
// {
//   title: 'PoList.field.shipFrom',
//   dataIndex: 'shipFrom',
// },{
//   title: 'PoList.field.fromCountry',
//   dataIndex: 'fromCountry',
// },{
//   title: 'PoList.field.consigner',
//   dataIndex: 'consigner',
// },{
//   title: 'PoList.field.shipTo',
//   dataIndex: 'shipTo',
// },{
//   title: 'CoList.field.toCountry',
//   dataIndex: 'toCountry',
// },
{
  title: 'CoList.field.consignee',
  dataIndex: 'consignee',
},
{
  title: 'ChargeDetail.field.billingNo',
  dataIndex: 'billingNo',
},
{

  title: 'Common.field.remarks',
  dataIndex: 'remarks',
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


