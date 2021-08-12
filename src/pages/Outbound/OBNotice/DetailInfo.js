import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, Icon, Button, Collapse, DatePicker, PageHeader, Radio, } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '@/pages/Operate.less';
import { Status } from './utils';
import DetailsList from '@/components/DetailsList';
import { transferLanguage } from '@/utils/utils';

const Panel = Collapse.Panel;
@connect(({ shipping, common, component, loading, i18n }) => ({
	shipping,
	dictObject: common.dictObject,
	id: shipping.id,
	loading: loading.models.shipping,
	searchValue: component.searchValue,
	language: i18n.language
}))
@Form.create()
export default class DetailInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRowKeys: [],
			currentId: '',
			visible: false,
			activeKey: ['1', '2'],
			showRecord: true, //init:false
			senders: [],
			disabled: false,
			expandForm: false,
		};
	}
	className = 'shipping';

	componentDidMount() {
		const { match, form, dispatch } = this.props;
		const ID = match && match.params ? match.params.id : '';
		this.setState({
			currentId: ID,
			showRecord: true,
		});
		this.getSelectDetails(ID);

	}
	//详情信息：
	getSelectDetails = ID => {
		this.props.dispatch({
			type: 'shipping/fetchDelivery',
			payload: { id: ID },
		});
	};


	callback = key => {
		this.setState({
			activeKey: key,
		});
	};

	toggleForm = () => {
		const { expandForm } = this.state;
		this.setState({
			expandForm: !expandForm,
		});
	};

	onRef = ref => {
		this.child = ref;
	};

	render() {
		const {
			checkIds,
		} = this.state;
		const {
			shipping: { delivery },
			form: { getFieldDecorator },
			form,
			dictObject,
			match: { params },
			isMobile,
			language
		} = this.props;
		const currentId = params.id;
		let selectDetails = delivery[currentId];

		const genExtraBasicInfo = () => (
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>{selectDetails?.asnNo}</span>
			</div>
		);
		const customPanelStyle = {
			borderRadius: 4,
			marginBottom: 12,
			border: 0,
			overflow: 'hidden',
		};

		const fields = [
			{ key: 'coNo', name: transferLanguage('shippingDetail.field.coNo', language) },
			{ key: 'lotCoo', name: transferLanguage('shippingDetail.field.coo', language) },
			{ key: 'createBy', name: transferLanguage('shippingDetail.field.createBy', language) },
			{ key: 'createTime', name: transferLanguage('shippingDetail.field.createTime', language) },
			{ key: 'lotDn', name: transferLanguage('shippingDetail.field.dn', language) },
			{ key: 'lotNo', name: transferLanguage('shippingDetail.field.lotNo', language) },
			{ key: 'lotInfo', name: transferLanguage('shippingDetail.field.lotInfo', language) },
			{ key: 'lotLocation', name: transferLanguage('shippingDetail.field.lotLocation', language) },
			{ key: 'lotInvoiceNo', name: transferLanguage('shippingDetail.field.invoiceNo', language) },
			{ key: 'partDesc', name: transferLanguage('shippingDetail.field.partDesc', language) },
			{ key: 'partCode', name: transferLanguage('shippingDetail.field.partNo', language) },
			{ key: selectDetails?.warehouse, name: transferLanguage('shipping.field.warehouse', language), isConst: true },
			{ key: 'remarks', name: transferLanguage('shippingDetail.field.remarks', language), isRow: true },
		];

		const detailsFields = [
			{ key: 'grossWeight', name: transferLanguage('shippingDetail.field.grossWeight', language) },
			{ key: 'netWeight', name: transferLanguage('shippingDetail.field.netWeight', language) },
			{ key: 'planPieceQty', name: transferLanguage('shippingDetail.field.planPieceQty', language) },
			{ key: 'estimatedDeliveryTime', name: transferLanguage('shippingDetail.field.estimatedDeliveryTime', language) },
			{ key: 'requiredPickTimeFrom', name: transferLanguage('shippingDetail.field.requiredPickTimeFrom', language) },
			{ key: 'requiredPickTimeTo', name: transferLanguage('shippingDetail.field.requiredPickStartTime', language) },
			{ key: 'planBoxQty', name: transferLanguage('shippingDetail.field.planBoxQty', language) },
			{ key: 'planPalletQty', name: transferLanguage('shippingDetail.field.planPalletQty', language) },
			{ key: 'planPieceQty', name: transferLanguage('shippingDetail.field.planPieceQty', language) },
			{ key: 'unitPrice', name: transferLanguage('shippingDetail.field.unitPrice', language) },
			{ key: 'lotUom', name: transferLanguage('shippingDetail.field.uom', language) },
			{ key: 'lotVendorCode', name: transferLanguage('shippingDetail.field.vendorCode', language) },
			{ key: 'lotVendorName', name: transferLanguage('shippingDetail.field.vendorName', language) },
			{ key: 'volume', name: transferLanguage('shippingDetail.field.volume', language) },
		]

		return (
			<div className={styles.CollapseUpdate}>
				<PageHeaderWrapper title={genExtraBasicInfo()}>
					<Collapse
						activeKey={this.state.activeKey}
						onChange={key => this.callback(key)}
						bordered={false}
					>
						<Panel header={transferLanguage('Common.field.baseInfo', language)} key="1" style={customPanelStyle}>
							<div className={styles.tableListForm}>
								<DetailsList isMobile={isMobile} detilsData={{ fields: fields, value: selectDetails }} />
							</div>
						</Panel>
						<Panel header={transferLanguage('base.prompt.detailInfo', language)} key="2" style={customPanelStyle}>
							<div className={styles.tableListForm}>
								<DetailsList isMobile={isMobile} detilsData={{ fields: detailsFields, value: selectDetails }} />
							</div>
						</Panel>
					</Collapse>
				</PageHeaderWrapper>
			</div>
		);
	}
}
