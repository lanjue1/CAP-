import React, { Component, Fragment } from 'react';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import { Icon, Form, Input, Modal, Select, Row, Col } from 'antd';
import { connect } from 'dva';
import { formateDateToMin } from '@/utils/common';
import AdSearch from '@/components/AdSearch';
import styles from '@/pages/Info.less';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ dictData, loading, common, component }) => ({
  dictData,
  dictDataDetails: dictData.dictDataDetails,
  loading: loading.effects['dictData/DictDataList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
}))
@Form.create()
export default class DictInfo extends Component {
  state = {
    selectedRows: [],
    dictDataId: '',
    pageHeight: 32,
    clientHeight: document.body.clientHeight,
  };

  componentDidMount() {
    this.props.onRef(this);
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    const { pagination } = this.props;
    this.setState({
      clientHeight: document.body.clientHeight,
    });
    pagination && this.getHeight({ name: 'ant-table-pagination', key: 'pageHeight' });
  };

  getHeight = ({ name, key }) => {
    const ele = document.querySelector(`.${this.className} .${name}`);
    ele && this.setState({ [key]: ele.clientHeight });
  };

  className = 'DictInfo';

  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 50,
      // fixed: this.props.isMobile ? false : true,
    },
    {
      title: '编码',
      dataIndex: 'code',
      render: (text, record) =>
        this.props.type === 'list' ? (
          <a onClick={() => this.showDetail(record)} title={text}>{text}</a>
        ) : (
          <span title={text}>{text}</span>
        ),
        width:150,
    },
    {
      title: '名称',
      dataIndex: 'value',
      render:text=><span title={text}>{text}</span>
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width:100,
    },
    {
      title: '状态',
      dataIndex: 'beActive',
      render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
      width: 100,
    },
    {
      title: '字典备注',
      dataIndex: 'remarks',
      render:text=><span title={text}>{text}</span>
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: text => <span>{text ? moment(text).format(formateDateToMin) : ''}</span>,
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

  showDetail = record => {
    const { id } = record;
    const { dispatch, operateInfo } = this.props;
    dispatch({
      type: 'dictData/dictDataDetails',
      payload: { id },
      callback: res => {
        operateInfo();
        this.setState({
          dictDataId: id,
        });
      },
    });
  };

  // 新增或编辑操作
  handleOk = () => {
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
      dispatch({
        type: 'dictData/dictDataOperate',
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

  //数据字典列表：
  getDictDataList = params => {
    const { dispatch } = this.props;
    params.pageSize = 500;
    dispatch({
      type: 'dictData/dictDataList',
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
      const labels = ['createBy', 'updateBy'];
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

  //启用、禁用：
  abledStatus = (type, isSingle) => {
    const { dispatch, id } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = isSingle ? [checkId] : checkIds;
    params.type = type == 'abled' ? true : false;
    dispatch({
      type: 'dictData/ableDictDataOperate',
      payload: params,
      callback: res => {
        this.getDictDataList({ id });
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
  };

  render() {
    const {
      loading,
      change,
      visible,
      handleCancel,
      form: { getFieldDecorator },
      id,
      type,
      listType,
      dictDataDetails,
      dictObject,
      columns1,
      curStateVal,
      dictData: { dictDataList },
    } = this.props;
    const { selectedRows, dictDataId, clientHeight, pageHeight } = this.state;
    const infoDetail = dictDataId ? dictDataDetails[dictDataId] : {};

    let Y = clientHeight - (178 + pageHeight);
    if (dictDataList.list && dictDataList.list.length === 0) {
      Y = Y + 43 - 168;
    }
    const ele = document.querySelector(`.${this.className} .ant-table-body`);
    if (ele) {
      ele.style.height = `${Y}px`;
    }

    const _gutter = { md: 4, lg: 12, xl: 24 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };

    return (
      <Fragment>
      <div className={this.className}>
      <StandardTable
          loading={loading}
          data={dictDataList}
          disabledRowSelected={curStateVal}
          columns={this.columns}
          onPaginationChange={this.handleStandardTableChange}
          selectedRows={selectedRows}
          scrollY={500}
          onSelectRow={this.handleSelectRows}
          disabledRowSelected={type === 'list' ? false : true}
          // className={this.className}
        />
      </div>
        {visible && (
          <Modal
            title={dictDataId ? '编辑字典数据' : '新增字典数据'}
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={620}
            style={{ top: 20 }}
            destroyOnClose={true}
          >
            <div className={styles.tableListForm}>
              <Form layout="inline">
                <Row gutter={_gutter}>
                  <Col {..._col}>
                    <Form.Item label="编码">
                      {getFieldDecorator('code', {
                        rules: [{ required: true, message: '请选择' }],
                        initialValue: infoDetail ? infoDetail.code : '',
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col {..._col}>
                    <Form.Item label="名称">
                      {getFieldDecorator('value', {
                        rules: [{ required: true, message: '请选择' }],
                        initialValue: infoDetail ? infoDetail.value : '',
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={_gutter}>
                  <Col {..._col}>
                    <Form.Item label="排序">
                      {getFieldDecorator('sort', {
                        initialValue: infoDetail ? infoDetail.sort : '',
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={_gutter}>
                  <Col {..._row}>
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
