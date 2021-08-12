import React, { Component, Fragment } from 'react';
import StandardTable from '@/components/StandardTable';
import { Icon, Form, Input, Modal, Select, Row, Col, Upload, DatePicker } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/Info.less';
import moment from 'moment';
import FileReader from '@/components/FileReader';
import SearchSelect from '@/components/SearchSelect';
import AdModal from '@/components/AdModal';
import { formatFile, getNowFormatDate, checkStrLength } from '@/pages/Common/common';
import prompt from '@/components/Prompt';
import AdSelect from '@/components/AdSelect';
import { recodeTypeCode } from './utils';
import AdSearch from '@/components/AdSearch';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

@connect(({ abnormal, loading, common, component }) => ({
  abnormal,
  loading: loading.effects['abnormal/abnormalInfoList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
}))
@Form.create()
export default class RepairInfo extends Component {
  state = {
    id: 0,
    fileList: [],
    auths: [],
    selectedRows: [],
    // fileReaderVisible: false,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    // 查询字典：
    //币种：
    dispatch({
      type: 'common/querytDictByCode',
      payload: { code: 'currency-type' },
    });
  }

  columns = [
    {
      title: '处理日期',
      dataIndex: 'followupDate',
    },
    {
      title: '处理人',
      dataIndex: 'sysName',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: text => <AdSelect onlyRead={true} value={text} data={recodeTypeCode} />,
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
          params={{ bizId: record.id, fileBizType: 'FOLLOW_UP' }}
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
    const {
      form,
      dispatch,
      id,
      handleCancel,
      listType,
      updatefollowupPerson,
      currentUser,
    } = this.props;
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
      values.fileTokens =
        fileTokens &&
        fileTokens
          .filter(file => file.response && file.response.code == 0)
          .map(file => file.response.data);
      //跟进人：
      const _auths = auths && auths.length > 0 ? auths : currentUser;
      if (_auths.length > 0) {
        const followupPersonId = _auths.map(v => {
          return v.id;
        });
        values.followupPersonId = followupPersonId.join(',');
      } else {
        values.followupPersonId = '';
      }
      // console.log('======values');
      dispatch({
        type: 'abnormal/abnormalInfoOperate',
        payload: values,
        callback: res => {
          dispatch({
            type: 'abnormal/abnormalInfoList',
            payload: { id },
            callback: data => {
              this.getUserData(data);
            },
          });
          dispatch({
            type: 'abnormal/abnormalDetail',
            payload: { id },
          });
          this.handleCancel();
          //更新基本信息的跟进人：
          updatefollowupPerson(auths);
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
  //是自定义搜索
  onFocus = () => {
    // this._input.blur();
  };
  onCancel = values => {
    this.setState({ auths: values });
  };
  // onSearch = value => {
  //   this.setState({ searchValue: value });
  //   this.props.dispatch({
  //     type: 'abnormal/userList',
  //     payload: { keyWord: value },
  //   });
  // };
  getValue = values => {
    const { auths } = this.state;
    this.setState({
      auths: values,
    });
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel();
    this.setState({
      auths: [],
      fileList: [],
    });
  };
  // 明细翻页
  handleStandardTableChange = param => {
    const { dispatch, id } = this.props;
    param.id = id;
    this.getInfoList(param);
  };
  getInfoList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'abnormal/abnormalInfoList',
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
      type,
      listType,
      abnormal: { infoDetail, userList },
      dictObject,
      columns1,
      currentUser,
      curStateVal,
    } = this.props;
    const { fileList, auths, selectedRows } = this.state;
    const _auths = auths && auths.length > 0 ? auths : currentUser;
    // console.log('auths', auths, '===_auths', _auths);

    let prefixSelector;
    if (listType == 'pay') {
      prefixSelector = getFieldDecorator('currencyType', {
        initialValue: 'CNY',
      })(
        <Select style={{ width: 90 }}>
          {dictObject['currency-type'] &&
            dictObject['currency-type'].map(item => <Option key={item.code}>{item.value}</Option>)}
        </Select>
      );
    }

    return (
      <Fragment>
        <StandardTable
          loading={loading}
          data={data}
          disabledRowSelected={curStateVal}
          scrollX={500}
          scrollY={200}
          columns={this.columns}
          onPaginationChange={this.handleStandardTableChange}
          selectedRows={selectedRows}
          onSelectRow={this.handleSelectRows}
        />
        {visible && (
          <AdModal
            title="新增跟进记录"
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
                    <Form.Item label="跟进日期">
                      {getFieldDecorator('followupDate', {
                        rules: [{ required: true, message: '请选择' }],
                        initialValue:
                          infoDetail && infoDetail.followupDate
                            ? moment(infoDetail.followupDate, dateFormat)
                            : moment(getNowFormatDate(), dateFormat),
                      })(<DatePicker style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 24 }} sm={24}>
                    <Form.Item label="跟进人">
                      {getFieldDecorator('followupPersonId', {
                        rules: [{ required: true, message: '请选择' }],
                        initialValue: _auths,
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
                          id="errAbnormal_3"
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 24 }} sm={24}>
                    <Form.Item label="描述">
                      {getFieldDecorator('describes', {
                        rules: [
                          { required: true, message: '请选择' },
                          {
                            validator: (rule, value, callback) =>
                              checkStrLength(rule, value, callback, 250, '描述'),
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
