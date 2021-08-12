
// 旧的权限code
export const codes = {
  // select: 'ETCCHANGESELECT',
  // showDetail: 'ETCCHANGESELECT_VIEW',
  // add: 'ETCCHANGESELECT_ADD',
  // edit: 'ETCCHANGESELECT_UPD',
  // upload: 'ETCCHANGESELECT_IMPORT',
  page: 'EVENTSPAGE',
  import:'PO_Management_import',
  cancel:'PO_Management_Cancel',
  export:'PO_Management_Export',
  add:'PO_Management_Add',
  detailEdit:'PO_Management_detailEdit',
  // detailEdit:'PO_Management_detailEdit',
};

// 状态
export const Status = [
  { code: 'OPEN', value: 'OPEN' },
  { code: 'PROCESS', value: 'PROCESS' },
  { code: 'FINISHED', value: 'FINISHED' },
  { code: 'OBSOLETE', value: 'CANCELED' },
  // { code: 'CANCELED', value: 'CANCELED' },
];
export const typeStatus=[
  {code:'PO',value:'PO'},
  {code:'CON',value:'CON'},
]
// po类型
export const PoTypeArr = [{code: 'PO',value: 'PO'},{code:'STO',value:'STO'}];

// 运输优先级
export const TransportPriorityArr = [{code:'20',value:'20'},{code:'40',value:'40'},{code:'60',value:'60'}]

// 国家列表显示字段
export const SelectColumns = [
  {
    title:'BillTypeList.field.code',
    dataIndex:'code',
    width:160,
  },
  {
    title:'BillTypeList.field.name',
    dataIndex:'name',
    width:200,
  },
  {
    title:'Common.field.type',
    dataIndex:'contactType',
    width:80,
  },
]
export const SelectColumnsType = [
  {
    title:'Code',
    dataIndex:'code',
    width:120,
  },
  {
    title:'Name',
    dataIndex:'name',
    width:250,
  },
  
]
export const SelectColumns1 = [
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

// 转换状态描述方法
export function formatStatus(n) {
  switch (n) {
    case 'ENABLE':
      return '启用';

    case 'DISABLE':
      return '禁用';

    default:
      return '';
  }
}
