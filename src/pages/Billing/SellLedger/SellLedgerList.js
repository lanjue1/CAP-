import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Row, Col, Spin } from 'antd';
import { editGutter, listCol } from '@/utils/constans';
import router from 'umi/router';
import moment from 'moment';
import { formItemFragement } from '@/utils/common';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdModal from '@/components/AdModal';
import AdButton from '@/components/AdButton';
import AntdForm from '@/components/AntdForm';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import SearchSelect from '@/components/SearchSelect'
import { transferLanguage } from '@/utils/utils';
import AntdDatePicker from '@/components/AntdDatePicker';
import styles from '../../index.less';
import {
    allDispatchType,
    codes,
    selectList,
    selectDetailList,
    routeUrl,
    columns,
    SelectColumns,
    SelectStatus,
    SelectType,
    SelectCloseType,
    SelectOrderType,
} from './utils';
import { columnsBilling, BillingStatus } from '../SellBilling/utils'
import {LedgerStatus} from '../commonUtils'

import { queryDict, allDictList } from '@/utils/common'
import { languages } from 'monaco-editor';
const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;
const { TextArea } = Input;


@ManageList

@connect(({ SellLedger, loading, component, i18n }) => ({
    SellLedger,
    chargeDetailList: SellLedger.chargeDetailList,
    billinglList: SellLedger.billinglList,
    dictObject: component.dictObject,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],

}))
@Form.create()
export default class SellLedgerList extends Component {
    className = 'SellLedgerList';
    className2 = 'BillingListMod'
    constructor(props) {
        super(props);
        this.state = {
            listCol: {
                md: 8, sm: 24
            },
            formValues: {},
            formValuesMod: {},
            detailId: '',
            visible: false,
            expandForm: false,
            selectedRows: [],
            selectedRowsOld: [],
            selectedRowsMod: [],
            _columns: [],
            _columnsBilling: [],
            name: [],
            isSelectAll: false,
            shipFromWmCode: [],
            visibleBilling: false,
            warehouseId: [],
            pageLoadding: false
        };
    }
    _SelectColumns = [
        {
            title: transferLanguage('BillTypeList.field.code', this.props.language),
            dataIndex: 'code',
            width: 100,
        },
        {
            title: transferLanguage('BillTypeList.field.name', this.props.language),
            dataIndex: 'name',
            width: 250,
        },
    ]
    componentDidMount() {
        selectList({ props: this.props });

        this.changeTitle(columns, '_columns')
        this.changeTitle(columnsBilling, '_columnsBilling')
        const allDict = [
            allDictList.receiptType
        ]
        queryDict({ props: this.props, allDict })
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
    handleFormResetFirst = () => {
        const { form, } = this.props
        const props = { props: this.props };
        this.setState({
            formValues: {},
            warehouseId: []
        });
        form.resetFields();
        // saveAllValues({ payload: { formValues: {} }, ...props });
        selectList({ ...props });
    };

    /**
     * form 查找条件 查询
     */
    handleSearchFirst = formValues => {
        // if (!formValues) return;
        const { bizDate, warehouseCode, ...value } = formValues
        if (bizDate && bizDate.length > 0) {
            value.startBillDate = moment(bizDate[0]).format("YYYY-MM-DD")
            value.endBillDate = moment(bizDate[1]).format("YYYY-MM-DD")
            value.startBillDate +=' 00:00:00'
            value.endBillDate +=' 23:59:59'
        } else {
            value.startBillDate = ""
            value.endBillDate = ""
        }
        if (warehouseCode && warehouseCode.length > 0) value.warehouseCode = warehouseCode[0].code
        const params = { props: this.props, payload: value };
        selectList(params);
        this.setState({ formValues :value})
    };

    /**
     * table 表格 分页操作
     */
    handleStandardTableChange = param => {
        const { formValues } = this.state;
        selectList({ payload: { ...formValues, ...param }, props: this.props });
    };
    handleStandardTableChangeMod = param => {
        const { formValuesMod } = this.state;
        selectDetailList({ payload: { ...formValuesMod, ...param }, props: this.props });
    }
    // 选中行
    handleSelectRows = rows => {
        console.log('??rows-999', rows)
        const { isSelectAll, } = this.state
        const { chargeDetailList } = this.props
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
        // if (isSelectAll) {
        //     rows.length < chargeDetailList.list.length &&
        //         this.setState({
        //             isSelectAll: false,
        //             selectedRows: rows,
        //         })
        // }
    };
    handleSelectRowsMod = (rows) => {
        if (this.state.selectedRowsMod.length > 0 && rows.length > 0) {
            rows = rows.filter(v => v.id !== this.state.selectedRowsMod[0].id)
        }
        this.setState({
            selectedRowsMod: rows,
        });
    }
    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
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
        const param = { props: this.props, payload: formValues };

        dispatch({
            type: allDispatchType.abled,
            payload: params,
            callback: res => {
                console.log('res--99999999', res)
                selectList({ ...param });

            },
        });
    };
    createBilling = () => {
        const { isSelectAll, checkIds, formValues } = this.state
        const { dispatch } = this.props
        let params = {
            type: 'createBilling',
        }
        !isSelectAll ?
            params.ids = checkIds
            :
            params= {type: 'createBilling', isSelectAll: true, ...formValues }
        // router.push(`${routeUrl.detail}/${'281439480318406656'}`)
        this.setState({
            pageLoadding: true
        })
        dispatch({
            type: 'SellLedger/abledStatus',
            payload: params,
            callback: (data) => {
                this.setState({
                    pageLoadding: false
                })
                if(data.code==0){
                    this.setState({ selectedRows: [] })
                    router.push(`${routeUrl.detail}/${data.data}?EDIT`)
                }
            }
        })
    }
    addBilling = () => {
        const { isSelectAll, checkIds, formValues } = this.state
        const { dispatch } = this.props
        dispatch({
            type: 'SellLedger/selectBillinglList',
            payload: { status: 'OPEN' },
            callback: () => {
                this.setState({ visibleBilling: true })
            }
        })
    }
    selectAllBtn = () => {
        const { selectedRows } = this.state
        const { chargeDetailList } = this.props
        this.setState({
            selectedRowsOld: selectedRows,
            selectedRows: chargeDetailList.list,
            isSelectAll: true
        })

    }
    cancelAll = () => {
        const { selectedRowsOld } = this.state
        this.setState({
            isSelectAll: false,
            selectedRows: selectedRowsOld
        })
    }
    handleFormResetMod = () => {
        const { form, } = this.props
        const props = { props: this.props };
        this.setState({
            formValuesMod: {},
        });
        form.resetFields(['_billingNo', '_status', '_billingCycle', '_payer', '_payee', '_createDate']);
        selectDetailList({ ...props });
    };

