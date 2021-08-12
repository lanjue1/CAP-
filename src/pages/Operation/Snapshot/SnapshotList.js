import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Row, Col } from 'antd';
import { editGutter, } from '@/utils/constans';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage, formatDate } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import SearchSelect from '@/components/SearchSelect'
import AdModal from '@/components/AdModal';
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
    SelectColumns,
    
} from './utils';
import { languages } from 'monaco-editor';
import TextArea from 'antd/lib/input/TextArea';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ Snapshot, loading, component, i18n }) => ({
    Snapshot,
    snapshotList: Snapshot.snapshotList,
    dictObject: component.dictObject,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],

}))
@Form.create()
export default class SnapshotList extends Component {
    className = 'snapshotList';
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
            warehouseId:[],
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
        const { snapshotDate,warehouseId, ...value } = formValues
        if (snapshotDate && snapshotDate.length > 0) {
            value.startDate = moment(snapshotDate[0]).format('YYYY-MM-DD')
            value.endDate = moment(snapshotDate[1]).format('YYYY-MM-DD')
            value.startDate +=' 00:00:00'
            value.endDate +=' 23:59:59'
        } else {
            value.startDate = ""
            value.endDate = ""
        }
        if(warehouseId&&warehouseId.length>0) value.warehouseId=warehouseId[0].id
        const params = { props: this.props, payload: value };
        selectList(params);
        this.setState({ formValues })
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
        // params.ids = checkIds
        const param = { props: this.props, payload: formValues };
        if(type=='init'){
            const {form:{getFieldValue}}=this.props
            let _paymentTime=getFieldValue('startDate')
            if(!_paymentTime) return
            params.startDate=moment(_paymentTime).format(dateFormat)
        }
        dispatch({
            type: allDispatchType.abled,
            payload: params,
            callback: res => {
                console.log('res--99999999',res)
                selectList({ ...param });
                this.setState({visible:false})
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
        const { snapshotList, loading, form, language } = this.props;
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
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('ASNDetail.field.partNo', language)} code="partCode" {...commonParams}>
                <TextArea  rows={1}/>
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('Snapshot.field.snapshotDate', language)} code="snapshotDate" {...commonParams}>
                    <AntdDatePicker mode='range' />
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
                        code={codes.snapshot}
                        onClick={() => this.setState({visible:true})}
                        // disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Snapshot.button.initSnapshot', this.props.language)} />
                </Button.Group>

            ),
            selectedRows: selectedRows,

        };

        // 详情 参数
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                {/* <Form onSubmit={this.handleSearch} layout="inline" className="cus_searchFrom">
                    <Row gutter={editGutter}>
                        <Col {...listCol}>
                            <AntdFormItem label={transferLanguage('Snapshot.field.partCode', language)}
                                code="partCode"
                                {...commonParams}>
                                <Input />
                            </AntdFormItem>
                        </Col>
                        {this.operatorButtons({ textAlign: 'left', })}
                    </Row>
                </Form> */}
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={snapshotList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
               
                />
                {visible && <AdModal
                    visible={visible}
                    title={transferLanguage('Snapshot.button.initSnapshot', language)}
                    onOk={()=>this.abledStatus('init')}
                    onCancel={() => this.setState({ visible: false })}
                    width="500px"
                >
                    <AntdFormItem label={transferLanguage('Snapshot.button.initSnapshot',language)}
                        code='startDate'
                        initialValue={moment(new Date())}
                        rules= {[{ required: true,  }]}
                        {...commonParams}
                    >
                        <AntdDatePicker />
                    </AntdFormItem>
                </AdModal>}
            </Fragment>
        );
    }
}
