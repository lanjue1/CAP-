import React, { Component } from 'react';
import { Col, DatePicker, Form, Input, Row, Select, } from 'antd';
import { connect } from 'dva';
import AdModal from '@/components/AdModal';
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
@connect(({ sto, component, i18n }) => ({
	sto,
	deliveryDetails: sto.deliveryDetails,
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
			_BooleanArr: [],
			detailBeReturn: "",
		}
	}

	componentDidMount() {
		// console.log('=========',this.props)
		if (this.props.detailsId) {
			this.getSelectDetails(this.props.detailsId)
		} else {
			this.props.form.resetFields()
		}
		this.changeTitle(BooleanArr, '_BooleanArr')
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
		const { form } = this.props
		const { originPartNo } = this.props
		this.setState({
			[type]: values,
		});
		if (type == "shipPartNo") {
			this.setState({
				originPartNo: [{ code: values[0].code, name: values[0].name }]
			})
			// form.setFieldsValue({
			// 	originPartNo:[{code:values[0].code,name:values[0].name}]
			// })
			if(type=="shipPartNo"){
				form.setFieldsValue({
					shipPartDesc:values[0]?.name
				})
			}
		}
	};

	//详情信息：
	getSelectDetails = detailId => {
		this.props.dispatch({
			type: 'sto/fetchDeliveryDetails',
			payload: { id: detailId },
			callback: data => {
				this.setState({
					partNo: [{ code: data.partNo }],
					originPartNo: [{ code: data.originPartNo }],
					shipPartNo: [{ code: data.shipPartNo }],
					detailBeReturn: String(data.beReturn)
				}
				)
			}
		});
	};

	saveInfo = () => {
		const { form, dispatch, detail, formValues, modalEmpty, detailId, detailsId } = this.props;
		const { partNo, originPartNo, shipPartNo } = this.state
		form.validateFieldsAndScroll((err, values) => {
			if (err) return;
			const { eta, etd, deliveryDate, warrantyPeriodTime } = values;
			// let param = [{
			//   receivedPackageUnit, packageUnitQty, receivedQty, remarks,
			//   asnId: deliveryDetails[detailId]['asnId'],
			//   id: deliveryDetails[detailId]['id'],
			// }]
			console.log('values', values);
			values.eta = eta ? moment(eta).format('YYYY-MM-DD HH:mm:ss') : "";
			values.etd = etd ? moment(etd).format('YYYY-MM-DD HH:mm:ss') : '';
			values.warrantyPeriodTime = warrantyPeriodTime ? moment(warrantyPeriodTime).format('YYYY-MM-DD HH:mm:ss') : "";
			values.deliveryDate = deliveryDate ? moment(deliveryDate).format('YYYY-MM-DD HH:mm:ss') : "";
			values.partNo = partNo[0]?.code;
			values.originPartNo = originPartNo[0]?.code;
			values.shipPartNo = shipPartNo[0]?.code;

			values.coId = detailId ? detailId : ""
			values.id = detailsId ? detailsId : ""
			let url;
			if (this.props.detailsId) {
				url = 'sto/updateWmsCoDetail';
			} else {
				url = 'sto/insertWmsCoDetail';
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

		const { partNo, originPartNo, _BooleanArr, shipPartNo, detailBeReturn } = this.state;

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
					title={transferLanguage('STODetailList.field.stoDetail', language)}
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
									<Form.Item label={transferLanguage('CoDetailList.field.stoId', language)}>
										{getFieldDecorator('soDetailNo', {
											initialValue: detail ? detail.soDetailNo : '',
											rules: [{ required: true, message: '请输入' }],
										})(
											<Input disabled={disabled} />
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.shipPartNo', language)}>
										{getFieldDecorator('shipPartNo', {
											initialValue: detail && detail.shipPartNo,
											rules: [{ required: true, message: '请输入' }],
										})(
											<SearchSelect
												disabled={disabled}
												dataUrl={'/wms-part/selectWmsPartList'}
												selectedData={shipPartNo} // 选中值
												showValue="code"
												searchName="keyWord"
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
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.shipPartDesc', language)}>
										{getFieldDecorator('shipPartDesc', {
											initialValue: detail ? detail.shipPartDesc : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.transportPriority', language)}>
										{getFieldDecorator('transportPriority', {
											initialValue: detail ? detail.transportPriority : '',
											rules: [{ required: true, message: '请输入' }],
										})(
											<Select disabled={disabled}>
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
									<Form.Item label={transferLanguage('CoDetailList.field.shipCc', language)}>
										{getFieldDecorator('shipCc', {
											initialValue: detail ? detail.shipCc : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.pieceQty', language)}>
										{getFieldDecorator('pieceQty', {
											initialValue: detail ? detail.pieceQty : '',
											rules: [{ required: true, message: '请输入', pattern: new RegExp(/^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/) }],
										})(<AntdInput type="number" disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.totalGrossWeight', language)}>
										{getFieldDecorator('totalGrossWeight', {
											initialValue: detail ? detail.totalGrossWeight : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<AntdInput type="number" disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.totalNetWeight', language)}>
										{getFieldDecorator('totalNetWeight', {
											initialValue: detail ? detail.totalNetWeight : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<AntdInput type="number" disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('CoDetailList.field.totalVolume', language)}>
										{getFieldDecorator('totalVolume', {
											initialValue: detail ? detail.totalVolume : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<AntdInput type="number" disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._row}>
									<Form.Item label={transferLanguage('CoDetailList.field.remarks', language)}>
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
