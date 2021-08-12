import React, { Component, Fragment } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { connect } from 'dva';
import Media from 'react-media';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import RightDraw from '@/components/RightDraw';
import StandardTable from '@/components/StandardTable';
import AntdInput from '@/components/AntdInput';
import MenuDetails from './MenuDetails';
import styles from '@/pages/Operate.less';
import moment from 'moment';
import router from 'umi/router';
import prompt from '@/components/Prompt';
import { codes, menuTypeData } from './utils';
import AdSelect from '@/components/AdSelect';
import FileImport from '@/components/FileImport'

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const { Option } = Select;

@ManageList
@connect(({ tmsMenu, loading, common }) => ({
  tmsMenu,
  loading: loading.effects['tmsMenu/selectFirstMenu'],
}))
@Form.create()
export default class MenuList extends Component {
  state = {
    visible: false,
    id: '',
    formValues: {},
    selectedRows: [],
    checkId: '',
    globalListData: [],
    expandForm: false,
    visibleFile:false,
  };
  className = 'menuList';

  columns = [
    {
      title: '菜单代码',
      dataIndex: 'code',
      fixed: this.props.isMobile ? false : true,
      render: (text, record) => (
        <a onClick={e => this.showDetail(e, record.id)} title={text}>
          {text}
        </a>
      ),
      width: 250,
    },
    {
      title: '菜单名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text, record) => (
        <AdSelect
          data={menuTypeData}
          value={text}
          onlyRead={true}
          // payload={{ code: 'vehicle-papers-type' }}
        />
      ),
    },
    {
      title: 'ICO图标',
      dataIndex: 'icon',
    },
    {
      title: '路由路径',
      dataIndex: 'path',
    },
    {
      title: '路由名称',
      dataIndex: 'pathName',
    },
    {
      title: '组件路径',
      dataIndex: 'component',
    },
    {
      title: '状态',
      dataIndex: 'beActive',
      render: text => <span>{text ? '启用' : '禁用'}</span>,
      width: 100,
    },
    {
      title: '权限路径',
      dataIndex: 'url',
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: '请求路径',
      dataIndex: 'trueUrl',
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: '实体对象',
      dataIndex: '实体对象',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  componentDidMount() {
    // this.dispatchFun('tmsMenu/selectFirstMenu', {});
    this.getTableTreeList();
  }

  getTableTreeList = (params = {}, type) => {
    const { dispatch } = this.props;
    const { id } = params;
    const { globalListData } = this.state;
    if (id) params.id = id;
    // params.pageSize = 100;
    dispatch({
      type: 'tmsMenu/selectFirstMenu',
      payload: params,
      callback: res => {
        res.map(v => {
          if (v.childNumber > 0) v.children = [];
        });
        if (type == 'child') {
          this.locationData(res, globalListData, id);
        } else {
          this.setState({
            globalListData: res,
          });
          if (res.length === 1) {
            this.getTableTreeList({ id: res[0].id }, 'child');
          }
        }
      },
    });
  };
  locationData = (dataChild, data, id) => {
    data.forEach(v => {
      if (dataChild.length > 0 && v.id == id) {
        v.children = dataChild;
      } else if (v.children) {
        this.locationData(dataChild, v.children, id);
      }
    });
  };
  //展开关闭：
  onExpandRow = (expanded, record) => {
    // console.log('expanded, record', expanded, record);
    expanded && this.getTableTreeList({ id: record.id }, 'child');
  };

  // 分页操作
  handleStandardTableChange = param => {
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.dispatchFun('tmsMenu/selectFirstMenu', params);
  };

  // 重置条件查询表单
  handleFormReset = () => {
    this.setState({ formValues: {} });
    this.dispatchFun('tmsMenu/selectFirstMenu', {});
  };

  // 执行条件查询表单
  handleSearch = values => {
    if (!values) {
      return;
    }
    const { expiryTime, ...value } = values;
    if (expiryTime) {
      value.expiryStartTime = moment(expiryTime[0]).format(dateFormat);
      value.expiryEndTime = moment(expiryTime[1]).format(dateFormat);
    }
    this.setState({
      formValues: value,
    });
    this.dispatchFun('tmsMenu/selectFirstMenu', value);
  };

  // 跳转 新增页面
  handleAdd = () => {
    // console.log('新增页面999');
    router.push('/system/MenuList/add-form');
  };

  // 跳转 编辑页面
  handleEdit = () => {
    const { id } = this.state;
    this.closeDetail();
    router.push(`/system/MenuList/edit-form/${id}`);
  };

  // 关闭右抽屉
  closeDetail = () => {
    this.setState({
      visible: false,
    });
  };
  // 打开右抽屉
  showDetail = (e, id) => {
    e.stopPropagation();
    this.setState({
      visible: true,
      id,
      checkId: id,
    });
    // this.dispatchFun('tmsMenu/selectDetails', { id });
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

  //启用、禁用：
  useVehicleType = (type, single) => {
    const { dispatch } = this.props;
    const { checkIds, checkId } = this.state;
    let urlType = 'tmsMenu/enableMenu';
    if (type == 'disabled') {
      urlType = 'tmsMenu/disabledMenu';
    }
    dispatch({
      type: urlType,
      payload: { ids: single ? [checkId] : checkIds },
      callback: res => {
        if (single) {
          dispatch({
            type: 'tmsMenu/selectDetails',
            payload: { id: checkId },
          });
        } else {
          dispatch({
            type: 'tmsMenu/selectFirstMenu',
            payload: this.state.formValues,
          });
        }
      },
    });
  };
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  handleImportFile = () => {
		this.setState({visibleFile:false})
	}
  render() {
    const {
      form,
      loading,
      tmsMenu: { selectFirstMenu, selectDetails },
      isMobile,
    } = this.props;
    const { id, visible, selectedRows, checkId, globalListData, expandForm,visibleFile } = this.state;
    const { getFieldDecorator } = form;
    
    const firstFormItem = (
      <FormItem label="菜单代码">{getFieldDecorator('code')(<AntdInput />)}</FormItem>
    );
    const secondFormItem = (
      <FormItem label="菜单名称">{getFieldDecorator('name')(<AntdInput />)}</FormItem>
    );
    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      form,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      className: this.className,
      toggleForm: this.toggleForm,
    };

    const details = selectDetails[checkId] ? selectDetails[checkId] : {};

    const tableButtonsParams = {
      show: true,
      handleAdd: this.handleAdd,
      rightButtons:(
        <Button.Group>
          <Button
            onClick={() => this.setState({visibleFile:true})}
          >
            导入
          </Button>
        </Button.Group>
      ),
      buttons: (
        <Button.Group>
          <Button
            onClick={() => this.useVehicleType('disabled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            禁用
          </Button>
          <Button
            onClick={() => this.useVehicleType('abled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            启用
          </Button>
        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    const rightDrawParams = {
      isMobile,
      visible,
      title: '菜单详情',
      closeDetail: this.closeDetail,
      buttons: (
        <span>
          <Button.Group>
            {!details.beActive && (
              <Button onClick={() => this.useVehicleType('abled', 1)}>启用</Button>
            )}
            {details.beActive && (
              <Button onClick={() => this.useVehicleType('disabled', 1)}>禁用</Button>
            )}
            <Button type="primary" onClick={this.handleEdit}>
              编辑
            </Button>
          </Button.Group>
        </span>
      ),
    };
    return (
      <Fragment>
        <FileImport
					visibleFile={visibleFile}
					handleCancel={() => {
						this.handleImportFile();
					}}
					urlImport={`mds-menu/importMenu`}
					urlCase={`template/download?fileName=importMenu.xlsx`}
					queryData={[this.getTableTreeList]}
					accept=".xls,.xlsx"
				/>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          // data={{selectList}}
          defaultExpandedRowKeys={globalListData.length === 1 ? [globalListData[0].id] : []}
          data={{ list: globalListData }}
          columns={this.columns}
          // scrollX={1800}
          onSelectRow={this.handleSelectRows}
          onPaginationChange={this.handleStandardTableChange}
          onExpandRow={this.onExpandRow}
          code={codes.page}
          expandForm={expandForm}
          className={this.className}
        />
        <RightDraw {...rightDrawParams}>
          <MenuDetails detailId={id} isMobile={isMobile} />
        </RightDraw>
      </Fragment>
    );
  }
}
