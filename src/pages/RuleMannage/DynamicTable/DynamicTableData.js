import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input } from 'antd';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import AntdForm from '@/components/AntdForm';
import FileImport from '@/components/FileImport';
import AntdInput from '@/components/AntdInput';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import FileReader from '@/components/FileReader';
import AdSearch from '@/components/AdSearch';
import { allDictList } from '@/utils/constans';
import SearchSelect from '@/components/SearchSelect';
import AntdDatePicker from '@/components/AntdDatePicker';
import DynamicTableDataInfo from './DynamicTableDataInfo';
import { queryDict, getQueryString } from '@/utils/common';
import prompt from '@/components/Prompt';
import {
  allDispatchType,
  codes,
  trailNodeStatus,
  trailType,
  statusAndType,
  formatStatusAndType,
} from './utils';
import styles from './dynamicTable.less';

const { confirm } = Modal;
const dateFormat = 'YYYY-MM-DD HH:mm';

@ManageList
@connect(({ dynamicTable, loading, component }) => ({
  dynamicTable,
  dy_dataList: dynamicTable.dy_dataList,
  dy_queryItem: dynamicTable.dy_queryItem,
  dictObject: component.dictObject,
  searchValue: component.searchValue,
  loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class DynamicTableData extends Component {
  constructor(props) {
    super(props);
    const {
      form: { getFieldDecorator },
      match: { params },
    } = props;
    this.commonParams = {
      getFieldDecorator,
    };
    this.state = {
      selectedRows: [],
      disabled: false,
      visibleFile: false,
      existOrders: false,
      //   tableName: params.name,
      tableName: '',
      showTips: '',
    };
  }
  className = 'dynamicTableData-table';

  componentDidMount() {
    const tableName = this.props.location.query.tableName;
    this.setState({
      tableName,
    });
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    const tableName = this.props.location.query.tableName;
    if (tableName && tableName !== prevState.tableName) {
      this.setState({
        tableName,
      });
    }
  }
  //?????????????????????
  showTipsFun = val => {
    this.setState({
      showTips: val,
    });
  };
  onRef = ref => {
    this.child = ref;
  };
  //??????
  handleAdd = () => {
    this.child.handleAdd();
  };
  //??????
  removeInfo = e => {
    e.stopPropagation();
    confirm({
      title: '???????????????????????????',
      content: ' ',
      okText: '??????',
      okType: 'danger',
      cancelText: '??????',
      onOk: () => {
        const { tableName, selectedRows } = this.state;
        const { dy_dataList } = this.props;
        const list = dy_dataList[tableName].list;
        if (selectedRows.length == list.length) {
          prompt({
            content: '?????????????????????????????????????????????',
            type: 'warn',
          });
          return;
        }
        const deleteIds = selectedRows.map(v => v.id);
        const newData = dy_dataList[tableName].list.filter(item => !deleteIds.includes(item.id));
        this.saveAllValue({ dy_dataList: { [tableName]: { list: newData } } });
        this.handleStateChange([{ selectedRows: [], showTips: true }]);
      },
    });
  };

  getInfoData = () => {
    const { dy_dataList } = this.props;
    const { tableName } = this.state;
    let newData = [];
    if (dy_dataList[tableName]) {
      const data = dy_dataList[tableName].list;
      newData = data.map(item => ({ ...item }));
    }
    return newData;
  };

  getRowByKey(id, newData) {
    const data = this.getInfoData();
    return (newData || data).filter(item => item.id === id)[0];
  }

  saveAllValue = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: allDispatchType.value,
      payload: payload || {},
    });
  };

  handleStateChange = (options = []) => {
    options.map(item => {
      this.setState(item);
    });
  };
  /* ????????????????????????---end---*/

  /**
   * form ???????????? ??????
   */
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  /**
   * form ???????????? ??????
   */
  handleSearch = formValues => {
    // const {} = formValues;
    this.child.getDataList(formValues);
  };

  /**
   * table ?????? ????????????
   */
  handleStandardTableChange = param => {
    // this.getDataList(param);
  };

  //?????????
  saveData = () => {
    const { form, dy_dataList, dispatch } = this.props;
    const { tableName } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;

      const params = {
        dataList: dy_dataList[tableName].list,
        tableName,
      };

      dispatch({
        type: allDispatchType.osDyData,
        payload: params,
      });
    });
  };

  render() {
    const { form, loading, dy_queryItem } = this.props;
    const { selectedRows, visibleFile, showTips, existOrders } = this.state;
    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const { tableName } = this.state;

    let firstFormItem;
    let secondFormItem;
    let otherFormItem;
    const queryItem = dy_queryItem[tableName];
    if (queryItem) {
      if (queryItem[0]) {
        firstFormItem = (
          <AntdFormItem label={queryItem[0]} code={queryItem[0]} {...commonParams}>
            <Input />
          </AntdFormItem>
        );
      }
      if (queryItem[1]) {
        secondFormItem = (
          <AntdFormItem label={queryItem[1]} code={queryItem[1]} {...commonParams}>
            <Input />
          </AntdFormItem>
        );
      }
    }

    const preTitle = showTips && (
      <div style={{ color: 'red', marginLeft: 30, lineHeight: '32px' }}>
        ?????????<span>???????????????????????????????????????</span>
      </div>
    );

    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      otherFormItem,
      form,
      className: this.className,
      handleFormReset: null,
      handleSearch: this.handleSearch,
      toggleForm: expandForm => {
        this.handleStateChange([{ expandForm }]);
      },
      code: codes.select,
    };

    const tableButtonsParams = {
      handleAdd: this.handleAdd,
      code: codes.add,
      buttons: (
        <>
          <AdButton
            onClick={e => {
              this.removeInfo(e);
            }}
            ghost
            disabled={selectedRows.length === 0}
            text="??????"
            type="danger"
            code={codes.remove}
          />
          {/* <AdButton
            style={{ marginLeft: 8 }}
            onClick={() => this.handleImportFile()}
            text="??????"
            code={codes.import}
          /> */}
          {preTitle}
        </>
      ),
    };

    return (
      <div className="cus-ant-trail-page">
        <FileImport
          visibleFile={visibleFile}
          handleCancel={() => {
            this.handleImportFile();
          }}
          urlImport={`track/track-order/importTrack`}
          urlCase={`attachment/????????????????????????.xlsx`}
          // queryData={[this.getSelectList]}
          accept=".xls,.xlsx"
        />
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        {/* <DynamicTableDataInfo
          tableName={tableName}
          onRef={this.onRef}
          //   checkOrder={existOrders => this.handleStateChange([existOrders])}
          selectedRows={selectedRows}
          onSelectRow={selectedRows => this.handleStateChange([{ selectedRows }])}
          showTipsFun={this.showTipsFun}
        /> */}
      </div>
    );
  }
}
