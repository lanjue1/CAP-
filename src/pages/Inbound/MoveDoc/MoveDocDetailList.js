import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Spin, Tabs } from 'antd';
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
import EditPage from '@/components/EditPage';
import DetailPage from '@/components/DetailPage';
import AntdForm from '@/components/AntdForm';

import { transferLanguage, columnConfiguration } from '@/utils/utils'
import SearchSelect from '@/components/SearchSelect';
import {
    formItemFragement,
} from '@/utils/common';
import {
    allDispatchType,
    codes,
    selectDetailList,
    columnsDetail,
    columnsAllot,
    columnsAllotOne,
    selectManualAllotList,
    selectModThirdList,
    columnsBin,
    routeUrl,
} from './utils';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;
const { TabPane } = Tabs;
const FormItem = Form.Item

@ManageList

@connect(({ MoveDoc, loading, component, i18n }) => ({
    moveDocDetailList: MoveDoc.moveDocDetailList,
    moveDocDetail: MoveDoc.moveDocDetail,
    moveDocDetailList: MoveDoc.moveDocDetailList,
    manualAllotList: MoveDoc.manualAllotList,
    cancelAllocationList: MoveDoc.cancelAllocationList,

    loading: loading.effects[allDispatchType.detail],
    language: i18n.language,
}))
@Form.create()
export default class MoveDocDetailList extends Component {
    className = 'MoveDocDetailList';
    constructor(props) {
        super(props);
        this.state = {
            currentId: '',
            formValues: {},
            detailId: '',
            visible: false,
            expandForm: false,
            selectedRows: [],
            selectedRowsMod: [],
            selectedRowsThird: [],
            _columnsDetail: [],
            _columnsAllot: [],
            _columnsAllotOne: [],
            moveId: '',
            binCode: [],
            _columnsBin: [],
            _key:1,
        };
    }
    componentDidMount() {
        const { match, form, dispatch } = this.props;

        const ID = match && match.params ? match.params.id : '';
        const moveId = match && match.params ? match.params.move : '';
        console.log('ID???', ID, match.params, moveId)
        // let ID=_ID.
        this.setState({
            currentId: ID,
            moveId
        });

        if (ID) {
            this.getSelectDetails(ID);
            const params = { props: this.props, payload: { moveId: ID } };
            selectDetailList(params);
            selectManualAllotList({
                props: this.props, payload: { referenceCode: moveId, binTypeCodeArr: ["RECEIVE", "QUALITY"] }
            });
            selectModThirdList({ props: this.props, payload: { moveId: ID } })
            this.setState({
                disabled: true,

            });
        } else {
            form.resetFields();
        }
        this.changeTitle(columnsDetail, '_columnsDetail')
        this.changeTitle(columnsAllot, '_columnsAllot')
        this.changeTitle(columnsAllotOne, '_columnsAllotOne')
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
    //查询详情
    getSelectDetails = ID => {
        this.props.dispatch({
            type: allDispatchType.detail,
            payload: { id: ID },
            callback: data => {
                this.setState({
                    // senders: [{ id: data.senderId }],
                    // beUseRule: data.beUseRule,
                });
            },
        });
    };

    /**
     * form 查找条件 重置
     */
    handleFormReset = () => {
        const { currentId, moveId } = this.state
        const { form, } = this.props
        const props = { props: this.props };
        this.setState({
            formValuesMod: {},
        });
        form.resetFields();
        // saveAllValues({ payload: { formValues: {} }, ...props });
        selectManualAllotList({ ...props, payload: { referenceCode: moveId, binTypeCodeArr: ["RECEIVE", "QUALITY"] } });
    };

    /**
     * form 查找条件 查询
     */
    handleSearch = formValues => {
        const { currentId, moveId } = this.state
        const { form } = this.props
        form.validateFields((err, formValues) => {
            if (err) return;
            const values = {
                ...formValues,
                referenceCode: moveId,
                binTypeCodeArr: ["RECEIVE", "QUALITY"]
            };
            // console.log('RECEIVE01====',values)
            this.setState({ formValuesMod: formValues })
            const params = { props: this.props, payload: values };
            selectManualAllotList(params);
            this.setState({ formValues: formValues })
        })
    };
    /**
     * table 表格 分页操作
     */
    handleStandardTableChange = param => {
        const { formValues, currentId, moveId } = this.state;
        const values = {
            ...formValues,
            referenceCode: moveId,
            binTypeCodeArr: ["RECEIVE", "QUALITY"],
            ...param
        };
        selectManualAllotList({ payload: values, props: this.props });
    };
    //分页 第三个表格
    handleStandardTableChangeThird = (param) => {
        const { selectedRowsThird } = this.props
        selectModThirdList({ props: this.props, payload: { ids: selectedRowsThird.map(v => v.id), ...param } })
    }
    //第三个表 选中行
    handleSelectRowsThird = (rows) => {
        this.setState({
            selectedRowsThird: rows,
        });
    }
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
    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };
    handleAllot = () => {
        const { visible } = this.state
        this.setState({ visible: !visible })
    }
    //取消分配
    handleCancel = () => {
        const { selectedRowsThird,moveId, currentId } = this.state
        const { dispatch } = this.props
        dispatch({
            type: allDispatchType.cancelAllot,
            payload: { ids: selectedRowsThird.map(v => v.id) },
            callback: () => {
                this.setState({selectedRowsThird:[]})
                selectModThirdList({ props: this.props, payload: { moveId: currentId } })
                selectManualAllotList({
                    props: this.props, 
                    payload: {
                        referenceCode: moveId,
                        binTypeCodeArr: ["RECEIVE", "QUALITY"]
                    }
                })
                
                // selectMoveDocDetailList({ props: this.props, payload: { moveId: currentId,} })
            }
        })
    }
    //手工分配 确认按钮
    allotConfirm = () => {
        const { currentId, moveId, checkIdsMod, selectedRowsMod, visible, binCode } = this.state
        const { dispatch, form: { getFieldValue }, } = this.props

        const binId = getFieldValue('binId') || binCode
        const allocatedQuantity = getFieldValue('allocatedQuantity')
        console.log('//手工分配 确认按钮---', binCode, binId)
        if (binId.length == 0 || !allocatedQuantity) return
        let params = {
            binId: binId[0]?.id,
            allocatedQuantity,
            moveId: currentId,
            inventoryId: checkIdsMod,
        }
        dispatch({
            type: allDispatchType.manualAllot,
            payload: params,
            callback: (res) => {

                this.setState({
                    visible: !visible,
                    selectedRowsMod: []
                })
                selectModThirdList({ props: this.props, payload: { moveId: currentId } })
                selectManualAllotList({
                    props: this.props, 
                    payload: {
                        referenceCode: moveId,
                        binTypeCodeArr: ["RECEIVE", "QUALITY"]
                    }
                })
            }
        })
    }
    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };
    tabsChange=(key)=>{
        console.log('keyiiiii',key)
        this.setState({_key:key})
    }
    render() {
        const {
            moveDocDetailList,
            cancelAllocationList,
            loading,
            form,
            manualAllotList,
            moveDocDetail,
            detailId,
            match: { params }, language
        } = this.props;
        const {
            expandForm,
            selectedRows,
            _columnsDetail,
            _columnsAllot,
            _columnsBin,
            _columnsAllotOne,
            selectedRowsMod,
            visible,
            binCode,
            selectedRowsThird,
            _key,
        } = this.state;
        let currentId = params.id
        let details = moveDocDetail[currentId] || {};
        const editPageParams = {
            panelValue: [
                { key: transferLanguage('Common.field.baseInfo', language) },
                { key: transferLanguage('PutAwayDetail.title.putawayDetailList', language) },
            ],
        };
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        let modalData = selectedRowsMod[0] ? selectedRowsMod[0] : {}
        const formItem = [
            [
                <DetailPage label={transferLanguage("PutAwayDetail.field.moveNo", language)} value={details.moveNo} />,
                // <DetailPage label="asnIds" value={details.asnIds} />,
                <DetailPage label={transferLanguage("PutAwayDetail.field.asnNos", language)} value={details.asnNos} />,
            ],
            [
                <DetailPage label={transferLanguage("PutAwayDetail.field.status", language)} value={details.status} />,
                // <DetailPage label="warehouseId" value={details.warehouseId} />,
                <DetailPage label={transferLanguage("PutAwayDetail.field.planQuantity", language)} value={details.planQuantity} />,
            ],
            [
                <DetailPage label={transferLanguage("PutAwayDetail.field.allocatedQuantity", language)} value={details.allocatedQuantity} />,
                <DetailPage label={transferLanguage("PutAwayDetail.field.movedQuantity", language)} value={details.movedQuantity} />,
            ],
            [
                <DetailPage label={transferLanguage("PutAwayDetail.field.warehouseName", language)} value={details.warehouseName} />,

            ],
        ];
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('IQC.field.partName', language)}
                code="partName"
                {...commonParams}
            >

                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('InventoryList.field.binCode', language)}
                code="binCode"
                {...commonParams}
            >
                <Input />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('InventoryList.field.lotInvoiceNo', language)}

                    code="invoiceNo"
                    {...commonParams}
                >
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('InventoryList.field.referenceCode', language)}
                    code="referenceCode"
                    {...commonParams}
                >
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('InventoryList.field.lotNo', language)}
                    code="lotNo"
                    {...commonParams}
                >
                    <Input />
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
            rightButtonsFist: (
                <Button.Group >
                    <AdButton
                        onClick={() => this.handleAllot('Modal')}

                        disabled={selectedRowsMod.length > 0 ? false : true}
                        text={transferLanguage("PutAwayModal.button.manualAllocate", language)} />
                </Button.Group>
            ),
            selectedRows: selectedRows,
        };
        const operations = (
            <div style={{ display: 'flex' }}>
                <Button type="primary" disabled={selectedRowsMod.length > 0&&_key==1 ? false : true}
                    onClick={this.handleAllot} >{transferLanguage('PutAway.button.manualAllocate', language)}</Button>
                <Button type="primary" disabled={selectedRowsThird.length > 0&&_key==2 ? false : true}
                    onClick={this.handleCancel} >{transferLanguage('PutAway.button.cancelAllocate', language)}</Button>
            </div>
        )
        const formItemMod = [
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
                        onChange={values => this.getValue(values, 'binCode')}
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
            <EditPage {...editPageParams}>
                <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
                {/* <Fragment>
                    <SelectForm {...selectFormParams} />
                    <StandardTable
                        selectedRows={selectedRows}
                        onSelectRow={this.handleSelectRows}
                        loading={loading}
                        data={moveDocDetailList}
                        columns={_columnsDetail}
                        onPaginationChange={this.handleStandardTableChange}
                        expandForm={expandForm}
                        className={this.className}
                        code={codes.page}
                    />
                </Fragment> */}
                <Fragment>
                    <Tabs defaultActiveKey="1" tabBarExtraContent={operations} onChange={this.tabsChange} >
                        <TabPane tab={transferLanguage('PutAwayModal.title.manualAllocate', language)} key="1"  >
                            <Fragment>
                                {/* <SelectForm {...selectFormParams} /> */}
                                {/* <TableButtons {...tableButtonsParams} /> */}
                                <StandardTable
                                    selectedRows={selectedRowsMod}
                                    onSelectRow={this.handleSelectRowsMod}
                                    data={manualAllotList}
                                    columns={_columnsAllot}
                                    onPaginationChange={this.handleStandardTableChange}
                                    expandForm={expandForm}
                                    className={this.className}
                                    hideCheckAll={true}
                                />
                            </Fragment>
                            {
                                visible &&
                                <Modal
                                    visible={visible}
                                    title={transferLanguage("PutAwayModal.title.manualAllocate", language)}
                                    centered
                                    okText={transferLanguage('PutAwayModal.button.okText', language)}
                                    cancelText={transferLanguage('PutAwayModal.button.cancelText', language)}
                                    onOk={() => this.allotConfirm()}
                                    onCancel={() => this.handleAllot('Modal')}
                                    width={700}
                                    zIndex={100}
                                >
                                    <AntdForm >{formItemFragement(formItemMod)}</AntdForm>
                                </Modal>
                            }
                        </TabPane>
                        <TabPane tab={transferLanguage('PutAway.button.cancelAllocate', language)} key="2" >
                            <StandardTable
                                style={{ marginBottom: '10px' }}
                                // disabledRowSelected={true}
                                selectedRows={selectedRowsThird}
                                onSelectRow={this.handleSelectRowsThird}
                                data={cancelAllocationList}
                                columns={_columnsAllotOne}
                                onPaginationChange={this.handleStandardTableChangeThird}
                                expandForm={expandForm}
                                className={this.className}
                            // hideCheckAll={true}
                            />
                        </TabPane>
                    </Tabs>
                </Fragment>
            </EditPage>

        );
    }
}
