import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { routerRedux, Route, Switch } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Space, Dropdown, Menu } from 'antd';
import StandardTable from '@/components/StandardTable';;
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, Status, formatStatus, Type, Putaway, SelectColumns } from './utils';
import AdSelect from '@/components/AdSelect';
import AdModal from '@/components/AdModal';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import { transferLanguage, columnConfiguration } from '@/utils/utils';
import { formItemFragement, formatPrice, queryDict, allDictList } from '@/utils/common';
import Prompt from '@/components/Prompt';
import AntdDatePicker from '@/components/AntdDatePicker';
import FileImport from '@/components/FileImport'
import SearchSelect from '@/components/SearchSelect';
import AdButton from '@/components/AdButton';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@ManageList
@connect(({ Rmo, common, component, loading, i18n }) => ({
    Rmo,
    loading: loading.effects['Rmo/selectRmoList'],
    rmoList: Rmo.rmoList,
    OBNticeDetail: Rmo.OBNticeDetail,
    searchValue: component.searchValue,
    language: i18n.language,
    // dictObject:component.dictObject,
}))
@Form.create()
export default class rmoList extends Component {
    state = {
        expandForm: false,
        selectedRows: [],
        checkId: '',
        checkIds: [],
        formValues: {},
        isAbled: '',
        visible: false,
        APRHvisible: false,
        visibleImport: false,
        visibleRMA: false,
        visibleUpdateRMA: false,
        rmaArr: '',
        toCountryId: [],
        _SelectColumns: [],

    };
    className = 'Rmo';

    componentDidMount() {
        this.setState({
            _SelectColumns: columnConfiguration(SelectColumns, this.props.language)
        })
        this.getIQCList();
        // const allDict = [
        //     allDictList.Disposition,
        //     allDictList.Redemption,
        //     allDictList.partStatus,

        // ]
        // queryDict({ props: this.props, allDict });
    }

