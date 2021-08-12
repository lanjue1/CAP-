import React, { Component } from 'react';
import { Col, DatePicker, Form, Input, Row, Select, } from 'antd';
import { connect } from 'dva';
import AdModal from '@/components/AdModal';
import AntdInput from '@/components/AntdInput';
import styles from '@/pages/Operate.less';
import moment from 'moment';
import { TransportPriorityArr, SelectColumns, SelectColumnsType } from "../utils";
import SearchSelect from '@/components/SearchSelect';
import { transferLanguage } from '@/utils/utils';

const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;
@connect(({ wmspo, component, i18n }) => ({
	wmspo,
	deliveryDetails: wmspo.deliveryDetails,
	dictObject: component.dictObject,
	language: i18n.language

}))
@Form.create()
export default class DeliveryFormModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			partNo: []
		}
	}

	componentDidMount() {
		if (this.props.detailsId) {
			this.getSelectDetails(this.props.detailsId)
		} else {
			this.props.form.resetFields()
		}
	};

	//详情信息：
	getSelectDetails = detailId => {
		this.props.dispatch({
			type: 'wmspo/fetchDeliveryDetails',
			payload: { id: detailId },
			callback: data => {
				this.setState({
					partNo: [{ code: data.partNo, name: data.partNoName }],
				}
				)
			}
		});
	};

	getValue = (values, type) => {
		const { form } = this.props
		this.setState({
			[type]: values,
		});
		if (type == "partNo") {
			form.setFieldsValue({
				partDesc: values[0]?.name
			})
		}
	};

	saveInfo = () => {
		const { form, dispatch, detail, formValues, modalEmpty, detailId, detailsId } = this.props;
		form.validateFieldsAndScroll((err, values) => {
			if (err) return;
			const { eta, etd, deliveryDate } = values;
			// let param = [{
			//   receivedPackageUnit, packageUnitQty, receivedQty, remarks,
			//   asnId: deliveryDetails[detailId]['asnId'],
			//   id: deliveryDetails[detailId]['id'],
			// }]
			values.eta = eta ? moment(eta).format('YYYY-MM-DD HH:mm:ss') : ""
			values.etd = etd ? moment(etd).format('YYYY-MM-DD HH:mm:ss') : ""
			values.deliveryDate = deliveryDate ? moment(deliveryDate).format('YYYY-MM-DD HH:mm:ss') : ""
			values.partNo = this.state.partNo[0]?.code
			let url;
			if (this.props.detailsId) {
				url = 'wmspo/updateWmsPoDetail';
			} else {
				url = 'wmspo/insertWmsPoDetail';
			}
			dispatch({
				type: url,
				payload: { ...values, poId: detailId, id: this.props.detailsId },
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
			mode,
			language,
			cancel,
		} = this.props;
		const { partNo } = this.state
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
					title={transferLanguage('PoDetailList.field.poDetail', language)}
					onOk={this.saveInfo}
					onCancel={() => {
						// modalEmpty();
						cancel()
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
									<Form.Item label={transferLanguage('PoDetailList.field.prNo', language)}>
										{getFieldDecorator('prNo', {
											initialValue: detail ? detail.prNo : '',
											rules: [{ required: true, message: '请输入' }],
										})(
											<Input disabled={disabled} />
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.bolNo', language)}>
										{getFieldDecorator('bolNo', {
											initialValue: detail ? detail.bolNo : '',
											// rules: [{ required: true, message: '请输入' }],
										})(
											<Input disabled={disabled} />
										)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.partNo', language)}>
										{getFieldDecorator('partNo', {
											initialValue: detail && detail.partNo,
											rules: [{ required: true, message: '请输入' }],
										})(
											<SearchSelect
												disabled={disabled}
												dataUrl={'/wms-part/selectWmsPartList'}
												selectedData={partNo} // 选中值
												showValue="code"
												searchName="code"
												multiple={false}
												columns={SelectColumnsType}
												onChange={values => this.getValue(values, 'partNo')}
												id="partNo"
												allowClear={true}
												scrollX={200}
											/>
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.partDesc', language)}>
										{getFieldDecorator('partDesc', {
											initialValue: detail ? detail.partDesc : '',
											// rules: [{ required: true, message: '请输入' }],
										})(
											<Input disabled={true} />
										)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.pieceQty', language)}>
										{getFieldDecorator('pieceQty', {
											initialValue: detail ? detail.pieceQty : '',
											rules: [{ required: true, message: '请输入', pattern: new RegExp(/^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/), }],
										})(<AntdInput type="number" disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.unitPrice', language)}>
										{getFieldDecorator('unitPrice', {
											initialValue: detail ? detail.unitPrice : '',
											rules: [{ required: true, message: '请输入' }],
										})(<AntdInput mode="money" disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.dn', language)}>
										{getFieldDecorator('dn', {
											initialValue: detail ? detail.dn : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.deliveryDate', language)}>
										{getFieldDecorator('deliveryDate', {
											initialValue: detail && detail.deliveryDate ? moment(detail.deliveryDate) : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime placeholder={transferLanguage('Common.field.selectDate', language)} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.transportPriority', language)}>
										{getFieldDecorator('transportPriority', {
											initialValue: detail ? detail.transportPriority : '',
											// rules: [{ required: true, message: '请输入' }],
										})(
											<Select disabled={disabled} placeholder={transferLanguage('Common.field.select', language)} >
												{/* <Option value={''} disabled={true}>{transferLanguage('Common.field.select', language)}</Option> */}
												{TransportPriorityArr.map(v => (<Option value={v.code}>
													{v.value}
												</Option>))}
											</Select>
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.packageType', language)}>
										{getFieldDecorator('packageType', {
											initialValue: detail ? detail.packageType : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.volume', language)}>
										{getFieldDecorator('totalVolume', {
											initialValue: detail ? detail.totalVolume : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<AntdInput type="number" disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.forwarder', language)}>
										{getFieldDecorator('forwarder', {
											initialValue: detail ? detail.forwarder : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.grossWeight', language)}>
										{getFieldDecorator('totalGrossWeight', {
											initialValue: detail ? detail.totalGrossWeight : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<AntdInput type="number" disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.netWeight', language)}>
										{getFieldDecorator('totalNetWeight', {
											initialValue: detail ? detail.totalNetWeight : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<AntdInput type="number" disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>

							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.shipFromCode', language)}>
										{getFieldDecorator('shipFromCode', {
											// rules: [{ required: true, message: '请输入' }],
											initialValue: detail ? detail.soldToCode : '',
										})(<Input disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.shipToCode', language)}>
										{getFieldDecorator('shipToCode', {
											// rules: [{ required: true, message: '请输入' }],
											initialValue: detail ? detail.shipToCode : '',
										})(<Input disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.eta', language)}>
										{getFieldDecorator('eta', {
											// rules: [{ required: true, message: '请输入' }],
											initialValue: detail && detail.etd ? moment(detail.etd) : '',
										})(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime placeholder={transferLanguage('Common.field.selectDate', language)} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PoDetailList.field.etd', language)}>
										{getFieldDecorator('etd', {
											// rules: [{ required: true, message: '请输入' }],
											initialValue: detail && detail.etd ? moment(detail.etd) : '',
										})(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime placeholder={transferLanguage('Common.field.selectDate', language)}
										// locale={{lang:'en-US'}}
										// timePickerLocale={"timeNow"}
										/>)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._row}>
									<Form.Item label={transferLanguage('PoDetailList.field.remarks', language)}>
										{getFieldDecorator('remarks', {
											initialValue: detail ? detail.remarks : '',
										})(<TextArea disabled={disabled} rows={4} />)}
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
