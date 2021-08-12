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
import { codes, Status, Mode, Type, Method, SelectColumns } from './utils';
import AdSelect from '@/components/AdSelect';
import AntdSelect from '@/components/AntdSelect';
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

const Panel = Collapse.Panel
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@ManageList
@connect(({ stockCount, common, component, loading, i18n }) => ({
    stockCount,
    loading: loading.effects['stockCount/stockCountList'],
    searchValue: component.searchValue,
    language: i18n.language,
    dictObject: common.dictObject,

}))
@Form.create()
export default class StockCountList extends Component {
    state = {
        expandForm: false,
        selectedRows: [],
        checkId: '',
        checkIds: [],
        formValues: {},
        activeKey: ['1', '2'],
        toCountryId: [],
        _SelectColumns: [],
        selectAllType: false
    };
    className = 'stockCount';

    componentDidMount() {
        this.setState({
            _SelectColumns: columnConfiguration(SelectColumns, this.props.language)
        })
        this.getstockCountList();
        const allDict = [
            allDictList.Disposition,
            allDictList.Redemption,
            allDictList.partStatus,
        ]
        queryDict({ props: this.props, allDict });
    }

    getstockCountList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'stockCount/stockCountList',
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
    getstockCountVisible = (id) => {
        const { dispatch, stockCount: { visiblestockCountList } } = this.props
        dispatch({
            type: 'stockCount/visibleList',
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
        this.getstockCountList();
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
        this.getstockCountList(value);
    };

    // 分页操作：改参数
    handleStandardTableChange = param => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
            ...formValues,
            ...param,
        };
        this.getstockCountList(params);
    };

    //编辑：
    handleEdit = (e, record) => {
        e.stopPropagation();
        const { dispatch } = this.props;
        const { id } = record;
        dispatch({
            type: 'stockCount/stockCountDetails',
            payload: { id },
        });
        router.push(`/operation/stockCount/editStockCount/${id}`);
    };

    handleAdd = () => {
        router.push(`/operation/stockCount/addStockCount`);
    }

    //启用、禁用：
    abledStatus = (type) => {
        const { dispatch } = this.props;
        const { checkIds, formValues } = this.state;
        let params = {};
        params.ids = checkIds;
        params.type = type
        // if (type == 'cancelCheck') {
        //     params.id = checkIds[0]
        //     params.ids = []
        // }
        dispatch({
            type: 'stockCount/ableOperate',
            payload: params,
            callback: res => {
                this.getstockCountList(formValues);
            },
        });
    };

    //全选功能
    selectAll = () => {
        this.setState({
            selectAllType: true
        })
    }

    render() {
        const {
            loading,
            stockCount: { stockCountList },
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
            title: transferLanguage('StockCount.field.countPlanNo', language),
            dataIndex: 'countPlanNo',
            render: (text, record) => (
                <a onClick={e => this.handleEdit(e, record)} title={text}>
                    {text}
                </a>
            ),
            // sorter: true
            // render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('Common.field.status', language),
            dataIndex: 'status',
            // render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('StockCount.field.result', language),
            dataIndex: 'soId',
            render: text => <AdSelect value={text} onlyRead={true} />,
            // sorter: true
        },
        {
            title: transferLanguage('StockCount.field.differenceQty', language),
            dataIndex: 'differenceQty',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },

        {
            title: transferLanguage('StockCount.field.warehouseName', language),
            dataIndex: 'warehouseName',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('StockCount.field.countType', language),
            dataIndex: 'countType',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('StockCount.field.countMethod', language),
            dataIndex: 'countMethod',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('StockCount.field.countMode', language),
            dataIndex: 'countMode',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('StockCount.field.countLock', language),
            dataIndex: 'countLock',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('StockCount.field.partCount', language),
            dataIndex: 'partCount',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('StockCount.field.binCount', language),
            dataIndex: 'binCount',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('StockCount.field.qty', language),
            dataIndex: 'QTY',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },

        {
            title: transferLanguage('StockCount.field.startTime', language),
            dataIndex: 'startTime',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('StockCount.field.endTime', language),
            dataIndex: 'endTime',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('StockCount.field.createBy', language),
            dataIndex: 'createBy',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('StockCount.field.createTime', language),
            dataIndex: 'createTime',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('StockCount.field.updateBy', language),
            dataIndex: 'updateBy',
            render: text => <AdSelect value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('StockCount.field.updateTime', language),
            dataIndex: 'updateTime',
            render: text => <AdSelect value={text} onlyRead={true} />,
        }
        ];
        const firstFormItem = (
            <FormItem label={transferLanguage('StockCount.field.countPlanNo', language)}>
                {getFieldDecorator('countPlanNo')(<Input placeholder="" />)}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label={transferLanguage('Common.field.status', language)}>
                {getFieldDecorator('status')(
                    <AdSelect payload={{ code: allDictList.StockCount_Status }} />
                   
                )}
            </FormItem>
        );

