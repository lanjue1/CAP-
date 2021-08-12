import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment'
import router from 'umi/router';
import { Button, Form, Input, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, SelectColumns, Status } from './utils';
import AdSelect from '@/components/AdSelect';
import { transferLanguage, columnConfiguration } from '@/utils/utils';
import SearchSelect from '@/components/SearchSelect';
import AntdDatePicker from '@/components/AntdDatePicker';
import Prompt from '@/components/Prompt';
import AdButton from '@/components/AdButton';
import FileImport from '@/components/FileImport'
import ButtonGroup from 'antd/lib/button/button-group';
import { allDictList } from '@/utils/common'

const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ sto, common, component, loading, i18n }) => ({
  sto,
  loading: loading.effects['sto/wmscoList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
  language: i18n.language
}))
@Form.create()
export default class WmsCoList extends Component {
  state = {
    visibleFile: false,
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
    billTypeId: [],
  };
  className = 'sto';
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
      title: transferLanguage('STOList.field.STONo', this.language),
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
    }, {
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
    this.setState({
      [type]: values,
    });
  };

  // 调用接口获取数据
  getWmsCoList = (params = {}) => {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: 'sto/wmscoList',
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
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
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
    const { shipFromWmCode, fromCountryId, shipToWmCode, toCountryId } = this.state
    const { createTime, soreleasedate, billTypeId, ...value } = values;
    if (shipFromWmCode && shipFromWmCode.length > 0) value.shipFromWmCode = shipFromWmCode[0].code;
    if (fromCountryId && fromCountryId.length > 0) value.fromCountryId = fromCountryId[0].id
    if (shipToWmCode && shipToWmCode.length > 0) value.shipToWmCode = shipToWmCode[0].code
    if (toCountryId && toCountryId.length > 0) value.toCountryId = toCountryId[0].id
    if (billTypeId && billTypeId.length > 0) value.billTypeId = billTypeId[0].id
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
    console.log('value-------', value)
    this.setState({
      formValues: value,
    });
    this.getWmsCoList(value);
  };

  //新建
  handleAdd = () => {
    const { dispatch } = this.props;
    router.push(`/order/sto/addSto`);
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
      type: 'sto/wmscoDetails',
      payload: { id },
      callback: res => {
        this.setState({
          isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
        });
      },
    });
    router.push(`/order/sto/editSto/${id}`);
  };

  //启用、禁用：
  abledStatus = (type, isSingle) => {
    const { dispatch } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = isSingle ? [checkId] : checkIds;
    params.type = type;
    dispatch({
      type: 'sto/ableOperate',
      payload: params,
      callback: res => {
        this.getWmsCoList(formValues);

        if (isSingle) {
          this.props.dispatch({
            type: 'sto/wmscoDetails',
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
      type: 'sto/lockingInventory',
      payload: { ids: selectedRows.length ? selectedRows.map(v => v.id) : [], type },
      callback: v => {
        this.getWmsCoList(formValues)
      }
    })
  }

  // 生成ASN
  generateShipping = (type) => {
    const { dispatch } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {
      ids:checkIds,
      type
    };
    
    dispatch({
      type: 'sto/generateShipping',
      payload: params,
      callback: res => {
        this.getWmsCoList(formValues);
        this.setState({selectedRows:[]})
      },
    });
  };

  //取消STO
  cancelSTO = () => {
    const { dispatch } = this.props;
    const { checkIds, formValues } = this.state;
    let params = {};
    params.ids = checkIds;
    dispatch({
      type: 'sto/cancelSTO',
      payload: params,
      callback: res => {
        this.getWmsCoList(formValues);
      },
    });
  }
  handleImportFile = () => {
    this.setState({
      visibleFile: false
    })
  }
  render() {
    const {
      loading,
      sto: { wmscoList, wmscoDetails },
      form,
      isMobile,
      dictObject
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
      billTypeId,
      visibleFile,
    } = this.state;

    const selectDetails = wmscoDetails[checkId];
    const foo=()=>{
      let a =0
      console.log('aaaaa',a)
      return function(){
        console.log('bbbb',++a)
        return ++a
      }
    }
    foo()
   const AA= function() {
      for (var i = 0; i < 5; i++) { 
        console.warn('count'); 
      }
    }
    AA()
    // const boo=foo()
    // console.log('booo',boo(),boo())
    // 设置查询条件
    const firstFormItem = (
      <FormItem label={transferLanguage('STOList.field.STONo', this.language)}>
        {getFieldDecorator('bizCoNo')(<Input placeholder='' />)}
      </FormItem>
    );
    const secondFormItem = (
      <FormItem label={transferLanguage('CoList.field.bizSoNo', this.language)}>
        {getFieldDecorator('bizSoNo')(<Input placeholder='' />)}
      </FormItem>

    );

    // secondForm 参数
    const otherFormItem = [
      [
        <FormItem label={transferLanguage('CoList.field.status', this.language)}>
          {getFieldDecorator('status')(
            <AdSelect payload={{ code: allDictList.CO_Status }} mode="multiple" />
          )}
        </FormItem>,
      ],
      [
        <FormItem label={transferLanguage('CoList.field.type', this.language)}>
          {getFieldDecorator('billTypeId')(
            <SearchSelect
              dataUrl={'/mds-bill-type/selectMdsBillTypeList'}
              selectedData={billTypeId} // 选中值
              showValue="name"
              searchName="name"
              multiple={false}
              columns={_SelectColumns}
              onChange={values => this.getValue(values, 'billTypeId')}
              // id="type"
              allowClear={true}
              scrollX={200}
              payload={{ businessType: ['STO'] }}
            />
          )}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.soType', this.language)}>
          {getFieldDecorator('serviceordertype')(<Input placeholder='' />)}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.toState', this.language)}>
          {getFieldDecorator('altshiptostate')(<Input placeholder='' />)}
        </FormItem>,
      ],
      [

        <FormItem label={transferLanguage('CoList.field.sodType', this.language)}>
          {getFieldDecorator('sodeliverytype')(
            <AdSelect payload={{ code: allDictList.CO_SodType }} />
          )}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.shipFrom', this.language)}>
          {getFieldDecorator('shipFromWmCode')(
            <SearchSelect
              disabled={false}
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
          )}
        </FormItem>,
        <FormItem label={transferLanguage('CoList.field.fromCountry', this.language)}>
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
        </FormItem>
      ],
      [

        <FormItem label={transferLanguage('CoList.field.orderDate', this.language)}>
          {getFieldDecorator('createTime')(
            <AntdDatePicker mode="range" />
          )}
        </FormItem>,

        <FormItem label={transferLanguage('CoList.field.shipTo', this.language)}>
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
        <FormItem label={transferLanguage('CoList.field.toCountry', this.language)}>
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
      ],

      [


        <FormItem label={transferLanguage('CoList.field.soDate', this.language)}>
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
      rightButtons: (
        <Button.Group>
          <AdButton
            code={codes.lock}
            text={transferLanguage('Common.field.import', this.language)}
            onClick={() => this.setState({ visibleFile: true })}
          />
        </Button.Group>
      ),
      buttons: (
        <Button.Group>
          <AdButton
            code={codes.lock}
            text={transferLanguage('CoList.button.lockingInventory', this.language)}
            onClick={() => this.lockInvertory()}
            disabled={selectedRows.length > 0 ? false : true}
          />
          <AdButton
            code={codes.unlock}
            text={transferLanguage('CoList.button.unLockingInventory', this.language)}
            onClick={() => this.lockInvertory('unLock')}
            disabled={selectedRows.length > 0 ? false : true}
          />

          <AdButton
            code={codes.generateOB}
            text={transferLanguage('CoDetailList.field.generate', this.language)}
            onClick={() => this.generateShipping('generate')}
            disabled={selectedRows.length > 0 ? false : true}
          />

          <AdButton
            text={transferLanguage('Common.field.cancel', this.language)}
            code={codes.cancel}
            onClick={() => this.cancelSTO()}
            disabled={selectedRows.length > 0 ? false : true}
          />
          <AdButton
            code={codes.autoDis}
            text={transferLanguage('CoDetailList.field.autoDistribution',this. language)}
            onClick={() => this.generateShipping('autoDistribution')}
            disabled={selectedRows.length > 0 ? false : true}
          />
        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    return (
      <Fragment>
        <FileImport
          visibleFile={visibleFile}
          handleCancel={() => {
            this.handleImportFile();
          }}
          urlImport={`wms-co/importSTO`}
          urlCase={`template/download?fileName=STO(HIC_DC_to_HIC_DC).xlsx`}
          queryData={[this.getWmsCoList]}
          accept=".xls,.xlsx"
        />
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
        // disabledSelectedRows={{
        //   code: ['status'],
        //   value: ['OPEN', "ON_HOLD", ]
        // }}
        // getCheckboxProps={record => {
        //   let disabled = record.status == "OPEN" || record.status == "ON_HOLD"
        //   return !disabled
        // }}
        />
      </Fragment>
    );
  }
}
