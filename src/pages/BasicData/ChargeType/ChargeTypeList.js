import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Row, Col } from 'antd';
import { editGutter, } from '@/utils/constans';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage, formatDate } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import { transferLanguage } from '@/utils/utils';
import AntdDatePicker from '@/components/AntdDatePicker';
import styles from './index.less';
import {
    allDispatchType,
    codes,
    selectList,
    routeUrl,
    columns,
} from './utils';
import { languages } from 'monaco-editor';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ ChargeType, loading, component, i18n }) => ({
    ChargeType,
    chargeTypeList: ChargeType.chargeTypeList,
    dictObject: component.dictObject,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],

}))
@Form.create()
export default class ChargeTypeList extends Component {
    className = 'ChargeTypeList';
    constructor(props) {
        super(props);
        this.state = {
            listCol: {
                md: 8, sm: 24
            },
            formValues: {},
            detailId: '',
            visible: false,
            expandForm: false,
            selectedRows: [],
            _columns: [],

        };
    }
    componentDidMount() {
        selectList({ props: this.props });
        this.changeTitle(columns, '_columns')
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
    _handleSearch = formValues => {
        // if (!formValues) return;
        const { shipTime, ...value } = formValues
        if (shipTime && shipTime.length > 0) {
            value.shipTimeStart = moment(shipTime[0]).format(dateFormat)
            value.shipTimeEnd = moment(shipTime[1]).format(dateFormat)
        } else {
            value.shipTimeStart = ""
            value.shipTimeEnd = ""
        }
        const params = { props: this.props, payload: value };
        selectList(params);
        this.setState({ formValues })
    };
    handleSearch = e => {
		e.preventDefault();
		const { form} = this.props;
		form.validateFields((err, fieldsValue) => {
			if (err) return;
			const values = {
				...fieldsValue,
			};
			this._handleSearch(values);
		});
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
    //编辑
    handleEdit = () => {
        const { detailId } = this.state;
        this.handleSelectRows([{ visible: false }]);
        router.push(`${routeUrl.edit}/${detailId}`)
    };


    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };

    //启用、禁用：
    abledStatus = (type) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {};
        params.type = type
        // params.ids = checkIds
        // const param = { props: this.props, payload: formValues };

        dispatch({
            type: allDispatchType.abled,
            payload: {},
            callback: res => {
                console.log('res--99999999',res)
                if (res.code === 0) {
                    selectList({ ...param });
                }
            },
        });
    };
    operatorButtons = ({ value, textAlign, otherFormItem }) => {
        const { code } = this.props;
        const { listCol } = this.state
        const marginLeft = { marginLeft: 8 };
        return (
            <Col {...listCol} style={{ textAlign }}>
                <span className={styles.submitButtons}>
                    <Button.Group>
                        <AdButton type="primary" htmlType="submit" text={transferLanguage('base.prompt.search', this.props.language)} code={code} />
                        <AdButton onClick={this.handleFormReset} text={transferLanguage('base.prompt.reset', this.props.language)} code={code} />
                    </Button.Group>
                </span>
            </Col>
        );
    };
    render() {
        const { chargeTypeList, loading, form, language } = this.props;
        const {
            listCol,
            expandForm,
            selectedRows,
            _columns,
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('Load.field.forwarder', language)} code="forwarder" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('Load.field.shipTime', language)} code="shipTime" {...commonParams}>
                <AntdDatePicker mode="range" />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('Load.field.vehicleNo', language)} code="vehicleNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
            ], [
                <AntdFormItem label={transferLanguage('Load.field.loadingNo', language)} code="loadingNo" {...commonParams}>
                    <Input />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('Load.field.trackingNo', language)} code="trackingNo" {...commonParams}>
                    <Input />
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

            // code: codes.select,
        };

        const tableButtonsParams = {
            // handleAdd: this.handleAdd,
            // code: codes.addEndorse,

            // rightButtonsFist: (
            //     <AdButton
            //         type="primary"
            //         style={{ marginLeft: 8 }}
            //         onClick={() => this.add()}
            //         text="新增"
            //         // code={codes.addEndorse}
            //     />

            // ),
            buttons: (
                <Button.Group>
                    <>
                    </>
                    {/* <AdButton
                        onClick={() => this.abledStatus()}
                        // disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Snapshot.button.initSnapshot', this.props.language)} /> */}
                    {/* <AdButton
                        onClick={() => this.abledStatus('confim')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Load.button.deliveryConfirm', this.props.language)} /> */}
                </Button.Group>

            ),
            selectedRows: selectedRows,

        };

        // 详情 参数
        return (
            <Fragment>
                {/* <SelectForm {...selectFormParams} /> */}
                <Form onSubmit={this.handleSearch} layout="inline" className="cus_searchFrom">
                    <Row gutter={editGutter}>
                        <Col {...listCol}>
                            <AntdFormItem label={transferLanguage('partData.field.code', language)}
                                code="code"
                                {...commonParams}>
                                <Input />
                            </AntdFormItem>
                        </Col>
                        <Col {...listCol}>
                            <AntdFormItem label={transferLanguage('Common.field.name', language)} 
                            code="name" 
                            {...commonParams}>
                                <Input />
                            </AntdFormItem>
                        </Col>
                        {this.operatorButtons({ textAlign: 'left', })}
                    </Row>
                </Form>
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={chargeTypeList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                // disabledSelectedRows={{ code: ['status'], value: ['CONFIRM'] }}
                // getCheckboxProps={record => {
                //     const status = record.status;
                //     const checked = status === 'CONFIRM';
                //     return !checked;
                // }}
                />
            </Fragment>
        );
    }
}
