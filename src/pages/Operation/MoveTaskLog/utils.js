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
  list: 'MoveTaskLog/selectMoveTaskLog',

  detail: 'MoveTaskLog/viewMoveTaskLog',
  confirm:'MoveTask/confirmMoveTask',

};
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
    title: 'MoveTaskLog.field.controlStatus',
    dataIndex: 'controlStatus',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.moveDocNo',
    dataIndex: 'moveDocNo',
    width: 120,
  },
  
  {
    title: 'MoveTaskLog.field.exceptionFlag',
    dataIndex: 'exceptionFlag',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.fromBinCode',
    dataIndex: 'fromBinCode',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.fromCargoownerName',
    dataIndex: 'fromCargoownerName',
    width: 120,
  },
  
  {
    title: 'MoveTaskLog.field.fromReferenceBillType',
    dataIndex: 'fromReferenceBillType',
    width: 120,

  },
  {
    title: 'MoveTaskLog.field.fromReferenceCode',
    dataIndex: 'fromReferenceCode',
    //是否显示type为from时的输入框，不写默认显示（用在新增编辑）
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.fromRouteNo',
    dataIndex: 'fromRouteNo',
    width: 120,

  },
  {
    title: 'MoveTaskLog.field.itemStatus',
    dataIndex: 'partStatus',
    width: 120,
  },{
    title: 'MoveTaskLog.field.lotCartonNo',
    dataIndex: 'lotCartonNo',
    width: 120,
  },  {
    title: 'MoveTaskLog.field.lotCoo',
    dataIndex: 'lotCoo',
    width: 120,
  }, {
    title: 'MoveTaskLog.field.lotInfo',
    dataIndex: 'lotInfo',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.lotInvoiceNo',
    dataIndex: 'lotInvoiceNo',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.lotLocation',
    dataIndex: 'lotLocation',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.lotNo',
    dataIndex: 'lotNo',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.lotSoi',
    dataIndex: 'lotSoi',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.lotUom',
    dataIndex: 'lotUom',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.lotVendorCode',
    dataIndex: 'lotVendorCode',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.lotVendorName',
    dataIndex: 'lotVendorName',
    width: 120,
  },{
    title: 'MoveTaskLog.field.movedQuantity',
    dataIndex: 'movedQuantity',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.pickMode',
    dataIndex: 'pickMode',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.serialNo',
    dataIndex: 'serialNo',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.status',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.toBinCode',
    dataIndex: 'toBinCode',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.toCargoownerName',
    dataIndex: 'toCargoownerName',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.referenceBillType',
    dataIndex: 'toReferenceBillType',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.referenceCode',
    dataIndex: 'toReferenceCode',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.toRouteNo',
    dataIndex: 'toRouteNo',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.type',
    dataIndex: 'type',
    width: 120,
  },
  
  {
    title: 'MoveTaskLog.field.createBy',
    dataIndex: 'createBy',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.createTime',
    dataIndex: 'createTime',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.updateBy',
    dataIndex: 'updateBy',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.updateTime',
    dataIndex: 'updateTime',
    width: 120,
  },
  {
    title: 'MoveTaskLog.field.remarks',
    dataIndex: 'remarks',
    width: 120,
  },

];

export const columnsUser=[
  {
    title:'sysName',
    dataIndex:'sysName',
    width:150,
  },
  {
    title:'loginName',
    dataIndex:'loginName',
    width:150,
  },
]
export const columnsBin=[
  {
    title:'code',
    dataIndex:'code',
  },
]