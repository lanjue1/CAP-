import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Collapse, Form, Input, Select, } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from '@/pages/Operate.less';
import { Columns, codes, Status } from './utils';
import DetailsList from '@/components/DetailsList';
import SelectForm from '@/components/SelectForm';
import TableButtons from '@/components/TableButtons';
import DeliveryFormModal from './component/DeliveryFormModal'
import { transferLanguage, columnConfiguration } from '@/utils/utils';
import AdButton from '@/components/AdButton';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ asn, common, component, loading, i18n }) => ({
  asn,
  dictObject: common.dictObject,
  asnDetails:asn.asnDetails,
  asnDetailsList:asn.asnDetailsList,
  id: asn.id,
  loading: loading.models.asn,
  searchValue: component.searchValue,
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
      activeKey: ['1','2'],
      showRecord: true, //init:false
      senders: [],
      disabled: false,
      beUseRule: true,
      requestTypeList: [],
      expandForm: false,
      formValues: {},
      modalVisible: false,
      columns: []
    };
  }
  className = 'asn';

  componentDidMount() {
    const { match, form, dispatch, language } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      showRecord: true,
    });
    if (ID) {
      this.getSelectDetails(ID);
      this.getAsnDetailsList({ asnId: ID })
    } else {
      form.resetFields();
    }

    this.setState({
      columns: columnConfiguration(Columns, language)
    })
  }
  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'asn/asnDetails',
      payload: { id: ID },
    });
    
  };

  getAsnDetailsList = (params = {}) => {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: 'asn/fetchAsnDetailsList',
      payload: params,
      callback: data => {
        if (!data) return;
        let valueList = [];
      },
    });
  }

  callback = key => {
    this.setState({
      activeKey: key,
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

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    let ids = [];
    if (this.state.selectedRows.length > 0 && rows.length > 0) {
      rows = rows.filter(v => v.id !== this.state.selectedRows[0].id)
    }
    this.setState({
      selectedRows: rows,
      checkIds: rows[0]?.id,
    });
  };

  onRef = ref => {
    this.child = ref;
  };

  getValue = values => {
    const { senders } = this.state;
    this.setState({
      senders: values,
    });
  };
  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.getAsnDetailsList({ asnId: this.state.currentId });
  };
  //查询
  handleSearch = values => {
    const { ...value } = values;
    this.setState({
      formValues: value,
    });
    this.getAsnDetailsList({ ...value, asnId: this.state.currentId });
  };

  //收货登记
  deliveryRecord = () => {
    this.props.dispatch({
      type: 'asn/fetchDeliveryDetails',
      payload: { id: this.state.checkIds },
      callback: () => {
        this.setState({ modalVisible: true })
      }
    });
  }

  // 分页操作：改参数
  handleStandardTableChange = param => {
    console.log('param???',param)
    const { dispatch } = this.props;
    const { formValues, currentId } = this.state;
    const params = {
      ...formValues,
      ...param,
      asnId: currentId
    };
    this.getAsnDetailsList(params);
  };

  render() {
    const {
      selectedRowKeys,
      selectedRows,
      visible,
      previewImage,
      fileList,
      papersDetails,
      cars,
      showRecord,
      senders,
      disabled,
      expandForm,
      checkIds,
      modalVisible,
      columns
    } = this.state;
    const {
      asnDetails,
      asnDetailsList,
      form: { getFieldDecorator },
      form,
      dictObject,
      match: { params },
      showType,
      loading,
      isMobile,
      language
    } = this.props;
    const currentId = params.id;
    let selectDetails = asnDetails[currentId];
    let selectDetailList=asnDetailsList[currentId];
    const checkDisabled = selectDetails ? true : false;
    const firstFormItem = (
      <FormItem label="partNo">
        {getFieldDecorator('partNo')(<Input />)}
      </FormItem>
    );
    const secondFormItem = (
      <FormItem label="Stutas">
        {getFieldDecorator('status')(
          <Select placeholder="请选择" style={{ width: '100%' }} allowClear={true}>
            {/* <Option value="">请选择</Option> */}
            {Status.map(v => {
              return <Option value={v.code}>{v.value}</Option>;
            })}
          </Select>
        )}
      </FormItem>
    );


    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      form,
      className: this.className,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      toggleForm: this.toggleForm,
      quickQuery: true
    };
    const tableButtonsParams = {
      show: true,
      // handleAdd: this.handleAdd,
      rightButtons: (
        <AdButton
        text={transferLanguage('ASNDetail.button.receive', language)}
        code={codes.detailReceive}
          onClick={this.deliveryRecord}
          disabled={selectedRows.length > 0 ? false : true}
        />
        
      ),
      selectedRows: selectedRows,
    };
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails?.asnNo}</span>
      </div>
    );
    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };

    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };
    const fields = [
      { key: 'asnNo', name: transferLanguage('ASNDetail.field.ASNNo', language) },
      { key: 'status', name: transferLanguage('ASN.field.status', language) },
      { key: 'orderType', name: transferLanguage('ASN.field.orderType', language) },
      { key: 'forwarder', name: transferLanguage('ASN.field.forwarder', language) },
      { key: 'shipFromWmCode', name: transferLanguage('ASN.field.shipFromWmCode', language) },
      { key: 'planPieceQty', name: transferLanguage('ASN.field.planPieceQty', language) },
      { key: 'openPieceQty', name: transferLanguage('ASN.field.openQty', language) },
      { key: 'bolNo', name: transferLanguage('ASN.field.bolNo', language) },
      { key: 'awb', name: transferLanguage('ASN.field.AWB', language) },

      { key: 'estimateArrivalTime', name: transferLanguage('ASN.field.estimateArrivalTime', language) },
      { key: 'realArrivalTime', name: transferLanguage('ASN.field.realArrivalTime', language) },
      { key: 'requiredReceiveTimeFrom', name: transferLanguage('ASN.field.requiredReceiveTimeFrom', language) },
      { key: 'requiredReceiveTimeTo', name: transferLanguage('ASN.field.requiredReceiveTimeTo', language) },

      { key: 'createBy', name: transferLanguage('ASN.field.createBy', language) },
      { key: 'createTime', name: transferLanguage('ASN.field.createTime', language) },
      { key: 'updateBy', name: transferLanguage('ASN.field.updateBy', language) },
      { key: 'updateTime', name: transferLanguage('ASN.field.updateTime', language) },
    ];

    const detailsFields = [
      { key: 'totalGrossWeight', name: transferLanguage('ASNDetail.field.grossWeight', language) },
      { key: 'totalNetWeight', name: transferLanguage('ASNDetail.field.netWeight', language) },
      { key: 'totalVolume', name: transferLanguage('ASNDetail.field.volume', language) },
      { key: 'arrivedPieceQty', name: transferLanguage('ASNDetail.field.arrivedPalletQty', language) },
      { key: 'planPieceQty', name: transferLanguage('ASNDetail.field.planPieceQty', language) },
      { key: 'estimateArrivalTime', name: transferLanguage('ASN.field.estimateArrivalTime', language) },
      { key: 'realArrivalTime', name: transferLanguage('ASN.field.realArrivalTime', language) },
      { key: 'requiredReceiveTimeFrom', name: transferLanguage('ASN.field.requiredArrivalTimeFrom', language) },
      { key: 'requiredReceiveTimeTo', name: transferLanguage('ASN.field.requiredArrivalTimeTo', language) },
      { key: 'createTime', name: transferLanguage('ASN.field.createTime', language) },
    ]
    const deliveryParams = {
      visible: modalVisible,
      detailId: checkIds,
      warehouseId:selectDetails?.warehouseId,
      modalEmpty: () => this.setState({ modalVisible: false })
    }

    return (
      <div className={styles.CollapseUpdate}>
        <PageHeaderWrapper title={genExtraBasicInfo()}>
          <Collapse
            activeKey={this.state.activeKey}
            onChange={key => this.callback(key)}
            bordered={false}
          >
            <Panel header={transferLanguage('Common.field.baseInfo', language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <DetailsList isMobile={isMobile} detilsData={{ fields: fields, value: selectDetails }} />
              </div>
            </Panel>
            {/* <Panel header={transferLanguage('base.prompt.detailInfo', language)} key="2" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <DetailsList isMobile={isMobile} detilsData={{ fields: detailsFields, value: selectDetails }} />
              </div>
            </Panel> */}
            <Panel header={transferLanguage('ASNDetail.title.list', language)} key="2" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                {/* <SelectForm {...selectFormParams} /> */}
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={selectDetailList}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  hideDefaultSelections={true}
                  onPaginationChange={this.handleStandardTableChange}
                  expandForm={false}
                  code={codes.page}
                  hideCheckAll={true}
                />
              </div>
            </Panel>
          </Collapse>
        </PageHeaderWrapper>
        {modalVisible && <DeliveryFormModal {...deliveryParams} />}
      </div>
    );
  }
}
