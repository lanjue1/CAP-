import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Col, Collapse, Form, Input, Row, Select, InputNumber } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '@/pages/Operate.less';
import AdSelect from '@/components/AdSelect';
import { transferLanguage } from '@/utils/utils';
import AntdDatePicker from '@/components/AntdDatePicker';
import {allDictList} from '@/utils/common'

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ token, common, loading, i18n }) => ({
  token,
  dictObject: common.dictObject,
  loading: loading.models.token,
  language: i18n.language
}))
@Form.create()
export default class TypeOperate extends Component {

  constructor(props) {
    super(props);
    this.state = {
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

  className = 'tokenOperate';


  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
    });
    if (ID) {
      this.setState({
        showRecord: true
      })
    } else {
      form.resetFields();
      this.setState({
        disabled: false
      })
    }

  }


  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  // 保存方法
  operatePaneButton = ( e, type ) => {
    e.stopPropagation();
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(type==1){
          values['type'] = 'apply'
        }else{
          values['type'] = 'affirm'
        }
        const { ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        value.startTime ? value.startTime = moment(value.startTime).format(dateFormat) : null
          dispatch({
            type: 'token/tokenOperate',
            payload: value,
            callback: res => {
              if (!res) return;
            },
          });
      }
    });
  };


  render() {
    const {
      selectedRows,
      visible,
      showRecord,
      senders,
      disabled,
      expandForm,
      modalVisible,
      checkIds,
      shipFromWmCode,
      countMode,
      _SelectColumns,
      billType,
      consignee,
      consigner,
    } = this.state;
    const {
      token,
      form,
      dictObject,
      match: { params },
      showType,
      loading,
      language,
    } = this.props;
    const { getFieldDecorator } = form;

    const currentId = params.id;

    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{ transferLanguage('token.field.addToken', language)}</span>
        <Button.Group>
              <Button type="primary" onClick={e => this.operatePaneButton(e,1)}>
                {transferLanguage('Common.field.Apply', language)}
              </Button>
              <Button type="primary" onClick={e => this.operatePaneButton(e,2)}>
                {transferLanguage('Common.field.ApplyAndEnable', language)}
              </Button>
              
            </Button.Group>
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
            <Panel header={transferLanguage('Common.field.baseInfo', language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                  <Col {..._col}>
                      <Form.Item label={transferLanguage('Token.field.TokenOperationType', language)}>
                        {getFieldDecorator('opType', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: '',
                        })(<AdSelect disabled={disabled} payload={{code:allDictList.OperationTokenType}}/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Token.field.validityPeriod', language)}>
                        {getFieldDecorator('validityPeriod', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: '30',
                        })(
                          <Select disabled={disabled}>
                            <Option value="30">30 Min</Option>
                            <Option value="60">60 Min</Option>
                            <Option value="1440">1 Day</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                  <Col {..._col}>
                      <Form.Item label={transferLanguage('Token.field.tokenQuantity', language)}>
                        {getFieldDecorator('tokenQuantity', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: 1,
                        })(<InputNumber min={1} max={10} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Token.field.startTime', language)}>
                        {getFieldDecorator('startTime', {
                          rules: [{ required: true, message: '请输入' }],
                        })(
                          <AntdDatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={transferLanguage('Common.field.startTime', language)}/>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item
                        label={transferLanguage('Token.field.remark', this.props.language)}
                      >
                        {getFieldDecorator('remarks', {
                          initialValue: '',
                        })(<TextArea rows={4} disabled={disabled} />)}
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
