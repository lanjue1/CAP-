import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Col, Collapse, Form, Spin, Row, Select, } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '@/pages/Operate.less';
import AdButton from '@/components/AdButton';
import { codes, Status, PoTypeArr, SelectColumns } from "./utils";
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import TrackFormModal from './component/TrackFormModal';
import AdSelect from '@/components/AdSelect';
import SearchSelect from '@/components/SearchSelect';
import { transferLanguage } from '@/utils/utils';
import Prompt from '@/components/Prompt';
import DetailPage from '@/components/DetailPage';
import { formItemFragement, formatPrice } from '@/utils/common';


const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const Panel = Collapse.Panel;
@connect(({ trackOrder, common, loading, i18n }) => ({
  trackOrder,
  dictObject: common.dictObject,
  id: trackOrder.id,
  loading: loading.models.trackOrder,
  language: i18n.language
}))
@Form.create()
export default class TypeOperate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      currentId: '',
      selectedRows: [],
      visible: false,
      activeKey: ['1', '2'],
      showRecord: true, //init:false
      senders: [],
      disabled: true,
      beUseRule: true,
      requestTypeList: [],
      expandForm: false,
      modalVisible: false,
      checkIds: '',
      detailsId: '',
    };
  }

  className = 'trackOrderOperate';


  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      showRecord: true,
    });
    if (ID) {
      this.getSelectDetails(ID);
      this.getSelectDetailsList({ orderId: ID })
    } else {
      form.resetFields();
      this.setState({
        disabled: false
      })
    }
    this.changeTitle(SelectColumns, "_SelectColumns")

  }
  changeTitle = (param, params) => {
    let _columnsAllotOne = []
    _columnsAllotOne = param.map(v => {
      if (v.title) {
        v.title = transferLanguage(v.title, this.props.language)
      } else if (v.value) {
        v.value = transferLanguage(v.value, this.props.language)
      }
      return v
    })
    this.setState({
      [params]: _columnsAllotOne
    })
  }
  // 获取详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'trackOrder/trackOrderDetails',
      payload: { id: ID },
      callback: data => {
      },
    });
  };

  // 获取明细列表：
  getSelectDetailsList = payload => {
    this.props.dispatch({
      type: 'trackOrder/fetchTrackList',
      payload: payload,
    });
  };

  //删除轨迹
  delTrack = () => {
    const { checkIds } = this.state
    this.props.dispatch({
      type: 'trackOrder/deleteTrack',
      payload: { id: checkIds[0] },
      callback: () => {
        this.getSelectDetailsList({ orderId: this.state.currentId })
      }
    });
  }

  handleStandardTableChange = param => {
    this.getSelectDetailsList({
      ...param, orderId: this.state.currentId
    })
  };


  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  // 保存方法
  operatePaneButton = e => {
    e.stopPropagation();
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { senders, soCreateTime, ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        const { shipToWmCode, shipFromWmCode, billType, consigner, consignee } = this.state
        value.toCountryId = shipToWmCode[0]?.countryId;
        value.fromCountryId = shipFromWmCode[0]?.countryId;
        value.shipToWmCode = shipToWmCode[0]?.code;
        value.shipFromWmCode = shipFromWmCode[0].code;
        value.billTypeId = billType[0]?.id;
        value.soCreateTime = soCreateTime ? moment(soCreateTime).format(dateFormat) : ''
        value.consigner = consigner && consigner[0] ? consigner[0].code : ""
        value.consignee = consignee && consignee[0] ? consignee[0].code : ""
        if (params.id) {
          value.id = params.id;
          dispatch({
            type: 'trackOrder/trackOrderOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('trackOrder/trackOrderList', {});
              this.dispatchFun('trackOrder/trackOrderDetails', { id: params.id });
            },
          });
        } else {
          dispatch({
            type: 'trackOrder/trackOrderOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              // this.setState({ showRecord: true });
              this.setState({ currentId: res })
              dispatch({
                type: 'trackOrder/trackOrderDetails',
                payload: { id: res },
                callback: data => {
                  this.setState(preState => ({
                    disabled: !preState.disabled,
                  }));
                  // 新增变编辑页面：
                  dispatch({
                    type: 'common/setTabsName',
                    payload: {
                      id: res,
                      name: data.businessTypeCode,
                      isReplaceTab: true,
                    },
                    callback: result => {
                      if (result) {
                        router.push(`/order/listtrackOrder/edittrackOrder/${res}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('trackOrder/interfaceTypeList', {});
            },
          });
        }
      }
    });
  };

  // dispatch 方法
  dispatchFun(type, params) {
    const { dispatch } = this.props;
    dispatch({
      type: type,
      payload: params,
    });
  }

  // 明细查看详情
  showDetail = () => {
    this.setState({ visible: true });
  };

  // 明细关闭详情
  infoHandleCancel = () => {
    this.setState({ visible: false, visiblePay: false });
  };

  handleSelectRows = rows => {
    // console.log('选择', rows);
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

  onRef = ref => {
    this.child = ref;
  };

  getValue = (values, type) => {
    console.log('values, type', values, type)
    const { form: { setFieldsValue } } = this.props
    this.setState({
      [type]: values,
    });
    if (type == "shipFromWmCode") {
      setFieldsValue({
        fromCountryName: values[0]?.countryName
      })
    }
    if (type == "shipToWmCode") {
      setFieldsValue({
        toCountryName: values[0]?.countryName
      })
      console.log('?进来了shipFromWmCode', values[0]?.countryName)
    }
  };
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  modalEmpty = () => {
    const { currentId } = this.state
    this.setState({ modalVisible: false })
    this.getSelectDetails(currentId);
    this.getSelectDetailsList({ orderId: currentId })
  }
  addDetail = () => {
    const { currentId } = this.state
    if (currentId) {
      this.setState({ modalVisible: true, detailsId: '' })
    } else {
      Prompt({ content: transferLanguage('TrackList.prompt.saveBaseInfo', this.props.language), type: 'warn' })
    }

  }
  cancel = () => {
    this.setState({ modalVisible: false })
  }
  render() {
    const {
      selectedRows,
      disabled,
      modalVisible,
    } = this.state;
    const {
      trackOrder,
      trackOrder: { trackOrderDetails, TrackList },
      form: { getFieldDecorator },
      match: { params },
      loading,
      language,
    } = this.props;
    const currentId = params.id;
    const selectList = TrackList[currentId]
    console.log('selectList',trackOrder)
    let selectDetails = trackOrderDetails[currentId];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId && selectDetails.orderNo}</span>
      </div>
    );
    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };


    // 详情字段
    const TrackOrderColumns = [
      {
        title: '#',
        dataIndex: 'index',
        render: (text, record, index) => (<span>{index + 1}</span>),
        width: 50
      },
      // {
      //   // 标题
      //   title: transferLanguage('TrackList.field.eventCode', language),
      //   // 数据字段
      //   dataIndex: 'eventCode',
      //   render: (text, record) => (
      //     <a onClick={() => this.setState({ modalVisible: true, detailsId: record.id })} title={text}>
      //       {text}
      //     </a>
      //   ),
      //   width: 110

      // },
      {
        title: transferLanguage('TrackList.field.eventDesc', language),
        dataIndex: 'eventDesc',
        width: 180,
        render: (text, record) => (
              <a onClick={() => this.setState({ modalVisible: true, detailsId: record.id })} title={text}>
                {text}
              </a>
            ),
      },
      {
        title: transferLanguage('PoDetailList.field.eta', language),
        dataIndex: 'eta',
        render: text => <span title={text}>{text}</span>,
        width: 120
      },
      {
        title: transferLanguage('TrackOrderList.field.eventTime', language),
        dataIndex: 'eventTime',
        render: text => <span title={text}>{text}</span>,
        width: 120
      },
      {
        title: transferLanguage('TrackList.field.operator', language),
        dataIndex: 'operator',
        render: text => <span title={text}>{text}</span>,
        width: 80
      },
      {
        title: transferLanguage('TrackList.field.updateDate', language),
        dataIndex: 'updateTime',
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: transferLanguage('TrackList.field.remarks', language),
        dataIndex: 'remarks',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },

       {
        title: transferLanguage('TrackList.field.attachment', language),
        dataIndex: 'fileUrl',
        render: text => <span title={text}>{text}</span>,
        width: 130

      },
      
     
    ]
    const formItem = [
      [
        <DetailPage label={transferLanguage('TrackOrderList.field.orderNo', language)} value={selectDetails ? selectDetails.orderNo : '-'} />,
        <DetailPage label={transferLanguage("shipping.field.soNo", language)} value={selectDetails ? selectDetails.bizCode1 : '-'} />,
      ],
      [
        <DetailPage label={transferLanguage('TrackList.field.customerOrder1', language)} value={selectDetails ? selectDetails.customerOrder1 : '-'} />,
        <DetailPage label={transferLanguage('TrackList.field.customerOrder2', language)} value={selectDetails ? selectDetails.customerOrder2 : '-'} />,
      ],
      [
        <DetailPage label={transferLanguage('TrackList.field.customerOrder3', language)} value={selectDetails ? selectDetails.customerOrder3 : '-'} />,
        <DetailPage label={transferLanguage('TrackList.field.customerOrder4', language)} value={selectDetails ? selectDetails.customerOrder4 : '-'} />,
      ],
      [
        <DetailPage label={transferLanguage('TrackList.field.customerOrder5', language)} value={selectDetails ? selectDetails.customerOrder5 : '-'} />,
        <DetailPage label={transferLanguage('TrackList.field.updateStatus', language)} value={selectDetails ? selectDetails.updateStatus : '-'} />,
      ],
      [
        <DetailPage label={transferLanguage('PoDetailList.field.etd', language)} value={selectDetails ? selectDetails.etd : '-'} />,
        <DetailPage label={transferLanguage('trackOrderList.field.remarks', language)} value={selectDetails ? selectDetails.remarks : '-'} />,
      ],
      [
        <DetailPage label={transferLanguage('TrackOrderList.field.createDate', language)} value={selectDetails ? selectDetails.createTime : '-'} />,
        <DetailPage label={transferLanguage('TrackOrderList.field.updateBy', language)} value={selectDetails ? selectDetails.updateBy : '-'} />,
      ],
      [
        <DetailPage label={transferLanguage('TrackOrderList.field.updateDate', language)} value={selectDetails ? selectDetails.updateTime : '-'} />,
      ],
    ];


    const deliveryParams = {
      visible: modalVisible,
      detailId: currentId,
      detailsId: this.state.detailsId,
      modalEmpty: this.modalEmpty,
      cancel: this.cancel,
    };

    const tableButtonsParams = {
      show: true,
      handleAdd: this.addDetail,
      buttons: (
        <Button
          onClick={() => this.delTrack()}
          disabled={selectedRows.length !== 1}
        >
          {transferLanguage('TrackList.field.delTrack', language)}
        </Button>
      ),
      selectedRows: selectedRows,
    };


    return (
      <div className={styles.CollapseUpdate}>
        <PageHeaderWrapper title={genExtraBasicInfo()}>
          <Collapse
            activeKey={this.state.activeKey}
            onChange={key => this.callback(key)}
            bordered={false}
          >
            <Panel header={transferLanguage('Common.field.baseInfo', language)} key="1" style={customPanelStyle}>
              <Spin spinning={loading}> {formItemFragement(formItem)}</Spin>
            </Panel>
            <Panel header={transferLanguage('TrackOrderList.orderList.tracking', language)} key="2" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                {/* <TableButtons {...tableButtonsParams} /> */}
                <StandardTable
                  selectedRows={selectedRows}
                  // disabledRowSelected={true}
                  loading={loading}
                  data={selectList}
                  columns={TrackOrderColumns}
                  onSelectRow={this.handleSelectRows}
                  hideDefaultSelections={true}
                  onPaginationChange={this.handleStandardTableChange}
                  // expandForm={expandForm}
                  className={this.chassName}
                  code={codes.page}
                // hideCheckAll={true}
                />
              </div>
            </Panel>
          </Collapse>
        </PageHeaderWrapper>
        {modalVisible && <TrackFormModal {...deliveryParams} />}
      </div>
    );
  }
}
