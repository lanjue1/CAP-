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
@connect(({ Rmo, common, component, loading, i18n }) => ({
  Rmo,
  dictObject: common.dictObject,
  // id: iqc.id,
  loading: loading.effects['Rmo/asnDetails'],
  searchValue: component.searchValue,
  language: i18n.language
}))
@Form.create()
export default class RmoOperate extends Component {
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
  className = 'Rmo';

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
  }

  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'Rmo/asnDetails',
      payload: { id: ID },
    });
    
  };
 
  

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

  render() {
    const { selectedRowKeys, selectedRows, columns, fileList } = this.state;
    const {
      Rmo: { asnDetails, },
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
        <span>{selectDetails?.rmoNo}</span>
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
      { key: 'rmoNo', name: transferLanguage('RMO.field.rmoNo', language) },
      { key: 'soId', name: transferLanguage('RMO.field.soId', language) },
      { key: 'partNo', name: transferLanguage('RMO.field.partNo', language) },
      { key: 'partStatus', name: transferLanguage('RMO.field.partStatus', language) },
      { key: 'finalLocation', name: transferLanguage('RMO.field.finalLocation', language) },
      { key: 'rmoStatus', name: transferLanguage('RMO.field.rmoStatus', language) },
      { key: 'noticeNo', name: transferLanguage('RMO.field.noticeNo', language) },
      { key: 'rmaNo', name: transferLanguage('RMO.field.rmaNo', language) },
      { key: 'rmoFinishedDate', name: transferLanguage('RMO.field.rmoFinishedDate', language) },
      { key: 'beReceipt ', name: transferLanguage('RMO.field.beReceipt ', language) },
      { key: 'receiptDate', name: transferLanguage('RMO.field.receiptDate', language) },
      { key: 'remark', name: transferLanguage('RMO.field.remark', language) },
      { key: 'repairCode', name: transferLanguage('RMO.field.repairCode', language) },
      { key: 'repairName', name: transferLanguage('RMO.field.repairName', language) },
      { key: 'repairAddress', name: transferLanguage('RMO.field.repairAddress', language) },
      { key: 'refurbisherAsnNo', name: transferLanguage('RMO.field.refurbisherAsnNo', language) },
      { key: 'refurbisherAsnDetailId', name: transferLanguage('RMO.field.refurbisherAsnDetailId', language) },
      { key: 'remarks', name: transferLanguage('RMO.field.remarks', language) },
      
      
    ];
    const secondFields = [
      { key: 'rhRedemptionReturnPn', name: transferLanguage('RMO.field.rhRedemptionReturnPn', language) },
      { key: 'rhRedemptionReturnSn', name: transferLanguage('RMO.field.rhRedemptionReturnSn', language) },
      { key: 'rhDispositionCode', name: transferLanguage('RMO.field.rhDispositionCode', language) },
      { key: 'rhRedemptionCode', name: transferLanguage('RMO.field.rhRedemptionCode', language) },
      { key: 'rhRedemptionUpdateTime', name: transferLanguage('RMO.field.rhRedemptionUpdateTime', language) },
      { key: 'rhRedemptionStatus', name: transferLanguage('RMO.field.rhRedemptionStatus', language) },
      { key: 'rhRedemptionPddReason', name: transferLanguage('RMO.field.rhRedemptionPddReason', language) },
      
    ];
    const thirdFields = [
      { key: 'rhRmaReturnPn', name: transferLanguage('RMO.field.rhRmaReturnPn', language) },
      { key: 'rhRmaReturnSn', name: transferLanguage('RMO.field.rhRmaReturnSn', language) },
      { key: 'rhRmaRepairedPn', name: transferLanguage('RMO.field.rhRmaRepairedPn', language) },
      { key: 'rhRmaRepairedSn', name: transferLanguage('RMO.field.rhRmaRepairedSn', language) },
      { key: 'rhRmaStatusCode', name: transferLanguage('RMO.field.rhRmaStatusCode', language) },
      { key: 'rhRmaStatusDescription', name: transferLanguage('RMO.field.rhRmaStatusDescription', language) },
      { key: 'rhRmaUpdateTime', name: transferLanguage('RMO.field.rhRmaUpdateTime', language) },
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
            <Panel header={transferLanguage('RMO.field.Redemption', language)} key="2" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <DetailsList isMobile={isMobile} detilsData={{ fields: secondFields, value: selectDetails }} />
              </div>
            </Panel>
            <Panel header={transferLanguage('RMO.field.RMA', language)} key="3" style={customPanelStyle}>
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
