import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Form, Input, Select, Row, Col } from 'antd';
import StandardTable from '@/components/StandardTable';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import AdButton from '@/components/AdButton';
import TableButtons from '@/components/TableButtons';
import { codes, SelectColumns, SelectColumns1, Status, typeStatus } from './utils';
import AdSelect from '@/components/AdSelect';
import { transferLanguage } from '@/utils/utils';
import SearchSelect from '@/components/SearchSelect';
import FileImport from '@/components/FileImport'
import AntdDatePicker from '@/components/AntdDatePicker';
import { editRow, editCol, } from '@/utils/constans';
import {allDictList} from '@/utils/common'
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

@ManageList
@connect(({ wmspo, common, component, loading, i18n }) => ({
  wmspo,
  loading: loading.effects['wmspo/wmspoList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
  language: i18n.language
}))
@Form.create()
export default class WmsPoList extends Component {
  state = {
    listCol: {
      md: 12, sm: 24
    },
    expandForm: false,
    selectedRows: [],
    checkId: '',
    checkIds: [],
    formValues: {},
    isAbled: '',
    shipFromWmCode: [],
    _SelectColumns: [],
    _SelectColumns1: [],
    _Status: [],
    _typeStatus: [],
    visibleFile: false,
    visibleInfoFile: false,
    billType: [{ code: '', name: '', id: '' }],
    billTypeName: [],
    fromCountryId: [],
    shipToWmCode: [],
    consigner: [{ code: '', name: '', id: '' }],
    consignee: [{ code: '', name: '', id: '' }],
  };
  className = 'wmspo';
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
      title: transferLanguage('PoList.field.poNo', this.language),
      //数据字段
      dataIndex: 'poNo',
      render: (text, record) => (
        <a onClick={e => this.handleEdit(e, record)} title={text}>
          {text}
        </a>
      ),
    },

    {
      // title: '状态',
      title: transferLanguage('PoList.field.status', this.language),
      dataIndex: 'status',
      render: text => <span title={text}>{text}</span>,
      width: 80
    },
    {
      // title: '类型',
      title: transferLanguage('Common.field.type', this.language),
      dataIndex: 'type',
      render: text => <span title={text}>{text}</span>,
      width: 60,

    },
    {
      // title: '类型',
      title: transferLanguage('InventoryReport.field.so', this.language),
      dataIndex: 'soNo',
      width: 100,
      render: text => <span title={text}>{text}</span>,
    },

    {
      // title: 'pcs数',
      title: transferLanguage('PoList.field.pieceQty', this.language),
      dataIndex: 'pieceQty',
      render: text => <AdSelect value={text} onlyRead={true} />,
      width: 60,

    }, {
      // title: '未收货',
      title: transferLanguage('PoList.field.openQty', this.language),
      dataIndex: 'openQty',
      // render: text => <AdSelect value={text} onlyRead={true} />,
      width: 70,

    },
    {
      // title: '类型',
      title: transferLanguage('PoDetailList.field.partNo', this.language),
      dataIndex: 'partNo',
      render: text => <span title={text}>{text}</span>,
      width: 100,

    },
    {
      // title: '类型',
      title: transferLanguage('PoList.field.type', this.language),
      dataIndex: 'billTypeName',
      render: text => <span title={text}>{text}</span>,
    }, {
      // title: '始发地',
      title: transferLanguage('PoList.field.shipFrom', this.language),
      dataIndex: 'shipFromWmCode',
      render: text => <span title={text}>{text}</span>,
    }, {
      // title: '始发国',
      title: transferLanguage('PoList.field.fromCountry', this.language),
      dataIndex: 'fromCountryName',
      render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
    },
    {
      // title: '目的地',
      title: transferLanguage('PoList.field.shipTo', this.language),
      dataIndex: 'shipToWmCode',
      render: text => <span>{text}</span>,
    },
    {
      // title: '目的国',
      title: transferLanguage('PoList.field.toCountry', this.language),
      dataIndex: 'toCountryName',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '发货人',
      title: transferLanguage('PoList.field.consigner', this.language),
      dataIndex: 'consigner',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '收货人',
      title: transferLanguage('PoList.field.consignee', this.language),
      dataIndex: 'consignee',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },

    {
      // title: '类型',
      title: transferLanguage('PoDetailList.field.prNo', this.language),
      dataIndex: 'prId',
      render: text => <span title={text}>{text}</span>,
    },
    {
      // title: '类型',
      title: transferLanguage('PoDetailList.field.bolNo', this.language),
      dataIndex: 'bolNo',
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: transferLanguage('PoDetailList.field.dn', this.language),
      dataIndex: 'dn',
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: transferLanguage('PoList.field.fileName', this.language),
      dataIndex: 'fileName',
      render: (text, record) => <a onClick={() => this.getFileUrl(record.fileToken, record)} title={text}>{text}</a>,
    },
    {
      // title: '创建人名称',
      title: transferLanguage('PoList.field.createBy', this.language),
      dataIndex: 'createBy',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '创建时间',
      title: transferLanguage('PoList.field.createTime', this.language),
      dataIndex: 'createTime',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '修改人名称',
      title: transferLanguage('PoList.field.updateBy', this.language),
      dataIndex: 'updateBy',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // title: '修改时间',
      title: transferLanguage('PoList.field.updateTime', this.language),
      dataIndex: 'updateTime',
      render: text => <AdSelect value={text} onlyRead={true} />,
    }
  ];

  // 模块渲染后的 todo
  componentDidMount() {

    this.getWmsPoList();
    this.changeTitle(SelectColumns, "_SelectColumns")
    this.changeTitle(Status, "_Status")
    this.changeTitle(typeStatus, "_typeStatus")
    this.changeTitle(SelectColumns1, "_SelectColumns1")
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
  getValue = (values, type) => {
    this.setState({
      [type]: values,
    });
  };
  //点击文件名 下载文件
  getFileUrl = (fileToken, record) => {
    let readName = '/server/api/attachment/viewpage'
    let token = localStorage.getItem('token')
    let url = `http://${window.location.host}${readName}?token=${token}&fileToken=${fileToken}`
    window.location.href = url
  }
  // 调用接口获取数据
  getWmsPoList = (params = {}) => {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: 'wmspo/wmspoList',
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
      shipFromWmCode: [],
      fromCountryId: [],
      shipToWmCode: [],
      // toCountryId: [],
    });
    this.getWmsPoList();
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
    const { shipFromWmCode, billTypeName, fromCountryId, shipToWmCode, createTime, ...value } = values;
    if (shipFromWmCode && shipFromWmCode.length > 0) value.shipFromWmCode = shipFromWmCode[0].code
    if (billTypeName && billTypeName.length > 0) value.billTypeId = billTypeName[0].id
    if (fromCountryId && fromCountryId.length > 0) value.fromCountryId = fromCountryId[0].id
    if (shipToWmCode && shipToWmCode.length > 0) value.shipToWmCode = shipToWmCode[0].code
    if (createTime && createTime.length > 0) {
      value.createTimeStart = moment(createTime[0]).format('YYYY-MM-DD');
      value.createTimeStart +=' 00:00:00'
      value.createTimeEnd = moment(createTime[1]).format('YYYY-MM-DD');
      value.createTimeEnd +=' 23:59:59'
    }else {
      value.createTimeStart = ''
      value.createTimeEnd = ''
    }
    this.setState({
      formValues: value,
    });
    this.getWmsPoList(value);
  };

  //新建
  handleAdd = () => {
    const { dispatch } = this.props;
    router.push(`/order/listWmsPo/addWmsPo`);
  };

  // 分页操作：改参数
  handleStandardTableChange = param => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.getWmsPoList(params);
  };

  //编辑：
  handleEdit = (e, record) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { id } = record;

    dispatch({
      type: 'wmspo/wmspoDetails',
      payload: { id },
      callback: res => {
        this.setState({
          isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
        });
      },
    });
    router.push(`/order/listWmsPo/editWmsPo/${id}`);
  };

  //启用、禁用：
  abledStatus = (type, isSingle) => {
    const { dispatch } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = isSingle ? [checkId] : checkIds;
    params.type = type;
    dispatch({
      type: 'wmspo/ableOperate',
      payload: params,
      callback: res => {
        this.getWmsPoList(formValues);

        if (isSingle) {
          this.props.dispatch({
            type: 'wmspo/wmspoDetails',
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
  handleImportFile = () => {
    this.setState({
      visibleFile: false
    })
  }
  exportPo = () => {
    const { formValues } = this.state
    const { dispatch } = this.props
    console.log('导出---', formValues)
    dispatch({
      type: 'wmspo/exportPo',
      payload: formValues,
    })
  }
  print = () => {
    const { checkIds, selectedRows } = this.state
    const { dispatch } = this.props
    let id = selectedRows[0]?.id
    dispatch({
      type: 'common/setPrint',
      payload: { ids: checkIds },
      callback: data => {
        router.push(`/print/${id}/PO_ODM`);
      }
    })
  }
  render() {
    const {
      loading,
      wmspo: { wmspoList, wmspoDetails },
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
      visibleFile,
      visibleInfoFile,
      billType,
      _Status,
      _typeStatus,
      _SelectColumns,
      billTypeName,
      fromCountryId,
      shipToWmCode,
      listCol,
      consigner,
      consignee,
      _SelectColumns1,
    } = this.state;

    const selectDetails = wmspoDetails[checkId];

    // 设置查询条件
    const firstFormItem = (
      <FormItem label={transferLanguage('PoList.field.poNo', this.language)}>
        {getFieldDecorator('poNo')(<TextArea rows={1} />)}
      </FormItem>
    );
    const secondFormItem = (
      <FormItem label={transferLanguage('CoList.field.bizSoNo', this.language)}>
        {getFieldDecorator('soNo')(<TextArea rows={1} />)}
      </FormItem>

    );

    // secondForm 参数
    const otherFormItem = [
      [
        <FormItem label={transferLanguage('PoDetailList.field.prNo', this.language)}>
          {getFieldDecorator('prId')(<TextArea rows={1} />)}
        </FormItem>

      ],
      [<FormItem label={transferLanguage('PoDetailList.field.bolNo', this.language)}>
        {getFieldDecorator('bolNo')(<TextArea rows={1} />)}
      </FormItem>,
      <FormItem label={transferLanguage('PoDetailList.field.dn', this.language)} >
        {getFieldDecorator('dn')(<TextArea rows={1} />)}
      </FormItem>,
      <FormItem label={transferLanguage('PoList.field.status', this.language)}>
        {getFieldDecorator('status')(
          <AdSelect mode="multiple" payload={{code:allDictList.PO_Status}}/>
        )}
      </FormItem>
      ],
      [
        <FormItem label={transferLanguage('Common.field.type', this.language)}>
          {getFieldDecorator('type')(
            <AdSelect mode="multiple" payload={{code:allDictList.PO_Type}}/>

          )}
        </FormItem>,
        <FormItem label={transferLanguage('PoList.field.type', this.language)}>
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
              payload={{ businessType: ['PO', 'CON'] }}
            />
          )}
        </FormItem>,
        <FormItem label={transferLanguage('PoList.field.shipFrom', this.language)}>
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
        </FormItem>
      ],
      [
        <FormItem label={transferLanguage('PoList.field.fromCountry', this.language)}>
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

        <FormItem label={transferLanguage('PoList.field.consigner', this.language)}>
          {getFieldDecorator('consigner')(<Input />)}
        </FormItem>,
        <FormItem label={transferLanguage('PoList.field.shipTo', this.language)}>
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
        <FormItem label={transferLanguage('Common.field.createDate', this.language)}>
          {getFieldDecorator('createTime')(
            <AntdDatePicker mode="range" placeholder={[transferLanguage('Common.field.createStartTime', language), transferLanguage('Common.field.createEndTime', language)]} />
          )}
        </FormItem>,
        <FormItem label={transferLanguage('PoDetailList.field.partNo', this.language)}>
          {getFieldDecorator('partNo')(
            <TextArea rows={1} />
          )}
        </FormItem>,
        <FormItem label={transferLanguage('PoList.field.fileName', this.language)}>
          {getFieldDecorator('fileName')(
            <Input />
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
      quickQuery: true,
    };
    const tableButtonsParams = {
      code: codes.add,
      show: true,
      handleAdd: this.handleAdd,
      // selectedLength: selectedRows.length,
      // selectAllText:'选择全部导出',
      rightButtons: (
        <Button.Group>
          <AdButton
            code={codes.import}
            text={transferLanguage('Common.field.import GI,Invoice,DN', this.language)}
            onClick={() => this.setState({ visibleInfoFile: true })} />
          <AdButton
            code={codes.import}
            text={transferLanguage('Common.field.import', this.language)}
            onClick={() => this.setState({ visibleFile: true })} />
          <AdButton
            code={codes.export}
            text={transferLanguage('Common.field.export', this.language)}
            onClick={() => this.exportPo()} />
          <AdButton
            code={codes.export}
            disabled={selectedRows.length > 0 ? false : true}
            text={transferLanguage('PoList.button.ODMPo', this.language)}
            onClick={() => this.print()} />
        </Button.Group>
      ),
      buttons: (
        <Button.Group>
          <AdButton
            code={codes.cancel}
            onClick={() => this.abledStatus('obsolete')}
            disabled={selectedRows.length > 0 ? false : true}
            text={transferLanguage('PoList.button.obsolete', this.language)}
          />
        </Button.Group>
      ),
      selectedRows: selectedRows,
    };
    return (
      <Fragment>
        <FileImport
          visibleFile={visibleInfoFile}
          handleCancel={() =>this.setState({visibleInfoFile:false})}
          urlImport={`wms-po/importUpdateWmsPoDetail`}
          urlCase={`template/download?fileName=po_import_infp_update_template.xlsx`}
          queryData={[this.getWmsPoList]}
          accept=".xls,.xlsx"
        />

        <FileImport
          visibleFile={visibleFile}
          handleCancel={() => {
            this.handleImportFile();
          }}
          urlImport={`wms-po/importWmsPo`}
          urlCase={`wms-po/download`}
          queryData={[this.getWmsPoList]}
          accept=".xls,.xlsx"
          // form={this.props.form}
          importPayload={{ referenceBillType: billType[0].id, consigner: consigner[0]?.code, consignee: consignee[0]?.code }}
          extra={(<div style={{ width: 600, marginBottom: 10 }} >
            <Row gutter={editRow}>
              <Col >
                <Form.Item label={transferLanguage('PoList.field.type', language)}>
                  <SearchSelect
                    dataUrl={'/mds-bill-type/selectMdsBillTypeList'}
                    selectedData={billType} // 选中值
                    showValue="name"
                    searchName="name"
                    multiple={false}
                    columns={_SelectColumns}
                    onChange={values => this.getValue(values, 'billType')}
                    id="type"
                    allowClear={true}
                    scrollX={200}
                    payload={{ businessType: ['PO', 'CON'] }}
                  />
                </Form.Item>
              </Col>

            </Row>
            <Row gutter={editCol}>
              <Col {...listCol}>
                <Form.Item label={transferLanguage('PoList.field.consigner', language)}>
                  <SearchSelect
                    dataUrl={'/wms-contact-unit/selectWmsContactUnitList'}
                    selectedData={consigner} // 选中值
                    showValue="name"
                    searchName="name"
                    multiple={false}
                    columns={_SelectColumns1}
                    onChange={values => this.getValue(values, 'consigner')}
                    id="consigner"
                    allowClear={true}
                    scrollX={200}
                    payload={{ contactType: ['SHIPPER'] }}

                  />
                </Form.Item>
              </Col>
              <Col {...listCol}>
                <Form.Item label={transferLanguage('PoList.field.consignee', language)}>
                  <SearchSelect
                    dataUrl={'/wms-contact-unit/selectWmsContactUnitList'}
                    selectedData={consignee} // 选中值
                    showValue="name"
                    searchName="name"
                    multiple={false}
                    columns={_SelectColumns1}
                    onChange={values => this.getValue(values, 'consignee')}
                    id="consignee"
                    allowClear={true}
                    scrollX={200}
                    payload={{ contactType: ['RECEIVER'] }}

                  />
                </Form.Item>
              </Col>
            </Row>
          </div>)}
        />
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={wmspoList}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onPaginationChange={this.handleStandardTableChange}
          expandForm={expandForm}
          className={this.className}
          code={codes.page}
        />
      </Fragment>
    );
  }
}
