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
  detail: '/billing/logisticsLedger/createBilling',
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
  list: 'LogisticsLedger/selectChargeDetail',
  detailList:'LogisticsLedger/selectBuyLedgerDetailList',
  detail: 'LogisticsLedger/viewChargeDetail',
  abled: 'LogisticsLedger/abledStatus',
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
  title: 'Logistics.field.chargeType',
  dataIndex: 'chargeType',
},
{
  title: 'Logistics.field.chargeName',
  dataIndex: 'chargeName',
},
{
  title: 'ASN.field.orderType',
  dataIndex: 'orderType',
},
{
  title: 'Logistics.field.poOrCo',
  dataIndex: 'bizSourceOrderNo',
},{
  title: 'ASNDetail.field.soNo',
  dataIndex: 'soNo',
},

{
  title: 'Logistics.field.prIdOrSoId',
  dataIndex: 'bizSourceOrderDetailNo',
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
  title: 'Logistics.field.partCC',
  dataIndex: 'partCC',
},
{
  title: 'BlockQueue.field.quantity',
  dataIndex: 'qty',
render:text=>(<span>{parseInt(text)}</span>)
},
{
  title: 'shippingDetail.field.unitPrice',
  dataIndex: 'unitPrice',
},
{
  title: 'ChargeType.field.currency',
  dataIndex: 'currency',
},

{
  title:'PoList.field.consigner',
  dataIndex: 'consigner',
},
{
  title: 'ChargeDetail.field.billingNo',
  dataIndex: 'billingNo',
},
{
  title: 'PoReport.field.originCountry',
  dataIndex: 'originCountry',
},
{
  title: 'Logistics.field.fromZipCode',
  dataIndex: 'fromZipCode',
},
{
  title: 'PoReport.field.destinationaCountry',
  dataIndex: 'destinationaCountry',
},
{
  title: 'Logistics.field.toZipCode',
  dataIndex: 'toZipCode',
},
{
  title: 'ASN.field.bolNo',
  dataIndex: 'bolNo',
},
{
  title: 'ASN.field.asnNo',
  dataIndex: 'asnNo',
},
{
  title: 'ASN.field.forwarder',
  dataIndex: 'forwarder',
},
{
  title: 'PoReport.field.mot',
  dataIndex: 'mot',
},
{
  title: 'PoReport.field.hawb',
  dataIndex: 'hawb',
},
{
  title: 'BuyLedger.field.giDate',
  dataIndex: 'giDate',
},
{
  title: 'Logistics.field.shipmentQTY',
  dataIndex: 'shipmentQTY',
},{
  title: 'Logistics.field.pickUpDate',
  dataIndex: 'pickUpDate',
},


{
  title: 'Logistics.field.orderCreateDate',
  dataIndex: 'orderCreateDate',
},{
  title: 'Logistics.field.serviceProviderId',
  dataIndex: 'serviceProviderId',
},



  {
    title: 'Logistics.field.returnFlag',
    dataIndex: 'returnFlag',
  },
  {
    title: 'Logistics.field.dispostioncode',
    dataIndex: 'dispositionCode',
  },
  {
    title: 'CoReport.field.redemptionCode',
    dataIndex: 'redemptionCode',
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



