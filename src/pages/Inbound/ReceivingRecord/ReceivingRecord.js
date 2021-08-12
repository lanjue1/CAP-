import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';
import ManageList from '@/components/ManageList';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import TableButtons from '@/components/TableButtons';
import { transferLanguage, codes } from '@/utils/utils';
import SelectForm from '@/components/SelectForm';
import { queryDict, allDictList } from '@/utils/common';

const FormItem = Form.Item;

@ManageList
@connect(({ receivingRecord, common, component, loading, i18n }) => ({
    receivingRecord,
    loading: loading.effects['receivingRecord/fetchReceivingList'],
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
    };
    className = 'receivingRecord';

    //列表 列
    columns = [{
        title: '#',
        dataIndex: 'index',
        render: (text, record, index) => (<span>{index + 1}</span>),
        width: 50
    },
    {
        //标题
        title: transferLanguage('ASN.field.asnNo', this.props.language),//'ASN No',
        //数据字段
        dataIndex: 'asnNo',
        render: text => <span title={text}>{text}</span>,
        width: 160,
    },
    {
        title: transferLanguage('PoList.field.poNo', this.props.language),//'货品名称',
        dataIndex: 'poNo',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('ASNDetail.field.soNo', this.props.language),//'货品名称',
        dataIndex: 'soNo',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('ASNRecord.field.receivedPcsQty', this.props.language),//'收货数量',
        dataIndex: 'receivedPcsQty',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 120,

    },
    {
        title: transferLanguage('InventoryList.field.binCode', this.props.language),//'货品名称',
        dataIndex: 'receiveBin',
    },
    {
        title: transferLanguage('ASNRecord.field.itemCode', this.props.language),//'货品编码',
        dataIndex: 'partCode',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 150,
    },

    {
        title: transferLanguage('ASNRecord.field.itemName', this.props.language),//'货品名称',
        dataIndex: 'partName',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('ASNRecord.field.itemBarCode', this.props.language),//'货品条形码',
        dataIndex: 'partBarCode',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 120,
    },
    {
        title: transferLanguage('InventoryLog.field.partStatus', this.props.language),//'货品条形码',
        dataIndex: 'partStatus',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 120,
    },
    {
        title: transferLanguage('ASNRecord.field.receivedPackageUnit', this.props.language),//'收货包装单位',
        dataIndex: 'receivedPackageUnit',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 120,

    },
    {
        title: transferLanguage('ASNRecord.field.packageUnitQty', this.props.language),//'包装单位数量',
        dataIndex: 'packageUnitQty',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
   
    {
        title: transferLanguage('ASNRecord.field.receivedTime', this.props.language),//'收货时间',
        dataIndex: 'receivedTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 150,

    },
    {
        title: transferLanguage('ASNRecord.field.workerName', this.props.language),//'作业人员名字',
        dataIndex: 'workerName',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 120,

    },
    {
        title: transferLanguage('ASNRecord.field.remarks', this.props.language),//'备注',
        dataIndex: 'remarks',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },

    {
        title: transferLanguage('ASNRecord.field.createBy', this.props.language),//'创建人',
        dataIndex: 'createBy',
        render: text => <span>{text}</span>,
        width: 100,
    },
    {
        title: transferLanguage('ASNRecord.field.createTime', this.props.language),// '创建时间',
        dataIndex: 'createTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('ASNRecord.field.updateBy', this.props.language),//'更新人',
        dataIndex: 'updateBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('ASNRecord.field.updateTime', this.props.language),//'更新时间',
        dataIndex: 'updateTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    ];
    componentDidMount() {
        this.getReceivingList();
        const allDict = [
            allDictList.receivePartStatus,

        ]
        queryDict({ props: this.props, allDict })
    }
    //重置
	handleFormReset = () => {
		const { form, dispatch } = this.props;
		form.resetFields();
		this.setState({
			formValues: {},
		});
		this.getReceivingList();
	};
	//查询
	handleSearch = values => {
		const { date, ...value } = values;
		if (date) {
			value.createStartTime = moment(date[0]).format('YYYY-MM-DD');
			value.createEndTime = moment(date[1]).format('YYYY-MM-DD');
		}
		this.setState({
			formValues: value,
		});
		this.getReceivingList(value);
	};
    getReceivingList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'receivingRecord/fetchReceivingList',
            payload: params,
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
            receivingRecord: { receivingList },
            form,
            language,
            dictObject
        } = this.props;
        const { getFieldDecorator } = form;
        const {
            selectedRows,
            expandForm,
        } = this.state;
        const firstFormItem = (
            <FormItem label={transferLanguage('ASN.field.asnNo', language)}>
                {getFieldDecorator('asnNo')(<Input placeholder="" />)}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label={transferLanguage('PoList.field.poNo', language)}>
                {getFieldDecorator('poNo')(
                    <Input />
                )}
            </FormItem>
        );

        // secondForm 参数
        const otherFormItem = [
            [
                <FormItem label={transferLanguage('ASNDetail.field.soNo', language)}>
                    {getFieldDecorator('soNo')(
                        // <AdSelect
                        // 	data={dictObject[allDictList.orderType]}
                        // 	payload={{ code: allDictList.orderType }}
                        // />
                        <Input />

                    )}
                </FormItem>,
            ],
            [<FormItem label={transferLanguage('InventoryLog.field.partCode', language)}>
                {getFieldDecorator('partCode')(<Input placeholder="" />)}
            </FormItem>,
            <FormItem label={transferLanguage('InventoryLog.field.partStatus', language)}>
                {getFieldDecorator('partStatus')(
                    <AdSelect data={dictObject[allDictList.receivePartStatus]} payload={{ code: allDictList.receivePartStatus }} />
                )}
            </FormItem>,
            ],

            [
                'operatorButtons',
            ],
        ];
        const tableButtonsParams = {

            buttons: (
                <Button.Group>
                   
                </Button.Group>
            ),
            selectedRows: selectedRows,

        };

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
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={receivingList}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                />

            </Fragment>
        );
    }
}
