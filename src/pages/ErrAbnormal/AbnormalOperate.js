import React, { Component } from 'react';
import {
  Collapse,
  Form,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Modal,
  Icon,
  Button,
  Checkbox,
  Radio,
  Tooltip,
  Upload,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Region from '@/components/Region';
import AntdTransfer from '@/components/AntdTransfer';
import prompt from '@/components/Prompt';
import AbnormalInfo from './AbnormalInfo';
import AbnormalInfoPay from './AbnormalInfoPay';
import AntdInput from '@/components/AntdInput';
import AdButton from '@/components/AdButton';
import { codes } from './utils';
import AntdFormItem from '@/components/AntdFormItem';
import FileReader from '@/components/FileReader';
import { getNowFormatDate, columns1 as columnsCars, checkStrLength } from '@/pages/Common/common';
import SearchSelect from '@/components/SearchSelect';
import { filterAddFile, filterDeteteFile, queryDict } from '@/utils/common';
import { allDictList } from '@/utils/constans';
import styles from '@/pages/Operate.less';
import router from 'umi/router';

const dateFormat = 'YYYY-MM-DD';
const Panel = Collapse.Panel;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
const confirm = Modal.confirm;

@connect(({ abnormal, loading, component }) => ({
  abnormal,
  loading: loading.models.abnormal,
  // dictObject: common.dictObject,
  dictObject: component.dictObject,
  searchValue: component.searchValue,
}))
@Form.create()
export default class AbnormalOperate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: ['1', '2', '3', '4'],
      fileList: [],
      fileList_short: [],
      fileList_long: [],
      deleteFileIds: [],
      deleteFileIds_short: [],
      deleteFileIds_long: [],
      visiblePay: false,
      visibleFile: false,
      listType: 'handle',
      addType: 'pay',
      showRecord: false,
      currentUser: [],
      auths: [],
      options: [],
      selected: [],
      searchValue: '',
      selectedRows: [],
      selectedRowsPay: [],
      saveBtn: true,
      // cars: [],
      payInfo: {},
      customNames: [],
    };
  }

  componentWillMount() {
    const allDict = [
      allDictList.ems_catetory,
      allDictList.ems_level,
      allDictList.ems_priority,
      allDictList.currencyType,
      allDictList.abnormalCauseType,
    ];
    queryDict({ props: this.props, allDict });
  }

  componentDidMount() {
    const {
      abnormal: { detail },
      match: { params },
      dispatch,
      dictObject,
    } = this.props;

    //当前用户
    dispatch({
      type: 'abnormal/checkLogin',
      payload: {},
      callback: res => {
        this.setState({
          currentUser: res.id ? [{ id: res.id }] : [],
          // auths: [res],
        });
      },
    });

    if (params.id) {
      const id = params.id;
      this.setState({ showRecord: true, saveBtn: true });
      this.getAbnormalDetail(id);
      this.getInfoList({ id });
      this.getInfoPayList({ id });

      //附件
      this.getFileList(id, 'ABNORMAL_INFO', 'fileList'); //异常差错附件
      this.getFileList(id, 'TEMP_ORARY', 'fileList_short'); //临时解决方案附件
      this.getFileList(id, 'LONG_TERM', 'fileList_long'); //长期解决方案附件
    }
  }

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
  queryRegion = selected => {
    const { dispatch } = this.props;
    const { options } = this.state;
    this.recurTest(selected.length - 2, 0, selected);
  };

  recurTest(j, length, realDfiles) {
    this.queryById({
      id: realDfiles[j],
      callback: data => {
        const newOptions = data.map(item => {
          return {
            value: item.id,
            label: item.name,
            isLeaf: false,
          };
        });
        if (j === realDfiles.length - 2) {
          this.setState({
            options: newOptions,
          });
        } else {
          const targetOptions = data.map(item => {
            if (item.id === realDfiles[j + 1]) {
              return {
                value: item.id,
                label: item.name,
                isLeaf: false,
                children: this.state.options,
              };
            } else {
              return {
                value: item.id,
                label: item.name,
                isLeaf: false,
              };
            }
          });
          this.setState({
            options: targetOptions,
          });
        }
        if (--j >= length) {
          this.recurTest(j, length, realDfiles);
        }
      },
    });
  }
  queryById = ({ id, callback }) => {
    const { dispatch } = this.props;
    dispatch({
      type: `common/selectOrgById`,
      payload: { id },
      callback: data => {
        if (!data) return;
        callback(data);
      },
    });
  };

  //附件：
  getFileList = (id, fileBizType, fielListType) => {
    this.props.dispatch({
      type: 'abnormal/selectFileList',
      payload: {
        bizId: id,
        fileBizType,
      },
      callback: res => {
        if (fielListType === 'fileList') {
          this.props.form.setFieldsValue({ fileTokens: res });
        } else if (fielListType === 'fileList_short') {
          this.props.form.setFieldsValue({ fileTokens_short: res });
        } else if (fielListType === 'fileList_long') {
          this.props.form.setFieldsValue({ fileTokens_long: res });
        }
        this.setState({
          [fielListType]: res,
        });
      },
    });
  };

  // 设置图片
  setFileList = list => {
    this.setState({ fileList: list });
  };

  // 切换收缩框
  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  // 明细查看详情
  showDetail = () => {
    this.setState({ visible: true });
  };

  // 明细关闭详情
  abnormalInfoHandleCancel = () => {
    // console.log('visible=====111');
    this.setState({ visible: false, visiblePay: false });
  };

  // // 明细翻页
  // handleStandardTableChange = param => {
  //   const {
  //     dispatch,
  //     match: {
  //       params: { id },
  //     },
  //   } = this.props;
  //   param.id = id;
  //   this.getInfoList(param);
  // };
  // handleStandardTableChangePay = param => {
  //   const {
  //     dispatch,
  //     match: {
  //       params: { id },
  //     },
  //   } = this.props;
  //   this.getInfoPayList(param);
  // };
  //删除跟进记录
  delRecord = (e, type) => {
    e.stopPropagation();
    // console.log('type', type);
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { selectedRows, selectedRowsPay } = this.state;
    let ids = selectedRows.map(v => v.id);
    let _url = 'abnormal/deleteFollowUp';
    let _urlList = 'abnormal/abnormalInfoList';
    if (type) {
      ids = selectedRowsPay.map(v => v.id);
      _url = 'abnormal/deleteAbnormalTrading';
      _urlList = 'abnormal/abnormalInfoPayList';
    }
    // console.log('ids', ids);
    dispatch({
      type: _url,
      payload: { ids },
      callback: () => {
        const detailId = params.id;
        if (type) {
          this.setState({
            selectedRowsPay: [],
          });
        } else {
          this.setState({
            selectedRows: [],
          });
        }

        this.dispatchFun(_urlList, { id: detailId });
      },
    });
  };

  // 点击新增跟进记录
  addabnormalInfo = (e, type, addType) => {
    e.stopPropagation();
    this.setState({ [type]: true, listType: type, addType });
  };
  // dispatch 方法
  dispatchFun(type, params) {
    const { dispatch } = this.props;
    dispatch({
      type: type,
      payload: params,
    });
  }

  // 添加 或 编辑操作
  operatePaneButton = (e, type) => {
    e.stopPropagation();
    e.preventDefault();
    if (type === 'cancel') {
      this.setState({
        saveBtn: false,
      });
      return;
    } else if (type === 'edit') {
      this.setState({
        saveBtn: true,
      });
      return;
    }

    const {
      payInfo: { beCompensation, beClaim },
      // cars,
      detailId,
    } = this.state;
    const {
      dispatch,
      abnormal: { detail },
      match: { params },
    } = this.props;
    const panel = detail[params.id];
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {
          vehicleId,
          happenDate,
          mdsOrgIds,
          fileTokens_long,
          fileTokens,
          fileTokens_short,
          ...value
        } = values;
        const {
          fileList,
          fileList_short,
          fileList_long,
          deleteFileIds,
          deleteFileIds_short,
          deleteFileIds_long,
          auths,
          editorState_short,
          editorState_long,
          currentUser,
          customNames,
        } = this.state;
        if (happenDate) {
          value.happenDate = moment(happenDate).format(dateFormat);
        }
        //保存车辆
        // if (cars.length > 0) {
        //   const vehicleId = cars.map(v => {
        //     return v.id;
        //   });
        //   value.vehicleId = vehicleId.join(',');
        // } else {
        //   value.vehicleId = '';
        // }
        value.mdsOrgIds =
          mdsOrgIds && mdsOrgIds.length
            ? mdsOrgIds.map(v => v.id.split('/')[v.id.split('/').length - 1])
            : [];
        // 附件;
        value.fileTokens = filterAddFile(fileTokens);
        value.temporaryFileTokens = filterAddFile(fileTokens_short);

        value.longTermFileTokens = filterAddFile(fileTokens_long);
        //跟进人：
        if (customNames && customNames.length > 0) {
          value.customerName = customNames[0].customerName;
          value.mdsCustomerId = customNames[0].id;
        } else {
          value.customerName = '';
          value.mdsCustomerId = '';
        }

        const _auths = auths && auths.length > 0 ? auths : currentUser;
        if (_auths.length > 0) {
          const followupPersonId = _auths.map(v => {
            return v.id;
          });
          value.followupPersonId = followupPersonId.join(',');
        } else {
          value.followupPersonId = '';
        }
        const {
          match: { params },
          dispatch,
        } = this.props;
        //编辑
        if (params.id) {
          const _id = params.id;
          value.deleteFileIds = filterDeteteFile(fileTokens, fileList);

          value.temporaryDeleteFileIds = filterDeteteFile(fileTokens_short, fileList_short);

          value.longTermDeleteFileIds = filterDeteteFile(fileTokens_long, fileList_long);

          value.id = _id;
          value.beClaim = beClaim;
          value.beCompensation = beCompensation;
          dispatch({
            type: 'abnormal/abnormalOperate',
            payload: value,
            callback: () => {
              this.getFileList(_id, 'ABNORMAL_INFO', 'fileList'); //异常差错附件
              this.getFileList(_id, 'TEMP_ORARY', 'fileList_short'); //临时解决方案附件
              this.getFileList(_id, 'LONG_TERM', 'fileList_long'); //长期解决方案附件
              this.dispatchFun('abnormal/abnormalList', {});
              this.getAbnormalDetail(_id);
              this.setState({
                saveBtn: false,
              });
            },
          });
        } else {
          dispatch({
            type: 'abnormal/abnormalOperate',
            payload: value,
            callback: res => {
              this.setState({ showRecord: true, saveBtn: false }); //新增成功，显示记录
              if (!res) return;
              this.getFileList(res, 'ABNORMAL_INFO', 'fileList'); //异常差错附件
              this.getFileList(res, 'TEMP_ORARY', 'fileList_short'); //临时解决方案附件
              this.getFileList(res, 'LONG_TERM', 'fileList_long'); //长期解决方案附件
              this.getInfoList({ id: res });
              this.dispatchFun('abnormal/abnormalList', {});
              this.getAbnormalDetail(res, 'link');
            },
          });
        }
      }
    });
  };

  linkEditPage = (data, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/setTabsName',
      payload: {
        id,
        name: data.questionNumber,
        isReplaceTab: true,
      },
      callback: result => {
        if (result) {
          router.push(`/abnormal/abnormalList/edit-form/${id}`);
        }
      },
    });
  };

  //获取详情
  getAbnormalDetail = (id, type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'abnormal/abnormalDetail',
      payload: { id },
      callback: data => {
        const lossCost = this.lossCal(data.claimAmount, data.compensationAmount);
        this.setState({
          auths: data.followupPersonId ? [{ id: data.followupPersonId }] : [],
          customNames: data.mdsCustomerId
            ? [{ id: data.mdsCustomerId, customerName: data.customerName }]
            : [],
          selected: data.orgFullIds,
          // cars: data.vehicleId ? [{ id: data.vehicleId }] : [],
          payInfo: {
            beClaim: data.beClaim,
            beCompensation: data.beCompensation,
            claimAmount: data.claimAmount ? Number(data.claimAmount).toFixed(2) : 0,
            compensationAmount: data.compensationAmount
              ? Number(data.compensationAmount).toFixed(2)
              : 0,
            claimant: data.claimant,
            compensationParty: data.compensationParty,
            lossCost,
          },
        });
        // data.attachments && this.setFileList(data.attachments);
        if (type == 'link') {
          this.linkEditPage(data, id);
        }
        this.queryRegion(data.orgFullIds.split('/'));
      },
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

  //是否：
  onChangeCheck = (e, type, typeVal) => {
    const status = e.target.checked;
    const { form } = this.props;
    this.setState({
      payInfo: {
        ...this.state.payInfo,
        [type]: e.target.checked,
      },
    });
  };
  //计算损失
  lossCal = (claimAmount, compensationAmount) => {
    //损失=索赔额(claimAmount)-赔付额
    let lossCost = 0;
    lossCost = (Number(claimAmount) - Number(compensationAmount)).toFixed(2);
    return lossCost;
  };
  onChangeMoney = (val, type, num) => {
    const { form } = this.props;
    this.setState(
      {
        payInfo: {
          ...this.state.payInfo,
          [type]: val,
        },
      },
      () => {
        if (num == 'num') {
          const {
            payInfo: { claimAmount, compensationAmount },
          } = this.state;
          const lossCost = this.lossCal(claimAmount || 0, compensationAmount || 0);
          this.setState({
            payInfo: {
              ...this.state.payInfo,
              lossCost,
            },
          });
          // form.setFieldsValue({ lossCost });
        }
      }
    );
  };

  //是自定义搜索
  onFocus = () => {
    // this._input.blur();
  };
  onCancel = values => {
    this.setState({ auths: values });
  };
  getValue = values => {
    this.setState({
      auths: values,
    });
  };
  // getValueCar = values => {
  //   this.setState({
  //     cars: values,
  //   });
  // };

  onRegionChange = (keys, values) => {
    this.setState({ selected: keys });
  };

  //获取子组件的值：
  //更新跟进人：
  updatefollowupPerson = auths => {
    const _auths = [{ id: auths[0].id }];
    this.setState({
      auths: _auths,
    });
  };
  getSelectedRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  getSelectedRowsPay = rows => {
    this.setState({
      selectedRowsPay: rows,
    });
  };

  //处理完成：
  handleFish = id => {
    const {
      dispatch,
      abnormal: { detail },
    } = this.props;
    const panel = detail[id];
    const _this = this;
    // console.log('panel', panel);
    if (
      panel &&
      (panel.level == '待定' || panel.level == 'LEVEL_DETERMINED') &&
      !panel.longTermSolutions
    ) {
      prompt({
        content: '"级别"不能为待定状态，"长期解决方案"不能为空',
        title: '温馨提示',
        duration: null,
        type: 'warn',
      });
      return;
    }
    if (panel && (panel.level == '待定' || panel.level == 'LEVEL_DETERMINED')) {
      prompt({
        content: '"级别"不能为待定状态',
        title: '温馨提示',
        duration: null,
        type: 'warn',
      });
      return;
    }
    if (panel && !panel.longTermSolutions) {
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
            _this.dispatchFun('abnormal/abnormalList', {});
          },
        });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };

  onSearchSelect = selectedSearch => {
    this.setState({
      selectedSearch,
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
  getCustomerName = values => {
    this.setState({
      customNames: values,
    });
  };
  render() {
    const columns = [
      {
        title: '区域名称',
        dataIndex: 'name',
      },
    ];
    const {
      list,
      type,
      form: { getFieldDecorator },
      abnormal: { detail, abnormalInfoList, abnormalInfoPayList, userList },
      loading,
      dictObject,
      match: { params },
    } = this.props;
    const detailId = params.id;
    const {
      activeKey,
      fileList,
      fileList_short,
      fileList_long,
      visible,
      visiblePay,
      visibleFile,
      listType,
      addType,
      showRecord,
      currentUser,
      auths,
      selectedRows,
      selectedRowsPay,
      saveBtn,
      // cars,
      payInfo,
      customNames,
    } = this.state;
    const data_handle = abnormalInfoList[detailId] ? abnormalInfoList[detailId] : {};
    const data_pay = abnormalInfoPayList[detailId] ? abnormalInfoPayList[detailId] : {};
    const panel = detail[detailId];

    const columns1 = [
      {
        title: '登录账号',
        dataIndex: 'loginName',
        width: '50%',
      },
      {
        title: '用户名',
        dataIndex: 'sysName',
        width: '50%',
      },
      // {
      //   title: '所属业务组织',
      //   dataIndex: 'orgName',
      //   width: '33.3%',
      // },
    ];

    const customerColumn = [
      {
        title: '名称',
        dataIndex: 'customerName',
        // width: '70%',
      },
      // {
      //   title: 'code',
      //   dataIndex: 'customerCode',
      // },
      // {
      //   title: '所属业务组织',
      //   dataIndex: 'orgName',
      //   width: '33.3%',
      // },
    ];
    // console.log('detailId', detailId);
    const curStateVal = panel
      ? panel.currentState == 'CLOSED' || panel.currentState == '已关闭' || !saveBtn
        ? true
        : false
      : '';
    const curStateBtn = panel
      ? panel.currentState == 'CLOSED' || panel.currentState == '已关闭'
        ? true
        : false
      : '';
    const genExtraBasicInfo = () => (
      <div className={styles.headerTitle}>
        <span>{panel ? panel.questionNumber : '新增异常'}</span>
        <div>
          {saveBtn ? (
            <>
              <Button.Group>
                <AdButton
                  type="primary"
                  onClick={e => this.operatePaneButton(e, 'save')}
                  disabled={curStateBtn}
                  text="保存"
                  code={panel ? codes.edit : codes.add}
                />
              </Button.Group>
              {detailId && (
                <AdButton
                  onClick={e => this.operatePaneButton(e, 'cancel')}
                  disabled={curStateBtn}
                  text="取消"
                  style={{ marginLeft: 8 }}
                  code={panel ? codes.edit : codes.add}
                />
              )}
            </>
          ) : (
            <Button.Group>
              {detailId && (
                <AdButton
                  onClick={() => this.handleFish(detailId)}
                  disabled={curStateBtn}
                  text="处理完成"
                  code={codes.finish}
                />
              )}
              <AdButton
                type="primary"
                onClick={e => this.operatePaneButton(e, 'edit')}
                disabled={curStateBtn}
                text="编辑"
                code={panel ? codes.edit : codes.add}
              />
            </Button.Group>
          )}
        </div>
      </div>
    );
    const prefixSelector = getFieldDecorator('currencyType', {
      initialValue: panel ? panel.currencyType : 'CNY',
    })(
      <Select disabled={!saveBtn} style={{width: 90 }}>
        {dictObject[allDictList.currencyType] &&
          dictObject[allDictList.currencyType].map(item => (
            <Option key={item.code}>{item.value}</Option>
          ))}
      </Select>
    );

    const abnormalInfoParams = {
      id: detailId,
      type: 'list',
      currentUser,
      columns1,
      loading,
      addType,
      // showDetail: this.showDetail,
      handleCancel: this.abnormalInfoHandleCancel,
    };
    //级别说明：
    const levelTips = (
      <span>
        级别
        <sup>
          <Tooltip
            placement="right"
            title={
              dictObject[allDictList.ems_level] &&
              dictObject[allDictList.ems_level].map(v => {
                return (
                  <div>
                    <span style={{ color: '#ff8d00' }}>{v.value}</span>：{v.remarks}
                  </div>
                );
              })
            }
          >
            <Icon type="question-circle" style={{ fontSize: 16, color: '#085df9' }} />
          </Tooltip>
        </sup>
      </span>
    );

    const _auths = auths && auths.length > 0 ? auths : currentUser;
    // const customN =
    //   customNames && customNames.length > 0
    //     ? customNames
    //     : panel
    //     ? [{ id: panel.mdsCustomerId }]
    //     : [];

    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };
    return (
      <div className={styles.CollapseUpdate}>
        <PageHeaderWrapper title={genExtraBasicInfo()}>
          <Collapse activeKey={activeKey} onChange={key => this.callback(key)} bordered={false}>
            <Panel header="基础信息" className={styles.customPanelStyle} key="1">
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="异常原因类别">
                        {getFieldDecorator('questionCauseType', {
                          rules: [{ required: true, message: '请选择' }],
                          initialValue: panel ? panel.questionCauseType : undefined,
                        })(
                          <Select disabled={!saveBtn}>
                            {dictObject[allDictList.abnormalCauseType] &&
                              dictObject[allDictList.abnormalCauseType].map(item => (
                                <Option key={item.code}>{item.value}</Option>
                              ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="异常标题">
                        {getFieldDecorator('questionTitle', {
                          rules: [
                            { required: true, message: '请选择' },
                            {
                              validator: (rule, value, callback) =>
                                checkStrLength(rule, value, callback, 300, '异常标题'),
                            },
                          ],
                          initialValue: panel ? panel.questionTitle : '',
                        })(<Input  disabled={!saveBtn} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="类别">
                        {getFieldDecorator('type', {
                          rules: [{ required: true, message: '请选择' }],
                          rules: [{ required: true, message: '请选择' }],
                          initialValue: panel ? panel.type : undefined,
                        })(
                          <Select disabled={!saveBtn}>
                            {dictObject[allDictList.ems_catetory] &&
                              dictObject[allDictList.ems_catetory].map(item => (
                                <Option key={item.code}>{item.value}</Option>
                              ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col} sm={24}>
                      <Form.Item label="负责区域">
                        {getFieldDecorator('mdsOrgIds', {
                          rules: [{ required: true, message: '请选择' }],
                          initialValue: this.state.selectedSearch
                            ? this.state.selectedSearch
                            : panel && panel.orgFullIds
                            ? panel.orgFullIds.split(',').map((item, index) => {
                                return { id: item, fullName: panel.orgFullName.split(',')[index] };
                              })
                            : undefined,
                        })(
                          <SearchSelect
                            dataUrl="ems/abnormal-info/selectAreaById"
                            selectedData={
                              this.state.selectedSearch
                                ? this.state.selectedSearch
                                : panel && panel.orgFullIds
                                ? panel.orgFullIds.split(',').map((item, index) => {
                                    return {
                                      id: item,
                                      fullName: panel.orgFullName.split(',')[index],
                                    };
                                  })
                                : undefined
                            } // 选中值
                            columns={columns} // 表格展示列
                            onChange={this.onSearchSelect} // 获取选中值
                            id="errAbnormal"
                            payload={{ id: '' }}
                            filterParent={true}
                            showValue="fullName"
                            disabled={!saveBtn}
                            expandRow={true}
                          />
                          // <Region
                          //   url="mds-organization/selectAreaById"
                          //   label="name"
                          //   selected={this.state.selected}
                          //   onChange={this.onRegionChange}
                          //   disabled={!saveBtn}
                          // />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={levelTips}>
                        {getFieldDecorator('level', {
                          rules: [{ required: true, message: '请选择' }],
                          initialValue: panel ? panel.level : undefined,
                        })(
                          <Select disabled={!saveBtn}>
                            {dictObject[allDictList.ems_level] &&
                              dictObject[allDictList.ems_level].map(item => (
                                <Option key={item.code}>{item.value}</Option>
                              ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>

                    <Col {..._col} sm={24}>
                      <Form.Item label="优先级">
                        {getFieldDecorator('priority', {
                          rules: [{ required: true, message: '请选择' }],
                          initialValue: panel ? panel.priority : undefined,
                        })(
                          <Select disabled={!saveBtn}>
                            {dictObject[allDictList.ems_priority] &&
                              dictObject[allDictList.ems_priority].map(item => (
                                <Option key={item.code}>{item.value}</Option>
                              ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="订单号">
                        {getFieldDecorator('orderId', {
                          rules: [
                            // { required: true, message: '请选择' },
                            {
                              validator: (rule, value, callback) =>
                                checkStrLength(rule, value, callback, 64, '订单号'),
                            },
                          ],
                          initialValue: panel ? panel.orderId : undefined,
                        })(
                          // <Select placeholder="请选择">
                          //   {dictObject['EMS_RESPONSIBILITY'] &&
                          //     dictObject['EMS_RESPONSIBILITY'].map(item => (
                          //       <Option key={item.code}>{item.value}</Option>
                          //     ))}
                          // </Select>
                          <Input  disabled={!saveBtn} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col} sm={24}>
                      <AntdFormItem
                        label="责任人"
                        code="liablePerson"
                        rules={[{ required: true, message: '请输入' }]}
                        initialValue={panel ? panel.liablePerson : ''}
                        getFieldDecorator={getFieldDecorator}
                      >
                        <AntdInput
                          maxlen={50}
                          label="责任人"
                          placeholder="输入的长度不超过50位"
                          disabled={!saveBtn}
                        />
                      </AntdFormItem>

                      {/* <Form.Item label="责任人">
                        {getFieldDecorator('liablePerson', {
                          rules: [
                            {
                              validator: (rule, value, callback) =>
                                checkStrLength(rule, value, callback, 50, '责任人'),
                            },
                          ],
                          initialValue: panel ? panel.liablePerson : '',
                        })(<Input  disabled={!saveBtn} />)}
                      </Form.Item> */}
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="客户">
                        {getFieldDecorator('customerName', {
                          initialValue: customNames,
                        })(
                          <SearchSelect
                            dataUrl="ems/abnormal-info/selectCustomerList"
                            url="ems/abnormal-info/selectCustomer" // selectedData只只有id时需要传url
                            selectedData={customNames} // 选中值
                            multiple={false} // 是否多选
                            showValue="customerName"
                            searchName="keyWord"
                            columns={customerColumn} // 表格展示列
                            onChange={this.getCustomerName} // 获取选中值
                            scrollX={240}
                            id="errAbnormal_customerName"
                            disabled={!saveBtn}
                            allowClear={true}
                          />
                          // <Input  disabled={!saveBtn} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col} sm={24}>
                      <Form.Item label="发生日期">
                        {getFieldDecorator('happenDate', {
                          rules: [{ required: true, message: '请选择' }],
                          initialValue:
                            panel && panel.happenDate
                              ? moment(panel.happenDate, dateFormat)
                              : moment(getNowFormatDate(), dateFormat),
                        })(<DatePicker style={{ width: '100%' }} disabled={!saveBtn} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="异常地点">
                        {getFieldDecorator('happenAddress', {
                          rules: [
                            {
                              validator: (rule, value, callback) =>
                                checkStrLength(rule, value, callback, 50, '异常地点'),
                            },
                          ],
                          initialValue: panel ? panel.happenAddress : '',
                        })(<Input  disabled={!saveBtn} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col} sm={24}>
                      <Form.Item label="车牌号">
                        {getFieldDecorator('cartPlateNo', {
                          initialValue: panel ? panel.cartPlateNo : '',
                        })(
                          <Input  disabled={!saveBtn} />
                          // <SearchSelect
                          //   dataUrl="ems/abnormal-info/selectVehicle"
                          //   url="ems/abnormal-info/selectVehicleView" // selectedData只只有id时需要传url
                          //   selectedData={cars} // 选中值
                          //   multiple={false} // 是否多选
                          //   showValue="cartPlateOneNo"
                          //   searchName="cartPlate"
                          //   columns={columnsCars} // 表格展示列
                          //   onChange={this.getValueCar} // 获取选中值
                          //   disabled={!saveBtn}
                          //   scrollX={480}
                          //   id="tmsOil_2"
                          //   allowClear={true}
                          // />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="破损数量">
                        {getFieldDecorator('damageCount', {
                          rules: [
                            {
                              validator: (rule, value, callback) =>
                                checkStrLength(rule, value, callback, 50, '破损数量'),
                            },
                          ],
                          initialValue: panel ? panel.damageCount : '',
                        })(<Input  disabled={!saveBtn} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="是否索赔">
                        {getFieldDecorator('beClaim', {
                          // initialValue: panel ? panel.beClaim : true,
                        })(
                          <Checkbox
                            disabled={!saveBtn}
                            checked={payInfo.beClaim}
                            onChange={e => this.onChangeCheck(e, 'beClaim', 'claimAmount')}
                          >
                            是
                          </Checkbox>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  {payInfo.beClaim && (
                    <div>
                      <Row gutter={_gutter}>
                        <Col {..._col}>
                          <AntdFormItem
                            label="索赔方"
                            code="claimant"
                            rules={[{ required: true, message: '请输入' }]}
                            initialValue={payInfo ? payInfo.claimant : ''}
                            getFieldDecorator={getFieldDecorator}
                          >
                            <AntdInput
                              label="索赔方"
                              
                              disabled={!saveBtn}
                              onChange={e => this.onChangeMoney(e, 'claimant')}
                            />
                          </AntdFormItem>
                        </Col>

                        <Col {..._col} sm={24}>
                          <AntdFormItem
                            label="索赔额(元)"
                            code="claimAmount"
                            rules={[{ required: true, message: '请输入' }]}
                            initialValue={payInfo ? payInfo.claimAmount : ''}
                            getFieldDecorator={getFieldDecorator}
                          >
                            <AntdInput
                              mode="money"
                              label="索赔额"
                              placeholder="输入的长度不超过18位最多可保留两位小数的数字"
                              addonBefore={prefixSelector}
                              disabled={!saveBtn}
                              onChange={e => this.onChangeMoney(e, 'claimAmount', 'num')}
                            />
                          </AntdFormItem>
                        </Col>
                      </Row>
                    </div>
                  )}

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="是否赔付">
                        {getFieldDecorator('beCompensation', {
                          // initialValue: panel ? panel.beCompensation : false,
                        })(
                          <Checkbox
                            disabled={!saveBtn}
                            checked={payInfo.beCompensation}
                            onChange={e => this.onChangeCheck(e, 'beCompensation', 'beComVal')}
                          >
                            是
                          </Checkbox>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  {payInfo.beCompensation && (
                    <div>
                      <Row gutter={_gutter}>
                        <Col {..._col}>
                          <AntdFormItem
                            label="赔付方"
                            code="compensationParty"
                            rules={[{ required: true, message: '请输入' }]}
                            initialValue={payInfo ? payInfo.compensationParty : ''}
                            getFieldDecorator={getFieldDecorator}
                          >
                            <AntdInput
                              label="赔付方"
                              
                              disabled={!saveBtn}
                              onChange={e => this.onChangeMoney(e, 'compensationParty')}
                            />
                          </AntdFormItem>
                        </Col>
                        <Col {..._col} sm={24}>
                          <AntdFormItem
                            label="赔付额(元)"
                            code="compensationAmount"
                            rules={[{ required: true, message: '请输入' }]}
                            initialValue={payInfo ? payInfo.compensationAmount : ''}
                            getFieldDecorator={getFieldDecorator}
                          >
                            <AntdInput
                              mode="money"
                              label="赔付额"
                              placeholder="输入的长度不超过18位最多可保留两位小数的数字"
                              addonBefore={prefixSelector}
                              disabled={!saveBtn}
                              onChange={e => this.onChangeMoney(e, 'compensationAmount', 'num')}
                            />
                          </AntdFormItem>
                        </Col>
                      </Row>
                    </div>
                  )}
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="损失(元)">
                        {getFieldDecorator('lossCost', {
                          initialValue: payInfo.lossCost ? payInfo.lossCost : '',
                        })(<Input addonBefore={prefixSelector} placeholder="" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="跟进人">
                        {getFieldDecorator('followupPersonId', {
                          initialValue: _auths,
                        })(
                          <SearchSelect
                            dataUrl="mds-user/selectList"
                            url="ems/abnormal-info/userViewDetails_s" // selectedData只只有id时需要传url
                            selectedData={_auths} // 选中值
                            multiple={false} // 是否多选
                            showValue="sysName"
                            searchName="keyWord"
                            columns={columns1} // 表格展示列
                            onChange={this.getValue} // 获取选中值
                            scrollX={240}
                            id="errAbnormal_2"
                            disabled={!saveBtn}
                            allowClear={true}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label="事件描述">
                        {getFieldDecorator('eventDescription', {
                          rules: [
                            { required: true, message: '' },
                            {
                              validator: (rule, value, callback) => {
                                checkStrLength(rule, value, callback, 2048, '事件描述');
                              },
                            },
                          ],
                          initialValue: panel ? panel.eventDescription : '',
                        })(<TextArea  rows={4} disabled={!saveBtn} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label="附件">
                        {getFieldDecorator('fileTokens', {
                          initialValue: fileList,
                        })(<FileReader disabled={!saveBtn} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Panel>
            <Panel key="2" header="解决方案" className={styles.customPanelStyle}>
              <Form layout="inline">
                <div className={styles.tableListForm}>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label="临时解决方案">
                        {getFieldDecorator('temporarySolutions', {
                          rules: [
                            {
                              validator: (rule, value, callback) =>
                                checkStrLength(rule, value, callback, 2048, '临时解决方案'),
                            },
                          ],
                          initialValue: panel ? panel.temporarySolutions : '',
                        })(
                          // <div className="edit_component" style={{ border: '1px solid #ccc' }}>
                          //   <BraftEditor
                          //     value={
                          //       editorState_short
                          //         ? editorState_short
                          //         : panel
                          //         ? panel.temporarySolutions.temporarySolutions.createEditorState(
                          //             htmlContent
                          //           )
                          //         : ''
                          //     }
                          //     onChange={val => this.handleEditorChange(val, 'editorState_short')}
                          //     contentStyle={{
                          //       height: 350,
                          //       boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)',
                          //     }}
                          //     controls={controls}
                          //   />
                          // </div>
                          <TextArea rows={4} disabled={!saveBtn} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label="附件">
                        {getFieldDecorator('fileTokens_short', {
                          initialValue: fileList_short,
                        })(<FileReader disabled={!saveBtn} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label="长期解决方案">
                        {getFieldDecorator('longTermSolutions', {
                          rules: [
                            {
                              validator: (rule, value, callback) =>
                                checkStrLength(rule, value, callback, 2048, '长期解决方案'),
                            },
                          ],
                          initialValue: panel ? panel.longTermSolutions : '',
                        })(
                          // <div className="edit_component" style={{ border: '1px solid #ccc' }}>
                          //   <BraftEditor
                          //     value={editorState_long}
                          //     onChange={val => this.handleEditorChange(val, 'editorState_long')}
                          //     contentStyle={{
                          //       height: 350,
                          //       boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)',
                          //     }}
                          //     controls={controls}
                          //   />
                          // </div>
                          <TextArea rows={4} disabled={!saveBtn} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label="附件">
                        {getFieldDecorator('fileTokens_long', {
                          initialValue: fileList_long,
                        })(<FileReader disabled={!saveBtn} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Form>
            </Panel>
            {showRecord && (
              <Panel
                key="3"
                header="跟进记录"
                className={styles.customPanelStyle}
                extra={
                  <>
                    <AdButton
                      type="danger"
                      onClick={e => this.delRecord(e)}
                      disabled={selectedRows.length > 0 ? false : true}
                      text="删除"
                      ghost
                      code={codes.deleteFollow}
                    />

                    <AdButton
                      type="primary"
                      onClick={e => this.addabnormalInfo(e, 'visible')}
                      disabled={curStateVal}
                      text="新增跟进"
                      style={{ marginLeft: 8 }}
                      code={codes.addFollow}
                    />
                  </>
                }
              >
                <AbnormalInfo
                  {...abnormalInfoParams}
                  visible={visible}
                  listType={listType}
                  data={data_handle}
                  updatefollowupPerson={this.updatefollowupPerson.bind(this)}
                  getSelectedRows={this.getSelectedRows}
                  curStateVal={curStateVal}
                  // change={this.handleStandardTableChange}
                />
              </Panel>
            )}

            {showRecord && (
              <Panel
                key="4"
                header="收付款记录"
                className={styles.customPanelStyle}
                extra={
                  <>
                    <AdButton
                      type="danger"
                      onClick={e => this.delRecord(e, 'pay')}
                      disabled={selectedRowsPay.length > 0 ? false : true}
                      text="删除"
                      ghost
                      code={codes.delectRecord}
                    />
                    <Button.Group style={{ marginLeft: 8 }}>
                      <AdButton
                        type="primary"
                        onClick={e => this.addabnormalInfo(e, 'visiblePay', 'rec')}
                        disabled={curStateVal}
                        text="新增收款"
                        code={codes.addCollection}
                      />

                      <AdButton
                        type="primary"
                        onClick={e => this.addabnormalInfo(e, 'visiblePay', 'pay')}
                        disabled={curStateVal}
                        text="新增付款"
                        code={codes.addPayment}
                      />
                    </Button.Group>
                  </>
                }
              >
                <AbnormalInfoPay
                  {...abnormalInfoParams}
                  visible={visiblePay}
                  listType={listType}
                  data={data_pay}
                  getSelectedRows={this.getSelectedRowsPay}
                  curStateVal={curStateVal}
                  // change={this.handleStandardTableChangePay}
                />
              </Panel>
            )}
          </Collapse>
        </PageHeaderWrapper>
      </div>
    );
  }
}
