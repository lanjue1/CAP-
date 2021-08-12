import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { routerRedux, Route, Switch } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Space } from 'antd';
import styles from '@/pages/Operate.less';
import StandardTable from '@/components/StandardTable';;
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, Status, SelectColumns, formatStatus, Type, Putaway, asnType } from './utils';
import AdSelect from '@/components/AdSelect';
import AntdFormItem from '@/components/AntdFormItem'
import AntdForm from '@/components/AntdForm'
import AdModal from '@/components/AdModal';
import SearchSelect from '@/components/SearchSelect';
import FileImport from '@/components/FileImport'
import { transferLanguage, columnConfiguration } from '@/utils/utils';
import { queryDict, allDictList } from '@/utils/common';
import AdButton from '@/components/AdButton';
import AntdDatePicker from '@/components/AntdDatePicker';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@ManageList
@connect(({ asn, common, component, loading, i18n }) => ({
	asn,
	loading: loading.effects['asn/asnList'],
	dictObject: common.dictObject,
	searchValue: component.searchValue,
	language: i18n.language
}))
@Form.create()
export default class ASNList extends Component {
	state = {
		expandForm: false,
		selectedRows: [],
		checkId: '',
		checkIds: [],
		formValues: {},
		isAbled: '',
		visible: false,
		visibleFile: false,
		visibleReceive: false,
		asnClosed: false,
		billType: [{ code: '', name: '', id: '' }],
		warehouse: [{ code: '', name: '', id: '' }],
		importType: '',
		_type: '',
		fileUrlName: 'ASN_import_for_repair_template.xlsx',
		showTimeModal: false,
	};
	className = 'asn';

	componentDidMount() {
		this.getASNList();
		columnConfiguration(SelectColumns, this.props.language)
		const allDict = [
			allDictList.orderType,
			allDictList.asnStatus,
		]
		queryDict({ props: this.props, allDict })
	}

	getValue = (values, type) => {
		this.setState({
			[type]: values,
		});
		if (type === '_type') {
			if (values == 'POU' || values == 'REPAIR') {
				this.setState({ fileUrlName: 'ASN_import_for_repair_template.xlsx' })
				// }else if(values=='APRH'||values=='APRH_VIRTUAL'){
			} else {
				this.setState({ fileUrlName: 'aprh_import_template.xlsx' })
			}
		}
	};

