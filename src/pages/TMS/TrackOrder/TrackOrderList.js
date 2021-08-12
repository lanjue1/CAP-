import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Form, Input, Select, Row, Col, Icon } from 'antd';
import StandardTable from '@/components/StandardTable';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, SelectColumns, Status, typeStatus } from './utils';
import AdSelect from '@/components/AdSelect';
import AdModal from '@/components/AdModal';
import { transferLanguage } from '@/utils/utils';
import SearchSelect from '@/components/SearchSelect';
import FileImport from '@/components/FileImport'
import AntdDatePicker from '@/components/AntdDatePicker';
import { editRow, editCol, } from '@/utils/constans';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import AdButton from '@/components/AdButton';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

@ManageList
@connect(({ trackOrder, common, component, loading, i18n }) => ({
    trackOrder,
    loading: loading.effects['trackOrder/trackOrderList'],
    dictObject: common.dictObject,
    searchValue: component.searchValue,
    language: i18n.language
}))
@Form.create()
export default class TrackOrderList extends Component {
    state = {
        visible: false,
        listCol: {
            md: 12, sm: 24
        },
        expandForm: false,
        selectedRows: [],
        checkId: '',
        checkIds: [],
        formValues: {},
        isAbled: '',
        shipFromWmCode: [],
        _SelectColumns: [],
        _SelectColumns1: [],
        _Status: [],
        _typeStatus: [],
        visibleFile: false,
        billType: [{ code: '', name: '', id: '' }],
        Type: [],
        fromCountryId: [],
        shipToWmCode: [],
        consigner: [{ code: '', name: '', id: '' }],
        consignee: [{ code: '', name: '', id: '' }],
        orderType: '',
        eventCode: [],
    };
    className = 'trackOrder';
    language = this.props.language
    //列表 列
    columns = [
        {
            title: '#',
            dataIndex: 'index',
            render: (text, record, index) => (<span>{index + 1}</span>),
            width: 50
        },
        {
            title: transferLanguage('TrackOrderList.field.orderNo', this.language),
            //数据字段
            dataIndex: 'orderNo',
            render: (text, record) => (
                <a onClick={e => this.handleEdit(e, record)} title={text}>
                    {text}
                </a>
            ),
        },
        // {
        //     title: transferLanguage('TrackOrderList.orderList.tracking', this.language),
        //     // title: '轨迹',
        //     dataIndex: 'trail',
        //     width: 60,
        //     render: (text, record) => {
        //         return (
        //             <a title={'查看轨迹'} onClick={e => this.openTrail(e, record.orderId)}>
        //                 <Icon type="environment" />
        //             </a>
        //         );
        //     },
        // },
        {
            title: transferLanguage('shipping.field.soNo', this.language),
            dataIndex: 'bizCode1',
            render: text => <span title={text}>{text}</span>,
            width: 120
        },
        
        {
            title: transferLanguage('TrackList.field.updateStatus', this.language),
            dataIndex: 'updateStatus',
            render: text => <span title={text}>{text}</span>,
            width: 120
        },
        {
            title: transferLanguage('TrackOrderList.field.eventTime', this.language),
            dataIndex: 'bizDate',
            render: text => <span title={text}>{text}</span>,
            width: 120
        },
        {
            title: transferLanguage('PoDetailList.field.etd', this.language),
            dataIndex: 'etd',
            render: text => <span title={text}>{text}</span>,
            width: 120
        },
        {
            title: transferLanguage('TrackOrderList.field.updateBy', this.language),
            dataIndex: 'updateBy',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('TrackOrderList.field.updateDate', this.language),
            dataIndex: 'updateTime',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('trackOrderList.field.remarks', this.language),
            dataIndex: 'remarks',
            render: text => <span title={text}>{text}</span>,
        },
        {
            title: transferLanguage('TrackList.field.customerOrder1', this.language),
            dataIndex: 'customerOrder1',
            render: text => <span title={text}>{text}</span>,
            width: 120
        },
        {
            title: transferLanguage('TrackList.field.customerOrder2', this.language),
            dataIndex: 'customerOrder2',
            render: text => <span title={text}>{text}</span>,
            width: 120
        }, {
            title: transferLanguage('TrackList.field.customerOrder3', this.language),
            dataIndex: 'customerOrder3',
            render: text => <span title={text}>{text}</span>,
            width: 120
        }, {
            title: transferLanguage('TrackList.field.customerOrder4', this.language),
            dataIndex: 'customerOrder4',
            render: text => <span title={text}>{text}</span>,
            width: 120
        }, {
            title: transferLanguage('TrackList.field.customerOrder5', this.language),
            dataIndex: 'customerOrder5',
            render: text => <span title={text}>{text}</span>,
            width: 120
        },
        {
            title: transferLanguage('TrackOrderList.field.createDate', this.language),
            dataIndex: 'createTime',
            width: 160,
            render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
        },
        
    ];

