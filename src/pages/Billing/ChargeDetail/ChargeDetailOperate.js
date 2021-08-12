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
import styles from '@/pages/Operate.less';
import AntdInput  from '@/components/AntdInput'
import AdButton from '@/components/AdButton';
import AntdDatePicker from '@/components/AntdDatePicker'
import SearchSelect from '@/components/SearchSelect'
import {dispatchFun} from '@/utils/utils';
import { Status,allDispatchType,routeUrl,SelectColumns } from './utils';
import { transferLanguage } from '@/utils/utils';
import { languages } from 'monaco-editor';
import FileReader from '@/components/FileReader';
import { queryFileList, filterAddFile, filterDeteteFile } from '@/utils/common';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
const formatDate='YYYY-MM-DD HH:mm:ss'
@connect(({ ChargeDetail, common, loading ,i18n}) => ({
 
  chargeDetailDetail:ChargeDetail.chargeDetailDetail,
  dictObject: common.dictObject,
  loading: loading.effects[allDispatchType.detail],
  language: i18n.language,

}))
@Form.create()
export default class ChargeDetailOperate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: '',
      visible: false,
      activeKey: ['1', '2'],
      disabled: true,
      name:[],
      partId:[],
      qty:0,
    };
    this.fileList = [];
  }
  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
    });
    if (ID) {
      this.getSelectDetails(ID);
      // this.queryFileList(ID);

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
  queryFileList = id => {
    queryFileList({
      props: this.props,
      params: { bizId: id, fileBizType: 'ChargeDetail' },
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

 //保存、编辑
  saveInfo = e => {
    e.stopPropagation();
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { fileToken,bizDate, name,partId,...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        //附件
      value.fileToken = filterAddFile(fileToken);
      value.deleteFileIds = filterDeteteFile(fileToken, this.fileList);

      value.bizDate = bizDate ? moment(bizDate).format(formatDate) : '';
      if(name) value.typeCode=name[0].code
      if(partId){
        value.partId=partId[0].id
        value.partCode=partId[0].code
      }
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
              // this.queryFileList(params.id);
            }else{
              // dispatchFun(allDispatchType.detail, {id: res},this.props)
              dispatch({
                type: allDispatchType.detail,
                payload: { id: res },
                callback: data => {
                  console.log('data???',data)
                  // this.queryFileList(data);
                  dispatch({
                    type: 'common/setTabsName',
                    payload: {
                      id: res,
                      name: data.code,
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

  getValue = (values,type )=> {
    console.log('values,type',values,type)
    const {form:{setFieldsValue}}=this.props
    this.setState({
      [type]: values,
    });
    if(type=='name'&&values.length>0){
      setFieldsValue({
        unitPrice:values[0].unitPrice,
        currency:values[0].currency,
      })
      const {qty}=this.state
      qty!==0&& setFieldsValue({
        calculateAmount:values[0].unitPrice*qty,
        actualAmount:values[0].unitPrice*qty,
      })
    }
    if(type=='qty'){
      const {name}=this.state
      console.log('name--type==',name)
      name.length>0&& setFieldsValue({
        calculateAmount:name[0].unitPrice*values,
        actualAmount:name[0].unitPrice*values,
      })
    }
  };

  render() {
    const {
      visible,
      disabled,
    } = this.state;
    const {
      chargeDetailDetail,
      form: { getFieldDecorator },
      match: { params },
      loading,
      language,
    } = this.props;

    const currentId = params.id;
    let selectDetails = chargeDetailDetail[currentId];

    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.businessTypeCode : transferLanguage('ChargeDetail.field.addChargeDetail',language)}</span>
        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text={transferLanguage('Common.field.edit',language)}
          />
        ) : (
          <Button.Group>
            <Button type="primary" onClick={e => this.saveInfo(e)}>
              {transferLanguage('Common.field.save',language)}
            </Button>
            {currentId && (
              <AdButton
                onClick={() => {
                  this.setState(preState => ({
                    disabled: !preState.disabled,
                  }));
                }}
                text={transferLanguage('Common.field.cancel',language)}
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
            <Panel header={transferLanguage('Common.title.baseInfo',language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ChargeDetail.field.ledgerNo',language)}>
                        {getFieldDecorator('ledgerNo', {
                          initialValue: selectDetails ? selectDetails.ledgerNo : '',
                        })(<Input  disabled={true} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Common.field.status',language)}>
                        {getFieldDecorator('status', {
                          initialValue: selectDetails ? selectDetails.status : '',
                        })(<Input  disabled={true} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('shipping.field.bizDate',language)}>
                        {getFieldDecorator('bizDate', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails &&selectDetails.bizDate? moment(selectDetails.bizDate) : '',
                        })(
                        <AntdDatePicker showTime disabled={disabled}/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                    <Form.Item label={transferLanguage('CoDetailList.field.soDetailNo',language)}>
                        {getFieldDecorator('soDetailNo', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails && selectDetails.soDetailNo  ? selectDetails.soDetailNo:""
                          
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ChargeDetail.field.chargeName',language)}>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.name : '',
                        })(
                          <SearchSelect
                          dataUrl={'bms-charge-detail/selectChargePrice'}
                          selectedData={this.state.name} // 选中值
                          showValue="name"
                          searchName="name"
                          multiple={false}
                          columns={SelectColumns}
                          onChange={values => this.getValue(values, 'name')}
                          id="name"
                          allowClear={true}
                          scrollX={200}
                          // payload={{ businessType: ['INBOUND'] }}
                        />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ASNDetail.field.unitPrice',language)}>
                        {getFieldDecorator('unitPrice', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.unitPrice : '',
                        })(
                          <Input  disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('RMO.field.partNo',language)}>
                        {getFieldDecorator( 'partId',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.partId : '',
                        }
                        )(
                          <SearchSelect
                          dataUrl={'wms-part/selectWmsPartList'}
                          selectedData={this.state.partId} // 选中值
                          showValue="name"
                          searchName="name"
                          multiple={false}
                          columns={SelectColumns}
                          onChange={values => this.getValue(values, 'partId')}
                          id="partId"
                          allowClear={true}
                          scrollX={200}
                          // payload={{ businessType: ['INBOUND'] }}
                        />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('shipping.field.planPieceQty',language)}>
                        {getFieldDecorator( 'qty',{
                           rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.qty : '',
                        }
                        )(<AntdInput mode='number' 
                            onChange={values => this.getValue(values, 'qty')}
                          disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ChargeType.field.currency',language)}>
                        {getFieldDecorator( 'currency',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.currency : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ChargeDetail.field.calculateAmount',language)}>
                        {getFieldDecorator('calculateAmount',{
                          initialValue: selectDetails ? selectDetails.calculateAmount : '',
                        }
                        )(<Input  disabled={true}  />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ChargeDetail.field.actualAmount',language)}>
                        {getFieldDecorator( 'actualAmount',{
                           rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.actualAmount : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ChargeDetail.field.billingName',language)}>
                        {getFieldDecorator('billingName',{
                          initialValue: selectDetails ? selectDetails.billingName : '',
                        }
                        )(<Input  disabled={disabled}  />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Receipt.field.bizNo',language)}>
                        {getFieldDecorator( 'bizNo',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.bizNo : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Common.field.remarks',language)}>
                        {getFieldDecorator('remarks',{
                          initialValue: selectDetails ? selectDetails.remarks : '',
                        }
                        )(<TextArea  disabled={disabled}  row={1}/>)}
                      </Form.Item>
                    </Col>
                  </Row>
                  {/* <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ChargeDetail.field.attachment',language)}>
                        {getFieldDecorator( 'fileToken',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.fileToken : '',
                        }
                        )(<FileReader disabled={disabled}  />)}
                      </Form.Item>
                    </Col>
                  </Row> */}
                </Form>
              </div>
            </Panel>
          </Collapse>
        </PageHeaderWrapper>
      </div>
    );
  }
}
