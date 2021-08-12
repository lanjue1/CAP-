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
  list: 'MoveTask/selectMoveTask',
  detail: 'MoveTask/viewMoveTask',
  confirm:'MoveTask/confirmMoveTask',

};
export const codes = {
  page: 'ENDORSELIST',
  workConfirm:'Taskmove_Management_Work_Confirm',
  maskSkip:'Taskmove_Management_Markskip',
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
    title: 'MoveTastList.field.asnNo',
    dataIndex: 'asnNo',
    width: 120,
  },
  {
    //列名
    // title: transferLanguage('storeMange.code'),
    title: 'MoveTastList.field.controlStatus',
    //对应后端返回的数据字段
    dataIndex: 'controlStatus',
    //在新增编辑中输入条件是否为必填
    //表格列的宽度
    width: 120,
    //是否显示顶部查询搜索，不写默认不显示搜索
    // hideInSearch: false,
    //自定义 /baseDataManage/cargoOwnerAdd
    // render: (text, record) => (
    //   <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
    // ),
  },
  {
    title: 'MoveTastList.field.exceptionFlag',
    dataIndex: 'exceptionFlag',
    width: 120,
  },
  {
    title: 'MoveTastList.field.fromBinCode',
    dataIndex: 'fromBinCode',
    width: 120,
  },

  {
    title: 'MoveTastList.field.fromCargoownerName',
    dataIndex: 'fromCargoownerName',
    width: 120,
  },

  {
    title: 'MoveTastList.field.fromReferenceBillType',
    dataIndex: 'fromReferenceBillType',
    width: 120,

  },
  {
    title: 'MoveTastList.field.fromReferenceCode',
    dataIndex: 'fromReferenceCode',
    //是否显示type为from时的输入框，不写默认显示（用在新增编辑）
    width: 120,
  },
  {
    title: 'MoveTastList.field.fromRouteNo',
    dataIndex: 'fromRouteNo',
    width: 120,

  },
  {
    title: 'MoveTastList.field.itemName',
    dataIndex: 'partName',
    width: 120,
  }, 
  {
    title: 'MoveTastList.field.itemStatus',
    dataIndex: 'partStatus',
    width: 120,
  }, {
    title: 'MoveTastList.field.lotCoo',
    dataIndex: 'lotCoo',
    width: 120,
  }, {
    title: 'MoveTastList.field.lotInfo',
    dataIndex: 'lotInfo',
    width: 120,
  },
  {
    title: 'MoveTastList.field.lotInvoiceNo',
    dataIndex: 'lotInvoiceNo',
    width: 120,
  },
  {
    title: 'MoveTastList.field.lotLocation',
    dataIndex: 'lotLocation',
    width: 120,
  },
  {
    title: 'MoveTastList.field.lotNo',
    dataIndex: 'lotNo',
    width: 120,
  },
  {
    title: 'MoveTastList.field.lotSoi',
    dataIndex: 'lotSoi',
    width: 120,
  },
  {
    title: 'MoveTastList.field.lotUom',
    dataIndex: 'lotUom',
    width: 120,
  },
  {
    title: 'MoveTastList.field.lotVendorCode',
    dataIndex: 'lotVendorCode',
    width: 120,
  },
  {
    title: 'MoveTastList.field.lotVendorName',
    dataIndex: 'lotVendorName',
    width: 120,
  },{
    title: 'MoveTastList.field.movedQuantity',
    dataIndex: 'movedQuantity',
    width: 120,
  },
  {
    title: 'MoveTastList.field.pickMode',
    dataIndex: 'pickMode',
    width: 120,
  },
  {
    title: 'MoveTastList.field.planQuantity',
    dataIndex: 'planQuantity',
    width: 120,
  },
  {
    title: 'MoveTastList.field.serialNo',
    dataIndex: 'serialNo',
    width: 120,
  },
  {
    title: 'MoveTastList.field.status',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: 'MoveTastList.field.targetBin',
    dataIndex: 'targetBin',
    width: 120,
  },
  {
    title: 'MoveTastList.field.toBinCode',
    dataIndex: 'toBinCode',
    width: 120,
  },
  {
    title: 'MoveTastList.field.toCargoownerName',
    dataIndex: 'toCargoownerName',
    width: 120,
  },
  {
    title: 'MoveTastList.field.toRouteNo',
    dataIndex: 'toRouteNo',
    width: 120,
  },
  {
    title: 'MoveTastList.field.type',
    dataIndex: 'type',
    width: 120,
  },

  // {
  //   title: 'MoveTastList.field.createBy',
  //   dataIndex: 'createBy',
  //   width: 120,
  // },
  // {
  //   title: 'MoveTastList.field.createTime',
  //   dataIndex: 'createTime',
  //   width: 120,
  // },
  {
    title: 'MoveTastList.field.updateBy',
    dataIndex: 'updateBy',
    width: 120,
  },
  {
    title: 'MoveTastList.field.updateTime',
    dataIndex: 'updateTime',
    width: 120,
  },
  {
    title: 'MoveTastList.field.remarks',
    dataIndex: 'remarks',
    width: 120,
  },

];

export const columnsUser=[
  {
    title:'AuthList.field.sysName',
    dataIndex:'sysName',
    width:150,
  },
  {
    title:'AuthList.field.loginName',
    dataIndex:'loginName',
    width:150,
  },
]
export const columnsBin=[
  {
    title:'BillTypeList.field.code',
    dataIndex:'code',
  },
]
