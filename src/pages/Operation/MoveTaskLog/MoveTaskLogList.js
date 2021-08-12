import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import SearchSelect from '@/components/SearchSelect';
import { transferLanguage } from '@/utils/utils'
import { formItemFragement, formatPrice } from '@/utils/common';

import {
    allDispatchType,

    selectList,
    routeUrl,
    columns,

} from './utils';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ MoveTaskLog, loading, i18n }) => ({

    moveTaskLogList: MoveTaskLog.moveTaskLogList,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class MoveTaskLogList extends Component {
    className = 'MoveTaskLogList';
    constructor(props) {
        super(props);
        this.state = {
            formValues: {},
            detailId: '',
            visible: false,
            expandForm: false,
            selectedRows: [],

            sysName: [],
            binCode: [],
            _columns: [],
        };
    }
    componentDidMount() {
        selectList({ props: this.props });
        this.changeTitle(columns, '_columns')

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
        const params = { props: this.props, payload: formValues };
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


    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };

    //作业确认
    abledStatus = () => {
        const { visible } = this.state
        this.setState({ visible: !visible })
    }
    handleConfirm = () => {
        const { dispatch, form: { getFieldValue }, } = this.props
        const { selectedRows } = this.state
        let params = {
            workQuantity: getFieldValue('workQuantity'),
            targetBin: getFieldValue('toBinId')[0].id,
            workUserId: getFieldValue('workUserId')[0].id,
            id: selectedRows[0].id
        }

        dispatch({
            type: allDispatchType.confirm,
            payload: params,
        })
    }
    handleCancel = () => {
        const { visible } = this.state
        this.setState({ visible: !visible })
    }

    render() {
        const { moveTaskLogList, loading, form, language } = this.props;
        const {
            expandForm,
            selectedRows,
            visible,
            sysName,
            binCode,
            _columns,
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('MoveTaskLog.field.fromReferenceCode', language)} code="fromReferenceCode" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('MoveTaskLog.field.itemName', language)} code="itemName" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('MoveTaskLog.field.lotInvoiceNo', language)} code="lotInvoiceNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('MoveTaskLog.field.lotNo', language)} code="lotNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('MoveTaskLog.field.moveDocNo', language)} code="moveDocNo" {...commonParams}>
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

        // 详情 参数
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                {/* <TableButtons {...tableButtonsParams} /> */}
                <StandardTable
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={moveTaskLogList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                // disabledSelectedRows={{ code: ['status'], value: ['CONFIRM'] }}
                // getCheckboxProps={record => {
                //     const status = record.status;
                //     const checked = status === 'CONFIRM';
                //     return !checked;
                // }}
                />

            </Fragment>
        );
    }
}
