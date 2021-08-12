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
  list: 'WarehouseBin/selectWarehouseBin',
  detail: 'WarehouseBin/viewWarehouseBin',
  operate: 'WarehouseBin/operateWarehouseBin',

  abled: 'WarehouseBin/abledWarehouseBin',

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
    type: 'WarehouseBin/allValus',
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
    //列名
    // title: transferLanguage('storeMange.code'),
    title: 'code',
    //对应后端返回的数据字段
    dataIndex: 'code',
    //在新增编辑中输入条件是否为必填
    rules: [
      {
        required: true,
        message: '规则名称为必填项',
      },
    ],
    //表格列的宽度
    width: 120,
    //是否显示顶部查询搜索，不写默认不显示搜索 
    hideInSearch: false,
    //自定义 /baseDataManage/cargoOwnerAdd
    render: (text, record) => (
      <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
    ),
  },
  {
    title: 'warehouseId',
    dataIndex: 'warehouseId',
    width: 120,
  },
  {
    title: 'warehouseAreaId',
    dataIndex: 'warehouseAreaId',
    width: 120,
  },
  {
    title: 'status',
    dataIndex: 'status',
    // valueEnum: {
    //  0: {key: 'ENABLE',value: '启用',},
    //  1:{ key: 'DISABLE', value: '禁用', },
    //   // 0: { code: '启用', value: 'ENABLE' },
    //   // 1: { code: '禁用', value: 'DISABLE' },
    // },
    width: 120,
  },
  {
    title: 'beDeleted',
    dataIndex: 'beDeleted',
    width: 120,

  },
  {
    title: 'typeCode',
    dataIndex: 'typeCode',
    width: 120,
  },
  {
    title: 'zoneNo',
    dataIndex: 'zoneNo',
    width: 120,
  },
  {
    title: 'colNo',
    dataIndex: 'colNo',
    width: 120,

  },
  {
    title: 'layerNo',
    dataIndex: 'layerNo',
    //是否显示type为from时的输入框，不写默认显示（用在新增编辑）
    width: 120,
  },
  {
    title: 'lineNo',
    dataIndex: 'lineNo',
    width: 120,

  },
  {
    title: 'useRate',
    dataIndex: 'useRate',
    width: 120,

  },
  {
    title: 'weight',
    dataIndex: 'weight',
    width: 120,
  }, {
    title: 'volume',
    dataIndex: 'volume',
    width: 120,
  }, {
    title: 'palletQty',
    dataIndex: 'palletQty',
    width: 120,
  },
  {
    title: 'boxQty',
    dataIndex: 'boxQty',
    width: 120,
  },
  {
    title: 'createBy',
    dataIndex: 'createBy',
    width: 120,
  },
  {
    title: 'createTime',
    dataIndex: 'createTime',
    width: 120,
  },
  {
    title: 'updateBy',
    dataIndex: 'updateBy',
    width: 120,
  },
  {
    title: 'updateTime',
    dataIndex: 'updateTime',
    width: 120,
  },
  {
    title: 'remarks',
    dataIndex: 'remarks',
    width: 120,
  },

];

// INLAND("INLAND", "国内车（默认）"),
// HK("HK", " 中港车-过港"),
// HK_NONSTOP("HK_NONSTOP","中港车-直达"),
// LOCAL("LOCAL","本地local"),
// EMPTY("EMPTY","放空"),
// ONE_TEAM("ONE_TEAM","一车队");
