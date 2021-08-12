import AdSelect from '@/components/AdSelect';

// 旧的权限code
export const codes = {
  // select: 'ETCCHANGESELECT',
  // showDetail: 'ETCCHANGESELECT_VIEW',
  // add: 'ETCCHANGESELECT_ADD',
  // edit: 'ETCCHANGESELECT_UPD',
  // upload: 'ETCCHANGESELECT_IMPORT',
  page: 'EVENTSPAGE',
  createASN:'IBPlan_Management_ASN',
  createAutoASN:'IBPlan_Management_Auto_ASN',
  
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
    title: 'BillTypeList.field.code',
    dataIndex: 'code',
    width:60,
  },
  {
    title: 'BillTypeList.field.name',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: 'Common.field.type',
    dataIndex: 'businessType',
    width: 80,
  },
]
export const typeStatus=[
  {code:'PO',value:'PO'},
  {code:'CON',value:'CON'},
]
export const columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: 'IBPlan.field.poNo',
    dataIndex: 'poNo',
  },
  {
    title: 'IBPlan.field.status',
    dataIndex: 'status',
  },
  {
    title: 'InventoryReport.field.so',
    dataIndex: 'soNo',
  },
  {
    // 标题
    title: 'IBPlan.field.prNo',
    // 数据字段
    dataIndex: 'prNo',
    render: (text, record) => (
      <span title={text}>{text}</span>
    ),
  },
  
 
  {
    title: 'PoList.field.type',
    dataIndex: 'billTypeName',
  }, 
  {
    title: 'ASN.field.asnNo',
    dataIndex: 'asnNo',
  },
  {
    title: 'IBPlan.field.partNo',
    dataIndex: 'partNo',
  },
  {
    title: 'IBPlan.field.partDesc',
    dataIndex: 'partDesc',
    render: text => <AdSelect value={text} onlyRead={true} />,
  },
  {
    title: 'IBPlan.field.transportPriority',
    dataIndex: 'transportPriority',
    render: text => <AdSelect value={text} onlyRead={true} />,
  },
  {
    title: 'IBPlan.field.pieceQty',
    dataIndex: 'pieceQty',
    render: text => <AdSelect value={text} onlyRead={true} />,
  },
  {
    title: 'PoDetailList.field.openQty',
    dataIndex: 'openQty',
    render: text => <span title={text}>{text}</span>,
  },
  {
    title: 'IBPlan.field.bolNo',
    dataIndex: 'bolNo',
  }, {
    title: 'ASN.field.forwarder',
    dataIndex: 'forwarder',
    render: text => <span title={text}>{text}</span>,
  },
  
  {
    title: 'IBPlan.field.dn',
    dataIndex: 'dn',
    render: text => <AdSelect value={text} onlyRead={true} />,
  },
  {
    title: 'IBPlan.field.deliveryDate',
    dataIndex: 'deliveryDate',
    render: text => <AdSelect value={text} onlyRead={true} />,
  },
  {
    title: 'PoList.field.consigner',
    dataIndex: 'consigner',
    render: text => <AdSelect value={text} onlyRead={true} />,
  }, {
    title: 'PoList.field.consignee',
    dataIndex: 'consignee',
    render: text => <AdSelect value={text} onlyRead={true} />,
  }, 
  // {
  //   title: 'PoList.field.shipFrom',
  //   dataIndex: 'shipFrom',
  //   render: text => <AdSelect value={text} onlyRead={true} />,
  // }, 
  {
    title: 'PoDetailList.field.deliveryText',
    dataIndex: 'deliveryText',
    render: text => <AdSelect value={text} onlyRead={true} />,
  },


  
  {
    title: 'ASN.field.shipFromWmCode',
    dataIndex: 'shipFromWmCode',
  },
  {
    title: 'shipping.field.shipToWmCode',
    dataIndex: 'shipToWmCode',
  },
  
  //   {
  //       title: 'IBPlan.field.totalGrossWeight',
  //       dataIndex: 'totalGrossWeight',
  //       render: text => <AdSelect value={text} onlyRead={true} />,
  //   },
  //   {
  //       title: 'IBPlan.field.totalNetWeight',
  //       dataIndex: 'totalNetWeight',
  //       render: text => <AdSelect value={text} onlyRead={true} />,
  //   },
  //   {
  //       title: 'IBPlan.field.totalVolume',
  //       dataIndex: 'totalVolume',
  //       render: text => <AdSelect value={text} onlyRead={true} />,
  //   },
   {
    title: 'PoDetailList.field.esd',
    dataIndex: 'esd',
    render: text => <AdSelect value={text} onlyRead={true} />,
  }, {
    title: 'PoDetailList.field.eta',
    dataIndex: 'eta',
    render: text => <AdSelect value={text} onlyRead={true} />,
  }, 
  {
    title: 'PoDetailList.field.atd',
    dataIndex: 'atd',
    render: text => <AdSelect value={text} onlyRead={true} />,
  },
  {
    title: 'PoDetailList.field.etd',
    dataIndex: 'etd',
    render: text => <AdSelect value={text} onlyRead={true} />,
  },  {
    title: 'PoDetailList.field.ata',
    dataIndex: 'ata',
    render: text => <AdSelect value={text} onlyRead={true} />,
  },

  
  //   {
  //       title: 'IBPlan.field.unitPrice',
  //       dataIndex: 'unitPrice',
  //       render: text => <AdSelect value={text} onlyRead={true} />,
  //   },
  {
    title: 'IBPlan.field.remarks',
    dataIndex: 'remarks',
    render: text => <AdSelect value={text} onlyRead={true} />,
  },
  {
    title: 'IBPlan.field.updateBy',
    dataIndex: 'updateBy',
    render: text => <AdSelect value={text} onlyRead={true} />,
  },
  {
    title: 'IBPlan.field.updateTime',
    dataIndex: 'updateTime',
    render: text => <AdSelect value={text} onlyRead={true} />,
  },


]