        // secondForm 参数
        const otherFormItem = [
            [<FormItem label={transferLanguage('StockCount.field.result', language)}>
                {getFieldDecorator('result')(
                <AdSelect payload={{ code: allDictList.StockCount_Result }} />

                )}
            </FormItem>],

            [
                <FormItem label={transferLanguage('StockCount.field.countType', language)}>
                    {getFieldDecorator('countType')(
                       <AdSelect payload={{ code: allDictList.StockCount_CountType }} />
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('StockCount.field.countMethod', language)}>
                    {getFieldDecorator('countMethod')(
                       <AdSelect payload={{ code: allDictList.StockCount_CountMethod }} />
                        
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('StockCount.field.countMode', language)}>
                    {getFieldDecorator('countMode')(
                       <AdSelect payload={{ code: allDictList.StockCount_CountMode }} />

                    )}
                </FormItem>
            ],
            [
                <FormItem label={transferLanguage('StockCount.field.bin', language)}>
                    {getFieldDecorator('bin')(
                        <Input placeholder="" />
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('StockCount.field.partNo', language)}>
                    {getFieldDecorator('partNo')(
                        <Input placeholder="" />
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('StockCount.field.qualityDate', language)}>
                    {getFieldDecorator('qualityDate')(
                        // <AntdDatePicker mode="range" placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createEndTime', language)]} />
                        <DatePicker placeholder={transferLanguage('Common.field.selectDate', language)} />
                    )}
                </FormItem>,
            ],
            [
                <FormItem label={transferLanguage('StockCount.field.startTime', language)}>
                    {getFieldDecorator('startTime')(

                        <DatePicker placeholder={transferLanguage('Common.field.selectDate', language)} />
                        // <AntdDatePicker mode="range" placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createEndTime', language)]} />
                    )}
                </FormItem>,
                <FormItem label={transferLanguage('StockCount.field.endTime', language)}>
                    {getFieldDecorator('endTime')(

                        <DatePicker placeholder={transferLanguage('Common.field.selectDate', language)} />
                        // <AntdDatePicker mode="range" placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createEndTime', language)]} />
                    )}
                </FormItem>,
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
            total: stockCountList.pagination?.total,
            selectAllType: selectAllType,
            selectAll: this.selectAll,
            show: true,
            buttons: (
                <div>
                    <Button.Group>
                        <AdButton
                            onClick={() => this.abledStatus('cancel')}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('Common.field.cancel', language)}
                            code={codes.cancelConfirm}
                        />
                        <AdButton
                            onClick={() => this.abledStatus('confirm')}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('Common.field.confirm', language)}
                            code={codes.confirm}
                        />
                        <AdButton
                            // onClick={() => this.abledStatus('confirm')}
                            disabled={selectedRows.length > 0 ? false : true}
                            text={transferLanguage('StockCount.field.abnormalOrder', language)}
                            code={codes.confirm}
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
                    data={stockCountList}
                    columns={columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                    // 导出功能
                    // exportBtn={true}
                    exportParams={{
                        url: 'wms-quality-doc/exportWmsQuality',
                        params: {
                            ids: checkId
                        }
                    }}
                />
            </Fragment>
        );
    }
}
