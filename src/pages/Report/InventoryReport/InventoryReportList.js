import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Form, Input, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes } from './utils';
import AdSelect from '@/components/AdSelect';
import { transferLanguage } from '@/utils/utils'
import { columns } from './utils'
const FormItem = Form.Item;
const { Option } = Select;
@ManageList
@connect(({ inventoryReport, common, component, loading ,i18n}) => ({
    inventoryReport,
    loading: loading.effects['inventoryReport/inventoryReportList'],
    dictObject: common.dictObject,
    searchValue: component.searchValue,
    language: i18n.language,

}))
@Form.create()
export default class InventoryReportList extends Component {
    state = {
        expandForm: false,
        selectedRows: [],
        checkId: '',
        checkIds: [],
        formValues: {},
        isAbled: '',
        _columns:[],
    };
    className = 'inventoryReport';

    // 详情字段
    


    // 模块渲染后的 todo
    componentDidMount() {

        this.getinventoryReportList();
        this.changeTitle(columns, '_columns')

    }
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
    // 调用接口获取数据
    getinventoryReportList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'inventoryReport/inventoryReportList',
            payload: params,
            callback: data => {
                if (!data) return;
                let valueList = [];
                data.map(v => {
                    const labels = ['senderId'];
                    labels.map(item => {
                        if (v[item] && !valueList.includes(v[item])) {
                            valueList.push(v[item]);
                            !searchValue[v[item]] &&
                                dispatch({
                                    type: 'component/querySearchValue',
                                    payload: {
                                        params: { id: v[item] },
                                        url: 'sms/sms-sender/viewSmsSenderDetails',
                                    },
                                });
                        }
                    });
                });
            },
        });
    };

    //重置
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        this.getinventoryReportList();
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

    //查询
    handleSearch = values => {
        const { ...value } = values;
        this.setState({
            formValues: value,
        });
        this.getinventoryReportList(value);
    };


    // 分页操作：改参数
    handleStandardTableChange = param => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
            ...formValues,
            ...param,
        };
        this.getinventoryReportList(params);
    };

    exportFile = e => {
        const { dispatch } = this.props;
        dispatch({
            type:'inventoryReport/exportFile',
            payload:{
                ...this.state.formValues
            }
        })

    }


    render() {
        const {
            loading,
            inventoryReport: { inventoryReportList },
            form,
            language
        } = this.props;
        const { getFieldDecorator } = form;
        const {
            selectedRows,
            checkId,
            _columns,
        } = this.state;

        // 设置查询条件
        const firstFormItem = (
            <FormItem label={transferLanguage('InventoryReport.field.po',language)}>
                {getFieldDecorator('po')(<Input placeholder="" />)}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label={transferLanguage('InventoryReport.field.so',language)}>
                {getFieldDecorator('so')(<Input placeholder="" />)}
            </FormItem>

        );

        // secondForm 参数
        const otherFormItem = [
            [<FormItem label={transferLanguage('InventoryReport.field.fruPn',language)}>
                {getFieldDecorator('fruPn')(<Input placeholder="" />)}
            </FormItem>],
            [<FormItem label={transferLanguage('InventoryReport.field.commodityCode',language)}>
                {getFieldDecorator('commodityCode')(<Input placeholder="" />)}
            </FormItem>,
                'operatorButtons']
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
        };
        const tableButtonsParams = {
            show: true,
        rightButtons: (<Button onClick={(e) => this.exportFile(e)} >{transferLanguage('Common.field.export',language)}</Button>),
        };
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={inventoryReportList}
                    columns={_columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={this.state.expandForm}
                    className={this.className}
                    code={codes.page}
                />
            </Fragment>
        );
    }
}