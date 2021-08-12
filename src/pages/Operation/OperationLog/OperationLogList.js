import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Row, Col } from 'antd';
import { editGutter, } from '@/utils/constans';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage, formatDate } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import AdModal from '@/components/AdModal';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import { transferLanguage } from '@/utils/utils';
import AntdDatePicker from '@/components/AntdDatePicker';
import styles from '../../index.less';
import {
    allDispatchType,
    codes,
    selectList,
    routeUrl,
    columnsBilling,
    BillingStatus,

} from './utils';
import { languages } from 'monaco-editor';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatTime='YYYY-MM-DD HH:mm:ss';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ OperationLog, loading, component, i18n }) => ({
    OperationLog,
    selectList: OperationLog.selectList,
    dictObject: component.dictObject,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],

}))
@Form.create()
export default class OperationLogList extends Component {
    className = 'OperationLogList';
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
        this.changeTitle(columnsBilling, '_columns')
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
        const { createDate, ...value } = formValues
        if (createDate && createDate.length > 0) {
            value.createStartDate = moment(createDate[0]).format(dateFormat)
            value.createEndDate = moment(createDate[1]).format(dateFormat)
            value.createStartDate +=' 00:00:00'
            value.createEndDate +=' 23:59:59'
        } else {
            value.createStartDate = ""
            value.createEndDate = ""
        }
        const params = { props: this.props, payload: value };
        selectList(params);
        this.setState({ formValues })
    };
    // handleSearch = e => {
    //     e.preventDefault();
    //     const { form } = this.props;
    //     form.validateFields((err, fieldsValue) => {
    //         if (err) return;
    //         const values = {
    //             ...fieldsValue,
    //         };
    //         this._handleSearch(values);
    //     });
    // };

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
        if(type=='billing'){
            const {form:{getFieldValue}}=this.props
            let _paymentTime=getFieldValue('paymentTime')
            if(!_paymentTime) return
            params.paymentTime=moment(_paymentTime).format(dateFormatTime)
        }
        const param = { props: this.props, payload: formValues };
        dispatch({
            type: 'OperationLog/abledOperate',
            payload: params,
            callback: () => {
                // console.log('res--99999999', res)
                selectList({ ...param });
                type=='billing'&&this.setState({visible:false})
            },
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
        const { selectList, loading, form, language } = this.props;
        const {
            listCol,
            expandForm,
            selectedRows,
            _columns,
            visible,
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('OperationLog.field.source', language)} code="source" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('OperationLog.field.type', language)} code="type" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('OperationLog.field.url', language)} code="url" {...commonParams}>
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('OperationLog.field.json', language)} code="requestJson" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Common.field.createBy', language)} code="createBy" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Common.field.createDate', language)} code="createDate" {...commonParams}>
                    <AntdDatePicker mode="range" />
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
            // handleAdd: this.handleAdd,
            // code: codes.addEndorse,
            buttons: (
                <Button.Group>
                </Button.Group>

            ),
            selectedRows: selectedRows,
        };

        // 详情 参数
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                {/* < TableButtons {...tableButtonsParams} /> */}
                < StandardTable
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={selectList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                    bottomBtnHeight={true}
                />
                {visible && <AdModal
                    visible={visible}
                    title={transferLanguage('BuyBilling.button.billing', language)}
                    onOk={()=>this.abledStatus('billing')}
                    onCancel={() => this.setState({ visible: false })}
                    width="500px"
                >
                    <AntdFormItem label={transferLanguage('BuyBilling.button.billing',language)}
                        code='paymentTime'
                        initialValue={moment(new Date())}
                        rules= {[{ required: true,  }]}
                        {...commonParams}
                    >
                        <AntdDatePicker showTime/>
                    </AntdFormItem>
                </AdModal>}
            </Fragment >
        );
    }
}
