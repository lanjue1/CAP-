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
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import { transferLanguage } from '@/utils/utils'
import AntdDatePicker from '@/components/AntdDatePicker';

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

@connect(({ InventoryLog, loading, i18n }) => ({

    inventoryLogList: InventoryLog.inventoryLogList,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class InventoryLogList extends Component {
    className = 'InventoryLogList';
    constructor(props) {
        super(props);
        this.state = {
            formValues: {},
            detailId: '',
            visible: false,
            expandForm: false,
            selectedRows: [],
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
        if (!formValues) return;
        const { createTime, ...value } = formValues
        if (createTime && createTime.length > 0) {
            value.createTimeStart = moment(createTime[0]).format('YYYY-MM-DD');
            value.createTimeEnd = moment(createTime[1]).format('YYYY-MM-DD');
            value.createTimeStart +=' 00:00:00'
            value.createTimeEnd +=' 23:59:59'
        } else {
            value.createTimeStart = ''
            value.createTimeEnd = ''
        }
        const params = { props: this.props, payload: value };
        selectList(params);
        this.setState({ formValues: value })
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

    //启用、禁用：
    abledStatus = (type, isSingle) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {};
        params.ids = isSingle ? [checkId] : checkIds;
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

    render() {
        const { inventoryLogList, loading, form, language } = this.props;
        const {
            expandForm,
            selectedRows,
            _columns
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('InventoryLog.field.lotSoi', language)} code="lotSoi" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('InventoryList.field.partCode', language)} code="partCode" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('InventoryLog.field.operationType', language)} code="operationType" {...commonParams}>
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('InventoryLog.field.operationNo', language)} code="operationNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('InventoryLog.field.operator', language)} code="operator" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('InventoryLog.field.origin', language)} code="origin" {...commonParams}>
                    <Input />
                </AntdFormItem>,

            ],
            [
                <AntdFormItem label={transferLanguage('InventoryLog.field.destination', language)} code="destination" {...commonParams}>
                    <Input />

                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('InventoryLog.field.asnNo', language)} code="asnNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('InventoryLog.field.createTime', language)} code="createTime" {...commonParams}>
                    <AntdDatePicker mode="range" placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createEndTime', language)]}  />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('InventoryLog.field.logType', language)} code="logType" {...commonParams}>
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
            handleAdd: this.handleAdd,
            // code: codes.addEndorse,

            // rightButtonsFist: (
            //     <AdButton
            //         type="primary"
            //         style={{ marginLeft: 8 }}
            //         onClick={() => this.add()}
            //         text="新增"
            //         // code={codes.addEndorse}
            //     />

            // ),
            buttons: (
                <Button.Group>
                    <AdButton
                        onClick={() => this.abledStatus('disabled')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Common.field.disable', language)} />
                    <AdButton
                        onClick={() => this.abledStatus('enable')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Common.field.enable', language)} />
                </Button.Group>

            ),
            selectedRows: selectedRows,

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
                    data={inventoryLogList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    bottomBtnHeight={42}
                />
            </Fragment>
        );
    }
}




