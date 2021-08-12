import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { routerRedux, Route, Switch } from 'dva/router';
import { Form, Input, Select, Button, DatePicker, Collapse, Popover } from 'antd';
import StandardTable from '@/components/StandardTable';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import AdSelect from '@/components/AdSelect';
import { transferLanguage, columnConfiguration } from '@/utils/utils';
import { queryDict, allDictList } from '@/utils/common';
import AntdDatePicker from '@/components/AntdDatePicker';
import SearchSelect from '@/components/SearchSelect';
import AdButton from '@/components/AdButton';
import { columnsUser } from '@/pages/Common/common';

import CountDown from '@/components/CountDown';
import QRCode from 'qrcode.react';


const Panel = Collapse.Panel
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@ManageList
@connect(({ token, common, component, loading, i18n }) => ({
    token,
    loading: loading.effects['token/tokenList'],
    searchValue: component.searchValue,
    language: i18n.language,
    dictObject: common.dictObject,

}))
@Form.create()
export default class tokenList extends Component {
    state = {
        expandForm: false,
        selectedRows: [],
        checkId: '',
        checkIds: [],
        formValues: {},
        activeKey: ['1', '2'],
        toCountryId: [],
        selectAllType: false
    };
    className = 'tokenList';

    componentDidMount() {
        this.getTokenList();
        const allDict = [
            allDictList.Disposition,
            allDictList.Redemption,
            allDictList.partStatus,
        ]
        queryDict({ props: this.props, allDict });
    }

