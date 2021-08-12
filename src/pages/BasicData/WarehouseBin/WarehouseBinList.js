import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Select } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdModal from '@/components/AdModal';
import AntdInput from '@/components/AntdInput';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import SearchSelect from '@/components/SearchSelect';
import FileImport from '@/components/FileImport'

import { transferLanguage, columnConfiguration } from "@/utils/utils";
import { formItemFragement, formatPrice, queryDict, allDictList } from '@/utils/common';

import {
  allDispatchType,
  columnsWare,
  codes,
  selectList,
  routeUrl,
  columns,
  typeStatus,
  isDecimal,
  ExceptStatus,
} from './utils';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ WarehouseBin, loading, component, i18n }) => ({
  WarehouseBin,
  warehouseBinList: WarehouseBin.warehouseBinList,
  dictObject: component.dictObject,
  searchValue: component.searchValue,

  loading: loading.effects[allDispatchType.list],
  language: i18n.language
}))
@Form.create()
export default class WarehouseBinList extends Component {
  className = 'warehouseBin';
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      detailId: '',
      visible: false,
      showRefresh: false,
      expandForm: false,
      selectedRows: [],
      columnsList: [],
      _columnsWare: [],
      storageType: [],
      warehouseArea: [],
      lineCount: '',
      visibleImport: false,

