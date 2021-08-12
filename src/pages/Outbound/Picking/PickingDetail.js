import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Spin } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import AdModal from '@/components/AdModal';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import EditPage from '@/components/EditPage';
import DetailPage from '@/components/DetailPage';
import { transferLanguage } from '@/utils/utils'
import DetailsList from '@/components/DetailsList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import {
    formItemFragement,
} from '@/utils/common';
import {
    allDispatchType,
    codes,
    selectDetailList,
    selectSerialList,
    routeUrl,
    columnsSerial,
} from './utils';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ Picking, loading, component, i18n }) => ({
    pickingDetailList: Picking.pickingDetailList,
    pickingDetail: Picking.pickingDetail,

    selectPickDetail: Picking.selectPickDetail,
    loading: loading.effects[allDispatchType.detail],
    language: i18n.language,
}))
@Form.create()
export default class PickingDetail extends Component {
    className = 'PickingDetail';
    constructor(props) {
        super(props);
        this.state = {
            formValues: {},
            detailId: '',
            visible: false,
            expandForm: false,
            selectedRows: [],
            _columnsDetail: [],
            _columnsSerial: [],

        };
    }
    columnsDetail = [
        {
            title: '#',
            dataIndex: 'index',
            render: (text, record, index) => (<span>{index + 1}</span>),
            width: 50
        },
        {
            title: 'Delivery.field.soId',
            dataIndex: 'soId',
            width: 120,
        },
        {
            title: 'CoList.field.bizCoNo',
            dataIndex: 'coNo',
            width: 120,
        }, {
            title: 'CoList.field.bizSoNo',
            dataIndex: 'soNo',
            width: 120,
        },
        {
            title: 'PoDetailList.field.pieceQty',
            dataIndex: 'planQuantity',
            width: 120,
        },
        {
            title: 'PoList.field.openQty',
            dataIndex: 'movedQuantity',
            render: (text, record) => (<span>{record.planQuantity - record.movedQuantity}</span>),
            width: 120,
        },
        {
            title: 'PoDetailList.field.partNo',
            dataIndex: 'partCode',
            width: 120,
        }, {
            title: 'PoDetailList.field.partDesc',
            dataIndex: 'partDesc',
            width: 120,
        },
        {
            title: 'Delivery.field.partSn',
            dataIndex: 'serialNo',
            width: 120,
        },
        {
            title: 'InventoryList.field.binCode',
            dataIndex: 'fromBinCode',
            width: 120,
        },
        // {
        //     title: 'Delivery.field.deliveryTime',
        //     dataIndex: 'deliveryTime',
        //     width: 120,
        // }, {
        //     title: 'CoDetailList.field.pickingStatus',
        //     dataIndex: 'pickingStatus',
        //     width: 120,
        // }, {
        //     title: 'CoDetailList.field.pickingNO',
        //     dataIndex: 'pickingNO',
        //     width: 120,
        // },
        {
            title: 'CoList.field.soType',
            dataIndex: 'serviceordertype',
            width: 120,
        }, {
            title: 'CoList.field.soPriority',
            dataIndex: 'soprioritycode',
            width: 120,
        }, {
            title: 'CoList.field.sodType',
            dataIndex: 'sodeliverytype',
            width: 120,
        }, {
            title: 'CoList.field.serviceLevel',
            dataIndex: 'servicelevel',
            width: 120,
        }, {
            title: 'CoList.field.shippingMethod',
            dataIndex: 'shippingmethod',
            width: 120,
        }, {
            title: 'CoDetailList.field.premierCustomer',
            dataIndex: 'pmcustomerind',
            width: 120,
        }, {
            title: 'CoDetailList.field.CRUDSWAP',
            dataIndex: 'CRUDSWAP',
            width: 120,
        },
        {
            title: 'Delivery.field.beReturn',
            dataIndex: 'beReturn',
            render: text => (<span>{text ? "true" : "false"}</span>),
            width: 120,
        },
        {
            title: 'CoDetailList.field.milkrun',
            dataIndex: 'milkrun',
            width: 120,
        }, {
            title: 'CoDetailList.field.mtm',
            dataIndex: 'productid',
            width: 120,
        }, {
            title: 'CoDetailList.field.machineSn',
            dataIndex: 'serialnumberid',
            width: 120,
        }, {
            title: 'CoDetailList.field.hddRetention',
            dataIndex: 'hdretenion',
            width: 120,
        }, {
            title: 'CoDetailList.field.returnStatus',
            dataIndex: 'returnStatus',
            width: 120,
        },
        {
            title: 'PoDetailList.field.eta',
            dataIndex: 'eta',
            width: 120,
        }, {
            title: 'CoList.field.shippingInstruction',
            dataIndex: 'shippinginstr',
            width: 120,
        }, {
            title: 'CoList.field.deliveryInstruction',
            dataIndex: 'servicedelinstr',
            width: 120,
        }, {
            title: 'Delivery.field.totalGrossWeight',
            dataIndex: 'totalGrossWeight',
            width: 120,
        }, {
            title: 'Delivery.field.totalNetWeight',
            dataIndex: 'totalNetWeight',
            width: 120,
        }, {
            title: 'Delivery.field.totalVolume',
            dataIndex: 'totalVolume',
            width: 120,
        },
        {
            title: 'Delivery.field.remarks',
            dataIndex: 'remarks',
            width: 120,
        },

        {
            title: 'Delivery.field.createBy',
            dataIndex: 'createBy',
            width: 120,
        },
        {
            title: 'Delivery.field.createTime',
            dataIndex: 'createTime',
            width: 120,
        },
        {
            title: 'Delivery.field.updateBy',
            dataIndex: 'updateBy',
            width: 120,
        },
        {
            title: 'Delivery.field.updateTime',
            dataIndex: 'updateTime',
            width: 120,
        },
    ];
    componentDidMount() {
        const { match, form, dispatch } = this.props;
        const ID = match && match.params ? match.params.id : '';
        this.setState({
            currentId: ID,
        });

        if (ID) {
            this.getSelectDetails(ID);
            const params = { props: this.props, payload: { moveDocId: ID } };
            selectDetailList(params);
            this.setState({
                disabled: true,
            });
        } else {
            form.resetFields();
        }
        this.changeTitle(this.columnsDetail, '_columnsDetail')
        this.changeTitle(columnsSerial, '_columnsSerial')


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


    onCancel = () => {
        const { visible } = this.state
        this.setState({ visible: !visible })
    }
    //查询详情
    getSelectDetails = ID => {
        this.props.dispatch({
            type: allDispatchType.detail,
            payload: { id: ID },

        });
    };

    /**
     * form 查找条件 重置
     */
    handleFormReset = () => {
        const { currentId } = this.state
        const { form, } = this.props
        const props = { props: this.props, payload: { moveDocId: currentId } };
        this.setState({
            formValues: {},
        });
        form.resetFields();
        selectDetailList(props);
    };

    /**
     * form 查找条件 查询
     */
    handleSearch = formValues => {
        // if (!formValues) return;
        const { currentId } = this.state
        const params = { props: this.props, payload: { moveDocId: currentId, ...formValues } };
        selectDetailList(params);
        this.setState({ formValues })
    };

    /**
     * table 表格 分页操作
     */
    handleStandardTableChange = param => {
        const { formValues, currentId } = this.state;
        selectDetailList({ payload: { moveDocId: currentId, ...formValues, ...param }, props: this.props });
    };
    handleStandardTableChangeSecond = param => {
        const { formValues } = this.state;
        selectDeliverySerial({ payload: { ...formValues, ...param }, props: this.props });

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

    render() {
        const { pickingDetailList, loading, form, pickingDetail, match: { params }, language } = this.props;
        let currentId = params.id
        const {
            expandForm,
            selectedRows,
            _columnsDetail,
            _columnsSerial,
            visible,
        } = this.state;
        let details = pickingDetail[currentId] || {};
        let selectDetailList = pickingDetailList[currentId] || {};
        const editPageParams = {
            panelValue: [
                { key: transferLanguage('Common.field.baseInfo', language) },
                { key: transferLanguage('Delivery.field.shipToWmCode', language) },
                { key: transferLanguage('MoveTaskList.title.list', language) },
                { key: '4' },
            ],
        };
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const fields = [
            { key: 'shipToWmCode', name: transferLanguage('Delivery.field.shipToWmCode', language) },
            { key: 'altshiptocountry', name: transferLanguage('CoList.field.toCountry', language) },
            { key: 'altshiptostate', name: transferLanguage('CoList.field.toState', language) },
            { key: 'altshiptocity', name: transferLanguage('CoList.field.toCity', language) },
            { key: 'altshiptopostcode', name: transferLanguage('CoList.field.toZip', language) },
            { key: 'altshiptocontactor', name: transferLanguage('CoList.field.contactorName', language) },
            { key: 'altshiptoemail', name: transferLanguage('CoList.field.email', language) },
            { key: 'altshiptoadd', name: transferLanguage('CoList.field.address', language) },
            { key: 'altshiptophone', name: transferLanguage('CoList.field.telephone', language) },
        ]
        const formItem = [
            [
                <DetailPage label={transferLanguage("Picking.field.pickingNo", language)} value={details.moveNo} />,
            ],
            [
                <DetailPage label={transferLanguage("Delivery.field.status", language)} value={details.status} />,
                <DetailPage label={transferLanguage("Delivery.field.type", language)} value={details.moveType} />,
            ],
            [
                <DetailPage label={transferLanguage("Delivery.field.planQuantity", language)} value={details.planQuantity} />,
                <DetailPage label={transferLanguage("PoList.field.openQty", language)} value={details.planQuantity - details.movedQuantity} />,
            ],
        ];

        return (
            <div>
                <EditPage {...editPageParams}>
                    <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
                    <Fragment>
                        <DetailsList detilsData={{ fields: fields, value: details }} />
                    </Fragment>
                    <Fragment>
                        <StandardTable
                            // selectedRows={selectedRows}
                            // onSelectRow={this.handleSelectRows}
                            disabledRowSelected={true}
                            loading={loading}
                            data={selectDetailList}
                            columns={_columnsDetail}
                            onPaginationChange={this.handleStandardTableChange}
                            expandForm={undefined}
                            className={this.className}
                            code={codes.page}
                        />
                    </Fragment>

                </EditPage>

            </div>
        );
    }
}
