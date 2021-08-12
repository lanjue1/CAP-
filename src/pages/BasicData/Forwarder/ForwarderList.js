import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import { transferLanguage } from '@/utils/utils';

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

@connect(({ Forwarder, loading, component,i18n }) => ({
    Forwarder,
    forwarderList:Forwarder.forwarderList,
    dictObject: component.dictObject,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],
    
}))
@Form.create()
export default class  ForwarderList extends Component {
    className = 'forwarderList';
    constructor(props) {
        super(props);
        this.state = {
            formValues:{},
            detailId: '',
            visible: false,
            expandForm: false,
            selectedRows: [],
            _columns:[],

        };
    }
    componentDidMount() {
        selectList({ props: this.props});
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
        const { form,  } = this.props
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
    handleSearch = formValues => {
        // if (!formValues) return;
        const params = { props: this.props, payload: formValues };
        selectList(params);
        this.setState({formValues})
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
    handleAdd =()=>{
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
  abledStatus = (type, isSingle) => {
    const { dispatch } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = isSingle ? [checkId] : checkIds;
    params.type = type 
    const param = { props: this.props, payload: formValues };

    dispatch({
      type: allDispatchType.abled,
      payload: params,
      callback: res => {
        if(res.code===0){
            selectList({ ...param });
        }
        // if (isSingle) {
        //   this.props.dispatch({
        //     type: allDispatchType.detail,
        //     payload: { id: checkId },
        //     callback: res => {
        //       this.setState({
        //         isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
        //       });
        //     },
        //   });
        // }
      },
    });
  };

    render() {
        const { forwarderList, loading, form, language} = this.props;
        const { 
            expandForm,
            selectedRows, 
            _columns,
            } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('Forwarder.field.code',language)} code="code" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('Forwarder.field.name',language)} code="name" {...commonParams}>
                 <Input />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                // <AntdFormItem label={transferLanguage('CargoOwner.field.status',language)} code="status" {...commonParams}>
                //      <Input />
                // </AntdFormItem>,
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
            quickQuery:true

            // code: codes.select,
        };

        const tableButtonsParams = {
            handleAdd: this.handleAdd,
            code: codes.add,
            
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
                    <AdButton 
                    onClick={() => this.abledStatus('disabled')}
                    disabled={selectedRows.length > 0 ? false : true}
                    code={codes.disabled}
                    text={transferLanguage('Common.field.disable', this.props.language)}  />
                    <AdButton 
                    onClick={() => this.abledStatus('enable')}
                    disabled={selectedRows.length > 0 ? false : true}
                    code={codes.enable}
                    text={transferLanguage('Common.field.enable', this.props.language)}  />
                </Button.Group> 

            ),
          selectedRows: selectedRows,

        };

        // 详情 参数
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={forwarderList}
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