    // 模块渲染后的 todo
    componentDidMount() {
        this.gettrackOrderList();
        this.changeTitle(SelectColumns, "_SelectColumns")
        this.changeTitle(Status, "_Status")
        this.changeTitle(typeStatus, "_typeStatus")
    }

    openTrail = (e, id) => {
        router.push({
            //   pathname: `${routeUrl.trailMap}`,
            query: {
                orderNo: id,
            },
        });
    };

    changeTitle = (param, params) => {
        let _columnsAllotOne = []
        _columnsAllotOne = param.map(v => {
            if (v.title) v.title = transferLanguage(v.title, this.props.language)
            if (v.value) v.value = transferLanguage(v.value, this.props.language)
            return v
        })
        this.setState({
            [params]: _columnsAllotOne
        })
    }
    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };
    //点击文件名 下载文件
    getFileUrl = (fileToken, record) => {
        let readName = '/server/api/attachment/viewpage'
        let token = localStorage.getItem('token')
        let url = `http://${window.location.host}${readName}?token=${token}&fileToken=${fileToken}`
        window.location.href = url
    }
    // 调用接口获取数据
    gettrackOrderList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'trackOrder/trackOrderList',
            payload: params,
            callback: data => {
                console.log('data??', data)
                if (!data) return;
                let valueList = [];
                data.map(v => {
                    const labels = ['senderId'];
                    labels.map(item => {
                        console.log('searchValue??', searchValue, v[item])
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
        this.gettrackOrderList();
    };
    handleImportFile = () => {
        this.setState({
            visibleFile: false
        })
    }
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
        const { createTime, ...value } = values;
        if (createTime && createTime.length > 0) {
            value.bizDateStart = moment(createTime[0]).format('YYYY-MM-DD');
            value.bizDateEnd = moment(createTime[1]).format('YYYY-MM-DD');
            value.bizDateStart +=' 00:00:00'
            value.bizDateEnd +=' 23:59:59'
        } else {
            value.bizDateStart = ''
            value.bizDateEnd = ''
        }
        this.setState({
            formValues: value,
        });
        this.gettrackOrderList(value);
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
        this.gettrackOrderList(params);
    };

    //编辑：
    handleEdit = (e, record) => {
        e.stopPropagation();
        const { dispatch } = this.props;
        const { id } = record;
        dispatch({
            type: 'trackOrder/trackOrderDetails',
            payload: { id },
            callback: res => {
                this.setState({
                    isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
                });
            },
        });
        router.push(`/tms/trackOrder/detailsTrackOrder/${id}`);
    };

    //启用、禁用：
    abledStatus = (type, isSingle) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {};
        params.ids = isSingle ? [checkId] : checkIds;
        params.type = type;
        dispatch({
            type: 'trackOrder/ableOperate',
            payload: params,
            callback: res => {
                this.gettrackOrderList(formValues);

                if (isSingle) {
                    this.props.dispatch({
                        type: 'trackOrder/trackOrderDetails',
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
    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                const { dispatch, form: { getFieldValue } } = this.props
                const { formValues, checkIds, eventCode } = this.state
                let _eventCode = getFieldValue('eventCode')
                let eventTime = getFieldValue('eventTime')
                let awb = getFieldValue('AWB')
                console.log('eventCode???', _eventCode)
                let params = {
                    type: 'insertTrack',
                    eventTime: moment(eventTime).format(timeFormat),
                    eventCode: _eventCode[0]?.eventCode,
                    trackOrderIdList: checkIds,
                    awb,
                }
                dispatch({
                    type: 'trackOrder/ableOperate',
                    payload: params,
                    callback: data => {
                        this.gettrackOrderList(formValues)
                        this.setState((prevState) => ({ visible: !prevState.visible }))
                        this.setState({ eventCode: [] })
                    }
                })
            }
        })
        

    }
    render() {
        const {
            loading,
            trackOrder: { trackOrderList, trackOrderDetails },
            form,
            language
        } = this.props;
        const { getFieldDecorator } = form;
        const {
            selectedRows,
            expandForm,
            visibleFile,
            visible,
            _SelectColumns,
            eventCode,
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        // 设置查询条件
        const firstFormItem = (
            <FormItem label={transferLanguage('TrackOrderList.field.orderNo', this.language)}>
                {getFieldDecorator('orderNo')(<TextArea rows={1} />)}
            </FormItem>
        );
        const secondFormItem = (

            <FormItem label={transferLanguage('ASN.field.customerOrderNo', this.language)}>
                {getFieldDecorator('customerOrder')(
                    <Input />
                )}
            </FormItem>
        );

        // secondForm 参数
        const otherFormItem = [
            [
                <FormItem label={transferLanguage('Common.field.createDate', this.language)}>
                    {getFieldDecorator('createTime')(
                        <AntdDatePicker mode="range" placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createEndTime', language)]} />
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
            quickQuery: true,
        };
        const tableButtonsParams = {
            show: true,
            // handleAdd: this.handleAdd,
            // selectedLength: selectedRows.length,
            // selectAllText:'选择全部导出',
            rightButtons: (
                <Button.Group>
                    <AdButton 
                    text={transferLanguage('Common.field.import', this.language)}
                    code={codes.import}
                    onClick={() => this.setState({ visibleFile: true })} />
                    
                </Button.Group>
            ),
            buttons: (
                <Button.Group>
                    {/* <Button
                        onClick={() => this.abledStatus('obsolete')}
                        disabled={selectedRows.length > 0 ? false : true}
                    >
                        {transferLanguage('TrackOrderList.button.obsolete', this.language)}
                    </Button> */}
                    <AdButton
                        text={transferLanguage('TrackOrderList.button.updateTrack', this.language)}
                        code={codes.updateTrack}
                        onClick={() => this.setState({ visible: !visible })}
                        disabled={selectedRows.length > 0 ? false : true}
                    />
                    
                </Button.Group>
            ),
            selectedRows: selectedRows,
        };
        return (
            <Fragment>
                <FileImport
                    visibleFile={visibleFile}
                    handleCancel={() => {
                        this.handleImportFile();
                    }}
                    urlImport={`tms-track-order-tracking/importTmsTrackOrderTracking`}
                    urlCase={`template/download?fileName=TMS_import_template.xlsx`}
                    queryData={[this.gettrackOrderList]}
                    accept=".xls,.xlsx"
                    // form={this.props.form}
                    // importPayload={{ orderType: this.state.orderType }}
                    // extra={(<Row gutter={editRow}>
                    //     <Col >
                    //         <Form.Item label={transferLanguage('PoList.field.type', language)}>
                    //             <Select defaultValue={this.state.orderType} onChange={(e) => { this.setState({ orderType: e }) }} style={{ width: 200 }} >
                    //                 {['PO', 'SOID'].map(item => <Option key={item} value={item} >{item}</Option>)}
                    //             </Select>
                    //         </Form.Item>
                    //     </Col>
                    // </Row>)}
                />
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={trackOrderList}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                />
                {visible && <AdModal
                    visible={visible}
                    title={transferLanguage('TrackOrderList.button.updateTrack', language)}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ visible: false })}
                    width="500px"
                >
                    <AntdForm>
                        <Row>
                            <Col>
                                <AntdFormItem label={transferLanguage('TrackList.field.eventDesc', language)}
                                    code='eventCode'
                                    rules={[{ required: true }]}
                                    {...commonParams}
                                >
                                    <SearchSelect
                                        dataUrl={'tms-track-event/selectTmsTrackEventListByAllowUpdate'}
                                        selectedData={eventCode} // 选中值
                                        showValue="eventDesc"
                                        searchName="eventDesc"
                                        multiple={false}
                                        columns={_SelectColumns}
                                        onChange={values => this.getValue(values, 'eventCode')}
                                        id="eventCode"
                                        allowClear={true}
                                        scrollX={200}
                                    />
                                </AntdFormItem>
                            </Col>
                            <Col>
                                <AntdFormItem label={transferLanguage('TrackOrderList.field.eventTime', language)}
                                    code='eventTime'
                                    rules={[{ required: true }]}
                                    {...commonParams}
                                >
                                    <AntdDatePicker showTime />
                                </AntdFormItem>
                            </Col>
                            <Col>
                                <AntdFormItem label={transferLanguage('Load.field.trackingNo', language)}
                                    code='AWB'
                                    {...commonParams}
                                >
                                    <Input />
                                </AntdFormItem>
                            </Col>
                        </Row>
                    </AntdForm>
                </AdModal>}
            </Fragment>
        );
    }
}
