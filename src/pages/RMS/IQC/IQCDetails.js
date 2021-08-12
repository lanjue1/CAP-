import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Collapse, Form, Input, Select, } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from '@/pages/Operate.less';
import { ASNDetailsColumns, codes, Status } from './utils';
import { queryFileList, formatPrice } from '@/utils/common';
import DetailsList from '@/components/DetailsList';
import SelectForm from '@/components/SelectForm';
import TableButtons from '@/components/TableButtons';
import { transferLanguage, columnConfiguration } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ iqc, common, component, loading, i18n }) => ({
  iqc,
  dictObject: common.dictObject,
  id: iqc.id,
  loading: loading.models.iqc,
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
      activeKey: ['1', '2', '3'],
      showRecord: true, //init:false
      senders: [],
      disabled: false,
      beUseRule: true,
      requestTypeList: [],
      expandForm: false,
      formValues: {},
      modalVisible: false,
      columns: [],
      fileList: [],
    };
  }
  className = 'iqc';

  componentDidMount() {
    const { match, form, dispatch, language } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      showRecord: true,
    });
    if (ID) {
      this.getSelectDetails(ID);
    } else {
      form.resetFields();
    }

    this.setState({
      columns: columnConfiguration(ASNDetailsColumns, language)
    })
  }

  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'iqc/asnDetails',
      payload: { id: ID },
    });
    this.getAsnDetailsList({ id: ID })
    this.queryFileList(ID);
  };
  //获取图片
  queryFileList = id => {
    queryFileList({
      props: this.props,
      params: { bizId: id, fileBizType: 'IQC' },
      callback: data => {
        // console.log('到这--',data)
        // if (!data) return;
        this.setState({ fileList: data });
      },
    });
  };
  getAsnDetailsList = (params = {}) => {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: 'iqc/fetchAsnDetailsList',
      payload: params,
      callback: data => {
        if (!data) return;
        let valueList = [];
        data.map(v => {
          const labels = ['senderId'];
          labels.map(item => {
            if (v[item] && !valueList.includes(v[item])) {
              valueList.push(v[item]);
              !searchValue[v[item]] &&
                dispatch({
                  type: 'component/querySearchValue',
                  payload: {
                    params: { id: v[item] },
                    url: 'sms/sms-sender/viewSmsSenderDetails',
                  },
                });
            }
          });
        });
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
      type: 'iqc/fetchDeliveryDetails',
      payload: { id: this.state.checkIds },
      callback: () => {
        this.setState({ modalVisible: true })
      }
    });
  }

  render() {
    const { selectedRowKeys, selectedRows, columns, fileList } = this.state;
    const {
      iqc: { asnDetails, iqcDetailsList },
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
    let selectList = iqcDetailsList[currentId]
    const checkDisabled = selectDetails ? true : false;
    const firstFormItem = (
      <FormItem label="partNo">
        {getFieldDecorator('partNo')(<Input />)}
      </FormItem>
    );
    const secondFormItem = (
      <FormItem label="Stutas">
        {getFieldDecorator('status')(
          <Select style={{ width: '100%' }} allowClear={true}>
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
      { key: 'qualityNo', name: transferLanguage('IQC.title.list', language) },
      { key: 'status', name: transferLanguage('Common.field.status', language) },
      { key: 'soId', name: transferLanguage('CoDetailList.field.SOID', language) },
      { key: 'cidCode', name: transferLanguage('IQC.field.cidCode', language) },
      { key: 'warehouseName', name: transferLanguage('Load.field.warehouse', language) },
      { key: 'reDisposition', name: transferLanguage('IQC.field.originalDisposition', language) },
      { key: 'finalDisposition', name: transferLanguage('IQC.field.resultDisposition', language) },
      { key: 'reRedemption', name: transferLanguage('IQC.field.originalRedemption', language) },
      { key: 'finalRedemption', name: transferLanguage('IQC.field.resultRedemption', language) },
      { key: 'rmaStatus', name: transferLanguage('IQC.field.rmaStatus', language) },
      { key: 'finalLocation', name: transferLanguage('IQC.field.location', language) },
      { key: 'repair', name: transferLanguage('IQC.field.repair', language) },
      { key: 'createTime', name: transferLanguage('Common.field.createTime', language) },
      { key: 'createBy', name: transferLanguage('Common.field.createBy', language) },
      { key: 'updateTime', name: transferLanguage('Common.field.updateTime', language) },
      { key: 'updateBy', name: transferLanguage('Common.field.updateBy', language) },
    ];
    const secondFields = [
      { key: 'collectPn', name: transferLanguage('IQC.field.returnPN', language) },
      { key: 'partNo', name: transferLanguage('IQC.field.shipPN', language) },
      { key: 'returnPartCC', name: transferLanguage('IQC.field.returnPartCC', language) },
      { key: 'shipPartCC', name: transferLanguage('IQC.field.shipPartCC', language) },
      { key: 'returnPNDesc', name: transferLanguage('IQC.field.returnPNDesc', language) },
      { key: 'shipPartDesc', name: transferLanguage('IQC.field.shipPartDesc', language) },
      { key: 'collectSn', name: transferLanguage('IQC.field.returnSN', language) },
      { key: 'snNo', name: transferLanguage('IQC.field.shipSN', language) },
    ];
    const thirdFields = [
      { key: 'collectPn', name: transferLanguage('IBPlan.field.partNo', language) },
      { key: 'isSurfaceOpen', name: transferLanguage('IQC.field.outerBox', language) },
      { key: 'isMonitor', name: transferLanguage('IQC.field.monitor', language) },
      { key: 'collectCoo', name: transferLanguage('partData.field.coo', language) },
      { key: 'collectProduction', name: transferLanguage('IQC.field.productionDate', language) },
      { key: 'collectDisposition', name: transferLanguage('IQC.field.disposition', language) },
      { key: 'collectRemarks', name: transferLanguage('Common.field.remarks', language) },
      { key: 'photo', name: transferLanguage('Common.field.photo', language), isRow: true, isFile: fileList },
    ]

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
            <Panel header={transferLanguage('IQC.field.partDetail', language)} key="2" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <DetailsList isMobile={isMobile} detilsData={{ fields: secondFields, value: selectDetails }} />
              </div>
            </Panel>
            <Panel header={transferLanguage('IQC.field.collectDetail', language)} key="3" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <DetailsList isMobile={true} detilsData={{ fields: thirdFields, value: selectDetails,fileList }} />
              </div>
            </Panel>
            {/* <Panel header={transferLanguage('IQCDetail.title.list', language)} key="2" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <SelectForm {...selectFormParams} />
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={selectList}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  hideDefaultSelections={true}
                  // expandForm={expandForm}
                  code={codes.page}
                  hideCheckAll={true}
                />
              </div>
            </Panel> */}
          </Collapse>
        </PageHeaderWrapper>
      </div>
    );
  }
}
