import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Select, Row, Col, } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage, formatDate } from 'umi-plugin-react/locale';
import SearchSelect from '@/components/SearchSelect';
import AdModal from '@/components/AdModal';
import AntdForm from '@/components/AntdForm';

import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import { transferLanguage } from '@/utils/utils';
import AntdDatePicker from '@/components/AntdDatePicker';
import {
    allDispatchType,
    codes,
    selectList,
    routeUrl,
    columns,
    Status,
    Types,
    SelectColumns,
} from './utils';
import { allDictList, queryDict } from '@/utils/common'
import { languages } from 'monaco-editor';
import { editRow, editCol } from '@/utils/constans'
import TextArea from 'antd/lib/input/TextArea';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ Load, loading, component, i18n }) => ({
    Load,
    loadList: Load.loadList,
    dictObject: component.dictObject,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],

}))
@Form.create()
export default class LoadList extends Component {
    className = 'loadList';
    constructor(props) {
        super(props);
        this.state = {
            formValues: {},
            detailId: '',
            visible: false,
            expandForm: false,
            selectedRows: [],
            _columns: [],
            _SelectColumns: [],
            toCountryId: [],
            forwarder: [],
            transportType: '',
        };
    }
    componentDidMount() {
        selectList({ props: this.props });
        this.changeTitle(columns, '_columns')
        this.changeTitle(SelectColumns, '_SelectColumns')

        const allDict = [
            allDictList.loadlistStatus,
            allDictList.transportType,
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
        const { shipTime, toCountryId, ...value } = formValues
        if (shipTime && shipTime.length > 0) {
            value.shipTimeStart = moment(shipTime[0]).format(dateFormat)
            value.shipTimeEnd = moment(shipTime[1]).format(dateFormat)
        } else {
            value.shipTimeStart = ""
            value.shipTimeEnd = ""
        }
        if (toCountryId && toCountryId.length > 0) value.altshiptocountry = toCountryId[0].code
        const params = { props: this.props, payload: value };
        selectList(params);
        this.setState({ formValues })
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
        params.type = type
        const param = { props: this.props, payload: formValues };

        dispatch({
            type: allDispatchType.abled,
            payload: params,
            callback: res => {
                if (res.code === 0) {
                    selectList({ ...param });
                }
            },
        });
    };
    abledModal = () => {
        const { dispatch, form: { getFieldValue } } = this.props
        const { visible, formValues, checkIds, transportType } = this.state
        let trackingNo = getFieldValue('trackingNo')
        let forwarder = getFieldValue('forwarder')[0].id
        let _transportType = getFieldValue('transportType')
        let params = {
            trackingNo,
            forwarder,
            transportType: _transportType || transportType,
            ids: checkIds,
            type: 'shipDelivery',
        }
        dispatch({
            type: allDispatchType.abled,
            payload: params,
            callback: data => {
                this.setState({ visible: !visible, transportType: '' })
                const params = { props: this.props, payload: formValues };
                selectList(params);
            }
        })
    }
    deliver = () => {
        const { selectedRows } = this.state
        console.log('selectedRows-9', selectedRows[0].transport)
        this.setState({ visible: true, transportType: selectedRows.length == 1 ? selectedRows[0].transport : '' })

    }
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
    render() {
        const { loadList, loading, form, language, dictObject } = this.props;
        const {
            expandForm,
            selectedRows,
            _columns,
            _SelectColumns,
            toCountryId,
            visible,
            forwarder,
            transportType,
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('Load.field.loadingNo', language)} code="loadingNo" {...commonParams}>
                <TextArea rows={1} />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('Load.field.status', language)} code="status" {...commonParams}>
                <AdSelect  
                mode='multiple'
                data={dictObject[allDictList.loadlistStatus]} 
                payload={{ code: allDictList.loadlistStatus }} />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('Delivery.field.type', language)} code="orderType" {...commonParams}>
                    <AdSelect mode="multiple" payload={{code:allDictList.WmsOrderType}}/>

