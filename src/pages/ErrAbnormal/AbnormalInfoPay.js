import React, { Component, Fragment } from 'react';
import StandardTable from '@/components/StandardTable';
import { Icon, Form, Input, Modal, Select, Row, Col, Upload, DatePicker } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/Info.less';
import FileReader from '@/components/FileReader';
import moment from 'moment';
import AdModal from '@/components/AdModal';
import { getNowFormatDate } from '@/pages/Common/common';
import SearchSelect from '@/components/SearchSelect';
import prompt from '@/components/Prompt';
import { formatFile, checkStrLength } from '@/pages/Common/common';
import AntdInput from '@/components/AntdInput';
import AdSelect from '@/components/AdSelect';
import { payCode } from './utils';
import AdSearch from '@/components/AdSearch';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

@connect(({ abnormal, loading, common, component }) => ({
  abnormal,
  loading: loading.effects['abnormal/abnormalInfoPayList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
}))
@Form.create()
export default class RepairInfo extends Component {
  state = {
    id: 0,
    fileList: [],
    addType: 'pay',
    auths: [],
    selectedRows: [],
  };

  columns = [
    {
      title: '处理日期',
      dataIndex: 'tradingDate',
      width: 100,
    },
    {
      title: '处理人',
      dataIndex: 'sysName',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: text => <AdSelect onlyRead={true} value={text} data={payCode} />,
    },
    {
      title: '金额',
      dataIndex: 'amountOfMoney',
      render: text => {
        return <span>{text && Number(text) !== 0 ? Number(text).toFixed(2) : 0}</span>;
      },
    },
    {
      title: '付款方',
      dataIndex: 'payer',
    },
    {
      title: '收款方',
      dataIndex: 'payee',
    },
    {
      title: '说明',
      dataIndex: 'describes',
      render: text => {
        return (
          <a title={text} href="javascript:void(0)" onClick={() => this.showDetailsTips(text)}>
            {text}
          </a>
        );
      },
    },
    {
      title: '附件',
      dataIndex: 'attaQuantity',
      render: (text, record) => (
        <FileReader
          type="list"
          count={text}
          params={{ bizId: record.id, fileBizType: 'RECEIVING' }}
        />
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 150,
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
  ];
  componentDidMount() {
    const { dispatch } = this.props;
    // 查询字典：
    //类型：
    dispatch({
      type: 'common/querytDictByCode',
      payload: { code: 'repair_details_type' },
    });
    //币种：
    dispatch({
      type: 'common/querytDictByCode',
      payload: { code: 'currency-type' },
    });
  }

  //查看说明详情：
  showDetailsTips = text => {
    Modal.info({
      title: '说明详情',
      content: (
        <div>
          <p>{text}</p>
        </div>
      ),
      onOk() {},
      okText: '确定',
    });
  };

  //附件：
  getFileList = (id, fileBizType) => {
    this.props.dispatch({
      type: 'abnormal/selectFileList',
      payload: {
        bizId: id,
        fileBizType,
      },
      callback: res => {
        if (res.length > 0) {
          const url = `http://${window.location.host}/server/api/ems/ems-attachment/readFile?path=${
            res[0].fileUrl
          }&token=${localStorage.getItem('token')}`;
          window.open(url);
        } else {
          prompt({
            content: '该条记录暂无附件',
            title: '温馨提示',
            type: 'warn',
          });
        }
      },
    });
  };

  // 新增或编辑操作
  handleOk = () => {
    // console.log('确认', this.props);
    const { form, dispatch, id, handleCancel, listType, addType, currentUser } = this.props;
    const { fileList, auths } = this.state;
    form.validateFields((err, value) => {
      if (err) {
        return;
      }
      const { tradingDate, followupDate, fileTokens, ...values } = value;
      if (tradingDate) {
        values.tradingDate = moment(tradingDate).format(dateFormat);
      }
      if (followupDate) {
        values.followupDate = moment(followupDate).format(dateFormat);
      }
      values.abnormalId = id; //id
      values.fileTokens = fileTokens
        ? fileTokens
            .filter(file => file.response && file.response.code == 0)
            .map(file => file.response.data)
        : [];
      //处理人：
      const _auths = auths && auths.length > 0 ? auths : currentUser;
      if (_auths.length > 0) {
        const handlePersonId = _auths.map(v => {
          return v.id;
        });
        values.handlePersonId = handlePersonId.join(',');
      } else {
        values.handlePersonId = '';
      }
      values.type = addType;
      dispatch({
        type: 'abnormal/abnormalInfoPayOperate',
        payload: values,
        callback: res => {
          this.handleCancel();
          dispatch({
            type: 'abnormal/abnormalInfoPayList',
            payload: { id },
            callback: data => {
              this.getUserData(data);
            },
          });
          // dispatch({
          //   type: 'abnormal/abnormalDetail',
          //   payload: { id },
          // });
          form.resetFields();
        },
      });
    });
  };

  // 上传图片
  handleChange = (fileList, type) => {
    this.setState({
      [type]: fileList,
    });
  };

  // 删除图片
  onRemove = (delIds, type) => {
    this.setState({
      [type]: delIds,
    });
  };
  //是自定义搜索
  onFocus = () => {
    // this._input.blur();
  };
  onCancel = values => {
    this.setState({ auths: values });
  };
  onSearch = value => {
    this.setState({ searchValue: value });
    this.props.dispatch({
      type: 'abnormal/userList',
      payload: { keyWord: value },
    });
  };
  getValue = values => {
    const { auths } = this.state;
    this.setState({
      auths: values,
    });
  };
  handleSelectRows = rows => {
    const { getSelectedRows } = this.props;
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
    getSelectedRows(rows);
  };
  handleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel();
    this.setState({
      auths: [],
      fileList: [],
    });
  };

  handleStandardTableChangePay = param => {
    const { dispatch, id } = this.props;
    param.id = id;
    this.getInfoPayList(param);
  };
  getInfoPayList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'abnormal/abnormalInfoPayList',
      payload: params,
      callback: data => {
        this.getUserData(data);
      },
    });
  };
  //人员列表回写：
  getUserData = data => {
    const { dispatch, searchValue } = this.props;
    if (!data) return;
    let valueList = [];
    data.map(v => {
      const labels = ['updateBy'];
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
  };

  render() {
    const {
      loading,
      data,
      change,
      visible,
      handleCancel,
      form: { getFieldDecorator },
      id,
      addType,
      listType,
      abnormal: { infoDetail, userList },
      dictObject,
      currentUser,
      columns1,
      curStateVal,
    } = this.props;
    const { fileList, auths, selectedRows } = this.state;

    const prefixSelector = getFieldDecorator('currencyType', {
      initialValue: 'CNY',
    })(
      <Select style={{ width: 90 }}>
        {dictObject['currency-type'] &&
          dictObject['currency-type'].map(item => <Option key={item.code}>{item.value}</Option>)}
      </Select>
    );

    const _auths = auths && auths.length > 0 ? auths : currentUser;
    return (
      <Fragment>
        <StandardTable
          loading={loading}
          data={data}
          disabledRowSelected={curStateVal}
          scrollX={800}
          scrollY={200}
          columns={this.columns}
          onPaginationChange={this.handleStandardTableChangePay}
          selectedRows={selectedRows}
          onSelectRow={this.handleSelectRows}
        />
        {visible && (
          <AdModal
            title={addType == 'pay' ? '新增付款' : '新增收款'}
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={620}
            style={{ top: 20 }}
            destroyOnClose={true}
          >
            <div className={styles.tableListForm}>
              <Form layout="inline">
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 12 }} sm={24}>
                    <Form.Item label="付款方">
                      {getFieldDecorator('payer', {
                        rules: [
                          { required: true, message: '请选择' },
                          {
                            validator: (rule, value, callback) =>
                              checkStrLength(rule, value, callback, 50, '付款方'),
                          },
                        ],
                        initialValue: infoDetail.payer || '',
                      })(<Input  />)}
                    </Form.Item>
                  </Col>
                  <Col md={{ span: 12 }} sm={24}>
                    <Form.Item label="收款方">
                      {getFieldDecorator('payee', {
                        rules: [
                          { required: true, message: '请选择' },
                          {
                            validator: (rule, value, callback) =>
                              checkStrLength(rule, value, callback, 50, '收款方'),
                          },
                        ],
                        initialValue: infoDetail.payee || undefined,
                      })(<Input  />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 12 }} sm={24}>
                    <Form.Item label="金额">
                      {getFieldDecorator('amountOfMoney', {
                        rules: [
                          { required: true, message: '请选择' },
                          {
                            validator: (rule, value, callback) =>
                              checkStrLength(rule, value, callback, 50, '金额'),
                          },
                        ],
                        initialValue: infoDetail.amountOfMoney || '',
                      })(
                        // <Input addonBefore={prefixSelector}  />
                        <AntdInput
                          mode="money"
                          label="金额"
                          placeholder="输入的长度不超过18位最多可保留两位小数的数字"
                          addonBefore={prefixSelector}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={{ span: 12 }} sm={24}>
                    <Form.Item label="时间">
                      {getFieldDecorator('tradingDate', {
                        rules: [{ required: true, message: '请选择' }],
                        initialValue: moment(getNowFormatDate(), dateFormat),
                      })(<DatePicker style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 24 }} sm={24}>
                    <Form.Item label="处理人">
                      {getFieldDecorator('handlePersonId', {
                        rules: [{ required: true, message: '请选择' }],
                        initialValue: currentUser,
                      })(
                        <SearchSelect
                          dataUrl="mds-user/selectList"
                          url="ems/abnormal-info/userViewDetails_s"
                          selectedData={_auths} // 选中值
                          multiple={false} // 是否多选
                          showValue="sysName"
                          searchName="keyWord"
                          columns={columns1} // 表格展示列
                          onChange={this.getValue} // 获取选中值
                          scrollX={240}
                          id="errAbnormal_4"
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 24 }} sm={24}>
                    <Form.Item label="备注">
                      {getFieldDecorator('describes', {
                        rules: [
                          {
                            validator: (rule, value, callback) =>
                              checkStrLength(rule, value, callback, 250, '备注'),
                          },
                        ],
                        initialValue: infoDetail.describes || '',
                      })(<TextArea  rows={2} />)}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 24 }} sm={24}>
                    <Form.Item label="附件">
                      {getFieldDecorator('fileTokens')(<FileReader />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </AdModal>
        )}
      </Fragment>
    );
  }
}
