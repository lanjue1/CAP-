import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,

} from 'antd';
import { SelectColumns } from './utils';
import moment from 'moment'
import styles from '@/pages/Operate.less';
import AntdInput from '@/components/AntdInput'
import AntdDatePicker from '@/components/AntdDatePicker'
import { transferLanguage } from '@/utils/utils';
import FileReader from '@/components/FileReader';
import SearchSelect from '@/components/SearchSelect';

const { TextArea } = Input;

@connect(({ common, i18n }) => ({
  dictObject: common.dictObject,
  language: i18n.language,
}))
@Form.create()
export default class Forms extends Component {
  className = 'Forms'
  constructor(props) {
    super(props);
    this.state = {
     _SelectColumns: []
    };
    this.fileList = [];
  }

  setFriends (e) {
    const {
      selectDetails,
    } = this.props;
	e.stopPropagation();
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      //页面隐藏status表单 提交要把后台回显的status值 返回给后端
      values.status = selectDetails.status;
      if (!err) {
		//   返回form表单数据给父组件
        this.props.onRef('save', values)

      }
    });
	}
	componentDidMount () {
    // 调用父组件方法把当前实例传给父组件
    this.props.onRef('Forms', this)
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
  getValue = (values, type) => {
    // console.log('values,type', values, type)
    const { form: { setFieldsValue,getFieldValue } } = this.props
    this.setState({
      [type]: values,
    });
    if(type=='taxAmount'){
      let _value=+values+(+getFieldValue('totalAmount'))-getFieldValue('adjustAmount')
      setFieldsValue({
        tax:parseFloat(values*100/getFieldValue('totalAmount')).toFixed(2),
        actualAmount:parseFloat(_value).toFixed(2)
      })
    }
    if(type=='tax'){
      let _value=+getFieldValue('totalAmount')*values/100
      setFieldsValue({
        taxAmount:parseFloat(_value).toFixed(2),
        actualAmount:+parseFloat(_value).toFixed(2)+(+getFieldValue('totalAmount'))-getFieldValue('adjustAmount')
      })
    }
    if(type=='adjustPer'){
      let _value=+getFieldValue('totalAmount')*values/100
      setFieldsValue({
        adjustAmount:parseFloat(_value).toFixed(2)
      })
    }
    if(type=='adjustAmount'){
      let _value=+getFieldValue('taxAmount')+(+getFieldValue('totalAmount'))-values
      setFieldsValue({
        adjustPer:parseFloat(values*100/getFieldValue('totalAmount')).toFixed(2),
        actualAmount:parseFloat(_value).toFixed(2)
      })
    }
  };


  render() {
    const {
      _SelectColumns,
    } = this.state;
    const {
      form: { getFieldDecorator },
      form,
      loading,
      language,
	    selectDetails,
    } = this.props;

    const obj={};
    const objPayer={};
    const payee=[]
    const payer=[]
    if(selectDetails){
      obj.code=selectDetails.payee;
      obj.name=selectDetails.payee;
      objPayer.code=selectDetails.payer;
      objPayer.name=selectDetails.payer;
      payee.push(obj);
      payer.push(objPayer);
    }
	  const disabled = this.props.disabled
    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };

   // <Form.Item label={transferLanguage('Common.field.status', language)}>
   //                initialValue: selectDetails ? selectDetails.status : '',
   //              })(<Input disabled={true} />)}
   //            </Form.Item>
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ChargeDetail.field.billingNo', language)}>
                {getFieldDecorator('billingNo', {
                  initialValue: selectDetails ? selectDetails.billingNo : '',
                })(<Input disabled={true} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>

            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('BuyLedger.field.payer', language)}>
                {getFieldDecorator('payer', {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: selectDetails ? selectDetails.payer : '',
                })(
                  <SearchSelect
                    disabled={disabled}
                    dataUrl={'/wms-contact-unit/selectWmsContactUnitList'}
                    selectedData={payer} // 选中值
                    showValue="name"
                    searchName="name"
                    multiple={false}
                    columns={_SelectColumns}
                    onChange={values => this.getValue(values, 'payer')}
                    id="payer"
                    allowClear={true}
                    scrollX={200}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
             <Form.Item label={transferLanguage('BuyLedger.field.payee', language)}>
               {getFieldDecorator('payee', {
                 rules: [{ required: true, message: '请选择' }],

                 initialValue: selectDetails ? selectDetails.payee : '',
               })(
                 <SearchSelect
                   disabled={disabled}
                   dataUrl={'/wms-contact-unit/selectWmsContactUnitList'}
                   selectedData={payee} // 选中值
                   showValue="name"
                   searchName="name"
                   multiple={false}
                   columns={_SelectColumns}
                   onChange={values => this.getValue(values, 'payee')}
                   id="payee"
                   allowClear={true}
                   scrollX={200}
                 />
               )}
             </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('Receipt.field.billingDate', language)}>
                {getFieldDecorator('billingDate', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.billingStartDate ?
                    [moment(selectDetails.billingStartDate), moment(selectDetails.billingEndDate)] : '',
                })(
                  <AntdDatePicker mode='range' disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('BuyLedger.field.billingCycle', language)}>
                {getFieldDecorator('billingCycle', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.billingCycle : ""

                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ChargeDetail.field.calculateAmount', language)}>
                {getFieldDecorator('totalAmount', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.totalAmount : '',
                })(
                  <Input disabled={true} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ChargeType.field.currency', language)}>
                {getFieldDecorator('totalAmountCurrency', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.totalAmountCurrency : '',
                })(
                  <Input disabled={true} />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('BuyLedger.field.tax(%)', language)}>
                {getFieldDecorator('tax', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? parseFloat(selectDetails.tax).toFixed(2) : '',
                }
                )(<AntdInput mode="money" disabled={disabled} onChange={(values) => this.getValue(values, 'tax')} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('BuyLedger.field.taxAmount', language)}>
                {getFieldDecorator('taxAmount', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.taxAmount : '',
                }
                )(<AntdInput mode="money" disabled={disabled} onChange={(values) => this.getValue(values, 'taxAmount')} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('BuyLedger.field.adjustPer(%)', language)}>
                {getFieldDecorator('adjustPer', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.adjustmentPer : '',
                }
                )(<AntdInput mode="money" disabled={disabled} onChange={(values) => this.getValue(values, 'adjustPer')} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('BuyLedger.field.adjustmentAmount', language)}>
                {getFieldDecorator('adjustAmount', {
                  initialValue: selectDetails ? selectDetails.adjustAmount : '',
                }
                )(<AntdInput mode="money" disabled={disabled} onChange={(values) => this.getValue(values, 'adjustAmount')} />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ChargeDetail.field.actualAmount', language)}>
                {getFieldDecorator('actualAmount', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.actualAmount : '',
                }
                )(<Input disabled={true} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ChargeType.field.currency', language)}>
                {getFieldDecorator('actualAmountCurrency', {
                  initialValue: selectDetails ? selectDetails.actualAmountCurrency : '',
                }
                )(<Input disabled={true} />)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('BuyLedger.field.prePaymentTime', language)}>
                {getFieldDecorator('prePaymentTime', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.prePaymentTime : '',
                }
                )(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('BuyLedger.field.paymentDueDate', language)}>
                {getFieldDecorator('paymentTime', {
                  initialValue: selectDetails && selectDetails.paymentTime ? moment(selectDetails.paymentTime) : '',
                })(
                  <AntdDatePicker disPlaceholder disabled={true} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._row}>
              <Form.Item label={transferLanguage('Common.field.remarks', language)}>
                {getFieldDecorator('remarks', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.remarks : '',
                }
                )(<TextArea rows={4} disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._row}>
              <Form.Item label={transferLanguage('ChargeDetail.field.attachment', language)}>
                {getFieldDecorator('fileToken', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.fileToken : '',
                }
                )(<FileReader disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </div>
    );
  }
}
