import React, { Component, Fragment } from 'react';
import { Form, Input, Select, DatePicker, Button, Modal, Badge } from 'antd';
import { findDOMNode } from 'react-dom';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import RightDraw from '@/components/RightDraw';
import StandardTable from '@/components/StandardTable';
import AbnormalDetail from './AbnormalDetail';
import AntdSelectRegion from '@/components/AntdSelectRegion';
import SearchSelect from '@/components/SearchSelect';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import { codes, statusMap, currentStateCode, recodeTypeCode } from './utils';
import { queryDict, formateDateToMin } from '@/utils/common';
import { allDictList } from '@/utils/constans';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;

@ManageList
@connect(({ abnormal, loading, component, common }) => ({
  abnormal,
  loading: loading.effects['abnormal/abnormalList'],
  searchValue: component.searchValue,
  // dictObject: common.dictObject,
  dictObject: component.dictObject,
}))
@Form.create()
export default class AbnormalList extends Component {
  state = {
    expandForm: false,
    visible: false,
    id: '',
    formValues: { currentState: ['PROCESSING', 'PENDING'] },
    fileList: [],
    fileList_short: [],
    fileList_long: [],
    curState: '',
    selected: [],
    customerNames: [],
  };
  className = 'AbnormalList';
  columns = [
    {
      title: '异常编号',
      dataIndex: 'questionNumber',
      fixed: this.props.isMobile ? false : true,
      render: (text, record) => (
        <AdButton
          mode="a"
          onClick={e => this.showDetail(e, record)}
          text={text}
          code={codes.showDetail}
        />
      ),
    },
    {
      title: '异常原因类别',
      dataIndex: 'questionCauseType',
      render: text => (
        <AdSelect
          onlyRead={true}
          value={text}
          data={this.props.dictObject[allDictList.abnormalCauseType]}
        />
      ),
      width: 100,
    },
    {
      title: '异常标题',
      dataIndex: 'questionTitle',
      render: text => <span title={text}>{text}</span>,
      width: 200,
    },
    {
      title: '发生日期',
      dataIndex: 'happenDate',
    },
    {
      title: '级别',
      dataIndex: 'level',
      render: text => (
        <AdSelect
          onlyRead={true}
          value={text}
          data={this.props.dictObject[allDictList.ems_level]}
        />
      ),
      width: 100,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      render: text => (
        <AdSelect
          onlyRead={true}
          value={text}
          data={this.props.dictObject[allDictList.ems_priority]}
        />
      ),
      width: 100,
    },
    {
      title: '异常地点',
      dataIndex: 'happenAddress',
    },
    {
      title: '状态',
      dataIndex: 'currentState',
      render: text => {
        const val = <Badge status={statusMap[val]} text={val} />;
        return <AdSelect onlyRead={true} value={text} data={currentStateCode} />;
      },
      width: 100,
    },
    {
      title: '类别',
      dataIndex: 'type',
      render: text => (
        <AdSelect
          onlyRead={true}
          value={text}
          data={this.props.dictObject[allDictList.ems_catetory]}
        />
      ),
      width: 100,
    },
    {
      title: '跟进人',
      dataIndex: 'sysName',
    },
    {
      title: '负责区域',
      dataIndex: 'orgFullName',
    },
    {
      title: '订单号',
      dataIndex: 'orderId',
    },
    {
      title: '车牌号',
      dataIndex: 'cartPlateNo',
    },
    {
      title: '破损数量',
      dataIndex: 'damageCount',
    },
    {
      title: '客户',
      dataIndex: 'customerName',
    },

    {
      title: '索赔方',
      dataIndex: 'claimant',
    },
    {
      title: '索赔额(元) ',
      dataIndex: 'claimAmount',
      render: text => {
        return <span>{text && Number(text) !== 0 ? Number(text).toFixed(2) : 0}</span>;
      },
    },
    {
      title: '赔付方',
      dataIndex: 'compensationParty',
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: '赔付额(元)',
      dataIndex: 'compensationAmount',
      render: text => {
        return <span>{text && Number(text) !== 0 ? Number(text).toFixed(2) : 0}</span>;
      },
    },
    {
      title: '损失(元)',
      dataIndex: 'lostMoney',
      render: (text, record) => {
        //损失=索赔额-赔付额
        const lostMoney = (Number(record.claimAmount) - Number(record.compensationAmount)).toFixed(
          2
        );
        return <span>{lostMoney && Number(lostMoney) !== 0 ? lostMoney : 0}</span>;
      },
    },
    {
      title: '更新人',
      dataIndex: 'updateBy',
      render: text => (
        <AdSearch
          label="loginName"
          name="sysName"
          value={this.props.searchValue[text]}
          onlyRead={true}
        />
      ),
    },
    {
      title: '更新时间 ',
      dataIndex: 'updateTime',
      render: text => <span>{text ? moment(text).format(formateDateToMin) : ''}</span>,
    },
    {
      title: '新增人',
      dataIndex: 'createBy',
      render: text => (
        <AdSearch
          label="loginName"
          name="sysName"
          value={this.props.searchValue[text]}
          onlyRead={true}
        />
      ),
    },
    {
      title: '新增时间',
      dataIndex: 'createTime',
      render: text => <span>{text ? moment(text).format(formateDateToMin) : ''}</span>,
    },
  ];

