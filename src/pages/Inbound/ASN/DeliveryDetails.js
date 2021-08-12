import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, Icon, Button, Collapse, DatePicker, PageHeader, Radio, } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '@/pages/Operate.less';
import { Status } from './utils';
import DetailsList from '@/components/DetailsList';
import { transferLanguage } from '@/utils/utils';

const Panel = Collapse.Panel;
@connect(({ asn, common, component, loading, i18n }) => ({
    asn,
    dictObject: common.dictObject,
    id: asn.id,
    loading: loading.models.asn,
    searchValue: component.searchValue,
    language: i18n.language
}))
@Form.create()
export default class TypeOperate extends Component {
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
    className = 'asn';

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
            type: 'asn/fetchDelivery',
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
            asn: { delivery },
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
            { key: 'arrivedBoxQty', name: transferLanguage('ASNDetail.field.arrivedBoxQty', language) },
            { key: 'arrivedPalletQty', name: transferLanguage('ASNDetail.field.arrivedPalletQty', language) },
            { key: 'arrivedPieceQty', name: transferLanguage('ASNDetail.field.arrivedPieceQty', language) },
            { key: 'asnNo', name: transferLanguage('ASNDetail.field.ASNNo', language) },
            { key: 'prNo', name: transferLanguage('ASNDetail.field.prNo', language) },
            { key: 'lotCoo', name: transferLanguage('ASNDetail.field.coo', language) },
            { key: 'createBy', name: transferLanguage('ASNDetail.field.createBy', language) },
            { key: 'createTime', name: transferLanguage('ASNDetail.field.createTime', language) },
            { key: 'lotDn', name: transferLanguage('ASNDetail.field.dn', language) },
            { key: 'lotNo', name: transferLanguage('ASNDetail.field.lotNo', language) },
            { key: 'lotInvoiceNo', name: transferLanguage('ASNDetail.field.invoiceNo', language) },
            { key: 'partDesc', name: transferLanguage('ASNDetail.field.partDesc', language) },
            { key: 'partNo', name: transferLanguage('ASNDetail.field.partNo', language) },
            { key: selectDetails?.warehouse, name:  transferLanguage('ASN.field.warehouse', language), isConst: true },
            { key: 'remarks', name: transferLanguage('ASN.field.remarks', language), isRow: true },
        ];

        const detailsFields = [
            { key: 'totalGrossWeight', name: transferLanguage('ASNDetail.field.grossWeight', language) },
            { key: 'totalNetWeight', name: transferLanguage('ASNDetail.field.netWeight', language) },
            { key: 'totalVolume', name:transferLanguage('ASNDetail.field.volume', language) },
            { key: 'arrivedPieceQty', name: transferLanguage('ASNDetail.field.arrivedPalletQty', language) },
            { key: 'planPieceQty', name: transferLanguage('ASNDetail.field.planPieceQty', language) },
            { key: 'estimateArrivalTime', name: transferLanguage('ASN.field.estimateArrivalTime', language) },
            { key: 'realArrivalTime', name: transferLanguage('ASN.field.realArrivalTime', language) },
            { key: 'requiredReceiveTimeFrom', name: transferLanguage('ASN.field.requiredArrivalTimeFrom', language) },
            { key: 'requiredReceiveTimeTo', name: transferLanguage('ASN.field.requiredArrivalTimeTo', language) },
            { key: 'planBoxQty', name: transferLanguage('ASN.field.planBoxQty', language) },
            { key: 'planPalletQty', name: transferLanguage('ASN.field.planPalletQty', language) },
            { key: 'planPieceQty', name: transferLanguage('ASN.field.planPieceQty', language) },
            { key: 'putawayBoxQty', name:transferLanguage('ASNDetail.field.putAwayBoxQty', language) },
            { key: 'putawayPalletQty', name: transferLanguage('ASNDetail.field.putAwayPalletQty', language) },
            { key: 'putawayPieceQty', name: transferLanguage('ASNDetail.field.putAwayPieceQty', language)},
            { key: 'transportPriority', name: transferLanguage('ASNDetail.field.transportPriority', language) },
            { key: 'unitPrice', name: transferLanguage('ASNDetail.field.unitPrice', language) },
            { key: 'lotUom', name: transferLanguage('ASNDetail.field.uom', language) },
            { key: 'lotVendorCode', name: transferLanguage('ASNDetail.field.vendorCode', language) },
            { key: 'lotVendorName', name: transferLanguage('ASNDetail.field.vendorName', language) },
            { key: 'volume', name: transferLanguage('ASNDetail.field.volume', language) },
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
