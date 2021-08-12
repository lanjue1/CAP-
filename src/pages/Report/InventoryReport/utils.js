import AdSelect from '@/components/AdSelect';

export const codes = {
    // select: 'ETCCHANGESELECT',
    // showDetail: 'ETCCHANGESELECT_VIEW',
    // add: 'ETCCHANGESELECT_ADD',
    // edit: 'ETCCHANGESELECT_UPD',
    // upload: 'ETCCHANGESELECT_IMPORT',
    page: 'EVENTSPAGE',
  };
export const columns = [
  {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => (<span>{index + 1}</span>),
      width: 50
  },
  {
      // 标题
      title: 'InventoryReport.field.dateFlag',
      // 数据字段
      dataIndex: 'dateFlag',
      // render: (text, record) => (
      //     <span title={text}>{text}</span>
      // ),
  },
  {
      title: 'InventoryReport.field.fruPn',
      dataIndex: 'fruPn',
  },
  {
      title: 'InventoryReport.field.qty',
      dataIndex: 'qty',
      render: text => <span title={text}>{text}</span>,
  },
  {
      title: 'InventoryReport.field.commodityCode',
      dataIndex: 'commodityCode',
      render: text => <span title={text}>{text}</span>,
  },
  {
      title: 'InventoryReport.field.pnDesc',
      dataIndex: 'pnDesc',
      render: text => <span title={text}>{text}</span>,
  },
  {
      title: 'InventoryReport.field.topmostPn',
      dataIndex: 'topmostPn',
      render: text => <span title={text}>{text}</span>,
  },
  {
      title: 'InventoryReport.field.lifecycle',
      dataIndex: 'lifecycle',
  },
  {
      title: 'InventoryReport.field.bu',
      dataIndex: 'bu',
  },
  {
      title: 'InventoryReport.field.sppLocation',
      dataIndex: 'sppLocation',
  },
  {
      title: 'InventoryReport.field.locationType',
      dataIndex: 'locationType',
  },
  {
      title: 'InventoryReport.field.allocatedQty',
      dataIndex: 'allocatedQty',
  },
  {
      title: 'InventoryReport.field.unitPrice',
      dataIndex: 'unitPrice',
  },

  {
      title: 'InventoryReport.field.cargoValue',
      dataIndex: 'cargoValue',
  },
  {
      title: 'InventoryReport.field.country',
      dataIndex: 'country',
  },
  {
      title: 'InventoryReport.field.inventoryType',
      dataIndex: 'inventoryType',
  },
  {
      title: 'InventoryReport.field.po',
      dataIndex: 'po',
  },
  {
      title: 'InventoryReport.field.so',
      dataIndex: 'so',
  },
  {
      title: 'InventoryReport.field.grDate',
      dataIndex: 'grDate',
  },
  {
      title: 'InventoryReport.field.agingDates',
      dataIndex: 'agingDates',
  },
  {
      title: 'InventoryReport.field.remark',
      dataIndex: 'remark',
      // render: text => <AdSelect value={text} onlyRead={true} />,
  },
]