import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Form, Input, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import SearchSelect from '@/components/SearchSelect';
import AntdDatePicker from '@/components/AntdDatePicker';
import TableButtons from '@/components/TableButtons';
import { codes, Status, columns, SelectColumns, typeStatus } from './utils';
import AdSelect from '@/components/AdSelect';
import { transferLanguage, columnConfiguration } from '@/utils/utils';
import AdButton from '@/components/AdButton';
import {allDictList} from '@/utils/common'


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

@ManageList
@connect(({ ibplan, common, component, loading, i18n }) => ({
    ibplan,
    loading: loading.effects['ibplan/ibplanList'],
    dictObject: common.dictObject,
    searchValue: component.searchValue,
    language: i18n.language

}))
@Form.create()
export default class IBPlanList extends Component {
    state = {
        expandForm: false,
        selectedRows: [],
        checkId: '',
        checkIds: [],
        formValues: {},
        isAbled: '',
        _columns: [],
        _SelectColumns: [],
        Type: [],
        fromCountryId: [],
        shipToWmCode: [],
        _typeStatus: [],
    };
    className = 'ibplan';

    // 模块渲染后的 todo
    componentDidMount() {

        this.getWmsPoList();
        this.changeTitle(columns, '_columns')
        this.changeTitle(SelectColumns, '_SelectColumns')
        this.changeTitle(typeStatus, '_typeStatus')
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
    // 调用接口获取数据
    getWmsPoList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'ibplan/ibplanList',
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
            fromCountryId: [],
            shipToWmCode: [],
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
        const { fromCountryId, billTypeName, shipToWmCode, createTime, ...value } = values;
        if (billTypeName && billTypeName.length > 0) value.billTypeId = billTypeName[0].id
        if (fromCountryId && fromCountryId.length > 0) value.fromCountryId = fromCountryId[0].id
        if (shipToWmCode && shipToWmCode.length > 0) value.shipToWmCode = shipToWmCode[0].code
        if (createTime && createTime.length > 0) {
            value.createTimeStart = moment(createTime[0]).format('YYYY-MM-DD HH:mm:ss');
            value.createTimeEnd = moment(createTime[1]).format('YYYY-MM-DD HH:mm:ss');
        } else {
            value.createTimeStart = ''
            value.createTimeEnd = ''
        }
        // console.log('type???',type)
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

    //编辑：
    handleEdit = (e, record) => {
        e.stopPropagation();
        const { dispatch } = this.props;
        const { id } = record;
        console.log('test', record);

        dispatch({
            type: 'ibplan/ibplanDetails',
            payload: { id },
            callback: res => {
                this.setState({
                    isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
                });
            },
        });
        router.push(`/order/listWmsPo/editWmsPo/${id}`);
    };
    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };
    //启用、禁用：
    abledStatus = (type, isSingle) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {};
        params.ids = isSingle ? [checkId] : checkIds;
        params.type = type;
        dispatch({
            type: 'ibplan/ableOperate',
            payload: params,
            callback: res => {
                this.getWmsPoList(formValues);

                if (isSingle) {
                    this.props.dispatch({
                        type: 'ibplan/ibplanDetails',
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
    generateAsn = (type) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {};
        params.ids =  checkIds;
        params.type=type
        dispatch({
            type: 'ibplan/generateAsn',
            payload: params,
            callback: res => {
                this.getWmsPoList(formValues);
            },
        });
    };

    render() {
        const {
            loading,
            ibplan: { ibplanList, ibplanDetails },
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
            _columns,
            _SelectColumns,
            Type,
            fromCountryId,
            shipToWmCode,
            _typeStatus
        } = this.state;

        const selectDetails = ibplanDetails[checkId];

        // 设置查询条件
        const firstFormItem = (
            <FormItem label={transferLanguage('IBPlan.field.poNo', language)}>
                {getFieldDecorator('poNo')(<TextArea rows={1} />)}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label={transferLanguage('IBPlan.field.prNo', language)}>
                {getFieldDecorator('prNo')(<Input placeholder="" />)}
            </FormItem>

        );

        // secondForm 参数
        const otherFormItem = [
            [
                <FormItem label={transferLanguage('IBPlan.field.status', language)}>
                    {getFieldDecorator('status')(
                     <AdSelect payload={{code:allDictList.IBPlan_Status}}/>   

                    )}
                </FormItem>
            ],
            [<FormItem label={transferLanguage('IBPlan.field.dn', language)}>
                {getFieldDecorator('dn')(<TextArea rows={1}/>)}
            </FormItem>,
            <FormItem label={transferLanguage('IBPlan.field.bolNo', language)}>
                {getFieldDecorator('bolNo')(<TextArea rows={1} />)}
            </FormItem>,
            <FormItem label={transferLanguage('InventoryReport.field.so', language)}>
                {getFieldDecorator('soNo')(<TextArea rows={1} />)}
            </FormItem>
            ],
            [
                <FormItem label={transferLanguage('PoList.field.fromCountry', language)}>
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
                <FormItem label={transferLanguage('PoList.field.shipTo', language)}>
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
                <FormItem label={transferLanguage('Common.field.createDate', language)}>
                    {getFieldDecorator('createTime')(
                        <AntdDatePicker format="YYYY-MM-DD HH:mm:ss" mode="range" placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createEndTime', language)]} />
                    )}
                </FormItem>
            ],
            [<FormItem label={transferLanguage('PoList.field.type', language)}>
                {getFieldDecorator('billTypeName')(
                    <SearchSelect
                        dataUrl={'/mds-bill-type/selectMdsBillTypeList'}
                        selectedData={Type} // 选中值
                        showValue="name"
                        searchName="name"
                        multiple={false}
                        columns={_SelectColumns}
                        onChange={values => this.getValue(values, 'Type')}
                        id="billTypeName"
                        allowClear={true}
                        scrollX={200}
                        payload={{ businessType: ['PO'] }}
                    />
                )}
            </FormItem>,
            <FormItem label={transferLanguage('Common.field.type', language)}>
                {getFieldDecorator('type')(
                     <AdSelect payload={{code:allDictList.IBPlan_Type}}/>   
                    
                )}
            </FormItem>
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
                    <AdButton
                        onClick={() => this.generateAsn('createASN')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('IBPlan.field.createASN', language)}
                        code={codes.createASN}
                    />
                   
                    <AdButton
                        onClick={() => this.generateAsn('autoASN')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('IBPlan.button.autoASN', language)}
                        code={codes.createAutoASN}
                    />
                   
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
                    data={ibplanList}
                    columns={_columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={false}
                    className={this.className}
                    code={codes.page}
                />
            </Fragment>
        );
    }
}
