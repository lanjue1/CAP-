import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Radio, Switch } from 'antd';
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
    columnsUser,
    columnsBin,
    warehouseColumns
} from './utils';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ pickingTask, loading, component, i18n }) => ({
    pickingTaskList: pickingTask.pickingTaskList,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class pickingTaskList extends Component {
    className = 'pickingTaskList';
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
            _columnsUser: [],
            _columnsBin: [],
            type: '',
            selectData: [],
            checkIds: [],
            urlId: '',
            sourceLotCartonNoData: [],
            targetBinCodeData: []
        };
    }
    componentDidMount() {
        console.log('this.props', this.props)
        this.setState({
            type: this.props.location.query.type
        })
        this.setState({
            urlId: this.props.match.params.id
        })
        // selectList({ props: this.props, payload: { id: this.props.match.params.id } });
        this.getPutawayTask()
        this.changeTitle(warehouseColumns, 'warehouseColumns')
        // this.changeTitle(columnsUser, '_columnsUser')
        // this.changeTitle(columnsBin, '_columnsBin')

    }

    getPutawayTask = () => {
        this.props.dispatch({
            type: 'pickingTask/selectPickingTask',
            payload: { id: this.props.match.params.id },
            callback: data => {
                if (!data) return;
                console.log('data', data)
                for (let i = 0; i < data.length; i++) {
                    if (!data[i].toBinCode) return
                    this.getValue([{ code: data[i].toBinCode }], `targetBinCodeData${data[i].id}`)
                }
            },
        });
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
                item.splitCarton = true
            });
        }
        this.setState({
            selectedRows: rows,
            checkIds: ids,
            selectData: rows
        });
    };

    saveData = () => {
        const { selectData,formValues } = this.state
        let param = {
            confirms: selectData,
            type: 'Putaway'
        }
        for (let i = 0; i < selectData.length; i++) {
            if (this.state[`targetBinCodeData${selectData[i].id}`]) {
                param.confirms[i].targetBinCode = this.state[`targetBinCodeData${selectData[i].id}`][0].code
            }
        }
        this.props.dispatch({
            type: 'pickingTask/pickingTaskSave',
            payload: param,
            callback:()=>{
                selectList({ payload: { ...formValues}, props: this.props }); 
            }
        })
    }

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

    onChange = (e, key, id) => {
        const { selectData } = this.state
        let value = key === 'splitCarton' ? e : e.target.value
        let list = selectData
        for (let i = 0; i < list.length; i++) {
            if (id === list[i].id) {
                list[i][key] = value
            }
        }
        this.setState({
            selectData: list
        })
    }

    getSelectData = (id, key) => {
        const { selectData } = this.state
        for (let i = 0; i < selectData.length; i++) {
            if (id === selectData[i].id) {
                return selectData[i][key]
            }
        }
    }


    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };

    handleCancel = () => {
        const { visible } = this.state
        this.setState({ visible: !visible })
    }

    render() {
        const { pickingTaskList, loading, form, language } = this.props;
        const {
            expandForm,
            selectedRows,
            sysName,
            binCode,
            urlId,
            _columnsUser,
            _columnsBin,
            checkIds,
            selectData,
            sourceLotCartonNoData
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
                <AntdFormItem label={transferLanguage('pickingTaskList.field.status', language)} code="status" {...commonParams}>
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

        const columns = [
            {
                title: '#',
                dataIndex: 'index',
                render: (text, record, index) => (<span>{index + 1}</span>),
                width: 50
            },
            {
                title: transferLanguage('Picking.field.picking', language),
                dataIndex: 'moveNo',
                width: 120,
            },
            {
                title: transferLanguage('MoveTastList.field.partCode', language),
                dataIndex: 'partCode',
                width: 120,
            },
            {
                title: transferLanguage('MoveTastList.field.partStatus', language),
                dataIndex: 'partStatus',
                width: 120,
            },
            {
                title: transferLanguage('MoveTastList.field.unPickingQty', language),
                dataIndex: 'unPickingQty',
                width: 120,

            },
            {
                title: transferLanguage('MoveTastList.field.lotCartonNo', language),
                dataIndex: 'lotCartonNo',
                //是否显示type为from时的输入框，不写默认显示（用在新增编辑）
                width: 120,
            },
            {
                title: transferLanguage('MoveTastList.field.fromBinCode', language),
                dataIndex: 'fromBinCode',
                width: 120,

            },
            {
                title: transferLanguage('MoveTastList.field.sourceLotCartonNo', language),
                dataIndex: 'sourceLotCartonNo',
                //是否显示type为from时的输入框，不写默认显示（用在新增编辑）
                width: 120,
            },
            {
                title: transferLanguage('MoveTastList.field.splitCarton', language),
                dataIndex: 'splitCarton',
                width: 120,
                render: (text, record) => {
                    return (<Switch
                        disabled={checkIds.indexOf(record.id) === -1}
                        defaultChecked onChange={(e) => this.onChange(e, 'splitCarton', record.id)} />)
                }
            },
            {
                title: transferLanguage('MoveTastList.field.putawayQty', language),
                dataIndex: 'putawayQty',
                width: 120,
                render: (text, record) => {
                    return (<Input
                        onChange={(e) => this.onChange(e, 'putawayQty', record.id)}
                        disabled={checkIds.indexOf(record.id) === -1 || !this.getSelectData(record.id, 'splitCarton')}
                        value={checkIds.indexOf(record.id) !== -1 ? this.getSelectData(record.id, 'putawayQty') : text} />)
                }
            },
            {
                title: transferLanguage('MoveTastList.field.targetBinCode', language),
                dataIndex: 'targetBinCode ',
                width: 200,
                render: (text, record) => {
                    return (<SearchSelect
                        dataUrl={'wms-warehouse-bin/selectWmsWarehouseBinList'}
                        selectedData={this.state[`targetBinCodeData${record.id}`]} // 选中值
                        showValue="code"
                        searchName="code"
                        multiple={false}
                        columns={warehouseColumns}
                        onChange={values => this.getValue(values, `targetBinCodeData${record.id}`)}
                        id="warehouseId"
                        allowClear={true}
                        scrollX={200}
                        payload={{ warehouseId: record.warehouseId }}
                    />)
                }
            }
        ];

        const tableButtonsParams = {
            // handleAdd: this.handleAdd,
            buttons: (
                <Button.Group>
                    <AdButton
                        onClick={() => this.abledStatus('markSkip')}
                        disabled={selectedRows.length === 1 ? false : true}
                        text={transferLanguage('pickingTaskList.button.markSkip', language)} />
                </Button.Group>

            ),
            rightButtons: (<AdButton
                onClick={this.saveData}
                disabled={selectData.length < 1}
                text={transferLanguage('PutawayTaskList.button.pickingConfirm', language)} />),
            selectedRows: selectedRows,

        };

        let selectList = pickingTaskList[urlId] || []
        // 详情 参数
        return (
            <Fragment>
                {/* <SelectForm {...selectFormParams} /> */}
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={selectList}
                    columns={columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                />
            </Fragment>
        );
    }
}
