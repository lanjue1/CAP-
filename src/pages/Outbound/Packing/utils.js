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

export const codes = {
  page: 'ENDORSELIST',
  accept:'Packing_Management_Accept',
  print:'Packing_Management_Print',
  printCOO:'Packing_Management_printCOO',
  cartonLabel:'Packing_Management_cartonLabel',
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
export const Types = [
  { code: 'CO', value: 'CO' },
  { code: 'SELL', value: 'SELL' },
  { code: 'STO', value: 'STO' },
  { code: 'SCRAP', value: 'SCRAP' },
  { code: 'APRH', value: 'APRH' },
  { code: 'REPAIR', value: 'REPAIR' },
  { code: 'REDEMPTION', value: 'REDEMPTION' },
];

export const routeUrl = {
  add: '/outbound/load/AddLoad',
  edit: '/outbound/Packing/detailPacking',
};
export const SelectColumns = [
  {
    title: 'BillTypeList.field.code',
    dataIndex: 'code',
    width:60,
  },
  {
    title: 'BillTypeList.field.name',
    dataIndex: 'name',
    width: 150,
  },
]
export const DeliveryColumns = [
  {
    title: 'Delivery.field.deliveryNo',
    dataIndex: 'deliveryNo',
    width: 120,
  },
  {
    title: 'Delivery.field.shipToWmCode',
    dataIndex: 'shipToWmCode',
    width: 80,
  },
  {
    title:'Delivery.field.shippingNoticeNum',
    dataIndex:'outboundNoticeNo',
    width: 80,

  },
  {
    title:'Delivery.field.type',
    dataIndex:'orderType',
    width: 80,
  },
  {
    title:'shipping.field.shipTo',
    dataIndex:'altshiptoname',
    width: 80,
  },
  {
    title:'PoDetailList.field.etd',
    dataIndex:'etd',
    width: 80,
  },
  {
    title:'CoList.field.deliveryType',
    dataIndex:'sodeliverytype',
    width: 80,
  },
  {
    title:'CoList.field.serviceLevel',
    dataIndex:'servicelevel',
    width: 80,
  },
]
export const allDispatchType = {
  //请求的url
  list: 'Packing/selectPacking',
  detail: 'Packing/viewLoad',
  operate: 'Packing/operateLoad',

  abled: 'Packing/abledLoad',
  detailList: 'Packing/selectCarton',
  
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
export function selectCarton({ payload = {}, props, typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.detailList,
    payload,
    callback: data => {
      if (!data) return;
    },
  });
}
export function selectDelivery({ payload = {}, props, typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: 'Packing/selectDelivery',
    payload,
    callback: data => {
      if (!data) return;
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
    title: 'Load.field.loadingNo',
    dataIndex: 'loadingNo',
    width: 100,
    render: (text, record) => (
      <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
    ),
  },
  {
    title: 'Load.field.status',
    dataIndex: 'status',
    width: 100,

  },
  {
    title: 'Delivery.field.type',
    dataIndex: 'orderType',
    width: 150,
  },
  {
    title: 'Load.field.soId',
    dataIndex: 'soId',
    width: 120,
  },
  {
    title: 'Load.field.warehouse',
    dataIndex: 'warehouseId',
    width: 120,
  },
  
  {
    title: 'PoList.field.pieceQty',
    dataIndex: 'planQuantity',
    width: 120,
  },
  {
    title: 'CoList.field.openQty',
    dataIndex: 'recheckQuantity',
    render: (text, record) => {
      let openQTY = record.planQuantity - record.recheckQuantity
      return <span>{openQTY}</span>
    },
    width: 120,
  },
  
  {
    title: 'Load.field.cartonQTY',
    dataIndex: 'cartonQuantity',
    width: 120,
  },
  {
    title: 'RMO.field.noticeNo',
    dataIndex: 'outboundNoticeNo',
    width: 120,
  },
  {
    title: 'shipping.field.shipToCountry',
    dataIndex: 'altshiptocountry',
    width: 120,
  }, 
  {
    title: 'shipping.field.shipTo',
    dataIndex: 'altshiptoname',
    width: 120,
  },
  {
    title: 'shipping.field.shipToState',
    dataIndex: 'altshiptostate',
    width: 120,
  }, 
  
  {
    title: 'shipping.field.shipToCity',
    dataIndex: 'altshiptocity',
    width: 120,
  }, {
    title: 'shipping.field.shipToZip',
    dataIndex: 'altshiptopostcode',
    width: 120,
  }, 
  // {
  //   title: 'CoList.field.contactorName',
  //   dataIndex: 'altshiptocontactor',
  //   width: 120,
  // },
  // {
  //   title: 'CoList.field.email',
  //   dataIndex: 'altshiptoemail',
  //   width: 120,
  // }, {
  //   title: 'CoList.field.telephone',
  //   dataIndex: 'altshiptophone',
  //   width: 120,
  // }, {
  //   title: 'CoList.field.address',
  //   dataIndex: 'altshiptoadd',
  //   width: 120,
  // },


  // {
  //   title: 'Load.field.shipTime',
  //   dataIndex: 'shipTime',
  //   width: 150,
  // },
  // {
  //   title: 'Load.field.forwarder',
  //   dataIndex: 'forwarder',
  //   render: (text) => <span>{text}</span>,
  //   width: 100,
  // },
  // {
  //   title: 'Load.field.trackingNo',
  //   dataIndex: 'trackingNo',
  //   width: 100,
  // },
  // {
  //   title: 'Load.field.vehicleNo',
  //   dataIndex: 'vehicleNo',
  //   width: 100,
  // },


  // {
  //   title: 'Delivery.field.totalGrossWeight',
  //   dataIndex: 'totalGrossWeight',
  //   width: 120,

  // },
  // {
  //   title: 'Delivery.field.totalNetWeight',
  //   dataIndex: 'totalNetWeight',
  //   width: 120,
  // }, {
  //   title: 'Delivery.field.totalVolume',
  //   dataIndex: 'totalVolume',
  //   width: 120,
  // },
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

export const columnsDetail = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: 'Delivery.field.deliveryNo',
    dataIndex: 'deliveryNo',
    width: 120,
    render: (text, record) => (
      <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
    ),
  },
  {
    title: 'Delivery.field.shippingNoticeNum',
    dataIndex: 'shippingNoticeNum',
    //是否显示type为from时的输入框，不写默认显示（用在新增编辑）
    width: 120,
  },
  {
    title: 'Delivery.field.status',
    dataIndex: 'status',
    width: 120,
  }, {
    title: 'Delivery.field.type',
    dataIndex: 'type',
    width: 120,
  },
  {
    title: 'Load.field.soId',
    dataIndex: 'soId',
    width: 120,
  },
  {
    title: 'Delivery.field.shipToWmCode',
    dataIndex: 'shipToWmCode',
    width: 120,
  }, {
    title: 'CoList.field.toCountry',
    dataIndex: 'toCountryId',
    width: 120,
  }, {
    title: 'CoList.field.toState',
    dataIndex: 'altshiptostate',
    width: 120,
  }, {
    title: 'CoList.field.toCity',
    dataIndex: 'altshiptocity',
    width: 120,
  }, {
    title: 'CoList.field.toZip',
    dataIndex: 'altshiptopostcode',
    width: 120,
  }, {
    title: 'CoList.field.contactorName',
    dataIndex: 'altshiptocontactor',
    width: 120,
  }, {
    title: 'CoList.field.email',
    dataIndex: 'altshiptoemail',
    width: 120,
  }, {
    title: 'CoList.field.telephone',
    dataIndex: 'altshiptophone',
    width: 120,
  }, {
    title: 'CoList.field.address',
    dataIndex: 'altshiptoadd',
    width: 120,
  },
  {
    title: 'Delivery.field.planQuantity',
    dataIndex: 'planQuantity',
    width: 120,
  },
  {
    title: 'Delivery.field.shipQuantity',
    dataIndex: 'shipQuantity',
    width: 120,
  },
  // {
  //   title: 'Delivery.field.packageQuantity',
  //   dataIndex: 'pkgQuantity',
  //   width: 120,
  // },
  {
    title: 'Delivery.field.shipTime',
    dataIndex: 'shipTime',
    width: 120,
  },
  {
    title: 'Delivery.field.forwarder',
    dataIndex: 'forwarder',
    width: 120,
  },

  // {
  //   title: 'Delivery.field.houseName',
  //   dataIndex: 'houseName',
  //   width: 120,
  // },
  {
    title: 'Delivery.field.trackingNo',
    dataIndex: 'trackingNo',
    width: 120,
  },
  {
    title: 'Delivery.field.totalGrossWeight',
    dataIndex: 'totalGrossWeight',
    width: 120,

  },
  {
    title: 'Delivery.field.totalNetWeight',
    dataIndex: 'totalNetWeight',
    width: 120,
  }, {
    title: 'Delivery.field.totalVolume',
    dataIndex: 'totalVolume',
    width: 120,
  },
  {
    title: 'Delivery.field.remarks',
    dataIndex: 'remarks',
    width: 120,
  },
  {
    title: 'Delivery.field.createBy',
    dataIndex: 'createBy',
    width: 120,
  },
  {
    title: 'Delivery.field.createTime',
    dataIndex: 'createTime',
    width: 120,
  },
  {
    title: 'Delivery.field.updateBy',
    dataIndex: 'updateBy',
    width: 120,
  },
  {
    title: 'Delivery.field.updateTime',
    dataIndex: 'updateTime',
    width: 120,
  },

  // {
  //   title: 'Delivery.field.pkgQuantity',
  //   dataIndex: 'pkgQuantity',
  //   width: 120,
  // },
  // {
  //   title: 'Delivery.field.shipToWmCode',
  //   dataIndex: 'shipToWmCode',
  //   width: 120,

  // },

];
