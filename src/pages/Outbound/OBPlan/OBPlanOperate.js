import React, {Component} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {Button, Col, Collapse, Form, Input, Row, Select,} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '@/pages/Operate.less';
import AdButton from '@/components/AdButton';
import {codes, Status} from "./utils";
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import DeliveryFormModal from './component/DeliveryFormModal';
import AdSelect from '@/components/AdSelect';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ wmspo, common, loading }) => ({
  wmspo,
  dictObject: common.dictObject,
  id: wmspo.id,
  loading: loading.models.wmspo,
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
      checkIds:'',
      detailsId:''
    };
  }
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
  }
  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'wmspo/wmspoDetails',
      payload: { id: ID },
      callback: data => {
        this.setState({
          senders: [{ id: data.senderId }],
          beUseRule: data.beUseRule,
        });
      },
    });
  };

  // 明细列表：
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

  operatePaneButton = e => {
    e.stopPropagation();
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { senders, ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        console.log('values', senders, value)

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
              dispatch({
                type: 'wmspo/wmspoDetails',
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

  getValue = values => {
    const { senders } = this.state;
    this.setState({
      senders: values,
    });
  };
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

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
      detailsId
    } = this.state;
    const {
      wmspo: { wmspoDetails,poDetailsList, eventReceiverList},
      form,
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      showType,
      loading,
    } = this.props;

    const currentId = params.id;
    let selectDetails = wmspoDetails[currentId];
    const checkDisabled = selectDetails ? true : false;

    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.code : '新增采购计划'}</span>
        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text="编辑"
          />
        ) : (
            <Button.Group>
              <Button type="primary" onClick={e => this.operatePaneButton(e)}>
                保存
            </Button>
              {currentId && (
                <AdButton
                  onClick={() => {
                    this.setState(preState => ({
                      disabled: !preState.disabled,
                    }));
                  }}
                  text="取消"
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
    };;

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
        title: '业务单号',
        // 数据字段
        dataIndex: 'prNo',
        render: (text, record) => (
          <a onClick={() => this.setState({ modalVisible: true,detailsId:record.id })}  title={text}>
            {text}
          </a>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: '料号',
        dataIndex: 'partNo',
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: '料号描述',
        dataIndex: 'partDesc',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: '联想发货单号',
        dataIndex: 'dn',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: '发货日期-联想',
        dataIndex: 'deliveryDate',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: '毛重',
        dataIndex: 'totalGrossWeight',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: '净重',
        dataIndex: 'totalNetWeight',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: '体积',
        dataIndex: 'totalVolume',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: 'pcs数',
        dataIndex: 'pieceQty',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },

      {
        title: '运输优先级',
        dataIndex: 'transportPriority',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: '单价',
        dataIndex: 'unitPrice',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: '更新人',
        dataIndex: 'updateBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },


    ]



    const deliveryParams = {
      visible: modalVisible,
      detailId: currentId,
      detailsId:this.state.detailsId,
      modalEmpty: () => this.setState({ modalVisible: false })
    };

    const tableButtonsParams = {
      show: true,
      // handleAdd: this.handleAdd,
      rightButtons: (
        <Button
          onClick={() => this.setState({ modalVisible: true,deliveryDetails:{} })}
        >
          新增明细
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
            <Panel header="基础信息" key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="单号">
                        {getFieldDecorator('poNo', {
                          initialValue: selectDetails ? selectDetails.poNo : '',
                        })(<Input placeholder="保存后自动生成" disabled={true} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="类型">
                        {getFieldDecorator('type', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.type : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="始发地">
                        {getFieldDecorator('shipFromWmCode', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.shipFromWmCode : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="始发国">
                        {getFieldDecorator('fromCountryId', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.fromCountryId : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="目的地">
                        {getFieldDecorator('shipToWmCode', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.shipToWmCode : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="目的国">
                        {getFieldDecorator('toCountryId', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.toCountryId : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="发货人">
                        {getFieldDecorator('consigner', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.consigner : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="收货人">
                        {getFieldDecorator('consignee', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.consignee : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="毛重">
                        {getFieldDecorator('totalGrossWeight', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.totalGrossWeight : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="净重">
                        {getFieldDecorator('totalNetWeight', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.totalNetWeight : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="体积">
                        {getFieldDecorator('totalVolume', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.totalVolume : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="pcs数">
                        {getFieldDecorator('pieceQty', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.pieceQty : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="箱数">
                        {getFieldDecorator('boxQty', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.boxQty : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="板数">
                        {getFieldDecorator('palletQty', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.palletQty : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label="备注">
                        {getFieldDecorator('remarks', {
                        })(<TextArea  disabled={disabled} rows={4} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>

              </div>
            </Panel>

            <Panel header="PO明细" key="2" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                {/*<SelectForm {...selectFormParams} />*/}
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                  // selectedRows={selectedRows}
                  loading={loading}
                  data={poDetailsList}
                  columns={PODetailsColumns}
                  // onSelectRow={this.handleSelectRows}
                  hideDefaultSelections={true}
                  // onPaginationChange={this.handleStandardTableChange}
                  expandForm={expandForm}
                  code={codes.page}
                  // hideCheckAll={true}
                />
              </div>
            </Panel>
          </Collapse>
        </PageHeaderWrapper>
     {  modalVisible&& <DeliveryFormModal {...deliveryParams}/>}
      </div>
    );
  }
}
