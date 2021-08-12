
// 旧的权限code
export const codes = {
  // select: 'ETCCHANGESELECT',
  // showDetail: 'ETCCHANGESELECT_VIEW',
  // add: 'ETCCHANGESELECT_ADD',
  // edit: 'ETCCHANGESELECT_UPD',
  // upload: 'ETCCHANGESELECT_IMPORT',
  page: 'EVENTSPAGE',
};

// 状态
export const Status = [{ code: 'OPEN', value: 'OPEN' },
        { code: 'WAIT_RECEVIED', value: 'WAIT_RECEVIED' },
        { code: 'RECEVING', value: 'RECEVING' },
        { code: 'FINISHED', value: 'FINISHED' },
        ];

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

export const SelectColumns = [
  {
    title:'BillTypeList.field.code',
    dataIndex:'code',
    width:60,
  },
  {
    title:'BillTypeList.field.name',
    dataIndex:'name',
    width:120,
  },
]