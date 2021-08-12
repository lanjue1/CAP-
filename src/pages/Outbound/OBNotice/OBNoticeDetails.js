import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Collapse, Form, Input, Select, } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from '@/pages/Operate.less';
import { Columns, codes, Status } from './utils';
import DetailsList from '@/components/DetailsList';
import SelectForm from '@/components/SelectForm';
import { transferLanguage, columnConfiguration } from '@/utils/utils';
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ shipping, common, component, loading, i18n }) => ({
  shipping,
  dictObject: common.dictObject,
  id: shipping.id,
  loading: loading.models.shipping,
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
      activeKey: ['1','2','3'],
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
  className = 'shipping';

  componentDidMount() {
    const { match, form, language, dispatch } = this.props;
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
      columns: columnConfiguration(Columns, language)
    })
  }
  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'shipping/shippingDetails',
      payload: { id: ID },
    });
    this.getShippingDetailsList({ outboundNoticeId: ID })
  };

  getShippingDetailsList = (params = {}) => {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: 'shipping/fetchShippingDetailsList',
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
    this.getShippingDetailsList({ outboundNoticeId: this.state.currentId });
  };
  //查询
  handleSearch = values => {
    const { ...value } = values;
    this.setState({
      formValues: value,
    });
    this.getShippingDetailsList({ ...value, outboundNoticeId: this.state.currentId });
  };
  handleStandardTableChange = param => {
    this.getShippingDetailsList(param);
  };
  render() {
    const {
      selectedRows,
      columns
    } = this.state;
    const {
      shipping: { shippingDetails, shippingDetailsList },
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
    let selectDetails = shippingDetails[currentId];
    let _bitDate=selectDetails?moment(selectDetails?.bizDate).format('YYYY-MM-DD HH:mm:ss'):''
    // console.log('&&&&7',_bitDate ,selectDetails,moment(selectDetails.bizDate).format('YYYY-MM-DD HH-mm'))

    const checkDisabled = selectDetails ? true : false;
    const firstFormItem = (
      <FormItem label={transferLanguage('shippingDetail.field.coNo',language)}>
        {getFieldDecorator('coNo')(<Input  />)}
      </FormItem>
    );
    const secondFormItem = (
      <FormItem label={transferLanguage('shippingDetail.field.partNo',language)}>
        {getFieldDecorator('partNo')(<Input  />)}
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
     
      { key: 'outboundNoticeNo', name: transferLanguage('shipping.field.shippingNo', language) },
      { key: 'status', name: transferLanguage('shipping.field.status', language) },
      { key: 'orderType', name: transferLanguage('shipping.field.bizType', language) },
      { key: 'coNo', name: transferLanguage('shipping.field.coNo', language) },
      { key: 'soNo', name: transferLanguage('shipping.field.soNo', language) },
      { key: 'planPieceQty', name: transferLanguage('shipping.field.planPieceQty', language) },
      { key: 'moveNo', name: transferLanguage('shipping.field.moveNo', language) },
      { key: 'moveStatus' , name: transferLanguage('shipping.field.pickingStatus', language) },
      // { key: 'bizDate', name: transferLanguage('shippingDetail.field.bizDate', language) },
      { key: 'deliveryNo', name: transferLanguage('shipping.field.deliveryNo', language) },
      { key: 'deliveryStatus', name: transferLanguage('shipping.field.deliveryStatus', language) },
      { key: 'serviceordertype', name: transferLanguage('shipping.field.soType', language),  },
      { key: 'soprioritycode', name: transferLanguage('shipping.field.soPriority', language),},
      { key: 'sodeliverytype', name: transferLanguage('shipping.field.sodType', language), },
      { key: 'servicelevel', name: transferLanguage('shipping.field.serviceLevel', language),  },
      { key: 'shippinginstr', name: transferLanguage('CoList.field.shippingInstruction', language) },
      { key: 'servicedelinstr', name: transferLanguage('CoList.field.deliveryInstruction', language) },
    ];

    const detailsFields = [
      { key: 'shipFromWmCode', name: transferLanguage('shipping.field.shipFrom', language) },
      { key: 'shipFromCountry', name: transferLanguage('shipping.field.fromCountry', language) },
      { key: 'altshipto', name: transferLanguage('CoList.field.shipToId', language) },
      { key: 'altshiptoname', name: transferLanguage('shipping.field.shipTo', language) },
      { key: 'altshiptocountry', name: transferLanguage('shipping.field.shipToCountry', language) },
      { key: 'altshiptostate', name: transferLanguage('shipping.field.shipToState', language) },
      { key: 'altshiptocity', name: transferLanguage('shipping.field.shipToCity', language) },
      { key: 'altshiptopostcode', name: transferLanguage('shipping.field.shipToZip', language) },
      { key: 'altshiptocontactor', name: transferLanguage('CoList.field.contactorName', language) },
      { key: 'altshiptoemail', name: transferLanguage('CoList.field.email', language) },
      { key: 'altshiptophone', name: transferLanguage('CoList.field.telephone', language) },
      { key: 'altshiptoadd', name: transferLanguage('CoList.field.address', language), isRow: true,},
      
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
            <Panel header={transferLanguage('shipping.title.shipFromAndTo', language)} key="2" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <DetailsList isMobile={isMobile} detilsData={{ fields: detailsFields, value: selectDetails }} />
              </div>
            </Panel>
            <Panel header={transferLanguage('shipping.title.detailEdit', language)} key="3" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                {/* <SelectForm {...selectFormParams} /> */}
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={shippingDetailsList}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  hideDefaultSelections={true}
                  // expandForm={expandForm}
                  onPaginationChange={this.handleStandardTableChange}
                  code={codes.page}
                  hideCheckAll={true}
                />
              </div>
            </Panel>
          </Collapse>
        </PageHeaderWrapper>
      </div>
    );
  }
}
