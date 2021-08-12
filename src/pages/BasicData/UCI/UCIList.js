import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Row, Col } from 'antd';
import { editGutter, } from '@/utils/constans';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import { formItemFragement, formatPrice } from '@/utils/common';
import { transferLanguage } from '@/utils/utils'
import SearchSelect from '@/components/SearchSelect';
import styles from './index.less';


import {
    allDispatchType,
    codes,
    selectList,
    routeUrl,
    columns,
} from './utils';
const FormItem = Form.Item;

@ManageList

@connect(({ UCI, loading, component, i18n }) => ({

    UCIList: UCI.UCIList,

    language: i18n.language,
    loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class UCIList extends Component {
    className = 'UCIList';
    constructor(props) {
        super(props);
        this.state = {
            listCol: {
                md: 8, sm: 24
            },
            formValues: {},
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
        const params = { props: this.props, payload: formValues };
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


    getValue = (values, type) => {
        this.setState({
            [type]: values,
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
        const { UCIList, loading, form, language } = this.props;
        const {
            expandForm,
            selectedRows,
            visible,
            _columns,
            listCol
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('UCI.field.countryCode', language)} code="countryCode" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('UCI.field.fmapOrigmfr', language)} code="fmapOrigmfr" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('UCI.field.fmapWarrtype', language)} code="fmapWarrtype" {...commonParams}>
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
            buttons: (
                <Button.Group>
                    <AdButton
                        onClick={() => this.abledStatus()}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('UCIList.field.stockMove', language)} />
                    {/* <AdButton 
                    onClick={() => this.abledStatus('enable')}
                    disabled={selectedRows.length > 0 ? false : true}
                    text="启用"  /> */}
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
                            <AntdFormItem label={transferLanguage('UCI.field.countryCode', language)} 
                            code="countryCode" 
                            {...commonParams}>
                                <Input />
                            </AntdFormItem>
                        </Col>
                        <Col {...listCol}>
                            <AntdFormItem label={transferLanguage('UCI.field.partNumber', language)} 
                            code="partNumber" 
                            {...commonParams}>
                                <Input />
                            </AntdFormItem>
                        </Col>
                        {this.operatorButtons({textAlign: 'left', })}
                    </Row>
                </Form>
                {/* <TableButtons {...tableButtonsParams} /> */}
                <StandardTable
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={UCIList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={false}
                    className={this.className}
                // code={codes.page}

                />
            </Fragment >
        );
    }
}




