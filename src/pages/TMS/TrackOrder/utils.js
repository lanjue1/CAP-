
// 旧的权限code
export const codes = {
  page: 'EVENTSPAGE',
  updateTrack:'TMS_Management_Update_Tracking',
  import:'TMS_Management_Import',
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
    title:'TrackList.field.eventCode',
    dataIndex:'eventCode',
    width:120,
  },
  {
    title:'TrackList.field.eventDesc',
    dataIndex:'eventDesc',
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
