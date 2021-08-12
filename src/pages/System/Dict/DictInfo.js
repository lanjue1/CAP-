import React, { Component, Fragment } from 'react';
import StandardTable from '@/components/StandardTable';
import { Icon, Form, Input, Modal, Select, Row, Col, Upload, DatePicker } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/Info.less';
import moment from 'moment';
import SearchSelect from '@/components/SearchSelect';
import { formatFile, getNowFormatDate } from '@/pages/Common/common';
import prompt from '@/components/Prompt';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

//跟进记录类型
const recodeTypeCode = [
  { code: 'FOLLOWUP', value: '跟进' },
  { code: 'NEW', value: '新建' },
  { code: 'CLOSED', value: '已关闭' },
];
//收、付款
const payCode = [{ code: 'RECEIVABLES', value: '收款' }, { code: 'PAYMENT', value: '付款' }];
@connect(({ Dict, loading, common }) => ({
  Dict,
  loading: loading.models.Dict,
  dictObject: common.dictObject,
}))
@Form.create()
export default class DictInfo extends Component {
  state = {
    selectedRows: [],
    dictDataId: '',
  };
  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
  }
  componentWillReceiveProps(nextProps) {}

  columns = [
    {
      title: '编码',
      dataIndex: 'code',
      width: 150,
      render: (text, record) =>
        this.props.type === 'list' && !this.props.disabled ? (
          <a onClick={() => this.showDetail(record)}>{text}</a>
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '名称',
      dataIndex: 'value',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '状态',
      dataIndex: 'beActive',
      render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
    },
    {
      title: '字典备注',
      dataIndex: 'remarks',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 150,
    },
    {
      title: '更新人',
      dataIndex: 'updateBy',
    },
  ];

  showDetail = record => {
    const { id } = record;
    const { dispatch, operateInfo } = this.props;
    dispatch({
      type: 'Dict/dictDataDetails',
      payload: { id },
      callback: res => {
        operateInfo('', 'edit');
        this.setState({
          dictDataId: id,
        });
      },
    });
  };

  // 新增或编辑操作
  handleOk = () => {
    // console.log('确认', this.props);
    const { form, dispatch, id, handleCancel } = this.props;
    const { dictDataId } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.dictId = id;
      if (dictDataId) {
        values.id = dictDataId;
      }
      // console.log('======values');
      dispatch({
        type: 'Dict/dictDataOperate',
        payload: values,
        callback: res => {
          this.getDictDataList({ id });
          this.handleCancel();
        },
      });
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
      dictDataId: '',
    });
  };
  getDictDataList = params => {
    const { dispatch } = this.props;
    params.pageSize = 500;
    dispatch({
      type: 'Dict/dictDataList',
      payload: params,
    });
  };

  //启用、禁用：
  abledStatus = (type, isSingle) => {
    const { dispatch, id } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = isSingle ? [checkId] : checkIds;
    params.type = type == 'abled' ? true : false;
    dispatch({
      type: 'Dict/ableDictDataOperate',
      payload: params,
      callback: res => {
        this.getDictDataList({ id });

        // if (isSingle) {
        //   this.props.dispatch({
        //     type: 'Dict/dictDetails',
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
  // 明细翻页
  handleStandardTableChange = param => {
    const { dispatch } = this.props;
    // const { searchValue } = this.state;
    const params = {
      // ...searchValue,
      ...param,
    };
    // this.dispatchFun('abnormal/userList', params);
  };

  render() {
    const {
      loading,
      // data,
      change,
      visible,
      handleCancel,
      form: { getFieldDecorator },
      id,
      type,
      listType,
      Dict: { dictDataDetails, dictDataList },
      dictObject,
      columns1,
      infoType,
      curStateVal,
      disabled,
    } = this.props;
    const { selectedRows, dictDataId } = this.state;
    const infoDetail = dictDataId && infoType == 'edit' ? dictDataDetails[dictDataId] : {};
    const data = id ? dictDataList : { list: [] };

    return (
      <Fragment>
        <StandardTable
          loading={loading}
          data={data}
          disabledRowSelected={curStateVal}
          scrollX={800}
          scrollY={350}
          expandForm={false}
          columns={this.columns}
          onPaginationChange={this.handleStandardTableChange}
          selectedRows={selectedRows}
          onSelectRow={this.handleSelectRows}
          disabledRowSelected={disabled || type !== 'list'}
        />
        {visible && (
          <Modal
            title={infoType == 'edit' ? '编辑字典数据' : '新增字典数据'}
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
                    <Form.Item label="编码">
                      {getFieldDecorator('code', {
                        rules: [{ required: true, message: '请选择' }],
                        initialValue: infoDetail ? infoDetail.code : '',
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col md={{ span: 12 }} sm={24}>
                    <Form.Item label="名称">
                      {getFieldDecorator('value', {
                        rules: [{ required: true, message: '请选择' }],
                        initialValue: infoDetail ? infoDetail.value : '',
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 12 }} sm={24}>
                    <Form.Item label="排序">
                      {getFieldDecorator('sort', {
                        initialValue: infoDetail ? infoDetail.sort : '',
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 24 }} sm={24}>
                    <Form.Item label="备注">
                      {getFieldDecorator('remarks', {
                        initialValue: infoDetail.remarks || '',
                      })(<TextArea  rows={2} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Modal>
        )}
      </Fragment>
    );
  }
}
