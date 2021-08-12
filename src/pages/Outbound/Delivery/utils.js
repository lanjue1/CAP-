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

// 旧的权限code

export const Status = [
  { code: 'OPEN', value: 'OPEN' },
  { code: 'WORKING', value: 'WORKING' },
  { code: 'FINISHED', value: 'FINISHED' },
];
export const isTrue = [
  { code: false, value: 'false' },
  { code: true, value: 'true' },
]

export const routeUrl = {
  add: '/basicData/warehouseBin/warehouseBinAdd',
  edit: '/outbound/delivery/editDelivery',
};
export const SelectColumns = [
  {
    title: 'BillTypeList.field.code',
    dataIndex: 'code',
    width: 60,
  },
  {
    title: 'BillTypeList.field.name',
    dataIndex: 'name',
    width: 150,
  },
]
export const allDispatchType = {
  //请求的url
  list: 'Delivery/selectDelivery',
  detail: 'Delivery/viewDelivery',
  detailList: 'Delivery/selectDeliveryDetail',
  seriaList: 'Delivery/selectDeliverySerial',
  cancel: 'Delivery/cancelDelivery',
  abled: 'Delivery/abledDelivery'

};
export const codes = {
  page: 'EVENTSPAGE',
  sign: 'Delivery_Management_Sign',
  createLoadlist: 'Delivery_Management_Create_Loading_List',
  createLoadlistByOne:'Delivery_Management_Create_Loading_One',
  createLoadlistByName:'Delivery_Management_Create_Loading_Name',
  reviewLoadlist: 'Delivery_Management_Review_Loading_List',
  revokeLoadlist: 'Delivery_Management_Revoke_Loading_List',
  deliver: 'Delivery_Management_Deliver',
  printDelivery: 'Delivery_Management_Print_Delivery',
  pickBack:'Delivery_Management_PickBack'
  // createLoadlist:'Delivery_Management_createLoadlist',
};


export function selectList({ payload = {}, props, typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.list,
    payload,
    callback: data => {
      if (!data) return;
    },
  });
}
export function selectDetailList({ payload = {}, props, typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.detailList,
    payload,
    callback: data => {
      if (!data) return;
    },
  });
}
export function selectSerialList({ payload = {}, props, typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.seriaList,
    payload,
    callback: data => {
      if (!data) return;
    },
  });
}


export function saveAllValues({ payload = {}, props } = {}) {
  const { dispatch } = props;
  dispatch({
    type: 'Delivery/allValus',
    payload,
  });
}

//时间判断：  date1:小日期   date2:大日期
export function DateMinus(date1, date2) {
  if (date1 && date2) {
    var sdate = new Date(date1);
    var now = new Date(date2);
    var days = Number(now.getTime()) - Number(sdate.getTime());
    var day = parseFloat(days / (1000 * 60 * 60 * 24));
    return day.toString();
  }
}

