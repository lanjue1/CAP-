import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Col, Collapse, Form, Input, Row, Select, DatePicker } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '@/pages/Operate.less';
import AdButton from '@/components/AdButton';
import { codes, Status, Type, Lock, Mode, Method, SelectColumns, partType, binStatus } from "./utils";
import TableButtons from '@/components/TableButtons';
import SelectForm from '@/components/SelectForm';
import StandardTable from '@/components/StandardTable';
import AdSelect from '@/components/AdSelect';
import StockCountDetailsModal from './component/StockCountDetailsModal';
import { transferLanguage } from '@/utils/utils';
import Prompt from '@/components/Prompt';
import AntdSelect from '@/components/AntdSelect';
import AntdDatePicker from '@/components/AntdDatePicker';
import AdModal from '@/components/AdModal';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ stockCount, common, loading, i18n }) => ({
  stockCount,
  dictObject: common.dictObject,
  loading: loading.models.stockCount,
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
      showRecord: false, //init:false
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
      countMode: [],
      billType: [],
      _SelectColumns: [],
      consignee: [],
      consigner: [],
    };
  }

  className = 'stockCountOperate';


  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
    });
    if (ID) {
      this.getSelectDetails(ID);
      this.getSelectDetailsList()
      this.setState({
        showRecord: true
      })
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
      type: 'stockCount/stockCountDetails',
      payload: { id: ID },
      callback: data => {
        this.setState({
          senders: [{ id: data.senderId }],
          beUseRule: data.beUseRule,
          toCountryId: [{ id: data.toCountryId, name: data.toCountryName }],
          fromCountryId: [{ id: data.fromCountryId, name: data.fromCountryName }],
          countMode: [{ code: data.countMode, name: data.shipToWmName }],
          shipFromWmCode: [{ code: data.shipFromWmCode, name: data.shipFromWmName }],
          billType: [{ id: data.billTypeId, name: data.billTypeName }],
          consignee: [{ code: data.consignee, name: data.consignee }],
          consigner: [{ code: data.consigner, name: data.consigner }],
        });
      },
    });
  };

  // 获取明细列表：
  getSelectDetailsList = value => {
    this.props.dispatch({
      type: 'stockCount/fetchstockCountDetailsList',
      payload: { ...value, countPlanId: this.state.currentId },
      callback: data => {
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
        const { ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        value.startTime ? value.startTime = moment(value.startTime).format(dateFormat) : null
        value.endTime ? value.endTime = moment(value.endTime).format(dateFormat) : null
        if (params.id) {
          value.id = params.id;
          dispatch({
            type: 'stockCount/stockCountOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('stockCount/stockCountDetails', { id: params.id });
            },
          });
        } else {
          dispatch({
            type: 'stockCount/stockCountOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              this.setState({ showRecord: true });
              this.setState({ currentId: res })
              dispatch({
                type: 'stockCount/stockCountDetails',
                payload: { id: res.data },
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
                        router.push(`/order/stockCount/editStockCount/${res.data}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('stockCount/interfaceTypeList', {});
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
    if (type == "countMode") {
      setFieldsValue({
        toCountryName: values[0]?.countryName
      })
      console.log('?进来了shipFromWmCode', values[0]?.countryName)
    }
  };

  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.getstockCountList();
  };

  //查询
  handleSearch = values => {
    values.partCode = values.partNo
    delete values.partNo
    this.setState({
      formValues: values,
    });
    this.getSelectDetailsList(values);
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
    this.getSelectDetailsList()
  }
  addDetail = () => {
    console.log('???????')
    this.setState({ modalVisible: true })
  }
  abledStatus = (type) => {
    const { checkIds, currentId } = this.state
    const { dispatch } = this.props
    const params = {
      ids: checkIds,
      type,
    }
    dispatch({
      type: 'stockCount/ableOperate',
      payload: params,
      callback: data => {
        this.getSelectDetailsList()
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
      countMode,
      _SelectColumns,
      billType,
      consignee,
      consigner,
    } = this.state;
    const {
      stockCount: { stockCountDetails, stockCountDetailsList },
      form,
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      showType,
      loading,
      language,
    } = this.props;
    const currentId = params.id;
    const selectList = stockCountDetailsList[currentId]
    let selectDetails = stockCountDetails[currentId];

    { console.log('??????/', stockCountDetailsList) }
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.code : transferLanguage('StockCount.field.addPo', language)}</span>
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
    const firstFormItem = (
      <FormItem label={transferLanguage('StockCount.field.bin', language)}>
        {getFieldDecorator('binCode')(<Input placeholder="" />)}
      </FormItem>
    );
    const secondFormItem = (
      <FormItem label={transferLanguage('Common.field.partNo', language)}>
        {getFieldDecorator('partNo')(<Input placeholder="" />)}
      </FormItem>
    );

    const otherFormItem = [[<FormItem label={transferLanguage('StockCount.field.binStatus', language)}>
      {getFieldDecorator('binStatus')(
        <Select placeholder={transferLanguage('Common.field.select', language)} style={{ width: '100%' }} allowClear={true}>
          {binStatus.map(v => {
            return <Option value={v.code}>{v.value}</Option>;
          })}
        </Select>
      )}
    </FormItem>],
    [
      <FormItem label={transferLanguage('StockCount.field.partType', language)}>
        {getFieldDecorator('partType')(
          <Select placeholder={transferLanguage('Common.field.select', language)} style={{ width: '100%' }} allowClear={true}>
            {partType.map(v => {
              return <Option value={v.code}>{v.value}</Option>;
            })}
          </Select>
        )}
      </FormItem>,
      'operatorButtons',
    ],
    ]



    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      otherFormItem,
      form,
      className: this.className,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      toggleForm: this.toggleForm,
      quickQuery: true
    };

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
        title: transferLanguage('StockCount.field.bin', language),
        // 数据字段
        dataIndex: 'binCode',
        render: (text, record) => (
          <span title={text}>{text}</span>

        ),
        width: 110
      },
      {
        // title: '状态',
        title: transferLanguage('StockCount.field.binStatus', language),
        dataIndex: 'status',
        render: text => <span title={text}>{text}</span>,
        width: 80

      },
      {
        title: transferLanguage('InventoryReport.field.partNo', language),
        dataIndex: 'partCode',
        render: text => <span title={text}>{text}</span>,
        width: 120

      },
      {
        // title:'料号描述'
        title: transferLanguage('StockCount.field.partDesc', language),
        dataIndex: 'partDesc',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 200

      },
      {
        // title: '联想发货单号',
        title: transferLanguage('StockCount.field.cc', language),
        dataIndex: 'cc',
        render: text => <span title={text}>{text}</span>,
        width: 120

      },

      {
        title: transferLanguage('StockCount.field.status', language),
        dataIndex: 'status',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 80

      },
      {
        // title: 'pcs数',
        title: transferLanguage('StockCount.field.qty', language),
        dataIndex: 'qty',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 80
      },
      {
        // title: 'pcs数',
        title: transferLanguage('StockCount.field.conuntNo', language),
        dataIndex: 'conuntNo',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 80
      },
      {
        // title: 'pcs数',
        title: transferLanguage('StockCount.field.result', language),
        dataIndex: 'result',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 80
      },
      {
        // title: 'pcs数',
        title: transferLanguage('StockCount.field.differenceQTY', language),
        dataIndex: 'differenceQTY',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 80
      },
      {
        // title: 'pcs数',
        title: transferLanguage('StockCount.field.updateBy', language),
        dataIndex: 'updateBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 80
      },
      {
        // title: 'pcs数',
        title: transferLanguage('StockCount.field.updateTime', language),
        dataIndex: 'updateTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 80
      },
    ]

    const tableButtonsParams = {
      show: true,
      handleAdd: this.addDetail,
      buttons: (
        <Button.Group>
          <Button onClick={() => this.abledStatus('cancelDetail')} type="primary"
            disabled={disabled || !selectedRows.length > 0}
          >
            {transferLanguage('Common.field.confirm', language)}
          </Button>
          <Button onClick={() => this.abledStatus('cancelDetail')} type="primary"
            disabled={disabled || !selectedRows.length > 0}
          >
            {transferLanguage('Common.field.cancel', language)}
          </Button>
        </Button.Group>
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
                      <Form.Item label={transferLanguage('stockCount.field.countPlanNo', language)}>
                        {getFieldDecorator('countPlanNo', {
                          initialValue: selectDetails ? selectDetails.countPlanNo : '',
                        })(<Input disabled={true} placeholder={transferLanguage('Common.field.automaticGeneration', language)} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('stockCount.field.status', language)}>
                        {getFieldDecorator('status', {
                          initialValue: selectDetails ? selectDetails.status : 'OPEN',
                        })(
                          <Input disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('stockCount.field.countType', language)}>
                        {getFieldDecorator('countType', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.countType : '',
                        })(<AntdSelect
                          data={Type}
                          disabled={disabled}
                          show={{ id: 'code', name: 'value' }}
                        />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('stockCount.field.countMethod', language)}>
                        {getFieldDecorator('countMethod', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.countMethod : '',
                        })(<AntdSelect
                          data={Method}
                          disabled={disabled}
                          show={{ id: 'code', name: 'value' }}
                        />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('stockCount.field.countMode', language)}>
                        {getFieldDecorator('countMode', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.countMode : '',
                        })(
                          <AntdSelect
                            data={Mode}
                            disabled={disabled}
                            show={{ id: 'code', name: 'value' }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('stockCount.field.countLock', language)}>
                        {getFieldDecorator('countLock', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.countLock : '',
                        })(<AntdSelect
                          data={Lock}
                          disabled={disabled}
                          show={{ id: 'code', name: 'value' }}
                        />
                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('stockCount.field.partCode', language)}>
                        {getFieldDecorator('partCode', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.partCode : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('stockCount.field.binCount', language)}>
                        {getFieldDecorator('binCount', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.binCount : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('InventoryReport.field.countQty', language)}>
                        {getFieldDecorator('countQty', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.countQty : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('StockCount.field.startTime', language)}>
                        {getFieldDecorator('startTime', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? moment(selectDetails.startTime) : undefined,
                        })(
                          <AntdDatePicker placeholder={transferLanguage('Common.field.selectDate', language)} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('StockCount.field.endTime', language)}>
                        {getFieldDecorator('endTime', {
                          initialValue: selectDetails ? moment(selectDetails.endTime) : undefined,
                        })(
                          <AntdDatePicker placeholder={transferLanguage('Common.field.selectDate', language)} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Panel>
            {showRecord && <Panel header={transferLanguage('StockCount.title.list', language)} key="2" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                  selectedRows={selectedRows}
                  // disabledRowSelected={true}
                  loading={loading}
                  data={selectList}
                  columns={PODetailsColumns}
                  onSelectRow={this.handleSelectRows}
                  // hideDefaultSelections={true}
                  // onPaginationChange={this.handleStandardTableChange}
                  // expandForm={expandForm}
                  className={this.chassName}
                  code={codes.page}
                // hideCheckAll={true}
                />
              </div>
            </Panel>}
            {modalVisible && <StockCountDetailsModal modalEmpty={this.modalEmpty} cancel={this.cancel} visible={modalVisible} detailId={currentId} />}
          </Collapse>
        </PageHeaderWrapper>
      </div>
    );
  }
}
