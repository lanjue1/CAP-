
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Collapse, Form, Input, Select, } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '@/pages/Operate.less';
import { ASNDetailsColumns, codes, Status } from './utils';
import DetailsList from '@/components/DetailsList';
import { transferLanguage, columnConfiguration } from '@/utils/utils';

const Panel = Collapse.Panel;
@connect(({ billingLog, loading, i18n }) => ({
    billingLog,
    loading: loading.models.billingLog,
    language: i18n.language
}))
@Form.create()
export default class TypeOperate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            currentId: '',
            selectedRows: [],
            visible: false,
            activeKey: ['1', '2', '3'],
            showRecord: true, //init:false
            senders: [],
            disabled: false,
            beUseRule: true,
            requestTypeList: [],
            expandForm: false,
            formValues: {},
            modalVisible: false,
            fileList: [],
        };
    }
    className = ' billingLog';

    componentDidMount() {
        const { match, form, dispatch, language } = this.props;
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
            type: 'billingLog/fetchBillingDetails',
            payload: { id: ID },
        });
    };

    callback = key => {
        this.setState({
            activeKey: key,
        });
    };

    render() {
        const {
            billingLog: { billingDetails },
            form: { getFieldDecorator },
            match: { params },
            isMobile,
            language
        } = this.props;
        const currentId = params.id;
        let selectDetails = billingDetails[currentId];
        const genExtraBasicInfo = () => (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{selectDetails?.bizNo}</span>
            </div>
        );
        const customPanelStyle = {
            borderRadius: 4,
            marginBottom: 12,
            border: 0,
            overflow: 'hidden',
        };

        const _gutter = { md: 8, lg: 24, xl: 48 };
        const _col = { md: 12, sm: 24 };
        const _row = { md: 24 };
        const fields = [
            { key: 'bizNo', name: transferLanguage('billingLog.title.bizNo', language) },
            { key: 'bizStatus', name: transferLanguage('billingLog.field.bizStatus', language) },
            { key: 'bizType', name: transferLanguage('billingLog.field.bizType', language) },
            { key: 'elapsedMillisecond', name: transferLanguage('billingLog.field.elapsedMillisecond', language) },
            { key: 'receiptId', name: transferLanguage('billingLogbillingLog.field.receiptId', language) },
            { key: 'receiptNo', name: transferLanguage('billingLog.field.receiptNo', language) },
            { key: 'reRedemption', name: transferLanguage('billingLog.field.originalRedemption', language) },
            { key: 'receiptType', name: transferLanguage('billingLog.field.receiptType', language) },
            { key: 'bizDate', name: transferLanguage('billingLog.field.bizDate', language) },
            { key: 'remarks', name: transferLanguage('billingLog.field.remarks', language) },
            { key: 'startDate', name: transferLanguage('billingLog.field.startDate', language) },
            { key: 'endDate', name: transferLanguage('billingLog.field.endDate', language) },
            { key: 'exceptionLog', name: transferLanguage('billingLog.field.exceptionLog', language) },
            { key: 'billingLog', name: transferLanguage('billingLog.field.billingLog', language),isTextArea:true, },
        
        ];
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
                    </Collapse>
                </PageHeaderWrapper>
            </div>
        );
    }
}