	getASNList = (params = {}) => {
		const { dispatch, searchValue } = this.props;
		dispatch({
			type: 'asn/asnList',
			payload: params,
			callback: data => {
				if (!data) return;
				let valueList = [];
				// data.map(v => {
				// 	const labels = ['senderId'];
				// 	labels.map(item => {
				// 		if (v[item] && !valueList.includes(v[item])) {
				// 			valueList.push(v[item]);
				// 			!searchValue[v[item]] &&
				// 				dispatch({
				// 					type: 'component/querySearchValue',
				// 					payload: {
				// 						params: { id: v[item] },
				// 						url: 'sms/sms-sender/viewSmsSenderDetails',
				// 					},
				// 				});
				// 		}
				// 	});
				// });
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
		});
		this.getASNList();
	};



	//查询
	handleSearch = values => {
		const { date, ...value } = values;
		if (date && date.length) {
			value.createStartTime = moment(date[0]).format('YYYY-MM-DD');
			value.createEndTime = moment(date[1]).format('YYYY-MM-DD');
			value.createStartTime += ' 00:00:00'
			value.createEndTime += ' 23:59:59'
		} else {
			delete value.createStartTime;
			delete value.createEndTime;
		}
		this.setState({
			formValues: value,
		});
		// console.log('value---', value)
		this.getASNList(value);
	};

	// 分页操作：改参数
	handleStandardTableChange = param => {
		const { dispatch } = this.props;
		const { formValues } = this.state;
		const params = {
			...formValues,
			...param,
		};
		this.getASNList(params);
	};

	//编辑：
	handleEdit = (e, record) => {
		e.stopPropagation();
		const { dispatch } = this.props;
		const { id } = record;
		// console.log('senderId', record.senderId);

		dispatch({
			type: 'asn/asnDetails',
			payload: { id },
			callback: res => {
				this.setState({
					isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
				});
			},
		});
		router.push(`/inbound/detailsASN/${id}`);
	};

	//启用、禁用：
	abledStatus = (type) => {
		const { dispatch } = this.props;
		const { checkIds, checkId, formValues, asnClosed, visible } = this.state;
		let params = {};
		params.ids = checkIds;
		// params.type = type === 'confirm' ? true : false
		params.type = type
		if (asnClosed) params.secondType = true

		dispatch({
			type: 'asn/ableOperate',
			payload: params,
			callback: res => {
				if (type == 'allPartReceive') this.setState({ visible: false, asnClosed: false })
				this.getASNList(formValues);
			},
		});
	};
	abledModal = (type) => {
		const { visible, asnClosed } = this.state
		this.setState({ visible: !visible })
		if (type == 'closeAsn') this.setState({ asnClosed: true })
	}
	print = () => {
		const { checkIds, selectedRows } = this.state
		const { dispatch } = this.props
		let id = selectedRows[0]?.id
		dispatch({
			type: 'common/setPrint',
			payload: { ids: checkIds },
			callback: data => {
				router.push(`/print/${id}/RECEIVE`);
			}
		})
	};
	shipmentArrivalTime() {
		const { showTimeModal } = this.state
		this.setState({
			showTimeModal: !showTimeModal,
		})
		

	}
	saveShipmentArrivalTime(){
		this.props.form.validateFields((err, values) => {
			if(!err){
				const { checkIds, formValues, showTimeModal } = this.state
				const { dispatch } = this.props
				dispatch({
					type: 'asn/saveShipmentArrivalTime',
					payload: { ids: checkIds, shipmentArrivalTime: moment(values.shipmentArrivalTime).format('YYYY-MM-DD HH:mm') },
					callback: res => {
						this.setState({
							showTimeModal: !showTimeModal,
						})
						this.getASNList(formValues);
					}
				})

			}
		});
	}

	showShipmentArrivalTime() {
		const { selectedRows } = this.state
		let ind = ''
		if (!selectedRows.length) {
			return true
		}
		selectedRows.forEach((item, index) => {
			if (!(item.status == 'OPEN' || item.status == 'CONFIRMED')) {
				ind = index
			}
		})
		if (ind === '') {
			return false
		} else {
			return true
		}
	}
	//生成上架单
	putaway = () => {
		const { dispatch } = this.props;
		const { checkIds, formValues } = this.state;
		dispatch({
			type: 'asn/generateWmsMoveDoc',
			payload: { id: checkIds[0] },
			callback: res => {
				this.getASNList(formValues);
			},
		});
	}

	//收货入账
	delivery = () => {
		const { dispatch } = this.props;
		const { checkIds, formValues } = this.state;
		dispatch({
			type: 'asn/asnReceiveConfirm',
			payload: { ids: checkIds },
			callback: res => {
				this.getASNList(formValues);
			},
		});
	}

	//取消asn
	asnCancel = () => {
		const { dispatch } = this.props;
		const { checkIds, formValues } = this.state;
		dispatch({
			type: 'asn/asnCancel',
			payload: { ids: checkIds },
			callback: res => {
				this.getASNList(formValues);
			},
		});
	}

	handleImportFile = (type) => {
		if (type == 'receive') {
			this.setState({
				visibleReceive: false
			})
		} else if (type == 'ASN') {
			this.setState({
				visibleReceive: false,
				importType: ''
			})
		} else {
			this.setState({
				visibleFile: false
			})
		}
	}
	render() {
		const {
			loading,
			asn: { asnList, asnDetails },
			form,
			isMobile,
			dictObject,
			language,
		} = this.props;
		const { getFieldDecorator } = form;
		const {
			selectedRows,
			isAbled,
			checkId,
			visible,
			visibleFile,
			rowDetails,
			expandForm,
			billType,
			warehouse,
			asnClosed,
			visibleReceive,
			importType,
			_type,
			fileUrlName,
			showTimeModal,
		} = this.state;
		const selectDetails = asnDetails[checkId];
		const commonDecorator = {
			getFieldDecorator: getFieldDecorator
		}
		//列表 列
		const columns = [{
			title: '#',
			dataIndex: 'index',
			render: (text, record, index) => (<span>{index + 1}</span>),
			width: 50
		},
		{
			//标题
			title: transferLanguage('ASN.field.asnNo', language),
			//数据字段
			dataIndex: 'asnNo',
			render: (text, record) => (
				<a onClick={e => this.handleEdit(e, record)} title={text}>
					{text}
				</a>
			),
			width: 150,
		},
		{
			title: transferLanguage('ASN.field.status', language),
			dataIndex: 'status',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('ASN.field.orderType', language),
			dataIndex: 'orderType',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		// {
		//     title: transferLanguage('ASN.field.cargoOwner', language),
		//     dataIndex: 'cargoOwner',
		//     render: text => <AdSelect value={text} onlyRead={true} />,
		// },
		// {
		//     title: transferLanguage('ASN.field.customerOrderNo', language),
		//     dataIndex: 'customerOrderNo',
		//     render: text => <AdSelect value={text} onlyRead={true} />,
		// },
		{
			title: transferLanguage('ASN.field.forwarder', language),
			dataIndex: 'forwarder',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('ASN.field.shipFromWmCode', language),
			dataIndex: 'shipFromWmCode',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('ASN.field.planPieceQty', language),
			dataIndex: 'planPieceQty',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('ASN.field.openQty', language),
			dataIndex: 'openPieceQty',
		},
		{
			title: transferLanguage('ASN.field.bolNo', language),
			dataIndex: 'bolNo',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('ASN.field.AWB', language),
			dataIndex: 'awb',
		},

		{
			title: transferLanguage('ASN.field.type', language),
			dataIndex: 'billTypeName',
			render: text => <AdSelect value={text} onlyRead={true} />,
			width: 200,
		},
		{
			title: transferLanguage('ASN.field.estimateArrivalTime', language),
			dataIndex: 'estimateArrivalTime',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('ASN.field.realArrivalTime', language),
			dataIndex: 'realArrivalTime',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('ASN.field.requiredReceiveTimeFrom', language),
			dataIndex: 'requiredReceiveTimeFrom',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}, {
			title: transferLanguage('ASN.field.requiredReceiveTimeTo', language),
			dataIndex: 'requiredReceiveTimeTo',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('ASN.field.createBy', language),
			dataIndex: 'createBy',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('ASN.field.createTime', language),
			dataIndex: 'createTime',
			render: text => <AdSelect value={text} onlyRead={true} />,
			width: 100,
		},
		{
			title: transferLanguage('ASN.field.updateBy', language),
			dataIndex: 'updateBy',
			render: text => <AdSelect value={text} onlyRead={true} />,
		},
		{
			title: transferLanguage('ASN.field.updateTime', language),
			dataIndex: 'updateTime',
			render: text => <AdSelect value={text} onlyRead={true} />,
		}
		];
		const firstFormItem = (
			<FormItem label={transferLanguage('ASN.field.asnNo', language)}>
				{getFieldDecorator('asnNo')(<TextArea rows={1} />)}
			</FormItem>
		);
		const secondFormItem = (
			<FormItem label={transferLanguage('ASN.field.status', language)}>
				{getFieldDecorator('status')(
					<AdSelect
						mode="multiple"
						data={dictObject[allDictList.asnStatus]}
						payload={{ code: allDictList.asnStatus }}
					/>
					// <Select placeholder={transferLanguage('Common.field.select', language)} style={{ width: '100%' }} allowClear={true}>

					// 	{Status.map(v => {
					// 		return <Option value={v.code}>{v.value}</Option>;
					// 	})}
					// </Select>
				)}
			</FormItem>
		);

		// secondForm 参数
		const otherFormItem = [
			[
				<FormItem label={transferLanguage('ASN.field.type', language)}>
					{getFieldDecorator('type')(
						<AdSelect
							data={dictObject[allDictList.orderType]}
							payload={{ code: allDictList.orderType }}
							mode="multiple"
						/>
						// <Select placeholder={transferLanguage('Common.field.select', language)} style={{ width: '100%' }} allowClear={true}>


						// 	{Type.map(v => {
						// 		return <Option value={v.code}>{v.value}</Option>;
						// 	})}
						// </Select>
					)}
				</FormItem>,
			],
			[<FormItem label={transferLanguage('ASN.field.bolNo', language)}>
				{getFieldDecorator('bolNo')(<TextArea rows={1} />)}
			</FormItem>,
			<FormItem label={transferLanguage('ASN.field.shipFromWmCode', language)}>
				{getFieldDecorator('shipFrom')(
					<Input placeholder="" />
				)}
			</FormItem>,
			<FormItem label={transferLanguage('ASN.field.bizDate', language)}>
				{getFieldDecorator('date')(
					<RangePicker placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createStartTime', language)]}
					/>
				)}
			</FormItem>,
			],
			[
				<FormItem label={transferLanguage('ASNDetail.field.soNo', language)}>
					{getFieldDecorator('soNo')(
						<TextArea rows={1} />
					)}
				</FormItem>, <FormItem label={transferLanguage('PoList.field.poNo', language)}>
					{getFieldDecorator('poNo')(
						<TextArea rows={1} />
					)}
				</FormItem>, <FormItem label={transferLanguage('PoDetailList.field.prNo', language)}>
					{getFieldDecorator('prid')(
						<TextArea rows={1} />
					)}
				</FormItem>,
			],
			[
				<FormItem label={transferLanguage('CoDetailList.field.SOID', language)}>
					{getFieldDecorator('soId')(
						<TextArea rows={1} />
					)}
				</FormItem>,
				<FormItem label={transferLanguage('ASNDetail.field.partNo', language)}>
					{getFieldDecorator('partNo')(
						<TextArea rows={1} />
					)}
				</FormItem>,
				<FormItem label={transferLanguage('ASNDetail.field.AWB', language)}>
				{getFieldDecorator('awb')(
					<Input  />
				)}
			</FormItem>
			],
			[
				'operatorButtons',
			],
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
			rightButtons: (
				<Button.Group>
					<AdButton
						onClick={() => this.setState({ visibleReceive: true, importType: 'importASN' })}
						text={transferLanguage('ASN.button.importASN', language)}
						code={codes.importReceive}
					/>
					<AdButton
						onClick={() => this.setState({ visibleReceive: true })}
						text={transferLanguage('ASN.button.importReceive', language)}
						code={codes.importReceive}
					/>
					<AdButton
						onClick={() => this.setState({ visibleFile: true })}
						text={transferLanguage('Common.field.import', language)}
						code={codes.import}
					/>

				</Button.Group>
			),
			buttons: (
				<div>
					<Button.Group>
						<AdButton
							onClick={() => this.abledStatus('cancel')}
							disabled={selectedRows.length > 0 ? false : true}
							type="danger" ghost
							text={transferLanguage('ASN.button.cancelConfirm', language)}
							code={codes.cancelConfirm}
						/>

						<AdButton
							onClick={() => this.abledStatus('confirm')}
							disabled={selectedRows.length > 0 ? false : true}
							text={transferLanguage('ASN.button.confirm', language)}
							code={codes.confirm}
						/>

						<AdButton
							text={transferLanguage('ASN.button.Cancel', language)}
							code={codes.cancel}
							disabled={selectedRows.length > 0 ? false : true} onClick={this.asnCancel}
						/>

						<AdButton
							text={transferLanguage('ASN.button.createReceipt', language)}
							code={codes.createReceipt}
							disabled={selectedRows.length > 0 ? false : true}
							onClick={() => this.abledStatus('createReceipt')} />

						<AdButton
							disabled={selectedRows.length > 0 ? false : true}
							text={transferLanguage('ASN.button.allPartReceive', language)}
							code={codes.receiptPart}
							onClick={() => this.abledModal('allPartReceive')}
						/>

						<AdButton disabled={selectedRows.length > 0 ? false : true}
							onClick={() => this.putaway()}
							text={transferLanguage('ASN.button.createPutaway', language)}
							code={codes.createPutaway}
						/>

						<AdButton disabled={selectedRows.length > 0 ? false : true}
							onClick={() => this.abledModal('closeAsn')}
							text={transferLanguage('ASN.prompt.closeAsn', language)}
							code={codes.closeASN}
						/>
						<AdButton onClick={() => this.print()}
							disabled={selectedRows.length > 0 ? false : true}
							text={transferLanguage('base.prompt.print', language)}
							code={codes.print}
						/>
						<AdButton onClick={() => this.shipmentArrivalTime()}
							disabled={this.showShipmentArrivalTime()}
							text={transferLanguage('ASN.prompt.shipmentArrivalTime', language)}
						/>
					</Button.Group>

				</div>

			),
			selectedRows: selectedRows,
		};
		let file = {
			urlImport: importType == 'importASN' ? `wms-asn/importWmsAsnCreate` : `wms-asn/wmsAsnimportReceive`,
			urlCase: importType == 'importASN' ? 'template/download?fileName=ASN_import_template.xlsx' : `wms-asn/downLoadReceiveTemplate`,
			cancel: importType == 'importASN' ? 'ASN' : 'receive',
		}
		return (
			<Fragment>
				<FileImport
					visibleFile={visibleReceive}
					handleCancel={() => {
						this.handleImportFile(file.cancel);
					}}
					urlImport={file.urlImport}
					urlCase={file.urlCase}
					queryData={[this.getASNList]}
					accept=".xls,.xlsx"
				/>
				<FileImport
					visibleFile={visibleFile}
					handleCancel={() => {
						this.handleImportFile();
					}}
					urlImport={`wms-asn/importWmsAsnAprh`}
					urlCase={`template/download?fileName=${fileUrlName}`}
					queryData={[this.getASNList]}
					accept=".xls,.xlsx"
					importPayload={{ orderType: _type ? _type : '' }}
					extra={(<div style={{ width: 300, marginBottom: 10 }} >
						<AntdFormItem
							label={transferLanguage('Common.field.type', language)}
							code="_type"
							width={'180'}
							{...commonDecorator}
						>
							<AdSelect width={true}
								payload={{ code: allDictList.ASN_Import_Type }} onChange={(values) => this.getValue(values, '_type')} />
						</AntdFormItem>

						{/* <Form.Item label={transferLanguage('PoList.field.warehouse', language)}>
							<SearchSelect
								dataUrl={'wms-warehouse/selectWmsWarehouseList'}
								selectedData={warehouse} // 选中值
								showValue="name"
								searchName="name"
								multiple={false}
								columns={SelectColumns}
								onChange={values => this.getValue(values, 'warehouse')}
								id="type"
								allowClear={true}
								scrollX={200}
							/>
						</Form.Item> */}
					</div>)}
				/>
				<SelectForm {...selectFormParams} />
				<TableButtons {...tableButtonsParams} />
				<StandardTable
					selectedRows={selectedRows}
					loading={loading}
					data={asnList}
					columns={columns}
					onSelectRow={this.handleSelectRows}
					onPaginationChange={this.handleStandardTableChange}
					expandForm={expandForm}
					className={this.className}
					code={codes.page}
				/>
				<AdModal
					visible={visible}
					title={transferLanguage('ASN.button.allPartReceive', language)}
					onOk={() => this.abledStatus('allPartReceive')}
					onCancel={() => this.abledModal()}
					width="500px"

				>
					{asnClosed ?
						<div>{transferLanguage('ASN.prompt.closeAsn', language)}</div>
						: <div>{transferLanguage('ASN.prompt.allPartReceive', language)}</div>
					}
				</AdModal>
				<AdModal
					visible={showTimeModal}
					title={transferLanguage('ASN.prompt.shipmentArrivalTime', language)}
					onOk={() => this.saveShipmentArrivalTime()}
					onCancel={() => this.shipmentArrivalTime()}
					width="500px"
				>
					<div className={styles.tableListForm}>
						<Form layout="">
							<Form.Item label={transferLanguage('ASN.prompt.shipmentArrivalTime', language)}>
								{getFieldDecorator('shipmentArrivalTime')(<DatePicker format="YYYY-MM-DD HH:mm" />)}
							</Form.Item>
						</Form>
					</div>
				</AdModal>
			</Fragment>
		);
	}
}
