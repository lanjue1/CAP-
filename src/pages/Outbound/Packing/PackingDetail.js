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
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import AntdDatePicker from '@/components/AntdDatePicker';
import { dispatchFun } from '@/utils/utils';
import {
   allDispatchType, 
   routeUrl,
   selectCarton,
   DeliveryColumns, 
  selectDelivery
} from './utils';
import { formItemFragement, } from '@/utils/common';
import { transferLanguage, columnConfiguration } from '@/utils/utils';
import { languages } from 'monaco-editor';
import SearchSelect from '@/components/SearchSelect';
import DetailList from '@/components/DetailsList';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
const formDate = 'YYYY-MM-DD HH:mm:ss'
@connect(({ Packing, common, loading, i18n }) => ({

  loadDetail: Packing.loadDetail,
  cartonList: Packing.cartonList,
  dictObject: common.dictObject,
  loading: loading.effects[allDispatchType.detail],
  language: i18n.language,
  deliveryList: Packing.deliveryList,
  qtyDelivery:Packing.qtyDelivery,
}))
@Form.create()
export default class PackingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      currentId: '',
      visible: false,
      visibleCarton:false,
      activeKey: ['1', '2', '3', '4'],
      disabled: true,
      _columnsCarton: [],
      _columns: [],
      delivery: [],
      record:{},
    };
  }
  columnsCarton = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => (<span>{index + 1}</span>),
      width: 50
    },
    {
      title: 'ASNDetail.field.cartonNo',
      dataIndex: 'cartonNo',
      width: 120,
    render:(text,record)=>(<a onClick={(_,)=>this.changeCarton(_,record)}>{text}</a>)
    },
    {
      title: 'Delivery.field.planQuantity',
      dataIndex: 'packageQuantity',
      width: 120,
    },


    {
      title: 'partData.field.length',
      dataIndex: 'length',
      width: 120,
    }, {
      title: 'partData.field.width',
      dataIndex: 'width',
      width: 120,
    },
     {
      title: 'partData.field.heigth',
      dataIndex: 'height',
      width: 120,
    }, {
      title: 'partData.field.volume',
      dataIndex: 'volume',
      width: 120,
    },
    {
      title: 'partData.field.grossWeight',
      dataIndex: 'grossWeight',
      width: 120,
    },{
      title: 'partData.field.netWeight',
      dataIndex: 'netWeight',
      width: 120,
    },
    {
      title: 'Packing.field.packer',
      dataIndex: 'packWorker',
      width: 120,
    },
    {
      title: 'Packing.field.packerTime',
      dataIndex: 'packTime',
      width: 120,
    },
  ];
  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => (<span>{index + 1}</span>),
      width: 50
    },
    {
      title: 'Delivery.field.deliveryNo',
      dataIndex: 'deliveryNo',
      width: 160,
      // render: (text, record) => (
      //   <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
      // ),
    },
    {
      title: 'Delivery.field.status',
      dataIndex: 'status',
      width: 120,
    },{
      title: 'Delivery.field.type',
      dataIndex: 'packageType',
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
    },

    {
      title: 'Delivery.field.planQuantity',
      dataIndex: 'planQuantity',
      width: 120,
    render:(text,record)=>(<a onClick={(_)=>this.deliveryQty(_,record)}>{text}</a>)
    },
    {
      title: 'CoList.field.openQty',
      dataIndex: 'recheckQuantity',
      render: (text, record) => {
        let openQTY = record.planQuantity - record.recheckQuantity
        return <span>{openQTY}</span>
      },
      width: 120,
    },
    
    {
      title: 'Load.field.cartonQTY',
      dataIndex: 'cartonQuantity',
      width: 120,
    },
    {
      title: 'Delivery.field.shippingNoticeNum',
      dataIndex: 'outboundNoticeNo',
      width: 120,
    },

    // {
    //   title: 'Load.field.loadingNo',
    //   dataIndex: 'loadingNo',
    //   width: 120,
    // },
    {
      title: 'PoDetailList.field.etd',
      dataIndex: 'etd',
      width: 100,
    },
    {
      title: 'Picking.field.soprioritycode',
      dataIndex: 'originalBillNo',
      width: 150,
    },
    {
      title: 'Picking.field.sodeliverytype',
      dataIndex: 'sodeliverytype',
      width: 120,
    },
    {
      title: 'Picking.field.servicelevel',
      dataIndex: 'servicelevel',
      width: 120,
    },
    {
      title: 'Picking.field.shippingmethod',
      dataIndex: 'shippingmethod',
      width: 120,
  
    },
    {
      title: 'Picking.field.pmcustomerind',
      dataIndex: 'pmcustomerind',
      width: 120,
    },
    {
      title: 'Delivery.field.shipToWmCode',
      dataIndex: 'shipToWmCode',
      width: 120,
    },{
      title: 'CoList.field.toCountry',
      dataIndex: 'altshiptocountry',
      width: 120,
    },{
      title: 'CoList.field.toState',
      dataIndex: 'altshiptostate',
      width: 120,
    },{
      title: 'CoList.field.toCity',
      dataIndex: 'altshiptocity',
      width: 120,
    },{
      title: 'CoList.field.toZip',
      dataIndex: 'altshiptopostcode',
      width: 120,
    },
    
  ];
  componentDidMount() {
    const { match, form, language } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      _columnsCarton: columnConfiguration(this.columnsCarton, language),
      _columns: columnConfiguration(this.columns, language)
    });
    if (ID) {
      this.getSelectDetails(ID);
      selectCarton({ props: this.props, payload: {loadingListId: ID } })
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
  changeCarton=(_,record)=>{
    const {visibleCarton}=this.state
    const {dispatch}=this.props
    this.setState({
      visibleCarton:true,
      record
    })
   
  }
  //点击QTY
  deliveryQty=(_,record)=>{
    console.log('record??',record)
    this.setState(preState=>({
      visible:!preState.visible
    }))
    this.getDeliveryQty(record.id)
  }
  //QTY 的详情
  getDeliveryQty=(id)=>{
    const {dispatch}=this.props
    dispatch({
      type:'Packing/selectDeliveryQty',
      payload:{id},
      callback:data=>{
        console.log('data,',data,this.props.qtyDelivery)
      }
    })
  }
  //保存、编辑
  saveInfo = e => {
    e.stopPropagation();
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { } = this.state
        const { match: { params }, dispatch, } = this.props;
        const { shipTime, ...value } = values;
        value.shipTime = moment(shipTime).format(formDate)
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
    const { currentId, } = this.state
    const { dispatch, form } = this.props
   
    form.validateFields((err,value)=>{
      if(err) return
      console.log('value====>>>',value)
      dispatch({
        type:'Packing/abledLoad',
        payload:{type:'updateCarton',...value},
        callback:data=>{
          this.setState({visibleCarton:false})
          selectCarton({ props: this.props, payload: { loadingListId: currentId } })
        }
      })
    })
  }
  handleStandardTableChangeDelivery = (param) => {
    const {currentId}=this.state
    selectDelivery({ props: this.props, payload:{id:currentId ,...param} })
  }
  handleStandardTableChange = param => {
    const {currentId}=this.state
    selectCarton({ payload: {loadingListId:currentId, ...param },props: this.props,});
  };
 
  render() {
    const {
      visible,
      selectedRows,
      _columnsCarton,
      delivery,
      _columns,
      record,
      visibleCarton,
    } = this.state;
    const {
      loadDetail,
      cartonList,
      
      deliveryList,
      qtyDelivery,
      form,
      form: { getFieldDecorator },
      match: { params },
      language,
    } = this.props;

    const currentId = params.id;
    let selectDetails = loadDetail[currentId];
    let selectDetailList=deliveryList[currentId]
    
    let selectCartonList=cartonList[currentId]
    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
  };
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
          <Button onClick={() => this.cancelDetail()} type={currentId ? "primary" : ""}
            disabled={!_selectedRows}
          >
            {transferLanguage('Common.field.cancel', language)}
          </Button>
        </Button.Group>
      ),
      rightButtons: (
        <Button type={currentId ? "primary" : ""}
          disabled={false}
          onClick={() => this.addDetail()}
        >
          {transferLanguage('CoDetailList.field.addDetail', language)}
        </Button>
      ),

      selectedRows: selectedRows,
    };
    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };

   
    const field = [
      { key: 'loadingNo', name: transferLanguage('Load.field.loadingNo', language) },
      { key: 'status', name: transferLanguage('Load.field.status', language) },
      { key: 'orderType', name: transferLanguage('Delivery.field.type', language) },
      { key: 'shipQuantity', name: transferLanguage('PoList.field.pieceQty', language) },
      { key: 'openQuantity', name: transferLanguage('CoList.field.openQty', language) },
      { key: 'cartonQuantity', name: transferLanguage('Load.field.cartonQTY', language) },
      { key: 'outboundNoticeNo', name: transferLanguage('RMO.field.noticeNo', language) },
      // { key: 'shipTime', name: transferLanguage('Load.field.shipTime', language) },
      // { key: 'totalGrossWeight', name: transferLanguage('Delivery.field.totalGrossWeight', language) },
      // { key: 'totalNetWeight', name: transferLanguage('Delivery.field.totalNetWeight', language) },
      // { key: 'totalVolume', name: transferLanguage('Delivery.field.totalVolume', language) },
      // { key: 'forwarder', name: transferLanguage('Load.field.forwarder', language) },
      // { key: 'trackingNo', name: transferLanguage('Load.field.trackingNo', language) },
      // { key: 'vehicleNo', name: transferLanguage('Load.field.vehicleNo', language) },
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
    const formItem=[
      [
        <AntdFormItem label={transferLanguage('RMO.field.soId',language)}
        initialValue={qtyDelivery ? qtyDelivery.soId : ''}
         code='soId'
         {...commonParams}
        >
          <Input disabled={true}/>
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('ASNDetail.field.partNo',language)}
        initialValue={qtyDelivery ? qtyDelivery.partCode : ''}
        code='partCode'
        {...commonParams}
       >
         <Input disabled={true}/>
       </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage('ASNDetail.field.cartonNo',language)}
        initialValue={qtyDelivery ? qtyDelivery.cartonNo : ''} 
        code='cartonNo'
         {...commonParams}
        >
          <Input disabled={true}/>
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('Delivery.field.planQuantity',language)}
        initialValue={qtyDelivery ? qtyDelivery.qty : ''}
        code='qty'
        {...commonParams}
       >
         <Input disabled={true}/>
       </AntdFormItem>,
      ],
    ]
    const formItemCarton=[
      [
        <AntdFormItem label={transferLanguage('partData.field.length',language)}
        initialValue={record ? record.length : ''}
         code='length'
         rules={[{required:true}]}
         {...commonParams}
        >
          <Input />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('partData.field.width',language)}
        initialValue={record ? record.width : ''}
        code='width'
        rules={[{required:true}]}

        {...commonParams}
       >
         <Input />
       </AntdFormItem>,
       
      ],
      [
        <AntdFormItem label={transferLanguage('partData.field.heigth',language)}
         rules={[{required:true}]}
         initialValue={record ? record.height : ''} 
        code='heigth'
         {...commonParams}
        >
          <Input />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('partData.field.volume',language)}
         rules={[{required:true}]}
         initialValue={record ? record.volume : ''}
        code='volume'
        {...commonParams}
       >
         <Input />
       </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage('partData.field.grossWeight',language)}
         rules={[{required:true}]}
         initialValue={record ? record.grossWeight : ''} 
        code='grossWeight'
         {...commonParams}
        >
          <Input />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('partData.field.netWeight',language)}
         rules={[{required:true}]}
         initialValue={record ? record.netWeight : ''}
        code='netWeight'
        {...commonParams}
       >
         <Input />
       </AntdFormItem>,
      ],
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
            <Panel header={transferLanguage('Load.field.delivery', language)} key="3" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                {/*<SelectForm {...selectFormParams} />*/}
                {/* <TableButtons {...tableButtonsParams} /> */}
                <StandardTable
                  // selectedRows={selectedRows}
                  disabledRowSelected={true}
                  data={selectDetailList}
                  columns={_columns}
                  // onSelectRow={this.handleSelectRows}
                  hideDefaultSelections={true}
                  onPaginationChange={this.handleStandardTableChangeDelivery}
                  className={this.chassName}
                />
              </div>
            </Panel>
            <Panel header={transferLanguage('ASNDetail.field.cartonNo', language)} key="4" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <StandardTable
                  // selectedRows={selectedRows}
                  // onSelectRow={this.handleSelectRows}
                  disabledRowSelected={true}
                  data={selectCartonList}
                  columns={_columnsCarton}
                  hideDefaultSelections={true}
                  onPaginationChange={this.handleStandardTableChange}
                  className={this.chassName}
                />
              </div>
            </Panel>
          </Collapse>
        </PageHeaderWrapper>
        {visible && <AdModal
          visible={visible}
          title={transferLanguage('Delivery.field.deliveryNo', language)}
          onOk={() => this.setState(preState => ({ visible: !preState.visible }))}
          onCancel={() => this.setState(preState => ({ visible: !preState.visible }))}
          width="1000px"
        >
          <AntdForm>{formItemFragement(formItem)}</AntdForm>
        </AdModal>}
        {visibleCarton&&<AdModal
          visible={visibleCarton}
          title={transferLanguage('ASNDetail.field.cartonNo', language)}
          onOk={this.handleOk}
          onCancel={() => this.setState(preState => ({ visibleCarton: !preState.visibleCarton }))}
          width="1000px"
        >
          <AntdForm>{formItemFragement(formItemCarton)}</AntdForm>
          </AdModal>}
      </div>
    );
  }
}
