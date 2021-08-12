import React, { Component } from 'react';
import { Col, DatePicker, Form, Input, Row, Select, } from 'antd';
import { connect } from 'dva';
import AdModal from '@/components/AdModal';
import AntdInput from '@/components/AntdInput';
import styles from '@/pages/Operate.less';
import {
	formItemFragement,
	queryDict,
	filterAddFile,
	filterDeteteFile,
	formatPrice,
} from '@/utils/common';
import FileReader from '@/components/FileReader';
import { transferLanguage } from '@/utils/utils';
import AntdFormItem from '@/components/AntdFormItem';

const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
@connect(({ trackOrder, component, i18n }) => ({
	trackOrder,
	deliveryDetails: trackOrder.deliveryDetails,
	dictObject: component.dictObject,
	language: i18n.language

}))
@Form.create()
export default class TrackFormModal extends Component {
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
			type: 'trackOrder/fetchTrackDetails',
			payload: { id: detailId },
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
		const { form, dispatch, deliveryDetails, formValues, modalEmpty, detailId, detailsId } = this.props;
		form.validateFieldsAndScroll((err, values) => {
			if (err) return;
			const { attaQuantity, ...params } = values
			params.orderId = this.props.detailId
			if (attaQuantity) {
				params.fileTokens = filterAddFile(attaQuantity);
			}
			if (detailsId) {
				params.id = detailsId;
				if (attaQuantity) {
					params.deleteFileIds = filterDeteteFile(attaQuantity, deliveryDetails[detailsId].fileList);
				}
			}
			let url;
			if (this.props.detailsId) {
				url = 'trackOrder/updateTrackOrder';
			} else {
				url = 'trackOrder/insertTrackOrder';
			}
			dispatch({
				type: url,
				payload: params,
				callback: () => {
					modalEmpty();
				}
			})
		});
	};


	render() {
		const {
			detailsId,
			deliveryDetails,
			form: { getFieldDecorator },
			visible,
			disabled,
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
					title={transferLanguage(detailsId?'TrackList.field.addTrack':'TrackList.field.editTrack', language)}
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
									<Form.Item label={transferLanguage('TrackList.field.eventCode', language)}>
										{getFieldDecorator('eventCode', {
											initialValue: detail ? detail.eventCode : '',
											// rules: [{ required: true, message: '请输入' }],
										})(
											<Input disabled={disabled} />
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('TrackList.field.eventDesc', language)}>
										{getFieldDecorator('eventDesc', {
											initialValue: detail ? detail.eventDesc : '',
											// rules: [{ required: true, message: '请输入' }],
										})(
											<Input disabled={disabled} />
										)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('TrackList.field.eventSource', language)}>
										{getFieldDecorator('eventSource', {
											initialValue: detail && detail.eventSource,
											rules: [{ required: true, message: '请输入' }],
										})(
											<Input disabled={disabled} />
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('TrackList.field.handoverPerson', language)}>
										{getFieldDecorator('handoverPerson', {
											initialValue: detail ? detail.handoverPerson : '',
											// rules: [{ required: true, message: '请输入' }],
										})(
											<Input disabled={true} />
										)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('TrackList.field.nextPositionLatitude', language)}>
										{getFieldDecorator('nextPositionLatitude', {
											initialValue: detail ? detail.nextPositionLatitude : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('TrackList.field.nextPositionLongitude', language)}>
										{getFieldDecorator('nextPositionLongitude', {
											initialValue: detail ? detail.nextPositionLongitude : '',
											// rules: [{required: true, message: '请输入' }],
										})(<Input disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('TrackList.field.nextPostion', language)}>
										{getFieldDecorator('nextPostion', {
											initialValue: detail ? detail.nextPostion : '',
											// rules: [{ required: true, message: '请输入' }],
										})(
											<Input disabled={disabled} />
										)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('TrackList.field.position', language)}>
										{getFieldDecorator('position', {
											initialValue: detail ? detail.position : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('TrackList.field.positionLatitude', language)}>
										{getFieldDecorator('positionLatitude', {
											initialValue: detail ? detail.positionLatitude : '',
											rules: [{ required: true, message: '请输入', }],
										})(<AntdInput disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('TrackList.field.positionLongitude', language)}>
										{getFieldDecorator('positionLongitude', {
											initialValue: detail ? detail.positionLongitude : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<Input disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('TrackList.field.sourceCarNumber', language)}>
										{getFieldDecorator('sourceCarNumber', {
											initialValue: detail ? detail.sourceCarNumber : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<AntdInput disabled={disabled} />)}
									</Form.Item>
								</Col>
								<Col {..._col}>
									<Form.Item label={transferLanguage('TrackList.field.sourceCode', language)}>
										{getFieldDecorator('sourceCode', {
											initialValue: detail ? detail.sourceCode : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<AntdInput disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._col}>
									<Form.Item label={transferLanguage('TrackList.field.trackingBizId', language)}>
										{getFieldDecorator('trackingBizId', {
											initialValue: detail ? detail.totalVolume : '',
											// rules: [{ required: true, message: '请输入' }],
										})(<AntdInput type="number" disabled={disabled} />)}
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={_gutter}>
								<Col {..._row}>
									<AntdFormItem
										label={transferLanguage('common.field.accessory', language)}
										code="attaQuantity"
										initialValue={detail.fileList || []}
										{...commonParams}
									>
										<FileReader disabled={disabled} />
									</AntdFormItem>
								</Col>
							</Row>
						</Form>
					</div>
				</AdModal>
			</div>
		);
	}
}
