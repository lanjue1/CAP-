
// 旧的权限code
export const codes = {
  // select: 'ETCCHANGESELECT',
  // showDetail: 'ETCCHANGESELECT_VIEW',
  // add: 'ETCCHANGESELECT_ADD',
  // edit: 'ETCCHANGESELECT_UPD',
  // upload: 'ETCCHANGESELECT_IMPORT',
  page: 'EVENTSPAGE',
  lock:'STO_Management_Lock',
  unlock:'STO_Management_Unlock',
  generateOB:'STO_Management_Generate_OB',
  cancel:'STO_Management_Cancel',
  add:'STO_Management_Add',
  detailEdit:'STO_Management_detailEdit',
  detailA:'STO_Management_detailA',
};

// 状态
// export const Status = [
//   { code: 'OPEN', value: 'OPEN' },
//   { code: 'PROCESS', value: 'PROCESS' },
//   { code: 'FINISHED', value: 'FINISHED' },
//   { code: 'OBSOLETE', value: 'OBSOLETE' },
// ];
export const Status = [
  {code:'OPEN',value:'OPEN'},
  {code:'ON_HOLD',value:'ON_HOLD'},
  {code:'ACCEPT',value:'ACCEPT'},
  {code:'PROCESS',value:'PROCESS'},
  {code:'FINISHED',value:'FINISHED'},
  {code:'OBSOLETE',value:'OBSOLETE'},
];


// po类型
export const CoTypeArr = [{code: 'CO',value: 'CO'}];

// 运输优先级
export const TransportPriorityArr = [{code:'20',value:'Express'},{code:'40',value:'Air'},{code:'60',value:'Sea'}]


export const BooleanArr =[{code:'true',value:'Common.field.true'},{code:'false',value:'Common.field.false'}]

// 国家列表显示字段
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
  {
    title:'Common.field.type',
    dataIndex:'businessType',
    width:80,
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
