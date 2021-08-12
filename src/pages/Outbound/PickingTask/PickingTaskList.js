import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Radio, Switch } from 'antd';
import styles from '@/pages/Operate.less';
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
import AdModal from '@/components/AdModal';

import {
    allDispatchType,
    selectList,
    routeUrl,
    columns,
    columnsUser,
    columnsBin,
    cortonColumns
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
            visible2: false,
            tokenValue: '',
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
        };
    }
    componentDidMount() {
        this.setState({
            type: this.props.location.query.type
        })
        this.setState({
            urlId: this.props.match.params.id
        })
        this.getList()
        this.changeTitle(cortonColumns, 'cortonColumns')
        // this.changeTitle(columnsUser, '_columnsUser')
        // this.changeTitle(columnsBin, '_columnsBin')
    }


    getList = (param = {}) => {
        selectList({
            props: this.props,
            payload: { ...param, id: this.props.match.params.id },
            callback: (data) => {
                data.map(item => {
                    this.setState({
                        ['sourceLotCartonNoData' + item.id]: [{ cartonNo: item.lotCartonNo }]
                    })
                })
            }
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
        this.getList(param)
    };

    // 选中行
    handleSelectRows = rows => {
        let ids = [];
        if (Array.isArray(rows) && rows.length > 0) {
            rows.map((item, i) => {
                ids.push(item.id);
                item.beCreatedSerial = true
            });
        }

        this.setState({
            selectedRows: rows,
            checkIds: ids,
            selectData: rows
        });
    };

    saveData = () => {
        const { selectData } = this.state
        let param = {
            confirms: selectData,
            type: 'Picking'
        }
        for (let i = 0; i < selectData.length; i++) {
            if (this.state[`sourceLotCartonNoData${selectData[i].id}`]) {
                param.confirms[i].sourceLotCartonNo = this.state[`sourceLotCartonNoData${selectData[i].id}`][0].cartonNo
            }
        }
        this.props.dispatch({
            type: 'pickingTask/pickingTaskSave',
            payload: param
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
        let value = key === 'beCreatedSerial' ? e : e.target.value
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

    getSelectData = (data, key) => {
        let id = data.id
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
                this.getList()
            }
        })
    }
    handleCancel = () => {
        const { visible } = this.state
        this.setState({ visible: !visible })
    }

    markSkip = () => {
        const { visible2 } = this.state

        this.setState({ visible2: !visible2 })
    }
    handleOk = () => {
        const { dispatch } = this.props
        const { visible2 } = this.state

        dispatch({
            type: 'pickingTask/markSkip',
            payload: { id: this.state.checkIds[0], tokenValue: this.state.tokenValue },
            callback: () => {
                this.setState({ visible2: !visible2 })
                this.getList()
            }
        })
    }
    handleCancel = () => {
        const { visible2 } = this.state

        this.setState({ visible2: !visible2 })
    }
    inputChange(e) {
        this.setState({
            tokenValue: e.target.value
        })
    }

    render() {
        const { pickingTaskList, loading, form, language } = this.props;
        const {
            expandForm,
            selectedRows,
            visible,
            visible2,
            sysName,
            binCode,
            urlId,
            _columnsUser,
            _columnsBin,
            checkIds,
            selectData,
            sourceLotCartonNoData,
            tokenValue
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('MoveTastList.field.type', language)} code="type" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('MoveTastList.field.createDate', language)} code="createDate" {...commonParams}>
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
                title: transferLanguage('MoveTastList.field.type', language),
                dataIndex: 'type',
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
                title: transferLanguage('MoveTastList.field.pickingQty', language),
                dataIndex: 'pickingQty',
                width: 120,
                render: (text, record) => {
                    return (<Input
                        onChange={(e) => this.onChange(e, 'pickingQty', record.id)}
                        disabled={checkIds.indexOf(record.id) === -1}
                        value={checkIds.indexOf(record.id) !== -1 ? this.getSelectData(record, 'pickingQty') : record.pickingQty} />)
                }
            }, {
                title: transferLanguage('MoveTastList.field.sourceLotCartonNo', language),
                dataIndex: 'sourceLotCartonNo',
                width: 120,
                render: (text, record) => {
                    return (<SearchSelect
                        dataUrl={'wms-move-task/selectPickingPutawayCartonList'}
                        selectedData={this.state[`sourceLotCartonNoData${record.id}`]} // 选中值
                        showValue="cartonNo"
                        searchName="carton"
                        multiple={false}
                        columns={cortonColumns}
                        onChange={values => this.getValue(values, `sourceLotCartonNoData${record.id}`)}
                        id="carton"
                        allowClear={true}
                        scrollX={200}
                        payload={{ id: record.id }}
                    />)
                }
            },
            {
                title: transferLanguage('MoveTastList.field.serialNo', language),
                dataIndex: 'serialNo',
                width: 120,
                render: (text, record) => {
                    return (<Input
                        onChange={(e) => this.onChange(e, 'serialNo', record.id)}
                        disabled={this.getSelectData(record, 'beCreatedSerial')}
                        value={checkIds.indexOf(record.id) !== -1 ? this.getSelectData(record, 'serialNo') : text} />)
                }
            }
        ];

        const tableButtonsParams = {
            // handleAdd: this.handleAdd,
            buttons: (
                <Button.Group>
                    <AdButton
                        onClick={() => this.markSkip()}
                        disabled={selectedRows.length === 1 ? false : true}
                        text={transferLanguage('pickingTaskList.button.markSkip', language)} />
                    <AdButton
                        onClick={() => this.saveData()}
                        text={transferLanguage('pickingTaskList.button.taskAll', language)} />
                </Button.Group>

            ),
            rightButtons: (<AdButton
                onClick={this.saveData}
                disabled={selectData.length < 1}
                text={transferLanguage('PickingTaskList.button.pickingConfirm', language)} />),
            selectedRows: selectedRows,
        };
        const formItem = [
            [
                <AntdFormItem label={transferLanguage('pickingTaskList.field.workQty', language)} code="workQuantity"
                    rules={[{ required: true }]}
                    {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('pickingTaskList.field.moveTo', language)} code="toBinId"
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
                <AntdFormItem label={transferLanguage('ASNRecord.field.workerName', language)} code="workUserId"
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
                {visible &&
                    <Modal
                        visible={visible}
                        title={transferLanguage('pickingTaskList.button.workConfirm', language)}
                        centered
                        onOk={() => this.handleConfirm()}
                        onCancel={() => this.handleCancel()}
                        width={600}
                        zIndex={10}
                    >
                        <AntdForm >{formItemFragement(formItem)}</AntdForm>
                    </Modal>
                }
                <AdModal
                    visible={visible2}
                    title={transferLanguage('Token.field.tokenValue', this.props.language)}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div className={styles.tableListForm}>
                        <Form layout="">
                            <Form.Item
                                label={transferLanguage('Token.field.tokenValue', this.props.language)}
                            >
                                <Input onChange={(e) => this.inputChange(e)} />
                            </Form.Item>

                        </Form>
                        <div style={{ paddingLeft: '80px' }}>{transferLanguage('Token.field.reminder', this.props.language)}</div>
                    </div>
                </AdModal>
            </Fragment>
        );
    }
}