  componentDidMount() {
    this.dispatchFun('abnormal/abnormalList', { currentState: ['PROCESSING', 'PENDING'] });
  }

  componentWillMount() {
    const allDict = [
      allDictList.ems_catetory,
      allDictList.ems_level,
      allDictList.ems_priority,
      allDictList.abnormalCauseType,
    ];
    queryDict({ props: this.props, allDict });
  }

  // 分页操作
  handleStandardTableChange = param => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.dispatchFun('abnormal/abnormalList', params);
  };

  // 重置条件查询表单
  handleFormReset = () => {
    this.setState({ formValues: {}, customerNames: [] });

    this.dispatchFun('abnormal/abnormalList', {});
  };

  // 执行条件查询表单
  handleSearch = values => {
    if (!values) {
      return;
    }
    const { happenDate, mdsOrgId, mdsCustomerId, ...value } = values;
    value.mdsOrgId = mdsOrgId && mdsOrgId.length > 0 ? mdsOrgId[mdsOrgId.length - 1] : '';
    if (happenDate) {
      value.abnormalStartTime = moment(happenDate[0]).format(dateFormat);
      value.abnormalEndTime = moment(happenDate[1]).format(dateFormat);
    }
    if (mdsCustomerId && mdsCustomerId.length) {
      value.mdsCustomerId = mdsCustomerId[0].id;
    }
    // console.log('value===', value);
    this.setState({
      formValues: value,
    });
    this.dispatchFun('abnormal/abnormalList', value);
  };

  // 跳转 新增页面
  handleAdd = () => {
    router.push(`/abnormal/abnormalList/add-form`);
  };

  // 跳转 编辑页面
  handleEdit = () => {
    const { id } = this.state;
    this.closeDetail();
    router.push(`/abnormal/abnormalList/edit-form/${id}`);
  };
  //处理完成：
  handleFish = () => {
    const { id, curState, responsible, formValues } = this.state;
    const {
      dispatch,
      abnormal: { detail },
    } = this.props;
    const _this = this;
    const details = detail[id];

    if (
      details &&
      (details.level == '待定' || details.level == 'LEVEL_DETERMINED') &&
      !details.longTermSolutions
    ) {
      prompt({
        content: '"级别"不能为待定状态，"长期解决方案"不能为空',
        title: '温馨提示',
        duration: null,
        type: 'warn',
      });
      return;
    }
    if ((details && details.level == '待定') || details.level == 'LEVEL_DETERMINED') {
      prompt({
        content: '"级别"不能为待定状态',
        title: '温馨提示',
        duration: null,
        type: 'warn',
      });
      return;
    }
    if (!details.longTermSolutions) {
      prompt({
        content: '"长期解决方案"不能为空',
        title: '温馨提示',
        duration: null,
        type: 'warn',
      });
      return;
    }
    confirm({
      title: '温馨提示',
      content: '是否已经处理完？确认完成后将不能再进行编辑',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'abnormal/confirmFinish',
          payload: { id },
          callback: res => {
            _this.dispatchFun('abnormal/abnormalDetail', { id });
            _this.dispatchFun('abnormal/abnormalList', formValues);
            _this.setState({
              curState: 'CLOSED',
            });
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  // 关闭右抽屉
  closeDetail = () => {
    this.setState({
      visible: false,
    });
  };
  // 打开右抽屉
  showDetail = (e, record) => {
    e.stopPropagation();
    const id = record.id;
    this.setState({
      visible: true,
      id,
      curState: record.currentState,
    });
    this.dispatchFun('abnormal/abnormalDetail', { id });
    //附件
    this.getFileList(id, 'ABNORMAL_INFO', 'fileList'); //异常差错附件
    this.getFileList(id, 'TEMP_ORARY', 'fileList_short'); //临时解决方案附件
    this.getFileList(id, 'LONG_TERM', 'fileList_long'); //长期解决方案附件
  };
  //附件：
  getFileList = (id, fileBizType, fielListType) => {
    const _this = this;
    this.props.dispatch({
      type: 'abnormal/selectFileList',
      payload: {
        bizId: id,
        fileBizType,
      },
      callback: res => {
        // let fileList = [];
        // if (Array.isArray(res) && res.length > 0) {
        //   fileList = res.map(file => {
        //     const { id, fileUrl } = file;
        //     return {
        //       uid: id,
        //       name: fileUrl.substring(fileUrl.lastIndexOf('\\') + 1, fileUrl.length),
        //       status: 'done',
        //       url: `/server/api/ems/ems-attachment/readFile?path=${fileUrl}&token=${localStorage.getItem(
        //         'token'
        //       )}`,
        //       id,
        //     };
        //   });
        // }
        _this.setState({
          [fielListType]: res,
        });
      },
    });
  };

  // dispatch 方法
  dispatchFun(type, params) {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: type,
      payload: params,
      callback: data => {
        if (!data) return;
        if (type === 'abnormal/abnormalList') {
          let valueList = [];
          data.map(v => {
            const labels = ['updateBy', 'createBy'];
            labels.map(item => {
              if (v[item] && !valueList.includes(v[item])) {
                valueList.push(v[item]);
                !searchValue[v[item]] &&
                  dispatch({
                    type: 'component/querySearchValue',
                    payload: {
                      params: { loginName: v[item] },
                      url: 'mds-user/selectList',
                    },
                  });
              }
            });
          });
        }
      },
    });
  }
  onRegionChange = (keys, values) => {
    this.setState({ selected: keys });
  };
  toggleForm = expandForm => {
    this.setState({
      expandForm,
    });
  };
  getCustomerName = values => {
    this.setState({
      customerNames: values,
    });
  };
  render() {
    const {
      form,
      loading,
      abnormal: { abnormalList, detail },
      match: { params },
      isMobile,
      dictObject,
    } = this.props;
    const customerColumn = [
      {
        title: '名称',
        dataIndex: 'customerName',
      },
    ];
    const {
      id,
      visible,
      fileList,
      fileList_short,
      fileList_long,
      curState,
      formValues,
      expandForm,
      customerNames,
    } = this.state;
    const { getFieldDecorator } = form;
    // firstForm 参数
    const firstFormItem = (
      <FormItem label="标题">
        {getFieldDecorator('questionTitle')(<Input  />)}
      </FormItem>
    );
    const secondFormItem = (
      <FormItem label="状态">
        {getFieldDecorator('currentState', {
          initialValue: formValues.currentState,
        })(
          <Select
            mode="tags"
            showSearch
            allowClear={true}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="">请选择</Option>
            {currentStateCode &&
              currentStateCode.map(item => <Option key={item.code}>{item.value}</Option>)}
          </Select>
        )}
      </FormItem>
    );

    // secondForm 参数
    const otherFormItem = [
      [
        <FormItem label="异常编号">
          {getFieldDecorator('questionNumber')(<Input  />)}
        </FormItem>,
      ],
      [
        <FormItem label="异常原因类别">
          {getFieldDecorator('questionCauseType')(
            <Select
              showSearch
              allowClear={true}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="">请选择</Option>
              {dictObject[allDictList.abnormalCauseType] &&
                dictObject[allDictList.abnormalCauseType].map(item => (
                  <Option key={item.code}>{item.value}</Option>
                ))}
            </Select>
          )}
        </FormItem>,
        <FormItem label="级别">
          {getFieldDecorator('level')(
            <Select
              showSearch
              allowClear={true}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="">请选择</Option>
              {dictObject[allDictList.ems_level] &&
                dictObject[allDictList.ems_level].map(item => (
                  <Option key={item.code}>{item.value}</Option>
                ))}
            </Select>
          )}
        </FormItem>,
        <FormItem label="客户">
          {getFieldDecorator('mdsCustomerId')(
            <SearchSelect
              dataUrl="ems/abnormal-info/selectCustomerList"
              // url="ems/abnormal-info/selectCustomer" // selectedData只只有id时需要传url
              selectedData={customerNames} // 选中值
              multiple={false} // 是否多选
              showValue="customerName"
              searchName="keyWord"
              columns={customerColumn} // 表格展示列
              onChange={this.getCustomerName} // 获取选中值
              scrollX={240}
              id="errAbnormalList_customerName"
              allowClear={true}
            />
          )}
        </FormItem>,
      ],
      [
        <FormItem label="类别">
          {getFieldDecorator('type')(
            <Select
              showSearch
              allowClear={true}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="">请选择</Option>
              {dictObject[allDictList.ems_catetory] &&
                dictObject[allDictList.ems_catetory].map(item => (
                  <Option key={item.code}>{item.value}</Option>
                ))}
            </Select>
          )}
        </FormItem>,
        <FormItem label="订单号">
          {getFieldDecorator('orderId')(<Input  />)}
        </FormItem>,
        <FormItem label="发生日期">
          {getFieldDecorator('happenDate')(<RangePicker style={{ width: '100%' }} />)}
        </FormItem>,
        // <FormItem label="负责区域">
        //   {getFieldDecorator('mdsOrgId')(
        //     <AntdSelectRegion
        //       url="mds-organization/selectAreaById"
        //       label="name"
        //       selected={this.state.selected}
        //       onChange={this.onRegionChange}
        //     />
        //   )}
        // </FormItem>,
      ],
      ['operatorButtons'],
    ];

    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      otherFormItem,
      form,
      code: codes.select,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      toggleForm: this.toggleForm,
      className: this.className,
    };

    const tableButtonsParams = {
      show: false,
      code: codes.add,
      handleAdd: this.handleAdd,
    };
    const curStateVal = curState == 'CLOSED' || curState == '已关闭' ? true : false;

    const rightDrawParams = {
      isMobile,
      visible,
      title: '异常详情',
      closeDetail: this.closeDetail,
      code: codes.showDetail,
      buttons: (
        <Button.Group>
          <AdButton
            onClick={() => this.handleFish()}
            disabled={curStateVal}
            text="处理完成"
            code={codes.finish}
          />
          <AdButton
            onClick={this.handleEdit}
            disabled={curStateVal}
            text="编辑"
            type="primary"
            code={codes.edit}
          />
        </Button.Group>
      ),
    };
    return (
      <Fragment>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          disabledRowSelected={true}
          loading={loading}
          data={abnormalList}
          columns={this.columns}
          onPaginationChange={this.handleStandardTableChange}
          // scrollX={4600}
          className={this.className}
          expandForm={expandForm}
          code={codes.page}
        />
        <RightDraw {...rightDrawParams}>
          <AbnormalDetail
            isMobile={isMobile}
            id={id}
            onClick={this.onClick}
            file={{ fileList, fileList_short, fileList_long }}
            curStateVal={curStateVal}
          />
        </RightDraw>
      </Fragment>
    );
  }
}
