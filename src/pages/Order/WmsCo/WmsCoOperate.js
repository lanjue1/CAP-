import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Button, Col, Collapse, Form, Input, Row, Select, Spin, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '@/pages/Operate.less';
import AdButton from '@/components/AdButton';
import AdModal from '@/components/AdModal';
import { codes, Status, CoTypeArr, SelectColumns } from "./utils";
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import DeliveryFormModal from './component/DeliveryFormModal';
import AdSelect from '@/components/AdSelect';
import SearchSelect from '@/components/SearchSelect';
import { transferLanguage } from '@/utils/utils';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import { formItemFragement, formatPrice, queryDict, allDictList } from '@/utils/common';
import { languages } from 'monaco-editor';
import AntdDatePicker from '@/components/AntdDatePicker';
import Prompt from '@/components/Prompt';
import ButtonGroup from 'antd/lib/button/button-group';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ wmsco, common, loading, i18n }) => ({
  wmsco,
  dictObject: common.dictObject,
  id: wmsco.id,
  loading: loading.models.wmsco,
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
      activeKey: ['1', '2', '3', '4'],
      showRecord: true, //init:false
      senders: [],
      disabled: true,
      beUseRule: true,
      requestTypeList: [],
      expandForm: false,
      modalVisible: false,
      checkIds: '',
      detailsId: '',
      toCountryId: [],
      fromCountryId: [],
      shipFromWmCode: [],
      shipToWmCode: [],
      billTypeId: [],
      _SelectColumns: [],
      remarkType: ''
    };
  }

  className = 'wmscoOperate';


  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      showRecord: true,
    });
    if (ID) {
      this.getSelectDetails(ID);
      this.getSelectDetailsList(ID)
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
      if (v.title) v.title = transferLanguage(v.title, this.props.language)
      if (v.value) v.value = transferLanguage(v.value, this.props.language)
      return v
    })
    this.setState({
      [params]: _columnsAllotOne
    })
  }
  // 获取详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'wmsco/wmscoDetails',
      payload: { id: ID },
      callback: data => {
        this.setState({
          senders: [{ id: data.senderId }],
          beUseRule: data.beUseRule,
          toCountryId: [{ id: data.toCountryId, name: data.toCountryName }],
          fromCountryId: [{ id: data.fromCountryId, name: data.fromCountryName }],
          shipToWmCode: [{ code: data.shipToWmCode, name: data.shipToWmName }],
          shipFromWmCode: [{ code: data.shipFromWmCode, name: data.shipFromWmName }],
          billTypeId: [{ id: data.billTypeId, name: data.billTypeName }],
        });
      },
    });
  };

  // 获取明细列表：
  getSelectDetailsList = ID => {
    this.props.dispatch({
      type: 'wmsco/fetchWmsCoDetailsList',
      payload: { coId: ID },
      callback: data => {
        this.setState({
          senders: [{ id: data.senderId }],
          beUseRule: data.beUseRule,
        });
      },
    });
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
        const { soreleasedate, toCountryName, ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        const { billTypeId, toCountryId, fromCountryId, shipToWmCode, shipFromWmCode } = this.state

        // value.toCountryId = toCountryName.length>0?toCountryName[0].countryId:'';
        if (toCountryName && toCountryName.length > 0) {
          value.toCountryId = toCountryName[0].id
        }
        if (shipFromWmCode && shipFromWmCode.length > 0) {
          value.fromCountryId = shipFromWmCode[0].countryId
          value.shipFromWmCode = shipFromWmCode[0].code;
        }
        if (billTypeId && billTypeId.length > 0) {
          value.billTypeId = billTypeId[0].id
        }
        // value.shipToWmCode = shipToWmCode[0]?.code;


        value.soreleasedate = soreleasedate ? moment(soreleasedate).format(dateFormat) : ''
        console.log('toCountryName===', value, value.toCountryId, toCountryName[0])
        if (params.id) {
          value.id = params.id;
          dispatch({
            type: 'wmsco/wmscoOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('wmsco/wmscoList', {});
              this.dispatchFun('wmsco/wmscoDetails', { id: params.id });
            },
          });
        } else {
          dispatch({
            type: 'wmsco/wmscoOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              // this.setState({ showRecord: true });
              this.setState({ currentId: res })
              dispatch({
                type: 'wmsco/wmscoDetails',
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
                        router.push(`/order/listWmsCo/editWmsCo/${res}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('wmsco/interfaceTypeList', {});
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


  handleSelectRows = rows => {
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
    // if (type == "shipToWmCode") {
    //   setFieldsValue({
    //     toCountryName: values[0]?.countryName
    //   })
    // }
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
    this.getSelectDetailsList(currentId)
  }
  cancel = () => {
    this.setState({ modalVisible: false })
  }
  modalShow = (record) => {
    // this.props.dispatch({
    //   type: 'wmsco/fetchDeliveryDetails',
    //   payload: { id :record.id },
    //   callback: data=>{
    this.setState({ modalVisible: true, detailsId: record.id })
    //   }
    // });
  }
  addDetail = () => {
    const { currentId, } = this.state
    // if (currentId) {
    //   this.setState({ modalVisible: true, detailsId: '' })
    // } else {
    //   Prompt({ content: transferLanguage('PoDetailList.prompt.saveBaseInfo', this.props.language), type: 'warn' })
    // }
    this.setState({ modalVisible: true, detailsId: '' })
  }
  cancelDetail = () => {
    const { checkIds, currentId } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'wmsco/cancelDetail',
      payload: { ids: checkIds },
      callback: data => {
        this.getSelectDetailsList(currentId)
        this.getSelectDetails(currentId)
      }
    })
  }
  sendRemark = () => {
    const { dispatch, form: { getFieldValue } } = this.props
    const { checkIds, visible, remarkType } = this.state
    const keyWord = getFieldValue('sendRemark')
    let type = 'wmsco/sendRemark'
    if (remarkType !== 'sendRemark') {
      type = 'wmsco/forceClose'
    }
    dispatch({
      type: type,
      payload: { id: checkIds[0], keyWord },
      callback: data => {
        this.setState({ visible: !visible })

      }

    })
  }
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
      modalVisible,
      checkIds,
      detailsId,
      toCountryId,
      fromCountryId,
      shipFromWmCode,
      shipToWmCode,
      billTypeId,
      _SelectColumns,
      remarkType
    } = this.state;
    const {
      wmsco: { wmscoDetails, coDetailsList, eventReceiverList },
      form,
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      showType,
      loading,
      language,

    } = this.props;

    const currentId = params.id;
    const selectList = coDetailsList[currentId]
    let selectDetails = wmscoDetails[currentId];
    const checkDisabled = selectDetails ? true : false;
    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.code : transferLanguage('CoDetailList.field.addCoInfo', language)}</span>
        {disabled ? (
          <AdButton
            disabled={selectDetails && selectDetails.status !== "OPEN"&&selectDetails.status !== "ON_HOLD" ? true : false}
            code={codes.detailEdit}
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text={transferLanguage('CargoOwnerDetail.button.edit', language)}
          />
        ) : (
            <Button.Group>
              <Button type="primary" onClick={e => this.operatePaneButton(e)}>
                {transferLanguage('CargoOwnerDetail.button.save', language)}
              </Button>
              {currentId && (
                <AdButton
                  onClick={() => {
                    this.setState(preState => ({
                      disabled: !preState.disabled,
                    }));
                  }}
                  text={transferLanguage('CargoOwnerDetail.button.cancel', language)}
                />
              )}
            </Button.Group>
          )}
      </div>
    );
    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };
    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };

    // 详情字段
    const CODetailsColumns = [
      {
        title: '#',
        dataIndex: 'index',
        render: (text, record, index) => (<span>{index + 1}</span>),
        width: 50
      },
      {
        title: transferLanguage('CoDetailList.field.SOID', language),
        dataIndex: 'soDetailNo',
        render: (text, record) => (
          <AdButton
            text={text}
            code={codes.detailEdit}
            mode='a'
            onClick={() => this.modalShow(record)} title={text} />)
      },
      {
        // title: '状态',
        title: transferLanguage('CoDetailList.field.status', language),
        dataIndex: 'status',
        render: text => <span title={text}>{text}</span>,
      },
      // {
      //   title: transferLanguage('CoList.field.type', language),
      //   dataIndex: 'type',
      //   render: text => <AdSelect value={text} onlyRead={true} />,
      // }, {
      //   title: transferLanguage('CoDetailList.field.item', language),
      //   dataIndex: 'item',
      //   render: text => <AdSelect value={text} onlyRead={true} />,
      // }, {
      //   title: transferLanguage('CoDetailList.field.referenceItem', language),
      //   dataIndex: 'referenceitemid',
      //   render: text => <AdSelect value={text} onlyRead={true} />,
      // },
      {
        // title: '料号',
        title: transferLanguage('CoDetailList.field.partNo', language),
        dataIndex: 'shipPartNo',
        render: text => <span title={text}>{text}</span>,
      },
      {
        // title:'料号描述'
        title: transferLanguage('CoDetailList.field.partDesc', language),
        dataIndex: 'shipPartDesc',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        // title: 'pcs数',
        title: transferLanguage('CoDetailList.field.pieceQty', language),
        dataIndex: 'pieceQty',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('CoDetailList.field.meas', language),
        dataIndex: 'lineitemqtyunit',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      // {
      //   // title: '单价',
      //   title: transferLanguage('CoDetailList.field.unitPrice', language),
      //   dataIndex: 'unitPrice',
      //   render: text => <AdSelect value={text} onlyRead={true} />,
      // },
      {
        title: transferLanguage('CoDetailList.field.subParts', language),
        dataIndex: 'nonsubpartind',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('CoDetailList.field.milkrun', language),
        dataIndex: 'beMilkrun',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('CoDetailList.field.beSwap', language),
        dataIndex: 'beSwap',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('CoDetailList.field.return', language),
        dataIndex: 'beReturn',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('CoDetailList.field.returnStatus', language),
        dataIndex: 'returnStatus',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },

      {
        title: transferLanguage('PoDetailList.field.eta', language),
        dataIndex: 'eta',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('CoDetailList.field.category', language),
        dataIndex: 'itemcategory',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('CoDetailList.field.partsSn', language),
        dataIndex: 'partserialnumber',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      // {
      //   // title: '毛重',
      //   title: transferLanguage('CoDetailList.field.grossWeight', language),
      //   dataIndex: 'totalGrossWeight',
      //   render: text => <AdSelect value={text} onlyRead={true} />,
      // },
      // {
      //   // title: '净重',
      //   title: transferLanguage('CoDetailList.field.netWeight', language),
      //   dataIndex: 'totalNetWeight',
      //   render: text => <AdSelect value={text} onlyRead={true} />,
      // },
      // {
      //   // title: '体积',
      //   title: transferLanguage('CoDetailList.field.volume', language),
      //   dataIndex: 'totalVolume',
      //   render: text => <AdSelect value={text} onlyRead={true} />,
      // },
      {
        title: transferLanguage('CoDetailList.field.forwarder', language),
        dataIndex: 'forwarder',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        // title: '货物运输跟踪单号',
        title: transferLanguage('ASN.field.bolNo', language),
        dataIndex: 'bolNo',
        render: text => <span title={text}>{text}</span>,
      },

      // {
      //   // title: '联想发货单号',
      //   title: transferLanguage('CoDetailList.field.dn', language),
      //   dataIndex: 'dn',
      //   render: text => <AdSelect value={text} onlyRead={true} />,
      // },

      // {
      //   // title: '发货日期-联想',
      //   title: transferLanguage('CoDetailList.field.deliveryDate', language),
      //   dataIndex: 'deliveryDate',
      //   render: text => <AdSelect value={text} onlyRead={true} />,
      // },



      // {
      //   // title: '运输优先级',
      //   title: transferLanguage('CoDetailList.field.transportPriority', language),
      //   dataIndex: 'transportPriority',
      //   render: text => <AdSelect value={text} onlyRead={true} />,
      // },

      {
        // title: '备注',
        title: transferLanguage('CoDetailList.field.remarks', language),
        dataIndex: 'remarks',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('CoList.field.committedTime', language),
        dataIndex: 'committedsericedate',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('CoDetailList.field.updateBy', language),
        dataIndex: 'updateBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
      {
        title: transferLanguage('CoDetailList.field.updateTime', language),
        dataIndex: 'updateTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
      },
    ]


    const deliveryParams = {
      visible: modalVisible,
      detailId: currentId,
      detailsId: this.state.detailsId,
      modalEmpty: this.modalEmpty,
      cancel: this.cancel,
    };
    let sendRemarkAble = selectedRows.length === 1 && selectedRows[0].status == "ON_HOLD"
    const tableButtonsParams = {
      show: true,
      // handleAdd: this.handleAdd,
      buttons: (
        <Button.Group>
          <Button onClick={() => this.cancelDetail()} type="primary"
            disabled={disabled || !selectedRows.length > 0}
          >
            {transferLanguage('Common.field.cancel', language)}
          </Button>
          <Button onClick={() => this.setState({ visible: true, remarkType: 'sendRemark' })} type="primary"
            disabled={disabled || !sendRemarkAble}
          >
            {transferLanguage('CoDetailList.button.sendRemark', language)}
          </Button>
          <AdButton
            onClick={() => this.setState({ visible: true, remarkType: 'forceClose' })}
            disabled={selectedRows.length === 1 ? false : true}
            text={transferLanguage('IQC.button.forceClose', language)}
            code={codes.forceClose}
          />

        </Button.Group>
      ),
      rightButtons: (
        <Button type={currentId ? "primary" : ""}
          disabled={disabled}
          onClick={() => this.addDetail()}
        >
          {transferLanguage('CoDetailList.field.addDetail', language)}
        </Button>
      ),

      selectedRows: selectedRows,
    };
    const formItem = [
      [
        <AntdFormItem label={transferLanguage('CoDetailList.field.mtm', language)} code="productid"
          initialValue={selectDetails ? selectDetails.productid : ''}
          {...commonParams}
        >
          <Input disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('CoDetailList.field.machineSn', language)} code="serialnumberid"
          initialValue={selectDetails ? selectDetails.serialnumberid : ''}
          {...commonParams}
        >
          <Input disabled={disabled} />
        </AntdFormItem>,
      ],

      [
        <AntdFormItem label={transferLanguage('CoDetailList.field.hddRetention', language)} code="hdretenion"
          initialValue={selectDetails ? selectDetails.hdretenion : ''}
          {...commonParams}
        >
          <Input disabled={disabled} />
        </AntdFormItem>,
        <></>
      ],
    ]
    const formItemShip = [
      [
        <AntdFormItem label={transferLanguage('ASN.field.shipFromWmCode', language)} code="shipFromWmCode"
          initialValue={selectDetails ? selectDetails.shipFromWmCode : ''}
          rules={[{ required: true, message: '请输入' }]}
          {...commonParams}
        >
          <SearchSelect
            disabled={disabled}
            dataUrl={'/wms-warehouse/selectWmsWarehouseList'}
            selectedData={shipFromWmCode} // 选中值
            showValue="name"
            searchName="name"
            multiple={false}
            columns={_SelectColumns}
            onChange={values => this.getValue(values, 'shipFromWmCode')}
            id="shipFromWmCode"
            allowClear={true}
            scrollX={200}
          />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('CoList.field.fromCountry', language)} code="fromCountryName"
          rules={[{ required: true, message: '请输入' }]}
          initialValue={selectDetails ? selectDetails.fromCountryName : ''}
          {...commonParams}
        >
          <Input disabled={true} />
        </AntdFormItem>,
      ],

      [
        <AntdFormItem label={transferLanguage('CoList.field.shipToId', language)} code="altshipto"
          initialValue={selectDetails ? selectDetails.altshipto : ''}
          {...commonParams}
        >
          <Input disabled={disabled} />
        </AntdFormItem>,
        <>
        </>

      ],
      [
        <AntdFormItem label={transferLanguage('CoList.field.shipToWmCode', language)} code="shipToWmCode"
          initialValue={selectDetails ? selectDetails.shipToWmCode : ''}
          rules={[{ required: true }]}
          {...commonParams}
        >
          <Input disabled={disabled} />

        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('CoList.field.toCountry', language)} code="toCountryName"
          initialValue={selectDetails ? selectDetails.toCountryName : ''}
          rules={[{ required: true }]}
          {...commonParams}
        >
          {/* <Input disabled={true} /> */}
          <SearchSelect
            disabled={disabled}
            dataUrl={'/mds-country/selectMdsCountryList'}
            selectedData={toCountryId} // 选中值
            showValue="name"
            searchName="name"
            multiple={false}
            columns={_SelectColumns}
            onChange={values => this.getValue(values, 'toCountryId')}
            id="toCountryId"
            allowClear={true}
            scrollX={200}
          />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage('CoList.field.toState', language)} code="altshiptostate"
          initialValue={selectDetails ? selectDetails.altshiptostate : ''}
          {...commonParams}
        >
          <Input disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('CoList.field.toCity', language)} code="altshiptocity"
          initialValue={selectDetails ? selectDetails.altshiptocity : ''}
          {...commonParams}
        >
          <Input disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage('CoList.field.toZip', language)} code="altshiptopostcode"
          initialValue={selectDetails ? selectDetails.altshiptopostcode : ''}
          {...commonParams}
        >
          <Input disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('CoList.field.contactorName', language)} code="altshiptocontactor"
          initialValue={selectDetails ? selectDetails.altshiptocontactor : ''}
          {...commonParams}
        >
          <Input disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage('CoList.field.email', language)} code="altshiptoemail"
          initialValue={selectDetails ? selectDetails.altshiptoemail : ''}
          {...commonParams}
        >
          <Input disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('CoList.field.telephone', language)} code="altshiptophone"
          initialValue={selectDetails ? selectDetails.altshiptophone : ''}
          {...commonParams}
        >
          <Input disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage('CoList.field.address', language)} code="altshiptoadd"
          initialValue={selectDetails ? selectDetails.altshiptoadd : ''}
          {...commonParams}
        >
          <Input disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('CoList.field.shippingInstruction', language)} code="shippinginstr"
          initialValue={selectDetails ? selectDetails.shippinginstr : ''}
          {...commonParams}
        >
          <Input disabled={disabled} />
        </AntdFormItem>,

      ],
      [
        <AntdFormItem label={transferLanguage('CoList.field.deliveryInstruction', language)} code="servicedelinstr"
          initialValue={selectDetails ? selectDetails.servicedelinstr : ''}
          {...commonParams}
        >
          <Input disabled={disabled} />
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
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.coNo', language)}>
                        {getFieldDecorator('coNo', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.coNo : '',
                        })(<Input placeholder="" disabled={true} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.status', language)}>
                        {getFieldDecorator('status', {
                          initialValue: selectDetails ? selectDetails.status : '',
                        })(<Input disabled={true} />)}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.type', language)}>
                        {getFieldDecorator('billTypeId', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.billTypeId : '',
                        })(
                          <SearchSelect
                            disabled={disabled}
                            dataUrl={'mds-bill-type/selectMdsBillTypeList'}
                            selectedData={billTypeId} // 选中值
                            showValue="name"
                            searchName="name"
                            multiple={false}
                            columns={_SelectColumns}
                            onChange={values => this.getValue(values, 'billTypeId')}
                            id="type"
                            allowClear={true}
                            scrollX={200}
                            payload={{ businessType: ['CO', 'GOOD_SCRAP', 'BUY_BACK', 'SELL'] }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.soDate', language)}>
                        {getFieldDecorator('soreleasedate', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails && selectDetails.soreleasedate ? moment(selectDetails.soreleasedate) : '',
                        })(
                          <AntdDatePicker showTime disabled={disabled}
                            placeholder={transferLanguage('Common.field.selectDate', language)} />
                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.soNo', language)}>
                        {getFieldDecorator('soNo', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.soNo : '',
                        })(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.soType', language)}>
                        {getFieldDecorator('serviceordertype', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.serviceordertype : '',
                        })(
                          <Input disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.soPriority', language)}>
                        {getFieldDecorator('soprioritycode', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.soprioritycode : '',
                        })(
                          <Input disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.sodType', language)}>
                        {getFieldDecorator('deliveryType', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.deliveryType : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.serviceLevel', language)}>
                        {getFieldDecorator('servicelevel', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.servicelevel : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.shippingMethod', language)}>
                        {getFieldDecorator('shippingmethod', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.shippingmethod : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoDetailList.field.premierCustomer', language)}>
                        {getFieldDecorator('pmcustomerind', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.pmcustomerind : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.pieceQty', language)}>
                        {getFieldDecorator('pieceQty', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.pieceQty : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    {/* <Col {..._col}>
                      <Form.Item label={transferLanguage('CoDetailList.field.brandGroup', language)}>
                        {getFieldDecorator('brandGroup', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.pmcustomerind : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col> */}
                    {/* <Col {..._col}>
                      <Form.Item label={transferLanguage('CoDetailList.field.CRUDSWAP', language)}>
                        {getFieldDecorator('sodeliverytype', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.pmcustomerind : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col> */}

                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoDetailList.field.openQty', language)}>
                        {getFieldDecorator('openQty', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.openQty : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.grossWeight', language)}>
                        {getFieldDecorator('totalGrossWeight', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.totalGrossWeight : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.netWeight', language)}>
                        {getFieldDecorator('totalNetWeight', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.totalNetWeight : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.volume', language)}>
                        {getFieldDecorator('totalVolume', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.totalVolume : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.soTime', language)}>
                        {getFieldDecorator('soreleasedate', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.soreleasedate : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoList.field.committedTime', language)}>
                        {getFieldDecorator('committedsericedat', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.committedsericedat : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoDetailList.field.coverageHours', language)}>
                        {getFieldDecorator('covhours', {
                          initialValue: selectDetails ? selectDetails.covhours : '',
                        })(
                          <Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('CoDetailList.field.commitedsericetw', language)}>
                        {getFieldDecorator('commitedsericetw', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.commitedsericetw : '',
                        })(
                          <Input placeholder="" disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>

              </div>
            </Panel>
            <Panel header={transferLanguage('Common.field.product', language)} key='2' style={customPanelStyle}>
              <AntdForm>{formItemFragement(formItem)}</AntdForm>
            </Panel>
            <Panel header={transferLanguage('Common.field.shipFromTo', language)} key='3' style={customPanelStyle}>
              <AntdForm >{formItemFragement(formItemShip)}</AntdForm>
            </Panel>
           {currentId&& <Panel header={transferLanguage('shippingDetail.field.coDetailId', language)} key="4" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={selectList}
                  columns={CODetailsColumns}
                  onSelectRow={this.handleSelectRows}
                  hideDefaultSelections={true}
                  className={this.chassName}
                  code={codes.page}
                />
              </div>
            </Panel>}

          </Collapse>
        </PageHeaderWrapper>

        {modalVisible && <DeliveryFormModal {...deliveryParams} />}
        {visible && <AdModal
          visible={visible}
          title={transferLanguage(remarkType === 'sendRemark' ? 'CoDetailList.button.sendRemark' : 'CoDetailList.button.forceClose', language)}
          onOk={() => this.sendRemark()}
          onCancel={() => this.setState({ visible: !visible })}
          width='600px'

        >
          <div>
            <AntdFormItem label={transferLanguage(remarkType === 'sendRemark' ? 'CoDetailList.button.sendRemark' : 'CoDetailList.button.forceClose', language)}
              code="sendRemark"
              {...commonParams}
            >
              <Input.TextArea rows={2} />
            </AntdFormItem>
          </div>
        </AdModal>}
      </div>
    );
  }
}
