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


export const Status = [
  { code: 'ENABLE', value: '启用' },
  { code: 'ENABLED', value: '启用' },
  { code: 'DISABLE', value: '禁用' },
];
export const isTrue = [
  { code: false, value: '否' },
  { code: true, value: '是' },
]

export const routeUrl = {
  add: '/basicData/warehouseBin/warehouseBinAdd',
  edit: '/basicData/warehouseBin/warehouseBinEdit',


};

export const allDispatchType = {
  //请求的url
  list: 'InventoryLog/selectInventoryLog',
  detail: 'InventoryLog/viewInventoryLog',


};
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
export function renderTableAdSelect({ key, data, value, props, type }) {
  let params = { onlyRead: true, value };

  if (key) {
    const { dictObject } = props;
    params = { data: dictObject[key], payload: { code: [key] }, ...params };
  } else {
    params = { data, ...params };
  }
  let show = { id: 'code', name: 'value' };
  if (type == 'train') {
    show = { id: 'id', name: 'trainNo' };
  }
  params.show = show;
  return <AdSelect {...params} />;
}

export function renderTableAdSearch({ value, props }) {
  if (!value || !searchValue) return '';
  const { searchValue } = props;
  const params = {
    onlyRead: true,
    value: searchValue[value],
    label: 'loginName',
    name: 'sysName',
  };
  return <AdSearch {...params} />;
}

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



export function saveAllValues({ payload = {}, props } = {}) {
  const { dispatch } = props;
  dispatch({
    type: 'MoveTask/allValus',
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
    title: 'InventoryLog.field.partCode',
    dataIndex: 'partCode',
    width: 120,
  },
  {
    title: 'Delivery.field.soId',
    dataIndex: 'soId',
    width: 120,
  },
  {
    title: 'InventoryLog.field.lotSoi',
    dataIndex: 'lotSoi',
    width: 120,
  },
  {
    title: 'InventoryLog.field.operationNo',
    dataIndex: 'operationNo',
    width: 150,
  }, 
  {
    title: 'InventoryLog.field.operationType',
    dataIndex: 'operationType',
    width: 120,
  },
  {
    title: 'InventoryLog.field.logType',
    dataIndex: 'logType',
    width: 100,
  },
  {
    title: 'InventoryLog.field.lotLocation',
    dataIndex: 'lotLocation',
    width: 120,
  },
  {
    title: 'ASN.field.asnNo',
    dataIndex: 'asnNo',
    width: 180,
  },
  {
    title: 'InventoryLog.field.lotMpq',
    dataIndex: 'lotMpq',
    width: 80,
  },
  {
      title: 'InventoryLog.field.quantity',
      dataIndex: 'quantity',
      width: 80,
    },
    {
      title: 'ASNRecord.field.workerName',
      dataIndex: 'workUserName',
      width: 100,
    },

    {
      title: 'InventoryLog.field.inOrOut',
      dataIndex: 'inOrOut',
      width: 80,
    },
    {
      title: 'InventoryLog.field.binCode',
      dataIndex: 'binCode',
      width: 120,
    },


  {
    title: 'InventoryLog.field.partName',
    dataIndex: 'partName',
    width: 120,

  },
  {
    title: 'InventoryLog.field.partStatus',
    dataIndex: 'partStatus',
    width: 120,
  },
  {
    title: 'InventoryLog.field.lotCoo',
    dataIndex: 'lotCoo',
    width: 120,

  },
  {
    title: 'Common.field.createTime',
    dataIndex: 'createTime',
    width: 100,
  },
  // {
  //   title: 'InventoryLog.field.lotDnNo',
  //   dataIndex: 'lotDnNo',
  //   width: 120,

  // },
  // {
  //   title: 'InventoryLog.field.lotInfo',
  //   dataIndex: 'lotInfo',
  //   width: 120,
  // }, {
  //   title: 'InventoryLog.field.lotInvoiceNo',
  //   dataIndex: 'lotInvoiceNo',
  //   width: 120,
  // }, {
  //   title: 'InventoryLog.field.lotLocation',
  //   dataIndex: 'lotLocation',
  //   width: 120,
  // },
  // {
  //   title: 'InventoryLog.field.lotNo',
  //   dataIndex: 'lotNo',
  //   width: 120,
  // },
  // {
  //   title: 'InventoryLog.field.lotSoi',
  //   dataIndex: 'lotSoi',
  //   width: 120,
  // },{
  //   title: 'InventoryLog.field.lotVendorCode',
  //   dataIndex: 'lotVendorCode',
  //   width: 120,
  // },{
  //   title: 'InventoryLog.field.lotVendorName',
  //   dataIndex: 'lotVendorName',
  //   width: 120,
  // },{
  //   title: 'InventoryLog.field.lotUnitPrice',
  //   dataIndex: 'lotUnitPrice',
  //   width: 150,
  // },
  // {
  //   title: 'InventoryLog.field.lotUom',
  //   dataIndex: 'lotUom',
  //   width: 150,
  // },
  // {
  //   title: 'InventoryLog.field.referenceCode',
  //   dataIndex: 'referenceCode',
  //   width: 120,
  // },

  // {
  //   title: 'InventoryLog.field.workUserName',
  //   dataIndex: 'workUserName',
  //   width: 120,
  // },
  // {
  //   title: 'InventoryLog.field.createBy',
  //   dataIndex: 'createBy',
  //   width: 120,
  // },
  // {
  //   title: 'InventoryLog.field.createTime',
  //   dataIndex: 'createTime',
  //   width: 120,
  // },
  // {
  //   title: 'InventoryLog.field.updateBy',
  //   dataIndex: 'updateBy',
  //   width: 120,
  // },
  // {
  //   title: 'InventoryLog.field.updateTime',
  //   dataIndex: 'updateTime',
  //   width: 120,
  // },
  // {
  //   title: 'InventoryLog.field.remarks',
  //   dataIndex: 'remarks',
  //   width: 120,
  // },

];

