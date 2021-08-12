import React, { Component } from 'react';
import { Col, DatePicker, Form, Input, Row, Select, } from 'antd';
import { connect } from 'dva';
import AdModal from '@/components/AdModal';
import SearchSelect from '@/components/SearchSelect';
import { allDictList } from '@/utils/constans';
import { columnsDriver } from '@/pages/Common/common';
import { formItemFragement, queryDict, formatPrice } from '@/utils/common';
import { transferLanguage } from '@/utils/utils';
import { ReceivedPackageUnit, columns1 } from '../utils'
import styles from '@/pages/Operate.less';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;
@connect(({ asn, component, i18n }) => ({
	asn,
	deliveryDetails: asn.deliveryDetails,
	dictObject: component.dictObject,
	language: i18n.language
}))
@Form.create()
export default class DeliveryFormModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drivers: [],
			driverType: 'HW01',
			unit: 'check',
			worker: [{loginName:'',sysName:'',id:''}],
			bin:[],
		};
	}

	componentDidMount() {
		this.getSelectDetails(this.props.detailId)
		let userName=JSON.parse(localStorage.getItem('user'))
		console.log('userName??',userName)
		this.setState({
			worker:[{loginName:userName.loginName,sysName:userName.sysName,id:userName.id}]

		})

	};

	//详情信息：
	getSelectDetails = id => {
		this.props.dispatch({
			type: 'asn/fetchDeliveryDetails',
			payload: { id },
		});
	};

	getValue = (values, type) => {
		this.setState({
			[type]: values,
		});
	};

	saveInfo = () => {
		const { form, dispatch, detail, formValues, modalEmpty, detailId, deliveryDetails } = this.props;
		form.validateFieldsAndScroll((err, values) => {
			if (err) return;
			const {worker} = this.state
			const { packageUnitQty, receivedQty, bin,workerId, remarks } = values;
			let param = [{
				packageUnitQty, receivedQty, remarks,
				binId:bin[0]?.id,
				workerId:workerId[0]?workerId[0].id:worker[0].id,
				asnId: deliveryDetails[detailId]['asnId'],
				id: deliveryDetails[detailId]['id'],
				workerId: this.state.worker[0].id,
			}]
			console.log('param===========',param)
			dispatch({
				type: 'asn/receiveWmsAsnDetails',
				payload: param,
				callback: () => {
					modalEmpty();
				}
			})
		});
	};


	render() {
		const { drivers, driverType, worker,bin } = this.state;
		const {
			dictObject,
			detailId,
			deliveryDetails,
			form: { getFieldDecorator },
			visible,
			disabled,
			modalEmpty,
			mode,
			language,
			warehouseId
		} = this.props;
		const detail = deliveryDetails[detailId] || {};
		const commonParams = {
			getFieldDecorator,
		};
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
			<div>
				<AdModal
					visible={visible}
					title={transferLanguage('ASNDetail.button.receive', language)}
					onOk={this.saveInfo}
					onCancel={() => {
						modalEmpty();
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
									<Form.Item label={transferLanguage('ASNDetail.field.soNo', language)}>
										{getFieldDecorator('soNo', {
											initialValue: detail ? detail.soNo : '',
										})(
											<Input  disabled={true} />
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASNDetail.field.prNo', language)}>
										{getFieldDecorator('prNo', {
											initialValue: detail ? detail.prNo : '',
										})(
											<Input  disabled={true} />
										)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASNDetail.field.poNo', language)}>
										{getFieldDecorator('poNo', {
											initialValue: detail && detail.poNo,
										})(
											<Input  disabled={true} />
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASNDetail.field.partNo', language)}>
										{getFieldDecorator('partNo', {
											initialValue: detail ? detail.partNo : '',
										})(
											<Input  disabled={true} />
										)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASNDetail.field.partDesc', language)}>
										{getFieldDecorator('partDesc', {
											initialValue: detail ? detail.partDesc : '',
										})(<Input  disabled={true} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('planPieceQty',language)}>
										{getFieldDecorator('planPieceQty', {
											initialValue: detail ? detail.planPieceQty : '',
										})(<Input  disabled={true} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASN.field.openQTY', language)}>
										{getFieldDecorator('openPieceQty', {
											initialValue: detail ? detail.openQTY : '',
										})(<Input  disabled={true} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASN.field.arrivedPieceQty', language)}>
										{getFieldDecorator('arrivedPieceQty', {
											initialValue: detail ? detail.arrivedPieceQty : '',
										})(<Input  disabled={true} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('Delivery.field.lotCartonNo', language)}>
										{getFieldDecorator('lotCartonNo', {
											initialValue: detail ? detail.lotCartonNo : '',
										})(<Input  disabled={true} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASNDetail.field.transportPriority', language)}>
										{getFieldDecorator('transportPriority', {
											initialValue: detail ? detail.transportPriority : '',
										})(<Input  disabled={true} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASN.field.bolNo', language)}>
										{getFieldDecorator('bolNo', {
											initialValue: detail ? detail.bolNo : '',
										})(<Input  disabled={true} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASN.field.forwarder', language)}>
										{getFieldDecorator('forwarder', {
											initialValue: detail ? detail.forwarder : '',
										})(<Input  disabled={true} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASNDetail.field.coo', language)}>
										{getFieldDecorator('lotCoo', {
											initialValue: detail ? detail.lotCoo : '',
										})(<Input  disabled={true} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASNDetail.field.dn', language)}>
										{getFieldDecorator('lotDn', {
											initialValue: detail ? detail.dn : '',
										})(<Input  disabled={true} />)}
									</Form.Item>
								</Col>
							</Row>
							{/* <Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASN.field.deliveryText', language)}>
										{getFieldDecorator('deliveryText', {
											initialValue: detail ? detail.deliveryText : '',
										})(<Input  disabled={true} />)}
									</Form.Item>
								</Col>
								
							</Row> */}
							<Row gutter={_gutter}>
								{/* <Col {..._col}>
									<Form.Item label="收货包装单位">
										{getFieldDecorator('receivedPackageUnit', {
											rules: [{ required: true, message: '请输入' }],
											initialValue: 'check',
										})(<Select onChange={(value) => { this.setState({ unit: value }) }} disabled={disabled}>
											{ReceivedPackageUnit.map(v => {
												return <Option value={v.code}>{v.value}</Option>;
											})}
										</Select>)}
									</Form.Item>
								</Col> */}
								
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASNDetail.field.packageUnitQty',language)}>
										{getFieldDecorator('packageUnitQty', {
											rules: [{ required: true, message: '请输入' }],
											initialValue: 1,
										})(<Input type='number'  disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASNDetail.field.receivedQty',language)}>
										{getFieldDecorator('receivedQty', {
											rules: [{ required: true, message: '请输入' }],
											initialValue: 0,
										})(<Input type='number'  disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('PUTAWAYMODAL.field.bin',language)}>
										{getFieldDecorator('bin', {
											// rules: [{ required: true, message: '请输入' }],
											initialValue: 0,
										})(
											<SearchSelect
											dataUrl="wms-warehouse-bin/selectWmsWarehouseBinList"
											selectedData={bin} // 选中值
											multiple={false} // 是否多选
											showValue="code"
											searchName="code"
											columns={[{title:'code',dataIndex:'code'}]} // 表格展示列
											onChange={e => this.getValue(e, 'bin')} // 获取选中值
											scrollX={160}
											id="ArchivesList_1"
											allowClear={true}
											payload={{ binTypeArr: ['RECEIVE','STORAGE'],warehouseId:warehouseId }} //
											disabled={disabled}
										/>
										
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('ASNRecord.field.workerName',language)}>
										{getFieldDecorator('workerId', {
											rules: [{ required: true, message: '请输入' }],
											initialValue: worker,
										})(<SearchSelect
											dataUrl="mds-user/selectOperatorUserList"
											selectedData={worker} // 选中值
											multiple={false} // 是否多选
											showValue="sysName"
											searchName="keyWord"
											columns={columns1} // 表格展示列
											onChange={e => this.getValue(e, 'worker')} // 获取选中值
											scrollX={160}
											id="ArchivesList_1"
											allowClear={true}
											// payload={{ categoryList: ['HEADSTOCK', 'CARLOAD'] }} //筛选为整车和车头的
											disabled={disabled}
										/>)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._row}>
									<Form.Item label={transferLanguage('Common.field.remarks',language)}>
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
