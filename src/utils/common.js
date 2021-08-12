import React, { Fragment } from 'react';
import { Icon, Modal, Row, Col } from 'antd';
import prompt from '@/components/Prompt';
import { editCol, editGutter, listCol, editRow, _PageSize } from '@/utils/constans';
import AdSelect from '@/components/AdSelect';


export function getPageSize(PageSize) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return _PageSize;
  return PageSize ? PageSize :
    Number(localStorage.getItem(`${user.loginName}_pageSize`)) || _PageSize;
  // return Number(localStorage.getItem(`${user.loginName}_pageSize`)) === 500
  //   ? 100
  //   : PageSize?PageSize:
  //   Number(localStorage.getItem(`${user.loginName}_pageSize`)) || _PageSize;
}
//截取路由参数
export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

export function queryDictData({
  dispatch,
  type = 'component/querytDictByCode',
  payload = {},
  iExist = false,
}) {
  !iExist &&
    dispatch({
      type,
      payload,
    });
}

export function checkSuffix(str) {
  var strRegex = '(.jpg|.png|.gif|.bmp|.jpeg)$';
  var re = new RegExp(strRegex);
  if (re.test(str.toLowerCase())) {
    return true;
  } else {
    return false;
  }
}

export function formatFile(text, url) {
  const _url = url ? url : 'tms/tms-attachment';
  if (Array.isArray(text) && text.length > 0) {
    return text.map(v => {
      const fileName = v.fileUrl.substring(v.fileUrl.lastIndexOf('.'), v.fileUrl.length);
      const checkFile = checkSuffix(fileName);
      const _href = `/server/api/${_url}/readFile?path=${v.fileUrl}&token=${localStorage.getItem(
        'token'
      )}`;
      const _html = (
        <span>
          {!checkFile ? (
            <a target="_blank" href={_href}>
              <Icon type="link" style={{ marginRight: 8 }} />
            </a>
          ) : (
              <a target="_blank" href={_href}>
                <Icon type="picture" style={{ marginRight: 8 }} />
              </a>
            )}
        </span>
      );
      return _html;
    });
  }
  return null;
}

export function queryFileList({
  props, params, url = 'attachment/selectFileList', callback }) {
  const { dispatch } = props;
  dispatch({
    type: 'component/queryComponentList',
    payload: { params, url },
    callback: data => {
      if (!data) return;
      callback && callback(data);
    },
  });
}

export function queryDict({ props, allDict = [] }) {
  const { dispatch, dictObject } = props;
  allDict.map(v => {
    queryDictData({
      dispatch,
      payload: { code: v },
      isExist: dictObject[v],
    });
  });
}

export function queryPerson({
  props,
  data,
  url,
  key = 'loginName',
  labels = ['updateBy', 'createBy', 'commitBy'],
}) {
  const { dispatch, searchValue } = props;
  let valueList = [];
  data.map(v => {
    labels.map(item => {
      if (v[item] && !valueList.includes(v[item])) {
        valueList.push(v[item]);
        !searchValue[v[item]] &&
          dispatch({
            type: 'component/querySearchValue',
            payload: { params: { [key]: v[item] }, url },
          });
      }
    });
  });
}

/**
 * 校验具体逻辑判断
 */
export function vitifyCheck({ key, warn, selectedRows }) {
  let value = selectedRows.map(v => v[key]);
  value = Array.from(new Set(value));
  if (value.length > 1) {
    prompt({ title: '温馨提示', content: warn, type: 'warn' });
    return null;
  }
  return value;
}

export function formItemFragement(formItem) {
  return (
    <Fragment>
      {formItem.map((item, index) => {
        return (
          <Row gutter={editGutter} key={index}>
            {item &&
              item.map((v, i) => {
                const colSpan = item.length === 1 ? editRow : item.length === 2 ? editCol : listCol;
                return (
                  <Col {...colSpan} key={index + i}>
                    {v}
                  </Col>
                );
              })}
          </Row>
        );
      })}
    </Fragment>
  );
}

export function allAddFile(fileList) {
  if (!fileList) return [];
  return fileList.map(file =>
    file.response && file.response.code == 0 ? file.response.data : file.fileToken
  );
}

export function filterAddFile(fileList) {
  if (!fileList) return [];
  return fileList
    .filter(file => file.response && file.response.code == 0)
    .map(file => file.response.data);
}

