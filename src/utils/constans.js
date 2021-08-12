export const editGutter = { md: 8, lg: 24, xl: 48 };
export const editCol = { md: 12, sm: 24 };
export const editRow = { md: 24 };

export const listCol = { md: 8, sm: 24 };
export const _PageSize = 50;
export const oilBillStateList = [
  { code: 'WAIT', value: '待确认' },
  { code: 'CONFIRM', value: '已确认' },
  { code: 'COMMIT', value: '已提交' },
  { code: 'FINISH', value: '已完成' },
];
export const billStateList = [
  { code: 'CONFIRM', value: '已确认' },
  { code: 'COMMIT', value: '已提交' },
  { code: 'FINISH', value: '已完成' },
];

//证件状态：
export const papersStatus = [
  { code: 'AWAIT', value: '待生效' },
  { code: 'EFFECTIVE', value: '生效' },
  { code: 'INEFFECTIVE', value: '失效' },
];

export const billStateOnlyReadList = [
  { code: 'CONFIRM', value: '已确认' },
  { code: 'DRAFT', value: '已提交' },
  { code: 'AUDITING', value: '已提交' },
  { code: 'BACK', value: '已提交' },
  { code: 'FINISH', value: '已完成' },
  { code: 'WAIT', value: '待确认' },
];

export const allDictList = {
  saleCompany: 'sale-company',
  currencyType: 'currency-type',
  oilType: 'oil-type',
  payCompany: 'PAY_COMPANY',
  upkeepType: 'upkeep-type',
  insuranceType: 'insurance-type',
  insuranceObject: 'insurance-object',
  etcChangeType: 'ETC_CHANGE_TYPE',
  billType: 'BILL_TYPE',
  costSubjects: 'COST_SUBJECTS',
  billOilPayobject: 'BILL_OIL_PAYOBJECT',
  partsType: 'PARTS_TYPE',
  partsUnit: 'PARTS_UNIT',
  partsSupplier: 'PARTS_SUPPLIER',
  papersType: 'papers-type', //司机证件
  vehiclePapersType: 'VEHICLE-PAPERS-TYPE', //车辆证件
  inspectionType: 'INSPECTION-TYPE', //车辆证件和年审证件用同一个类型:
  manifest_transport: 'MANIFEST_TRANSPORT_METHOD', //运输方式
  manifest_goods: 'MANIFEST_GOODS_ITEMS', //海关货物通关代码
  manifest_pay: 'MANIFEST_PAY_METHOD', //运费支付方法
  manifest_current: 'MANIFEST_CURRENT', //金额类型
  package_category: 'PACKAGE_CATEGORY', //包装种类
  sequenceType: 'SEQUENCE_TYPE', //流水号类型
  vehicleType: 'VEHICLE_TYPE', //车辆类型
  archives_place: 'ARCHIVES_PLACE', //始发地
  archivesYCD_place: 'ONETEAM_ADDRESS', //一车队始发地地址
  otherFeeType: 'OTHER-FEE-TYPE', //费用类型
  cabinetType: 'CABINET_TYPE', //柜型
  ems_catetory: 'EMS_CATETORY', //异常类别
  ems_level: 'EMS_LEVEL', //异常级别
  ems_priority: 'EMS_PRIORITY', //异常优先级
  abnormalCauseType: 'ABNORMAL_CAUSE_TYPE', //异常原因类别
  vehicleCategory: 'vehicle_category',
  vehicleType: 'vehicle_type',
  coach: 'coach',
  vehicleProperties: 'vehicle_properties',
  coach: 'coach',
  taxRate: 'TAX_RATE', // 税率
  businessType: 'BUSINESS_TYPE', //行车档案--业务类型
   
  emptyType:'ARCHIVES_EMPTY_TYPE',//中港车-老的放空类型
  emptyType_ZG:'ARCHIVES_ABNORMAL_TYPE_ZG',//中港车-中港 -异常类型
  emptyType_QS:'ARCHIVES_ABNORMAL_TYPE_QS',//中港车-骑师 -异常类型
  cabinetTypeHK: 'CABINET_TYPE_HK',
  straightAddress: 'STRAIGHTADDRESS',
  mysqlType: 'MYSQL_TYPE',
  pressure_placeHK: 'PRESSURE_PLACE_HK',
  transfer_placeHK: 'TRANSFER_PLACE_HK',

  traffic_offence:'TRAFFIC_OFFENCE_PROJECT_CODE', //交通违法项目
  driverType:'DRIVERTYPE',//司机类型
  costTag:'ZF_COST_TAG',// 费用标识
  declareListType:'MANIFEST_MESSAGE_TYPE',//舱单类型manifest

  
};

export const beWork = [
  { code: 'ONTHEJOB', value: '在职' },
  { code: 'DIMISSION', value: '离职' },

];
export const beAssume = [
  { code: 'ASSUME', value: '承担' },
  { code: 'NOTASSUME', value: '不承担' },

];
export const processMode = [
  { code: 'WARNING', value: '警告' },
  { code: 'FORFEIT', value: '罚款' },

];
export const confirmState = [
  { code: 'UNSEALED', value: '待提交' },
  { code: 'CONFIRM', value: '已确认' },
  { code: 'SUBMITTED', value: '已提交' },

];
