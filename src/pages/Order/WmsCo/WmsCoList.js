import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment'
import router from 'umi/router';
import { Button, Form, Input, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, SelectColumns, Status ,sodTypeData} from './utils';
import AdSelect from '@/components/AdSelect';
import { transferLanguage, columnConfiguration } from '@/utils/utils';
import SearchSelect from '@/components/SearchSelect';
import AntdDatePicker from '@/components/AntdDatePicker';
import Prompt from '@/components/Prompt';
import FileImport from '@/components/FileImport'
import AdButton from '@/components/AdButton';
import {allDictList} from '@/utils/common'
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ wmsco, common, component, loading, i18n }) => ({
  wmsco,
  loading: loading.effects['wmsco/wmscoList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
  language: i18n.language
}))
@Form.create()
export default class WmsCoList extends Component {
  state = {
    expandForm: false,
    selectedRows: [],
    checkId: '',
    checkIds: [],
    formValues: {},
    isAbled: '',
    shipFromWmCode: [],
    fromCountryId: [],
    shipToWmCode: [],
    toCountryId: [],
    _Status: [],
    _SelectColumns: [],
    billTypeName: [],
    visibleETA: false,
    visibleBuyBack:false,
  };
  className = 'wmsco';
  language = this.props.language
  //列表 列
  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => (<span>{index + 1}</span>),
      width: 50
    },
    {
      //标题
      // title : '单号'
      title: transferLanguage('CoList.field.coNo', this.language),
      //数据字段
      dataIndex: 'coNo',
      render: (text, record) => (
        <a onClick={e => this.handleEdit(e, record)} title={text}>
          {text}
        </a>
      ),
    },
    {
      // title: '状态',
      title: transferLanguage('CoList.field.status', this.language),
      dataIndex: 'status',
      render: text => <span title={text}>{text}</span>,
    }, {
      // title: '类型',
      title: transferLanguage('CoList.field.type', this.language),
      dataIndex: 'billTypeName',
      render: text => <span title={text}>{text}</span>,
    }, {
      // title: '类型',
      title: transferLanguage('CoList.field.soNo', this.language),
      dataIndex: 'soNo',
      render: text => <span title={text}>{text}</span>,
    },
    {
      // title: '始发地',
      title: transferLanguage('CoList.field.shipFrom', this.language),
      dataIndex: 'shipFromWmCode',
      render: text => <span title={text}>{text}</span>,
    }, {
      // title: '始发国',
      title: transferLanguage('CoList.field.fromCountry', this.language),
      dataIndex: 'fromCountryName',
      render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
    },
    {
      // title: '始发国',
      title: transferLanguage('PoDetailList.field.eta', this.language),
      dataIndex: 'eta',
      // render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
    }, {
      // title: '始发国',
      title: transferLanguage('PoDetailList.field.etd', this.language),
      dataIndex: 'etd',
      // render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
    },
    {
      // title: 'pcs数',
      title: transferLanguage('CoList.field.pieceQty', this.language),
      dataIndex: 'pieceQty',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '未收货',
      title: transferLanguage('CoList.field.openQty', this.language),
      dataIndex: 'openQty',
      // render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '未收货',
      title: transferLanguage('CoList.field.soType', this.language),
      dataIndex: 'serviceordertype',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '未收货',
      title: transferLanguage('CoList.field.soPriority', this.language),
      dataIndex: 'soprioritycode',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '未收货',
      title: transferLanguage('CoList.field.sodType', this.language),
      dataIndex: 'deliveryType',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '第一客户',
      title: transferLanguage('CoDetailList.field.premierCustomer', this.language),
      dataIndex: 'pmcustomerind',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      title: transferLanguage('CoList.field.serviceLevel', this.language),
      dataIndex: 'servicelevel',
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: transferLanguage('CoList.field.committedTime', this.language),
      dataIndex: 'committedsericedate',
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: transferLanguage('CoList.field.soTime', this.language),
      dataIndex: 'soreleasedate',
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: transferLanguage('CoList.field.shippingMethod', this.language),
      dataIndex: 'shippingmethod',
      render: text => <span title={text}>{text}</span>,
    },
    // {
    //   title: transferLanguage('CoList.field.pouId', language),
    //   dataIndex: 'sellerid',
    //   render: text => <span title={text}>{text}</span>,
    // },
    // {
    //   title: transferLanguage('CoList.field.pouName', language),
    //   dataIndex: 'sellername',
    //   render: text => <span title={text}>{text}</span>,
    // },
    {
      title: transferLanguage('CoList.field.shipToId', this.language),
      dataIndex: 'altshipto',
      render: text => <span title={text}>{text}</span>,
    },
    {
      // title: '目的地',
      title: transferLanguage('CoList.field.shipToWmCode', this.language),
      dataIndex: 'shipToWmCode',
      render: text => <span>{text}</span>,
    },
    {
      // title: '目的国',
      title: transferLanguage('CoList.field.toCountry', this.language),
      dataIndex: 'altshiptocountry',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      title: transferLanguage('CoList.field.toState', this.language),
      dataIndex: 'altshiptostate',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      title: transferLanguage('CoList.field.toCity', this.language),
      dataIndex: 'altshiptocity',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      title: transferLanguage('CoList.field.toZip', this.language),
      dataIndex: 'altshiptopostcode',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '创建人名称',
      title: transferLanguage('CoList.field.createBy', this.language),
      dataIndex: 'createBy',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '创建时间',
      title: transferLanguage('CoList.field.createTime', this.language),
      dataIndex: 'createTime',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '修改人名称',
      title: transferLanguage('CoList.field.updateBy', this.language),
      dataIndex: 'updateBy',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '修改时间',
      title: transferLanguage('CoList.field.updateTime', this.language),
      dataIndex: 'updateTime',
      render: text => <AdSelect value={text} onlyRead={true} />,
    }
  ];

  // 模块渲染后的 todo
  componentDidMount() {

    this.getWmsCoList();
    this.setState({
      _Status: columnConfiguration(Status, this.props.language),
      _SelectColumns: columnConfiguration(SelectColumns, this.props.language)
    })
  }

  getValue = (values, type) => {
    console.log('getValue??', values, type)
    this.setState({
      [type]: values,
    });
  };

  // 调用接口获取数据
  getWmsCoList = (params = {}) => {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: 'wmsco/wmscoList',
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
  };

  //重置
  handleFormReset = () => {
    const { form, form: { getFieldValue }, dispatch } = this.props;
    const { formValues } = this.state
    this.setState({
      formValues: {},
      shipFromWmCode: [],
      fromCountryId: [],
      shipToWmCode: [],
      toCountryId: [],
    });
    this.getWmsCoList();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

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

  //查询
  handleSearch = values => {
    // const {     } = this.state
    const { toCountryId, fromCountryId, shipToWmCode, createTime, soreleasedate, shipFromWmCode, billTypeName, ...value } = values;
    if (shipFromWmCode && shipFromWmCode.length > 0) value.shipFromWmCode = shipFromWmCode[0].code;
    if (fromCountryId && fromCountryId.length > 0) value.fromCountryId = fromCountryId[0].id
    if (billTypeName && billTypeName.length > 0) value.billTypeId = billTypeName[0].id
    if (shipToWmCode && shipToWmCode.length > 0) value.shipToWmCode = shipToWmCode[0].code
    if (toCountryId && toCountryId.length > 0) value.toCountryId = toCountryId[0].id
    if (createTime && createTime.length > 0) {
      value.createTimeStart = moment(createTime[0]).format('YYYY-MM-DD');
      value.createTimeEnd = moment(createTime[1]).format('YYYY-MM-DD');
      value.createTimeStart +=' 00:00:00'
      value.createTimeEnd +=' 23:59:59'
    } else {
      value.createTimeStart = ''
      value.createTimeEnd = ''
    }
    if (soreleasedate && soreleasedate.length > 0) {
      value.soreleasedateStart = moment(soreleasedate[0]).format('YYYY-MM-DD');
      value.soreleasedateEnd = moment(soreleasedate[1]).format('YYYY-MM-DD');
      value.soreleasedateStart +=' 00:00:00'
      value.soreleasedateEnd +=' 23:59:59'
    } else {
      value.soreleasedateStart = ''
      value.soreleasedateEnd = ''
    }
    this.setState({
      formValues: value,
    });
    this.getWmsCoList(value);
  };

  //新建
  handleAdd = () => {
    const { dispatch } = this.props;
    router.push(`/order/listWmsCo/addWmsCo`);
  };

  // 分页操作：改参数
  handleStandardTableChange = param => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.getWmsCoList(params);
  };

  //编辑：
  handleEdit = (e, record) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { id } = record;
    dispatch({
      type: 'wmsco/wmscoDetails',
      payload: { id },
      callback: res => {
        this.setState({
          isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
        });
      },
    });
    router.push(`/order/listWmsCo/editWmsCo/${id}`);
    // router.push(`/order/listWmsCo/reportWmsCo/${id}`);
  };

  //启用、禁用：
  abledStatus = (type, isSingle) => {
    const { dispatch } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = isSingle ? [checkId] : checkIds;
    params.type = type;
    dispatch({
      type: 'wmsco/ableOperate',
      payload: params,
      callback: res => {
        this.getWmsCoList(formValues);
        this.setState({selectedRows:[]})

        if (isSingle) {
          this.props.dispatch({
            type: 'wmsco/wmscoDetails',
            payload: { id: checkId },
            callback: res => {
              this.setState({
                isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
              });
            },
          });
        }
      },
    });
  };
  lockInvertory = (type) => {
    const { selectedRows, formValues } = this.state
    const { dispatch } = this.props
    let lock = selectedRows.every(v => {
      return v.status === 'OPEN' || v.status === "ON_HOLD"
    })
    let unlock = selectedRows.every(v => { return v.status === 'ACCEPT' })
    if (!type && !lock) {
      Prompt({ content: "Status Must Be  'OPEN' Or 'ON_HOLD' ! ", type: 'warn' })
      return
    }
    if (type && !unlock) {
      Prompt({ content: "Status Must Be 'ACCEPT' ! ", type: 'warn' })
      return
    }
    dispatch({
      type: 'wmsco/lockingInventory',
      payload: { ids: selectedRows.length ? selectedRows.map(v => v.id) : [], type },
      callback: v => {
        this.getWmsCoList(formValues)
        this.setState({selectedRows:[]})

      }
    })
  }

  // 生成ASN
  generateShipping = (type) => {
    const { dispatch } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = checkIds;
    params.type = type
    dispatch({
      type: 'wmsco/generateShipping',
      payload: params,
      callback: res => {
        this.getWmsCoList(formValues);
        this.setState({selectedRows:[]})
      },
    });
  };
  handleImportFile = () => {
    this.setState({
      visibleETA: false
    })
  }
  render() {
    const {
      loading,
      wmsco: { wmscoList, wmscoDetails },
      form,
      isMobile,
      dictObject,
      language
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      selectedRows,
      isAbled,
      checkId,
      visible,
      rowDetails,
      expandForm,
      shipFromWmCode,
      fromCountryId,
      shipToWmCode,
      toCountryId,
      _Status,
      _SelectColumns,
      billTypeName,
      visibleETA,
      visibleBuyBack,
    } = this.state;

    const selectDetails = wmscoDetails[checkId];

    // 设置查询条件
    const firstFormItem = (
      <FormItem label={transferLanguage('CoList.field.coNo', language)}>
        {getFieldDecorator('bizCoNo')(<Input placeholder='' />)}
      </FormItem>
    );
    const secondFormItem = (
      <FormItem label={transferLanguage('CoList.field.bizSoNo', language)}>
        {getFieldDecorator('bizSoNo')(<TextArea rows={1} />)}
      </FormItem>

    );

    // secondForm 参数
    const otherFormItem = [
      [
        <FormItem label={transferLanguage('CoList.field.status', language)}>
          {getFieldDecorator('status')(
            <AdSelect payload={{code:allDictList.CO_Status}} mode="multiple"/>
          )}
        </FormItem>,
      ],
      [
        <FormItem label={transferLanguage('PoList.field.type', language)}>
          {getFieldDecorator('billTypeName')(
            <SearchSelect
              dataUrl={'/mds-bill-type/selectMdsBillTypeList'}
              selectedData={billTypeName} // 选中值
              showValue="name"
              searchName="name"
              multiple={false}
              columns={_SelectColumns}
              onChange={values => this.getValue(values, 'billTypeName')}
              id="billTypeName"
              allowClear={true}
              scrollX={200}
              payload={{ businessType: ['CO', 'GOOD_SCRAP', 'BUY_BACK', 'SELL','APRH_VIRTUAL_OUT'] }}
            />
          )}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.soType', language)}>
          {getFieldDecorator('serviceordertype')(
           <Input />
          )}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.soPriority', language)}>
          {getFieldDecorator('soprioritycode')(<Input placeholder='' />)}
        </FormItem>,
      ],
      [

        <FormItem label={transferLanguage('CoList.field.sodType', language)}>
          {getFieldDecorator('sodeliverytype')(
          <AdSelect payload={{code:allDictList.CO_SodType}}/>

          )}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.serviceLevel', language)}>
          {getFieldDecorator('servicelevel')(<Input placeholder='' />)}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.shipFrom', language)}>
          {getFieldDecorator('shipFromWmCode',
            {
              rules: [{ required: false, message: ' ' }],
              initialValue: ''
            }
          )(
            <SearchSelect
              dataUrl={'/wms-warehouse/selectWmsWarehouseList'}
              selectedData={shipFromWmCode} // 选中值
              multiple={false}
              showValue="name"
              searchName="name"
              columns={_SelectColumns}
              onChange={values => this.getValue(values, 'shipFromWmCode')}
              id="shipFromWmCode"
              allowClear={true}
              scrollX={200}
            />
          )}
        </FormItem>
      ],
      [
        <FormItem label={transferLanguage('CoList.field.fromCountry', language)}>
          {getFieldDecorator('fromCountryId')(
            <SearchSelect
              dataUrl={'/mds-country/selectMdsCountryList'}
              selectedData={fromCountryId} // 选中值
              showValue="name"
              searchName="name"
              multiple={false}
              columns={_SelectColumns}
              onChange={values => this.getValue(values, 'fromCountryId')}
              id="fromCountryId"
              allowClear={true}
              scrollX={200}
            />
          )}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.pouName', language)}>
          {getFieldDecorator('sellername')(<Input placeholder='' />)}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.shipTo', language)}>
          {getFieldDecorator('shipToWmCode')(
            <SearchSelect
              dataUrl={'/wms-warehouse/selectWmsWarehouseList'}
              selectedData={shipToWmCode} // 选中值
              showValue="name"
              searchName="name"
              multiple={false}
              columns={_SelectColumns}
              onChange={values => this.getValue(values, 'shipToWmCode')}
              id="shipToWmCode"
              allowClear={true}
              scrollX={200}
            />
          )}
        </FormItem>,
      ],

      [
        <FormItem label={transferLanguage('CoList.field.toCountry', language)}>
          {getFieldDecorator('toCountryId')(
            <SearchSelect
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
          )}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.toState', language)}>
          {getFieldDecorator('altshiptostate')(<Input placeholder='' />)}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.toCity', language)}>
          {getFieldDecorator('altshiptocity')(<Input placeholder='' />)}
        </FormItem>,

      ],
      [
        <FormItem label={transferLanguage('CoList.field.toZip', language)}>
          {getFieldDecorator('altshiptopostcode')(<Input placeholder='' />)}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.orderDate', language)}>
          {getFieldDecorator('createTime')(
            <AntdDatePicker mode="range" />
          )}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.soDate', language)}>
          {getFieldDecorator('soreleasedate')(
            <AntdDatePicker mode="range" />
          )}
        </FormItem>,
      ],
      ['operatorButtons',]
    ];
    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      otherFormItem,
      form,
      className: this.className,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      toggleForm: this.toggleForm,
      quickQuery: true
    };
    const tableButtonsParams = {
      code: codes.add,
      show: true,
      handleAdd: this.handleAdd,
      rightButtons:(
        <Button.Group>
          <AdButton
            code={codes.importBuyBack}
            text={transferLanguage('CoList.button.importBuyBack', language)}
            onClick={() => this.setState({visibleBuyBack:true})}
          />
        </Button.Group>
      ),
      buttons: (
        <Button.Group>
          <AdButton
            code={codes.lock}
            text={transferLanguage('CoList.button.lockingInventory', language)}
            onClick={() => this.lockInvertory()}
            disabled={selectedRows.length > 0 ? false : true}
          />
          <AdButton
            code={codes.unlock}
            text={transferLanguage('CoList.button.unLockingInventory', language)}
            onClick={() => this.lockInvertory('unLock')}
            disabled={selectedRows.length > 0 ? false : true}
          />

          <AdButton
            code={codes.generateOB}
            text={transferLanguage('CoDetailList.field.generate', language)}
            onClick={() => this.generateShipping('generate')}
            disabled={selectedRows.length > 0 ? false : true}
          />

          <AdButton
            code={codes.autoDis}
            text={transferLanguage('CoDetailList.field.autoDistribution', language)}
            onClick={() => this.generateShipping('autoDistribution')}
            disabled={selectedRows.length > 0 ? false : true}
          />

          <AdButton
            code={codes.cancel}
            text={transferLanguage('CoList.button.cancelOBNotice', language)}
            onClick={() => this.generateShipping('cancelOBNotice')}
            disabled={selectedRows.length === 1 ? false : true}
          />

          <AdButton
            code={codes.updateETA}
            text={transferLanguage('CoList.button.updateETA', language)}
            onClick={() => this.setState({ visibleETA: true })}
          // disabled={selectedRows.length === 1 ? false : true}
          />

        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    return (
      <Fragment>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={wmscoList}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onPaginationChange={this.handleStandardTableChange}
          expandForm={expandForm}
          className={this.className}
          code={codes.page}
        />
        <FileImport
          visibleFile={visibleETA}
          handleCancel={() => {
            this.handleImportFile();
          }}
          urlImport={`wms-co/importCoEta`}
          urlCase={`template/download?fileName=CAP_BO_ETA_template.xlsx`}
          queryData={[this.getWmsCoList]}
          accept=".xls,.xlsx"
        />
        <FileImport
          visibleFile={visibleBuyBack}
          handleCancel={() =>this.setState({visibleBuyBack:false})}
          urlImport={`wms-co/importBuyBack`}
          urlCase={`template/download?fileName=Buyback_Template.xlsx`}
          queryData={[this.getWmsCoList]}
          accept=".xls,.xlsx"
        />
      </Fragment>
    );
  }
}
