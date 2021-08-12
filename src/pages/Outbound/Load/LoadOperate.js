import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import Prompt from '@/components/Prompt';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Collapse,
  DatePicker,
  PageHeader,
  Radio,
} from 'antd';
import prompt from '@/components/Prompt';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from '@/pages/Operate.less';
import TableButtons from '@/components/TableButtons';
import AdButton from '@/components/AdButton';
import AdModal from '@/components/AdModal';
import AntdDatePicker from '@/components/AntdDatePicker';
import { dispatchFun } from '@/utils/utils';
import {
  Status, allDispatchType, routeUrl, SelectColumns,
  selectDetailList, DeliveryColumns, selectDelivery,
  codes
} from './utils';

import { transferLanguage, columnConfiguration } from '@/utils/utils';
import { languages } from 'monaco-editor';
import SearchSelect from '@/components/SearchSelect';
import DetailList from '@/components/DetailsList';
import { columns } from '../Delivery/utils';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
const formDate = 'YYYY-MM-DD HH:mm:ss'
@connect(({ Load, common, loading, i18n }) => ({

  loadDetail: Load.loadDetail,
  loadDetailList: Load.loadDetailList,
  dictObject: common.dictObject,
  loading: loading.effects[allDispatchType.detail],
  language: i18n.language,
  deliveryList: Load.deliveryList,
}))
@Form.create()
export default class Loadperate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      currentId: '',
      visible: false,
      activeKey: ['1', '2', '3', '4'],
      disabled: true,
      _SelectColumns: [],
      _columnsDetail: [],
      _DeliveryColumns: [],
      _columns: [],
      forwarder: [],
      delivery: [],
    };
  }
  columnsDetail = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => (<span>{index + 1}</span>),
      width: 50
    },
    {
      title: 'Delivery.field.soId',
      dataIndex: 'soId',
      width: 120,
    },
    {
      title: 'CoList.field.bizCoNo',
      dataIndex: 'coNo',
      width: 120,
    }, {
      title: 'CoList.field.bizSoNo',
      dataIndex: 'soNo',
      width: 120,
    }, {
      title: 'PoDetailList.field.partNo',
      dataIndex: 'partNo',
      width: 120,
    }, {
      title: 'PoDetailList.field.partDesc',
      dataIndex: 'partDesc',
      width: 120,
    },
    {
      title: 'PoDetailList.field.pieceQty',
      dataIndex: 'planQuantity',
      width: 120,
    },{
      title: 'PoList.field.openQty',
      dataIndex: 'recheckQuantity',
    render:(text,record)=>(<span>{record.planQuantity-text}</span>),
      width: 120,
    },
    {
      title: 'Delivery.field.shipQuantity',
      dataIndex: 'shipQuantity',
      width: 120,
      // render: (text, record) => (<a onClick={() => this.serialVisible(record)}>{text||1234}</a>)
    },

    // {
    //   title: 'Picking.field.openQty',
    //   dataIndex: 'openQty',
    //   width: 120,
    // }, 
    {
      title: 'Delivery.field.partSn',
      dataIndex: 'partSn',
      width: 120,
    },


    {
      title: 'Delivery.field.deliveryTime',
      dataIndex: 'deliveryTime',
      width: 120,
    }, {
      title: 'CoDetailList.field.pickingStatus',
      dataIndex: 'pickingStatus',
      width: 120,
    }, {
      title: 'CoDetailList.field.pickingNO',
      dataIndex: 'pickingNO',
      width: 120,
    },
    {
      title: 'CoList.field.soType',
      dataIndex: 'serviceordertype',
      width: 120,
    }, {
      title: 'CoList.field.soPriority',
      dataIndex: 'soprioritycode',
      width: 120,
    }, {
      title: 'CoList.field.sodType',
      dataIndex: 'sodeliverytype',
      width: 120,
    }, {
      title: 'CoList.field.serviceLevel',
      dataIndex: 'servicelevel',
      width: 120,
    }, {
      title: 'CoList.field.shippingMethod',
      dataIndex: 'shippingmethod',
      width: 120,
    }, {
      title: 'CoDetailList.field.premierCustomer',
      dataIndex: 'pmcustomerind',
      width: 120,
    }, {
      title: 'CoDetailList.field.CRUDSWAP',
      dataIndex: 'CRUDSWAP',
      width: 120,
    },
    {
      title: 'Delivery.field.beReturn',
      dataIndex: 'beReturn',
      width: 120,
    },
    {
      title: 'CoDetailList.field.milkrun',
      dataIndex: 'milkrun',
      width: 120,
    }, {
      title: 'CoDetailList.field.mtm',
      dataIndex: 'productid',
      width: 120,
    }, {
      title: 'CoDetailList.field.machineSn',
      dataIndex: 'serialnumberid',
      width: 120,
    }, {
      title: 'CoDetailList.field.hddRetention',
      dataIndex: 'hdretenion',
      width: 120,
    }, {
      title: 'CoDetailList.field.returnStatus',
      dataIndex: 'returnStatus',
      width: 120,
    },
    {
      title: 'PoDetailList.field.eta',
      dataIndex: 'eta',
      width: 120,
    }, {
      title: 'CoList.field.shippingInstruction',
      dataIndex: 'shippinginstr',
      width: 120,
    }, {
      title: 'CoList.field.deliveryInstruction',
      dataIndex: 'servicedelinstr',
      width: 120,
    }, {
      title: 'Delivery.field.totalGrossWeight',
      dataIndex: 'totalGrossWeight',
      width: 120,
    }, {
      title: 'Delivery.field.totalNetWeight',
      dataIndex: 'totalNetWeight',
      width: 120,
    }, {
      title: 'Delivery.field.totalVolume',
      dataIndex: 'totalVolume',
      width: 120,
    },
    {
      title: 'Delivery.field.remarks',
      dataIndex: 'remarks',
      width: 120,
    },

    {
      title: 'Delivery.field.createBy',
      dataIndex: 'createBy',
      width: 120,
    },
    {
      title: 'Delivery.field.createTime',
      dataIndex: 'createTime',
      width: 120,
    },
    {
      title: 'Delivery.field.updateBy',
      dataIndex: 'updateBy',
      width: 120,
    },
    {
      title: 'Delivery.field.updateTime',
      dataIndex: 'updateTime',
      width: 120,
    },
  ];
  
  componentDidMount() {
    const { match, form, dispatch, language } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      _SelectColumns: columnConfiguration(SelectColumns, language),
      _columnsDetail: columnConfiguration(this.columnsDetail, language),
      _DeliveryColumns: columnConfiguration(DeliveryColumns, language),
      _columns: columnConfiguration(columns, language)
    });
    if (ID) {
      this.getSelectDetails(ID);
      selectDetailList({ props: this.props, payload: { id: ID } })
      selectDelivery({ props: this.props, payload: { id: ID } })
    } else {
      form.resetFields();
      this.setState({
        disabled: false
      })
    }
  }
  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: allDispatchType.detail,
      payload: { id: ID },
      callback: data => {
      },
    });
  };

  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  //保存、编辑
  saveInfo = e => {
    e.stopPropagation();
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { } = this.state
        const { match: { params }, dispatch, } = this.props;
        const { shipTime, forwarder, ...value } = values;
        value.shipTime = moment(shipTime).format(formDate)
        if (forwarder && forwarder.length > 0) value.forwarder = forwarder[0].id
        value.id = params.id;
        dispatch({
          type: allDispatchType.operate,
          payload: value,
          callback: (res) => {
            if (!res) return;
            this.setState(preState => ({
              disabled: !preState.disabled,
            }));
            if (params.id) {
              dispatchFun(allDispatchType.list, {}, this.props)
              dispatchFun(allDispatchType.detail, { id: params.id }, this.props)
            } else {
              // dispatchFun(allDispatchType.detail, {id: res},this.props)
              dispatch({
                type: allDispatchType.detail,
                payload: { id: res },
                callback: data => {
                  console.log('data???', data)
                  dispatch({
                    type: 'common/setTabsName',
                    payload: {
                      id: res,
                      name: data.code,
                      isReplaceTab: true,
                    },
                    callback: result => {
                      if (result) {
                        router.push(`${routeUrl.edit}/${res}`);
                      }
                    },
                  });
                }
              })
            }
          }
        })
      }
    });
  };


  // 明细查看详情
  showDetail = () => {
    this.setState({ visible: true });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,

    });
  };

  getValue = (type, values) => {
    this.setState({
      [type]: values,
    });
  };
  addDetail = () => {
    const { currentId } = this.state
    if (currentId) {
      this.setState({ visible: true, detailsId: '' })
    } else {
      Prompt({ content: transferLanguage('PoDetailList.prompt.saveBaseInfo', this.props.language), type: 'warn' })
    }

  }
  cancelDetail = () => {
    const { selectedRows, currentId } = this.state
    const { dispatch } = this.props
    selectedRows && dispatch({
      type: 'Load/insertCancelDelivery',
      payload: { id: currentId, ids: selectedRows.map(v => v.id), type: 'true' },
      callback: data => {
        console.log('移除成功', data)
        selectDelivery({ props: this.props, payload: { id: currentId } })
      }
    })
  }
  handleOk = () => {
    const { currentId, visible } = this.state
    const { dispatch, form } = this.props
    let delivery = form.getFieldValue('delivery')
    console.log('delivery', delivery)
    let _delivery = delivery && delivery.map(v => v.id)

    dispatch({
      type: 'Load/insertCancelDelivery',
      payload: { id: currentId, ids: _delivery },
      callback: res => {
        console.log('res----', res)
        selectDelivery({ props: this.props, payload: { id: currentId } })
        this.setState({ visible: false })
      }
    })

  }
  handleStandardTableChangeDelivery = (param) => {
    const {currentId}=this.state
    selectDelivery({ props: this.props, payload: {id:currentId,param} })
  }
  handleStandardTableChange = param => {
    const {currentId}=this.state
    selectDetailList({ payload: { id:currentId,...param }, props: this.props });
  };
 
  render() {
    const {
      visible,
      disabled,
      _SelectColumns,
      _columnsDetail,
      forwarder,
      selectedRows,
      _DeliveryColumns,
      delivery,
      _columns,
    } = this.state;
    const {
      loadDetail,
      loadDetailList,
      deliveryList,
      form: { getFieldDecorator },
      match: { params },
      loading,
      language,
    } = this.props;

    const currentId = params.id;
    let selectDetails = loadDetail[currentId];

    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.businessTypeCode : transferLanguage('ContactUnit.field.AddContactUnit', language)}</span>
      </div>
    );
    let _selectedRows = selectedRows && selectedRows.length > 0
    const tableButtonsParams = {
      show: true,
      // handleAdd: this.handleAdd,
      buttons: (
        <Button.Group>
          <AdButton onClick={() => this.cancelDetail()} type={currentId ? "primary" : ""}
            disabled={!_selectedRows}
            text={transferLanguage('Common.field.cancel', language)}
            code={codes.detailCancel}
          />
          
        </Button.Group>
      ),
      rightButtons: (
        <Button type={currentId ? "primary" : ""}
          disabled={false}
          onClick={() => this.addDetail()}
          text={transferLanguage('CoDetailList.field.addDetail', language)}
          code={codes.detailAddDetail}
        />
        
      ),

      selectedRows: selectedRows,
    };
    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };

    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };
    const field = [
      { key: 'loadingNo', name: transferLanguage('Load.field.loadingNo', language) },
      { key: 'status', name: transferLanguage('Load.field.status', language) },
      { key: 'orderType', name: transferLanguage('Delivery.field.type', language) },
      { key: 'planQuantity', name: transferLanguage('PoList.field.pieceQty', language) },
      { key: 'openQuantity', name: transferLanguage('CoList.field.openQty', language) },
      { key: 'cartonQuantity', name: transferLanguage('Load.field.cartonQTY', language) },
      { key: 'shipTime', name: transferLanguage('Load.field.shipTime', language) },
      { key: 'totalGrossWeight', name: transferLanguage('Delivery.field.totalGrossWeight', language) },
      { key: 'totalNetWeight', name: transferLanguage('Delivery.field.totalNetWeight', language) },
      { key: 'totalVolume', name: transferLanguage('Delivery.field.totalVolume', language) },
      { key: 'forwarder', name: transferLanguage('Load.field.forwarder', language) },
      { key: 'trackingNo', name: transferLanguage('Load.field.trackingNo', language) },
      { key: 'vehicleNo', name: transferLanguage('Load.field.vehicleNo', language) },
    ]
    const fieldShip = [
      { key: 'warehouseId', name: transferLanguage('PoList.field.shipFrom', language) },
      { key: 'altshipto', name: transferLanguage('shipping.field.shipTo', language) },
      { key: 'altshiptocountry', name: transferLanguage('shipping.field.shipToCountry', language) },
      { key: 'altshiptostate', name: transferLanguage('shipping.field.shipToState', language) },
      { key: 'altshiptocity', name: transferLanguage('shipping.field.shipToCity', language) },
      { key: 'altshiptocontactor', name: transferLanguage('CoList.field.contactorName', language) },
      { key: 'altshiptoemail', name: transferLanguage('CoList.field.email', language) },
      { key: 'altshiptophone', name: transferLanguage('CoList.field.telephone', language) },
      { key: 'altshiptoadd', name: transferLanguage('CoList.field.address', language), isRow: true },
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
              <DetailList detilsData={{ fields: field, value: selectDetails }} />
            </Panel>
            <Panel header={transferLanguage('Common.field.shipFromTo', language)} key="2" style={customPanelStyle}>
              <DetailList detilsData={{ fields: fieldShip, value: selectDetails }} />
            </Panel>
            <Panel header={transferLanguage('Delivery.title.DeliveryDetail', language)} key="3" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                {/*<SelectForm {...selectFormParams} />*/}
                {/* <TableButtons {...tableButtonsParams} /> */}
                <StandardTable
                  // selectedRows={selectedRows}
                  disabledRowSelected={true}
                  loading={loading}
                  data={loadDetailList}
                  columns={_columnsDetail}
                  // onSelectRow={this.handleSelectRows}
                  hideDefaultSelections={true}
                  onPaginationChange={this.handleStandardTableChange}
                  expandForm={false}
                  className={this.chassName}
                />
              </div>
            </Panel>
            <Panel header={transferLanguage('Load.field.delivery', language)} key="4" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                {/*<SelectForm {...selectFormParams} />*/}
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                  selectedRows={selectedRows}
                  // loading={loading}
                  data={deliveryList}
                  columns={_columns}
                  onSelectRow={this.handleSelectRows}
                  hideDefaultSelections={true}
                  onPaginationChange={this.handleStandardTableChangeDelivery}
                  // expandForm={expandForm}
                  className={this.chassName}
                />
              </div>
            </Panel>
          </Collapse>
        </PageHeaderWrapper>
        {visible && <AdModal
          visible={visible}
          title={transferLanguage('Delivery.field.deliveryNo', language)}
          onOk={this.handleOk}
          onCancel={() => this.setState(preState => ({ visible: !preState.visible }))}
          width="1000px"
        >
          <Fragment>
            <Form.Item label={transferLanguage('Load.field.delivery', language)}>
              {getFieldDecorator('delivery', {
              })(
                <SearchSelect
                  dataUrl={'wms-loading-list/selectNoLoadingWmsDeliveryList'}
                  selectedData={delivery} // 选中值
                  showValue="deliveryNo"
                  searchName="keyWord"
                  multiple={true}
                  columns={_DeliveryColumns}
                  onChange={values => this.getValue(values, 'delivery')}
                  id="delivery"
                  allowClear={true}
                  scrollX={200}
                />
              )}
            </Form.Item>
          </Fragment>
        </AdModal>}
      </div>
    );
  }
}
