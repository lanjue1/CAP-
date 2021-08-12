import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment, { lang } from 'moment';
import router from 'umi/router';
import SearchSelect from '@/components/SearchSelect';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Space } from 'antd';
import StandardTable from '@/components/StandardTable';;
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, Status, formatStatus, Type, Putaway, columnCargoOwner, columnShipTo } from './utils';
import AdSelect from '@/components/AdSelect';
import { transferLanguage } from '@/utils/utils';
import AdButton from '@/components/AdButton';
import {allDictList} from '@/utils/common'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@ManageList
@connect(({ shipping, common, component, loading, i18n }) => ({
	shipping,
	loading: loading.effects['shipping/shippingList'],
	dictObject: common.dictObject,
	searchValue: component.searchValue,
	language: i18n.language
}))
@Form.create()
export default class ShipingList extends Component {
	state = {
		expandForm: false,
		selectedRows: [],
		checkId: '',
		checkIds: [],
		formValues: {},
		isAbled: '',
		cargoOwner: [],
		shipToWmCode: [],
		_SelectColumns: [],
		_columnShipTo: [],
		_columnCargoOwner: [],
		fromCountryId: [],
		shipFromWmCode: [],
		bizType: [],
		shipToCountry: [],
	};
	className = 'shipping';

	componentDidMount() {
		this.getShipingList();
		this.changeTitle(columnCargoOwner, '_columnCargoOwner')
		this.changeTitle(columnShipTo, '_SelectColumns')
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
	getShipingList = (params = {}) => {
		const { dispatch, searchValue } = this.props;
		dispatch({
			type: 'shipping/shippingList',
			payload: params,
			callback: data => {
				if (!data) return;
				let valueList = [];
				data.map(v => {
					const labels = ['senderId'];
					labels.map(item => {
						if (v[item] && !valueList.includes(v[item])) {
							valueList.push(v[item]);
							!searchValue[v[item]] &&
								dispatch({
									type: 'component/querySearchValue',
									payload: {
										params: { id: v[item] },
										url: 'sms/sms-sender/viewSmsSenderDetails',
									},
								});
						}
					});
				});
			},
		});
	};

	toggleForm = () => {
		const { expandForm } = this.state;
		this.setState({
			expandForm: !expandForm,
		});
	};

	handleSelectRows = rows => {
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


	//重置
	handleFormReset = () => {
		const { form, dispatch } = this.props;
		form.resetFields();
		this.setState({
			formValues: {},
			cargoOwner: [],
			shipToWmCode: [],
			bizType:[],
			shipToCountry:[]
		});
		this.getShipingList();
	};

	//查询
	handleSearch = values => {
		const { shipToWmCode, bizType, shipToCountry } = this.state
		const { date, bizDate, soreleasedate, shipFromWmCode, ...value } = values;
	
		// if (shipToWmCode && shipToWmCode.length > 0) value.shipToWmCode = shipToWmCode[0].code;
		if (shipFromWmCode && shipFromWmCode.length > 0) value.shipFromWmId = shipFromWmCode[0].id;
		if (shipToCountry && shipToCountry.length > 0) value.altshiptocountry = shipToCountry[0].code;
		if (bizType && bizType.length > 0) value.bizTypeId = bizType[0].id;
		if (bizDate && bizDate.length > 0) {
			value.bizDateStart = moment(bizDate[0]).format('YYYY-MM-DD');
			value.bizDateEnd = moment(bizDate[1]).format('YYYY-MM-DD');
			value.bizDateStart +=' 00:00:00'
			value.bizDateEnd +=' 23:59:59'
		} else {
			value.bizDateStart = ""
			value.bizDateEnd = ""
		}
		if (soreleasedate && soreleasedate.length > 0) {
			value.soreleasedateStart = moment(soreleasedate[0]).format('YYYY-MM-DD');
			value.soreleasedateEnd = moment(soreleasedate[1]).format('YYYY-MM-DD');
			value.soreleasedateStart +=' 00:00:00'
			value.soreleasedateEnd +=' 23:59:59'
		} else {
			value.soreleasedateStart = ""
			value.soreleasedateEnd = ""
		}
		if(value.altshiptocountry==''){delete value.altshiptocountry}
		this.setState({
			formValues: value,
		});
		this.getShipingList(value);
	};

	// 分页操作：改参数
	handleStandardTableChange = param => {
		const { dispatch } = this.props;
		const { formValues } = this.state;
		const params = {
			...formValues,
			...param,
		};
		this.getShipingList(params);
	};

	//详情：
	handleEdit = (e, record) => {
		e.stopPropagation();
		const { dispatch } = this.props;
		const { id } = record;
		// console.log('senderId', record.senderId);

		dispatch({
			type: 'shipping/shippingDetails',
			payload: { id },
			callback: res => {
				this.setState({
					isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
				});
			},
		});
		router.push(`/outbound/OBNotice/detailsOBNotice/${id}`);
	};

	//启用、禁用：
	abledStatus = (type, isSingle) => {
		const { dispatch } = this.props;
		const { checkIds, checkId, formValues } = this.state;
		let params = {};
		params.ids = isSingle ? [checkId] : checkIds;
		params.type = type === 'confirm' ? true : false
		dispatch({
			type: 'shipping/ableOperate',
			payload: params,
			callback: res => {
				this.getShipingList(formValues);
			},
		});
	};

	//生成上架单
	putaway = (type) => {
		const { dispatch } = this.props;
		const { checkIds, formValues } = this.state;
		if (type) {
			dispatch({
				type: 'shipping/createDelivery',
				payload: { ids: checkIds },
				callback: res => {
					this.getShipingList(formValues);
				},
			})
		} else {
			dispatch({
				type: 'shipping/generateWmsMoveDoc',
				payload: { ids: checkIds },
				callback: res => {
					this.getShipingList(formValues);
				},
			});
		}

	}

	createReceipt = () => {
		const { checkIds } = this.state
		this.props.dispatch({
			type: 'shipping/createReceipt',
			payload: { ids: checkIds },
			callback: res => {
				this.getShipingList(formValues);
			},
		});
	}
	getValue = (values, type) => {

		this.setState({
			[type]: values,
		});
	}

	render() {
		const {
			loading,
			shipping: { shippingList, shippingDetails },
			form,
			language,
			shipToWmCode,
		} = this.props;
		const { getFieldDecorator } = form;
		const {
			selectedRows,
			checkId,
			visible,
			rowDetails,
			expandForm,
			cargoOwner,
			_SelectColumns,
			_columnShipTo,
			fromCountryId,
			shipFromWmCode,
			bizType,
			shipToCountry,
		} = this.state;
		const selectDetails = shippingDetails[checkId];
		//列表 列
		const columns = [{
			title: '#',
			dataIndex: 'index',
			render: (text, record, index) => (<span>{index + 1}</span>),
			width: 50
		},
		{
			//标题
			title: transferLanguage('shipping.field.shippingNo', language),
			//数据字段
			dataIndex: 'outboundNoticeNo',
			render: (text, record) => (
				<a onClick={e => this.handleEdit(e, record)} title={text}>
					{text}
				</a>
			),
			width: 150,
		},
		{
			title: transferLanguage('shipping.field.status', language),
			dataIndex: 'status',
			// render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('shipping.field.bizType', language),
			dataIndex: 'orderType',
			// render: text => <AdSelect data={Type} value={text} onlyRead={true} />,
			width: 200,
		},
		{
			title: transferLanguage('shipping.field.coNo', language),
			dataIndex: 'coNo',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.soNo', language),
			dataIndex: 'soNo',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('shipping.field.planPieceQty', language),
			dataIndex: 'planPieceQty',
		},
		{
			title: transferLanguage('shipping.field.moveNo', language),
			dataIndex: 'moveNo',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('shipping.field.pickingStatus', language),
			dataIndex: 'moveStatus',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('shipping.field.deliveryNo', language),
			dataIndex: 'deliveryNo',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('shipping.field.deliveryStatus', language),
			dataIndex: 'deliveryStatus',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('shipping.field.soType', language),
			dataIndex: 'serviceordertype',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.soPriority', language),
			dataIndex: 'soprioritycode',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.sodType', language),
			dataIndex: 'sodeliverytype',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.serviceLevel', language),
			dataIndex: 'servicelevel',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.shipFrom', language),
			dataIndex: 'shipFromWmCode',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.fromCountry', language),
			dataIndex: 'shipFromCountry',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.customer', language),
			dataIndex: 'sellername',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.shipTo', language),
			dataIndex: 'altshiptoname',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.shipToCountry', language),
			dataIndex: 'altshiptocountry',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.shipToState', language),
			dataIndex: 'altshiptostate',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.shipToCity', language),
			dataIndex: 'altshiptocity',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.shipToZip', language),
			dataIndex: 'altshiptopostcode',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.ordrDate', language),
			dataIndex: 'bizDate',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('shipping.field.soDate', language),
			dataIndex: 'soreleasedate',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},


		{
			title: transferLanguage('shipping.field.forwarder', language),
			dataIndex: 'forwarder',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('shipping.field.estimatedDeliveryTime', language),
			dataIndex: 'estimatedDeliveryTime',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('shipping.field.requireDeliveryTime', language),
			dataIndex: 'requireDeliveryTime',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('shipping.field.requirePickStartTime', language),
			dataIndex: 'requirePickStartTime',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('shipping.field.requirePickTimeTo', language),
			dataIndex: 'requirePickTimeTo',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('shipping.field.createBy', language),
			dataIndex: 'createBy',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('shipping.field.createTime', language),
			dataIndex: 'createTime',
			render: text => <AdSelect value={text} onlyRead={true} />,
			width: 100,
		},
		{
			title: transferLanguage('shipping.field.updateBy', language),
			dataIndex: 'updateBy',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('shipping.field.updateTime', language),
			dataIndex: 'updateTime',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}
		];
		const firstFormItem = (
			<FormItem label={transferLanguage('shipping.field.coNo', language)}>
				{getFieldDecorator('coNo')(<Input placeholder="" />)}
			</FormItem>
		);
		const secondFormItem = (
			<FormItem label={transferLanguage('shipping.field.soNo', language)}>
				{getFieldDecorator('soNo')(<Input placeholder="" />)}
			</FormItem>
		);

		// secondForm 参数
		const otherFormItem = [
			[
				<FormItem label={transferLanguage('shipping.field.status', language)}>
					{getFieldDecorator('status')(
					<AdSelect payload={{code:allDictList.Obnotice_Staus}}/>

					)}
				</FormItem>
			],
			[<FormItem label={transferLanguage('shipping.field.bizType', language)}>
				{getFieldDecorator('bizType')(
					<SearchSelect
						disabled={false}
						dataUrl={'/mds-bill-type/selectMdsBillTypeList'}
						selectedData={bizType} // 选中值
						showValue="name"
						searchName="name"
						multiple={false}
						columns={_SelectColumns}
						onChange={values => this.getValue(values, 'bizType')}
						id="bizType"
						payload={{ businessType: ['OUTBOUND'] }}
						allowClear={true}
						scrollX={200}
					/>
				)}
			</FormItem>,
			<FormItem label={transferLanguage('shipping.field.sodType', language)}>
				{getFieldDecorator('sodeliverytype')(
					<Input placeholder="" />
				)}
			</FormItem>,
			<FormItem label={transferLanguage('shipping.field.serviceLevel', language)}>
				{getFieldDecorator('servicelevel')(
					<Input placeholder="" />
				)}
			</FormItem>,

			],
			[
				<FormItem label={transferLanguage('shipping.field.shipFrom', language)}>
					{getFieldDecorator('shipFromWmCode')(
						<SearchSelect
							disabled={false}
							dataUrl={'/wms-warehouse/selectWmsWarehouseList'}
							selectedData={shipFromWmCode} // 选中值
							showValue="name"
							searchName="name"
							multiple={false}
							columns={_SelectColumns}
							onChange={values => this.getValue(values, 'shipFromWmCode')}
							id="shipFromWmCode"
							allowClear={true}
							scrollX={200}
						/>
					)}
				</FormItem>,
				<FormItem label={transferLanguage('shipping.field.customer', language)}>
					{getFieldDecorator('sellername')(
						<Input placeholder="" />
					)}
				</FormItem>,
				<FormItem label={transferLanguage('shipping.field.shipToCountry', language)}>
					{getFieldDecorator('altshiptocountry')(
						<SearchSelect
							dataUrl={'/mds-country/selectMdsCountryList'}
							selectedData={shipToCountry} // 选中值
							showValue="name"
							searchName="name"
							multiple={false}
							columns={_SelectColumns}
							onChange={values => this.getValue(values, 'shipToCountry')}
							id="shipToCountry"
							allowClear={true}
							scrollX={200}
						/>
					)}
				</FormItem>,

			],
			[
				<FormItem label={transferLanguage('shipping.field.shipToState', language)}>
					{getFieldDecorator('altshiptostate')(
						<Input placeholder="" />
					)}
				</FormItem>,
				<FormItem label={transferLanguage('shipping.field.shipToCity', language)}>
					{getFieldDecorator('altshiptocity')(
						<Input placeholder="" />
					)}
				</FormItem>,
				<FormItem label={transferLanguage('shipping.field.shipToZip', language)}>
					{getFieldDecorator('altshiptopostcode')(
						<Input placeholder="" />
					)}
				</FormItem>,
			],
			[
				<FormItem label={transferLanguage('shipping.field.ordrDate', language)}>
					{getFieldDecorator('bizDate')(
						<RangePicker placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createStartTime', language)]}
						/>
					)}
				</FormItem>,
				<FormItem label={transferLanguage('shipping.field.soDate', language)}>
					{getFieldDecorator('soreleasedate')(
						<RangePicker placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createStartTime', language)]}
						/>
					)}
				</FormItem>,
			],
			['operatorButtons',]
		];
		const selectFormParams = {
			firstFormItem,
			secondFormItem,
			otherFormItem,
			form,
			className: this.className,
			handleFormReset: this.handleFormReset,
			handleSearch: this.handleSearch,
			toggleForm: this.toggleForm,
			quickQuery: true
		};
		const tableButtonsParams = {
			show: true,
			buttons: (
				<div>
					<Button.Group>
						<AdButton
							onClick={() => this.abledStatus('cancel')}
							disabled={selectedRows.length > 0 ? false : true}
							type="danger" ghost
							text={transferLanguage('shipping.button.cancelActive', language)}
							code={codes.cancel}
						/>
						<AdButton
							onClick={() => this.abledStatus('confirm')}
							disabled={selectedRows.length > 0 ? false : true}
							text={transferLanguage('shipping.button.active', language)}
							code={codes.confirm}
						/>
						<AdButton
							disabled={selectedRows.length > 0 ? false : true}
							onClick={() => { this.putaway() }}
							text={transferLanguage('shipping.button.createPick', language)}
							code={codes.pick}
						/>
						<AdButton
							disabled={selectedRows.length > 0 ? false : true}
							onClick={() => { this.putaway('createDelivery') }}
							text={transferLanguage('shipping.button.createDelivery', language)}
							code={codes.delivery}
						/>
						<AdButton
							disabled={selectedRows.length > 0 ? false : true}
							onClick={() => { this.createReceipt() }}
							text={transferLanguage('shipping.button.createReceipt', language)}
							code={codes.receipt}
						/>
					</Button.Group>



				</div>

			),
			selectedRows: selectedRows,
		};

		return (
			<Fragment>
				<SelectForm {...selectFormParams} />
				<TableButtons {...tableButtonsParams} />
				<StandardTable
					selectedRows={selectedRows}
					loading={loading}
					data={shippingList}
					columns={columns}
					onSelectRow={this.handleSelectRows}
					onPaginationChange={this.handleStandardTableChange}
					expandForm={expandForm}
					className={this.className}
					code={codes.page}
				/>
			</Fragment>
		);
	}
}
