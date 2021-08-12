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
import AdButton from '@/components/AdButton';
import { Status } from './utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ wmsItemType, common, loading }) => ({
  wmsItemType,
  dictObject: common.dictObject,
  id: wmsItemType.id,
  loading: loading.models.wmsItemType,
}))
@Form.create()
export default class wmsItemTypeOperate extends Component {
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
    if (ID) {
      this.getSelectDetails(ID);
    } else {
      form.resetFields();
    }
  }
  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'wmsItemType/wmsItemTypeDetails',
      payload: { id: ID },
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

        if (params.id) {
          value.id = params.id;
          dispatch({
            type: 'wmsItemType/wmsItemTypeOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('wmsItemType/wmsItemTypeList', {});
              this.dispatchFun('wmsItemType/wmsItemTypeDetails', { id: params.id });
            },
          });
        } else {
          dispatch({
            type: 'wmsItemType/wmsItemTypeOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              // this.setState({ showRecord: true });
              dispatch({
                type: 'wmsItemType/wmsItemTypeDetails',
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
                        router.push(`/wmsItemType/listWmsItemType/editWmsItemType/${res}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('wmsItemType/interfaceTypeList', {});
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
      wmsItemType: { wmsItemTypeDetails, eventReceiverList },
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      showType,
      loading,
    } = this.props;

    const currentId = params.id;
    let selectDetails = wmsItemTypeDetails[currentId];
    const checkDisabled = selectDetails ? true : false;

    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.businessTypeCode : '新增仓库'}</span>
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
    };

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
            <Panel header="基础信息" key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="编码">
                        {getFieldDecorator('code', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.code : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="货品类型名称">
                        {getFieldDecorator('name', {
                          initialValue: selectDetails ? selectDetails.name : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="状态">
                        {getFieldDecorator('status', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.status : '',
                        })(
                          <Select disabled={disabled}>
                            {Status.map(v => {
                              return <Option value={v.code}>{v.value}</Option>;
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}></Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label="备注">
                        {getFieldDecorator('remarks', {})(
                          <TextArea  disabled={disabled} rows={4} />
                        )}
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
