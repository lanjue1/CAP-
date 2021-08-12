import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Row, Col, Spin } from 'antd';
import { editGutter, } from '@/utils/constans';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage, formatDate } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import AdModal from '@/components/AdModal';
import SearchSelect from '@/components/SearchSelect'
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import { transferLanguage } from '@/utils/utils';
import AntdDatePicker from '@/components/AntdDatePicker';
import styles from '../../index.less';
import {
    allDispatchType,
    codes,
    selectList,
    routeUrl,
    columnsBilling,
} from './utils';
import { languages } from 'monaco-editor';
import {BillingStatus} from '../commonUtils.js'
import {allDictList } from '@/utils/common'

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ SellBilling, loading, component, i18n }) => ({
    SellBilling,
    receiptList: SellBilling.receiptList,
    dictObject: component.dictObject,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],

}))
@Form.create()
export default class SellBillingList extends Component {
    className = 'SellBillingList';
    constructor(props) {
        super(props);
        this.state = {
            listCol: {
                md: 8, sm: 24
            },
            formValues: {},
            detailId: '',
            visible: false,
            expandForm: false,
            selectedRows: [],
            _columns: [],
            pageLoadding: false

        };
    }
    componentDidMount() {
        selectList({ props: this.props });
        this.changeTitle(columnsBilling, '_columns')
    }
    //国际化，修改culumns中的title
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
        });
        form.resetFields();
        // saveAllValues({ payload: { formValues: {} }, ...props });
        selectList({ ...props });
    };

    /**
     * form 查找条件 查询
     */
    handleSearch = formValues => {
        // if (!formValues) return;
        const { createDate, ...value } = formValues
        if (createDate && createDate.length > 0) {
            value.createStartDate = moment(createDate[0]).format("YYYY-MM-DD")
            value.createEndDate = moment(createDate[1]).format("YYYY-MM-DD")
            value.createStartDate +=' 00:00:00'
            value.createEndDate +=' 23:59:59'
        } else {
            value.createStartDate = ""
            value.createEndDate = ""
        }
        const params = { props: this.props, payload: value };
        selectList(params);
        this.setState({ formValues:value })
    };
    /**
     * table 表格 分页操作
     */
    handleStandardTableChange = param => {
        const { formValues } = this.state;
        selectList({ payload: { ...formValues, ...param }, props: this.props });
    };

    // 选中行
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
    //编辑
    handleEdit = () => {
        const { detailId } = this.state;
        this.handleSelectRows([{ visible: false }]);
        router.push(`${routeUrl.edit}/${detailId}`)
    };


    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };

    //启用、禁用：
    abledStatus = (type) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {};
        params.type = type
        params.ids = checkIds
        if(type=='billing'){
            const {form:{getFieldValue}}=this.props
            let _paymentTime=getFieldValue('paymentTime')
            if(!_paymentTime) return
            params.paymentTime=moment(_paymentTime).format(dateFormatTime)
        }
        const param = { props: this.props, payload: formValues };
        this.setState({
            pageLoadding: true
        })
        dispatch({
            type: 'SellBilling/abledOperate',
            payload: params,
            callback: (res) => {
                this.setState({
                    pageLoadding: false
                })
                if(res.code==0){
                    selectList({ ...param });
                    type=='billing'&&this.setState({visible:false})
                }
                
            },
        });
    };
    //打印
    print = (type) => {
        const { checkIds, selectedRows } = this.state
        const { dispatch } = this.props
        let id = selectedRows[0]?.id
        dispatch({
            type: 'common/setPrint',
            payload: { ids: checkIds },
            callback: data => {
                router.push(`/print/${id}/${type}`);
            }
        })
    }
    operatorButtons = ({ value, textAlign, otherFormItem }) => {
        const { code } = this.props;
        const { listCol } = this.state
        const marginLeft = { marginLeft: 8 };
        return (
            <Col {...listCol} style={{ textAlign }}>
                <span className={styles.submitButtons}>
                    <Button.Group>
                        <AdButton type="primary" htmlType="submit" text={transferLanguage('base.prompt.search', this.props.language)} code={code} />
                        <AdButton onClick={this.handleFormReset} text={transferLanguage('base.prompt.reset', this.props.language)} code={code} />
                    </Button.Group>
                </span>
            </Col>
        );
    };
    render() {
        const { receiptList, loading, form, language } = this.props;
        const {
            listCol,
            expandForm,
            selectedRows,
            _columns,
            visible,
            pageLoadding
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('ChargeDetail.field.billingNo', language)} code="billingNo" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('Common.field.status', language)} code="status" {...commonParams}>
                <AdSelect payload={{ code: allDictList.BillingStatus }} />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('BuyLedger.field.billingCycle', language)} code="billingCycle" {...commonParams}>
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('BuyLedger.field.payer', language)} code="payer" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('BuyLedger.field.lotInvoiceNo', language)} code="invoiceNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Common.field.createDate', language)} code="createDate" {...commonParams}>
                    <AntdDatePicker mode="range" />
                </AntdFormItem>
            ],
            ['operatorButtons'],
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
            // handleAdd: this.handleAdd,
            // code: codes.addEndorse,
            rightButtons: (
                <Button.Group>
                    <AdButton
                        type="primary"
                        onClick={() => this.print('SELL_BILLING')}
                        text={transferLanguage('Common.field.report',this.props.language)}
                    />
                </Button.Group>
            ),
            buttons: (
                <Button.Group>
                    <AdButton
                        onClick={() => this.abledStatus('cancel')}
                        // disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Common.field.cancel', this.props.language)} />
                    <AdButton
                        onClick={() => this.abledStatus('check')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Common.field.check', this.props.language)} />
                    <AdButton
                        onClick={() => this.abledStatus('cancelCheck')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('IQC.button.cancelCheck', this.props.language)} />
                    <AdButton
                        onClick={() => this.setState({visible:false})}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('BuyBilling.button.billing', this.props.language)} />
                    <AdButton
                        onClick={() => this.abledStatus('accept')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('BuyBilling.button.accept', this.props.language)} />
                    <AdButton
                        onClick={() => this.abledStatus('cancelAccept')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('BuyBilling.button.cancelAccept', this.props.language)} />
                </Button.Group>

            ),
            selectedRows: selectedRows,

        };

        // 详情 参数
        return (
            <Fragment>
                <Spin size="small" spinning={pageLoadding} style={{ margin: '0 auto' }} tip="Loadding" >

                <SelectForm {...selectFormParams} />
                < TableButtons {...tableButtonsParams} />
                < StandardTable
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={receiptList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}

                />
                {visible && <AdModal
                    visible={visible}
                    title={transferLanguage('BuyBilling.button.billing', language)}
                    onOk={() => this.abledStatus('billing')}
                    onCancel={() => this.setState({ visible: false })}
                    width="500px"
                >
                    <AntdFormItem label={transferLanguage('BuyBilling.button.billing', language)}
                        code='paymentTime'
                        initialValue={moment(new Date())}
                        rules={[{ required: true, }]}
                        {...commonParams}
                    >
                        <AntdDatePicker showTime />
                    </AntdFormItem>
                </AdModal>}
                </Spin>
            </Fragment >
        );
    }
}
