import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { routerRedux, Route, Switch } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, Status, formatStatus } from './utils';
import AdSelect from '@/components/AdSelect';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ wmsItemType, common, component, loading }) => ({
  wmsItemType,
  loading: loading.effects['wmsItemType/wmsItemTypeList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
}))
@Form.create()
export default class wmsItemTypeList extends Component {
  state = {
    expandForm: false,
    selectedRows: [],
    checkId: '',
    checkIds: [],
    formValues: {},
    isAbled: '',
  };
  className = 'wmsItemType';

  //列表 列
  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 50,
    },
    {
      //标题
      title: '编码',
      //数据字段
      dataIndex: 'code',
      render: (text, record) => (
        <a onClick={e => this.handleEdit(e, record)} title={text}>
          {text}
        </a>
      ),
      width: 150,
    },
    {
      title: '货品类型名称',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      width: 100,
    },
    {
      title: '创建人名称',
      dataIndex: 'createBy',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 100,
    },
    {
      title: '修改人名称',
      dataIndex: 'updateBy',
      width: 100,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      width: 100,
    },
  ];
  componentDidMount() {
    this.getWmsItemTypeList();
  }

  getWmsItemTypeList = (params = {}) => {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: 'wmsItemType/wmsItemTypeList',
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
    this.getWmsItemTypeList();
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
    this.getWmsItemTypeList(value);
  };

  //新建
  handleAdd = () => {
    const { dispatch } = this.props;
    router.push(`/basicData/listWmsItemType/addWmsItemType`);
  };

  // 分页操作：改参数
  handleStandardTableChange = param => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.getWmsItemTypeList(params);
  };

  //编辑：
  handleEdit = (e, record) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { id } = record;
    // console.log('senderId', record.senderId);

    dispatch({
      type: 'wmsItemType/wmsItemTypeDetails',
      payload: { id },
      callback: res => {
        this.setState({
          isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
        });
      },
    });
    router.push(`/basicData/listWmsItemType/editWmsItemType/${id}`);
  };

  //启用、禁用：
  abledStatus = (type, isSingle) => {
    const { dispatch } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = isSingle ? [checkId] : checkIds;
    params.type = type == 'abled' ? true : false;
    dispatch({
      type: 'wmsItemType/ableOperate',
      payload: params,
      callback: res => {
        this.getWmsItemTypeList(formValues);

        if (isSingle) {
          this.props.dispatch({
            type: 'wmsItemType/wmsItemTypeDetails',
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

  render() {
    const {
      loading,
      wmsItemType: { wmsItemTypeList, wmsItemTypeDetails },
      form,
      isMobile,
      dictObject,
    } = this.props;
    const { getFieldDecorator } = form;
    const { selectedRows, isAbled, checkId, visible, rowDetails, expandForm } = this.state;

    const selectDetails = wmsItemTypeDetails[checkId];
    const firstFormItem = (
      <FormItem label="编码">{getFieldDecorator('code')(<Input  />)}</FormItem>
    );
    const secondFormItem = (
      <FormItem label="名称">{getFieldDecorator('name')(<Input  />)}</FormItem>
    );

    // secondForm 参数
    const otherFormItem = [
      [
        <FormItem label="状态">
          {getFieldDecorator('status')(
            <Select placeholder="请选择" style={{ width: '100%' }} allowClear={true}>
              <Option value="">请选择</Option>
              {Status.map(v => {
                return <Option value={v.code}>{v.value}</Option>;
              })}
            </Select>
          )}
        </FormItem>,
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
    };
    const tableButtonsParams = {
      show: true,
      handleAdd: this.handleAdd,
      buttons: (
        <Button.Group>
          <Button
            onClick={() => this.abledStatus('disabled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            禁用
          </Button>
          <Button
            onClick={() => this.abledStatus('abled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            启用
          </Button>
        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    return (
      <Fragment>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={wmsItemTypeList}
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
