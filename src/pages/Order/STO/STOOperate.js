import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Button, Col, Collapse, Form, Input, Row, Select, Spin } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '@/pages/Operate.less';
import AdButton from '@/components/AdButton';
import { codes, Status, CoTypeArr, SelectColumns } from "./utils";
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import DeliveryFormModal from './component/DeliveryFormModal';
import AdSelect from '@/components/AdSelect';
import SearchSelect from '@/components/SearchSelect';
import { transferLanguage } from '@/utils/utils';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import { formItemFragement, formatPrice, queryDict, allDictList } from '@/utils/common';
import { languages } from 'monaco-editor';
import AntdDatePicker from '@/components/AntdDatePicker';
import Prompt from '@/components/Prompt';
import ButtonGroup from 'antd/lib/button/button-group';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ sto, common, loading, i18n }) => ({
  sto,
  dictObject: common.dictObject,
  id: sto.id,
  loading: loading.models.sto,
  language: i18n.language
}))
@Form.create()
export default class TypeOperate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      currentId: '',
      selectedRows: [],
      visible: false,
      activeKey: ['1', '2', '3', '4'],
      showRecord: true, //init:false
      senders: [],
      disabled: true,
      beUseRule: true,
      requestTypeList: [],
      expandForm: false,
      modalVisible: false,
      checkIds: '',
      detailsId: '',
      toCountryId: [],
      fromCountryId: [],
      shipFromWmCode: [],
      shipToWmCode: [],
      billTypeId: [],
      _SelectColumns: [],
    };
  }

  className = 'wmscoOperate';


  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      showRecord: true,
    });
    if (ID) {
      this.getSelectDetails(ID);
      this.getSelectDetailsList(ID)
    } else {
      form.resetFields();
      this.setState({
        disabled: false
      })
    }
    this.changeTitle(SelectColumns, "_SelectColumns")

  }
  changeTitle = (param, params) => {
    let _columnsAllotOne = []
    _columnsAllotOne = param.map(v => {
      if (v.title) v.title = transferLanguage(v.title, this.props.language)
      if (v.value) v.value = transferLanguage(v.value, this.props.language)
      return v
    })
    this.setState({
      [params]: _columnsAllotOne
    })
  }
  // 获取详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'sto/wmscoDetails',
      payload: { id: ID },
      callback: data => {
        this.setState({
          senders: [{ id: data.senderId }],
          beUseRule: data.beUseRule,
          toCountryId: [{ id: data.toCountryId, name: data.toCountryName }],
          fromCountryId: [{ id: data.fromCountryId, name: data.fromCountryName }],
          shipToWmCode: [{ code: data.shipToWmCode, name: data.shipToWmName, countryId: data.toCountryId }],
          shipFromWmCode: [{ code: data.shipFromWmCode, name: data.shipFromWmName, countryId: data.fromCountryId }],
          billTypeId: [{ id: data.billTypeId, name: data.billTypeName }],
        });
      },
    });
  };

  // 获取明细列表：
  getSelectDetailsList = ID => {
    this.props.dispatch({
      type: 'sto/fetchWmsCoDetailsList',
      payload: { coId: ID },
      callback: data => {
        this.setState({
          senders: [{ id: data.senderId }],
          beUseRule: data.beUseRule,
        });
      },
    });
  };


  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  // 保存方法
  operatePaneButton = e => {
    e.stopPropagation();
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { soreleasedate, toCountryName, ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        const { billTypeId, toCountryId, fromCountryId, shipToWmCode, shipFromWmCode } = this.state
        // value.toCountryId = toCountryName.length>0?toCountryName[0].countryId:'';
        if (toCountryName && shipToWmCode.length > 0) {
          value.toCountryId = shipToWmCode[0].countryId
        }
        if (shipFromWmCode && shipFromWmCode.length > 0) {
          value.fromCountryId = shipFromWmCode[0].countryId
          value.shipFromWmCode = shipFromWmCode[0].code;
        }
        if (billTypeId && billTypeId.length > 0) {
          value.billTypeId = billTypeId[0].id
        }
        value.shipToWmCode = shipToWmCode[0]?.code;


        value.soreleasedate = soreleasedate ? moment(soreleasedate).format(dateFormat) : ''
        console.log('toCountryName===', value, shipFromWmCode)
        if (params.id) {
          value.id = params.id;
          dispatch({
            type: 'sto/wmscoOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('sto/wmscoList', {});
              this.dispatchFun('sto/wmscoDetails', { id: params.id });
            },
          });
        } else {
          dispatch({
            type: 'sto/wmscoOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              // this.setState({ showRecord: true });
              this.setState({ currentId: res })
              dispatch({
                type: 'sto/wmscoDetails',
                payload: { id: res },
                callback: data => {
                  this.setState(preState => ({
                    disabled: !preState.disabled,
                  }));
                  // 新增变编辑页面：
                  dispatch({
                    type: 'common/setTabsName',
                    payload: {
                      id: res,
                      name: data.businessTypeCode,
                      isReplaceTab: true,
                    },
                    callback: result => {
                      if (result) {
                        router.push(`/order/sto/editSto/${res}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('sto/interfaceTypeList', {});
            },
          });
        }
      }
    });
  };

  // dispatch 方法
  dispatchFun(type, params) {
    const { dispatch } = this.props;
    dispatch({
      type: type,
      payload: params,
    });
  }

  // 明细查看详情
  showDetail = () => {
    this.setState({ visible: true });
  };

  // 明细关闭详情
  infoHandleCancel = () => {
    this.setState({ visible: false, visiblePay: false });
  };

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

  onRef = ref => {
    this.child = ref;
  };

  getValue = (values, type) => {
    console.log('values, type', values, type)
    const { form: { setFieldsValue } } = this.props
    this.setState({
      [type]: values,
    });
    if (type == "shipFromWmCode") {
      setFieldsValue({
        fromCountryName: values[0]?.countryName
      })
    }
    if (type == "shipToWmCode") {
      setFieldsValue({
        toCountryName: values[0]?.countryName
      })
    }
  };
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  modalEmpty = () => {
    const { currentId } = this.state
    this.setState({ modalVisible: false })
    this.getSelectDetails(currentId);
    this.getSelectDetailsList(currentId)
  }
  cancel = () => {
    this.setState({ modalVisible: false })
  }
  modalShow = (record) => {
    // this.props.dispatch({
    //   type: 'sto/fetchDeliveryDetails',
    //   payload: { id :record.id },
    //   callback: data=>{
    this.setState({ modalVisible: true, detailsId: record.id })
    //   }
    // });
  }
  addDetail = () => {
    const { currentId } = this.state
    if (currentId) {
      this.setState({ modalVisible: true, detailsId: '' })
    } else {
      Prompt({ content: transferLanguage('PoDetailList.prompt.saveBaseInfo', this.props.language), type: 'warn' })
    }

  }
  cancelDetail = () => {
    const { checkIds, currentId } = this.state
    const { dispatch } = this.props
    // dispatch({
    //   type: 'sto/cancelDetail',
    //   payload: { ids: checkIds },
    //   callback: data => {
    //     this.getSelectDetailsList(currentId)
    //   }
    // })
  }
  render() {
    const {
      selectedRowKeys,
      selectedRows,
      visible,
      previewImage,
      fileList,
      papersDetails,
      cars,
      showRecord,
      senders,
      disabled,
      expandForm,
      modalVisible,
      checkIds,
      detailsId,
      toCountryId,
      fromCountryId,
      shipFromWmCode,
      shipToWmCode,
      billTypeId,
      _SelectColumns,
    } = this.state;
    const {
      sto: { wmscoDetails, coDetailsList, eventReceiverList },
      form,
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      showType,
      loading,
      language,

    } = this.props;

    const currentId = params.id;
    const selectList = coDetailsList[currentId]
    let selectDetails = wmscoDetails[currentId];
    const checkDisabled = selectDetails ? true : false;
    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.code : transferLanguage('STODetailList.field.addSTOInfo', language)}</span>
        {disabled ? (
          <AdButton
            type="primary"
            code={codes.detailEdit}
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text={transferLanguage('CargoOwnerDetail.button.edit', language)}
          />
        ) : (
            <Button.Group>
              <Button type="primary" onClick={e => this.operatePaneButton(e)}>
                {transferLanguage('CargoOwnerDetail.button.save', language)}
              </Button>
              {currentId && (
                <AdButton
                  onClick={() => {
                    this.setState(preState => ({
                      disabled: !preState.disabled,
                    }));
                  }}
                  text={transferLanguage('CargoOwnerDetail.button.cancel', language)}
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
    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };

    // 详情字段
    const CODetailsColumns = [
      {
        title: '#',
        dataIndex: 'index',
        render: (text, record, index) => (<span>{index + 1}</span>),
        width: 50
      },
      {
        title: transferLanguage('STODetailList.field.PRID', language),
        dataIndex: 'soDetailNo',
        render: (text, record) => (
          <AdButton 
          text={text}
          code={codes.detailEdit}
          mode='a'  
          onClick={() => this.modalShow(record)} />
        ),
      },
      {
        // title: '状态',
        title: transferLanguage('CoDetailList.field.status', language),
        dataIndex: 'status',
        render: text => <span title={text}>{text}</span>,
      },
      {
        // title: '料号',
        title: transferLanguage('CoDetailList.field.partNo', language),
        dataIndex: 'shipPartNo',
        render: text => <span title={text}>{text}</span>,
      },
      {
        // title:'料号描述'
        title: transferLanguage('CoDetailList.field.partDesc', language),
        dataIndex: 'shipPartDesc',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        // title: 'pcs数',
        title: transferLanguage('CoDetailList.field.pieceQty', language),
        dataIndex: 'pieceQty',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        // title: '毛重',
        title: transferLanguage('partData.field.grossWeight', language),
        dataIndex: 'totalGrossWeight',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        // title: '净重',
        title: transferLanguage('partData.field.netWeight', language),
        dataIndex: 'totalNetWeight',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        // title: '体积',
        title: transferLanguage('partData.field.volume', language),
        dataIndex: 'totalVolume',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        // title: '备注',
        title: transferLanguage('CoDetailList.field.remarks', language),
        dataIndex: 'remarks',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('CoDetailList.field.updateBy', language),
        dataIndex: 'updateBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('CoDetailList.field.updateTime', language),
        dataIndex: 'updateTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
    ]


    const deliveryParams = {
      visible: modalVisible,
      detailId: currentId,
      detailsId: this.state.detailsId,
      modalEmpty: this.modalEmpty,
      cancel: this.cancel,
    };

    const tableButtonsParams = {
      show: true,
      rightButtons: (
        <Button type={currentId ? "primary" : ""}
          disabled={disabled}
          onClick={() => this.addDetail()}
        >
          {transferLanguage('CoDetailList.field.addDetail', language)}
        </Button>
      ),

      selectedRows: selectedRows,
    };

    return (
      <div className={styles.CollapseUpdate}>
        <PageHeaderWrapper title={genExtraBasicInfo()}>
          <Collapse
            activeKey={this.state.activeKey}
            onChange={key => this.callback(key)}
            bordered={false}
          >
            <Panel header={transferLanguage('Common.field.baseInfo', language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('STOList.field.STO', language)}>
                        {getFieldDecorator('coNo', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.coNo : '',
                        })(<Input placeholder="" disabled={true} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.status', language)}>
                        {getFieldDecorator('status', {
                          initialValue: selectDetails ? selectDetails.status : '',
                        })(<Input disabled={true} />)}
                      </Form.Item>
                    </Col>

                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <AntdFormItem label={transferLanguage('ASN.field.shipFromWmCode', language)} code="shipFromWmCode"
                        initialValue={selectDetails ? selectDetails.shipFromWmCode : ''}
                        rules={[{ required: true, message: '请输入' }]}
                        {...commonParams}
                      >
                        <SearchSelect
                          disabled={disabled}
                          dataUrl={'/wms-warehouse/selectWmsWarehouseList'}
                          selectedData={shipFromWmCode} // 选中值
                          showValue="name"
                          searchName="name"
                          multiple={false}
                          columns={_SelectColumns}
                          onChange={values => this.getValue(values, 'shipFromWmCode')}
                          id="shipFromWmCode"
                          allowClear={true}
                          scrollX={200}
                        />
                      </AntdFormItem>
                    </Col>

                    <Col {..._col}>
                      <AntdFormItem label={transferLanguage('CoList.field.fromCountry', language)} code="fromCountryName"
                        rules={[{ required: true, message: '请输入' }]}
                        initialValue={selectDetails ? selectDetails.fromCountryName : ''}
                        {...commonParams}
                      >
                        <Input disabled={true} />
                      </AntdFormItem>
                    </Col>
                  </Row>
                  <Row gutter={_gutter} >
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoList.field.shipTo', language)}>
                        {getFieldDecorator('shipToWmCode', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.shipToWmCode : '',
                        })(
                          <SearchSelect
                            disabled={disabled}
                            dataUrl={'/wms-warehouse/selectWmsWarehouseList'}
                            selectedData={shipToWmCode} // 选中值
                            showValue="name"
                            searchName="name"
                            multiple={false}
                            columns={_SelectColumns}
                            onChange={values => this.getValue(values, 'shipToWmCode')}
                            id="shipToWmCode"
                            allowClear={true}
                            scrollX={200}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoList.field.toCountry', language)}>
                        {getFieldDecorator('toCountryName', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.toCountryName : '',
                        })(<Input disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.type', language)}>
                        {getFieldDecorator('billTypeId', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.billTypeId : '',
                        })(
                          <SearchSelect
                            disabled={disabled}
                            dataUrl={'/mds-bill-type/selectMdsBillTypeList'}
                            selectedData={billTypeId} // 选中值
                            showValue="name"
                            searchName="name"
                            multiple={false}
                            columns={_SelectColumns}
                            onChange={values => this.getValue(values, 'billTypeId')}
                            id="type"
                            allowClear={true}
                            scrollX={200}
                            payload={{ businessType: ['STO'] }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.pieceQty', language)}>
                        {getFieldDecorator('pieceQty', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.pieceQty : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                  <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.orderDate', language)}>
                        {getFieldDecorator('bizDate', {
                          rules: [{ required: true }],
                          initialValue: selectDetails && selectDetails.bizDate ? moment(selectDetails.bizDate) : '',
                        })(
                          <AntdDatePicker showTime disabled={disabled} placeholder={transferLanguage('Common.field.selectDate', language)} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoDetailList.field.openQty', language)}>
                        {getFieldDecorator('openQty', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.openQty : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.grossWeight', language)}>
                        {getFieldDecorator('totalGrossWeight', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.totalGrossWeight : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.netWeight', language)}>
                        {getFieldDecorator('totalNetWeight', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.totalNetWeight : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter} >
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.volume', language)}>
                        {getFieldDecorator('totalVolume', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.totalVolume : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Panel>
            {currentId&&<Panel header={transferLanguage('STODetailList.field.stoDetail', language)} key="4" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                {/*<SelectForm {...selectFormParams} />*/}
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={selectList}
                  columns={CODetailsColumns}
                  onSelectRow={this.handleSelectRows}
                  hideDefaultSelections={true}
                  // onPaginationChange={this.handleStandardTableChange}
                  // expandForm={expandForm}
                  className={this.chassName}
                  code={codes.page}
                // hideCheckAll={true}
                />
              </div>
            </Panel>}

          </Collapse>
        </PageHeaderWrapper>
        {modalVisible && <DeliveryFormModal {...deliveryParams} />}
      </div>
    );
  }
}
