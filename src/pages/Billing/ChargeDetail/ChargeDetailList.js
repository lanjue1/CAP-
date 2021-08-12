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
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import SearchSelect from '@/components/SearchSelect'
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
    SelectStatus,
    SelectType,
} from './utils';
import { queryDict, allDictList } from '@/utils/common'
import { languages } from 'monaco-editor';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ ChargeDetail, loading, component, i18n }) => ({
    ChargeDetail,
    chargeDetailList: ChargeDetail.chargeDetailList,
    dictObject: component.dictObject,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],

}))
@Form.create()
export default class ChargeDetailList extends Component {
    className = 'ChargeDetailList';
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
            selectedRowsOld:[],
            _columns: [],
            name: [],
            isSelectAll:false,

        };
    }
    componentDidMount() {
        selectList({ props: this.props });
        this.changeTitle(columns, '_columns')
        const allDict = [
            allDictList.receiptType
        ]
        queryDict({ props: this.props, allDict })
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
        const { shipTime,name, ...value } = formValues
        if (shipTime && shipTime.length > 0) {
            value.shipTimeStart = moment(shipTime[0]).format(dateFormat)
            value.shipTimeEnd = moment(shipTime[1]).format(dateFormat)
        } else {
            value.shipTimeStart = ""
            value.shipTimeEnd = ""
        }
        if(name&&name.length>0) value.name=name[0].code
        const params = { props: this.props, payload: value };
        selectList(params);
        this.setState({ formValues:value })
    };
    // handleSearch = e => {
    // 	e.preventDefault();
    // 	const { form} = this.props;
    // 	form.validateFields((err, fieldsValue) => {
    // 		if (err) return;
    // 		const values = {
    // 			...fieldsValue,
    // 		};
    // 		this._handleSearch(values);
    // 	});
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
        const {isSelectAll,}=this.state
        const {chargeDetailList}=this.props
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
        if(isSelectAll){
            rows.length<chargeDetailList.list.length
            this.setState({
                isSelectAll:false,
                selectedRows: rows,
            })
        }
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
        const param = { props: this.props, payload: formValues };

        dispatch({
            type: allDispatchType.abled,
            payload: params,
            callback: res => {
                console.log('res--99999999', res)
                if (res.code === 0) {
                    selectList({ ...param });
                }
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
    selectAllBtn=()=>{
        const {selectedRows}=this.state
        const {chargeDetailList}=this.props
        this.setState({
            selectedRowsOld:selectedRows,
            selectedRows:chargeDetailList.list,
            isSelectAll:true
        })

    }
    cancelAll=()=>{
        const {selectedRowsOld}=this.state
        this.setState({
            isSelectAll:false,
            selectedRows:selectedRowsOld
        })
    }
    render() {
        const { chargeDetailList, loading, form, language, dictObject } = this.props;
        const {
            listCol,
            expandForm,
            selectedRows,
            _columns,
            isSelectAll,
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('ChargeDetail.field.ledgerNo', language)} code="ledgerNo" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('CoDetailList.field.soDetailNo', language)} code="soDetailNo" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('ChargeDetail.field.chargeName', language)} code="name" {...commonParams}>
                    {/* <AdSelect data={dictObject[allDictList.receiptType]} payload={{ code: allDictList.receiptType }} /> */}
                    <SearchSelect
                        dataUrl={'bms-charge-detail/selectChargePrice'}
                        selectedData={this.state.name} // 选中值
                        showValue="name"
                        searchName="name"
                        multiple={false}
                        columns={SelectColumns}
                        onChange={values => this.getValue(values, 'name')}
                        id="name"
                        allowClear={true}
                        scrollX={200}
                    // payload={{ businessType: ['INBOUND'] }}
                    />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('Common.field.status', language)} code="status" {...commonParams}>
                    <AdSelect data={SelectStatus} isExist />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Common.field.type', language)} code="type" {...commonParams}>
                    <AdSelect data={SelectType} isExist />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Receipt.field.bizNo', language)} code="bizNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('ChargeDetail.field.billingNo', language)} code="billingNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
            ],
            ['operatorButtons'],
        ];
        const   selectFormParams = {
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
            // selectedLength:selectedRows.length, 
            // pagination:chargeDetailList.pagination,
            // selectAll:()=>this.selectAllBtn(),
            // cancelAll:()=>this.cancelAll(),
            // isSelectAll,
            
            buttons: (
                <Button.Group>
                    {/* <AdButton
                        onClick={() => this.abledStatus('CONFIRMED')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('ChargeDetail.field.chargeconfim', this.props.language)} /> */}
                    {/* <AdButton
                        onClick={() => this.abledStatus('CANCEL')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('ChargeDetail.field.chargeCancel', this.props.language)} /> */}
                    <AdButton
                        onClick={() => this.abledStatus('CANCEL')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('ChargeDetail.field.chargeCancel', this.props.language)} />
                </Button.Group>

            ),
            selectedRows: selectedRows,
        };
        // 详情 参数
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={chargeDetailList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                    
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
