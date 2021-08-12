import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Collapse,
  DatePicker,
  PageHeader,
  Radio,

} from 'antd';
import prompt from '@/components/Prompt';
import moment from 'moment'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import TableButtons from '@/components/TableButtons';
import styles from '@/pages/Operate.less';
import AdButton from '@/components/AdButton';
import AdModal from '@/components/AdModal';
import AntdInput from '@/components/AntdInput'
import AdSelect from '@/components/AdSelect'
import AntdDatePicker from '@/components/AntdDatePicker'
import SearchSelect from '@/components/SearchSelect'
import { dispatchFun } from '@/utils/utils';
import { transferLanguage, columnConfiguration } from '@/utils/utils';
import { languages } from 'monaco-editor';
import FileReader from '@/components/FileReader';
import { formatMessage, } from 'umi-plugin-react/locale';
import AntdFormItem from '@/components/AntdFormItem';
import AntdForm from '@/components/AntdForm';
import { formItemFragement } from '@/utils/common';
import SelectForm from '@/components/SelectForm';
import Forms from './Forms'
import { queryFileList, filterAddFile, filterDeteteFile } from '@/utils/common';
import FileImport from '@/components/FileImport'

import {
  codes,
  allDispatchType,
  SelectColumns,
  selectDetailList,
  selectList,
  columns,
  SelectType,
  SelectOrderType,
  statusColumns,
} from './utils';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
const formatDate = 'YYYY-MM-DD'
@connect(({ BuyLedger, common, loading, i18n }) => ({

  chargeDetailDetail: BuyLedger.chargeDetailDetail,
  buyLedgerDetailList: BuyLedger.buyLedgerDetailList,
  statusList:BuyLedger.statusList,
  chargeDetailList: BuyLedger.chargeDetailList,
  dictObject: common.dictObject,
  loading: loading.effects[allDispatchType.list],
  loadingTable: loading.effects[allDispatchType.detailList],
  language: i18n.language,

}))
@Form.create()
export default class CreateBilling extends Component {
  className = 'CreateBilling'
  constructor(props) {
    super(props);
    this.state = {
      checkIds: [],
      selectedRows: [],
      handleSelectRows: [],
      selectedRowsMod: [],
      checkIdsMod: [],
      currentId: '',
      visible: false,
      activeKey: ['1', '2'],
      disabled: true,
      name: [],
      partId: [],
      qty: 0,
      _columns: [],
      formValues: {},
      formValuesDetail: {},
      isSelectAll: false,
      expandForm: false,
      visibleImport: false,
      btnType: 0,
      statusNum: {
        Checked: 0,
        Mismatch: 0,
        Open: 0
      },

    };
    this.fileList = [];
  }
  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    const EDIT = window.location.href.split('?')[1]

