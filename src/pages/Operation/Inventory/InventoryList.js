import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Row, Col } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdForm from '@/components/AntdForm';
import AntdInput from '@/components/AntdInput'
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import { formItemFragement, formatPrice, queryDict, allDictList } from '@/utils/common';
import { transferLanguage } from '@/utils/utils'
import SearchSelect from '@/components/SearchSelect';
import { editRow, editCol, } from '@/utils/constans';
import AdModal from '@/components/AdModal'
import FileImport from '@/components/FileImport'

import {
    allDispatchType,
    freezeStatus,
    selectList,
    routeUrl,
    columns,
    columnsWare,
    codes,
} from './utils';
import ButtonGroup from 'antd/lib/button/button-group';
import TextArea from 'antd/lib/input/TextArea';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ Inventory, loading, component, i18n }) => ({

    inventoryList: Inventory.inventoryList,
    inventoryDetail: Inventory.inventoryDetail,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],
    dictObject: component.dictObject,

}))
@Form.create()
export default class InventoryList extends Component {
    className = 'InventoryList';
    constructor(props) {
        super(props);
        this.state = {
            formValues: {},
            detailId: '',
            visible: false,
            visibleImportMove: false,
            expandForm: false,
            selectedRows: [],
            binCode: [],
            binCodePutaway: [],
            _columns: [],
            _columnsWare: [],
            visiblePutaway: false,
            visibleLock: false,
            isLock: '',

        };
    }
    componentDidMount() {
        selectList({ props: this.props });
        this.changeTitle(columns, '_columns')
        this.changeTitle(columnsWare, '_columnsWare')
        let allDict = [
            allDictList.partStatus,
            allDictList.billTypeCode,
            allDictList.binType,
        ]

        queryDict({ props: this.props, allDict });

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


    abledVisible = (type) => {
        const { visible, visiblePutaway, selectedRows } = this.state;
        if (type == 'stockMove') {
            this.setState({ visible: !visible })
        } else if (type == 'stockPutaway') {
            this.setState({ visiblePutaway: !visiblePutaway })
        }
    };

    abledStatus = (urlType, beLock) => {
        const { dispatch } = this.props
        const { checkIds } = this.state
        let params = {
            urlType,
            ids: checkIds,
        }
        if (urlType == 'lockInventory') params.type = beLock
        dispatch({
            type: 'Inventory/abledStatus',
            payload: params,
            callback: data => {
                selectList({ props: this.props });
            }
        })
    }
    handleLock = () => {
        const { isLock, checkIds, formValues } = this.state
        const { dispatch, form: { getFieldValue } } = this.props
        let qty = getFieldValue('availableQty')
        let params = {
            type: isLock,
            urlType: 'lockInventory',
            id: checkIds[0],
            qty
        }
        dispatch({
            type: 'Inventory/abledStatus',
            payload: params,
            callback: data => {
                console.log('handleLock-data', data)
                this.setState({ visibleLock: false })
                selectList({ props: this.props, payload: formValues })
            }
        })
    }
    getInventoryDetail = () => {
        const { checkIds } = this.state
        const { dispatch } = this.props
        dispatch({
            type: 'Inventory/viewInventoryDetail',
            payload: { id: checkIds[0] || '' },

        })
    }
    stockMoveConfirm = (type) => {
        const { dispatch, form: { getFieldValue } } = this.props
        const { selectedRows, } = this.state
        const binCode = getFieldValue('binCodePut')
        const workQuantity = getFieldValue('workQuantity')
        const binCodePutaway = getFieldValue('binCodePutaway')
        const workQuantityPutaway = getFieldValue('workQuantityPutaway')
        if (type == 'stockMove') {
            if (!binCode || !workQuantity) return
        } else {
            if (!binCodePutaway || !workQuantityPutaway) return
        }

        const user = JSON.parse(localStorage.getItem('user'));
        let params = {
            id: selectedRows[0]?.id,
            binCode: type == 'stockMove' ? binCode[0]?.code : binCodePutaway[0]?.code,
            workQuantity: type == 'stockMove' ? workQuantity : workQuantityPutaway,
            workUserId: user.id,
            type
        }
        dispatch({
            type: allDispatchType.confirm,
            payload: params,
            callback: (res) => {
                if (type == 'stockMove') {
                    this.setState({ visible: false })
                } else if (type == 'stockPutaway') {
                    this.setState({ visiblePutaway: false })
                }

                selectList({ props: this.props });
            }
        })
    }
    handleImportFile = () => {
        this.setState({
            visibleImportMove: false
        })
    }
    render() {
        const {
            inventoryList,
            inventoryDetail,
            loading,
            form,
            language,
            dictObject
        } = this.props;
        const {
            expandForm,
            selectedRows,
            visible,
            _columns,
            _columnsWare,
            binCode,
            visiblePutaway,
            binCodePutaway,
            visibleLock,
            checkIds,
            visibleImportMove,
        } = this.state;
        let selectDetails = checkIds && checkIds.length > 0 ? inventoryDetail[checkIds[0]] : {};
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('ASNDetail.field.partNo', language)} code="partCode" {...commonParams}>
                <TextArea rows={1} />
            </AntdFormItem>

        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('InventoryList.field.binCode', language)} code="binCode" {...commonParams}>
                <Input />
            </AntdFormItem>

        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('InventoryList.field.binTypeCode', language)} code="binTypeCode" {...commonParams}>
                    <Input />
                </AntdFormItem>
            ],
            [
                <AntdFormItem label={transferLanguage('InventoryList.field.lotLocation', language)} code="lotLocation" {...commonParams}>
                    <AdSelect payload={{ code: allDictList.Inventory_Location }} />

                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('InventoryList.field.asnNo', language)} code="asnNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('InventoryList.field.lotSoi', language)} code="lotSoi" {...commonParams}>
                    <Input />
                </AntdFormItem>,

            ],
            [

                <AntdFormItem label={transferLanguage('InventoryList.field.referenceCode', language)}
                    code="referenceCode"
                    {...commonParams}>
                    <TextArea rows={1} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('InventoryList.field.referenceBillType', language)}
                    code="referenceBillType"
                    {...commonParams}>
                    <AdSelect
                        mode='multiple'
                        payload={{ code: allDictList.WmsReferenceBillType }}
                    />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('InventoryList.field.controlStatus', language)} code="controlStatus" {...commonParams}>
                    <AdSelect payload={{ code: allDictList.Inventory_Control_Status }} />

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
            rightButtons: (
                <Button.Group>
                    <AdButton
                        onClick={() => this.setState({ visibleImportMove: true })}
                        // code={codes.importMove}
                        text={transferLanguage('InventoryList.button.importMove', language)} />

                </Button.Group>
            ),
            buttons: (
                <Button.Group>
                    <AdButton
                        onClick={() => this.abledVisible('stockMove')}
                        code={codes.stockMove}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('InventoryList.field.stockMove', language)} />

                    <AdButton
                        onClick={() => this.abledVisible('stockPutaway')}
                        code={codes.stockPutaway}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('InventoryList.field.stockPutaway', language)} />
                    <AdButton
                        code={codes.lock}
                        onClick={() => this.setState({ visibleLock: true, isLock: 'lock' }, () => this.getInventoryDetail())}
                        disabled={selectedRows.length === 1 ? false : true}
                        text={transferLanguage('CoList.button.lockingInventory', language)} />
                    <AdButton
                        code={codes.unlock}
                        onClick={() => this.setState({ visibleLock: true, isLock: 'unLock' }, () => this.getInventoryDetail())}
                        disabled={selectedRows.length === 1 ? false : true}
                        text={transferLanguage('CoList.button.unLockingInventory', language)} />
                </Button.Group>

            ),
            selectedRows: selectedRows,

        };
        const formItem = [
            [
                <AntdFormItem label={transferLanguage("PutAwayModal.field.binCode", language)} code="binCode"
                    rules={[{ required: true, }]}
                    {...commonParams}>
                    <SearchSelect
                        dataUrl={'/wms-warehouse-bin/selectWmsWarehouseBinList'}
                        selectedData={binCode} // 选中值
                        showValue="code"
                        searchName="code"
                        multiple={false}
                        columns={_columnsWare}
                        onChange={values => this.getValue(values, 'warehouseId')}
                        id="code"
                        allowClear={true}
                        scrollX={200}
                        payload={{ warehouseId: selectedRows[0]?.warehouseId }}
                    />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("PutAway.field.moveNo", language)} code="workQuantity"
                    rules={[{ required: true, }]}
                    {...commonParams}>
                    <Input />
                </AntdFormItem>,
            ],

        ]
        // 详情 参数
        return (
            <Fragment>
                <FileImport
                    visibleFile={visibleImportMove}
                    handleCancel={() => {
                        this.handleImportFile();
                    }}
                    urlImport={`wms-inventory/wmsInventoryimportMove`}
                    urlCase={`template/download?fileName=Import_move_template.xls`}
                    queryData={[selectList.bind(null, { props: this.props })]}
                    accept=".xls,.xlsx"
                />
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={inventoryList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                />
                <AdModal
                    visible={visibleLock}
                    title={transferLanguage('CoDetailList.button.sendRemark', language)}
                    onOk={() => this.handleLock()}
                    onCancel={() => this.setState({ visibleLock: false })}
                    width='600px'
                >
                    <AntdFormItem label={transferLanguage('InventoryList.field.availableQty', language)}
                        code='availableQty'
                        initialValue={selectDetails ? selectDetails.inventoryQty - selectDetails.pickAllocatedQty : 0}
                        rules={[{ required: true, }]}
                        {...commonParams}
                    >
                        <Input />
                    </AntdFormItem>
                </AdModal>
                <Modal
                    visible={visible}
                    title={transferLanguage('InventoryList.field.stockMove', language)}
                    centered
                    okText={transferLanguage('PutAwayModal.button.okText', language)}
                    cancelText={transferLanguage('PutAwayModal.button.cancelText', language)}
                    onOk={() => this.stockMoveConfirm('stockMove')}
                    onCancel={() => this.setState({ visible: false })}
                    width={600}
                    zIndex={100}
                >
                    {/* <AntdForm >{formItemFragement(formItem)}</AntdForm> */}
                    <AntdForm >
                        <Row gutter={editRow}>
                            <Col >
                                <AntdFormItem label={transferLanguage("PutAwayModal.field.binCode", language)}
                                    code="binCodePut"
                                    rules={[{ required: true, }]}
                                    {...commonParams}>
                                    <SearchSelect
                                        dataUrl={'/wms-warehouse-bin/selectWmsWarehouseBinList'}
                                        selectedData={binCode} // 选中值
                                        showValue="code"
                                        searchName="code"
                                        multiple={false}
                                        columns={_columnsWare}
                                        onChange={values => this.getValue(values, 'warehouseId')}
                                        id="code"
                                        allowClear={true}
                                        scrollX={200}
                                        payload={{ warehouseId: selectedRows[0]?.warehouseId, binType: "STORAGE" }}
                                    //   payload={{warehouseId:'237274605978189829'}}
                                    />
                                </AntdFormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <AntdFormItem label={transferLanguage("InventoryList.field.moveQty", language)} code="workQuantity"
                                    rules={[{ required: true, }]}
                                    {...commonParams}>
                                    <AntdInput type='number' />
                                </AntdFormItem>
                            </Col>
                        </Row>
                    </AntdForm>
                </Modal>
                <Modal
                    visible={visiblePutaway}
                    title={transferLanguage('InventoryList.field.stockPutaway', language)}
                    centered
                    okText={transferLanguage('PutAwayModal.button.okText', language)}
                    cancelText={transferLanguage('PutAwayModal.button.cancelText', language)}
                    onOk={() => this.stockMoveConfirm('stockPutaway')}
                    onCancel={() => this.setState({ visiblePutaway: false })}
                    width={600}
                    zIndex={100}
                >
                    {/* <AntdForm >{formItemFragement(formItem)}</AntdForm> */}
                    <AntdForm >
                        <Row gutter={editRow}>
                            <Col >
                                <AntdFormItem label={transferLanguage("PutAwayModal.field.binCode", language)} code="binCodePutaway"
                                    rules={[{ required: true, }]}
                                    {...commonParams}>
                                    <SearchSelect
                                        dataUrl={'/wms-warehouse-bin/selectWmsWarehouseBinList'}
                                        selectedData={binCodePutaway} // 选中值
                                        showValue="code"
                                        searchName="code"
                                        multiple={false}
                                        columns={_columnsWare}
                                        onChange={values => this.getValue(values, 'binCodePutaway')}
                                        id="code"
                                        allowClear={true}
                                        scrollX={200}
                                        payload={{ warehouseId: selectedRows[0]?.warehouseId, binType: "STORAGE" }}
                                    //   payload={{warehouseId:'237274605978189829'}}
                                    />
                                </AntdFormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <AntdFormItem label={transferLanguage("InventoryList.field.putawayQty", language)} code="workQuantityPutaway"
                                    rules={[{ required: true, }]}
                                    {...commonParams}>
                                    <Input />
                                </AntdFormItem>
                            </Col>
                        </Row>
                    </AntdForm>
                </Modal>
            </Fragment >
        );
    }
}




