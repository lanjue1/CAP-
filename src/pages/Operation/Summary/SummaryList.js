import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Row, Col, Select, } from 'antd';
import { editGutter, editCol } from '@/utils/constans';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage, formatDate } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import SearchSelect from '@/components/SearchSelect'
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import AntdInput from '@/components/AntdInput';
import AdModal from '@/components/AdModal'
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
    SelectColumns,
    receiptStatus,
    Year,
} from './utils';
import { languages } from 'monaco-editor';
import { allDictList } from '@/utils/common'

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ Summary, loading, component, i18n }) => ({
    Summary,
    summaryList: Summary.summaryList,
    dictObject: component.dictObject,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],

}))
@Form.create()
export default class SummaryList extends Component {
    className = 'SummaryList';
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
            warehouse: [],
            selectedRows: [],
            _columns: [],
            warehouseId: [],
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
        const { summaryDate, warehouseId, ...value } = formValues
        if (summaryDate && summaryDate.length > 0) {
            value.summaryDateStart = moment(summaryDate[0]).format('YYYY-MM-DD')
            value.summaryDateEnd = moment(summaryDate[1]).format('YYYY-MM-DD')
            value.summaryDateStart +=' 00:00:00'
            value.summaryDateEnd +=' 23:59:59'
        } else {
            value.summaryDateStart = ""
            value.summaryDateEnd = ""
        }
        if (warehouseId && warehouseId.length > 0) value.warehouseId = warehouseId[0].id

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
        const { dispatch, form: { getFieldValue } } = this.props;
        const { selectedRows, formValues } = this.state;
        let params = {
            type,
            ids: selectedRows ? selectedRows.map(v => v.id) : []
        };
        const param = { props: this.props, payload: formValues };
        if (type == 'initSnapshot') params.ids = ''
        if (type === 'createSummary') {
            // const warehouse=getFieldValue('warehouse')
            const { warehouse } = this.state
            const summaryMonth = getFieldValue('summaryMonth')
            params = {
                type,
                warehouseId: warehouse ? warehouse[0].id : '',
                summaryMonth: moment(summaryMonth).format(monthFormat)
            }
        }
        dispatch({
            type: 'Summary/abledSnapshot',
            payload: params,
            callback: res => {
                selectList({ ...param });
                type === 'createSummary' && this.setState({
                    visible: false
                })
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
        const { summaryList, loading, form, language } = this.props;
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
            <AntdFormItem label={transferLanguage('Summary.field.summaryNo', language)} code="summaryNo" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('Summary.field.warehouse', language)} code="warehouseId" {...commonParams}>
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
                />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('Summary.field.summaryDate', language)} code="summaryDate" {...commonParams}>
                    < AntdDatePicker mode='range' />
                </AntdFormItem>,
            ],
            [
                // <AntdFormItem label={transferLanguage('Summary.field.summaryYear', language)} code="summaryYear" {...commonParams}>
                //    <Select placeholder={transferLanguage('Common.field.select', language)} allowClear={true}>
                //       {Year.map(v=>(<Option value={v}>{v}</Option>))}
                //    </Select>
                // </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Summary.field.beReceipt', language)} code="beReceipt" {...commonParams}>
                    <AdSelect payload={{ code: allDictList.Summary_Be_receipt }} />

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
                        code={codes.confirm}
                        onClick={() => this.abledStatus('confim')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('ASN.button.confirm', this.props.language)} />
                    <AdButton
                        code={codes.createReceipt}
                        onClick={() => this.abledStatus('createReceipt')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('ASN.button.createReceipt', this.props.language)} />
                    <AdButton
                        code={codes.revocation}
                        onClick={() => this.abledStatus('revocation')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Summary.button.revocation', this.props.language)} />
                    <AdButton
                        code={codes.revocation}
                        onClick={() => this.setState({ visible: true })}
                        // disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Summary.button.createSummary', this.props.language)} />
                </Button.Group>

            ),
            selectedRows: selectedRows,

        };

        // 详情 参数
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />

                < TableButtons {...tableButtonsParams} />
                < StandardTable
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={summaryList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}

                />
                {visible && <AdModal
                    visible={visible}
                    title={transferLanguage('Summary.button.createSummary', language)}
                    onOk={() => this.abledStatus('createSummary')}
                    onCancel={() => this.setState({ visible: false })}
                >
                    <Row {...editGutter}>
                        <Col {...editCol}>
                            <AntdFormItem label={transferLanguage('partData.field.warehouse', language)}
                                width={'180'}
                                code="warehouse"
                                rules={[{ required: true, message: ' ' }]}
                                {...commonParams}
                            >
                                <SearchSelect
                                    dataUrl={'wms-warehouse/selectWmsWarehouseList'}
                                    selectedData={this.state.warehouse} // 选中值
                                    showValue="code"
                                    searchName="keyWord"
                                    multiple={false}
                                    columns={SelectColumns}
                                    onChange={values => this.getValue(values, 'warehouse')}
                                    id="warehouse"
                                    allowClear={true}
                                    scrollX={200}
                                />
                            </AntdFormItem>
                        </Col>
                        <Col {...editCol}>
                            <AntdFormItem label={transferLanguage('Summary.button.summaryMonth', language)}
                                code='summaryMonth'
                                rules={[{ required: true, message: ' ' }]}
                                {...commonParams}
                            >
                                <MonthPicker month placeholder="Select Month" />
                            </AntdFormItem>
                        </Col>
                    </Row>
                </AdModal>}
            </Fragment >
        );
    }
}
