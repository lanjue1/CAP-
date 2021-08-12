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
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from '@/pages/Operate.less';
import SearchSelect from '@/components/SearchSelect';
import AdButton from '@/components/AdButton';
import { codes, NoticeMode, EventType } from './utils';
import { transferLanguage } from '@/utils/utils'
import { lang } from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ interfaceType, common, loading,i18n }) => ({
  interfaceType,
  dictObject: common.dictObject,
  language: i18n.language,
  id: interfaceType.id,
  loading: loading.models.interfaceType,
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
      disabled: false,
      beUseRule: true,
      requestTypeList: [],
    };
  }
  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      showRecord: true,
    });
    this.getRequestTypeList();
    if (ID) {
      this.getSelectDetails(ID);
      this.getReceiverList(ID);
    } else {
      form.resetFields();
    }
  }
  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'interfaceType/interfaceTypeDetails',
      payload: { id: ID },
      callback: data => {
        this.setState({
          senders: [{ id: data.senderId }],
          beUseRule: data.beUseRule,
        });
      },
    });
  };
  //字典数据：
  getReceiverList = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceType/eventReceiverList',
      payload: { id, pageSize: 500 },
    });
  };

  //请求类型列表：
  getRequestTypeList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceType/selectRequestTypeList',
      payload: { "code": "REQUEST_TYPE" },
      callback: res => {
        this.setState({
          requestTypeList: res || [],
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

        if (params.id) {
          value.id = params.id;
          dispatch({
            type: 'interfaceType/interfaceTypeOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('interfaceType/interfaceTypeList', {});
              this.dispatchFun('interfaceType/interfaceTypeDetails', { id: params.id });
            },
          });
        } else {
          dispatch({
            type: 'interfaceType/interfaceTypeOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              // this.setState({ showRecord: true });
              dispatch({
                type: 'interfaceType/interfaceTypeDetails',
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
                        router.push(`/interface/interfaeType/typeEdit/${res}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('interfaceType/interfaceTypeList', {});
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
    } = this.state;
    const {
      interfaceType: { interfaceTypeDetails, eventReceiverList },
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      showType,
      loading,
      language,
    } = this.props;

    const currentId = params.id;
    let selectDetails = interfaceTypeDetails[currentId];
    const checkDisabled = selectDetails ? true : false;

    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.businessTypeCode : transferLanguage('Type.field.addInterfaceType',language)}</span>
        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text={transferLanguage('CargoOwnerDetail.button.edit',language)}
          />
        ) : (
            <Button.Group>
              <Button type="primary" onClick={e => this.operatePaneButton(e)}>
                {transferLanguage('CargoOwnerDetail.button.save',language)}
            </Button>
              {currentId && (
                <AdButton
                  onClick={() => {
                    this.setState(preState => ({
                      disabled: !preState.disabled,
                    }));
                  }}
                  text={transferLanguage('CargoOwnerDetail.button.cancel',language)}
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


    return (
      <div className={styles.CollapseUpdate}>
        <PageHeaderWrapper title={genExtraBasicInfo()}>
          <Collapse
            activeKey={this.state.activeKey}
            onChange={key => this.callback(key)}
            bordered={false}
          >
            <Panel header={transferLanguage('Common.field.baseInfo',language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Type.field.businessTypeCode',language)}>
                        {getFieldDecorator('businessTypeCode', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.businessTypeCode : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Type.field.businessTypeName',language)}>
                        {getFieldDecorator('businessTypeName', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.businessTypeName : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Type.field.receiverSys',language)}>
                        {getFieldDecorator('receiverSys', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.senderSys : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Type.field.senderSys',language)}>
                        {getFieldDecorator('senderSys', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.senderSys : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Type.field.requestType',language)}>
                        {getFieldDecorator('requestType', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.requestType : '',
                        })(
                          <Select disabled={disabled}>
                            {this.state.requestTypeList.map(v => {
                              return <Option value={v.code}>{v.value}</Option>;
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Type.field.url',language)}>
                        {getFieldDecorator('url', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.url : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Type.field.topicNameNormal',language)}>
                        {getFieldDecorator('topicNameNormal', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.topicNameNormal : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Type.field.topicNameException',language)}>
                        {getFieldDecorator('topicNameException', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.topicNameException : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('Type.field.remarks',language)}>
                        {getFieldDecorator('remarks', {
                          initialValue: selectDetails ? selectDetails.remarks : '',
                        })(<TextArea  disabled={disabled} rows={4} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Panel>
          </Collapse>
        </PageHeaderWrapper>
      </div>
    );
  }
}