    /**
     * form 查找条件 查询
     */
    _handleSearch = formValues => {
        // if (!formValues) return;
        const { ...value } = formValues
        const params = { props: this.props, payload: value };
        selectDetailList(params);
        this.setState({ formValuesMod: formValues })
    };
    handleSearch = e => {
        console.log('???e', e)
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const { _billingNo, _status, _billingCycle, _payer, _payee, _createDate, ...values } = fieldsValue
            console.log('fieldsValue--', fieldsValue)
            const value = {
                billingNo: _billingNo,
                status: _status,
                billingCycle: _billingCycle,
                payer: _payer,
                payee: _payee,

            }
            if (_createDate && _createDate.length > 0) {
                value.startBillDate = moment(_createDate[0]).format("YYYY-MM-DD")
                value.endBillDate = moment(_createDate[1]).format("YYYY-MM-DD")
                value.startBillDate +=' 00:00:00'
                value.endBillDate +=' 23:59:59'
            } else {
                value.startBillDate = ''
                value.endBillDate = ''
            }
            this._handleSearch(value);
        });
    };
    handleOk = () => {
        const { selectedRowsMod, isSelectAll, checkIds, formValues } = this.state
        const { dispatch } = this.props
        if (selectedRowsMod.length === 0) return
        const params = {
            type: 'addToBilling',
            billingId: selectedRowsMod[0].id,
        }
        !isSelectAll ?
            params.ids = checkIds
            :
            params = {type: 'addToBilling', isSelectAll: true, ...formValues }
        dispatch({
            type: 'SellLedger/abledStatus',
            payload: params,
            callback: () => {
                this.setState({
                    visibleBilling: false,
                    selectedRows: [],
                    selectedRowsMod: [],
                }, () => {
                    this.handleFormResetMod()
                    const { formValues } = this.state
                    selectList({ props: this.props, payload: formValues })
                })
            }
        })
    }
    operatorButtons = (colStyle) => {
        const { code } = this.props;
        const { listCol } = this.state
        const marginLeft = { marginLeft: 8 };
        return (
            <Col {...listCol} style={colStyle}>
                <span className={styles.submitButtons}>
                    <Button.Group>
                        <AdButton type="primary" onClick={this.handleSearch} text={transferLanguage('base.prompt.search', this.props.language)} code={code} />
                        <AdButton onClick={this.handleFormResetMod} text={transferLanguage('base.prompt.reset', this.props.language)} code={code} />
                    </Button.Group>
                </span>
            </Col>
        );
    };
    render() {
        const { chargeDetailList, billinglList, loading, form, language, dictObject } = this.props;
        const {
            listCol,
            expandForm,
            selectedRows,
            selectedRowsMod,
            _columns,
            isSelectAll,
            visibleBilling,
            pageLoadding
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('ChargeDetail.field.ledgerNo', language)} code="ledgerNo" {...commonParams}>
                <TextArea rows={1} />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('Common.field.status', language)} code="status" {...commonParams}>
                <AdSelect payload={{ code: allDictList.Charge_Status }} />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('ASN.field.orderType', language)} code="poOrderType" {...commonParams}>
                    <AdSelect payload={{ code: allDictList.Sell_Ledger_OrderType }} />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('ChargeDetail.field.billingNo', language)} code="billingNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('CoList.field.bizCoNo', language)} code="coNo" {...commonParams}>
                    <TextArea rows={1} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('SellLedger.field.closeType', language)} code="closeType" {...commonParams}>
                    <AdSelect payload={{ code: allDictList.Sell_Ledger_CloseType }} />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('RMO.field.partNo', language)} code="partNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Delivery.field.soId', language)} code="soId" {...commonParams}>
                    <TextArea rows={1} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('ASNDetail.field.soNo', language)} code="soNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('BuyLedger.field.lotInvoiceNo', language)} code="invoiceNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Area.field.warehouse', language)} code="warehouseCode" {...commonParams}>
                    <SearchSelect
                        dataUrl={'wms-warehouse/selectWmsWarehouseList'}
                        selectedData={this.state.warehouseId} // 选中值
                        showValue="code"
                        searchName="keyWord"
                        multiple={false}
                        columns={this._SelectColumns}
                        onChange={values => this.getValue(values, 'warehouseId')}
                        id="warehouseId"
                        allowClear={true}
                        scrollX={200}
                    />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('BuyLedger.field.billDate', language)} code="bizDate" {...commonParams}>
                    <AntdDatePicker mode="range" showTime/>
                </AntdFormItem>,
            ],
            ['operatorButtons'],
        ];
        const selectFormParams = {
            firstFormItem,
            secondFormItem,
            otherFormItem,
            form,
            className: this.className,
            handleFormReset: this.handleFormResetFirst,
            handleSearch: this.handleSearchFirst,
            toggleForm: this.toggleForm,
            quickQuery: true
            // code: codes.select,
        };
        const tableButtonsParams = {
            handleAdd: this.handleAdd,
            selectedLength: selectedRows.length,
            pagination: chargeDetailList.pagination,
            selectAll: () => this.selectAllBtn(),
            cancelAll: () => this.cancelAll(),
            isSelectAll,
            buttons: (
                <Button.Group>
                    <AdButton
                        onClick={() => this.createBilling()}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('BuyLedger.button.createBilling', this.props.language)} />
                    <AdButton
                        onClick={() => this.addBilling()}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('BuyLedger.button.addToBilling', this.props.language)} />
                </Button.Group>
            ),
            selectedRows: selectedRows,
        };

        const formSearch = [
            [
                <AntdFormItem label={transferLanguage('ChargeDetail.field.billingNo', language)} code="_billingNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Common.field.status', language)} code="_status" {...commonParams}>
                    <AdSelect data={BillingStatus} isExist />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('BuyLedger.field.billingCycle', language)} code="_billingCycle" {...commonParams}>
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('BuyLedger.field.payer', language)} code="_payer" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('BuyLedger.field.payee', language)} code="_payee" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Common.field.createDate', language)} code="_createDate" {...commonParams}>
                    <AntdDatePicker mode='range' />
                </AntdFormItem>,
            ],
            [
                <></>,
                <></>,
                this.operatorButtons({ textAlign: 'center', marginLeft: '100px' })
            ],

        ];

        // 详情 参数
        return (
            <Fragment>
                <Spin size="small" spinning={pageLoadding} style={{ margin: '0 auto' }} tip="Loadding" >
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={chargeDetailList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                />
                {visibleBilling && <AdModal
                    visible={visibleBilling}
                    title={transferLanguage('BuyLedger.button.addToBilling', language)}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ visibleBilling: false }, () => this.handleFormResetMod())}
                    width="1000px"
                >
                    <Fragment>
                        <AntdForm>{formItemFragement(formSearch)}</AntdForm>
                        <StandardTable
                            selectedRows={selectedRowsMod}
                            onSelectRow={this.handleSelectRowsMod}
                            // loading={loading}
                            data={billinglList}
                            columns={this.state._columnsBilling}
                            onPaginationChange={this.handleStandardTableChangeMod}
                            // expandForm={expandForm}
                            hideDefaultSelections={true}
                            hideCheckAll={true}
                            className={this.className2}
                            code={codes.page}
                            defaultPageSize={'10'}
                        />
                    </Fragment>
                </AdModal>}
                </Spin>
            </Fragment>
        );
    }
}
