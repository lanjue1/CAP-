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
import {dispatchFun} from '@/utils/utils';
import { Status,allDispatchType,routeUrl,codes } from './utils';
import { transferLanguage } from '@/utils/utils';
import { languages } from 'monaco-editor';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ CargoOwner, common, loading ,i18n}) => ({
 
  cargoOwnerDetail:CargoOwner.cargoOwnerDetail,
  dictObject: common.dictObject,
  loading: loading.effects[allDispatchType.detail],
  language: i18n.language,

}))
@Form.create()
export default class CargoOwnerOperate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: '',
      visible: false,
      activeKey: ['1', '2'],
      disabled: true,
    };
  }
  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
    });
    if (ID) {
      this.getSelectDetails(ID);
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
      type: allDispatchType.detail,
      payload: { id: ID },
      callback: data => {
      },
    });
  };

  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

 //保存、编辑
  saveInfo = e => {
    e.stopPropagation();
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {  ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        value.id = params.id;
        dispatch({
          type:allDispatchType.operate,
          payload:value,
          callback:(res)=>{
            if (!res) return;
            this.setState(preState => ({
              disabled: !preState.disabled,
            }));
            if(params.id){
              dispatchFun(allDispatchType.list, {},this.props)
              dispatchFun(allDispatchType.detail, {id: params.id},this.props)
            }else{
              // dispatchFun(allDispatchType.detail, {id: res},this.props)
              dispatch({
                type: allDispatchType.detail,
                payload: { id: res },
                callback: data => {
                  dispatch({
                    type: 'common/setTabsName',
                    payload: {
                      id: res,
                      name: data.businessTypeCode,
                      isReplaceTab: true,
                    },
                    callback: result => {
                      if (result) {
                        router.push(`${routeUrl.edit}/${res}`);
                      }
                    },
                  });
                }
              })
            }
          }
        })
      }
    });
  };
 

  // 明细查看详情
  showDetail = () => {
    this.setState({ visible: true });
  };

  // 明细关闭详情
  infoHandleCancel = () => {
    this.setState({ visible: false, visiblePay: false });
  };

  getValue = (type,values )=> {
    this.setState({
      [type]: values,
    });
  };

  render() {
    const {
      visible,
      disabled,
    } = this.state;
    const {
      cargoOwnerDetail,
      form: { getFieldDecorator },
      match: { params },
      loading,
      language,
    } = this.props;

    const currentId = params.id;
    let selectDetails = cargoOwnerDetail[currentId];

    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.businessTypeCode : transferLanguage('CargoOwnerDetail.title.AddCargoOwnerInfo',language)}</span>
        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            code={codes.edit}
            text={transferLanguage('CargoOwnerDetail.button.edit',language)}
          />
        ) : (
          <Button.Group>
            <Button type="primary" onClick={e => this.saveInfo(e)}>
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
            <Panel header={transferLanguage('Common.field.baseInfo',language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CargoOwnerDetail.field.code',language)}>
                        {getFieldDecorator('code', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.code : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CargoOwnerDetail.field.fullName',language)}>
                        {getFieldDecorator('fullName', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.fullName : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CargoOwnerDetail.field.shortName',language)}>
                        {getFieldDecorator('shortName', {
                          // rules: [{ required: true, message: '请输入' }],

                          initialValue: selectDetails ? selectDetails.shortName : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                    <Form.Item label={transferLanguage('CargoOwnerDetail.field.status',language)}>
                        {getFieldDecorator('status', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails && selectDetails.status == 'DISABLE' ? 
                          transferLanguage('Common.field.disable',language) : transferLanguage('Common.field.enable',language),
                        })(
                          // <Select disabled={disabled}>
                          //   {Status.map(v => {
                          //     return <Option value={v.code}>{v.value}</Option>;
                          //   })}
                          // </Select>
                          <Input  disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CargoOwnerDetail.field.paymentType',language)}>
                        {getFieldDecorator('paymentType', {
                          initialValue: selectDetails ? selectDetails.paymentType : '',
                        })(<Input placeholder="true or false" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CargoOwnerDetail.field.paymentTermId',language)}>
                        {getFieldDecorator('paymentTermId', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.paymentTermId : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CargoOwnerDetail.field.ownerAttr',language)}>
                        {getFieldDecorator( 'ownerAttr',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.ownerAttr : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CargoOwnerDetail.field.address',language)}>
                        {getFieldDecorator( 'address',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.address : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CargoOwnerDetail.field.phone',language)}>
                        {getFieldDecorator( 'phone',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.phone : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CargoOwnerDetail.field.description',language)}>
                        {getFieldDecorator( 'description',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.description : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    {/* <Col {..._col}>
                      <Form.Item label="beDeleted">
                        {getFieldDecorator( 'beDeleted',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.beDeleted : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col> */}
                    
                  </Row>
                  
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('CargoOwnerDetail.field.remarks',language)}>
                        {getFieldDecorator(
                          'remarks',
                          {}
                        )(<TextArea  disabled={disabled} rows={4} />)}
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
