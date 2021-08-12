import React, { Component } from 'react';
import { Collapse, Upload, Modal, Button } from 'antd';
import { connect } from 'dva';
import AbnormalInfo from './AbnormalInfo';
import AbnormalInfoPay from './AbnormalInfoPay';
import router from 'umi/router';
import classNames from 'classnames';
import AdButton from '@/components/AdButton';
import { codes, currentStateCode, recodeTypeCode } from './utils';
import DetailsList from '@/components/DetailsList';
import styles from '@/pages/Detail.less';
import { formatCodeVal } from '@/pages/Common/common';
import { queryDict } from '@/utils/common';
import { allDictList } from '@/utils/constans';

const Panel = Collapse.Panel;

@connect(({ abnormal, loading, component }) => ({
  abnormal,
  loading: loading.effects['abnormal/abnormalInfoList'],
  dictObject: component.dictObject,
}))
export default class AbnormalDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: ['1', '2', '3', '4'],
      id: 0,
      selectedRows: [],
      selectedRowsPay: [],
      visible: false,
      visiblePay: false,
      listType: 'handle',
      addType: 'pay',
      currentUser: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { id, dispatch } = nextProps;
    if (this.props.id !== id) {
      this.setState({ id });
      dispatch({
        type: 'abnormal/abnormalInfoList',
        payload: { id },
      });
      dispatch({
        type: 'abnormal/abnormalInfoPayList',
        payload: { id },
      });
    }
  }

  componentDidMount() {
    const {
      abnormal: { detail },
      id,
      dispatch,
    } = this.props;
    if (id) {
      this.setState({ id });
      dispatch({
        type: 'abnormal/abnormalInfoList',
        payload: { id },
      });
      dispatch({
        type: 'abnormal/abnormalInfoPayList',
        payload: { id },
      });
    }
    //当前用户
    dispatch({
      type: 'abnormal/checkLogin',
      payload: {},
      callback: res => {
        this.setState({
          currentUser: [{ id: res.id }],
        });
      },
    });
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

  dispatchFun(type, params) {
    const { dispatch } = this.props;
    dispatch({
      type: type,
      payload: params,
    });
  }

  // 操作收缩框
  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  // 取消明细
  // abnormalInfoHandleCancel = () => {
  //   this.setState({ abnormalInfoModalVisible: false });
  // };
  abnormalInfoModalCancel = () => {
    this.setState({ visible: false, visiblePay: false });
  };

  // 明细分页
  handleStandardTableChange = param => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.props.dispatch({
      type: 'abnormal/abnormalList',
      payload: params,
    });
  };
  // 点击新增跟进记录
  addabnormalInfo = (e, type, addType) => {
    e.stopPropagation();
    this.setState({ [type]: true, listType: type, addType });
  };
  //删除跟进记录
  delRecord = (e, type) => {
    e.stopPropagation();
    // console.log('type', type);
    const { id, dispatch } = this.props;
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
        if (type) {
          this.setState({
            selectedRowsPay: [],
          });
        } else {
          this.setState({
            selectedRows: [],
          });
        }
        this.dispatchFun(_urlList, { id });
      },
    });
  };
  //获取子组件的值：
  //更新跟进人：
  updatefollowupPerson = auths => {
    // console.log('获取子组件的值val===', auths);
    this.setState({
      auths,
    });
  };
  getSelectedRows = rows => {
    // console.log('rows', rows);
    this.setState({
      selectedRows: rows,
    });
  };
  getSelectedRowsPay = rows => {
    // console.log('getSelectedRowsPay====rows', rows);
    this.setState({
      selectedRowsPay: rows,
    });
  };

  render() {
    const {
      list,
      type,
      abnormal: { detail, abnormalInfoList, abnormalInfoPayList },
      loading,
      isMobile,
      file: { fileList, fileList_short, fileList_long },
      curStateVal,
      dictObject,
    } = this.props;
    const {
      id,
      activeKey,
      selectedRows,
      selectedRowsPay,
      visible,
      visiblePay,
      listType,
      addType,
      currentUser,
    } = this.state;

    const data_handle = abnormalInfoList[id] ? abnormalInfoList[id] : {};
    const data_pay = abnormalInfoPayList[id] ? abnormalInfoPayList[id] : {};
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
    ];
    const abnormalInfoParams = {
      id,
      type: 'list',
      currentUser,
      columns1,
      loading,
      addType,
      // showDetail: this.showDetail,
      change: this.handleStandardTableChange,
      handleCancel: this.abnormalInfoModalCancel,
    };
    const panel = detail[id];
    //损失计算:
    const claimAmount =
      panel && Number(panel.claimAmount) !== 0 ? Number(panel.claimAmount).toFixed(2) : 0;
    const compensationAmount =
      panel && Number(panel.compensationAmount) !== 0
        ? Number(panel.compensationAmount).toFixed(2)
        : 0;
    let lossCost = panel
      ? (Number(panel.claimAmount) - Number(panel.compensationAmount)).toFixed(2)
      : '';
    lossCost = Number(lossCost) !== 0 ? lossCost : 0;
    const typeAb = panel ? formatCodeVal(dictObject[allDictList.ems_catetory], panel.type) : '';
    const level = panel ? formatCodeVal(dictObject[allDictList.ems_level], panel.level) : '';
    const priority = panel
      ? formatCodeVal(dictObject[allDictList.ems_priority], panel.priority)
      : '';
    const currentState = panel ? formatCodeVal(currentStateCode, panel.currentState) : '';
    const questionCauseType = panel
      ? formatCodeVal(dictObject[allDictList.abnormalCauseType], panel.questionCauseType)
      : '';

    const fields = [
      { key: 'questionNumber', name: '异常编号' },
      { key: currentState, name: '状态', isConst: true },
      { key: questionCauseType, name: '异常原因类别', isConst: true },
      { key: 'questionTitle', name: '异常标题' },
      { key: typeAb, name: '类别', isConst: true },
      { key: 'orgFullName', name: '负责区域' },
      { key: level, name: '级别', isConst: true },
      { key: priority, name: '优先级', isConst: true },
      { key: 'orderId', name: '订单号' },
      { key: 'liablePerson', name: '责任人' },
      { key: 'customerName', name: '客户' },
      { key: 'happenAddress', name: '异常地点' },
      { key: 'cartPlateNo', name: '车牌号' },
      { key: 'damageCount', name: '破损数量' },
      { key: 'beClaim', name: '是否索赔', isFormat: true },
      { key: 'claimant', name: '索赔方' },
      { key: claimAmount, name: '索赔额(元)', isConst: true },
      { key: 'beCompensation', name: '是否赔付', isFormat: true },
      { key: 'compensationParty', name: '赔付方' },
      { key: compensationAmount, name: '赔付额(元)', isConst: true },
      { key: lossCost, name: '损失(元)', isConst: true },
      { key: 'happenDate', name: '发生日期' },
      {
        key: 'followupPersonId',
        name: '跟进人',
        isOnlyRead: true,
        url: 'ems/abnormal-info/userViewDetails_s',
      },
      { key: 'eventDescription', name: '事件说明', isRow: true },
      { key: 'attachments', name: '附件', isRow: true, isFile: fileList },
    ];

    const fields1 = [
      { key: 'temporarySolutions', name: '临时解决方案', isRow: true, isHtml: true },
      { key: 'attachments', name: '附件', isRow: true, isFile: fileList_short },
      { key: 'longTermSolutions', name: '长期解决方案', isRow: true, isHtml: true },
      { key: 'attachments', name: '附件', isRow: true, isFile: fileList_long },
    ];

    return (
      <div className={styles.CollapseDetails}>
        <Collapse activeKey={activeKey} onChange={key => this.callback(key)} bordered={false}>
          <Panel header="基础信息" key="1" className={styles.customPanelStyle}>
            <DetailsList
              isMobile={isMobile}
              detilsData={{
                fields: fields,
                value: panel,
                fileListEMS: true,
                actionName: '/server/api/ems/ems-attachment/uploadFile',
              }}
            />
          </Panel>
          <Panel header="解决方案" key="2" className={styles.customPanelStyle}>
            <DetailsList
              isMobile={isMobile}
              detilsData={{
                fields: fields1,
                value: panel,
                fileListEMS: true,
                actionName: '/server/api/ems/ems-attachment/uploadFile',
              }}
            />
          </Panel>
          <Panel
            header="跟进记录"
            key="3"
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
            />
          </Panel>
          <Panel
            header="收付款记录"
            key="4"
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
            />
          </Panel>
        </Collapse>
      </div>
    );
  }
}
