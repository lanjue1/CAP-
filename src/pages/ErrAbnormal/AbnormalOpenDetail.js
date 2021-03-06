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
        //????????????
        dispatch({
            type: 'abnormal/checkLogin',
            payload: {},
            callback: res => {
                this.setState({
                    currentUser: [{ id: res.id }],
                });
            },
        });
        //?????????
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
                this.getFileList(params.id, 'ABNORMAL_INFO', 'fileList'); //??????????????????
                this.getFileList(params.id, 'TEMP_ORARY', 'fileList_short'); //????????????????????????
                this.getFileList(params.id, 'LONG_TERM', 'fileList_long'); //????????????????????????
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

    // ???????????????
    callback = key => {
        this.setState({
            activeKey: key,
        });
    };

    // ????????????
    // abnormalInfoHandleCancel = () => {
    //   this.setState({ abnormalInfoModalVisible: false });
    // };
    abnormalInfoModalCancel = () => {
        this.setState({ visible: false, visiblePay: false });
    };

    // ????????????
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
    // ????????????????????????
    addabnormalInfo = (e, type, addType) => {
        e.stopPropagation();
        this.setState({ [type]: true, listType: type, addType });
    };
    //??????????????????
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
    //????????????????????????
    //??????????????????
    updatefollowupPerson = auths => {
        // console.log('?????????????????????val===', auths);
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
            (details.level == '??????' || details.level == 'LEVEL_DETERMINED') &&
            !details.longTermSolutions
        ) {
            prompt({
                content: '"??????"????????????????????????"??????????????????"????????????',
                title: '????????????',
                duration: null,
                type: 'warn',
            });
            return;
        }
        if ((details && details.level == '??????') || details.level == 'LEVEL_DETERMINED') {
            prompt({
                content: '"??????"?????????????????????',
                title: '????????????',
                duration: null,
                type: 'warn',
            });
            return;
        }
        if (!details.longTermSolutions) {
            prompt({
                content: '"??????????????????"????????????',
                title: '????????????',
                duration: null,
                type: 'warn',
            });
            return;
        }
        confirm({
            title: '????????????',
            content: '???????????????????????????????????????????????????????????????',
            okText: '??????',
            cancelText: '??????',
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

    // ?????? ????????????
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
        const curStateVal = curState == 'CLOSED' || curState == '?????????' ? true : false;
        const data_handle = abnormalInfoList[id] ? abnormalInfoList[id] : {};
        const data_pay = abnormalInfoPayList[id] ? abnormalInfoPayList[id] : {};
        const columns1 = [
            {
                title: '????????????',
                dataIndex: 'loginName',
                width: '50%',
            },
            {
                title: '?????????',
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
        //????????????:
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
            { key: 'questionNumber', name: '????????????' },
            { key: currentState, name: '??????', isConst: true },
            { key: questionCauseType, name: '??????????????????', isConst: true },
            { key: 'questionTitle', name: '????????????' },
            { key: typeAb, name: '??????', isConst: true },
            { key: 'orgFullName', name: '????????????' },
            { key: level, name: '??????', isConst: true },
            { key: priority, name: '?????????', isConst: true },
            { key: 'orderId', name: '?????????' },
            { key: 'liablePerson', name: '?????????' },
            { key: 'customerName', name: '??????' },
            { key: 'happenAddress', name: '????????????' },
            { key: 'cartPlateNo', name: '?????????' },
            { key: 'damageCount', name: '????????????' },
            { key: 'beClaim', name: '????????????', isFormat: true },
            { key: 'claimant', name: '?????????' },
            { key: claimAmount, name: '?????????(???)', isConst: true },
            { key: 'beCompensation', name: '????????????', isFormat: true },
            { key: 'compensationParty', name: '?????????' },
            { key: compensationAmount, name: '?????????(???)', isConst: true },
            { key: lossCost, name: '??????(???)', isConst: true },
            { key: 'happenDate', name: '????????????' },
            {
                key: 'followupPersonId',
                name: '?????????',
                isOnlyRead: true,
                url: 'ems/open/selectUserViewDetails',
            },
            { key: 'eventDescription', name: '????????????', isRow: true },
            { key: 'attachments', name: '??????', isRow: true, isFile: fileList },
        ];

        const fields1 = [
            { key: 'temporarySolutions', name: '??????????????????', isRow: true, isHtml: true },
            { key: 'attachments', name: '??????', isRow: true, isFile: fileList_short },
            { key: 'longTermSolutions', name: '??????????????????', isRow: true, isHtml: true },
            { key: 'attachments', name: '??????', isRow: true, isFile: fileList_long },
        ];

        return (
            <div className={styles.CollapseDetails} style={{ background: 'white' }}>
                <Collapse activeKey={activeKey} onChange={key => this.callback(key)} bordered={false}>
                    <Panel
                        header="????????????"
                        key="1"
                        className={styles.customPanelStyle}
                    // extra={
                    //   <Button.Group>
                    //     <AdButton
                    //       onClick={() => this.handleFish()}
                    //       disabled={curStateVal}
                    //       text="????????????"
                    //       code={codes.finish}
                    //     />
                    //     <AdButton
                    //       onClick={this.handleEdit}
                    //       disabled={curStateVal}
                    //       text="??????"
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
                    <Panel header="????????????" key="2" className={styles.customPanelStyle}>
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
                        header="????????????"
                        key="3"
                        className={styles.customPanelStyle}
                    // extra={
                    //   <Button.Group>
                    //     <AdButton
                    //       type="danger"
                    //       onClick={e => this.delRecord(e)}
                    //       disabled={selectedRows.length > 0 ? false : true}
                    //       text="??????"
                    //       code={codes.deleteFollow}
                    //     />

                    //     <AdButton
                    //       type="primary"
                    //       onClick={e => this.addabnormalInfo(e, 'visible')}
                    //       disabled={curStateVal}
                    //       text="????????????"
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
                        header="???????????????"
                        key="4"
                        className={styles.customPanelStyle}
                    // extra={
                    //   <Button.Group>
                    //     <AdButton
                    //       type="danger"
                    //       onClick={e => this.delRecord(e, 'pay')}
                    //       disabled={selectedRowsPay.length > 0 ? false : true}
                    //       text="??????"
                    //       code={codes.delectRecord}
                    //     />

                    //     <AdButton
                    //       type="primary"
                    //       onClick={e => this.addabnormalInfo(e, 'visiblePay', 'rec')}
                    //       disabled={curStateVal}
                    //       text="????????????"
                    //       code={codes.addCollection}
                    //     />

                    //     <AdButton
                    //       type="primary"
                    //       onClick={e => this.addabnormalInfo(e, 'visiblePay', 'pay')}
                    //       disabled={curStateVal}
                    //       text="????????????"
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