    getTokenList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'token/tokenList',
            payload: params,
            callback: data => {
                if (!data) return;
                let valueList = [];
            },
        });
    };
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
        this.getTokenList();
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
        let { ...val } = value

        if (value.acceptWorkId && value.acceptWorkId.length) {
            val.acceptWorkId = []
            value.acceptWorkId.forEach(item => {
                val.acceptWorkId.push(item.id)
            });
        }
        val.startTime ? val.startTime = moment(val.startTime).format('YYYY-MM-DD') : ''
        val.endTime ? val.endTime = moment(val.endTime).format('YYYY-MM-DD') : ''
        this.setState({
            formValues: val,
        });
        this.getTokenList(val);
    };

    // 分页操作：改参数
    handleStandardTableChange = param => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
            ...formValues,
            ...param,
        };
        this.getTokenList(params);
    };
    handleAdd = () => {
        router.push(`/operation/Token/addToken`);
    }

    //确认令牌,作废令牌：
    affirmWmsOperationToken = (type) => {
        const { dispatch } = this.props;
        const { checkIds, formValues } = this.state;
        let params = {};
        params.ids = checkIds;
        params.type = type

        dispatch({
            type: 'token/ableOperate',
            payload: params,
            callback: res => {
                this.getTokenList(formValues);
            },
        });
    };

    //全选功能
    selectAll = () => {
        this.setState({
            selectAllType: true
        })
    }
    targetTime = (endTime) => {
        return new Date(endTime).getTime();
    }
    render() {
        const {
            loading,
            token: { tokenList },
            form,
            language,
        } = this.props;
        const { getFieldDecorator } = form;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const {
            selectedRows,
            checkId,
            expandForm,
            selectAllType
        } = this.state;
        //列表 列
        const columns = [{
            title: '#',
            dataIndex: 'index',
            render: (text, record, index) => (<span>{index + 1}</span>),
            width: 50
        },
        {
            title: transferLanguage('Token.field.tokenValue', language),
            dataIndex: 'tokenValue',
            render: (text, record) => (
                <Popover
                    content={
                        <div>
                            <QRCode 
                                id={text} 
                                value={text} 
                                size={88} // 二维码的大小 
                                fgColor="#000000" // 二维码的颜色
                                style={{ margin: 'auto' }}
                            />
                            <div style={{ textAlign: 'center' }}>
                                <CountDown style={{ fontSize: 20 }} target={this.targetTime(record.endTime)} />
                            </div>
                        </div>}
                    title={<a >{text}</a>}
                    trigger="hover"
                >
                    <a title={text}>
                        {text}
                    </a>
                </Popover>
            ),
        },
        {
            title: transferLanguage('Token.field.warehouseName', language),
            dataIndex: 'warehouseName',
        },
        {
            title: transferLanguage('Token.field.TokenOperationType', language),
            dataIndex: 'opType',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('Token.field.status', language),
            dataIndex: 'status',
        },
        {
            title: transferLanguage('Token.field.bizCode', language),
            dataIndex: 'bizCode',
        },
        {
            title: transferLanguage('Token.field.acceptWorkName', language),
            dataIndex: 'acceptWorkName',
        },
        {
            title: transferLanguage('Token.field.accpetTime', language),
            dataIndex: 'accpetTime',
        },

        {
            title: transferLanguage('Token.field.startTime', language),
            dataIndex: 'startTime',
        },
        {
            title: transferLanguage('Token.field.endTime', language),
            dataIndex: 'endTime',
        },
        {
            title: transferLanguage('Token.field.operationWorkName', language),
            dataIndex: 'operationWorkName',
        }, {
            title: transferLanguage('Token.field.operationTime', language),
            dataIndex: 'operationTime',
        }, {
            title: transferLanguage('Token.field.remarks', language),
            dataIndex: 'remarks',
        },
        ];
        const firstFormItem = (
            <FormItem label={transferLanguage('Token.field.TokenOperationType', language)}>
                {getFieldDecorator('opType')(
                    <AdSelect payload={{ code: allDictList.OperationTokenType }} />

                )}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label={transferLanguage('Token.field.status', language)}>
                {getFieldDecorator('status')(
                    <AdSelect mode="multiple" payload={{ code: allDictList.OperationTokenStatus }} />
                )}
            </FormItem>
        );

        // secondForm 参数
        const otherFormItem = [
            [
                <FormItem label={transferLanguage('Token.field.acceptWorkName', language)}>
                    {getFieldDecorator('acceptWorkId')(
                        <SearchSelect
                            dataUrl="mds-user/selectList"
                            // url="mds-user/viewDetails" //selectedData只只有id时需要传url
                            multiple={true} // 是否多选
                            showValue="sysName"
                            searchName="keyWord"
                            columns={columnsUser} // 表格展示列
                            id="TmsRole_1_1"
                        />
                        //    <AdSelect payload={{ code: allDictList.Token_CountType }} />
                    )}
                </FormItem>,
            ],

            [

                <FormItem label={transferLanguage('Token.field.startTime', language)}>
                    {getFieldDecorator('startTime')(
                        <AntdDatePicker placeholder={transferLanguage('Common.field.startTime', language)} />
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('Token.field.endTime', language)}>
                    {getFieldDecorator('endTime')(
                        <AntdDatePicker placeholder={transferLanguage('Common.field.endTime', language)} />
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('Token.field.bizCode', language)}>
                    {getFieldDecorator('countMethod')(
                        <Input placeholder="" />
                    )}
                </FormItem>,
            ],
            [
                'operatorButtons',
            ],
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
            //selectedLength参数加上就会显示所选多少条和全选功能
            // selectedLength: selectedRows.length,
            total: tokenList.pagination?.total,
            selectAllType: selectAllType,
            selectAll: this.selectAll,
            show: true,
            buttons: (
                <div>
                    <Button.Group>
                        <AdButton
                            onClick={() => this.affirmWmsOperationToken('confirm')}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('Token.field.ConfirmToken', language)}
                        />
                        <AdButton
                            onClick={() => this.affirmWmsOperationToken('cancellation')}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('Token.field.InvalidToken', language)}
                        />

                    </Button.Group>
                </div>

            ),
            handleAdd: this.handleAdd,
            selectedRows: selectedRows,
        };
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={tokenList}
                    columns={columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                />
            </Fragment>
        );
    }
}
