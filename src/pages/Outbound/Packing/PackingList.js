import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Select, Row, Col, InputNumber } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage, formatDate } from 'umi-plugin-react/locale';
import SearchSelect from '@/components/SearchSelect';
import AdModal from '@/components/AdModal';
import AntdForm from '@/components/AntdForm';
import AntdInput from '@/components/AntdInput'
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import { transferLanguage } from '@/utils/utils';
import AntdDatePicker from '@/components/AntdDatePicker';
import {
    allDispatchType,
    codes,
    selectList,
    routeUrl,
    columns,
    Types,
    SelectColumns,
} from './utils';
import { allDictList, queryDict } from '@/utils/common'
import { languages } from 'monaco-editor';
import { editRow, editCol } from '@/utils/constans'

const { MonthPicker } = DatePicker;

@ManageList

@connect(({ Packing, loading, component, i18n }) => ({
    packingList: Packing.packingList,
    dictObject: component.dictObject,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class packingList extends Component {
    className = 'packingList';
    constructor(props) {
        super(props);
        this.state = {
            formValues: {},
            detailId: '',
            visible: false,
            expandForm: false,
            selectedRows: [],
            _columns: [],
            _SelectColumns: [],
            forwarder: [],

        };
    }
    componentDidMount() {
        selectList({ props: this.props });
        this.changeTitle(columns, '_columns')
        this.changeTitle(SelectColumns, '_SelectColumns')

        const allDict = [
            allDictList.loadlistStatus,
            allDictList.transportType,
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
        const { ...value } = formValues
        const params = { props: this.props, payload: value };
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
        params.type = type
        const param = { props: this.props, payload: formValues };

        dispatch({
            type: allDispatchType.abled,
            payload: params,
            callback: res => {
                selectList({ ...param });
            },
        });
    };
    abledModal = () => {
        const { dispatch, form: { getFieldValue } } = this.props
        const { visible, formValues, checkIds } = this.state
        let cartonQTY = getFieldValue('cartonQTY')
        let params = {
            quantity: cartonQTY,
            type: 'printCartonQty',
        }
        dispatch({
            type: allDispatchType.abled,
            payload: params,
            callback: data => {
                console.log('??data', data)
                this.setState({ visible: false })
                const params = { props: this.props, payload: formValues };
                selectList(params);
                this.print('CARTON_NO', data)
            }
        })
    }
    print = (type, data) => {
        const { checkIds } = this.state
        const { dispatch } = this.props
        let ids = data ? data : checkIds
        dispatch({
            type: 'common/setPrint',
            payload: { ids },
            callback: () => {
                router.push(`/print/${ids[0]}/${type}`);
            }
        })
    }
    render() {
        const { packingList, loading, form, language, dictObject } = this.props;
        const {
            expandForm,
            selectedRows,
            _columns,
            _SelectColumns,
            visible,
            forwarder,
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('Load.field.loadingNo', language)} code="loadingNo" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('Load.field.status', language)} code="status" {...commonParams}>
                <AdSelect
                  mode='multiple'
                  data={dictObject[allDictList.loadlistStatus]}
                  payload={{ code: allDictList.loadlistStatus }} />
            </AntdFormItem>
        );

        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('Delivery.field.type', language)} code="orderType" {...commonParams}>
                    <AdSelect mode="multiple" payload={{code:allDictList.WmsOrderType}}/>
                </AntdFormItem>
            ],
            [
                <AntdFormItem label={transferLanguage('CoList.field.coNo', language)} code="coNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('CoList.field.bizSoNo', language)} code="soNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('CoDetailList.field.SOID', language)} code="soId" {...commonParams}>
                    <Input />
                </AntdFormItem>,
            ],
            [

                <AntdFormItem label={transferLanguage('shipping.field.shipTo', language)} code="altshiptoname" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('shipping.field.shipToZip', language)} code="altshiptopostcode" {...commonParams}>
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
                        code={codes.accept}
                        onClick={() => this.abledStatus('accept')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Load.button.accept', this.props.language)} />
                    <AdButton
                        onClick={() => this.setState({ visible: !visible })}
                        code={codes.print}
                        text={transferLanguage('Packing.button.printCartonNo', language)} />
                    <AdButton
                        onClick={() => this.print('CARTONLABEL')}
                        code={codes.cartonLabel}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Packing.button.cartonLabel', language)} />
                    <AdButton
                        onClick={() => this.print('COO_LIST')}
                        code={codes.printCOO}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Packing.button.cooList', language)} />
                    {/*<AdButton
                        onClick={() => this.abledStatus('cancelDelivery')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Load.button.cancelDelivery', this.props.language)} /> */}
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
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={packingList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}

                />
                {visible && <AdModal
                    visible={visible}
                    title={transferLanguage('Packing.button.printCartonNo', language)}
                    onOk={() => this.abledModal()}
                    onCancel={() => this.setState({ visible: !visible })}
                    width='500px'
                >
                    <AntdFormItem label={transferLanguage('PoList.field.pieceQty', language)}
                        code="cartonQTY" {...commonParams}
                        initialValue={1}
                    >
                        <AntdInput min={1} max={50} type='number' />
                    </AntdFormItem>
                </AdModal>}
            </Fragment>
        );
    }
}
