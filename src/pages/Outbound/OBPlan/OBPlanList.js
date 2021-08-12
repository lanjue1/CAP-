import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment'
import { Button, Form, Input, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, Status, SelectColumns } from './utils';
import AdSelect from '@/components/AdSelect';
import { transferLanguage, columnConfiguration } from '@/utils/utils';
import SearchSelect from '@/components/SearchSelect';
import AntdDatePicker from '@/components/AntdDatePicker';

const formatDate = 'YYYY-MM-DD'
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ obplan, common, component, loading, i18n }) => ({
    obplan,
    loading: loading.effects['obplan/obplanList'],
    dictObject: common.dictObject,
    searchValue: component.searchValue,
    language: i18n.language
}))
@Form.create()
export default class OBPlanList extends Component {
    state = {
        expandForm: false,
        selectedRows: [],
        checkId: '',
        checkIds: [],
        formValues: {},
        isAbled: '',
        shipFromWmCode: [],
        _SelectColumns: [],
        fromCountryId: [],
        shipToWmCode: [],
        toCountryId: [],
    };
    className = 'obplan';

    language = this.props.language

    // 详情字段
    columns = [
        {
            title: '#',
            dataIndex: 'index',
            render: (text, record, index) => (<span>{index + 1}</span>),
            width: 50
        },
        {
            // 标题
            // title: 'SOID',
            title: transferLanguage('CoDetailList.field.SOID', this.language),
            // 数据字段
            dataIndex: 'soDetailNo',
            // render: (text, record) => (
            //     <a onClick={() => this.modalShow(record)} title={text}>
            //         {text}
            //     </a>
            // ),
        },
        {
            title: transferLanguage('CoDetailList.field.coNo', this.language),
            dataIndex: 'coNo'
        },
        {
            title: transferLanguage('CoDetailList.field.status', this.language),
            dataIndex: 'status',
            render: text => <span title={text}>{text}</span>,
        },
        {
            title: transferLanguage('CoList.field.type', this.language),
            dataIndex: 'type',
            render: text => <span title={text}>{text}</span>,
        },
        {
            // title: '料号',
            title: transferLanguage('CoDetailList.field.partNo', this.language),
            dataIndex: 'partNo',
            render: text => <span title={text}>{text}</span>,
        },
        {
            // title:'料号描述'
            title: transferLanguage('CoDetailList.field.partDesc', this.language),
            dataIndex: 'partDesc',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            // title: 'pcs数',
            title: transferLanguage('CoDetailList.field.pieceQty', this.language),
            dataIndex: 'pieceQty',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            // title: '发货日期-联想',
            title: transferLanguage('CoDetailList.field.deliveryDate', this.language),
            dataIndex: 'deliveryDate',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoDetailList.field.planPickingBin', this.language),
            dataIndex: 'planPickingBin',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoDetailList.field.pickingStatus', this.language),
            dataIndex: 'pickingStatus',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoDetailList.field.pickingNO', this.language),
            dataIndex: 'pickingNO',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoDetailList.field.deliveryStatus', this.language),
            dataIndex: 'deliveryStatus',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoDetailList.field.deliveryNo', this.language),
            dataIndex: 'deliveryNo',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoList.field.soType', this.language),
            dataIndex: 'serviceordertype',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoList.field.soPriority', this.language),
            dataIndex: 'soprioritycode',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoList.field.sodType', this.language),
            dataIndex: 'sodeliverytype',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoList.field.serviceLevel', this.language),
            dataIndex: 'servicelevel',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoList.field.shippingMethod', this.language),
            dataIndex: 'shippingmethod',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoDetailList.field.premierCustomer', this.language),
            dataIndex: 'altshipto',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoDetailList.field.CRUDSWAP', this.language),
            dataIndex: 'CRUDSWAP',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoDetailList.field.beReturn', this.language),
            dataIndex: 'beReturn',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoDetailList.field.milkrun', this.language),
            dataIndex: 'milkrun',
            render: text => <AdSelect value={text} onlyRead={true} />,
        }, {
            title: transferLanguage('CoDetailList.field.coverageHours', this.language),
            dataIndex: 'covhours',
            render: text => <AdSelect value={text} onlyRead={true} />,
        }, {
            title: transferLanguage('CoDetailList.field.commitedsericetw', this.language),
            dataIndex: 'commitedsericetw',
            render: text => <AdSelect value={text} onlyRead={true} />,
        }, {
            title: transferLanguage('CoDetailList.field.mtm', this.language),
            dataIndex: 'productid',
            render: text => <AdSelect value={text} onlyRead={true} />,
        }, {
            title: transferLanguage('CoDetailList.field.machineSn', this.language),
            dataIndex: 'serialnumberid',
            render: text => <AdSelect value={text} onlyRead={true} />,
        }, {
            title: transferLanguage('CoDetailList.field.hddRetention', this.language),
            dataIndex: 'hdretenion',
            render: text => <AdSelect value={text} onlyRead={true} />,
        }, {
            title: transferLanguage('CoDetailList.field.partsSn', this.language),
            dataIndex: 'partserialnumber',
            render: text => <AdSelect value={text} onlyRead={true} />,
        }, {
            title: transferLanguage('CoDetailList.field.returnStatus', this.language),
            dataIndex: 'returnStatus',
            render: text => <AdSelect value={text} onlyRead={true} />,
        }, {
            title: transferLanguage('PoDetailList.field.eta', this.language),
            dataIndex: 'eta',
            render: text => <AdSelect value={text} onlyRead={true} />,
        }, {
            // title: '联想发货单号',
            title: transferLanguage('CoDetailList.field.dn', this.language),
            dataIndex: 'dn',
            render: text => <AdSelect value={text} onlyRead={true} />,
        }, {
            title: transferLanguage('CoDetailList.field.forwarder', this.language),
            dataIndex: 'forwarder',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoDetailList.field.bol', this.language),
            dataIndex: 'bolNo'
        },
        {
            title: transferLanguage('CoList.field.shipFromWmCode', this.language),
            dataIndex: 'shipFromWmCode'
        }, {
            title: transferLanguage('CoList.field.pouName', this.language),
            dataIndex: 'sellername'
        }, {
            title: transferLanguage('CoList.field.shipToWmCode', this.language),
            dataIndex: 'shipToWmCode'
        }, {
            title: transferLanguage('CoList.field.toCountry', this.language),
            dataIndex: 'toCountryId'
        }, {
            title: transferLanguage('CoList.field.toState', this.language),
            dataIndex: 'altshiptostate'
        }, {
            title: transferLanguage('CoList.field.toCity', this.language),
            dataIndex: 'altshiptocity'
        },
        {
            title: transferLanguage('CoList.field.toZip', this.language),
            dataIndex: 'altshiptopostcode'
        },
        {
            title: transferLanguage('CoList.field.contactorName', this.language),
            dataIndex: 'altshiptocontactor'
        },
        {
            title: transferLanguage('CoList.field.email', this.language),
            dataIndex: 'altshiptoemail'
        },
        {
            title: transferLanguage('CoList.field.telephone', this.language),
            dataIndex: 'altshiptophone'
        }, {
            title: transferLanguage('CoList.field.address', this.language),
            dataIndex: 'altshiptoadd'
        }, {
            title: transferLanguage('CoList.field.shippingInstruction', this.language),
            dataIndex: 'shippinginstr'
        }, {
            title: transferLanguage('CoList.field.deliveryInstruction', this.language),
            dataIndex: 'servicedelinstr'
        },
        {
            // title: '毛重',
            title: transferLanguage('CoDetailList.field.grossWeight', this.language),
            dataIndex: 'totalGrossWeight',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            // title: '净重',
            title: transferLanguage('CoDetailList.field.netWeight', this.language),
            dataIndex: 'totalNetWeight',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            // title: '体积',
            title: transferLanguage('CoDetailList.field.volume', this.language),
            dataIndex: 'totalVolume',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        // {
        //     // title: '运输优先级',
        //     title: transferLanguage('CoDetailList.field.transportPriority', this.language),
        //     dataIndex: 'transportPriority',
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        // },
        // {
        //     // title: '单价',
        //     title: transferLanguage('CoDetailList.field.unitPrice', this.language),
        //     dataIndex: 'unitPrice',
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        // },
        {
            // title: '备注',
            title: transferLanguage('CoDetailList.field.remarks', this.language),
            dataIndex: 'remarks',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoDetailList.field.updateBy', this.language),
            dataIndex: 'updateBy',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('CoDetailList.field.updateTime', this.language),
            dataIndex: 'updateTime',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
    ]


    // 模块渲染后的 todo
    componentDidMount() {
        this.getWmsPoList();
        this.setState({
            _SelectColumns: columnConfiguration(SelectColumns, this.props.language)
        })
    }
    // modalShow = (record)=>{
    //     router.push(`/outbound/listOBPlan/detailOBPlan/${record.id}`)
    // }
    // 调用接口获取数据
    getWmsPoList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'obplan/obplanList',
            payload: params,
            callback: data => {
                if (!data) return;
                let valueList = [];
                data.map(v => {
                    const labels = ['senderId'];
                    labels.map(item => {
                        if (v[item] && !valueList.includes(v[item])) {
                            valueList.push(v[item]);
                            !searchValue[v[item]] &&
                                dispatch({
                                    type: 'component/querySearchValue',
                                    payload: {
                                        params: { id: v[item] },
                                        url: 'sms/sms-sender/viewSmsSenderDetails',
                                    },
                                });
                        }
                    });
                });
            },
        });
    };

    //重置
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        this.getWmsPoList();
    };

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };

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

    //查询
    handleSearch = values => {
        const { shipFromWmCode, fromCountryId, shipToWmCode, toCountryId, createTime, altshiptopostcode, ...value } = values;
        shipFromWmCode ? value.shipFromWmCode = shipFromWmCode[0].code : null
        fromCountryId ? value.fromCountryId = fromCountryId[0].id : null
        shipToWmCode ? value.shipToWmCode = shipToWmCode[0].code : null
        toCountryId ? value.toCountryId = toCountryId[0].id : null
        if (createTime && createTime.length > 0) {
            value.createTimeStart = moment(createTime[0]).format(formatDate)
            value.createTimeEnd = moment(createTime[1]).format(formatDate)
        } else {
            value.createTimeStart = ""
            value.createTimeEnd = ""
        }
        if (altshiptopostcode && altshiptopostcode.length > 0) {
            value.altshiptopostcodeStart = moment(altshiptopostcode[0]).format(formatDate)
            value.altshiptopostcodeEnd = moment(altshiptopostcode[1]).format(formatDate)
        } else {
            value.altshiptopostcodeStart = ""
            value.altshiptopostcodeEnd = ""
        }
        this.setState({
            formValues: value,
        });
        this.getWmsPoList(value);
    };

    //新建
    handleAdd = () => {
        const { dispatch } = this.props;
        router.push(`/order/listWmsPo/addWmsPo`);
    };

    // 分页操作：改参数
    handleStandardTableChange = param => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
            ...formValues,
            ...param,
        };
        this.getWmsPoList(params);
    };
    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };
    //编辑：
    handleEdit = (e, record) => {
        e.stopPropagation();
        const { dispatch } = this.props;
        const { id } = record;

        dispatch({
            type: 'obplan/obplanDetails',
            payload: { id },
            callback: res => {
                this.setState({
                    isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
                });
            },
        });
        router.push(`/order/listWmsPo/editWmsPo/${id}`);
    };

    //启用、禁用：
    abledStatus = (type, isSingle) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {};
        params.ids = isSingle ? [checkId] : checkIds;
        params.type = type;
        dispatch({
            type: 'obplan/ableOperate',
            payload: params,
            callback: res => {
                this.getWmsPoList(formValues);

                if (isSingle) {
                    this.props.dispatch({
                        type: 'obplan/obplanDetails',
                        payload: { id: checkId },
                        callback: res => {
                            this.setState({
                                isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
                            });
                        },
                    });
                }
            },
        });
    };
    // 生成ASN
    generateShipping = (type, isSingle) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {};
        params.ids = isSingle ? [checkId] : checkIds;
        dispatch({
            type: 'obplan/generateShipping',
            payload: params,
            callback: res => {
                this.getWmsPoList(formValues);
                if (isSingle) {
                    this.props.dispatch({
                        type: 'obplan/obplanDetails',
                        payload: { id: checkId },
                        callback: res => {
                            this.setState({
                                isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
                            });
                        },
                    });
                }
            },
        });
    };

    render() {
        const {
            loading,
            obplan: { obplanList, obplanDetails },
            form,
            isMobile,
            dictObject,
            language,
        } = this.props;
        const { getFieldDecorator } = form;
        const {
            selectedRows,
            isAbled,
            checkId,
            visible,
            rowDetails,
            expandForm,
            shipFromWmCode,
            _SelectColumns,
            fromCountryId,
            shipToWmCode,
            toCountryId,
        } = this.state;

        const selectDetails = obplanDetails[checkId];

        // 设置查询条件
        const firstFormItem = (
            <FormItem label={transferLanguage('CoDetailList.field.coNo', this.language)}>
                {getFieldDecorator('coNo')(<Input placeholder="" />)}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label={transferLanguage('CoDetailList.field.SOID', this.language)}>
                {getFieldDecorator('soDetailNo')(<Input placeholder="" />)}
            </FormItem>

        );

        // secondForm 参数
        const otherFormItem = [
            [
                <FormItem label={transferLanguage('CoList.field.bizSoNo', this.language)}>
                    {getFieldDecorator('bizSoNo')(<Input placeholder="" />)}
                </FormItem>,
                // <FormItem label={transferLanguage('CoDetailList.field.status', this.language)}>
                //     {getFieldDecorator('status')(
                //         <Select placeholder={transferLanguage('Common.field.select', this.language)} style={{ width: '100%' }} allowClear={true}>
                //             
                //             {Status.map(v => {
                //                 return <Option value={v.code}>{v.value}</Option>;
                //             })}
                //         </Select>
                //     )}
                // </FormItem>,
            ],
            [
                <FormItem label={transferLanguage('CoDetailList.field.pickingStatus', this.language)}>
                    {getFieldDecorator('pickingStatus')(<Input placeholder="" />)}
                </FormItem>,
                <FormItem label={transferLanguage('CoDetailList.field.pickingNO', this.language)}>
                    {getFieldDecorator('pickingNO')(<Input placeholder="" />)}
                </FormItem>,
                <FormItem label={transferLanguage('CoDetailList.field.deliveryStatus', this.language)}>
                    {getFieldDecorator('deliveryStatus')(<Input placeholder="" />)}
                </FormItem>,
            ],
            [

                <FormItem label={transferLanguage('CoDetailList.field.deliveryNo', this.language)}>
                    {getFieldDecorator('deliveryNo')(<Input placeholder="" />)}
                </FormItem>,
                <FormItem label={transferLanguage('CoList.field.soType', this.language)}>
                    {getFieldDecorator('serviceordertype')(<Input placeholder="" />)}
                </FormItem>,
                <FormItem label={transferLanguage('CoList.field.soPriority', this.language)}>
                    {getFieldDecorator('soprioritycode')(<Input placeholder="" />)}
                </FormItem>,
            ],
            [

                <FormItem label={transferLanguage('CoList.field.sodType', this.language)}>
                    {getFieldDecorator('sodeliverytype')(<Input placeholder="" />)}
                </FormItem>,
                <FormItem label={transferLanguage('CoList.field.serviceLevel', this.language)}>
                    {getFieldDecorator('servicelevel')(<Input placeholder="" />)}
                </FormItem>,
                <FormItem label={transferLanguage('CoList.field.shipFromWmCode', this.language)}>
                    {getFieldDecorator('shipFromWmCode')(
                        <SearchSelect
                            dataUrl={'/wms-warehouse/selectWmsWarehouseList'}
                            selectedData={shipFromWmCode} // 选中值
                            showValue="name"
                            searchName="name"
                            multiple={false}
                            columns={_SelectColumns}
                            onChange={values => this.getValue(values, 'shipFromWmCode')}
                            id="shipFromWmCode"
                            allowClear={true}
                            scrollX={200}
                        />
                    )}
                </FormItem>,
            ],
            [

                <FormItem label={transferLanguage('CoList.field.fromCountry', this.language)}>
                    {getFieldDecorator('fromCountryId')(
                        <SearchSelect
                            dataUrl={'/mds-country/selectMdsCountryList'}
                            selectedData={fromCountryId} // 选中值
                            showValue="name"
                            searchName="name"
                            multiple={false}
                            columns={_SelectColumns}
                            onChange={values => this.getValue(values, 'fromCountryId')}
                            id="fromCountryId"
                            allowClear={true}
                            scrollX={200}
                        />
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('CoList.field.pouName', this.language)}>
                    {getFieldDecorator('sellername')(<Input placeholder="" />)}
                </FormItem>,
                <FormItem label={transferLanguage('CoList.field.shipToWmCode', this.language)}>
                    {getFieldDecorator('shipToWmCode')(
                        <SearchSelect
                            dataUrl={'/wms-warehouse/selectWmsWarehouseList'}
                            selectedData={shipToWmCode} // 选中值
                            showValue="name"
                            searchName="name"
                            multiple={false}
                            columns={_SelectColumns}
                            onChange={values => this.getValue(values, 'shipToWmCode')}
                            id="shipToWmCode"
                            allowClear={true}
                            scrollX={200}
                        />
                    )}
                </FormItem>,
            ],
            [

                <FormItem label={transferLanguage('CoList.field.toCountry', this.language)}>
                    {getFieldDecorator('toCountryId')(
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
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('CoList.field.toState', this.language)}>
                    {getFieldDecorator('altshiptostate')(<Input placeholder="" />)}
                </FormItem>,
                <FormItem label={transferLanguage('CoList.field.toCity', this.language)}>
                    {getFieldDecorator('altshiptocity')(<Input placeholder="" />)}
                </FormItem>,
            ],
            [

                <FormItem label={transferLanguage('CoList.field.toZip', this.language)}>
                    {getFieldDecorator('altshiptopostcode')(<Input placeholder="" />)}
                </FormItem>,
                <FormItem label={transferLanguage('CoList.field.ordrDate', this.language)}>
                    {getFieldDecorator('createTime')(
                        <AntdDatePicker mode="range" placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createEndTime', language)]} />
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('CoList.field.soDate', this.language)}>
                    {getFieldDecorator('altshiptopostcode')(
                        <AntdDatePicker mode="range" placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createEndTime', language)]} />
                    )}
                </FormItem>,
            ],
            [
                <FormItem label={transferLanguage('CoDetailList.field.deliveryDate', this.language)}>
                    {getFieldDecorator('altshiptopostcode')(
                        <AntdDatePicker mode="range" placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createEndTime', language)]} />

                    )}
                </FormItem>,
            ],
            ['operatorButtons']
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
        const tableButtonsParams = {
            show: true,
            // handleAdd: this.handleAdd,
            buttons: (
                <Button.Group>
                    <Button
                        onClick={() => this.generateShipping()}
                        disabled={selectedRows.length > 0 ? false : true}
                    >
                        {transferLanguage('CoDetailList.field.generate', this.language)}
                    </Button>
                </Button.Group>
            ),
            selectedRows: selectedRows,
        };

        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={obplanList}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                />
            </Fragment>
        );
    }
}
