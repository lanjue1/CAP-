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
import { allDictList } from '@/utils/common'
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

@ManageList
@connect(({ biconfigs, common, component, loading, i18n }) => ({
  biconfigs,
  loading: loading.effects['biconfigs/biConfigList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
  language: i18n.language
}))
@Form.create()
export default class BiConfigList extends Component {
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
    billType: [{ code: '', name: '', id: '' }],
    billTypeName: [],
    fromCountryId: [],
    shipToWmCode: [],
    consigner: [{ code: '', name: '', id: '' }],
    consignee: [{ code: '', name: '', id: '' }],
  };
  className = 'biconfigs';
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
      //类型code
      title: transferLanguage('BiConfigList.field.typeCode', this.language),
      dataIndex: 'typeCode',
      render: (text, record) => (
        <a onClick={e => this.handleEdit(e, record)} title={text}>
          {text}
        </a>
      ),
    },
    {
      // bi链接,
      title: transferLanguage('BiConfigList.field.biUrl', this.language),
      dataIndex: 'biUrl',
      render: text => <span title={text}>{text}</span>,
      width: 100,

    },
    {
      //仓库id warehouseName
      title: transferLanguage('BiConfigList.field.warehouseName', this.language),
      dataIndex: 'warehouseName',
      render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
    },
    {
      // 是否全局
      title: transferLanguage('BiConfigList.field.beGlobal', this.language),
      dataIndex: 'beGlobal',
      render: text => <AdSelect value={text} onlyRead={true} />,
      width: 80
    },

    {
      // 创建人名称
      title: transferLanguage('BiConfigList.field.createBy', this.language),
      dataIndex: 'createBy',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      // 创建时间
      title: transferLanguage('BiConfigList.field.createTime', this.language),
      dataIndex: 'createTime',
      render: text => <AdSelect value={text} onlyRead={true} />,

    },
    {
      // 修改人名称updateBy
      title: transferLanguage('BiConfigList.field.updateBy', this.language),
      dataIndex: 'updateBy',
      render: text => <AdSelect value={text} onlyRead={true} />,
    }, {
      // 修改时间updateTime
      title: transferLanguage('BiConfigList.field.updateTime', this.language),
      dataIndex: 'updateTime',
      render: text => <span title={text}>{text}</span>,
    }
  ];

  // 模块渲染后的 todo
  componentDidMount() {
    this.getBiConfigList();
    this.changeTitle(SelectColumns, "_SelectColumns")
    // this.changeTitle(Status, "_Status")
    // this.changeTitle(typeStatus, "_typeStatus")
    // this.changeTitle(SelectColumns1, "_SelectColumns1")
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
  getBiConfigList = (params = {}) => {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: 'biconfigs/selectBiConfigList',
      payload: params,
      callback: data => {
        // if (!data) return;
        // let valueList = [];
        // data.map(v => {
        //   const labels = ['senderId'];
        //   labels.map(item => {
        //     if (v[item] && !valueList.includes(v[item])) {
        //       valueList.push(v[item]);
        //       !searchValue[v[item]] &&
        //         dispatch({
        //           type: 'component/querySearchValue',
        //           payload: {
        //             params: { id: v[item] },
        //             url: 'sms/sms-sender/viewSmsSenderDetails',
        //           },
        //         });
        //     }
        //   });
        // });
      },
    });
  };

  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      // shipFromWmCode: [],
      // fromCountryId: [],
      shipToWmCode: [],
      // toCountryId: [],
    });
    this.getBiConfigList();
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
    const { warehouseId, createTime, ...value } = values;
    if (warehouseId && warehouseId.length > 0) value.WarehouseName = warehouseId[0].id;
    value.beGlobal =  eval(value.beGlobal);
    this.setState({
      formValues: value,
    });
    this.getBiConfigList(value);
  };

  //新建
  handleAdd = () => {
    const { dispatch } = this.props;
    router.push(`/system/Biconfig/BiconfigAdd`);
  };

  // 分页操作：改参数
  handleStandardTableChange = param => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.getBiConfigList(params);
  };

  //编辑：
  handleEdit = (e, record) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { id } = record;

    dispatch({
      type: 'biconfigs/biconfigDetails',
      payload: { id },
      callback: res => {
        this.setState({
          isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
        });
      },
    });
    router.push(`/system/Biconfig/BiconfigEdit/${id}`);
  };

  //删除bi配置列表：
  deleteList = (type, isSingle) => {
    const { dispatch } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = isSingle ? [checkId] : checkIds;
    dispatch({
      type: 'biconfigs/deleteOperate',
      payload: params,
      callback: res => {
        this.getBiConfigList(formValues);
        // if (isSingle) {
        //   this.props.dispatch({
        //     type: 'wmspo/wmspoDetails',
        //     payload: { id: checkId },
        //     callback: res => {
        //       this.setState({
        //         isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
        //       });
        //     },
        //   });
        // }
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
      biconfigs: { biconfigLists, biConfigDetails },
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
    // const selectDetails = biConfigDetails[checkId];

    // 设置查询条件
    const firstFormItem = (
      <FormItem label={transferLanguage('BiConfigList.field.typeCode', this.language)}>
        {getFieldDecorator('typeCode')(<TextArea rows={1} />)}
      </FormItem>

    );
    const secondFormItem = (
      <FormItem label={transferLanguage('BiConfigList.field.biUrl', this.language)}>
        {getFieldDecorator('biUrl')(<TextArea rows={1} />)}
      </FormItem>

    );

    // secondForm 参数
    const otherFormItem = [
      [
        <FormItem label={transferLanguage('BiConfigList.field.warehouse', this.language)}>
          {getFieldDecorator('warehouseId')(
            <SearchSelect
              disabled={false}
              dataUrl={'/wms-warehouse/selectWmsWarehouseList'}
              selectedData={shipFromWmCode} // 选中值
              showValue="name"
              searchName="name"
              multiple={false}
              columns={_SelectColumns}
              onChange={values => this.getValue(values, 'warehouseId')}
              id="warehouseId"
              allowClear={true}
              scrollX={200}
            />
          )}
        </FormItem>,


      ],
      [
        <FormItem label={transferLanguage('BiConfigList.field.beGlobal', this.language)}>
          {getFieldDecorator('beGlobal')(
            <AdSelect payload={{ code: allDictList.BOOLE }} />
          )}
        </FormItem>
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
      // rightButtons: (
      //   <Button.Group>
      //     <AdButton
      //       code={codes.import}
      //       text={transferLanguage('Common.field.import', this.language)}
      //       onClick={() => this.setState({ visibleFile: true })} />
      //     <AdButton
      //       code={codes.export}
      //       text={transferLanguage('Common.field.export', this.language)}
      //       onClick={() => this.exportPo()} />
      //     <AdButton
      //       code={codes.export}
      //       disabled={selectedRows.length > 0 ? false : true}
      //       text={transferLanguage('PoList.button.ODMPo', this.language)}
      //       onClick={() => this.print()} />
      //   </Button.Group>
      // ),
      buttons: (
        <Button.Group>
          <AdButton
            code={codes.cancel}
            onClick={() => this.deleteList('delete')}
            disabled={selectedRows.length > 0 ? false : true}
            text={transferLanguage('BiConfigList.button.delete', this.language)}
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
          data={biconfigLists}
          columns={this.columns} handleSelectRows
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
