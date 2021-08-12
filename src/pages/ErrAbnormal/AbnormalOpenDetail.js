import React, { Component } from 'react';
import { Collapse, Upload, Modal, Button } from 'antd';
import { connect } from 'dva';
import AbnormalInfo from './AbnormalInfo';
import AbnormalInfoPay from './AbnormalInfoPay';
import router from 'umi/router';
import classNames from 'classnames';
// import Media from 'react-media';
import AdButton from '@/components/AdButton';
import { codes, currentStateCode, recodeTypeCode } from './utils';
import DetailsList from '@/components/DetailsList';
import { formatCodeVal } from '@/pages/Common/common';
import styles from './index.less';
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
            fileList: [],
            fileList_short: [],
            fileList_long: [],
            id: 0,
            selectedRows: [],
            selectedRowsPay: [],
            visible: false,
            visiblePay: false,
            listType: 'handle',
            addType: 'pay',
            currentUser: [],
            curState: '',
        };
    }

    componentWillMount() {
        const {
            history: {
                location: { query },
            },
        } = this.props;
        if (query.token) {
            localStorage.setItem('openToken', query.token);
        }
        const allDict = [
            allDictList.ems_catetory,
            allDictList.ems_level,
            allDictList.ems_priority,
            allDictList.abnormalCauseType,
        ];
        queryDict({ props: this.props, allDict });
    }

    componentDidMount() {
        const {
            abnormal: { detail },
            id,
            dispatch,
            match: { params },
        } = this.props;

        const newId = params.id || id || 0;

        if (newId) {
            this.setState({ id: newId });
            this.dispatchFunOther('abnormal/abnormalDetail', { id: newId, type: 'open' });
            dispatch({
                type: 'abnormal/setId',
                payload: { id: newId },
            });
            dispatch({
                type: 'abnormal/abnormalInfoList',
                payload: { id: newId, type: 'open' },
            });
            dispatch({
                type: 'abnormal/abnormalInfoPayList',
                payload: { id: newId, type: 'open' },
            });
        }
        // dispatch({
        //   type: 'abnormal/userList',
        //   payload: {},
        //   // payload: { pageSize: 1000 },
        // });
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
        //币种：
        dispatch({
            type: 'common/querytDictByCode',
            payload: { code: 'currency-type' },
        });
    }

    dispatchFunOther(type, params) {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: type,
            payload: params,
            callback: data => {
                if (!data) return;
                this.setState({ curState: data.currentState });
                this.getFileList(params.id, 'ABNORMAL_INFO', 'fileList'); //异常差错附件
                this.getFileList(params.id, 'TEMP_ORARY', 'fileList_short'); //临时解决方案附件
                this.getFileList(params.id, 'LONG_TERM', 'fileList_long'); //长期解决方案附件
            },
        });
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

    // 明细翻页
    handleStandardTableChange = param => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
            type: 'open',
            ...formValues,
            ...param,
        };
        this.props.dispatch({
            type: 'abnormal/abnormalInfoList',
            payload: params,
        });
    };
    handleStandardTableChangePay = param => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
            type: 'open',
            ...formValues,
            ...param,
        };
        this.dispatchFun('abnormal/abnormalInfoPayList', params);
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

    getFileList = (id, fileBizType, fielListType) => {
        const _this = this;
        this.props.dispatch({
            type: 'abnormal/selectFileList',
            payload: {
                bizId: id,
                fileBizType,
                type: 'open',
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
                        _this.dispatchFunOther('abnormal/abnormalDetail', { id });
                        _this.dispatchFunOther('abnormal/abnormalList', formValues);
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

    // 跳转 编辑页面
    handleEdit = () => {
        const { id } = this.state;
        router.push(`/abnormal/abnormalList/edit-form/${id}`);
    };

    render() {
        const {
            list,
            type,
            abnormal: { detail, abnormalInfoList, abnormalInfoPayList },
            loading,
            // isMobile,
            // curStateVal,
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
            fileList,
            fileList_short,
            fileList_long,
            curState,
        } = this.state;
        const curStateVal = curState == 'CLOSED' || curState == '已关闭' ? true : false;
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
                url: 'ems/open/selectUserViewDetails',
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
            <div className={styles.CollapseDetails} style={{ background: 'white' }}>
                <Collapse activeKey={activeKey} onChange={key => this.callback(key)} bordered={false}>
                    <Panel
                        header="基础信息"
                        key="1"
                        className={styles.customPanelStyle}
                    // extra={
                    //   <Button.Group>
                    //     <AdButton
                    //       onClick={() => this.handleFish()}
                    //       disabled={curStateVal}
                    //       text="处理完成"
                    //       code={codes.finish}
                    //     />
                    //     <AdButton
                    //       onClick={this.handleEdit}
                    //       disabled={curStateVal}
                    //       text="编辑"
                    //       code={codes.edit}
                    //     />
                    //   </Button.Group>
                    // }
                    >
                        <DetailsList
                            // isMobile={isMobile}
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
                            // isMobile={isMobile}
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
                    // extra={
                    //   <Button.Group>
                    //     <AdButton
                    //       type="danger"
                    //       onClick={e => this.delRecord(e)}
                    //       disabled={selectedRows.length > 0 ? false : true}
                    //       text="删除"
                    //       code={codes.deleteFollow}
                    //     />

                    //     <AdButton
                    //       type="primary"
                    //       onClick={e => this.addabnormalInfo(e, 'visible')}
                    //       disabled={curStateVal}
                    //       text="新增跟进"
                    //       code={codes.addFollow}
                    //     />
                    //   </Button.Group>
                    // }
                    >
                        <AbnormalInfo
                            {...abnormalInfoParams}
                            visible={visible}
                            listType={listType}
                            data={data_handle}
                            displayMulticle={true}
                            updatefollowupPerson={this.updatefollowupPerson.bind(this)}
                            getSelectedRows={this.getSelectedRows}
                        // change={this.handleStandardTableChange}
                        />
                    </Panel>
                    <Panel
                        header="收付款记录"
                        key="4"
                        className={styles.customPanelStyle}
                    // extra={
                    //   <Button.Group>
                    //     <AdButton
                    //       type="danger"
                    //       onClick={e => this.delRecord(e, 'pay')}
                    //       disabled={selectedRowsPay.length > 0 ? false : true}
                    //       text="删除"
                    //       code={codes.delectRecord}
                    //     />

                    //     <AdButton
                    //       type="primary"
                    //       onClick={e => this.addabnormalInfo(e, 'visiblePay', 'rec')}
                    //       disabled={curStateVal}
                    //       text="新增收款"
                    //       code={codes.addCollection}
                    //     />

                    //     <AdButton
                    //       type="primary"
                    //       onClick={e => this.addabnormalInfo(e, 'visiblePay', 'pay')}
                    //       disabled={curStateVal}
                    //       text="新增付款"
                    //       code={codes.addPayment}
                    //     />
                    //   </Button.Group>
                    // }
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
                </Collapse>
            </div>
        );
    }
}
// export default props => (
//   <Media query="(max-width: 599px)">
//     {isMobile => <AbnormalDetail {...props} isMobile={isMobile} />}
//   </Media>
// );
