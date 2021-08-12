import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Select, Icon, Row, Col } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import QRCode from 'qrcode.react';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import AdModal from '@/components/AdModal';
import AntdForm from '@/components/AntdForm';
import AntdInput from '@/components/AntdInput'
import prompt from '@/components/Prompt';
import AntdDatePicker from '@/components/AntdDatePicker';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import SearchSelect from '@/components/SearchSelect';
import { transferLanguage } from '@/utils/utils'
import { allDictList, queryDict } from '@/utils/common'
import { formItemFragement, formatPrice } from '@/utils/common';
import {
	allDispatchType,
	codes,
	selectList,
	selectMoveDocDetailList,
	selectModSecondList,
	routeUrl,
	columns,
	Status,
	columns1,
	isTrue,
	SelectColumns1
} from './utils';
import styles from './picking.less';

const { TextArea } = Input;

const confirm = Modal.confirm;
const FormItem = Form.Item;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ Picking, loading, component, MoveDoc, i18n }) => ({
    dictObject: component.dictObject,
	pickingList: Picking.pickingList,
	moveDocDetailList: Picking.moveDocDetailList,
	inventoryList: Picking.inventoryList,
	language: i18n.language,
	loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class MoveDocList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formValues: {},
			formValuesMod: {},
			detailId: '',
			visible: false,
			visiblePrint: false,
			visibleDummySn: false,
			dummySnNo: '',
			expandForm: false,
			selectedRows: [],
			checkIds: [],
			moveId: [],
			worker: [],
			visibleMod: false,
			selectedRowsMod: [],
			checkIdsMod: [],
			binCode: [],
			_columns: [],
			shipToWmCode: [],
			selectColumns: [],
			allotWorker: []
		};
	}
	className = 'PickingList';

	componentDidMount() {
		selectList({ props: this.props });
		this.changeTitle(columns, '_columns')
		this.changeTitle(SelectColumns1, 'selectColumns')
		const allDict = [
            allDictList.loadlistStatus,
            allDictList.transportType,
        ]
        queryDict({ props: this.props, allDict })
	}

	getValue = (values, type) => {
		this.setState({
			[type]: values,
		});
	};
	changeTitle = (param, params) => {
		let _columnsAllotOne = []
		_columnsAllotOne = param.map(v => {
			v.title = transferLanguage(v.title, this.props.language)
			return v
		})
		this.setState({
			[params]: _columnsAllotOne
		})
	}
	/**
	 * form 查找条件 重置
	 */
	handleFormReset = () => {
		const { form, } = this.props
		const props = { props: this.props };
		this.setState({
			formValues: {},
			worker:[]
		});
		form.resetFields();
		// saveAllValues({ payload: { formValues: {} }, ...props });
		selectList({ ...props });
	};

	/**
	 * form 查找条件 查询
	 */
	handleSearch = formValue => {
		// if (!formValues) return;
		const { workId, etd,createDate ,...formValues} = formValue
		if (workId && workId.length > 0) formValues.workId = workId[0].id
		// if (shipToWmCode && shipToWmCode.length > 0) formValues.shipToWmCode = shipToWmCode[0].id
		if (createDate) {
			console.log('createDate', createDate)
			formValues.createDate = moment(createDate).format(dateFormat)
		} else {
			formValues.createDate = ''
		}
		if (etd && etd.length > 0) {
			formValues.etdStart = moment(etd[0]).format('YYYY-MM-DD');
			formValues.etdEnd = moment(etd[1]).format('YYYY-MM-DD');
			formValues.etdStart +=' 00:00:00'
			formValues.etdEnd +=' 23:59:59'
		} else {
			formValues.etdStart = ''
			formValues.etdEnd = ''
		}
		const params = { props: this.props, payload: formValues };
		selectList(params);
		this.setState({ formValues })
	};

	/**
	 * table 表格 分页操作 
	 */
	handleStandardTableChange = (param) => {
		const { formValues } = this.state;
		selectList({ payload: { ...formValues, ...param }, props: this.props });
	}


	// 选中行
	handleSelectRows = rows => {
		let ids = [];
		let moveId = [];
		if (Array.isArray(rows) && rows.length > 0) {
			rows.map((item, i) => {
				ids.push(item.id);
				moveId.push(item.moveNo)
			});
		}
		this.setState({
			selectedRows: rows,
			checkIds: ids,
			moveId,
		});
	};

	pickingTask = () => {
		router.push(`/outbound/pickingTask/pickingTaskList/${this.state.checkIds[0]}?type=picking`)
	}


	toggleForm = () => {
		const { expandForm } = this.state;
		this.setState({
			expandForm: !expandForm,
		});
	};
	//新建
	handleAdd = () => {
		router.push(routeUrl.add)
	}
	// 自动分配、作业下发、取消下发
	btnStatus = (type) => {
		const { dispatch } = this.props
		const { selectedRows, formValues } = this.state
		let _type
		switch (type) {
			case 'selfAllot':
				_type = allDispatchType.selfAllot;

				break;
			case 'confim':
				_type = allDispatchType.confim;
				break;
			case 'cancel':
				_type = allDispatchType.cancel;
				break;
		}
		// console.log('type!!!!!!', type, _type)
		const params = { props: this.props, payload: formValues };
		dispatch({
			type: _type,
			payload: { ids: selectedRows.map(v => v.id) },
			callback: (res) => {
				selectList(params);
				this.setState({
					selectedRows: []
				})
			}
		})
	}
	//打印
	btnPrint = (type) => {
		const { selectedRows, checkIds } = this.state
		const { dispatch } = this.props
		let id = selectedRows[0]?.id
		dispatch({
			type: 'common/setPrint',
			payload: { ids: checkIds },
			callback: () => {
				router.push(`/print/${id}/${type}`);
			}
		})
	}
	// 分配人员
	pickingAllot = () => {
		const { dispatch } = this.props
		const { allotWorker, selectedRows } = this.state
		if (allotWorker && allotWorker.length > 0) {
			dispatch({
				type: 'Picking/fetchPickingAllot',
				payload: { ids: selectedRows.map(v => v.id), workId: allotWorker[0].id },
				callback: (res) => {
					selectList({ props: this.props });
					this.setState({
						selectedRows: [],
						visible: false
					})
				}
			})
		} else {
			prompt({ content: 'Please select the operator', type: 'error' });

		}

	}
	// 手动分配
	handleAllot = (type) => {
		const { visibleMod, visible, checkIds, moveId, selectedRows, allotWorker } = this.state
		const { form } = this.props
		if (type) {
			this.setState({ visibleMod: !visibleMod })
		} else {
			// if (selectedRows.length > 1) {
			// 	prompt({ content: '手工分配只允许选择一条数据', type: 'warn' })
			// 	return
			// }
			router.push(`${routeUrl.edit}/${checkIds[0]}`)
		}
	}
	abledModal = (type) => {
		const { dispatch, form: { getFieldValue } } = this.props
		const { visible, formValues, checkIds } = this.state
		let cartonQTY = getFieldValue('cartonQTY')
		let params = {
			quantity: type ? 1 : cartonQTY,
			type: 'printVirtualSN',
		}
		dispatch({
			type: 'Picking/abledStatus',
			payload: params,
			callback: data => {
				this.setState({ visiblePrint: false })
				// const params = { props: this.props, payload: formValues };
				// selectList(params);
				if (type) {
					this.setState({
						visibleDummySn: true,
						dummySnNo: data[0]
					})
				} else {
					dispatch({
						type: 'common/setPrint',
						payload: { ids: data },
						callback: data => {
							router.push(`/print/${data[0]}/VIRTUAL_SN`);
						}
					})
				}

			}
		})
	}

	render() {
		const { pickingList, moveDocDetailList, inventoryList, loading, form, language,dictObject } = this.props;
		const {
			expandForm,
			allotWorker, worker,
			selectedRows, binCode, visible, visibleMod,
			selectColumns, selectedRowsMod,
			_columns, shipToWmCode,
			visiblePrint,
			visibleDummySn, dummySnNo

		} = this.state;
		const commonParams = {
			getFieldDecorator: form.getFieldDecorator,
		};
		let getFieldDecorator = form.getFieldDecorator
		// const form2=Form.create()
		let modalData = selectedRowsMod[0] ? selectedRowsMod[0] : {}
		const firstFormItem = (
			<AntdFormItem label={transferLanguage('Picking.field.pickingNo', language)} code="pickingNo" {...commonParams}>
				<Input />
			</AntdFormItem>
		);
		const secondFormItem = (
			<AntdFormItem label={transferLanguage('Picking.field.beActive', language)} code="status" {...commonParams}>
            <AdSelect payload={{code:allDictList.Picking_Status}}/>
				
			</AntdFormItem>
		);
		const otherFormItem = [
			[

				<AntdFormItem label={transferLanguage('Picking.field.planPickingBin', language)} code="planPickingBin" {...commonParams}>
					<Input />
				</AntdFormItem>,
			],
			[
				<AntdFormItem label={transferLanguage('CoList.field.bizSoNo', language)} code="soNo" {...commonParams}>
					<TextArea rows={1} />
				</AntdFormItem>,
				<AntdFormItem label={transferLanguage('Delivery.field.soId', language)} code="soId" {...commonParams}>
					<TextArea rows={1} />
				</AntdFormItem>,
				<AntdFormItem label={transferLanguage('CoList.field.bizCoNo', language)} code="coNo" {...commonParams}>
					<TextArea rows={1} />
				</AntdFormItem>,
			],
			[
				<AntdFormItem label={transferLanguage('InventoryList.field.cargoOwnerName', language)} code="workId" {...commonParams}>
					<SearchSelect
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
					/>
				</AntdFormItem>,
				<AntdFormItem label={transferLanguage('PoDetailList.field.partNo', language)} code="partNo" {...commonParams}>
					<Input />
				</AntdFormItem>,
				<AntdFormItem label={transferLanguage('PoDetailList.field.etd', language)} code="etd" {...commonParams}>
					<AntdDatePicker mode="range" placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createEndTime', language)]} />
				</AntdFormItem>,
			],
			[
				<AntdFormItem label={transferLanguage('Picking.field.sodeliverytype', language)} code="sodeliverytype" {...commonParams}>
					<Input />
				</AntdFormItem>,
				// <AntdFormItem label={transferLanguage('Picking.field.pmcustomerind', language)} code="pmcustomerind" {...commonParams}>
				// 	<Select placeholder={transferLanguage('Common.field.select', language)} style={{ width: '100%' }}>
				// 		{isTrue.map(v => <Option value={v.code} key={v.code} >{v.value}</Option>)}
				// 	</Select>

				// </AntdFormItem>,
				<AntdFormItem label={transferLanguage('PoList.field.shipTo', language)} code="altshipto" {...commonParams}>
					<Input />
					{/* <SearchSelect
						dataUrl={'/wms-warehouse/selectWmsWarehouseList'}
						selectedData={shipToWmCode} // 选中值
						showValue="name"
						searchName="name"
						multiple={false}
						columns={selectColumns}
						onChange={values => this.getValue(values, 'shipToWmCode')}
						id="shipToWmCode"
						allowClear={true}
						scrollX={200}
					/> */}
				</AntdFormItem>,
				<AntdFormItem label={transferLanguage('Picking.field.altshiptocountry', language)} code="altshiptocountry" {...commonParams}>
					<Input />
				</AntdFormItem>,
			],
			[
				/* 	<AntdFormItem label={transferLanguage('Picking.field.altshiptostate', language)} code="altshiptostate" {...commonParams}>
						<Input />
					</AntdFormItem>, */
				// <AntdFormItem label={transferLanguage('Picking.field.altshiptocity', language)} code="altshiptocity" {...commonParams}>
				// 	<Input />
				// </AntdFormItem>,
			],
			[
				<AntdFormItem label={transferLanguage('Delivery.field.type', language)} code="orderType" {...commonParams}>
				<AdSelect mode="multiple" payload={{code:allDictList.WmsOrderType}}/>
			</AntdFormItem>,
				<AntdFormItem label={transferLanguage('MoveTastList.field.createDate', language)} code="createDate" {...commonParams}>
					<AntdDatePicker format={dateFormat} />
				</AntdFormItem>,
				<AntdFormItem label={transferLanguage('Picking.field.altshiptopostcode', language)} code="altshiptopostcode" {...commonParams}>
					<Input />
				</AntdFormItem>,
				'operatorButtons'
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
			// code: codes.select,
		};

		const tableButtonsParams = {
			buttons: (
				<Button.Group disabled={selectedRows.length > 0 ? false : true}>
					<AdButton
						code={codes.manual}
						onClick={() => this.handleAllot()}
						disabled={selectedRows.length === 1 ? false : true}
						text={transferLanguage('Picking.button.manualAllocate', language)} />
					<AdButton
						code={codes.auto}
						onClick={() => this.btnStatus('selfAllot')}
						disabled={selectedRows.length > 0 ? false : true}
						text={transferLanguage('Picking.button.autoAllocate', language)}
					/>
					<AdButton
						code={codes.taskPick}
						onClick={() => this.pickingTask()}
						disabled={selectedRows.length === 1 ? false : true}
						text={transferLanguage('base.prompt.pickingTask', language)}
					/>
					<AdButton
						code={codes.assignWorker}
						onClick={() => this.setState({ visible: true })}
						disabled={selectedRows.length > 0 ? false : true}
						text={transferLanguage('Picking.button.pickingAllot', language)}
					/>
					<AdButton
						code={codes.printPicking}
						onClick={() => this.btnPrint('PICKING')}
						disabled={selectedRows.length > 0 ? false : true}
						text={transferLanguage('base.prompt.printPicking', language)}
					/>
					<AdButton
						code={codes.printSDI}
						onClick={() => this.btnPrint('SDI')}
						disabled={selectedRows.length > 0 ? false : true}
						text={transferLanguage('Picking.button.printSDI', language)} />
					<AdButton
						code={codes.printVirtualSN}
						onClick={() => this.setState({ visiblePrint: true })}
						text={transferLanguage('Picking.button.printVirtualSN', language)} />
					<AdButton
						code={codes.printDummySN}
						// onClick={() => this.setState({ visibleDummySn: true })}
						onClick={() => this.abledModal('showDummySN')}
						text={transferLanguage('Picking.button.showDummySN', language)} />
				</Button.Group>
			),
			selectedRows: selectedRows,
		};
		const tableButtonsModel = {
			buttons: (
				<Button.Group disabled={selectedRows.length > 0 ? false : true}>
					<AdButton
						onClick={() => this.handleAllot('Modal')}
						disabled={false}
						disabled={selectedRowsMod.length > 0 ? false : true}
						text={transferLanguage('PutAway.button.manualAllocate', language)} />
				</Button.Group>
			),
			selectedRows: selectedRows,

		};
		// 详情 参数
		return (
			<Fragment>
				<SelectForm {...selectFormParams} />
				<TableButtons {...tableButtonsParams} />
				<StandardTable
					// disabledRowSelected={true}
					selectedRows={selectedRows}
					onSelectRow={this.handleSelectRows}
					loading={loading}
					data={pickingList}
					columns={_columns}
					onPaginationChange={this.handleStandardTableChange}
					expandForm={expandForm}
					// size="small"
					className={this.className}
				/>
				{visible && <AdModal
					visible={visible}
					title={transferLanguage('Picking.button.pickingAllot', language)}
					onOk={this.pickingAllot}
					onCancel={() => this.setState({ visible: false })}
					width="600px"
					style={{
						maxWidth: 500,
					}}
				>
					<AntdForm>
						<AntdFormItem
							label={transferLanguage('Picking.field.allotWorker', language)}
							code="workId" {...commonParams}>
							<SearchSelect
								dataUrl="mds-user/selectOperatorUserList"
								selectedData={allotWorker} // 选中值
								multiple={false} // 是否多选
								showValue="sysName"
								searchName="keyWord"
								columns={columns1} // 表格展示列
								onChange={e => this.getValue(e, 'allotWorker')} // 获取选中值
								scrollX={260}
								id="ArchivesList_1"
								allowClear={true}

							/>
						</AntdFormItem>
					</AntdForm>
				</AdModal>}
				{visiblePrint && <AdModal
					visible={visiblePrint}
					title={transferLanguage('Picking.button.printVirtualSN', language)}
					onOk={() => this.abledModal()}
					onCancel={() => this.setState({ visiblePrint: false })}
					width='500px'
				>
					<AntdFormItem label={transferLanguage('PoList.field.pieceQty', language)}
						code="cartonQTY" {...commonParams}
						initialValue={1}
					>
						<AntdInput min={1} max={50} type='number' />
					</AntdFormItem>
				</AdModal>}
				{visibleDummySn && <AdModal
					visible={visibleDummySn}
					title={transferLanguage('Picking.button.showDummySN', language)}
					// onOk={() => this.setState({ visibleDummySn: false })}
					onCancel={() => this.setState({ visibleDummySn: false })}
					width='500px'
					footer={[
						<Button type="primary" onClick={() => this.setState({ visibleDummySn: false })}>
							{transferLanguage('Common.field.ok', language)}
						</Button>,
					]}
				>
					<div style={{ textAlign: 'center', fontSize: '30px', position: 'relative' }}>
						<div style={{ position: 'absolute', right: '16px', top: '-50px' }}>
							<AdButton
								code={codes.printVirtualSN}
								type='primary'
								onClick={() => this.abledModal('reCreate')}
								text={transferLanguage('Picking.button.reCreate', language)} />
						</div>
						<div style={{ marginLeft: '125px', marginTop: '25px' }}>
							<QRCode
								value={dummySnNo}  //value参数为生成二维码的链接
								size={200} //二维码的宽高尺寸
								fgColor="#000000"  //二维码的颜色
							/>
						</div>
						<p >{dummySnNo}</p>
					</div>
				</AdModal>}
			</Fragment>
		);
	}
}
