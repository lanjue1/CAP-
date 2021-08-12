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
  list: 'pickingTask/selectPickingTask',
  detail: 'pickingTask/viewPickingTask',
  confirm:'pickingTask/confirmMoveTask',

};
export const codes = {
  page: 'ENDORSELIST',
 
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
    title: 'Picking.field.picking',
    dataIndex: 'moveNo',
    width: 120,
  },
  {
    title: 'MoveTastList.field.partCode',
    dataIndex: 'partCode',
    width: 120,
  },
  {
    title: 'MoveTastList.field.partStatus',
    dataIndex: 'partStatus',
    width: 120,
  },

  {
    title: 'MoveTastList.field.unPutawayQty',
    dataIndex: 'unPutawayQty',
    width: 120,
  },

  {
    title: 'MoveTastList.field.unPickingQty',
    dataIndex: 'unPickingQty',
    width: 120,

  },
  {
    title: 'MoveTastList.field.lotCartonNo',
    dataIndex: 'lotCartonNo',
    //是否显示type为from时的输入框，不写默认显示（用在新增编辑）
    width: 120,
  },
  {
    title: 'MoveTastList.field.beCreatedSerial',
    dataIndex: 'beCreatedSerial',
    width: 120,

  },
  {
    title: 'MoveTastList.field.putawayQty',
    dataIndex: 'putawayQty',
    width: 120,
  }, 
  {
    title: 'MoveTastList.field.pickingQty',
    dataIndex: 'pickingQty',
    width: 120,
  }, {
    title: 'MoveTastList.field.sourceBinCode',
    dataIndex: 'sourceBinCode',
    width: 120,
  }, {
    title: 'MoveTastList.field.sourceLotCartonNo',
    dataIndex: 'sourceLotCartonNo',
    width: 120,
  },
  {
    title: 'MoveTastList.field.targetBinCode',
    dataIndex: 'targetBinCode',
    width: 120,
  },
];

export const columnsUser=[
  {
    title:'AuthList.field.sysName',
    dataIndex:'sysName',
    width:80,
  },
  {
    title:'AuthList.field.loginName',
    dataIndex:'loginName',
    width:150,
  },
]
export const warehouseColumns=[
  {
    title:'WarehouseList.field.code',
    dataIndex:'code',
  },
  {
    title:'WarehouseList.field.name',
    dataIndex:'warehouseName',
  },
]