                </AntdFormItem>
            ],
            [<AntdFormItem label={transferLanguage('Load.field.forwarder', language)} code="forwarder" {...commonParams}>
                <Input />
            </AntdFormItem>,

            <AntdFormItem label={transferLanguage('Load.field.AWB', language)} code="trackingNo" {...commonParams}>
                <TextArea rows={1} />
            </AntdFormItem>,
            <AntdFormItem label={transferLanguage('CoList.field.coNo', language)} code="coNo" {...commonParams}>
                <TextArea rows={1} />
            </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('CoDetailList.field.SOID', language)} code="soId" {...commonParams}>
                    <TextArea rows={1} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('shipping.field.shipTo', language)} code="altshiptoname" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('shipping.field.shipToCountry', language)} code="toCountryId" {...commonParams}>
                    <SearchSelect
                        dataUrl={'/mds-country/selectMdsCountryList'}
                        selectedData={toCountryId} // 选中值
                        showValue="name"
                        searchName="name"
                        multiple={false}
                        columns={_SelectColumns}
                        onChange={values => this.getValue(values, 'toCountryId')}
                        id="toCountryId"
                        allowClear={true}
                        scrollX={200}
                    />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('shipping.field.shipToState', language)} code="altshiptostate" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('shipping.field.shipToCity', language)} code="altshiptocity" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('shipping.field.shipToZip', language)} code="altshiptopostcode" {...commonParams}>
                    <Input />
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
            handleFormReset: this.handleFormReset,
            handleSearch: this.handleSearch,
            toggleForm: this.toggleForm,
            quickQuery: true
            // code: codes.select,
        };

        const tableButtonsParams = {
            // handleAdd: this.handleAdd,
            // code: codes.addEndorse,
            buttons: (
                <Button.Group>
                    <AdButton
                        code={codes.accept}
                        onClick={() => this.abledStatus('accept')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Load.button.accept', this.props.language)} />
                    <AdButton
                        code={codes.reviewLoadlist}
                        onClick={() => this.abledStatus('reviewerDelivery')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Delivery.button.reviewerDelivery', language)} />
                    <AdButton
                        code={codes.deliver}
                        onClick={() => this.deliver()}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Delivery.button.shipDelivery', language)} />
                    <AdButton
                        code={codes.revokeLoadlist}
                        onClick={() => this.abledStatus('revocationDelivery')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Delivery.button.revocationDelivery', language)} />

                    <AdButton
                        code={codes.cancel}
                        onClick={() => this.abledStatus('cancelDelivery')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Load.button.cancelDelivery', this.props.language)} />
                    <AdButton
                        code={codes.invoicelistPrint}
                        onClick={() => this.print('INVOICE_LIST')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Load.button.invoicelistPrint', language)} />
                    <AdButton
                        code={codes.packinglistPrint}
                        onClick={() => this.print('PACKING_LIST')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Load.button.packinglistPrint', language)} />
                    <AdButton
                        code={codes.loadinglistPrint}
                        onClick={() => this.print('LOADING_LIST')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Load.button.loadinglistPrint', language)} />
                    <AdButton
                        code={codes.cartonDetailPrint}
                        onClick={() => this.print('LOADING_CARTON')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Load.button.printCartonDetail', language)} />
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
                    data={loadList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}

                />
                {visible && <AdModal
                    visible={visible}
                    title={transferLanguage('Delivery.button.shipDelivery', language)}
                    onOk={() => this.abledModal()}
                    onCancel={() => this.setState({ visible: false })}
                    width='900px'
                >
                    <AntdForm>
                        <Row {...editRow}>
                            <Col {...editCol}>
                                <AntdFormItem label={transferLanguage('Delivery.field.trackingNo', language)}
                                    code="trackingNo" {...commonParams}
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </AntdFormItem>
                            </Col>
                            <Col {...editCol}>
                                <AntdFormItem label={transferLanguage('Delivery.field.forwarder', language)}
                                    code="forwarder" {...commonParams}
                                    rules={[{ required: true }]}
                                >
                                    <SearchSelect
                                        dataUrl={'wms-forwarder/selectWmsForwarderList'}
                                        selectedData={forwarder} // 选中值
                                        showValue="name"
                                        searchName="name"
                                        multiple={false}
                                        columns={_SelectColumns}
                                        // onChange={values => this.getValue(values, 'forwarder')}
                                        id="forwarder"
                                        allowClear={true}
                                        scrollX={200}
                                    />
                                </AntdFormItem>
                            </Col>
                        </Row>
                        <Row {...editRow}>
                            <Col {...editCol}>
                                <AntdFormItem label={transferLanguage('Delivery.field.transportType', language)}
                                    code="transportType" {...commonParams}
                                    initialValue={selectedRows.length == 1 ? transportType : ''}
                                    rules={[{ required: true }]}
                                >
                                    <AdSelect data={dictObject[allDictList.transportType]} payload={{ code: allDictList.transportType }} />
                                </AntdFormItem>
                            </Col>
                        </Row>
                    </AntdForm>
                </AdModal>}
            </Fragment>
        );
    }
}
