import React, { Component } from 'react';
import { Col, DatePicker, Form, Input, Row, Select, } from 'antd';
import { connect } from 'dva';
import AdModal from '@/components/AdModal';
import moment from 'moment';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import SelectForm from '@/components/SelectForm';
import StandardTable from '@/components/StandardTable';
import { Status, Type, binStatus, Mode, codes, partType } from "../utils";
import { transferLanguage } from '@/utils/utils';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;
@connect(({ stockCount, component, i18n, loading }) => ({
    stockCount,
    loading: loading.models.stockCount,
    stockCountDetails: stockCount.stockCountDetails,
    dictObject: component.dictObject,
    language: i18n.language
}))
@Form.create()
export default class stockCountDetailsModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRows: [],
            expandForm: false,

        }
    }

    componentDidMount() {
        this.getSelectDetails()
    };

    //查询
    handleSearch = values => {
        const { ...value } = values;
        this.setState({
            formValues: value,
        });
        this.getSelectDetails(value);
    };

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };


    handleSelectRows = rows => {
        console.log('选择', rows);
        let ids = [];
        // if (Array.isArray(rows) && rows.length > 0) {
        //     rows.map((item, i) => {
        //         ids.push(item.id);
        //     });
        // }
        this.setState({
            selectedRows: rows,
            // checkIds: ids,
        });
    };

    //详情信息：
    getSelectDetails = (params = {}) => {
        this.props.dispatch({
            type: 'stockCount/selectWmsCountPlanInfo',
            payload: params,
            callback: data => {

            }
        });
    };

    getValue = (values, type) => {
        const { form } = this.props
        this.setState({
            [type]: values,
        });
        if (type == "partNo") {
            form.setFieldsValue({
                partDesc: values[0]?.name
            })
        }
    };

    saveInfo = () => {
        const { dispatch, detailId, modalEmpty } = this.props;
        dispatch({
            type: 'stockCount/insertWmsCountDetail',
            payload: { insertVOList: this.state.selectedRows, countPlanId: detailId },
            callback: () => {
                modalEmpty();
            }
        })
    };

    // 分页操作：改参数
    handleStandardTableChange = param => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
            ...formValues,
            ...param,
        };
        this.getSelectDetails(params);
    };


    render() {
        const {
            form: { getFieldDecorator },
            visible,
            language,
            loading,
            cancel,
            detailId,
            stockCount: { countPlanInfo },
            form
        } = this.props;

        const { selectedRows, expandForm } = this.state
        const selectList = countPlanInfo
        const firstFormItem = (
            <FormItem label={transferLanguage('StockCount.field.bin', language)}>
                {getFieldDecorator('binCode')(<Input placeholder="" />)}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label={transferLanguage('Common.field.partNo', language)}>
                {getFieldDecorator('partCode')(<Input placeholder="" />)}
            </FormItem>
        );

        const otherFormItem = [[<FormItem label={transferLanguage('StockCount.field.binStatus', language)}>
            {getFieldDecorator('binStatus')(
                <Select placeholder={transferLanguage('Common.field.select', language)} style={{ width: '100%' }} allowClear={true}>
                    {binStatus.map(v => {
                        return <Option value={v.code}>{v.value}</Option>;
                    })}
                </Select>
            )}
        </FormItem>],
        [
            <FormItem label={transferLanguage('StockCount.field.partType', language)}>
                {getFieldDecorator('partType')(
                    <Select placeholder={transferLanguage('Common.field.select', language)} style={{ width: '100%' }} allowClear={true}>
                        {partType.map(v => {
                            return <Option value={v.code}>{v.value}</Option>;
                        })}
                    </Select>
                )}
            </FormItem>,
            'operatorButtons',
        ],
        ]

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

        const Columns = [{
            title: '#',
            dataIndex: 'index',
            render: (text, record, index) => (<span>{index + 1}</span>),
            width: 50
        },
        {
            // 标题
            // title: '业务单号',
            title: transferLanguage('StockCount.field.bin', language),
            // 数据字段
            dataIndex: 'binCode',
            render: (text, record) => (
                <AdButton
                    text={text}
                    code={codes.detailEdit}
                    mode='a'
                    onClick={() => this.setState({ modalVisible: true, detailsId: record.id })}
                />

            ),
            width: 110
        },
        {
            // title: '状态',
            title: transferLanguage('StockCount.field.binStatus', language),
            dataIndex: 'binStatus',
            render: text => <span title={text}>{text}</span>,
            width: 80

        },
        {
            title: transferLanguage('InventoryReport.field.partNo', language),
            dataIndex: 'partCode',
            render: text => <span title={text}>{text}</span>,
            width: 120

        }, {
            title: transferLanguage('StockCount.field.partStatus', language),
            dataIndex: 'partStatus',
            render: text => <span title={text}>{text}</span>,
            width: 130

        },
        {
            // title:'料号描述'
            title: transferLanguage('StockCount.field.partDesc', language),
            dataIndex: 'partCommodityDesc',
            render: text => <AdSelect value={text} onlyRead={true} />,
            width: 200

        },
        {
            // title: '联想发货单号',
            title: transferLanguage('StockCount.field.cc', language),
            dataIndex: 'partCommodity',
            render: text => <span title={text}>{text}</span>,
            width: 120

        },

        {
            // title: '运输优先级',
            title: transferLanguage('StockCount.field.partType', language),
            dataIndex: 'partType',
            render: text => <AdSelect value={text} onlyRead={true} />,
            width: 80

        },
        {
            // title: 'pcs数',
            title: transferLanguage('StockCount.field.inventoryQty', language),
            dataIndex: 'inventoryQty',
            render: text => <AdSelect value={text} onlyRead={true} />,
            width: 80
        }]
        return (
            <div>
                <AdModal
                    visible={visible}
                    title={transferLanguage('PoDetailList.field.stockCountDetail', language)}
                    onOk={this.saveInfo}
                    onCancel={() => {
                        // modalEmpty();
                        cancel()
                    }}
                    width="80%"
                    style={{
                        maxWidth: 800,
                    }}
                >
                    <SelectForm {...selectFormParams} />
                    <StandardTable
                        selectedRows={selectedRows}
                        loading={loading}
                        data={selectList}
                        columns={Columns}
                        onSelectRow={this.handleSelectRows}
                        onPaginationChange={this.handleStandardTableChange}
                        expandForm={expandForm}
                        className={this.chassName}
                        code={codes.page}
                    />
                </AdModal>
            </div>
        );
    }
}
