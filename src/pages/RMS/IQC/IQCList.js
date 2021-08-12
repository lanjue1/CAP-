import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { routerRedux, Route, Switch } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Space, Dropdown, Menu, Collapse, } from 'antd';
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
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchSelect from '@/components/SearchSelect';
import AdButton from '@/components/AdButton';

const Panel = Collapse.Panel
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@ManageList
@connect(({ iqc, common, component, loading, i18n }) => ({
    iqc,
    loading: loading.effects['iqc/iqcList'],
    searchValue: component.searchValue,
    language: i18n.language,
    dictObject: common.dictObject,

}))
@Form.create()
export default class IQCList extends Component {
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
        activeKey: ['1', '2'],
        toCountryId: [],
        _SelectColumns: [],
        selectAllType: false
    };
    className = 'iqc';

    componentDidMount() {
        this.setState({
            _SelectColumns: columnConfiguration(SelectColumns, this.props.language)
        })
        this.getIQCList();
        const allDict = [
            allDictList.Disposition,
            allDictList.Redemption,
            allDictList.partStatus,
            allDictList.IQCStatus
        ]
        queryDict({ props: this.props, allDict });
    }

    getIQCList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'iqc/iqcList',
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
    getIQCVisible = (id) => {
        const { dispatch, iqc: { visibleIQCList } } = this.props
        dispatch({
            type: 'iqc/visibleList',
            payload: { id },
            callback: res => {
            }
        })
    }
    callback = key => {
        this.setState({
            activeKey: key,
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
            selectAllType: false
        });
    };

    //查询
    handleSearch = values => {
        const { qualityDate, qualityApplyDate, ...value } = values;
        if (qualityDate && qualityDate.length > 0) {
            value.qualityDateStart = moment(qualityDate[0]).format('YYYY-MM-DD')
            value.qualityDateEnd = moment(qualityDate[1]).format('YYYY-MM-DD')
            value.qualityDateStart +=' 00:00:00'
            value.qualityDateEnd +=' 23:59:59'
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
            type: 'iqc/asnDetails',
            payload: { id },
        });
        router.push(`/rms/iqc/detailIQC/${id}`);
    };

    //启用、禁用：
    abledStatus = (type) => {
        const { dispatch } = this.props;
        const { checkIds, formValues } = this.state;
        let params = {};
        params.ids = checkIds;
        params.type = type
        if (type == 'cancelCheck') {
            params.id = checkIds[0]
            params.ids = []
        }
        dispatch({
            type: 'iqc/ableOperate',
            payload: params,
            callback: res => {
                this.getIQCList(formValues);
            },
        });
    };

    //生成上架单
    putaway = () => {
        const { dispatch } = this.props;
        const { checkIds, formValues } = this.state;
        dispatch({
            type: 'iqc/generateWmsMoveDoc',
            payload: { id: checkIds[0] },
            callback: res => {
                this.getIQCList(formValues);
            },
        });
    }

    //收货入账
    delivery = () => {
        const { dispatch } = this.props;
        const { checkIds, formValues } = this.state;
        dispatch({
            type: 'iqc/asnReceiveConfirm',
            payload: { ids: checkIds },
            callback: res => {
                this.getIQCList(formValues);
            },
        });
    }
    //质检确认 toAPRH
    toAPRH = () => {
        const { APRHvisible, selectedRows } = this.state
        // if (selectedRows.length > 1) {
        //     Prompt({ content: transferLanguage('IQC.prompt.selectOneLine', this.props.language), type: 'warn' })
        //     return
        // }
        this.setState({ APRHvisible: !APRHvisible })
    }
    //质检
    modalVisible = () => {
        const { visible, selectedRows } = this.state
        if (selectedRows.length > 1) {
            Prompt({ content: transferLanguage('IQC.prompt.selectOneLine', this.props.language), type: 'warn' })
            return
        }
        this.setState({ visible: !visible })
        this.getIQCVisible(selectedRows[0].id)

    }
    //全选功能
    selectAll = () => {
        this.setState({
            selectAllType: true
        })
    }
    onCancel = () => {
        const { visible } = this.state
        this.setState({ visible: !visible })
    }
    handleOk = () => {
        const { dispatch, form: { getFieldValue } } = this.props
        const { selectedRows, visible, formValues } = this.state
        const finalDisposition = getFieldValue('finalDisposition')
        const finalLocation = getFieldValue('finalLocation')
        const finalRedemption = getFieldValue('finalRedemption')
        let params = {
            finalDisposition,
            finalLocation,
            finalRedemption,
            id: selectedRows[0].id
        }
        dispatch({
            type: 'iqc/reviewQualityConfirm',
            payload: params,
            callback: res => {
                this.setState({ visible: !visible })
                this.getIQCList(formValues);
            }
        })
    }

    handleOkAPRH = (type) => {
        const { dispatch, form } = this.props;
        const { checkIds, formValues, APRHvisible, visibleImport } = this.state;
        form.validateFields((err, values) => {
            if (err) return
            const { country, ...value } = values
            value.country = country[0].code

            let params = {
                type: 'shipToAPRH',
                ids: checkIds,
                wmsOBNoticeShipVO: value
            };
            console.log('values===????', values)
            dispatch({
                type: 'iqc/ableOperate',
                payload: params,
                callback: res => {
                    this.setState({ APRHvisible: !APRHvisible })
                    this.getIQCList(formValues);
                },
            });

        })
    }

    iqcTask = () => {
        router.push(`/rms/iqc/iqcTask/${this.state.checkIds[0]}`)
    }
    onCancelAPRH = (type) => {
        const { APRHvisible, visibleImport, visibleRMA, formValues } = this.state
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
        const { formValues } = this.state
        const { dispatch } = this.props
        console.log('?????', formValues)
        dispatch({
            type: 'iqc/exportIQC',
            payload: { ...formValues },
        });
    }
    menuBtn = (e) => {

    }
    handleMenu = (e) => {
        console.log('eeeee', e)
    }
    render() {
        const {
            loading,
            iqc: { iqcList, asnDetails, visibleIQCList },
            form,
            language,
            dictObject
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
            toCountryId,
            _SelectColumns,
            selectAllType
        } = this.state;
        const selectDetails = asnDetails[checkId];
        //列表 列
        const columns = [{
            title: '#',
            dataIndex: 'index',
            render: (text, record, index) => (<span>{index + 1}</span>),
            width: 50
        },
        {
            title: transferLanguage('IQC.field.qualityNo', language),
            dataIndex: 'qualityNo',
            render: (text, record) => (
                <a onClick={e => this.handleEdit(e, record)} title={text}>
                    {text}
                </a>
            ),
            sorter: true
            // render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('Common.field.status', language),
            dataIndex: 'status',
            // render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('Delivery.field.soId', language),
            dataIndex: 'soId',
            render: text => <AdSelect value={text} onlyRead={true} />,
            sorter: true
        },
        {
            title: transferLanguage('IQC.field.cidCode', language),
            dataIndex: 'cidCode',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },

        {
            title: transferLanguage('IQC.field.warehouseName', language),
            dataIndex: 'warehouseName',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.finalDisposition', language),
            dataIndex: 'finalDisposition',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.finalRedemption', language),
            dataIndex: 'finalRedemption',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.finalLocation', language),
            dataIndex: 'finalLocation',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.rmaStatus', language),
            dataIndex: 'rmaStatus',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        // {
        //     title: transferLanguage('IQC.field.cargoOwnerName', language),
        //     dataIndex: 'cargoOwnerName',
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        // },

        {
            title: transferLanguage('IQC.field.partName', language),
            dataIndex: 'partName',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.partNo', language),
            dataIndex: 'partNo',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.snNo', language),
            dataIndex: 'snNo',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },

        {
            title: transferLanguage('IQC.field.coo', language),
            dataIndex: 'iqcCoo',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.isSurfaceOpen', language),
            dataIndex: 'isSurfaceOpen',
            render: text => (<text>{text ? 'Y' : 'N'}</text>),
        },
        {
            title: transferLanguage('IQC.field.isMonitor', language),
            dataIndex: 'isMonitor',
            render: text => (<text>{text ? 'Y' : 'N'}</text>),
        },
        {
            title: transferLanguage('IQC.field.collectPn', language),
            dataIndex: 'collectPn',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.collectSn', language),
            dataIndex: 'collectSn',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.collectCoo', language),
            dataIndex: 'collectCoo',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.collectProduction', language),
            dataIndex: 'collectProduction',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.collectDisposition', language),
            dataIndex: 'collectDisposition',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.collectRemarks', language),
            dataIndex: 'collectRemarks',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.reDisposition', language),
            dataIndex: 'reDisposition',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.reRedemption', language),
            dataIndex: 'reRedemption',
            render: text => <AdSelect value={text} onlyRead={true} />,
        }, {
            title: transferLanguage('IQC.field.reLocation', language),
            dataIndex: 'reLocation',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },

        {
            title: transferLanguage('IQC.field.qualityDate', language),
            dataIndex: 'qualityDate',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },

        {
            title: transferLanguage('IQC.field.qualityWorker', language),
            dataIndex: 'qualityWorker',
            render: text => <AdSelect value={text} onlyRead={true} />,
            width: 100,
        },
        {
            title: transferLanguage('IQC.field.qualityApplyDate', language),
            dataIndex: 'qualityApplyDate',
            render: text => <AdSelect value={text} onlyRead={true} />,
            width: 200,
        },
        {
            title: transferLanguage('IQC.field.qualityApplyWorker', language),
            dataIndex: 'qualityApplyWorker',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.asnNo', language),
            dataIndex: 'asnNo',
            width: 150,
        },
        {
            title: transferLanguage('ASNDetail.field.poNo', language),
            dataIndex: 'poNo',
            width: 150,
        },
        {
            title: transferLanguage('IQC.field.obNoticeNo', language),
            dataIndex: 'noticeNo',
        },
        {
            title: transferLanguage('PickingDetail.field.moveNo', language),
            dataIndex: 'moveNo',
        },
        {
            title: transferLanguage('Delivery.field.deliveryNo', language),
            dataIndex: 'deliveryNo',
        },
        {
            title: transferLanguage('IQC.field.remarks', language),
            dataIndex: 'remarks',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.createBy', language),
            dataIndex: 'createBy',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.createTime', language),
            dataIndex: 'createTime',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },


        {
            title: transferLanguage('IQC.field.updateBy', language),
            dataIndex: 'updateBy',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('IQC.field.updateTime', language),
            dataIndex: 'updateTime',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },

        ];
        const firstFormItem = (
            <FormItem label={transferLanguage('IQC.field.qualityNo', language)}>
                {getFieldDecorator('qualityNo')(<TextArea rows={1} />)}
            </FormItem>
        );

        const secondFormItem = (
            <FormItem label={transferLanguage('Common.field.status', language)}>
                {getFieldDecorator('status')(
                    <AdSelect payload={{ code: allDictList.IQCStatus }} mode="multiple" />
                )}
            </FormItem>
        );

        // secondForm 参数
        const otherFormItem = [
            [
                <FormItem label={transferLanguage('IQC.field.snNo', language)}>
                    {getFieldDecorator('snNo')(
                        <TextArea rows={1} />
                    )}
                </FormItem>,

            ],
            [,
                <FormItem label={transferLanguage('IQC.field.qualityDate', language)}>
                    {getFieldDecorator('qualityDate')(
                        <AntdDatePicker mode="range" placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createEndTime', language)]} />
                        // <DatePicker placeholder={transferLanguage('Common.field.selectDate', language)} />
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('CoDetailList.field.SOID', language)}>
                    {getFieldDecorator('soId')(
                        <TextArea rows={1} />
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('IQC.field.partNo', language)}>
                    {getFieldDecorator('partNo')(
                        <TextArea rows={1} />
                    )}
                </FormItem>,
            ],
            [
                <FormItem label={transferLanguage('IQC.field.finalDisposition', language)}>
                    {getFieldDecorator('finalDisposition')(
                        <AdSelect payload={{ code: allDictList.finalDisposition }} mode="multiple" />
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('IQC.field.finalRedemption', language)}>
                    {getFieldDecorator('finalRedemption')(
                        <AdSelect payload={{ code: allDictList.finalRedemption }} mode="multiple" />

                    )}
                </FormItem>,
                <FormItem label={transferLanguage('RMO.field.finalLocation', language)}>
                    {getFieldDecorator('finalLocation')(
                        <AdSelect payload={{ code: allDictList.finalLocation }} mode="multiple" />

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
        // const menu = (
        //     <Menu onClick={this.handleMenu}>
        //         <Menu.Item key='1'>
        //             {transferLanguage('IQC.button.cancelConfirm', language)}
        //         </Menu.Item>
        //         <Menu.Item key='2'>
        //             {transferLanguage('IQC.button.cancelConfirm', language)}
        //         </Menu.Item>
        //     </Menu>
        // )
        let ableReceipt = selectedRows.length > 0 && selectedRows.every(v => v.status === 'IQCREVIEWFINISHED')
        // console.log('ableReceipt??',ableReceipt,selectedRows.every(v=>v.status=='IQCREVIEWFINISHED'))
        const tableButtonsParams = {
            //selectedLength参数加上就会显示所选多少条和全选功能
            // selectedLength: selectedRows.length,
            total: iqcList.pagination?.total,
            selectAllType: selectAllType,
            selectAll: this.selectAll,
            show: true,
            buttons: (
                <div>
                    <Button.Group>
                        <AdButton
                            onClick={() => this.abledStatus('cancel')}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('IQC.button.cancelConfirm', language)}
                            code={codes.cancelConfirm}
                        />
                        <AdButton
                            onClick={() => this.abledStatus('confirm')}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('IQC.button.confirm', language)}
                            code={codes.confirm}
                        />
                        <AdButton
                            onClick={() => this.abledStatus('onHold')}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('IQC.button.onHold', language)}
                            code={codes.onHold}
                        />
                        <AdButton
                            onClick={() => this.abledStatus('unOnHold')}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('IQC.button.unOnHold', language)}
                            code={codes.cancelOnHold}
                        />
                        <AdButton
                            onClick={() => this.iqcTask()}
                            disabled={selectedRows.length !== 1}
                            text={transferLanguage('IQC.button.QualityCheck', language)}
                            code={codes.qualityCheck}
                        />
                        <AdButton
                            onClick={() => this.abledStatus('cancelCheck')}
                            disabled={selectedRows.length !== 1}
                            text={transferLanguage('IQC.button.cancelCheck', language)}
                            code={codes.cancelCheck}
                        />
                        <AdButton
                            onClick={() => this.modalVisible()}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('IQC.button.reviewQuality', language)}
                            code={codes.reviewIQC}
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
                            disabled={ableReceipt ? false : true}
                            text={transferLanguage('IQC.button.createReceipt', language)}
                            code={codes.createReceipt}
                        />

                    </Button.Group>
                </div>

            ),
            // rightButtons: (
            //     <Button.Group>
            //         <Button
            //             onClick={() => this.setState({ visibleRMA: true })}
            //         // disabled={selectedRows.length > 0 ? false : true}
            //         >
            //             {transferLanguage('IQC.button.importRMACode', language)}
            //         </Button>
            //         <Button
            //             onClick={() => this.setState({ visibleImport: true })}
            //         // disabled={selectedRows.length > 0 ? false : true}
            //         >
            //             {transferLanguage('IQC.button.importRMANo', language)}
            //         </Button>
            //         <Button
            //             onClick={() => this.export()}
            //         // disabled={selectedRows.length > 0 ? false : true}
            //         >
            //             {transferLanguage('Common.field.export', language)}

            //         </Button>
            //     </Button.Group>
            // ),
            selectedRows: selectedRows,
        };
        const formItemBaseInfo = [
            [
                <AntdFormItem label={transferLanguage("IQC.field.qualityNo", language)} code="qualityNo"
                    initialValue={visibleIQCList.qualityNo}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("Delivery.field.soId", language)} code="soId"
                    initialValue={visibleIQCList.soId}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage("IQC.field.isSurfaceOpen", language)} code="isSurfaceOpen"
                    initialValue={visibleIQCList.isSurfaceOpen}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("IQC.field.isMonitor", language)} code="isMonitor"
                    initialValue={visibleIQCList.isMonitor}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage("IQC.field.collectPn", language)} code="collectPn"
                    initialValue={visibleIQCList.collectPn}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("IQC.field.partNo", language)} code="partNo"
                    initialValue={visibleIQCList.partNo}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage("IQC.field.collectSn", language)} code="collectSn"
                    initialValue={visibleIQCList.collectSn}
                    {...commonParams}>
                    <Input disabled={true} />

                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("IQC.field.snNo", language)} code="snNo"
                    initialValue={visibleIQCList.snNo}
                    {...commonParams}>
                    <Input disabled={true} />

                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage("IQC.field.collectCoo", language)} code="collectCoo"
                    initialValue={visibleIQCList.collectCoo}
                    {...commonParams}>
                    <Input disabled={true} />

                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("IQC.field.coo", language)} code="iqcCoo"
                    initialValue={visibleIQCList.iqcCoo}
                    {...commonParams}>
                    <Input disabled={true} />

                </AntdFormItem>,

            ],
            [
                <AntdFormItem label={transferLanguage("IQC.field.collectProduction", language)} code="collectProduction"
                    initialValue={visibleIQCList.collectProduction}
                    {...commonParams}>
                    <Input disabled={true} />

                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("IQC.field.collectDisposition", language)} code="collectDisposition"
                    initialValue={visibleIQCList.collectDisposition}
                    {...commonParams}>
                    <Input disabled={true} />

                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage("IQC.field.collectRemarks", language)} code="collectRemarks"
                    initialValue={visibleIQCList.collectRemarks}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("IQC.field.cidCode", language)} code="collectRemarks"
                    initialValue={visibleIQCList.cidCode}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
            ],
        ]
        const formItem = [
            [
                <AntdFormItem label={transferLanguage("IQC.field.qualityNo", language)} code="qualityNo"
                    initialValue={visibleIQCList.qualityNo}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("Delivery.field.soId", language)} code="soId"
                    initialValue={visibleIQCList.soId}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage("IQC.field.reDisposition", language)} code="reDisposition"
                    initialValue={visibleIQCList.reDisposition}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("IQC.field.reRedemption", language)} code="reRedemption"
                    initialValue={visibleIQCList.reRedemption}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage("IQC.field.reLocation", language)} code="reLocation"
                    initialValue={visibleIQCList.reLocation}
                    {...commonParams}>
                    <Input disabled={true} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("IQC.field.finalDisposition", language)} code="finalDisposition"
                    initialValue={visibleIQCList.finalDisposition}
                    rules={[{ required: true }]}
                    {...commonParams}>
                    <AdSelect
                        data={dictObject[allDictList.Disposition]}
                        payload={{ code: allDictList.Disposition }}

                    />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage("IQC.field.finalRedemption", language)} code="finalRedemption"
                    initialValue={visibleIQCList.finalRedemption}
                    {...commonParams}>
                    <AdSelect
                        data={dictObject[allDictList.Redemption]}
                        payload={{ code: allDictList.Redemption }}
                    />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage("IQC.field.finalLocation", language)} code="finalLocation"
                    initialValue={visibleIQCList.finalLocation}
                    rules={[{ required: true }]}
                    {...commonParams}>
                    <AdSelect
                        data={dictObject[allDictList.partStatus]}
                        payload={{ code: allDictList.partStatus }}

                    />
                </AntdFormItem>,
            ],
        ]
        const customPanelStyle = {
            borderRadius: 4,
            // marginBottom: 12,
            // border: 0,
            bottomBorder: 1,
            overflow: 'hidden',
            background: '#ffffff',
        };
        const formItemAPRH = [
            [
                <AntdFormItem label={transferLanguage('shipping.field.shipTo', language)}
                    code='shipTo'
                    rules={[{ required: true }]}
                    {...commonParams}
                >
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('shipping.field.shipToCountry', language)}
                    code='country'
                    rules={[{ required: true }]}
                    {...commonParams}

                >
                    <SearchSelect
                        dataUrl={'/mds-country/selectMdsCountryList'}
                        selectedData={toCountryId} // 选中值
                        showValue="name"
                        searchName="name"
                        multiple={false}
                        columns={_SelectColumns}
                        // onChange={values => this.getValue(values, 'toCountryId')}
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
                >
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('shipping.field.shipToCity', language)}
                    code='city'
                    {...commonParams}
                >
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('shipping.field.shipToZip', language)}
                    code='zipCode'
                    {...commonParams}
                >
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('CoReport.field.contact', language)}
                    code='contact'
                    {...commonParams}
                >
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('CoList.field.email', language)}
                    code='email'
                    {...commonParams}
                >
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('CoList.field.telephone', language)}
                    code='telephone'
                    {...commonParams}
                >
                    <Input />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('CoList.field.address', language)}
                    code='address'
                    rules={[{ required: true }]}
                    {...commonParams}
                >
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Common.field.remarks', language)}
                    code='remark'
                    {...commonParams}

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
                    data={iqcList}
                    columns={columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                    // 导出功能
                    exportBtn={true}
                    exportParams={{
                        url: 'wms-quality-doc/exportWmsQuality',
                        params: {
                            ids: checkId
                        }
                    }}
                />
                <AdModal
                    visible={visible}
                    title={transferLanguage('IQC.button.reviewQuality', language)}
                    onOk={this.handleOk}
                    onCancel={this.onCancel}
                    width="800px"
                >
                    <Collapse
                        activeKey={this.state.activeKey}
                        onChange={key => this.callback(key)}
                        bordered={false}
                    >
                        <Panel header={transferLanguage('Common.field.baseInfo', language)} key="1" style={customPanelStyle}>
                            <AntdForm >{formItemFragement(formItemBaseInfo)}</AntdForm>
                        </Panel>
                        <Panel header={transferLanguage('Common.field.baseInfo', language)} key="2" style={customPanelStyle}>
                            <AntdForm >{formItemFragement(formItem)}</AntdForm>
                        </Panel>
                    </Collapse>
                </AdModal>
                <AdModal
                    visible={APRHvisible}
                    title={transferLanguage('IQC.button.shipToAPRH', language)}
                    onOk={this.handleOkAPRH}
                    onCancel={() => this.setState({ APRHvisible: false })}
                    width="1000px"
                >
                    <AntdForm>{formItemFragement(formItemAPRH)}</AntdForm>
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
                    urlImport={`reverse/uploadRedemption`}
                    urlCase={`reverse/downloadRedemptionTemplate`}
                    // queryData={[this.getWmsPoList]}
                    accept=".xls,.xlsx"
                // form={this.props.form}
                />
            </Fragment>
        );
    }
}