export function filterDeteteFile(newFileList, oldFileList) {
  if (!oldFileList) return [];
  return oldFileList
    .filter(
      item =>
        !newFileList
          .filter(item => !item.response)
          .map(item => item.id)
          .includes(item.id)
    )
    .map(item => item.id);
}

export function renderTableAdSelect({ key, data, value, props }) {
  let params = { onlyRead: true, value };
  if (key) {
    const { dictObject } = props;
    params = { data: dictObject[key], payload: { code: [key] }, ...params };
  } else {
    params = { data, ...params };
  }
  return <AdSelect {...params} />;
}

//时间格式化
export const formateDateToMin = 'YYYY-MM-DD HH:mm';
export const formateDateToSec = 'YYYY-MM-DD HH:mm:ss';

// 金额相关的格式化
export function formatPrice(text) {
  const val = text ? (text && Number(text) !== 0 ? Number(text).toFixed(2) : 0) : '';
  return val;
}
export const allDictList = {
  Disposition: 'Disposition',
  Redemption: 'Redemption',
  partStatus: 'QUALITY_LOCATIONS',
  billTypeCode: 'WmsBillTypeCode',
  binType: 'WmsBinType',
  orderType: 'WmsAsnOrderType',
  loadlistStatus: 'WmsLoadingListStatus',
  deliveryStatus: 'WmsDeliveryStatus',
  receiptType: 'RECEIPT_TYPE',
  asnStatus: 'WmsAsnStatus',
  receivePartStatus: 'WmsPartStatus',
  cargoOwnerStatus: 'MdsCargoOwnerStatus',
  serialNoStatus: 'WmsSerialNoStatus',
  transportType: 'WmsTransportType',
  contactUnitType: 'WmsContactUnitType',
  pickStatus: 'WmsPickStatus',
  IQCStatus: 'WmsQualityDocStatus',
  RMOPartCC: 'RMO_PARTCC',
  rmoStatus: 'RMO_STATUS',
  finalDisposition: 'Disposition',
  finalRedemption: 'Redemption',
  finalLocation: 'QUALITY_LOCATIONS',
  WmsOrderType: 'WmsOrderType',
  WmsReferenceBillType: 'WmsReferenceBillType',

  PO_Status: 'PO_Status',
  PO_Type: 'PO_Type',
  CO_SodType: 'CO_SodType',
  CO_Status: 'CO_Status',
  CO_SodType: 'CO_SodType',
  IBPlan_Status: 'IBPlan_Status',
  IBPlan_Type: 'IBPlan_Type',
  ASN_Import_Type: 'ASN_Import_Type',
  Obnotice_Staus: 'Obnotice_Staus',
  Picking_Status: 'Picking_Status',
  Premier_Customer: 'Premier_Customer',
  Inventory_Location: 'Inventory_Location',
  Inventory_Control_Status: 'Inventory_Control_Status',
  Summary_Be_receipt: 'Summary_Be_receipt',
  StockCount_Status: 'StockCount_Status',
  StockCount_Result: 'StockCount_Result',
  StockCount_CountType: 'StockCount_CountType',
  StockCount_CountMethod: 'StockCount_CountMethod',
  StockCount_CountMode: 'StockCount_CountMode',
  Charge_Status: 'Charge_Status',
  Buy_Ledger_OrderType: 'Buy_Ledger_OrderType',

  Billing_Status: 'Billing_Status',
  
  Sell_Ledger_OrderType: 'Sell_Ledger_OrderType',
  Sell_Ledger_CloseType: 'Sell_Ledger_CloseType',
  
  receiptType: 'receiptType',
  billingType: 'billingType',
  Task_Status: 'Task_Status',
  Interface_Request_Type: 'Interface_Request_Type',
  Rule_Engine_Status: 'Rule_Engine_Status',
  BasicData_Status: 'BasicData_Status',
  Bin_Exception: 'Bin_Exception',
  BasicData_Status: 'BasicData_Status',
  SysConfiglist: 'SysConfiglist',
  DeliveryOrderType: 'DeliveryOrderType',
  OperationTokenType: 'OperationTokenType',
  OperationTokenStatus: 'OperationTokenStatus',
  
  BOOLE:'BOOLE',

  BillingStatus: 'Billing_Status'


}