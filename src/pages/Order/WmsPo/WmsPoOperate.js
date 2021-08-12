import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Col, Collapse, Form, Input, Row, Select, } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '@/pages/Operate.less';
import AdButton from '@/components/AdButton';
import { codes, Status, PoTypeArr, SelectColumns } from "./utils";
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import DeliveryFormModal from './component/DeliveryFormModal';
import AdSelect from '@/components/AdSelect';
import SearchSelect from '@/components/SearchSelect';
import { transferLanguage } from '@/utils/utils';
import Prompt from '@/components/Prompt';
import AntdDatePicker from '@/components/AntdDatePicker';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ wmspo, common, loading, i18n }) => ({
  wmspo,
  dictObject: common.dictObject,
  id: wmspo.id,
  loading: loading.models.wmspo,
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
      activeKey: ['1', '2'],
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
      billType: [],
      _SelectColumns: [],
      consignee: [],
      consigner: [],
    };
  }

  className = 'wmspoOperate';


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
      if (v.title) {
        v.title = transferLanguage(v.title, this.props.language)
      } else if (v.value) {
        v.value = transferLanguage(v.value, this.props.language)
      }
      return v
    })
    this.setState({
      [params]: _columnsAllotOne
    })
  }
  // 获取详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'wmspo/wmspoDetails',
      payload: { id: ID },
      callback: data => {
        this.setState({
          senders: [{ id: data.senderId }],
          beUseRule: data.beUseRule,
          toCountryId: [{ id: data.toCountryId, name: data.toCountryName }],
          fromCountryId: [{ id: data.fromCountryId, name: data.fromCountryName }],
          shipToWmCode: [{ code: data.shipToWmCode, name: data.shipToWmName }],
          shipFromWmCode: [{ code: data.shipFromWmCode, name: data.shipFromWmName }],
          billType: [{ id: data.billTypeId, name: data.billTypeName }],
          consignee: [{ code: data.consignee, name: data.consignee }],
          consigner: [{ code: data.consigner, name: data.consigner }],
        });
      },
    });
  };

  // 获取明细列表：
  getSelectDetailsList = ID => {
    this.props.dispatch({
      type: 'wmspo/fetchWmsPoDetailsList',
      payload: { poId: ID },
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
        const { senders, soCreateTime, ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        const { shipToWmCode, shipFromWmCode, billType, consigner, consignee } = this.state
        value.toCountryId = shipToWmCode[0]?.countryId;
        value.fromCountryId = shipFromWmCode[0]?.countryId;
        value.shipToWmCode = shipToWmCode[0]?.code;
        value.shipFromWmCode = shipFromWmCode[0].code;
        value.billTypeId = billType[0]?.id;
        value.soCreateTime = soCreateTime ? moment(soCreateTime).format(dateFormat) : ''
        value.consigner = consigner && consigner[0] ? consigner[0].code : ""
        value.consignee = consignee && consignee[0] ? consignee[0].code : ""
        if (params.id) {
          value.id = params.id;
          dispatch({
            type: 'wmspo/wmspoOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('wmspo/wmspoList', {});
              this.dispatchFun('wmspo/wmspoDetails', { id: params.id });
            },
          });
        } else {
          dispatch({
            type: 'wmspo/wmspoOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              // this.setState({ showRecord: true });
              this.setState({ currentId: res })
              dispatch({
                type: 'wmspo/wmspoDetails',
                payload: { id: res },
                callback: data => {
                  // this.setState(preState => ({
                  //   disabled: !preState.disabled,
                  // }));
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
                        router.push(`/order/listWmsPo/editWmsPo/${res}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('wmspo/interfaceTypeList', {});
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
    // console.log('选择', rows);
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
      console.log('?进来了shipFromWmCode', values[0]?.countryName)
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
  addDetail = () => {
    const { currentId } = this.state
    if (currentId) {
      this.setState({ modalVisible: true, detailsId: '' })
    } else {
      Prompt({ content: transferLanguage('PoDetailList.prompt.saveBaseInfo', this.props.language), type: 'warn' })
    }

  }
  abledStatus = (type) => {
    const { checkIds, currentId } = this.state
    const { dispatch } = this.props
    const params={
      ids:checkIds,
      type,
    }
    console.log('123',type,params)
    dispatch({
      type: 'wmspo/ableOperate',
      payload: params,
      callback: data => {
        this.getSelectDetailsList(currentId)
        if(type=='cancelDetail') this.getSelectDetails(currentId)
      }
    })
  }
  cancel = () => {
    this.setState({ modalVisible: false })
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
      _SelectColumns,
      billType,
      consignee,
      consigner,
    } = this.state;
    const {
      wmspo: { wmspoDetails, poDetailsList, eventReceiverList },
      form,
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      showType,
      loading,
      language,
    } = this.props;
    const currentId = params.id;
    const poSelectList = poDetailsList[currentId]
    let selectDetails = wmspoDetails[currentId];
    const checkDisabled = selectDetails ? true : false;
    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.code : transferLanguage('PoDetailList.field.addPo', language)}</span>
        {disabled ? (
          <AdButton
            type="primary"
            disabled={selectDetails && selectDetails.status !== "OPEN" ? true : false}
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            code={codes.detailEdit}
            text={transferLanguage('Common.field.edit', language)}
          />
        ) : (
            <Button.Group>
              <Button type="primary" onClick={e => this.operatePaneButton(e)}>
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

    // 详情字段
    const PODetailsColumns = [
      {
        title: '#',
        dataIndex: 'index',
        render: (text, record, index) => (<span>{index + 1}</span>),
        width: 50
      },
      {
        // 标题
        // title: '业务单号',
        title: transferLanguage('PoDetailList.field.prNo', language),
        // 数据字段
        dataIndex: 'prNo',
        render: (text, record) => (
          <AdButton 
          text={text}
          code={codes.detailEdit}
          mode='a'  
          onClick={() => this.setState({ modalVisible: true, detailsId: record.id })} 
          />
          
        ),
        width: 110

      },
      {
        // title: '状态',
        title: transferLanguage('PoDetailList.field.status', language),
        dataIndex: 'status',
        render: text => <span title={text}>{text}</span>,
        width: 80

      },
      {
        // title: '状态',
        title: transferLanguage('InventoryReport.field.so', language),
        dataIndex: 'soNo',
        render: text => <span title={text}>{text}</span>,
        width: 120

      }, {
        // title: '料号',
        title: transferLanguage('PoDetailList.field.partNo', language),
        dataIndex: 'partNo',
        render: text => <span title={text}>{text}</span>,
        width: 130

      },
      {
        // title:'料号描述'
        title: transferLanguage('PoDetailList.field.partDesc', language),
        dataIndex: 'partDesc',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 200

      },
      {
        // title: '联想发货单号',
        title: transferLanguage('PoDetailList.field.dn', language),
        dataIndex: 'dn',
        render: text => <span title={text}>{text}</span>,
        width: 120

      },

      {
        // title: '运输优先级',
        title: transferLanguage('PoDetailList.field.transportPriority', language),
        dataIndex: 'transportPriority',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 80

      },
      {
        // title: 'pcs数',
        title: transferLanguage('PoDetailList.field.pieceQty', language),
        dataIndex: 'pieceQty',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 80
      }, {
        // title: '状态',
        title: transferLanguage('PoDetailList.field.openQty', language),
        dataIndex: 'openQty',
        render: text => <span title={text}>{text}</span>,
        width: 80

      }, {
        // title: '单价',
        title: transferLanguage('PoDetailList.field.unitPrice', language),
        dataIndex: 'unitPrice',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 80

      }, 
      // {
      //   // title: '状态',
      //   title: transferLanguage('PoDetailList.field.esd', language),
      //   dataIndex: 'esd',
      //   render: text => <span title={text}>{text}</span>,
      //   width: 80
      // }, 
      {
        // title: '发货日期-联想',
        title: transferLanguage('PoDetailList.field.deliveryDate', language),
        dataIndex: 'deliveryDate',
        render: text => <AdSelect value={text} onlyRead={true} />,
      }, {
        // title: '发货日期-联想',
        title: transferLanguage('PoDetailList.field.forwarder', language),
        dataIndex: 'forwarder',
        render: text => <AdSelect value={text} onlyRead={true} />,
      }, {
        // title: '货物运输跟踪单号',
        title: transferLanguage('ASN.field.bolNo', language),
        dataIndex: 'bolNo',
        render: text => <span title={text}>{text}</span>,
      }, {
        // title: '货物运输跟踪单号',
        title: transferLanguage('PoDetailList.field.eta', language),
        dataIndex: 'eta',
        render: text => <span title={text}>{text}</span>,
      }, {
        // title: '货物运输跟踪单号',
        title: transferLanguage('PoDetailList.field.etd', language),
        dataIndex: 'etd',
        render: text => <span title={text}>{text}</span>,
      }, {
        // title: '货物运输跟踪单号',
        title: transferLanguage('PoDetailList.field.bu', language),
        dataIndex: 'bu',
        render: text => <span title={text}>{text}</span>,
      },
      {
        // title: '货物运输跟踪单号',
        title: transferLanguage('PoDetailList.field.soldToCode', language),
        dataIndex: 'soldToCode',
        render: text => <span title={text}>{text}</span>,
      }, {
        // title: '货物运输跟踪单号',
        title: transferLanguage('PoDetailList.field.billToPartyNumber', language),
        dataIndex: 'billToPartyNumber',
        render: text => <span title={text}>{text}</span>,
      }, {
        // title: '货物运输跟踪单号',
        title: transferLanguage('PoDetailList.field.shipToCode', language),
        dataIndex: 'shipToCode',
        render: text => <span title={text}>{text}</span>,
      },
      {
        // title: '毛重',
        title: transferLanguage('PoDetailList.field.grossWeight', language),
        dataIndex: 'totalGrossWeight',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      // {
      //   // title: '净重',
      //   title: transferLanguage('PoDetailList.field.netWeight', language),
      //   dataIndex: 'totalNetWeight',
      //   render: text => <AdSelect value={text} onlyRead={true} />,
      // },
      // {
      //   // title: '体积',
      //   title: transferLanguage('PoDetailList.field.volume', language),
      //   dataIndex: 'totalVolume',
      //   render: text => <AdSelect value={text} onlyRead={true} />,
      // },
      {
        // title: '备注',
        title: transferLanguage('PoDetailList.field.remarks', language),
        dataIndex: 'remarks',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('PoDetailList.field.updateBy', language),
        dataIndex: 'updateBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('PoDetailList.field.updateTime', language),
        dataIndex: 'updateTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        // title: '状态',
        title: transferLanguage('PoDetailList.field.deliveryText', language),
        dataIndex: 'deliveryText',
        render: text => <span title={text}>{text}</span>,
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
      // handleAdd: this.handleAdd,
      buttons: (
        <Button.Group>
          <Button onClick={()=>this.abledStatus('cancelDetail')} type="primary"
            disabled={disabled || !selectedRows.length > 0}
          >
            {transferLanguage('Common.field.cancel', language)}
          </Button>
        </Button.Group>
        ),
     
      rightButtons: (
        <Button type={currentId ? "primary" : ""}
          disabled={selectDetails && selectDetails.status !== "OPEN" ? true : disabled}
          onClick={() => this.addDetail()}
        >
          {transferLanguage('PoDetailList.field.addDetail', language)}
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
                      <Form.Item label={transferLanguage('PoList.field.poNo', language)}>
                        {getFieldDecorator('poNo', {
                          initialValue: selectDetails ? selectDetails.poNo : '',
                        })(<Input placeholder={transferLanguage('Common.field.automaticGeneration', language)} disabled={true} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoList.field.type', language)}>
                        {getFieldDecorator('type', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.billTypeName : '',
                        })(
                          <SearchSelect
                            disabled={disabled}
                            dataUrl={'/mds-bill-type/selectMdsBillTypeList'}
                            selectedData={billType} // 选中值
                            showValue="name"
                            searchName="name"
                            multiple={false}
                            columns={_SelectColumns}
                            onChange={values => this.getValue(values, 'billType')}
                            id="type"
                            allowClear={true}
                            scrollX={200}
                            payload={{ businessType: ['PO', 'CON', 'IQC_PO'] }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoList.field.shipFrom', language)}>
                        {getFieldDecorator('shipFromWmCode', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.shipFromWmCode : '',
                        })(
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
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoList.field.fromCountry', language)}>
                        {getFieldDecorator('fromCountryName', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.fromCountryName : '',
                        })(<Input disabled={true} />
                          // <SearchSelect
                          //   disabled={disabled}
                          //   dataUrl={'/mds-country/selectMdsCountryList'}
                          //   selectedData={fromCountryId} // 选中值
                          //   showValue="name"
                          //   searchName="name"
                          //   multiple={false}
                          //   columns={_SelectColumns}
                          //   onChange={values => this.getValue(values, 'fromCountryId')}
                          //   id="fromCountryId"
                          //   allowClear={true}
                          //   scrollX={200}
                          // />
                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row gutter={_gutter}>
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
                          // <SearchSelect
                          //   disabled={disabled}
                          //   dataUrl={'/mds-country/selectMdsCountryList'}
                          //   selectedData={toCountryId} // 选中值
                          //   showValue="name"
                          //   searchName="name"
                          //   multiple={false}
                          //   columns={_SelectColumns}
                          //   onChange={values => this.getValue(values, 'toCountryId')}
                          //   id="toCountryId"
                          //   allowClear={true}
                          //   scrollX={200}
                          // />
                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoList.field.consigner', language)}>
                        {getFieldDecorator('consigner', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: consigner
                        })(
                          // <Input placeholder="" disabled={disabled} />
                          <SearchSelect
                            disabled={disabled}
                            dataUrl={'wms-contact-unit/selectWmsContactUnitList'}
                            selectedData={consigner} // 选中值
                            showValue="name"
                            searchName="name"
                            multiple={false}
                            columns={_SelectColumns}
                            onChange={values => this.getValue(values, 'consigner')}
                            id="consigner"
                            allowClear={true}
                            scrollX={200}
                            payload={{contactType:['SHIPPER']}}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoList.field.consignee', language)}>
                        {getFieldDecorator('consignee', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: consignee,
                        })(
                          // <Input placeholder="" disabled={disabled} />
                          <SearchSelect
                            disabled={disabled}
                            dataUrl={'wms-contact-unit/selectWmsContactUnitList'}
                            selectedData={consignee} // 选中值
                            showValue="name"
                            searchName="name"
                            multiple={false}
                            columns={_SelectColumns}
                            onChange={values => this.getValue(values, 'consignee')}
                            id="consignee"
                            allowClear={true}
                            scrollX={200}
                            payload={{contactType:['RECEIVER']}}

                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('InventoryReport.field.so', language)}>
                        {getFieldDecorator('soNo', {
                          rules: [{ required: true}],
                          initialValue: selectDetails ? selectDetails.soNo : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>

                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoDetailList.field.soCreateDate', language)}>
                        {getFieldDecorator('soCreateTime', {
                          rules: [{ required: true }],
                          initialValue: selectDetails && selectDetails.soCreateTime ? moment(selectDetails.soCreateTime) : '',
                        })(
                          <AntdDatePicker showTime disabled={disabled} placeholder={transferLanguage('Common.field.selectDate', language)} />

                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoDetailList.field.openQty', language)}>
                        {getFieldDecorator('openQty', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.openQty : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoDetailList.field.prNo', language)}>
                        {getFieldDecorator('prId', {

                          initialValue: selectDetails ? selectDetails.prId : '',
                        })(
                          <Input disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoDetailList.field.dn', language)}>
                        {getFieldDecorator('dn', {

                          initialValue: selectDetails ? selectDetails.dn : '',
                        })(
                          <Input disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoDetailList.field.partNo', language)}>
                        {getFieldDecorator('partNo', {

                          initialValue: selectDetails ? selectDetails.partNo : '',
                        })(
                          <Input disabled={true} />
                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoList.field.pieceQty', language)}>
                        {getFieldDecorator('pieceQty', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.pieceQty : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoDetailList.field.bolNo', language)}>
                        {getFieldDecorator('bolNo', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.bolNo : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('PoList.field.fileName', language)}>
                        {getFieldDecorator('fileName', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.fileName : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('PoList.field.remarks', language)}>
                        {getFieldDecorator('remarks', {
                          initialValue: selectDetails ? selectDetails.remarks : '',
                        })(<TextArea placeholder="" disabled={disabled} rows={4} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>

              </div>
            </Panel>

            {currentId&&<Panel header={transferLanguage('PoDetailList.title.list', language)} key="2" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={poSelectList}
                  columns={PODetailsColumns}
                  onSelectRow={this.handleSelectRows}
                  className={this.chassName}
                  code={codes.page}
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
