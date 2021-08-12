import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Row, Col } from 'antd';
import router from 'umi/router';
import moment, { lang } from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import AdModal from '@/components/AdModal';
import AntdForm from '@/components/AntdForm';
import prompt from '@/components/Prompt';
import { editGutter, listCol } from '@/utils/constans';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import SearchSelect from '@/components/SearchSelect';
import { formItemFragement, formatPrice } from '@/utils/common';
import { transferLanguage } from '@/utils/utils'

import {
    allDispatchType,
    codes,
    selectList,
    selectManualAllotList,

    columns,
    columnsAllot,
    columnsBin,
    routeUrl
} from './utils';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ MoveDoc, loading, component, i18n }) => ({

    moveDocList: MoveDoc.moveDocList,
    manualAllotList: MoveDoc.manualAllotList,
    dictObject: component.dictObject,
    searchValue: component.searchValue,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class MoveDocList extends Component {
    className = 'MoveDocList';
    constructor(props) {
        super(props);
        this.state = {
            formValues: {},
            formValuesMod: {},
            detailId: '',
            visible: false,
            expandForm: false,
            selectedRows: [],
            checkIds: [],
            moveId: [],

            visibleMod: false,
            selectedRowsMod: [],
            checkIdsMod: [],
            binCode: [],
            _columns: [],
            _columnsAllot: [],
            _columnsBin: [],

        };
    }
    componentDidMount() {
        selectList({ props: this.props });
        this.changeTitle(columnsBin, '_columnsBin')
        this.changeTitle(columnsAllot, '_columnsAllot')
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
    // modal form重置
    handleFormResetMod = () => {
        const { moveId } = this.state
        const { form, } = this.props
        const props = { props: this.props };
        this.setState({
            formValuesMod: {},
        });
        form.resetFields();
        // saveAllValues({ payload: { formValues: {} }, ...props });
        selectManualAllotList({ ...props, payload: { referenceCode: moveId[0] } });
    };
    // modal form 查询
    handleSearchMod = formValues => {
        const { moveId } = this.state
        const { form } = this.props
        form.validateFields((err, formValues) => {
            if (err) return;
            const values = {
                ...formValues,
                referenceCode: moveId[0]
            };
            // console.log('RECEIVE01====',values)
            this.setState({ formValuesMod: formValues })
            const params = { props: this.props, payload: values };
            selectManualAllotList(params);
            this.setState({ formValues: formValues })
        })
    };
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
     * Modal table 表格 分页操作 
     */
    handleStandardTableChangeMod = param => {
        const { formValuesMod } = this.state;
        selectManualAllotList({ payload: { ...formValuesMod, ...param }, props: this.props });

    };
    /**
     *  table 表格 分页操作 
     */
    handleStandardTableChange = param => {
        const { formValues } = this.state;
        selectList({ payload: { ...formValues, ...param }, props: this.props });

    };

    // 选中行
    handleSelectRows = rows => {
        let ids = [];
        let moveId = [];
        if (Array.isArray(rows) && rows.length > 0) {
            rows.map((item, i) => {
                ids.push(item.id);
                moveId.push(item.moveNo)
            });
        }
        this.setState({
            selectedRows: rows,
            checkIds: ids,
            moveId,
        });
    };
    //modal 选中行
    handleSelectRowsMod = rows => {
        let ids = [];
        if (this.state.selectedRowsMod.length > 0 && rows.length > 0) {
            rows = rows.filter(v => v.id !== this.state.selectedRowsMod[0].id)
        }
        this.setState({
            selectedRowsMod: rows,
        });
        rows[0] && this.setState({
            checkIdsMod: rows[0].id ? rows[0].id : ''
        })

    };
    putawayTask = () => {
        router.push(`/inbound/putawayTask/putawayTaskList/${this.state.checkIds[0]}?type=putaway`)
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
    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };
    print = () => {
        const { selectedRows, checkId, formValues } = this.state;
        let id = selectedRows[0]?.id
        router.push(`/print/${id}/PUTAWAY`);
    }

    // 自动分配、作业下发、取消下发
    btnStatus = (type) => {
        const { dispatch } = this.props
        const { selectedRows, formValues } = this.state
        let _type
        switch (type) {
            case 'cancelAllot':
                _type = allDispatchType.cancelAllot;

                break;
            case 'selfAllot':
                _type = allDispatchType.selfAllot;

                break;
            case 'confim':
                _type = allDispatchType.confim;
                break;
            case 'cancel':
                _type = allDispatchType.cancel;
                break;
        }
        // console.log('type!!!!!!', type, _type)
        const params = { props: this.props, payload: formValues };
        dispatch({
            type: _type,
            payload: { ids: selectedRows.map(v => v.id) },
            callback: (res) => {
                selectList(params);
                this.setState({
                    selectedRows: []
                })
            }
        })
    }
    // 手动分配
    handleAllot = (type) => {
        const { visibleMod, visible, moveId, selectedRows, checkIds } = this.state
        const { form } = this.props
        if (type) {
            this.setState({ visibleMod: !visibleMod })
        } else {
            if (selectedRows.length > 1) {
                prompt({ content: '手工分配只允许选择一条数据', type: 'warn' })
                return
            }

            router.push(`${routeUrl.edit}/${selectedRows[0].id}&${selectedRows[0].moveNo}`)
            // this.setState({ visible: !visible }, () => {
            //     if (this.state.visible) {
            //         // this.setState({
            //         //     formValues: {},
            //         // });
            //         form.resetFields()
            //         selectManualAllotList({ props: this.props, payload: { referenceCode: moveId[0] } })
            //     }
            // })
        }
    }
    //手工分配 确认按钮
    allotConfirm = () => {
        const { checkIds, checkIdsMod, selectedRowsMod, visibleMod } = this.state
        const { dispatch, form: { getFieldValue }, } = this.props
        const binId = getFieldValue('binId')[0].id
        const allocatedQuantity = getFieldValue('allocatedQuantity')
        let params = {
            binId,
            allocatedQuantity,
            moveId: checkIds[0],
            inventoryId: checkIdsMod,
        }
        dispatch({
            type: allDispatchType.manualAllot,
            payload: params,
            callback: (res) => {

                this.setState({
                    visibleMod: !visibleMod,
                    selectedRowsMod: []
                })
                selectManualAllotList({ props: this.props, payload: { referenceCode: moveId[0] } })

            }
        })

    }

    render() {
        const { moveDocList, manualAllotList, loading, form, language } = this.props;
        const { expandForm, selectedRows, binCode, visible, visibleMod, selectedRowsMod } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        let getFieldDecorator = form.getFieldDecorator
        // const form2=Form.create()
        let modalData = selectedRowsMod[0] ? selectedRowsMod[0] : {}
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('PutAway.field.moveNo', language)} code="moveNo" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('PutAway.field.asnNos', language)} code="asnNo" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('PutAway.field.warehouseName', language)} code="warehouseName" {...commonParams}>
                    <Input />
                </AntdFormItem>,

            ],
            [

                'operatorButtons'
            ],
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
        const firstFormItem_1 = (
            <FormItem label={transferLanguage('PutAwayModal.field.binCode', language)} code="binCode"  {...commonParams}>
                <Input />
            </FormItem>
        );
        const secondFormItem_1 = (
            <FormItem label={transferLanguage("PutAwayModal.field.itemName", language)} code="partName"   {...commonParams}>
                <Input />
            </FormItem>
        );
        const otherFormItem_1 = [
            [
                <FormItem label={transferLanguage("PutAwayModal.field.invoiceNo", language)} code="invoiceNo"   {...commonParams}>
                    <Input />
                </FormItem>,

            ],
            [
                <FormItem label={transferLanguage("PutAwayModal.field.referenceCode", language)} code="referenceCode"   {...commonParams}>
                    <Input />
                </FormItem>,
                <FormItem label={transferLanguage("PutAwayModal.field.lotNo", language)} code="lotNo"   {...commonParams}>
                    <Input />
                </FormItem>,

            ],
            ['operatorButtons', <></>]
        ];
        const selectFormParams_1 = {
            firstFormItem: firstFormItem_1,
            secondFormItem: secondFormItem_1,
            otherFormItem: otherFormItem_1,
            form,
            col: { md: 8, sm: 24 },
            className: this.className,
            handleFormReset: this.handleFormResetMode,
            handleSearch: this.handleSearchMod,
            toggleForm: this.toggleForm,

            // code: codes.select,
        };

        const tableButtonsParams = {

            buttons: (
                <Button.Group disabled={selectedRows.length > 0 ? false : true}>
                    <AdButton
                        code={codes.manual}
                        onClick={() => this.handleAllot()}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('PutAway.button.manualAllocate', language)} />
                    <AdButton
                        code={codes.auto}
                        onClick={() => this.btnStatus('selfAllot')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage("PutAway.button.autoAllocate", language)} />
                    {/* <AdButton
                        code={codes.cancel}
                        onClick={() => this.btnStatus('cancelAllot')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('PutAway.button.cancelAllocate', language)} /> */}
                    <AdButton
                        code={codes.taskPutaway}
                        onClick={() => this.putawayTask()}
                        disabled={selectedRows.length === 1 ? false : true}
                        text={transferLanguage('base.prompt.putawayTask', language)}
                    />
                    <AdButton
                        code={codes.print}
                        onClick={() => this.print()}
                        disabled={selectedRows.length === 1 ? false : true}
                        text={transferLanguage('base.prompt.print', language)}
                    />
                </Button.Group>
            ),
            selectedRows: selectedRows,

        };

        const tableButtonsModel = {
            buttons: (
                <Button.Group disabled={selectedRows.length > 0 ? false : true}>
                    <AdButton
                        onClick={() => this.handleAllot('Modal')}
                        disabled={false}
                        disabled={selectedRowsMod.length > 0 ? false : true}
                        text={transferLanguage("PutAwayModal.button.manualAllocate", language)} />
                </Button.Group>
            ),
            selectedRows: selectedRows,

        };
        const formItem = [
            [
                <AntdFormItem label={transferLanguage("PutAwayModal.field.itemCode", language)} code="partCode"
                    initialValue={modalData?.partCode}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("PutAwayModal.field.itemName", language)} code="partName"
                    initialValue={modalData?.partName}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage("PutAwayModal.field.lotUom", language)} code="lotUom"
                    initialValue={modalData?.lotUom}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,

                <AntdFormItem label={transferLanguage("PutAwayModal.field.allocatable", language)} code="allocatable"
                    initialValue={modalData?.allocatable}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage("PutAwayModal.field.bin", language)} code="binId"
                    rules={[{ required: true }]}
                    {...commonParams}>
                    <SearchSelect
                        dataUrl={'/wms-warehouse-bin/selectWmsWarehouseBinList'}
                        selectedData={binCode} // 选中值
                        showValue="code"
                        searchName="code"
                        multiple={false}
                        columns={columnsBin}
                        onChange={values => this.getValue(values, 'code')}
                        id="binId"
                        allowClear={true}
                        scrollX={200}
                        payload={{ binType: "STORAGE", warehouseId: modalData.warehouseId }}
                    />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("PutAwayModal.field.allotQty", language)} code="allocatedQuantity"
                    rules={[{ required: true }]}
                    {...commonParams}>
                    <Input />
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
                    data={moveDocList}
                    columns={columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                    // rowType ={'radio'}
                    hideCheckAll={true}
                />
                {/* <MoveDocModal visible={visible} handleAllot={this.handleAllot}
                 selectId={selectedRows.map(v=>v.id)} /> */}
                {visible &&
                    <Modal
                        visible={visible}
                        title={transferLanguage("PutAwayModal.title.manualAllocateList", language)}
                        centered
                        onOk={() => this.handleAllot()}
                        onCancel={() => this.handleAllot()}
                        width={800}
                        zIndex={10}
                    // style={{ left: 100 }}
                    >
                        <div>
                            {/* <SelectForm {...selectFormParams_1} /> */}
                            <div style={{ display: 'flex', justifyContent: 'flexStart' }}>
                                <Form layout="inline">
                                    <Row {...editGutter}>
                                        <Col {...listCol}>
                                            <FormItem label={transferLanguage('IQC.field.partName', language)} code="partName"  >
                                                {getFieldDecorator('partName')(<Input />)}
                                            </FormItem>
                                        </Col>
                                        <Col {...listCol}>
                                            <FormItem label={transferLanguage('InventoryList.field.binCode', language)} code="binCode"  >
                                                {getFieldDecorator('binCode')(<Input />)}
                                            </FormItem>
                                        </Col>
                                        <Col {...listCol}>
                                            <FormItem label={transferLanguage('InventoryList.field.lotInvoiceNo', language)} code="invoiceNo"  >
                                                {getFieldDecorator('invoiceNo')(<Input />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row {...editGutter}>
                                        <Col {...listCol}>
                                            <FormItem label={transferLanguage('InventoryList.field.referenceCode', language)} code="referenceCode" >
                                                {getFieldDecorator('referenceCode')(<Input />)}
                                            </FormItem>
                                        </Col>
                                        <Col {...listCol}>
                                            <FormItem label={transferLanguage('InventoryList.field.lotNo', language)} code="lotNo"  >
                                                {getFieldDecorator('lotNo')(<Input />)}
                                            </FormItem>
                                        </Col>
                                        <Col {...listCol}>
                                            <Button.Group style={{ top: '43px' }}>
                                                <AdButton type="primary" onClick={this.handleSearchMod} text={transferLanguage('base.prompt.search', language)} />
                                                <AdButton onClick={this.handleFormResetMod} text={transferLanguage('base.prompt.reset', language)} />
                                            </Button.Group>
                                        </Col>
                                    </Row>
                                    {/* <FormItem label={transferLanguage('IQC.field.partName',language)} code="partName"  >
                                        {getFieldDecorator('partName')(<Input />)}
                                    </FormItem>
                                    <FormItem label={transferLanguage('InventoryList.field.binCode',language)} code="binCode"  >
                                        {getFieldDecorator('binCode')(<Input />)}
                                    </FormItem>
                                    <FormItem label={transferLanguage('InventoryList.field.lotInvoiceNo',language)} code="invoiceNo"  >
                                        {getFieldDecorator('invoiceNo')(<Input />)}
                                    </FormItem>
                                    <FormItem label={transferLanguage('InventoryList.field.referenceCode',language)} code="referenceCode" >
                                        {getFieldDecorator('referenceCode')(<Input />)}
                                    </FormItem>
                                    <FormItem label={transferLanguage('InventoryList.field.lotNo',language)} code="lotNo"  >
                                        {getFieldDecorator('lotNo')(<Input />)}
                                    </FormItem> */}


                                </Form>

                            </div>
                            <TableButtons {...tableButtonsModel} />
                            <StandardTable
                                // disabledRowSelected={true}
                                selectedRows={selectedRowsMod}
                                onSelectRow={this.handleSelectRowsMod}
                                data={manualAllotList}
                                columns={columnsAllot}
                                onPaginationChange={this.handleStandardTableChangeMod}
                                expandForm={expandForm}
                                className={this.className}
                                hideCheckAll={true}
                            />
                            {
                                visibleMod &&
                                <Modal
                                    visible={visibleMod}
                                    title={transferLanguage("PutAwayModal.title.manualAllocate", language)}
                                    centered
                                    okText={transferLanguage('PutAwayModal.button.okText', language)}
                                    cancelText={transferLanguage('PutAwayModal.button.cancelText', language)}
                                    onOk={() => this.allotConfirm()}
                                    onCancel={() => this.handleAllot('Modal')}
                                    width={700}
                                    zIndex={100}
                                >
                                    {/* <AntdForm >{formItemFragement(formItemBaseInfo)}</AntdForm> */}
                                    <AntdForm >{formItemFragement(formItem)}</AntdForm>
                                </Modal>
                            }

                        </div>
                    </Modal>
                }

            </Fragment>
        );
    }
}
