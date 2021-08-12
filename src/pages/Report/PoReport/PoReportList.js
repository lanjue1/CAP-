import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Form, Input, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, columns } from './utils';
import AdSelect from '@/components/AdSelect';
import { transferLanguage, columnConfiguration } from '@/utils/utils'


const FormItem = Form.Item;
@ManageList
@connect(({ poReport, common, component, loading }) => ({
    poReport,
    loading: loading.effects['poReport/poReportList'],
    dictObject: common.dictObject,
    searchValue: component.searchValue,
}))
@Form.create()
export default class PoReportList extends Component {
    state = {
        expandForm: false,
        selectedRows: [],
        checkId: '',
        checkIds: [],
        formValues: {},
        isAbled: '',
    };
    className = 'PoReportList';

    // 模块渲染后的 todo
    componentDidMount() {
        columnConfiguration(columns, '_columns')
        this.getPoReportList();

    }

    // 调用接口获取数据
    getPoReportList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'poReport/poReportList',
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
        this.getPoReportList();
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
        this.getPoReportList(value);
    };


    // 分页操作：改参数
    handleStandardTableChange = param => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
            ...formValues,
            ...param,
        };
        this.getPoReportList(params);
    };

    exportFile = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'poReport/exportFile',
            payload: {
                ...this.state.formValues
            }
        })

    }


    render() {
        const {
            loading,
            poReport: { poReportList },
            form,
            language
        } = this.props;
        const { getFieldDecorator } = form;
        const {
            selectedRows,
            checkId,
        } = this.state;

        // 设置查询条件
        const firstFormItem = (
            <FormItem label="poNo">
                {getFieldDecorator('poNo')(<Input  />)}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label="So">
                {getFieldDecorator('So')(<Input  />)}
            </FormItem>

        );

        // secondForm 参数
        const otherFormItem = [
            [<FormItem label="FRU Pn">
                {getFieldDecorator('fruPn')(<Input  />)}
            </FormItem>],
            [<FormItem label="Commodity Code">
                {getFieldDecorator('commodityCode')(<Input  />)}
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
                    data={poReportList}
                    columns={columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={true}
                    className={this.className}
                    code={codes.page}
                />
            </Fragment>
        );
    }
}