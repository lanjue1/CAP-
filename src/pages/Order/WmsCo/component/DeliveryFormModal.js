import React, { Component } from 'react';
import { Col, DatePicker, Form, Input, Row, Select, } from 'antd';
import { connect } from 'dva';
import AdModal from '@/components/AdModal';
import AdSelect from '@/components/AdSelect';
import AntdInput from '@/components/AntdInput';
import styles from '@/pages/Operate.less';
import moment from 'moment';
import { TransportPriorityArr, SelectColumns, BooleanArr } from "../utils";
import SearchSelect from '@/components/SearchSelect';
import { transferLanguage } from '@/utils/utils';

const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;
@connect(({ wmsco, component, i18n }) => ({
	wmsco,
	deliveryDetails: wmsco.deliveryDetails,
	dictObject: component.dictObject,
	language: i18n.language

}))
@Form.create()
export default class DeliveryFormModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			partNo: [],
			originPartNo: [],
			shipPartNo: [],
			_BooleanArr:[],
			detailBeReturn:"",
		}
	}

	componentDidMount() {
		// console.log('=========',this.props)
		if (this.props.detailsId) {
			this.getSelectDetails(this.props.detailsId)
		} else {
			this.props.form.resetFields()
		}
		this.changeTitle(BooleanArr,'_BooleanArr')
	};
	changeTitle = (param, params) => {
        let _columnsAllotOne = []
        _columnsAllotOne = param.map(v => {
            v.value = transferLanguage(v.value, this.props.language)
            return v
        })
        this.setState({
            [params]: _columnsAllotOne
        })
    }
	getValue = (values, type) => {
		const {form}=this.props
		const {originPartNo}=this.props
		this.setState({
			[type]: values,
		});
		if(type=="shipPartNo"){
			console.log('values===',values)
			values.length>0&&this.setState({
				originPartNo:[{code:values[0].code,name:values[0].name}]
			})
		}
	};

	//详情信息：
	getSelectDetails = detailId => {
		this.props.dispatch({
			type: 'wmsco/fetchDeliveryDetails',
			payload: { id: detailId },
			callback: data => {
				this.setState({
					partNo: [{ code: data.partNo }],
					originPartNo: [{ code: data.originPartNo }],
					shipPartNo: [{ code: data.shipPartNo }],
					detailBeReturn:String(data.beReturn)
				}
				)
			}
		});
	};

	saveInfo = () => {
		const { form, dispatch, detail, formValues, modalEmpty, detailId, detailsId } = this.props;
		const {partNo,originPartNo,shipPartNo}=this.state
		form.validateFieldsAndScroll((err, values) => {
			if (err) return;
			const { eta, etd, deliveryDate, warrantyPeriodTime } = values;
			console.log('values', values);
			values.eta =eta? moment(eta).format('YYYY-MM-DD HH:mm:ss'):"";
			values.etd =etd? moment(etd).format('YYYY-MM-DD HH:mm:ss'):'';
			values.warrantyPeriodTime =warrantyPeriodTime? moment(warrantyPeriodTime).format('YYYY-MM-DD HH:mm:ss'):"";
			values.deliveryDate =deliveryDate? moment(deliveryDate).format('YYYY-MM-DD HH:mm:ss'):"";
			values.partNo = partNo[0]?.code;
			values.originPartNo = originPartNo[0]?.code;
			values.shipPartNo = shipPartNo[0]?.code;

			values.coId=detailId?detailId:""
			values.id=detailsId?detailsId:""
			let url;
			if (this.props.detailsId) {
				url = 'wmsco/updateWmsCoDetail';
			} else {
				url = 'wmsco/insertWmsCoDetail';
			}
			dispatch({
				type: url,
				payload: values,
				// payload: { ...values, coId: detailId, id:detailsId },
				callback: () => {
					modalEmpty();
				}
			})
		});
	};


	render() {
		const {
			dictObject,
			detailId,
			detailsId,
			deliveryDetails,
			form: { getFieldDecorator },
			visible,
			disabled,
			modalEmpty,
			cancel,
			mode,
			language
		} = this.props;

		const { partNo,originPartNo,_BooleanArr,shipPartNo,detailBeReturn } = this.state;

		const detail = deliveryDetails[detailsId] || {};
		const commonParams = {
			getFieldDecorator,
		};
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
			<div>
				<AdModal
					visible={visible}
					title={transferLanguage('CoDetailList.field.coDetail',language)}
					onOk={this.saveInfo}
					onCancel={() => {
						cancel();
					}}
					width="80%"
					style={{
						maxWidth: 800,
					}}
				>
					<div className={styles.tableListForm}>
						<Form layout="inline">
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.SOID',language)}>
										{getFieldDecorator('soDetailNo', {
											initialValue: detail ? detail.soDetailNo : '',
											rules: [{ required: true, message: '请输入' }],
										})(
											<Input  disabled={disabled} />
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.pieceQty',language)}>
										{getFieldDecorator('pieceQty', {
											initialValue: detail ? detail.pieceQty : '',
											rules: [{ required: true, message: '请输入', pattern: new RegExp(/^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/) }],
										})(<AntdInput type="number"  disabled={disabled} />)}
									</Form.Item>
								</Col>
								
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.beReturn',language)}>
										{getFieldDecorator('beReturn', {
											initialValue: detailBeReturn||"false",
											rules: [{ required: true, message: '请输入' }],
										})(
											<Select disabled={disabled}>
												{/* <Option value={''} disabled={true}>{transferLanguage('Common.field.select',language)}</Option> */}
												{_BooleanArr.map(v => (<Option value={v.code} key={v.code} > 
													{v.value}
												</Option>))}
											</Select>
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.beSwap',language)}>
										{getFieldDecorator('beSwap', {
											initialValue: detail&& detail.beSwap? detail.beSwap : 'false',  
											rules: [{ required: true, message: '请输入' }],
										})(
											<AdSelect data={_BooleanArr} isExist disabled={disabled}/>
											// <Select disabled={disabled}>
											// 	<Option value={''} disabled={true}>{transferLanguage('Common.field.select',language)}</Option>
											// 	{_BooleanArr.map(v => (<Option value={v.code} key={v.code}>
											// 		{v.value}
											// 	</Option>))}
											// </Select>
										)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
							<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.shipPartNo',language)}>
										{getFieldDecorator('shipPartNo', {
											initialValue: detail && detail.shipPartNo,
											rules: [{ required: true, message: '请输入' }],
										})(
											<SearchSelect
												disabled={disabled}
												dataUrl={'/wms-part/selectWmsPartList'}
												selectedData={shipPartNo} // 选中值
												showValue="code"
												searchName="code"
												multiple={false}
												columns={SelectColumns}
												onChange={values => this.getValue(values, 'shipPartNo')}
												id="shipPartNo"
												allowClear={true}
												scrollX={200}
											/>
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.originPartNo',language)}>
										{getFieldDecorator('originPartNo', {
											initialValue: originPartNo,
											// rules: [{ required: true, message: '请输入' }],
										})(
											// <Input disabled={true} />
											<SearchSelect
												disabled={disabled}
												dataUrl={'/wms-part/selectWmsPartList'}
												selectedData={originPartNo} // 选中值
												showValue="code"
												searchName="keyWord"
												multiple={false}
												columns={SelectColumns}
												onChange={values => this.getValue(values, 'originPartNo')}
												id="originPartNo"
												allowClear={true}
												scrollX={200}
											/>
										)}
									</Form.Item>
								</Col>
								
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.DN',language)}>
										{getFieldDecorator('dn', {
											initialValue: detail ? detail.dn : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input  disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.deliveryDate',language)}>
										{getFieldDecorator('deliveryDate', {
											initialValue: detail.deliveryDate ? moment(detail.deliveryDate) : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<DatePicker placeholder={transferLanguage('Common.field.selectTime',language)} format="YYYY-MM-DD HH:mm:ss" showTime />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
							<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.originPartTopmost',language)}>
										{getFieldDecorator('originPartTopmost', {
											initialValue: detail ? detail.originPartTopmost : '',
											// rules: [{ required: true, message: '请输入' }],
										})(
											<Input  disabled={disabled} />
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.transportPriority',language)}>
										{getFieldDecorator('transportPriority', {
											initialValue: detail ? detail.transportPriority : '',
											// rules: [{ required: true, message: '请输入' }],
										})(
											<Select disabled={disabled}>
												{/* <Option value={''} disabled={true}>请选择</Option> */}
												{TransportPriorityArr.map(v => (<Option value={v.code}>
													{v.value}
												</Option>))}
											</Select>
										)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
							<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.bolNo',language)}>
										{getFieldDecorator('bolNo', {
											initialValue: detail ? detail.bolNo : '',
											// rules: [{ required: true, message: '请输入' }],
										})(
											<Input  disabled={disabled} />
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.shipPartTopmost',language)}>
										{getFieldDecorator('shipPartTopmost', {
											initialValue: detail ? detail.shipPartTopmost : '',
											// rules: [{ required: true, message: '请输入' }],
										})(
											<Input  disabled={disabled} />
										)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.shipPartDesc',language)}>
										{getFieldDecorator('shipPartDesc', {
											initialValue: detail ? detail.shipPartDesc : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input  disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.shipSerialNo',language)}>
										{getFieldDecorator('shipSerialNo', {
											initialValue: detail ? detail.shipSerialNo : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input  disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.shipGoodsValue',language)}>
										{getFieldDecorator('shipGoodsValue', {
											initialValue: detail ? detail.shipGoodsValue : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input  disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.warrantyPeriodTime',language)}>
										{getFieldDecorator('warrantyPeriodTime', {
											initialValue: detail.warrantyPeriodTime ? moment(detail.warrantyPeriodTime) : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<DatePicker placeholder={transferLanguage('Common.field.selectTime',language)} format="YYYY-MM-DD HH:mm:ss" showTime />)}
									</Form.Item>
								</Col>
							</Row>

							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.shipCc',language)}>
										{getFieldDecorator('shipCc', {
											initialValue: detail ? detail.shipCc : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input  disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.packageType',language)}>
										{getFieldDecorator('packageType', {
											initialValue: detail ? detail.packageType : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input  disabled={disabled} />)}
									</Form.Item>
								</Col>

							</Row>

							<Row gutter={_gutter}>

								
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.forwarder',language)}>
										{getFieldDecorator('forwarder', {
											initialValue: detail ? detail.forwarder : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input  disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.totalGrossWeight',language)}>
										{getFieldDecorator('totalGrossWeight', {
											initialValue: detail ? detail.totalGrossWeight : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<AntdInput type="number"  disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.totalNetWeight',language)}>
										{getFieldDecorator('totalNetWeight', {
											initialValue: detail ? detail.totalNetWeight : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<AntdInput type="number"  disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.totalVolume',language)}>
										{getFieldDecorator('totalVolume', {
											initialValue: detail ? detail.totalVolume : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<AntdInput type="number"  disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.unitPrice',language)}>
										{getFieldDecorator('unitPrice', {
											initialValue: detail ? detail.unitPrice : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<AntdInput mode="money"  disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>

							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.eta',language)}>
										{getFieldDecorator('eta', {
											// rules: [{ required: true, message: '请输入' }],
											initialValue: detail.etd ? moment(detail.etd) : '',
										})(<DatePicker placeholder={transferLanguage('Common.field.selectTime',language)} format="YYYY-MM-DD HH:mm:ss" showTime />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.etd',language)}>
										{getFieldDecorator('etd', {
											// rules: [{ required: true, message: '请输入' }],
											initialValue: detail.etd ? moment(detail.etd) : '',
										})(<DatePicker  placeholder={transferLanguage('Common.field.selectTime',language)}
										format="YYYY-MM-DD HH:mm:ss" showTime />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._row}>
									<Form.Item label={transferLanguage('CoDetailList.field.remarks',language)}>
										{getFieldDecorator('remarks', {
											initialValue: detail ? detail.remarks : '',
										})(<TextArea  disabled={disabled} rows={4} />)}
									</Form.Item>
								</Col>
								
							</Row>
						</Form>
					</div>
				</AdModal>
			</div>
		);
	}
}