      storageType_1: [],
      warehouseArea_1: [],
    };
  }
  componentDidMount() {
    selectList({ props: this.props });
    let array = []
    array = columns.map(v => {
      v.title = transferLanguage(v.title, this.props.language)
      return v
    })
    this.setState({
      columnsList: array,
      _columnsWare: columnConfiguration(columnsWare, this.props.language)
    })
  }

  /**
   * form 查找条件 重置
   */
  handleFormReset = () => {
    const { form, } = this.props
    const props = { props: this.props };
    this.setState({
      formValues: {},
    });
    form.resetFields();
    // saveAllValues({ payload: { formValues: {} }, ...props });
    selectList({ ...props });
  };

  /**
   * form 查找条件 查询
   */
  handleSearch = formValues => {
    // if (!formValues) return;
    debugger
    const params = { props: this.props, payload: formValues };
    selectList(params);
    this.setState({ formValues })
  };

  /**
   * table 表格 分页操作
   */
  handleStandardTableChange = param => {
    const { formValues } = this.state;
    selectList({ payload: { ...formValues, ...param }, props: this.props });
  };

  // 选中行
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

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  //新建
  handleAdd = () => {
    router.push(routeUrl.add)
  }
  abledModal = () => {

  }

  getValue = (values, type) => {
    this.setState({
      [type]: values,
    });
  };

  //启用、禁用：
  abledStatus = (type) => {
    const { dispatch } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = checkIds;
    params.type = type
    const param = { props: this.props, payload: formValues };

    dispatch({
      type: allDispatchType.abled,
      payload: params,
      callback: res => {
        if (res.code === 0) {
          selectList({ ...param });
        }

      },
    });
  };
  handleOk = () => {
    const { form, dispatch } = this.props
    const { formValues } = this.state
    form.validateFields((errs, values) => {
      console.log('handleOk==>', values)
      const { storageTypeId, warehouseAreaNameId, ...value } = values
      value.storageTypeId = storageTypeId[0].id
      value.warehouseAreaId = warehouseAreaNameId[0].id
      dispatch({
        type: 'WarehouseBin/addBatch',
        payload: value,
        callback: data => {
          const param = { props: this.props, payload: formValues };
          selectList({ ...param });
          this.setState({ visible: false })
        }
      })

    })
  }

  print = (type) => {
    const { checkIds, selectedRows } = this.state
    const { dispatch } = this.props
    let id = selectedRows[0]?.id
    dispatch({
      type: 'common/setPrint',
      payload: { ids: checkIds },
      callback: data => {
        router.push(`/print/${id}/${type}`);
      }
    })
  }
  handleChange = selected => {
    const { form } = this.props
    this.setState({
      lineCount: selected
    })
    form.resetFields(['startLineCount']);
  }
  refreshRouteNo = () => {
    const { form, dispatch } = this.props
    const { formValues } = this.state

    form.validateFields((errs, values) => {
      if (!errs) {
        values['warehouseAreaId'] = values.warehouseArea[0].id
        dispatch({
          type: 'WarehouseBin/refreshRouteNo',
          payload: values,
          callback: data => {
            const param = { props: this.props, payload: formValues };
            selectList({ ...param });
            this.setState({ showRefresh: false })
          }
        })
      }
    })
  }

  render() {
    const { warehouseBinList, loading, form, language } = this.props;
    const {
      expandForm,
      selectedRows,
      columnsList,
      visible,
      showRefresh,
      storageType,
      warehouseArea,
      _columnsWare,
      lineCount,
      visibleImport,
      storageType_1,
      scaleType_1,
      binType_1,
      warehouseArea_1,

    } = this.state;
    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const firstFormItem = (
      <AntdFormItem label={transferLanguage('Bin.field.code', language)} code="code" {...commonParams}>
        <Input />
      </AntdFormItem>
    );
    const secondFormItem = (
      <AntdFormItem label={transferLanguage('Bin.field.warehouseAreaName', language)} code="areaName" {...commonParams}>
        <Input />
      </AntdFormItem>
    );
    const otherFormItem = [
      [
        <AntdFormItem label={transferLanguage('PutAwayDetail.field.status', language)} code="status" {...commonParams}>
          <AdSelect payload={{ code: allDictList.BasicData_Status }} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage('Bin.field.exception', language)} code="exception" {...commonParams}>
          <AdSelect payload={{ code: allDictList.Bin_Exception }} />
        </AntdFormItem>,
      ],
      ['operatorButtons'],
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

      // code: codes.select,
    };

    const tableButtonsParams = {
      handleAdd: this.handleAdd,
      code: codes.add,

      rightButtonsFist: (

        <Button.Group>
          <AdButton
            style={{ marginLeft: 8 }}
            onClick={() => this.setState({ showRefresh: !showRefresh })}
            text={transferLanguage('Bin.button.routeNoRefresh', language)}
            code={codes.addBatch}
          />
          <AdButton
            onClick={() => this.setState({ visibleImport: true })}
            text={transferLanguage('Common.field.import', language)}
            code={codes.addBatch}
          />
        </Button.Group>
      ),
      rightButtons: (

        <AdButton
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={() => this.setState({ visible: !visible })}
          text={transferLanguage('Bin.button.addBatch', language)}
          code={codes.addBatch}
        />
      ),
      buttons: (
        <Button.Group>
          <AdButton
            onClick={() => this.abledStatus('disabled')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.disabled}
            text={transferLanguage('Common.field.disable', this.props.language)} />
          <AdButton
            onClick={() => this.abledStatus('enable')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.enabled}
            text={transferLanguage('Common.field.enable', this.props.language)} />
          <AdButton onClick={() => this.print('BIN')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.print}
            text={transferLanguage('base.prompt.print', this.props.language)}
          />
          <AdButton onClick={() => this.print('BIN_BARCODE')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.printSmall}
            text={transferLanguage('Bin.button.printSmallLable', this.props.language)}
          />
          <AdButton onClick={() => this.print('BIN_LABLE')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.printBig}
            text={transferLanguage('Bin.button.printBigLable', this.props.language)}
          />
          <AdButton onClick={() => this.abledStatus('resetException')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.resetExcept}
            text={transferLanguage('Bin.button.resetException', this.props.language)}
          />
        </Button.Group>

      ),
      selectedRows: selectedRows,

    };
    const formImport = [
      [
        <AntdFormItem label={transferLanguage("partData.field.storageType", language)} code="storageTypeId_1"
          rules={[{ required: true }]}
          {...commonParams}>
          <SearchSelect
            dataUrl={'wms-storage-type/selectWmsStorageTypeList'}
            selectedData={this.state.storageType_1} // 选中值
            showValue="name"
            searchName="name"
            multiple={false}
            columns={_columnsWare}
            onChange={values => this.getValue(values, 'storageType_1')}
            id="storageType"
            allowClear={true}
            scrollX={200}
          />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.scaleType", language)} code="scaleType_1"
          rules={[{ required: true }]}
          {...commonParams}>
          <AdSelect data={isDecimal} isExist onChange={values => this.getValue(values, 'scaleType_1')} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage("InventoryList.field.binTypeCode", language)} code="binType_1"
          rules={[{ required: true }]}
          {...commonParams}>
          <AdSelect data={typeStatus} isExist={true} onChange={values => this.getValue(values, 'binType_1')} />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.warehouseAreaName", language)} code="warehouseAreaNameId_1"
          rules={[{ required: true }]}

          {...commonParams}>
          <SearchSelect
            dataUrl={'wms-warehouse-area/selectWmsWarehouseAreaList'}
            selectedData={this.state.warehouseArea_1} // 选中值
            showValue="name"
            searchName="name"
            multiple={false}
            columns={_columnsWare}
            onChange={values => this.getValue(values, 'warehouseArea_1')}
            id="warehouseAreaId"
            allowClear={true}
            scrollX={200}
          />
        </AntdFormItem>,
      ],
    ]
    const formItem = [
      [
        <AntdFormItem label={transferLanguage("partData.field.storageType", language)} code="storageTypeId"
          rules={[{ required: true }]}
          {...commonParams}>
          <SearchSelect
            dataUrl={'wms-storage-type/selectWmsStorageTypeList'}
            selectedData={storageType} // 选中值
            showValue="name"
            searchName="name"
            multiple={false}
            columns={_columnsWare}
            // onChange={values => this.getValue(values, 'storageType')}
            id="storageType"
            allowClear={true}
            scrollX={200}
          />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.scaleType", language)} code="scaleType"
          rules={[{ required: true }]}
          {...commonParams}>
          <AdSelect data={isDecimal} isExist />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage("InventoryList.field.binTypeCode", language)} code="binType"
          rules={[{ required: true }]}
          {...commonParams}>
          <AdSelect data={typeStatus} isExist={true} />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.warehouseAreaName", language)} code="warehouseAreaNameId"
          rules={[{ required: true }]}

          {...commonParams}>
          <SearchSelect
            dataUrl={'wms-warehouse-area/selectWmsWarehouseAreaList'}
            selectedData={warehouseArea} // 选中值
            showValue="name"
            searchName="name"
            multiple={false}
            columns={_columnsWare}
            // onChange={values => this.getValue(values, 'warehouseArea')}
            id="warehouseAreaId"
            allowClear={true}
            scrollX={200}
          />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage("Bin.field.rowStart", language)} code="rowStart"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.rowEnd", language)} code="rowEnd"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage("Bin.field.lineStart", language)} code="lineStart"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.lineEnd", language)} code="lineEnd"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage("Bin.field.tierStart", language)} code="tierStart"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.tierEnd", language)} code="tierEnd"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
      ],

    ]

    const formItemRefresh = [
      [
        
        <AntdFormItem label={transferLanguage("Bin.field.warehouseAreaName", language)} code="warehouseArea" rules={[{ required: true }]} {...commonParams}>
          <SearchSelect
            dataUrl={'wms-warehouse-area/selectWmsWarehouseAreaList'}
            showValue="name"
            searchName="name"
            multiple={false}
            columns={_columnsWare}
            // onChange={values => this.getValue(values, 'warehouseArea')}
            id="warehouseAreaId"
            allowClear={true}
            scrollX={200}
          />
        </AntdFormItem>
      ],
      [
        <AntdFormItem label={transferLanguage("Bin.field.rowStart", language)} code="lineNoStart"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.rowEnd", language)} code="lineNoEnd"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage("Bin.field.lineStart", language)} code="colNoStart"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.lineEnd", language)} code="colNoEnd"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage("Bin.field.initialValue", language)} code="routeInitialValue"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.direction", language)} code="direction"
          rules={[{ required: true }]}
          {...commonParams}>
          <Select>
            <Option value="1">{transferLanguage("Bin.field.Positive", language)}</Option>
            <Option value="2">{transferLanguage("Bin.field.Reverse", language)}</Option>
          </Select>
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage("Bin.field.SingleDoubleLine", language)} code="lineCount"
          rules={[{ required: true }]}
          {...commonParams}>
          <Select onChange={this.handleChange}>
            <Option value="1">{transferLanguage("Bin.field.SingleRow", language)}</Option>
            <Option value="2">{transferLanguage("Bin.field.DoubleRow", language)}</Option>
          </Select>
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.initialLine", language)} code="startLineCount"
          rules={[{ required: lineCount == 2 ? true : false }]}
          {...commonParams}>
          <Select disabled={lineCount == 2 ? false : true}>
            <Option value="1">{transferLanguage("Bin.field.SingleRow", language)}</Option>
            <Option value="2">{transferLanguage("Bin.field.DoubleRow", language)}</Option>
          </Select>
        </AntdFormItem>,
      ],
    ]


    // 详情 参数
    return (
      <Fragment>
        <FileImport
          visibleFile={visibleImport}
          handleCancel={() => this.setState({ visibleImport: false })}
          urlImport={`wms-warehouse-bin/importWmsBin`}
          // urlCase={`template/download?fileName=CAP_BO_ETA_template.xlsx`}
          queryData={[selectList.bind(null, { props: this.props })]}
          importPayload={{ warehouseAreaId: warehouseArea_1[0]?.id, storageTypeId: storageType_1[0]?.id, scaleType: scaleType_1, binType: binType_1 }}
          accept=".xls,.xlsx"
          extra={<div>
            <AntdForm >{formItemFragement(formImport)}</AntdForm>
          </div>}
        />
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          // disabledRowSelected={true}
          selectedRows={selectedRows}
          onSelectRow={this.handleSelectRows}
          loading={loading}
          data={warehouseBinList}
          columns={columnsList}
          onPaginationChange={this.handleStandardTableChange}
          expandForm={expandForm}
          className={this.className}
        // code={codes.page}
        />
        <AdModal
          visible={visible}
          title={transferLanguage('Bin.button.addBatch', language)}
          onOk={this.handleOk}
          onCancel={() => this.setState({ visible: !visible })}
          width="800px"
        >
          <AntdForm >{formItemFragement(formItem)}</AntdForm>
        </AdModal>
        <AdModal
          visible={showRefresh}
          title={transferLanguage('Bin.field.routeNoRefresh', language)}
          onOk={this.refreshRouteNo}
          onCancel={() => this.setState({ showRefresh: !showRefresh })}
          width="800px"
        >
          <AntdForm >{formItemFragement(formItemRefresh)}</AntdForm>
        </AdModal>
      </Fragment>
    );
  }
}
