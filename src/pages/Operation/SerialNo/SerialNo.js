import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment'
import { Row, Col, Card, Form, Input, Select, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import ManageList from '@/components/ManageList';
import SelectForm from '@/components/SelectForm';
import SearchSelect from '@/components/SearchSelect';
import AdSelect from '@/components/AdSelect';
import { transferLanguage } from '@/utils/utils';
import AntdFormItem from '@/components/AntdFormItem';
import AntdDatePicker from '@/components/AntdDatePicker';
import {allDictList,queryDict} from '@/utils/common';
import {
    selectList,
} from '../MoveTask/utils';
import {SelectColumns} from './utils'
const formatDate='YYYY-MM-DD'
@ManageList
@connect(({ serialNo, common, component, loading, i18n }) => ({
    serialNo,
    loading: loading.effects['serialNo/fetchSerialNoList'],
    dictObject: common.dictObject,
    searchValue: component.searchValue,
    language: i18n.language
}))
@Form.create()
export default class ReceivingRecord extends Component {
    state = {
        expandForm: false,
        selectedRows: [],
        checkId: '',
        checkIds: [],
        warehouseId:[],
    };
    className = 'serialNo';

    //列表 列
    columns = [{
        title: '#',
        dataIndex: 'index',
        render: (text, record, index) => (<span>{index + 1}</span>),
        width: 50
    }, {
        title: transferLanguage('SN.field.stockId', this.props.language),//'序列号',
        width: 150,
        dataIndex: 'stockId',
    },
    {
        width: 100,
        title: transferLanguage('Delivery.field.status', this.props.language),//'状态',
        dataIndex: 'status',
    },
    {
        width: 150,
        title: transferLanguage('partData.field.warehouse', this.props.language),//'状态',
        dataIndex: 'warehouseCode',
    },
    {
        title: transferLanguage('MoveTaskLog.field.serialNo', this.props.language),//'序列号',
        width: 100,
        dataIndex: 'serialNo',
    },
    {
        title: transferLanguage('SN.field.originalSn', this.props.language),//'序列号',
        width: 100,
        dataIndex: 'originalSerialNo',
    },
    {
        title: transferLanguage('Delivery.field.storageDate', this.props.language),//'序列号',
        width: 180,
        dataIndex: 'storageDate',
    },
    {
        title: transferLanguage('ASNRecord.field.itemCode', this.props.language),//'货品料号code',
        dataIndex: 'partNo',
        render: text => <span title={text}>{text}</span>,
        width: 100,
    },
    {
        title: transferLanguage('ASNDetail.field.partDesc', this.props.language),//'货品料号code',
        dataIndex: 'partDesc',
        render: text => <span title={text}>{text}</span>,
        width: 180,
    },
    {
        title: transferLanguage('partData.field.itmeType', this.props.language),//'货品料号code',
        dataIndex: 'partStatus',
        render: text => <span title={text}>{text}</span>,
        width: 180,
    },
    {
        title: transferLanguage('TrackList.field.sourceCode', this.props.language),//'货品料号code',
        dataIndex: 'snSource',
        render: text => <span title={text}>{text}</span>,
        width: 130,
    },
    {
        title: transferLanguage('CoDetailList.field.deliveryNo', this.props.language),//'收货日期',
        width: 100,
        dataIndex: 'deliveryNo',
    },
    {
        title: transferLanguage('InventoryLog.field.lotLocation', this.props.language),//'收货日期',
        width: 100,
        dataIndex: 'lotLocation',
    },
    {
        title: transferLanguage('InventoryLog.field.snSource', this.props.language),//'收货日期',
        width: 100,
        dataIndex: 'snSource',
    },
    {
        title: transferLanguage('Delivery.field.soId', this.props.language),//'收货人',
        width: 150,
        dataIndex: 'soId',
    },

    {
        title: transferLanguage('ASNRecord.field.ASNNo', this.props.language),//'ASN No',
        dataIndex: 'asnNo',
        render: text => <span title={text}>{text}</span>,
        width: 150,
    },
    {
        title: transferLanguage('MoveTaskLog.field.lotCartonNo', this.props.language),//'容器号',
        dataIndex: 'lotCartonNo',
        render: text => <span title={text}>{text}</span>,
        width: 100,
    },
    {
        title: transferLanguage('ASNRecord.field.createBy', this.props.language),//'创建人',
        width: 100,
        dataIndex: 'createBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('ASNRecord.field.createTime', this.props.language),//'创建时间',
        width: 180,
        dataIndex: 'createTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },

    {
        title: transferLanguage('ASNRecord.field.updateBy', this.props.language),//'更新人',
        width: 100,
        dataIndex: 'updateBy',
    },
    {
        title: transferLanguage('ASNRecord.field.updateTime', this.props.language),//'更新时间',
        width: 180,
        dataIndex: 'updateTime',
    },
    {
        title: transferLanguage('ASNRecord.field.remarks', this.props.language),//'备注',
        width: 100,
        dataIndex: 'remarks',
    },
        // {
        //     title: transferLanguage('ASNRecord.field.ASNDetailId', this.props.language),//'出库日期',
        //     width: 100,
        //     dataIndex: 'asnDetailId',
        // },
        // {
        //     title: transferLanguage('Delivery.field.shipDate', this.props.language),//'出库日期',
        //     width: 100,
        //     dataIndex: 'shipDate',
        // },
        // {
        //     width: 100,
        //     title: transferLanguage('Delivery.field.shipWorker', this.props.language),//'出库人',
        //     dataIndex: 'shipWorker',
        // },
        // {
        //     width: 100,
        //     title: transferLanguage('ASNDetail.field.poDetailId', this.props.language),//'出库人',
        //     dataIndex: 'poDetailId',
        // },
        // {
        //     width: 100,
        //     title: transferLanguage('Delivery.title.DeliveryDetail', this.props.language),//'出库人',
        //     dataIndex: 'deliveryDetailId',
        // },
        // {
        //     width: 100,
        //     title: transferLanguage('ASNDetail.field.poDetailId', this.props.language),//'出库人',
        //     dataIndex: 'poDetailId',
        // },

        // {
        //     title: transferLanguage('ASNRecord.field.beShipAdd', this.props.language),//'是否出库追加',
        //     width: 100,
        //     dataIndex: 'beShipAdd',
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        // },
        // {
        //     title: transferLanguage('ASNRecord.field.lotNo', this.props.language),//'批次号',
        //     dataIndex: 'lotNo',
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        //     width: 100,
        // },
        // {
        //     title: transferLanguage('InventoryLog.field.lotInvoiceNo', this.props.language),//'发票号',
        //     dataIndex: 'lotInvoiceNo',
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        //     width: 100,
        // },
        // {
        //     title: transferLanguage('InventoryLog.field.lotUom', this.props.language),//'单位',
        //     dataIndex: 'lotUom',
        //     width: 100,
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        // },
        // {
        //     title: transferLanguage('InventoryLog.field.lotCoo', this.props.language),//'原厂国',
        //     dataIndex: 'lotCoo',
        //     width: 100,
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        // },
        // {
        //     title: transferLanguage('InventoryLog.field.lotSoi', this.props.language),//'SOI号',
        //     dataIndex: 'lotSoi',
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        //     width: 100,
        // },
        // {
        //     title: transferLanguage('InventoryLog.field.lotDnNo', this.props.language),//'联想发货单号',
        //     dataIndex: 'lotDnNo',
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        //     width: 100,
        // },
        // {
        //     title: transferLanguage('ASNRecord.field.lotInfo', this.props.language),//'批次属性json',
        //     dataIndex: 'lotInfo',
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        //     width: 100,
        // },
        // {
        //     title: transferLanguage('InventoryLog.field.lotLocation', this.props.language),//'库别',
        //     dataIndex: 'lotLocation',
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        //     width: 100,
        // },
        // {
        //     title: transferLanguage('InventoryLog.field.lotVendorCode', this.props.language),//'供应商编号',
        //     dataIndex: 'lotVendorCode',
        //     width: 100,
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        // },
        // {
        //     title: transferLanguage('InventoryLog.field.lotVendorName', this.props.language),//'供应商名称',
        //     dataIndex: 'lotVendorName',
        //     render: text => <span>{text}</span>,
        //     width: 100,
        // },

    ];
    componentDidMount() {
        this.getReceivingList();
        const allDict=[
            allDictList.serialNoStatus
        ]
        queryDict({props:this.props,allDict})
    }

    getReceivingList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'serialNo/fetchSerialNoList',
            payload: params,
        });
    };

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };
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
        this.getReceivingList();
    };

    /**
     * form 查找条件 查询
     */
    handleSearch = formValues => {
        if (!formValues) return;
        const {storageDate,warehouseId,...value}=formValues
        if(storageDate&&storageDate.length>0){
            value.storageDateStart=moment(storageDate[0]).format('YYYY-MM-DD')
            value.storageDateEnd=moment(storageDate[1]).format('YYYY-MM-DD')
            value.storageDateStart +=' 00:00:00'
            value.storageDateEnd +=' 23:59:59'
        }else{
            value.storageDateStart=''
            value.storageDateEnd=''
        }
        if(warehouseId&&warehouseId.length>0) value.warehouseId=warehouseId[0].id
        this.getReceivingList({ ...value })
        this.setState({ value })
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
    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    }


    // 分页操作：改参数
    handleStandardTableChange = param => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
            ...formValues,
            ...param,
        };
        this.getReceivingList(params);
    };

    render() {
        const {
            loading,
            serialNo: { serialNoList },
            form,
            language,
            dictObject
        } = this.props;
        const { getFieldDecorator } = form;
        const {
            selectedRows,
            expandForm,
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('SN.field.stockId', language)} code="stockId" {...commonParams}>
                <Input />
            </AntdFormItem>

        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('Common.field.status', this.props.language)} code="status" {...commonParams}>
                <AdSelect data={dictObject[allDictList.serialNoStatus]} payload={{code:allDictList.serialNoStatus}} />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('partData.field.warehouse', this.props.language)} code="warehouseId" {...commonParams}>
                   <SearchSelect
                        dataUrl={'wms-warehouse/selectWmsWarehouseList'}
                        selectedData={this.state.warehouseId} // 选中值
                        showValue="code"
                        searchName="code"
                        multiple={false}
                        columns={SelectColumns}
                        // onChange={values => this.getValue(values, 'name')}
                        id="code"
                        allowClear={true}
                        scrollX={200}
                    // payload={{ businessType: ['INBOUND'] }}
                    />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('MoveTaskLog.field.serialNo', this.props.language)} code="serialNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('SN.field.originalSn', this.props.language)} code="originalSerialNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Delivery.field.storageDate', this.props.language)} code="storageDate" {...commonParams}>
                    <AntdDatePicker mode="range" />
                </AntdFormItem>,
            ],
            [<AntdFormItem label={transferLanguage('ASNRecord.field.itemCode', language)} code="partNo" {...commonParams}>
                <Input />
            </AntdFormItem>,
            <AntdFormItem label={transferLanguage('Delivery.field.soId', language)} code="soId" {...commonParams}>
                <Input />
            </AntdFormItem>,
            <AntdFormItem label={transferLanguage('ASNRecord.field.ASNNo', language)} code="asnNo" {...commonParams}>
                <Input />
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
            // code: codes.select,
            quickQuery: true
        };
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={serialNoList}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={true}
                    className={this.className}
                    bottomBtnHeight={42}
                />
            </Fragment>
        );
    }
}
