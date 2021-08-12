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
    title: 'PoReport.field.businessModel',
    dataIndex: 'businessModel',
  },
  {
    title: 'PoReport.field.shipperName',
    dataIndex: 'shipperName'
  },
  {
    title: 'PoReport.field.prid',
    dataIndex: 'prid',
  },
  {
    title: 'PoReport.field.so',
    dataIndex: 'so',
  },
  {
    title: 'PoReport.field.po',
    dataIndex: 'po',
  },
  {
    title: 'PoReport.field.shipToCode',
    dataIndex: 'shipToCode',
  },
  {
    title: 'PoReport.field.originCountry',
    dataIndex: 'originCountry',
  },
  {
    title: 'PoReport.field.destinationaCountry',
    dataIndex: 'destinationaCountry',
  },
  {
    title: 'PoReport.field.fromloc',
    dataIndex: 'fromloc',
  },
  {
    title: 'PoReport.field.toloc',
    dataIndex: 'toloc',
  },
  {
    title: 'PoReport.field.originalPN',
    dataIndex: 'originalPN',
  },
  {
    title: 'PoReport.field.originPNQTY',
    dataIndex: 'originPNQTY',
  },
  {
    title: 'PoReport.field.originalPNDescription',
    dataIndex: 'originalPNDescription',
  },
  {
    title: 'PoReport.field.actualShipPN',
    dataIndex: 'actualShipPN',
  },
  {
    title: 'PoReport.field.cc',
    dataIndex: 'cc',
  },
  {
    title: 'PoReport.field.shipPNDescription',
    dataIndex: 'shipPNDescription',
  },
  {
    title: 'PoReport.field.actualShipQTY',
    dataIndex: 'actualShipQTY',
    render: text => <span title={text}>{text}</span>,
  },
  {
    title: 'PoReport.field.invoice',
    dataIndex: 'invoice',
  },
  {
    title: 'PoReport.field.unitPrice',
    dataIndex: 'unitPrice',
  },
  {
    title: 'PoReport.field.totalAmount',
    dataIndex: 'totalAmount',
  },
  {
    title: 'PoReport.field.dn',
    dataIndex: 'dn',
  },
  {
    title: 'PoReport.field.bol',
    dataIndex: 'bol',
  },
  {
    title: 'PoReport.field.grossWeight',
    dataIndex: 'grossWeight',
  },
  {
    title: 'PoReport.field.chargeableWeight	',
    dataIndex: 'chargeableWeight	',
  },
  {
    title: 'PoReport.field.asn',
    dataIndex: 'asn',
    render: text => <span title={text}>{text}</span>,
  },
  {
    title: 'PoReport.field.itemLine',
    dataIndex: 'itemLine',
  },
  {
    title: 'PoReport.field.mot',
    dataIndex: 'mot',
  },
  {
    title: 'PoReport.field.dncreationDate',
    dataIndex: 'dncreationDate',
  },
  {
    title: 'PoReport.field.gidate',
    dataIndex: 'gidate',
  },
  {
    title: 'PoReport.field.pickUpDate',
    dataIndex: 'pickUpDate',
  },
  {
    title: 'PoReport.field.mawb',
    dataIndex: 'mawb',
  },
  {
    title: 'PoReport.field.hawb',
    dataIndex: 'hawb',
  },
  {
    title: 'PoReport.field.flightVesselName',
    dataIndex: 'flightVesselName',
  },
  {
    title: 'PoReport.field.sla',
    dataIndex: 'sla',
  },
  {
    title: 'PoReport.field.etd',
    dataIndex: 'etd',
  },
  {
    title: 'PoReport.field.eta',
    dataIndex: 'eta',
  },
  {
    title: 'PoReport.field.atd',
    dataIndex: 'atd',
  },
  {
    title: 'PoReport.field.ata',
    dataIndex: 'ata',
    render: text => <span title={text}>{text}</span>,
  },
  {
    title: 'PoReport.field.customsClearanceDate',
    dataIndex: 'customsClearanceDate',
  },
  {
    // 标题
    title: 'PoReport.field.actualDeliveredWHdate',
    // 数据字段
    dataIndex: 'actualDeliveredWHdate',
  },
  {
    title: 'PoReport.field.pod',
    dataIndex: 'pod',
  },
  {
    title: 'PoReport.field.gr_data',
    dataIndex: 'gr_data',
  },
  {
    title: 'PoReport.field.actualReceivePN',
    dataIndex: 'actualReceivePN',
  },
  {
    title: 'PoReport.field.actualReceiveQTY',
    dataIndex: 'actualReceiveQTY',
    render: text => <span title={text}>{text}</span>,
  },
  {
    title: 'PoReport.field.shipmentStatus',
    dataIndex: 'shipmentStatus',
  },
  {
    title: 'PoReport.field.forwarder',
    dataIndex: 'forwarder',
  },
  {
    title: 'PoReport.field.remark',
    dataIndex: 'remark',
  },
  {
    title: 'PoReport.field.lastChangeTime',
    dataIndex: 'lastChangeTime',
  },
]