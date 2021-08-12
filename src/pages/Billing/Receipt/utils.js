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
  list: 'Receipt/selectReceipt',
  detail: 'Receipt/viewReceipt',
  operate:'Receipt/operateReceipt',

  abled: 'Receipt/abledReceipt',
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
  title: 'Receipt.field.receiptNo',
  dataIndex: 'receiptNo',
  render: (text) => <span>{text}</span>,
  width: 180,
},
{
  title: 'Common.field.status',
  dataIndex: 'status',
  width: 100,
},
{
  title: 'Receipt.field.receiptType',
  dataIndex: 'receiptType',
  render: (text) => <span>{text}</span>,
  width: 100,
},
{
  title: 'Receipt.field.bizNo',
  dataIndex: 'bizNo',
  width: 150,
},
{
  title: 'OrgList.field.bizType',
  dataIndex: 'bizType',
  width: 100,

},
{
  title: 'Receipt.field.bizStatus',
  dataIndex: 'bizStatus',
  width: 100,
},
{
  title: 'shipping.field.bizDate',
  dataIndex: 'bizDate',
  width: 180,
},
{
  title: 'CoDetailList.field.soDetailNo',
  dataIndex: 'soDetailNo',
  render: (text) => <span>{text}</span>,
  width: 100,
},
{
  title: 'ASNDetail.field.poNo',
  dataIndex: 'poNo',
  render: (text) => <span>{text}</span>,
  width: 100,
},
  {
    title:'ASN.field.asnNo',
    dataIndex: 'asnNo',
    width: 180,
    // render: (text, record) => (
    //   <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
    // ),
  },
  {
    title: 'MoveTaskList.field.partStatus',
    dataIndex: 'partStatus',
    width: 120,
  },
  {
    title:'Snapshot.field.partCode',
    dataIndex: 'partCode',
    width: 100,
  },
  {
    title: 'InventoryList.field.inventoryQt',
    dataIndex: 'qty',
    render: (text) => {
      let _text=parseInt(text)
      return <span>{_text}</span>
    },
    width: 100,
  },
  {
    title: 'ASNDetail.field.unitPrice',
    dataIndex: 'unitPrice',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'Receipt.field.billingMonth',
    dataIndex: 'billingMonth',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'Receipt.field.billingYear',
    dataIndex: 'billingYear',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
 
  {
    title: 'Delivery.field.beReturn',
    dataIndex: 'beReturn',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'Receipt.field.beException',
    dataIndex: 'beException',
    width: 150,
  },
  {
    title: 'Receipt.field.poSoNo',
    dataIndex: 'poSoNo',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title:'Receipt.field.coSoNo',
    dataIndex: 'coSoNo',
    width: 100,
  },
  {
    title: 'Receipt.field.beSettlement',
    dataIndex: 'beSettlement',
    width: 150,
  },
  {
    title: 'Receipt.field.settlementDate',
    dataIndex: 'settlementDate',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'Receipt.field.billingStatus',
    dataIndex: 'billingStatus',
    render: (text) => <span>{text}</span>,
    width: 100,
  }, {
    title: 'Receipt.field.billingDate',
    dataIndex: 'billingDate',
    render: (text) => <span>{text}</span>,
    width: 100,
  }, {
    title: 'BlockQueue.field.referenceCode1',
    dataIndex: 'referenceCode1',
    render: (text) => <span>{text}</span>,
    width: 100,
  }, {
    title: 'BlockQueue.field.referenceCode2',
    dataIndex: 'referenceCode2',
    render: (text) => <span>{text}</span>,
    width: 100,
  },

  
   {
    title:'WarehouseList.field.country',
    dataIndex: 'countryCode',
    width: 100,
  },
  {
    title: 'partData.field.warehouse',
    dataIndex: 'warehouseCode',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'Common.field.remarks',
    dataIndex: 'remarks',
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


