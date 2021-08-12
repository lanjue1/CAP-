import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import ManageList from '@/components/ManageList';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import SearchSelect from '@/components/SearchSelect';
import { transferLanguage } from '@/utils/utils'
import { formItemFragement, formatPrice } from '@/utils/common';
import AdButton from '@/components/AdButton';

import {
    allDispatchType,
    selectList,
    routeUrl,
    columns,
    columnsUser,
    columnsBin,
    codes,
} from './utils';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ MoveTask, loading, component, i18n }) => ({

    moveTaskList: MoveTask.moveTaskList,

    language: i18n.language,
    loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class MoveTaskList extends Component {
    className = 'MoveTaskList';
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
            _columnsUser:[],
            _columnsBin:[],
        };
    }
    componentDidMount() {
        selectList({ props: this.props });
        this.changeTitle(columns, '_columns')
        this.changeTitle(columnsUser, '_columnsUser')
        this.changeTitle(columnsBin, '_columnsBin')
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
    abledStatus = (type) => {
        const { visible ,checkIds} = this.state 
        const {dispatch } =this.props
        let params={
            type,
            id:checkIds[0]
        }
        // console.log('type????',type,params.type,checkIds[0])
        if(type){
            dispatch({
                type:'MoveTask/abledStatus',
                payload:params,
                callback:data=>{
                }
            })
        }else{
         this.setState({ visible: !visible })
        }
    }
    handleConfirm = () => {
        const { dispatch, form: { getFieldValue }, } = this.props
        const { selectedRows, formValues } = this.state
        let params = {
            workQuantity: getFieldValue('workQuantity'),
            targetBin: getFieldValue('toBinId')[0].id,
            workUserId: getFieldValue('workUserId')[0].id,
            id: selectedRows[0].id
        }

        dispatch({
            type: allDispatchType.confirm,
            payload: params,
            callback: () => {
                this.setState(pre => ({ visible: !pre.visible }))
                selectList({ payload: formValues, props: this.props });
            }
        })
    }
    handleCancel = () => {
        const { visible } = this.state
        this.setState({ visible: !visible })
    }

    render() {
        const { moveTaskList, loading, form, language } = this.props;
        const {
            expandForm,
            selectedRows,
            visible,
            sysName,
            binCode,
            _columns,
            _columnsUser,
            _columnsBin
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('MoveTastList.field.lotNo', language)} code="lotNo" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('MoveTastList.field.lotSoi', language)} code="lotSoi" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('MoveTaskList.field.status', language)} code="status" {...commonParams}>
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
            // handleAdd: this.handleAdd,
            buttons: (
                <Button.Group>
                    <AdButton
                        code={codes.workConfirm}
                        onClick={() => this.abledStatus()}
                        // disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('MoveTaskList.button.workConfirm', language)} />
                    <AdButton
                        code={codes.maskSkip}
                        onClick={() => this.abledStatus('markSkip')}
                        disabled={selectedRows.length === 1 ? false : true}
                        text={transferLanguage('MoveTaskList.button.markSkip', language)} />
                </Button.Group>

            ),
            selectedRows: selectedRows,

        };
        const formItem = [
            [
                <AntdFormItem label={transferLanguage('MoveTaskList.field.workQty',language)} code="workQuantity"
                    rules={[{ required: true }]}
                    {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('MoveTaskList.field.moveTo',language)} code="toBinId"
                    rules={[{ required: true }]}
                    {...commonParams}>
                    <SearchSelect
                        dataUrl={'/wms-warehouse-bin/selectWmsWarehouseBinList'}
                        selectedData={binCode} // 选中值
                        showValue="code"
                        searchName="code"
                        multiple={false}
                        columns={_columnsBin}
                        onChange={values => this.getValue(values, 'code')}
                        id="binId"
                        allowClear={true}
                        scrollX={200}
                        payload={{ typeCode: 'STORAGE' }}
                    />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('ASNRecord.field.workerName',language)} code="workUserId"
                    rules={[{ required: true }]}
                    {...commonParams}>
                    <SearchSelect
                        dataUrl={'/mds-user/selectOperatorUserList'}
                        selectedData={sysName} // 选中值
                        showValue="sysName"
                        searchName="keyWord"
                        multiple={false}
                        columns={_columnsUser}
                        onChange={values => this.getValue(values, 'workId')}
                        id="workId"
                        allowClear={true}
                        scrollX={200}
                    // payload={{ typeCode: 'STORAGE' }}
                    />
                </AntdFormItem>,
            ],
        ]

        // 详情 参数
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={moveTaskList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                />
                {visible &&
                    <Modal
                        visible={visible}
                        title={transferLanguage('MoveTaskList.button.workConfirm',language)}
                        centered
                        onOk={() => this.handleConfirm()}
                        onCancel={() => this.handleCancel()}
                        width={600}
                        zIndex={10}
                    >
                        <AntdForm >{formItemFragement(formItem)}</AntdForm>
                    </Modal>
                }
            </Fragment>
        );
    }
}