export const columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: 'Delivery.field.deliveryNo',
    dataIndex: 'deliveryNo',
    width: 160,
    render: (text, record) => (
      <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
    ),
  },
  {
    title: 'Delivery.field.status',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: 'Delivery.field.type',
    dataIndex: 'orderType',
    width: 120,
  },

  {
    title: 'CoDetailList.field.pickingStatus',
    dataIndex: 'pickStatus',
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
  {
    title: 'Picking.field.cutOffDate',
    dataIndex: 'cutoffDate',
    width: 120,
  },
  {
    title: 'Delivery.field.shippingNoticeNum',
    dataIndex: 'outboundNoticeNo',
    //是否显示type为from时的输入框，不写默认显示（用在新增编辑）
    width: 120,
  },
  
  {
    title: 'Delivery.field.pickQuantity',
    dataIndex: 'pickQuantity',
    //是否显示type为from时的输入框，不写默认显示（用在新增编辑）
    width: 120,
  },
  {
    title: 'Load.field.loadingNo',
    dataIndex: 'loadingNo',
    width: 120,
  },
  {
    title: 'PoDetailList.field.etd',
    dataIndex: 'etd',
    width: 100,
  },
  {
    title: 'Picking.field.soprioritycode',
    dataIndex: 'originalBillNo',
    width: 150,
  },
  {
    title: 'Picking.field.sodeliverytype',
    dataIndex: 'sodeliverytype',
    width: 120,
  },
  {
    title: 'Picking.field.servicelevel',
    dataIndex: 'servicelevel',
    width: 120,
  },
  {
    title: 'Picking.field.shippingmethod',
    dataIndex: 'shippingmethod',
    width: 120,

  },
  {
    title: 'Picking.field.pmcustomerind',
    dataIndex: 'pmcustomerind',
    width: 120,
  },
  {
    title: 'Delivery.field.shipToWmCode',
    dataIndex: 'shipToWmCode',
    width: 120,
  }, {
    title: 'CoList.field.toCountry',
    dataIndex: 'altshiptocountry',
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
    title: 'Delivery.field.shipTime',
    dataIndex: 'shipTime',
    width: 120,
  },
  {
    title: 'Delivery.field.forwarder',
    dataIndex: 'forwarder',
    width: 120,
  },
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

export const columnsSerial = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: 'Delivery.field.serialNo',
    dataIndex: 'serialNo',
    width: 120,

  },
  {
    title: 'Delivery.field.asnNo',
    dataIndex: 'asnNo',
    width: 120,

  },
  {
    title: 'Delivery.field.beReturn',
    dataIndex: 'beReturn',
    width: 120,

  },
  {
    title: 'Delivery.field.beShipAdd',
    dataIndex: 'beShipAdd',
    width: 120,
  },
  {
    title: 'Delivery.field.deliveryNo',
    dataIndex: 'deliveryNo',
    width: 120,
  },
  {
    title: 'Delivery.field.itemCode',
    dataIndex: 'itemCode',
    width: 120,
  },

  {
    title: 'Delivery.field.lotCartonNo',
    dataIndex: 'lotCartonNo',
    width: 120,
  }, {
    title: 'Delivery.field.lotCoo',
    dataIndex: 'lotCoo',
    width: 120,
  }, {
    title: 'Delivery.field.lotDnNo',
    dataIndex: 'lotDnNo',
    width: 120,
  },
  {
    title: 'Delivery.field.lotInfo',
    dataIndex: 'lotInfo',
    width: 120,
  },
  {
    title: 'Delivery.field.lotInvoiceNo',
    dataIndex: 'lotInvoiceNo',
    width: 120,

  },
  {
    title: 'Delivery.field.lotLocation',
    dataIndex: 'lotLocation',
    width: 120,
  },
  {
    title: 'Delivery.field.lotNo',
    dataIndex: 'lotNo',
    width: 120,

  }, {
    title: 'Delivery.field.lotSoi',
    dataIndex: 'lotSoi',
    width: 120,

  },
  {
    title: 'Delivery.field.lotUom',
    dataIndex: 'lotUom',
    width: 120,

  },
  {
    title: 'Delivery.field.lotVendorCode',
    dataIndex: 'lotVendorCode',
    width: 120,
  }, {
    title: 'Delivery.field.lotVendorName',
    dataIndex: 'lotVendorName',
    width: 120,
  }, {
    title: 'Delivery.field.quantity',
    dataIndex: 'quantity',
    width: 120,
  }, {
    title: 'Delivery.field.receiveDate',
    dataIndex: 'receiveDate',
    width: 120,
  }, {
    title: 'Delivery.field.receiveWorker',
    dataIndex: 'receiveWorker',
    width: 120,
  }, {
    title: 'Delivery.field.shipDate',
    dataIndex: 'shipDate',
    width: 120,
  },
  {
    title: 'Delivery.field.shipWorker',
    dataIndex: 'shipWorker',
    width: 120,
  },
  {
    title: 'Delivery.field.status',
    dataIndex: 'status',
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
  {
    title: 'Delivery.field.remarks',
    dataIndex: 'remarks',
    width: 120,
  },
]
export const columnsWare = [
  {
    title: 'name',
    dataIndex: 'name',
    width: 120,
  }
]