    this.setState({
      currentId: ID,
      _columns: columnConfiguration(columns, this.props.language)
    }, () => {
      if (ID) {
        this.getSelectDetails();
        this.queryFileList();
        selectDetailList({ props: this.props, payload: { billingId: ID } })
        this.getStatusNum()
        if (EDIT == 'EDIT') {
          this.setState({
            disabled: false
          })
        }
      } else {
        form.resetFields();
        this.setState({
          disabled: false
        })
      }
    });


  }

  //详情信息：
  getSelectDetails = () => {
    const { currentId } = this.state
    this.props.dispatch({
      type: allDispatchType.detail,
      payload: { id: currentId },
      callback: data => {
      },
    });
  };
  // 获取详情列表 中 状态的数字 
  getStatusNum = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'BuyLedger/abledStatus',
      payload: { type: 'statusNum' ,billingId:this.state.currentId},
      callback: (res) => {
        this.setState({statusNum:res.data.list[0]||{}})
        // const _newArr = res.data.list.map(v => ({ status: v.status, count: v.count, }))
        // console.log('进入这里')
        // this.setState({
        //   statusNum: {
        //     [_newArr[0].status]: _newArr[0].count,
        //     [_newArr[1].status]: _newArr[1].count,
        //     [_newArr[2].status]: _newArr[2].count,
        //   }
        // },()=>console.log('daozhel--statusNum',this.state.statusNum))
      }
    })

  }
  queryFileList = () => {
    const { currentId } = this.state
    queryFileList({
      props: this.props,
      params: { bizId: currentId, fileBizType: 'billing' },
      callback: data => {
        if (!data) return;
        this.fileList = data;
        this.props.form.setFieldsValue({ fileToken: data });
      },
    });
  };
  callback = key => {
    this.setState({
      activeKey: key,
    });
  };
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  handleStandardTableChange = (params,btnType) => {
    const { currentId } = this.state
    const type=['','Checked','Mismatch','Open']
    selectDetailList({ payload: { billingId: currentId,status:type[btnType], ...params }, props: this.props });
    
  };
  handleStandardTableChangeMod = param => {
    const { formValues } = this.state;
    selectList({ payload: { ...formValues, ...param }, props: this.props });
  }
  handleSelectRows = rows => {
    let ids = [];
    if (Array.isArray(rows) && rows.length > 0) {
      rows.map((item, i) => {
        ids.push(item.id);
      });
    }
    this.setState({
      selectedRows: rows,
      checkIds: ids,
    });

  };
  handleSelectRowsMod = rows => {
    const { isSelectAll, } = this.state
    const { chargeDetailList } = this.props
    let ids = [];
    if (Array.isArray(rows) && rows.length > 0) {
      rows.map((item, i) => {
        ids.push(item.id);
      });
    }
    this.setState({
      selectedRowsMod: rows,
      checkIdsMod: ids,
    });
    if (isSelectAll) {
      rows.length < chargeDetailList.list.length &&
        this.setState({
          isSelectAll: false,
          selectedRowsMod: rows,
        })
    }
  };
  /**
     * form 查找条件 重置
     */
  handleFormResetFirst = () => {
    const { form, } = this.props
    const props = { props: this.props };
    this.setState({
      formValues: {},
      warehouseId: [],
      shipFromWmCode: []
    });
    form.resetFields();
    // saveAllValues({ payload: { formValues: {} }, ...props });
    selectList({ ...props });
  };
  handleDetailFormResetFirst = () => {
    const { form, } = this.props
    const props = { props: this.props };
    this.setState({
      formValuesDetail: {},
    });
    form.resetFields();
    // saveAllValues({ payload: { formValues: {} }, ...props });
    selectList({ ...props });
  }

  /**
   * form 查找条件 查询
   */
  handleSearchFirst = formValues => {
    // if (!formValues) return;
    const { billDate, warehouseCode, fromCode, ...value } = formValues
    if (billDate && billDate.length > 0) {
      value.startBillDate = moment(billDate[0]).format(formatDate)
      value.startBillDate += ' 00:00:00'
      value.endBillDate = moment(billDate[1]).format(formatDate)
      value.endBillDate += ' 23:59:59'

    } else {
      value.startBillDate = ""
      value.endBillDate = ""
    }
    if (warehouseCode && warehouseCode.length > 0) value.warehouseCode = warehouseCode[0].id
    if (fromCode && fromCode.length > 0) value.fromCode = fromCode[0].code
    // if (poBusinessModel && poBusinessModel.length > 0) value.poBusinessModel = poBusinessModel[0].name
    const params = { props: this.props, payload: value };
    selectList(params);
    this.setState({ formValues })
  };

  handleDetailSearchFirst = formValues => {

    const value = {
      ledgerNo: formValues.ledgerNoDetail,
      poNo: formValues.poNoDetail,
      prId: formValues.prIdDetail,
      soNo: formValues.soNoDetail,
      keyWord: formValues.keyWord
    }
    // if (!formValues) return;
    const { billDate, warehouseCode, fromCode, poBusinessModel } = formValues
    if (billDate && billDate.length > 0) {
      value.startBillDate = moment(billDate[0]).format(dateFormat)
      value.endBillDate = moment(billDate[1]).format(dateFormat)
    } else {
      value.startBillDate = ""
      value.endBillDate = ""
    }
    if (warehouseCode && warehouseCode.length > 0) value.warehouseCode = warehouseCode[0].id
    if (fromCode && fromCode.length > 0) value.fromCode = fromCode[0].code
    if (poBusinessModel && poBusinessModel.length > 0) value.poBusinessModel = poBusinessModel[0].name
    const params = { props: this.props, payload: value };
    const { currentId } = this.state
    selectDetailList({ payload: { billingId: currentId, ...value }, props: this.props });

    this.setState({ formValuesDetail: value })
  };

  // 获取子组件
  onRef(name, ref, values) {
    switch (name) {
      // 获取子组件类型调用相应的方法
      case 'Forms':
        this.Forms = ref
        break
      case 'save':
        this.saveInfos(ref)
        break
      default:
        break
    }
  };
  // 保存数据
  saveInfos(values) {
    const { billingDate, payee, payer, ...value } = values;
    const {
      match: { params },
      dispatch,
    } = this.props;
    const fileToken = values.fileToken ? values.fileToken : []
    //附件
    value.fileTokens = filterAddFile(fileToken);
    value.deleteFileIds = filterDeteteFile(fileToken, this.fileList);
    if (billingDate && billingDate.length > 0) {
      value.billingStartDate = moment(billingDate[0]).format(formatDate)
      value.billingEndDate = moment(billingDate[1]).format(formatDate)
    }
    value.id = params.id;
    value.payeeId = payee[0].id;
    value.payerId = payer[0].id;
    value.type = 'updateBilling'
    dispatch({
      type: allDispatchType.abled,
      payload: value,
      callback: (res) => {
        if (!res) return;
        this.setState(preState => ({
          disabled: !preState.disabled,
        }));
        if (params.id) {
          dispatchFun(allDispatchType.list, {}, this.props)
          dispatchFun(allDispatchType.detail, { id: params.id }, this.props)
          this.queryFileList(params.id);
        }
      }
    })
  };
  //保存、编辑
  saveInfo = e => {
    // 调用子组件方法
    this.Forms.setFriends(e)

  };

  getValue = (values, type) => {
    const { form: { setFieldsValue, getFieldValue } } = this.props
    this.setState({
      [type]: values,
    });
    /*
      tax=taxAmount/totalAmount*100
      actualAmount=totalAmount+taxAmount-adjustAmount
      taxAmount=totalAmount*tax/100
      adjustPer=adjustAmount/totalAmount*100
      adjustAmount=totalAmount*adjustPer/100
    */
    if (type == 'taxAmount') {
      let _value = +values + (+getFieldValue('totalAmount')) - getFieldValue('adjustAmount')
      setFieldsValue({
        tax: parseFloat(values * 100 / getFieldValue('totalAmount')).toFixed(2),
        actualAmount: parseFloat(_value).toFixed(2)
      })
    }
    if (type == 'tax') {
      let _value = +getFieldValue('totalAmount') * values / 100
      setFieldsValue({
        taxAmount: parseFloat(_value).toFixed(2),
        actualAmount: +parseFloat(_value).toFixed(2) + (+getFieldValue('totalAmount')) - getFieldValue('adjustAmount')
      })
    }
    if (type == 'adjustPer') {
      let _value = +getFieldValue('totalAmount') * values / 100
      setFieldsValue({
        adjustAmount: parseFloat(_value).toFixed(2)
      })
    }
    if (type == 'adjustAmount') {
      let _value = +getFieldValue('taxAmount') + (+getFieldValue('totalAmount')) - values
      setFieldsValue({
        adjustPer: parseFloat(values * 100 / getFieldValue('totalAmount')).toFixed(2),
        actualAmount: parseFloat(_value).toFixed(2)
      })
    }
  };
  abledStatus = (type) => {
    const { dispatch } = this.props;
    const { checkIds, currentId } = this.state;
    let params = {
      type,
      ids: checkIds,
      billingId: currentId
    };
    const param = { props: this.props, payload: { billingId: currentId } };
    dispatch({
      type: allDispatchType.abled,
      payload: params,
      callback: res => {
        selectDetailList({ ...param });
        this.getSelectDetails()
      },
    });
  };
  addLedger = () => {
    const { checkIds, } = this.state
    const { dispatch } = this.props
    selectList({ props: this.props, payload: { ids: checkIds, status: 'OPEN' } })
    this.setState({ visible: true })
    
  }
  operatorButtons = (colStyle) => {
    const { code } = this.props;
    const { listCol } = this.state
    const marginLeft = { marginLeft: 8 };
    return (
      <Col {...listCol} style={colStyle}>
        <span className={styles.submitButtons}>
          <Button.Group>
            <AdButton type="primary" onClick={this.handleSearch} text={transferLanguage('base.prompt.search', this.props.language)} code={code} />
            <AdButton onClick={this.handleFormResetMod} text={transferLanguage('base.prompt.reset', this.props.language)} code={code} />
          </Button.Group>
        </span>
      </Col>
    );
  };


  selectAllBtn = () => {
    const { selectedRowsMod } = this.state
    const { chargeDetailList } = this.props
    this.setState({
      selectedRowsOld: selectedRowsMod,
      selectedRowsMod: chargeDetailList.list,
      isSelectAll: true
    })
  };
  cancelAll = () => {
    const { selectedRowsOld } = this.state
    this.setState({
      isSelectAll: false,
      selectedRowsMod: selectedRowsOld
    })
  };

  handleOk = () => {
    const { isSelectAll, checkIdsMod, formValues, currentId } = this.state
    const { dispatch } = this.props
    const params = {
      type: 'addLedger',
      billingId: currentId,
    }
    !isSelectAll ?
      params.ids = checkIdsMod
      :
      params.payload = { isSelectAll: true, ...formValues }
    dispatch({
      type: 'BuyLedger/abledStatus',
      payload: params,
      callback: () => {
        this.setState({ visible: false })
        this.getSelectDetails()
        selectDetailList({ props: this.props, payload: { billingId: currentId } })
      }
    })
  }
  refreshList =(index, type) => {
    selectDetailList({ props: this.props, payload: { billingId:this.state.currentId, status: type } })
    this.setState({ btnType: index })
  }
  headerExtra = () => {
    const { btnType, statusNum } = this.state
    return <div onClick={(event) => event.stopPropagation()}>
      <span style={{ marginRight: '8px' }}>{transferLanguage('BuyLedger.field.billingDetail', this.props.language)}</span>
      <Button.Group>
        <AdButton type={btnType === 0 ? 'primary' : ''} text='All Ledger' onClick={() => this.refreshList(0)} />
        <AdButton type={btnType === 1 ? 'primary' : ''} text={`Checked(${statusNum?.Checked||0})`} onClick={() => this.refreshList(1, 'Checked')} />
        <AdButton type={btnType === 2 ? 'primary' : ''} text={`Checked Fail(${statusNum?.Mismatch||0})`} onClick={() => this.refreshList(2, 'Mismatch')} />
        <AdButton type={btnType === 3 ? 'primary' : ''} text={`New(${statusNum?.Open||0})`} onClick={() => this.refreshList(3, 'Open')} />
      </Button.Group>
      <AdButton style={{ marginLeft: '8px' }} text={transferLanguage('Common.field.import', this.props.language)}
        type="primary" onClick={() => this.setState({ visibleImport: true })}
      />
      <AdButton  text={transferLanguage('Common.field.export', this.props.language)}
        disabled={this.state.selectedRows.length > 0 ? false : true}
        onClick={()=>this.print('STATEMENT') }
      />
    </div>
  }
  //打印
  print = (type) => {
    const { checkIds, selectedRows,btnType } = this.state
    const { dispatch ,} = this.props
    let id = selectedRows[0]?.id
    const _type=['','Checked','Mismatch','Open']
    dispatch({
        type: 'common/setPrint',
        payload: { ids: checkIds },
        callback: data => {
            router.push(`/print/${id}/${type}?status=${_type[btnType]}`);
        }
    })
  }
  
  render() {
    const {
      visible,
      disabled,
      _columnsDetail,
      _columns,
      selectedRows,
      selectedRowsMod,
      formValuesMod,
      isSelectAll,
      expandForm,
      btnType,
    } = this.state;
    const {
      chargeDetailDetail,
      chargeDetailList,
      buyLedgerDetailList,
      statusList,
      form: { getFieldDecorator },
      form,
      match: { params },
      loading,
      loadingTable,
      language,

    } = this.props;

    const currentId = params.id;
    let selectDetails = chargeDetailDetail[currentId];
    const commonParams = { getFieldDecorator }
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.businessTypeCode : transferLanguage('BuyLedger.button.createBilling', language)}</span>
        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text={transferLanguage('Common.field.edit', language)}
          />
        ) : (
            <Button.Group>
              <Button type="primary" onClick={e => this.saveInfo(e)}>
                {transferLanguage('Common.field.save', language)}
              </Button>
              {currentId && (
                <AdButton
                  onClick={() => {
                    this.setState(preState => ({
                      disabled: !preState.disabled,
                    }));
                  }}
                  text={transferLanguage('Common.field.cancel', language)}
                />
              )}
            </Button.Group>
          )}
      </div>
    );
    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };

    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };
    const tableButtonsParams = {
      buttons: (
        <Button.Group>
          <AdButton
            onClick={() => this.abledStatus('remove')}
            disabled={selectedRows.length > 0 ? false : true}
            text={transferLanguage('BuyLedger.button.remove', this.props.language)} />
          <AdButton
            onClick={() => this.addLedger()}
            // disabled={selectedRows.length > 0 ? false : true}
            text={transferLanguage('BuyLedger.button.addLedger', this.props.language)} />
        </Button.Group>

      ),
      selectedRows: selectedRows,
    }
    const tableButtonsParamsMod = {
      handleAdd: this.handleAdd,
      selectedLength: selectedRowsMod.length,
      pagination: chargeDetailList.pagination,
      selectAll: () => this.selectAllBtn(),
      cancelAll: () => this.cancelAll(),
      isSelectAll,
      selectedRows: selectedRowsMod,
    };
    const formSearch = [
      [
        <AntdFormItem label={transferLanguage('ChargeDetail.field.billingNo', language)} code="billingNo" {...commonParams}>
          <Input />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('Common.field.status', language)} code="_status" {...commonParams}>
          <AdSelect data={SelectType} isExist />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('BuyLedger.field.billingCycle', language)} code="_billingCycle" {...commonParams}>
          <Input />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage('BuyLedger.field.payer', language)} code="_payer" {...commonParams}>
          <Input />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('BuyLedger.field.payee', language)} code="_payee" {...commonParams}>
          <Input />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('Common.field.createDate', language)} code="_createDate" {...commonParams}>
          <AntdDatePicker mode='range' />
        </AntdFormItem>,
      ],
      [
        <></>,
        <></>,
        this.operatorButtons({ textAlign: 'center', marginLeft: '100px' })
      ],

    ];
    const firstFormItem = (
      <AntdFormItem label={transferLanguage('ChargeDetail.field.ledgerNo', language)} code="ledgerNo" {...commonParams}>
        <TextArea rows={1} />
      </AntdFormItem>
    );
    const secondFormItem = (
      <AntdFormItem label={transferLanguage('ASN.field.orderType', language)} code="orderType" {...commonParams}>
        <AdSelect data={SelectOrderType} isExist />

      </AntdFormItem>
    );
    const otherFormItem = [
      [
        <AntdFormItem label={transferLanguage('BuyLedger.field.billDate', language)} code="billDate" {...commonParams}>
          <AntdDatePicker mode="range" />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage('ASNDetail.field.poNo', language)} code="poNo" {...commonParams}>
          {/* <AdSelect data={SelectType} isExist /> */}
          <TextArea rows={1} />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('RMO.field.partNo', language)} code="partNo" {...commonParams}>
          <Input />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('ASNDetail.field.prNo', language)} code="prId" {...commonParams}>
          <TextArea rows={1} />
        </AntdFormItem>,
      ],
      [

        <AntdFormItem label={transferLanguage('ASNDetail.field.soNo', language)} code="soNo" {...commonParams}>
          <TextArea rows={1} />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('PoReport.field.businessModel', language)} code="poBusinessModel" {...commonParams}>
          <Input />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('PoList.field.consigner', language)} code="consigner" {...commonParams}>
          <Input />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage('CoList.field.shipFrom', language)} code="fromCode" {...commonParams}>
          <SearchSelect
            dataUrl={'/wms-warehouse/selectWmsWarehouseList'}
            selectedData={this.state.shipFromWmCode} // 选中值
            multiple={false}
            showValue="name"
            searchName="name"
            columns={SelectColumns}
            onChange={values => this.getValue(values, 'shipFromWmCode')}
            id="shipFromWmCode"
            allowClear={true}
            scrollX={200}
          />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('Area.field.warehouse', language)} code="warehouseCode" {...commonParams}>
          <SearchSelect
            dataUrl={'wms-warehouse/selectWmsWarehouseList'}
            selectedData={this.state.warehouseId} // 选中值
            showValue="code"
            searchName="keyWord"
            multiple={false}
            columns={SelectColumns}
            onChange={values => this.getValue(values, 'warehouseId')}
            id="warehouseId"
            allowClear={true}
            scrollX={200}
          />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('BuyLedger.field.lotInvoiceNo', language)} code="invoiceNo" {...commonParams}>
          <Input />
        </AntdFormItem>,
      ],
      ['operatorButtons'],
    ];
    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      otherFormItem,
      form,
      className: this.className,
      handleFormReset: this.handleFormResetFirst,
      handleSearch: this.handleSearchFirst,
      toggleForm: this.toggleForm,
      quickQuery: false,
      width: 185,
      // code: codes.select,
    };

    const firstDetailFormItem = (
      <AntdFormItem label={transferLanguage('ChargeDetail.field.ledgerNo', language)} code="ledgerNoDetail" {...commonParams}>
        <TextArea rows={1} />
      </AntdFormItem>


    );
    const secondDetailFormItem = (
      <AntdFormItem label={transferLanguage('ChargeDetail.field.poNo', language)} code="poNoDetail" {...commonParams}>
        <TextArea rows={1} />
      </AntdFormItem>

    );
    const otherDetailFormItem = [
      [
        <AntdFormItem label={transferLanguage('ChargeDetail.field.prId', language)} code="prIdDetail" {...commonParams}>
          <TextArea rows={1} />
        </AntdFormItem>

      ],
      [
        <AntdFormItem label={transferLanguage('ChargeDetail.field.soNo', language)} code="soNoDetail" {...commonParams}>
          <TextArea rows={1} />
        </AntdFormItem>
      ],
      ['operatorButtons'],
    ];
    const selectDetailFormParams = {
      firstFormItem: firstDetailFormItem,
      secondFormItem: secondDetailFormItem,
      otherFormItem: otherDetailFormItem,
      form,
      className: this.className,
      handleFormReset: this.handleDetailFormResetFirst,
      handleSearch: this.handleDetailSearchFirst,
      toggleForm: this.toggleForm,
      quickQuery: false,
    };
   
    return (
      <div className={styles.CollapseUpdate}>
        <PageHeaderWrapper title={genExtraBasicInfo()}>
          <Collapse
            activeKey={this.state.activeKey}
            onChange={key => this.callback(key)}
            bordered={false}
          >
            <Panel header={transferLanguage('Common.field.baseInfo', this.props.language)} key="1" style={customPanelStyle}
            >
              <div className={styles.tableListForm}>
                <Forms selectDetails={selectDetails} disabled={disabled} onRef={this.onRef.bind(this)} />

              </div>
            </Panel>
            <Panel header={this.headerExtra()} key="2" style={customPanelStyle}
            // extra={billExtra}
            >
              {btnType === 0 ?
                <div className={styles.tableListForm}>
                  {/* <SelectForm {...selectDetailFormParams} /> */}
                  <TableButtons {...tableButtonsParams} />
                  <StandardTable
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    // disabledRowSelected={true}
                    loading={loadingTable}
                    data={buyLedgerDetailList}
                    columns={_columns}
                    onPaginationChange={(params)=>this.handleStandardTableChange(params,btnType)}
                    expandForm={false}
                    className={this.chassName}
                    code={codes.page}
                  />
                </div> :
                <div className={styles.tableListForm}>
                  <StandardTable
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    // disabledRowSelected={true}
                    // loading={loadingTable}
                    data={statusList}
                    columns={statusColumns}
                    onPaginationChange={(params)=>this.handleStandardTableChange(params,btnType)}
                    expandForm={false}
                    className={this.chassName}
                    code={codes.page}
                  />
                </div>

              }
            </Panel>
          </Collapse>
          {visible && <AdModal
            visible={visible}
            title={transferLanguage('BuyLedger.button.addLedger', language)}
            onOk={this.handleOk}
            onCancel={() => this.setState({ visible: false })}
            width="1000px"
          >
            <Fragment>
              {/* <AntdForm>{formItemFragement(formSearch)}</AntdForm> */}
              <SelectForm {...selectFormParams} />
              <TableButtons {...tableButtonsParamsMod} />
              <StandardTable
                selectedRows={selectedRowsMod}
                onSelectRow={this.handleSelectRowsMod}
                loading={loading}
                data={chargeDetailList}
                columns={_columns}
                onPaginationChange={this.handleStandardTableChangeMod}
                expandForm={this.state.expandForm}
                // hideDefaultSelections={true}
                // hideCheckAll={true}
                className={this.className}
                code={codes.page}
              />
            </Fragment>
          </AdModal>}
          <FileImport
            visibleFile={this.state.visibleImport}
            handleCancel={() => this.setState({ visibleImport: false })}
            urlImport={`bms-part-buy/importPartBuyChargeReconciliation`}
            urlCase={`template/download?fileName=part_buy_charge_template.xlsx`}
            queryData={[selectDetailList.bind(null, { props: this.props, payload: { billingId: currentId } })]}
            importPayload={{ billingId: currentId }}
            accept=".xls,.xlsx"
          />
        </PageHeaderWrapper>
      </div>
    );
  }
}
