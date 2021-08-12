import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Select, Row, Col, Radio, Dropdown, Icon, Menu } from 'antd';
import styles from '@/pages/Operate.less';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdForm from '@/components/AntdForm';
import AdModal from '@/components/AdModal';
import AntdDatePicker from '@/components/AntdDatePicker';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import SearchSelect from '@/components/SearchSelect';
import { transferLanguage } from '@/utils/utils'
import { formItemFragement, queryDict, allDictList } from '@/utils/common';
import { editRow, editCol } from '@/utils/constans'
import HeaderDropdown from '@/components/HeaderDropdown';

import {
    allDispatchType,
    selectList,
    routeUrl,
    columns,
    columnsUser,
    columnsBin,
    SelectColumns,
    Status,
    codes,
    isTrue
} from './utils';

const confirm = Modal.confirm;
const { Option } = Select;
const { TextArea } = Input
const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ Delivery, loading, component, i18n, }) => ({

    deliveryList: Delivery.deliveryList,
    dictObject: component.dictObject,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class DeliveryList extends Component {
    className = 'DeliveryList';
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
            _columns: [],
            _SelectColumns: [],
            sysName: [],
            binCode: [],
            toCountryId: [],
            forwarder: [],
            visibleAction: false,
            radioValue: 1,
        };
    }
    componentDidMount() {
        selectList({ props: this.props });
        this.changeTitle(columns, '_columns')
        this.changeTitle(SelectColumns, '_SelectColumns')
        const allDict = [
            allDictList.deliveryStatus,
            allDictList.pickStatus
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
        const { toCountryId, etd, cutoffDate, ...value } = formValues
        if (toCountryId && toCountryId.length > 0) value.altshiptocountry = toCountryId[0].code
        if (etd && etd.length > 0) {
            value.etdStart = moment(etd[0]).format('YYYY-MM-DD');
            value.etdEnd = moment(etd[1]).format('YYYY-MM-DD');
            value.etdStart +=' 00:00:00'
            value.etdEnd +=' 23:59:59'
        } else {
            value.etdStart = ''
            value.etdEnd = ''
        }
        if (cutoffDate) {
            value.cutoffDateEnd = moment(cutoffDate).format(dateTimeFormat);
        }
        console.log('??', cutoffDate, value)
        if(!value.type||!value.type.length){delete value.type}
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


    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };

    //作业确认
    abledStatus = (type) => {
        const { selectedRows, formValues } = this.state
        const { dispatch } = this.props
        let params = {
            ids: selectedRows.map(v => v.id),
            type: type
        }
        dispatch({
            type: 'Delivery/abledDelivery',
            payload: params,
            callback: data => {
                selectList({ props: this.props })
            }
        })
    }
    markSkip = () => {
        const { visible2 } = this.state

        this.setState({ visible2: !visible2 })
    }
    handleOk = () => {
        const { selectedRows, visible2 } = this.state
        const { dispatch } = this.props
        let params = {
            id: selectedRows[0].id,
            type: 'pickBack',
            tokenValue: this.state.tokenValue
        }
        dispatch({
            type: 'Delivery/abledDelivery',
            payload: params,
            callback: data => {
                this.setState({ visible2: !visible2 })
                selectList({ props: this.props })
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



    // abledModal shipDelivery确认
    abledModal = () => {
        const { dispatch, form: { getFieldValue } } = this.props
        const { visible, formValues, checkIds } = this.state
        let trackingNo = getFieldValue('trackingNo')
        let forwarder = getFieldValue('forwarder')[0].id
        // console.log('forwarder----',forwarder,trackingNo)
        let params = {
            trackingNo,
            forwarder,
            ids: checkIds,
            type: 'shipDelivery',
        }
        dispatch({
            type: 'Delivery/abledDelivery',
            payload: params,
            callback: data => {
                this.setState({ visible: !visible })
                const params = { props: this.props, payload: formValues };
                selectList(params);
            }
        })
    }
    print = () => {
        const { checkIds, selectedRows } = this.state
        const { dispatch } = this.props
        let id = selectedRows[0]?.id
        dispatch({
            type: 'common/setPrint',
            payload: { ids: checkIds },
            callback: data => {
                router.push(`/print/${id}/DELIVERY`);
            }
        })
    }
    handleMenuClick = (e) => {
        console.log('click???', e)
    }
    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            radioValue: e.target.value,
        });
    };
    handleCreateLoad = () => {
        const { radioValue, selectedRows, formValues } = this.state
        const { dispatch } = this.props
        let type = ''
        switch (radioValue) {
            case 1:
                type = 'createLoadlist'
                break;
            case 2:
                type = 'createLoadlistByOne'
                break;
            case 3:
                type = 'createLoadlistByName'
                break;
        }
        let params = {
            ids: selectedRows.map(v => v.id),
            type: type
        }
        dispatch({
            type: 'Delivery/abledDelivery',
            payload: params,
            callback: data => {
                selectList({ props: this.props })
                this.setState({ visibleAction: false })
            }
        })
    }
    render() {
        const { deliveryList, loading, form, language, dictObject } = this.props;
        const {
            expandForm,
            selectedRows,
            toCountryId,
            _SelectColumns,
            visible,
            visible2,
            visibleAction,
            forwarder,
            radioValue
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('Delivery.field.deliveryNo', language)} code="deliveryNo" {...commonParams}>
                <TextArea rows={1} />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('Delivery.field.status', language)} code="status" {...commonParams}>
                <AdSelect data={dictObject[allDictList.deliveryStatus]} payload={{ code: allDictList.deliveryStatus }} />
            </AntdFormItem>

        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('Delivery.field.type', language)} code="type" {...commonParams}>
                    
                    <AdSelect mode="multiple" payload={{code:allDictList.DeliveryOrderType}}/>

                    {/* <Input /> */}
                </AntdFormItem>
            ],
            [
                // <AntdFormItem label={transferLanguage('Delivery.field.forwarder', language)} code="forwarder" {...commonParams}>
                //     <Input />
                // </AntdFormItem>,
                // <AntdFormItem label={transferLanguage('Delivery.field.trackingNo', language)} code="trackingNo" {...commonParams}>
                //     <Input />
                // </AntdFormItem>,
                <AntdFormItem label={transferLanguage('CoList.field.coNo', language)} code="coNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('CoDetailList.field.SOID', language)} code="soId" {...commonParams}>
                    <TextArea rows={1} />

                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Load.field.loadingNo', language)} code="loadingNo" {...commonParams}>
                    <TextArea rows={1} />
                </AntdFormItem>,

            ],
            [

                <AntdFormItem label={transferLanguage('shipping.field.shipToCountry', language)} code="toCountryId" {...commonParams}>
                    <SearchSelect
                        dataUrl={'/mds-country/selectMdsCountryList'}
                        selectedData={toCountryId} // 选中值
                        showValue="name"
                        searchName="name"
                        multiple={false}
                        columns={_SelectColumns}
                        onChange={values => this.getValue(values, 'toCountryId')}
                        id="toCountryId"
                        allowClear={true}
                        scrollX={200}
                    />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('shipping.field.shipTo', language)} code="altshiptoname" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('CoList.field.contactorName', language)} code="altshiptocontactor" {...commonParams}>
                    <Input />
                </AntdFormItem>
            ],
            [
                <AntdFormItem label={transferLanguage('ASNDetail.field.partNo', language)} code="partNo" {...commonParams}>
                    <TextArea rows={1} />
                </AntdFormItem>,
                // <AntdFormItem label={transferLanguage('shipping.field.shipToState', language)} code="altshiptostate" {...commonParams}>
                //     <Input />
                // </AntdFormItem>,
                <AntdFormItem label={transferLanguage('CoDetailList.field.pickingStatus', language)} code="pickStatus" {...commonParams}>
                    <AdSelect data={dictObject[allDictList.pickStatus]} payload={{ code: allDictList.pickStatus }} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Picking.field.cutOffDate', language)} code="cutoffDate" {...commonParams}>
                    <AntdDatePicker showTime={true} />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('Picking.field.SODType', language)} code="sodeliverytype" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Picking.field.premierCustomer', language)} code="premierCustomer" {...commonParams}>
            <AdSelect payload={{code:allDictList.Premier_Customer}}/>
                    
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('PoDetailList.field.etd', language)} code="etd" {...commonParams}>
                    <AntdDatePicker mode="range" />
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
        };
        {/* <Fragment>
                        <Button>123</Button>
                         <Button onClick={this.handleMenuClick}>
                            Actions <Icon type="down" />
                        </Button> 
                    </Fragment> */}
        const tableButtonsParams = {
            // handleAdd: this.handleAdd,
            buttonsSecond: btnMenu,
            buttons: (
                <Button.Group>
                    <AdButton
                        onClick={() => this.setState({ visibleAction: true })}
                        disabled={selectedRows.length > 0 ? false : true}
                        code={codes.createLoadlist}
                        text={transferLanguage('Delivery.button.CreateLoadlist', language)} />
                    <AdButton
                        onClick={() => this.abledStatus('sign')}
                        // disabled={selectedRows.length > 0 ? false : true}
                        code={codes.sign}
                        text={transferLanguage('Delivery.button.sign', language)} />

                    <AdButton
                        code={codes.reviewLoadlist}
                        onClick={() => this.abledStatus('reviewerDelivery')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Delivery.button.reviewerDelivery', language)} />
                    <AdButton
                        code={codes.deliver}
                        onClick={() => this.setState({ visible: !visible })}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Delivery.button.shipDelivery', language)} />
                    <AdButton
                        code={codes.revokeLoadlist}
                        onClick={() => this.abledStatus('revocationDelivery')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Delivery.button.revocationDelivery', language)} />

                    <AdButton
                        code={codes.printDelivery}
                        onClick={() => this.print()}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Delivery.button.printDelivery', language)} />
                    <AdButton
                        code={codes.pickBack}
                        onClick={() => this.markSkip('pickBack')}
                        disabled={selectedRows.length == 1 ? false : true}
                        text={transferLanguage('Delivery.button.pickBack', language)} />
                </Button.Group>
            ),
            selectedRows: selectedRows,

        };
        let ActionBtn = (
            <Button.Group>
                <AdButton
                    onClick={() => this.abledStatus('createLoadlist')}
                    code={codes.createLoadlist}
                    disabled={selectedRows.length > 0 ? false : true}
                    text={transferLanguage('Delivery.button.createLoadlist', language)} />
                <AdButton
                    onClick={() => this.abledStatus('createLoadlistByOne')}
                    code={codes.createLoadlistByOne}
                    disabled={selectedRows.length > 0 ? false : true}
                    text={transferLanguage('Delivery.button.createLoadlistByOne', language)} />
                <AdButton
                    onClick={() => this.abledStatus('createLoadlistByName')}
                    code={codes.createLoadlistByName}
                    disabled={selectedRows.length > 0 ? false : true}
                    text={transferLanguage('Delivery.button.createLoadlistByName', language)} />
            </Button.Group>
        )
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        let radioBtn = (
            <Radio.Group onChange={this.onChange} value={radioValue}>
                <Radio style={radioStyle} value={1}>
                    {transferLanguage('Delivery.button.combineToOne', language)}
                </Radio>
                <Radio style={radioStyle} value={2}>
                    {transferLanguage('Delivery.button.forEach', language)}
                </Radio>
                <Radio style={radioStyle} value={3}>
                    {transferLanguage('Delivery.button.combineContact', language)}
                </Radio>

            </Radio.Group>
        )
        let btnMenu = (
            <Menu onClick={this.handleMenuClick} >
                <Menu.Item key="1">
                    <AdButton
                        onClick={() => this.abledStatus('createLoadlist')}
                        code={codes.createLoadlist}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Delivery.button.createLoadlist', language)} />
                </Menu.Item>
                <Menu.Item key="2">
                    <AdButton
                        onClick={() => this.abledStatus('createLoadlistByOne')}
                        code={codes.createLoadlistByOne}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Delivery.button.createLoadlistByOne', language)} />
                </Menu.Item>
                <Menu.Item key="3">
                    <AdButton
                        onClick={() => this.abledStatus('createLoadlistByName')}
                        code={codes.createLoadlistByName}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Delivery.button.createLoadlistByName', language)} />
                </Menu.Item>
            </Menu>
        );

        // 详情 参数
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                {/* <div >
                    <Dropdown overlay={btnMenu}  disabled={selectedRows.length > 0 ? false : true}>
                        <Button >
                            Actions <Icon type="down" />
                        </Button>
                    </Dropdown>
                </div> */}
                <StandardTable
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={deliveryList}
                    columns={columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                    pageSizeOptions={['50', '100', '300', '500']}
                    defaultPageSize={'300'}
                />
                {visibleAction && <AdModal
                    visible={visibleAction}
                    title={transferLanguage('Delivery.button.createLoadlist', language)}
                    onOk={() => this.handleCreateLoad()}
                    onCancel={() => this.setState({ visibleAction: false })}
                    width='500px'
                >
                    {radioBtn}
                </AdModal>}
                {visible && <AdModal
                    visible={visible}
                    title={transferLanguage('Delivery.button.shipDelivery', language)}
                    onOk={() => this.abledModal()}
                    onCancel={() => this.setState({ visible: !visible })}
                    width='900px'
                >
                    <AntdForm>
                        <Row {...editRow}>
                            <Col {...editCol}>
                                <AntdFormItem label={transferLanguage('Delivery.field.trackingNo', language)}
                                    code="trackingNo" {...commonParams}
                                >
                                    <Input />
                                </AntdFormItem>
                            </Col>
                            <Col {...editCol}>
                                <AntdFormItem label={transferLanguage('Delivery.field.forwarder', language)}
                                    code="forwarder" {...commonParams}
                                >
                                    <SearchSelect
                                        dataUrl={'wms-forwarder/selectWmsForwarderList'}
                                        selectedData={forwarder} // 选中值
                                        showValue="name"
                                        searchName="name"
                                        multiple={false}
                                        columns={_SelectColumns}
                                        // onChange={values => this.getValue(values, 'forwarder')}
                                        id="forwarder"
                                        allowClear={true}
                                        scrollX={200}
                                    />
                                </AntdFormItem>
                            </Col>
                        </Row>
                    </AntdForm>
                </AdModal>}

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
