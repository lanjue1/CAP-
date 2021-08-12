
// 旧的权限code
export const codes = {
  page: 'EVENTSPAGE',
  add:'CO_Management_Add',
  lock:'CO_Management_Lock',
  unlock:'CO_Management_Unlock',
  generateOB:'CO_Management_Generate_OB',
  autoDis:'CO_Management_Autodis',
  cancel:'CO_Management_Cancel_OB',
  updateETA:'CO_Management_UpdateETA',
  detailEdit:'CO_Management_detailEdit',
  forceClose:'CO_Management_forceClose',
  importBuyBack:'CO_Management_importBuyBack',
};
export const Status = [
  {code:'OPEN',value:'OPEN'},
  {code:'ON_HOLD',value:'ON_HOLD'},
  {code:'ACCEPT',value:'ACCEPT'},
  {code:'PROCESS',value:'PROCESS'},
  {code:'FINISHED',value:'FINISHED'},
  {code:'OBSOLETE',value:'OBSOLETE'},
];
export const sodTypeData=[
  {code:'01',value:'CCI'},
  {code:'07',value:'CRU'},
  {code:'06',value:'ON_SITE'},
  {code:'05',value:'ADVANCED_EXCHANGE'},
]

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
    width:100,
  },
  {
    title:'BillTypeList.field.name',
    dataIndex:'name',
    width:250,
  },
  // {
  //   title:'Common.field.type',
  //   dataIndex:'businessType',
  //   width:80,
  // },
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
