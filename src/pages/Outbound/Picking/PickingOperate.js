import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Spin, Tabs } from 'antd';
import router from 'umi/router';
import moment, { lang } from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import AntdInput from '@/components/AntdInput';
import AdModal from '@/components/AdModal';
import AntdForm from '@/components/AntdForm';
import prompt from '@/components/Prompt';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import SearchSelect from '@/components/SearchSelect';
import DetailPage from '@/components/DetailPage';
import EditPage from '@/components/EditPage';
import { transferLanguage } from '@/utils/utils'
import DetailList from '@/components/DetailsList';

import { formItemFragement, formatPrice } from '@/utils/common';


import { selectDetailList, } from '../../Inbound/MoveDoc/utils'
import {
    allDispatchType,
    codes,
    selectList,
    selectMoveDocDetailList,
    selectModSecondList,
    selectModThirdList,
    routeUrl,
    columnsAllotOne,
} from './utils';
import ButtonGroup from 'antd/lib/button/button-group';
const { TabPane } = Tabs;

const confirm = Modal.confirm;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ Picking, MoveDoc, loading, i18n }) => ({

    moveDocDetail: MoveDoc.moveDocDetail,
    moveDocDetailList: Picking.moveDocDetailList,
    cancelAllocationList: Picking.cancelAllocationList,
    inventoryList: Picking.inventoryList,
    language: i18n.language,
    loading: loading.effects[allDispatchType.detail],
}))
@Form.create()
export default class PickingOperate extends Component {
    className = 'PickingOperate';
    constructor(props) {
        super(props);
        this.state = {
            currentId: '',
            expandForm: false,

            moveId: [],
            disabled: false,

            selectedRowsMod: [],
            selectedRowsSecond: [],
            selectedRowsThird: [],

            checkIdsMod: [],
            binCode: [],
            selectRowArr: [],
            inputArr: [],

            _columnsAllotOne: [],

        };
    }
    componentWillUnmount(){
        this.setState({
            selectedRowsMod: [],
            selectedRowsSecond: [],
            selectedRowsThird: [], 
        })
        dispatch({
            type: 'Picking/allValus',
            payload: { inventoryList: { pagination: { current: 0, pageSize: 10, total: 0 }, list: [] } },
        })
    }
    componentDidMount() {
        const { match, form, dispatch } = this.props;
        const ID = match && match.params ? match.params.id : '';
        this.setState({
            currentId: ID,
        });

        if (ID) {
            this.getSelectDetails(ID);
            selectMoveDocDetailList({ props: this.props, payload: { moveId: ID } })
            selectModThirdList({ props: this.props, payload: { moveId: ID } })
            this.setState({
                disabled: true,
            });
        } else {
            form.resetFields();
        }
        this.changeTitle(columnsAllotOne, '_columnsAllotOne')

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
            type: 'MoveDoc/viewMoveDoc',
            payload: { id: ID },
            callback: data => {
                this.setState({
                    senders: [{ id: data.senderId }],
                    beUseRule: data.beUseRule,
                });
            },
        });
    };

    //第一个 选中行
    handleSelectRowsMod = rows => {
        const { dispatch, inventoryList } = this.props
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
        // 选中时请求数据，取消选中时清空数据
        rows[0] ? selectModSecondList({ props: this.props, payload: { id: rows[0].id } }) :
            dispatch({
                type: 'Picking/allValus',
                payload: { inventoryList: { pagination: { current: 0, pageSize: 10, total: 0 }, list: [] } },
            })
    };
    //第二个表 选中行
    handleSelectRowsSecond = (rows) => {
        const { selectedRowsSecond } = this.state
        let selectRowArr = []
        if (rows) {
            rows.map(v => selectRowArr.push(v.id))
        }
        this.setState({
            selectedRowsSecond: rows,
            selectRowArr: selectRowArr,
        });
    }
    //第三个表 选中行
    handleSelectRowsThird = (rows) => {
        this.setState({
            selectedRowsThird: rows,
        });
    }
    getValue = (values, type, record) => {
        if (type === 'allocatedQuantity') {
            const { inputArr } = this.state
            let indexOf = true
            let _inputArr = []
            if (inputArr.length > 0) {
                _inputArr = inputArr.map(v => {
                    if (v.inventoryId === record) {
                        v.allocatedQuantity = values
                        indexOf = false
                    }
                    return v
                })
            }
            if (indexOf) {
                _inputArr.push({ inventoryId: record, allocatedQuantity: values })

            }
            // console.log('_inputArr', _inputArr)
            this.setState({
                inputArr: _inputArr
            })
        } else {
            this.setState({
                [type]: values,
            });
        }


    };
    // tabsChange = ()=>{
    //     console.log('tabsChange',)
    // }

    //手动分配按钮
    handleAllot = () => {
        const { inputArr, selectedRowsMod ,currentId} = this.state
        const { dispatch } = this.props
        let params = {
            moveDetailId: selectedRowsMod[0] ? selectedRowsMod[0].id : '',
            allocatedQtyList: inputArr
        }
        dispatch({
            type: allDispatchType.manualAllot,
            payload: params,
            callback: () => {
                this.setState({
                    selectedRowsMod:[],
                    checkIdsMod:[],
                    selectedRowsSecond:[],
                    selectRowArr:[],
                })
                selectMoveDocDetailList({ props: this.props, payload: { moveId: currentId,} })
                selectModThirdList({ props: this.props, payload: { moveId: currentId } })
                dispatch({
                    type: 'Picking/allValus',
                    payload: { inventoryList: { pagination: { current: 0, pageSize: 10, total: 0 }, list: [] } },
                })
            }
        })

    }
    //取消分配
    handleCancel = () => {
        const { selectedRowsThird,currentId } = this.state
        const { dispatch } = this.props
        dispatch({
            type: allDispatchType.cancelAllot,
            payload: { ids: selectedRowsThird.map(v => v.id) },
            callback:()=>{
                selectModThirdList({ props: this.props, payload: { moveId: currentId } })
                selectMoveDocDetailList({ props: this.props, payload: { moveId: currentId,} })
            }
        })
    }

    //分页
    handleStandardTableChange = (param) => {
        const { currentId } = this.state
        selectMoveDocDetailList({ props: this.props, payload: { moveId: currentId, ...param } })
    }
    //分页 第二个表格
    handleStandardTableChangeSecond = (param) => {
        const { selectedRowsMod } = this.state
        selectModSecondList({ props: this.props, payload: { id: selectedRowsMod[0].id, ...param } })
    }
    //分页 第三个表格
    handleStandardTableChangeThird = (param) => {
        const { currentId } = this.state
        selectModThirdList({ props: this.props, payload: { moveId: currentId, ...param } })
    }
    render() {
        const {
            moveDocDetail,
            moveDocDetailList,
            inventoryList,
            cancelAllocationList,
            language,
            form,
            loading

        } = this.props;
        const { expandForm,
            selectedRowsMod, selectedRowsSecond, selectedRowsThird,
            selectRowArr, currentId, _columnsAllotOne,

        } = this.state;
        let details = moveDocDetail[currentId] || {};
        // let details = {};
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };

        const editPageParams = {
            panelValue: [
                { key: transferLanguage('Common.field.baseInfo', language) },
                { key: transferLanguage('PutAwayDetail.title.putawayDetailList', language) },
            ],
        };
        const columnsAllot = [
            {
                title: '#',
                dataIndex: 'index',
                render: (text, record, index) => (<span>{index + 1}</span>),
                width: 50
            },
            {
                title: transferLanguage('AllocateInventory.field.binTypeCode', language),
                dataIndex: 'binTypeCode',
                width: 150,
            },
            {

                title: transferLanguage('AllocateInventory.field.allocatable', language),
                dataIndex: 'allocatable',
                width: 150,
            },
            {
                title: transferLanguage('AllocateInventory.field.binCode', language),
                dataIndex: 'binCode',
                width: 150,
            },
            {
                title: transferLanguage('AllocateInventory.field.allotQty', language),
                //   dataIndex: 'allotQty',
                width: 120,
                render: (text, record) => {
                    const { disabled } = this.state
                    return (
                        <AntdFormItem

                            code={`allocatedQuantity-${record.id}`}
                            // initialValue={text}
                            {...commonParams}
                        >
                            <AntdInput
                                disabled={selectRowArr.indexOf(record.id) !== -1 ? false : true}
                                onChange={value => this.getValue(value, 'allocatedQuantity', record.id)}
                            // placeholder="勾选后可输入"
                            />
                        </AntdFormItem>

                    )
                }
            },
            {
                title: transferLanguage('AllocateInventory.field.cargoOwnerName', language),
                dataIndex: 'cargoOwnerName',
                //表格列的宽度
                width: 150,
                // render: (text, record) => (
                //   <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
                // ),
            },

            {
                title: transferLanguage('AllocateInventory.field.controlStatus', language),
                dataIndex: 'controlStatus',
                width: 150,
            },
            {
                title: transferLanguage('AllocateInventory.field.itemCode', language),
                dataIndex: 'partCode',
                width: 150,
            },

            {
                title: transferLanguage('AllocateInventory.field.itemName', language),
                dataIndex: 'partName',
                width: 150,
            },
            {
                title: transferLanguage('AllocateInventory.field.inventoryQty', language),
                dataIndex: 'inventoryQty',
                width: 100,
            },
            {
                title: transferLanguage('AllocateInventory.field.itemStatus', language),
                dataIndex: 'partStatus',
                width: 120,
            },
            {
                title: transferLanguage('ASN.field.asnNo', language),
                dataIndex: 'asnNo',
                width: 180,
            },
            {
                title: transferLanguage('AllocateInventory.field.lotCoo', language),
                dataIndex: 'lotCoo',
                width: 120,
            },
            {
                title: transferLanguage('AllocateInventory.field.lotDnNo', language),
                dataIndex: 'lotDnNo',
                width: 120,
            },
            {
                title: transferLanguage('AllocateInventory.field.lotInfo', language),
                dataIndex: 'lotInfo',
                width: 120,

            },
            {
                title: transferLanguage('AllocateInventory.field.lotInvoiceNo', language),
                dataIndex: 'lotInvoiceNo',
                width: 120,
            },



            {
                title: transferLanguage('AllocateInventory.field.lotLocation', language),
                dataIndex: 'lotLocation',
                width: 120,

            },

            {
                title: transferLanguage('AllocateInventory.field.lotNo', language),
                dataIndex: 'lotNo',
                width: 120,
            },
            {
                title: transferLanguage('AllocateInventory.field.lotSoi', language),
                dataIndex: 'lotSoi',
                width: 120,
            },
            {
                title: transferLanguage('AllocateInventory.field.lotUom', language),
                dataIndex: 'lotUom',
                width: 120,
            },
            {
                title: transferLanguage('AllocateInventory.field.lotVendorCode', language),
                dataIndex: 'lotVendorCode',
                width: 120,
            },
            {
                title: transferLanguage('AllocateInventory.field.lotVendorName', language),
                dataIndex: 'lotVendorName',
                width: 120,
            },
            {
                title: transferLanguage('AllocateInventory.field.pickAllocatedQty', language),
                dataIndex: 'pickAllocatedQty',
                width: 120,
            },
            {
                title: transferLanguage('AllocateInventory.field.putawayAllocatedQty', language),
                dataIndex: 'putawayAllocatedQty',
                width: 120,
            }, {
                title: 'AllocateInventory.field.referenceBillType',
                dataIndex: 'referenceBillType',
                width: 120,
            },
            {
                title: transferLanguage('AllocateInventory.field.referenceCode', language),
                dataIndex: 'referenceCode',
                width: 120,
            },
            {
                title: transferLanguage('AllocateInventory.field.storageDate', language),
                dataIndex: 'storageDate',
                width: 180,
            },
            {
                title: transferLanguage('AllocateInventory.field.warehouseName', language),
                dataIndex: 'warehouseName',
                width: 150,
            },
            {
                title: transferLanguage('AllocateInventory.field.remarks', language),
                dataIndex: 'remarks',
                width: 120,
            },

        ];
        const operations = (
            <div style={{ display: 'flex' }}>
                <Button type="primary" disabled={selectedRowsSecond.length > 0 ? false : true}
                    onClick={this.handleAllot} >{transferLanguage('PutAway.button.manualAllocate', language)}</Button>
                <Button disabled={selectedRowsThird.length > 0 ? false : true}
                    onClick={this.handleCancel} >{transferLanguage('PutAway.button.cancelAllocate', language)}</Button>
            </div>
        )
        const field = [
            { key: 'moveNo', name: transferLanguage('PickingAllocate.field.moveNo', language) },
            { key: 'outboundNoticeNo', name: transferLanguage('PickingAllocate.field.outboundNoticeNo', language) },
            { key: 'status', name: transferLanguage('PickingAllocate.field.status', language) },
            { key: 'planQuantity', name: transferLanguage('PickingAllocate.field.planQuantity', language) },
            { key: 'allocatedQuantity', name: transferLanguage('PickingAllocate.field.allocatedQuantity', language) },
            { key: 'movedQuantity', name: transferLanguage('PickingAllocate.field.movedQuantity', language) },
            { key: 'warehouseName', name: transferLanguage('PickingAllocate.field.warehouseName', language) },
            
        ]
        // 详情 参数
        return (
            <EditPage {...editPageParams}>
                {/* <Spin spinning={loading} > {formItemFragement(formItem)}</Spin> */}
                <Fragment>
                <DetailList detilsData={{ fields: field, value: details }} />
                </Fragment>
                <Fragment>
                    <Tabs defaultActiveKey="1" tabBarExtraContent={operations}  >
                        <TabPane tab={transferLanguage('PutAwayModal.title.manualAllocate', language)} key="1"  >
                            <StandardTable
                                // disabledRowSelected={true}
                                selectedRows={selectedRowsMod}
                                onSelectRow={this.handleSelectRowsMod}
                                data={moveDocDetailList}
                                columns={_columnsAllotOne}
                                onPaginationChange={this.handleStandardTableChange}
                                expandForm={undefined} //取消表格支撑高度
                                className={this.className}
                                hideCheckAll={true}
                            />

                            <StandardTable
                                // disabledRowSelected={true}
                                selectedRows={selectedRowsSecond}
                                onSelectRow={this.handleSelectRowsSecond}
                                data={inventoryList}
                                columns={columnsAllot}
                                onPaginationChange={this.handleStandardTableChangeSecond}
                                expandForm={undefined}
                                className={this.className}
                            // hideCheckAll={true}
                            />
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
                                expandForm={undefined}
                                className={this.className}
                            // hideCheckAll={true}
                            />
                        </TabPane>
                    </Tabs>
                </Fragment>
            </EditPage >
        );
    }

}