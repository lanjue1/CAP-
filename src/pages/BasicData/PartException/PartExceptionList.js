import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { routerRedux, Route, Switch } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Button } from 'antd';
import StandardTable from '@/components/StandardTable';;
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, Status, formatStatus } from './utils';
import AdSelect from '@/components/AdSelect';
import { transferLanguage, columnConfiguration } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ partException, common, component, loading, i18n }) => ({
    partException,
    loading: loading.effects['partException/partExceptionList'],
    dictObject: common.dictObject,
    searchValue: component.searchValue,
    language: i18n.language
}))
@Form.create()
export default class ItemRelationList extends Component {
    state = {
        expandForm: false,
        selectedRows: [],
        checkId: '',
        checkIds: [],
        formValues: {},
        isAbled: '',
        _Status: [],
    };
    className = 'partException';

    //列表 列
    columns = [{
        title: '#',
        dataIndex: 'index',
        render: (text, record, index) => (<span>{index + 1}</span>),
        width: 50
    },
    {
        //标题
        title: transferLanguage('partException.field.partNo', this.props.language),//'料号'
        //数据字段
        dataIndex: 'partNo',
        width: 150,
    },
    {
        //标题
        title: transferLanguage('partException.field.cc', this.props.language),//'料号'
        //数据字段
        dataIndex: 'cc',
        width: 150,
    },
    {
        title: transferLanguage('partRelation.field.remarks', this.props.language),//'备注'
        dataIndex: 'remarks',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('partRelation.field.createBy', this.props.language),// '创建人名称'
        dataIndex: 'createBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('partRelation.field.createTime', this.props.language),//'创建时间'
        dataIndex: 'createTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('partRelation.field.updateBy', this.props.language),// '修改人名称'
        dataIndex: 'updateBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('partRelation.field.updateTime', this.props.language),//'修改时间'
        dataIndex: 'updateTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
    }
    ];
    componentDidMount() {
        this.getItemRelationList();
        this.setState({
            _Status: columnConfiguration(Status, this.props.language)
        })
    }

    getItemRelationList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'partException/partExceptionList',
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
        this.getItemRelationList();
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
        const { ...value } = values;
        this.setState({
            formValues: value,
        });
        this.getItemRelationList(value);
    };

    //新建
    handleAdd = () => {
        const { dispatch } = this.props;
        router.push(`/basicData/listItemRelation/addItemRelation`);
    };

    // 分页操作：改参数
    handleStandardTableChange = param => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
            ...formValues,
            ...param,
        };
        this.getItemRelationList(params);
    };

    //编辑：
    handleEdit = (e, record) => {
        e.stopPropagation();
        const { dispatch } = this.props;
        const { id } = record;
        // console.log('senderId', record.senderId);

        dispatch({
            type: 'partException/itemRelationDetails',
            payload: { id },
            callback: res => {
                this.setState({
                    isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
                });
            },
        });
        router.push(`/basicData/listItemRelation/editItemRelation/${id}`);
    };

    //启用、禁用：
    abledStatus = (type, isSingle) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {};
        params.ids = isSingle ? [checkId] : checkIds;
        params.type = type == 'abled' ? true : false;
        dispatch({
            type: 'partException/ableOperate',
            payload: params,
            callback: res => {
                this.getItemRelationList(formValues);

                if (isSingle) {
                    this.props.dispatch({
                        type: 'partException/itemRelationDetails',
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
    // 删除
    handleDelete = () => {
        const { dispatch } = this.props;
        let params = {};
        const { checkIds, checkId, formValues } = this.state;
        params.ids = checkIds;
        dispatch({
            type: 'partException/itemRelationDelete',
            payload: params,
            callback: res => {
                this.getItemRelationList(formValues);
            },
        });
    };
    render() {
        const {
            loading,
            partException: { partExceptionList, itemRelationDetails },
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
            _Status
        } = this.state;

        const selectDetails = itemRelationDetails[checkId];
        const firstFormItem = (
            <FormItem label={transferLanguage('partRelation.field.partNo', language)}>
                {getFieldDecorator('partNo')(<Input placeholder="" />)}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label={transferLanguage('partRelation.field.replaceItemCode', language)}>
                {getFieldDecorator('replacePartCode')(<Input placeholder="" />)}
            </FormItem>
        );

        // // secondForm 参数
        // const otherFormItem = [
        //     [
        //         <FormItem label={transferLanguage('partRelation.field.beActive', language)}>
        //             {getFieldDecorator('status')(
        //                 <Select placeholder={transferLanguage('Common.field.select', language)} style={{ width: '100%' }} allowClear={true}>
                            

        //                     {_Status.map(v => {
        //                         return <Option value={v.code}>{v.value}</Option>;
        //                     })}
        //                 </Select>
        //             )}
        //         </FormItem>,
        //     ],
        //     ['operatorButtons']
        // ];
        const selectFormParams = {
            firstFormItem,
            // secondFormItem,
            // otherFormItem,
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
            rightButtons: (<Button.Group>
                <Button
                    onClick={() => this.handleAdd()}
                    type='primary'
                >
                    {transferLanguage('partRelation.button.add', language)}
                </Button>
                <Button
                    onClick={() => this.handleDelete()}
                    disabled={selectedRows.length > 0 ? false : true}
                    type='danger'
                >
                    {transferLanguage('partRelation.button.delete', language)}
                </Button>
            </Button.Group>),
            buttons: (
                <Button.Group>
                    <Button
                        onClick={() => this.abledStatus('disabled')}
                        disabled={selectedRows.length > 0 ? false : true}
                    >
                        {transferLanguage('partRelation.button.disable', language)}
                    </Button>
                    <Button
                        onClick={() => this.abledStatus('abled')}
                        disabled={selectedRows.length > 0 ? false : true}
                    >
                        {transferLanguage('partRelation.button.enable', language)}
                    </Button>
                </Button.Group>
            ),
            selectedRows: selectedRows,
        };

        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                {/* <TableButtons {...tableButtonsParams} /> */}
                <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={partExceptionList}
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
