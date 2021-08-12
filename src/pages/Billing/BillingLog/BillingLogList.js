import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Row, Col, Select, Dropdown, Icon, Menu } from 'antd';
import { editGutter, } from '@/utils/constans';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage, formatDate } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import { transferLanguage } from '@/utils/utils';
import AntdDatePicker from '@/components/AntdDatePicker';
import styles from './index.less';
import {
    allDispatchType,
    codes,
    selectList,
    routeUrl,
    columns,
    receiptTypeList,
    bizTypeList
} from './utils';
import { languages } from 'monaco-editor';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { Option } = Select;
import {allDictList } from '@/utils/common'

@ManageList

@connect(({ billingLog, loading, component, i18n }) => ({
    billingLog,
    billingLogList: billingLog.billingLogList,
    dictObject: component.dictObject,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],

}))
@Form.create()
export default class BillingLogList extends Component {
    className = 'billingLogList';
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
        const { ...value } = formValues

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
        const { billingLogList, loading, form, language } = this.props;
        const {
            listCol,
            expandForm,
            selectedRows,
            _columns,
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('billingLog.field.receiptNo', language)} code="receiptNo" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('billingLog.field.bizNo', language)} code="bizNo" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('billingLog.field.receiptType', language)} code="receiptType" {...commonParams}>
                    <AdSelect payload={{ code: allDictList.receiptType }} />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('shipping.field.bizType', language)} code="bizType" {...commonParams}>
                    <AdSelect payload={{ code: allDictList.billingType }} />
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
            selectedRows: selectedRows,
            
        };
        
        // 详情 参数
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                < TableButtons {...tableButtonsParams} />
                < StandardTable
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={billingLogList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                />
            </Fragment >
        );
    }
}