    getIQCList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'Rmo/selectRmoList',
            payload: params,
            callback: data => {
                if (!data) return;
            },
        });
    };
    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };
    //重置
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        this.getIQCList();
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
        const { qualityDate, qualityApplyDate, ...value } = values;
        if (qualityDate && qualityDate.length > 0) {
            value.qualityDateStart = moment(qualityDate[0]).format('YYYY-MM-DD')
            value.qualityDateEnd = moment(qualityDate[1]).format('YYYY-MM-DD')
        } else {
            value.qualityDateStart = ""
            value.qualityDateEnd = ""
        }
        if (qualityApplyDate && qualityApplyDate.length > 0) {
            value.qualityApplyDateStart = moment(qualityApplyDate[0]).format('YYYY-MM-DD')
            value.qualityApplyDateEnd = moment(qualityApplyDate[1]).format('YYYY-MM-DD')
        } else {
            value.qualityApplyDateStart = ""
            value.qualityApplyDateEnd = ""
        }
        this.setState({
            formValues: value,
        });
        this.getIQCList(value);
    };

    // 分页操作：改参数
    handleStandardTableChange = param => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
            ...formValues,
            ...param,
        };
        this.getIQCList(params);
    };

    //编辑：
    handleEdit = (e, record) => {
        e.stopPropagation();
        const { dispatch } = this.props;
        const { id } = record;

        dispatch({
            type: 'Rmo/asnDetails',
            payload: { id },
        });
        router.push(`/rms/rmo/detailRmo/${id}`);
    };

    //启用、禁用：
    abledStatus = (type) => {
        const { dispatch } = this.props;
        const { checkIds, formValues } = this.state;
        let params = {};
        params.ids = checkIds;
        params.type = type
        dispatch({
            type: 'Rmo/ableOperate',
            payload: params,
            callback: res => {
                this.getIQCList(formValues);
            },
        });
    };
    upDateRma = () => {
        const { selectedRows } = this.state

        this.setState({
            visibleUpdateRMA: true,
            rmaArr: selectedRows[0].rmaNo

        })

    }
    //质检确认 toAPRH
    toAPRH = () => {
        const { APRHvisible, selectedRows, checkIds } = this.state
        const { dispatch } = this.props
        dispatch({
            type: 'Rmo/viewOBNticeShip',
            payload: { ids: checkIds },
            callback: data => {
                console.log('data???', data)
                this.setState({
                    APRHvisible: true,
                    toCountryId: [{ code: data.country }]
                })
            }
        })

    }

    forceClose = () => {
        const { visible, selectedRows, checkIds } = this.state
        const { dispatch, form: { getFieldValue } } = this.props
        const keyWord = getFieldValue('remark')
        dispatch({
            type: 'Rmo/forceClose',
            payload: { id: checkIds[0], keyWord },
            callback: data => {
                this.setState({ visible: false })
            }
        })
    }

    onCancel = () => {
        const { visible } = this.state
        this.setState({ visible: !visible })
    }
    handleOk = () => {
        const { dispatch, form: { getFieldValue } } = this.props
        const { checkIds, formValues } = this.state
        const rmaNo = getFieldValue('rmaArrNo')
        if (!rmaNo) {
            Prompt({ content: 'Please Input RMA!', type: 'warn' })
            return
        }
        let params = {
            type: 'updateRMA',
            rmaNo,
            ids: checkIds
        }
        dispatch({
            type: 'Rmo/ableOperate',
            payload: params,
            callback: res => {
                this.setState({ visibleUpdateRMA: false })
                this.getIQCList(formValues);
            }
        })
    }
    handleOkAPRH = (type) => {
        const { dispatch, form } = this.props;
        const { checkIds, formValues, APRHvisible, visibleImport } = this.state;
        form.validateFields((err, values) => {
            if (err) return
            const { country, rmaArrNo, rmaNo, rmoNo, rmoStatus, soId, ...value } = values
            value.country = country[0].code

            let params = {
                type: 'shipToAPRH',
                ids: checkIds,
                wmsOBNoticeShipVO: value
            };
            console.log('values===????', value)
            dispatch({
                type: 'Rmo/ableOperate',
                payload: params,
                callback: res => {
                    this.setState({ APRHvisible: false })
                    this.getIQCList(formValues);
                },
            });

        })
    }
    onCancelAPRH = (type) => {
        const { APRHvisible, visibleImport, visibleRMA } = this.state
        if (type == 'import') {
            this.setState({ visibleImport: !visibleImport })
        } else if (type == 'importRMA') {
            this.setState({ visibleRMA: !visibleRMA })
        }
        else {
            this.setState({ APRHvisible: !APRHvisible })
        }
    }
    export = (type) => {
        const { formValues,checkIds } = this.state
        const { dispatch } = this.props
        console.log('JSON.stringify(checkIds)',JSON.stringify(checkIds))
        dispatch({
            type: 'Rmo/exportRMO',
            payload: { ...formValues ,ids:JSON.stringify(checkIds)},
        });
    }
    menuBtn = (e) => {

    }

    render() {
        const {
            loading,
            rmoList,
            OBNticeDetail,
            form,
            language,
            // dictObject
        } = this.props;
        const { getFieldDecorator } = form;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const {
            selectedRows,
            isAbled,
            checkId,
            visible,
            rowDetails,
            expandForm,
            APRHvisible,
            visibleImport,
            visibleRMA,
            visibleUpdateRMA,
            rmaArr,
            _SelectColumns,
            toCountryId,
        } = this.state;
        //列表 列
        const columns = [{
            title: '#',
            dataIndex: 'index',
            render: (text, record, index) => (<span>{index + 1}</span>),
            width: 50
        },
        {
            title: transferLanguage('RMO.field.rmoNo', language),
            dataIndex: 'rmoNo',
            render: (text, record) => (
                <a onClick={e => this.handleEdit(e, record)} title={text}>
                    {text}
                </a>
            ),
        },
        {
            title: transferLanguage('RMO.field.rmoStatus', language),
            dataIndex: 'rmoStatus',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('ASN.field.shipFromWmCode', language),
            dataIndex: 'shipFromWarehouseCode',
            // render: text => <AdSelect value={text} onlyRead={true} />,
        },

        {
            title: transferLanguage('RMO.field.rmaNo', language),
            dataIndex: 'rmaNo',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('RMO.field.soId', language),
            dataIndex: 'soId',
        },
        {
            title: transferLanguage('IQC.field.qualityNo', language),
            dataIndex: 'qualityNo',
        },
        {
            title: transferLanguage('RMO.field.repairName', language),
            dataIndex: 'repairName',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('RMO.field.finalLocation', language),
            dataIndex: 'finalLocation',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('RMO.field.noticeNo', language),
            dataIndex: 'noticeNo',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('RMO.field.partNo', language),
            dataIndex: 'partNo',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('Logistics.field.partCC', language),
            dataIndex: 'partCc',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('RMO.field.rhRedemptionReturnPn', language),
            dataIndex: 'rhRedemptionReturnPn',
            render: text => <AdSelect value={text} onlyRead={true} />,
            width: 200
        },
        {
            title: transferLanguage('RMO.field.rhRedemptionReturnSn', language),
            dataIndex: 'rhRedemptionReturnSn',
            render: text => <AdSelect value={text} onlyRead={true} />,
            width: 200,

        },
        {
            title: transferLanguage('RMO.field.rhDispositionCode', language),
            width: 200,
            dataIndex: 'rhDispositionCode',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('RMO.field.rhRedemptionCode', language),
            width: 200,
            dataIndex: 'rhRedemptionCode',
        },
        {
            title: transferLanguage('RMO.field.rhRedemptionUpdateTime', language),
            width: 200,
            dataIndex: 'rhRedemptionUpdateTime',
        },
        {
            title: transferLanguage('RMO.field.rhRmaRepairedPn', language),
            width: 200,
            dataIndex: 'rhRmaRepairedPn',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('RMO.field.rhRmaRepairedSn', language),
            width: 200,
            dataIndex: 'rhRmaRepairedSn',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('RMO.field.rhRmaStatusCode', language),
            width: 200,
            dataIndex: 'rhRmaStatusCode',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('RMO.field.rhRmaStatusDescription', language),
            width: 250,
            dataIndex: 'rhRmaStatusDescription',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('RMO.field.rmoFinishedDate', language),
            width: 250,
            dataIndex: 'rmoFinishedDate',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('RMO.field.rhRmaUpdateTime', language),
            width: 200,
            dataIndex: 'rhRmaUpdateTime',
            render: text => <AdSelect value={text} onlyRead={true} />,
        }, {
            title: transferLanguage('RMO.field.rhRedemptionStatus', language),
            width: 200,
            dataIndex: 'rhRedemptionStatus',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },

        {
            title: transferLanguage('RMO.field.rhRedemptionPddReason', language),
            width: 200,
            dataIndex: 'rhRedemptionPddReason',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },

        {
            title: transferLanguage('RMO.field.remark', language),
            dataIndex: 'remark',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('RMO.field.repairCode', language),
            dataIndex: 'repairCode',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('RMO.field.repairAddress', language),
            dataIndex: 'repairAddress',
        },
        {
            title: transferLanguage('RMO.field.partStatus', language),
            dataIndex: 'partStatus',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('PoList.field.poNo', language),
            dataIndex: 'poNo',
        }, {
            title: transferLanguage('ASN.field.asnNo', language),
            dataIndex: 'asnNo',
        }, {
            title: transferLanguage('RMO.field.refurbisherAsnNo', language),
            dataIndex: 'refurbisherAsnNo',
        },
        {
            title: transferLanguage('Delivery.field.createBy', language),
            dataIndex: 'createBy',
        },

        {
            title: transferLanguage('Delivery.field.createTime', language),
            dataIndex: 'createTime',
        },
        {
            title: transferLanguage('Delivery.field.updateBy', language),
            dataIndex: 'updateBy',
        },
        {
            title: transferLanguage('Delivery.field.updateTime', language),
            dataIndex: 'updateTime',
        },
        ];
        const firstFormItem = (
            <FormItem label={transferLanguage('RMO.field.rmoNo', language)}>
                {getFieldDecorator('rmoNo')(<TextArea rows={1} />)}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label={transferLanguage('RMO.field.rmaNo', language)}>
                {getFieldDecorator('rmaNo')(
                    <TextArea rows={1} />
                )}
            </FormItem>
        );

        // secondForm 参数
        const otherFormItem = [
            [
                <FormItem label={transferLanguage('RMO.field.soId', language)}>
                    {getFieldDecorator('soId')(
                        <TextArea rows={1} />
                        // <DatePicker placeholder={transferLanguage('Common.field.selectDate', language)} />
                    )}
                </FormItem>,
            ],
            [,
                <FormItem label={transferLanguage('RMO.field.partNo', language)}>
                    {getFieldDecorator('partNo')(
                        <Input />
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('RMO.field.rmoStatus', language)}>
                    {getFieldDecorator('rmoStatus')(
                       <AdSelect payload={{code:allDictList.rmoStatus}} mode='multiple'/>
                    )}
                    
                </FormItem>,
                <FormItem label={transferLanguage('IQC.field.qualityNo', language)}>
                    {getFieldDecorator('qualityNo')(
                        <TextArea rows={1} />
                    )}
                </FormItem>,
            ],
            [
                <FormItem label={transferLanguage('Logistics.field.partCC', language)}>
                    {getFieldDecorator('partCc')(
                        <AdSelect payload={{ code: allDictList.RMOPartCC }} mode='multiple'/>
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('RMO.field.noticeNo', language)}>
                    {getFieldDecorator('noticeNo')(
                        <Input />
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('RMO.field.repairName', language)}>
                    {getFieldDecorator('repairName')(
                        <Input />
                    )}
                </FormItem>,
            ],
            ['operatorButtons',]

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
            buttons: (
                <div>
                    <Button.Group>
                        <AdButton
                            onClick={() => this.abledStatus('createRmaNo')}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('IQC.button.createRmaNo', language)}
                            code={codes.createRMA}
                        />
                        <AdButton
                            onClick={() => this.upDateRma()}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('RMO.field.updateRMA', language)}
                            code={codes.updateRMA}
                        />
                        <AdButton
                            onClick={() => this.toAPRH()}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('IQC.button.shipToAPRH', language)}
                            code={codes.createOB}
                        />
                        <AdButton
                            onClick={() => this.abledStatus('cancelAPRH')}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('IQC.button.cancelOBNotice', language)}
                            code={codes.cancelOB}
                        />
                        <AdButton
                            onClick={() => this.abledStatus('createReceipt')}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('IQC.button.createReceipt', language)}
                            code={codes.createReceipt}
                        />
                        <AdButton
                            onClick={() => this.setState({ visible: true })}
                            disabled={selectedRows.length === 1 ? false : true}
                            text={transferLanguage('IQC.button.forceClose', language)}
                            code={codes.createReceipt}
                        />
                    </Button.Group>
                </div>
            ),
            rightButtons: (
                <Button.Group>
                    <AdButton
                        onClick={() => this.setState({ visibleRMA: true })}
                        text={transferLanguage('IQC.button.importRMACode', language)}
                        code={codes.importStatus}
                    />

                    <AdButton
                        onClick={() => this.setState({ visibleImport: true })}
                        text={transferLanguage('IQC.button.importRMANo', language)}
                        code={codes.importRMA}
                    />

                    <AdButton
                        onClick={() => this.export()}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Common.field.export', language)}
                        code={codes.export}
                    />
                </Button.Group>
            ),
            selectedRows: selectedRows,
        };
        const formItem = [
            [
                <AntdFormItem label={transferLanguage('shipping.field.shipTo', language)}
                    code='shipTo'
                    rules={[{ required: true }]}

                    initialValue={OBNticeDetail ? OBNticeDetail.shipTo : ''}
                    {...commonParams}
                >
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('shipping.field.shipToCountry', language)}
                    code='country'
                    rules={[{ required: true }]}
                    initialValue={toCountryId && toCountryId[0] ? toCountryId[0].code : ''}
                    {...commonParams}

                >
                    <SearchSelect
                        dataUrl={'/mds-country/selectMdsCountryList'}
                        selectedData={toCountryId} // 选中值
                        showValue="code"
                        searchName="code"
                        multiple={false}
                        columns={_SelectColumns}
                        onChange={values => this.getValue(values, 'toCountryId')}
                        id="toCountryId"
                        allowClear={true}
                        scrollX={200}
                    />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('shipping.field.shipToState', language)}
                    code='state'
                    {...commonParams}
                    initialValue={OBNticeDetail ? OBNticeDetail.state : ''}
                >
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('shipping.field.shipToCity', language)}
                    code='city'
                    {...commonParams}
                    initialValue={OBNticeDetail ? OBNticeDetail.city : ''}
                >
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('shipping.field.shipToZip', language)}
                    code='zipCode'
                    {...commonParams}
                    initialValue={OBNticeDetail ? OBNticeDetail.zipCode : ''}
                >
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('CoReport.field.contact', language)}
                    code='contact'
                    {...commonParams}
                    initialValue={OBNticeDetail ? OBNticeDetail.contact : ''}
                >
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('CoList.field.email', language)}
                    code='email'
                    {...commonParams}
                    initialValue={OBNticeDetail ? OBNticeDetail.email : ''}
                >
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('CoList.field.telephone', language)}
                    code='telephone'
                    {...commonParams}
                    initialValue={OBNticeDetail ? OBNticeDetail.telephone : ''}
                >
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('CoList.field.address', language)}
                    code='address'
                    rules={[{ required: true }]}
                    {...commonParams}
                    initialValue={OBNticeDetail ? OBNticeDetail.address : ''}
                >
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Common.field.remark', language)}
                    code='remark'
                    {...commonParams}
                    initialValue={OBNticeDetail ? OBNticeDetail.remark : ''}
                >
                    <TextArea row={1} />
                </AntdFormItem>,
            ],
        ]
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={rmoList}
                    columns={columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                />
                <AdModal
                    visible={visibleUpdateRMA}
                    title={transferLanguage('RMO.field.updateRMA', language)}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ visibleUpdateRMA: false, rmaArr: '' })}
                    width="500px"
                >
                    <Fragment>
                        <FormItem label={transferLanguage('RMO.field.rmaNo', language)}>
                            {getFieldDecorator('rmaArrNo', {
                                initialValue: rmaArr,
                                // rules:[{required:true}]
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Fragment>
                </AdModal>
                <AdModal
                    visible={APRHvisible}
                    title={transferLanguage('IQC.button.shipToAPRH', language)}
                    onOk={this.handleOkAPRH}
                    onCancel={() => this.setState({ APRHvisible: false })}
                    width="1000px"
                >
                    <AntdForm>{formItemFragement(formItem)}</AntdForm>
                </AdModal>
                <FileImport
                    visibleFile={visibleImport}
                    handleCancel={() => {
                        this.onCancelAPRH('import');
                    }}
                    urlImport={`wms-quality-doc/importWmsQuality`}
                    // urlCase={`wms-po/download`}
                    // queryData={[this.getWmsPoList]}
                    accept=".xls,.xlsx"
                // form={this.props.form}
                />
                <FileImport
                    visibleFile={visibleRMA}
                    handleCancel={() => {
                        this.onCancelAPRH('importRMA');
                    }}
                    urlImport={`api/reverse/uploadRedemption`}
                    urlCase={`wms-quality-rmo/downloadRedemptionTemplate`}
                    // queryData={[this.getWmsPoList]}
                    accept=".xls,.xlsx"
                // form={this.props.form}
                />
                {visible && <AdModal
                    visible={visible}
                    title={transferLanguage('CoDetailList.button.Remark', language)}
                    onOk={() => this.forceClose()}
                    onCancel={() => this.setState({ visible: !visible })}
                    width='600px'

                >
                    <div>
                        <AntdFormItem label={transferLanguage('CoDetailList.button.Remark')}
                            code="remark"
                            {...commonParams}
                        >
                            <Input.TextArea rows={2} />
                        </AntdFormItem>
                    </div>
                </AdModal>}
            </Fragment>
        );
    }
}
