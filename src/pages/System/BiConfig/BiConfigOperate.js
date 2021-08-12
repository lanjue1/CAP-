import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Col, Collapse, Form, Input, Row, Select, } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '@/pages/Operate.less';
import AdButton from '@/components/AdButton';
import { codes, Status, PoTypeArr, SelectColumns } from "./utils";
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import AdSelect from '@/components/AdSelect';
import SearchSelect from '@/components/SearchSelect';
import { transferLanguage } from '@/utils/utils';
import Prompt from '@/components/Prompt';
import AntdDatePicker from '@/components/AntdDatePicker';
import { allDictList } from '@/utils/common'

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ biconfigs, common, loading, i18n }) => ({
  biconfigs,
  dictObject: common.dictObject,
  id: biconfigs.id,
  loading: loading.models.biconfigs,
  language: i18n.language
}))
@Form.create()
export default class TypeOperate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      warehouse:[],
      beGlobal:[],
      beGlobalChar:'',
      selectedRowKeys: [],
      currentId: '',
      selectedRows: [],
      visible: false,
      activeKey: ['1', '2'],
      showRecord: true, //init:false
      senders: [],
      disabled: true,
      beUseRule: true,
      requestTypeList: [],
      expandForm: false,
      modalVisible: false,
      checkIds: '',
      detailsId: '',
      _SelectColumns: [],
    };
  }

  className = 'biconfigOperate';

  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      showRecord: true,
    });
    if (ID) {
      this.getSelectDetails(ID);
      // this.getSelectDetailsList(ID)
    } else {
      form.resetFields();
      this.setState({
        disabled: true
      })
    }
    this.changeTitle(SelectColumns, "_SelectColumns")

  }
  changeTitle = (param, params) => {
    let _columnsAllotOne = []
    _columnsAllotOne = param.map(v => {
      if (v.title) {
        v.title = transferLanguage(v.title, this.props.language)
      } else if (v.value) {
        v.value = transferLanguage(v.value, this.props.language)
      }
      return v
    })
    this.setState({
      [params]: _columnsAllotOne
    })
  }
  // 获取详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'biconfigs/viewBiConfigDetails',
      payload: { id: ID },
      callback: data => {
        let name;
        if(data.beGlobal){
          name='是'
        }else{
          name='否'
        }
        let warehouse=[{name:data.warehouseName,code:data.warehouseName,warehouseId:data.warehouseId}];
        let beGlobal = [{name:name,code:data.beGlobal}];
        this.setState({
          warehouse: warehouse,
          beGlobal:beGlobal,
          beGlobalChar:name
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
        const { warehouse, ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        value.beGlobal =  eval(value.beGlobal);
        value.warehouseId = warehouse[0]?.id;
        if (params.id) {
          value.id = params.id;
          dispatch({
            type: 'biconfigs/biConfigOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('biconfigs/selectBiConfigList', {});
              this.dispatchFun('biconfigs/biconfigDetails', { id: params.id });
            },
          });
        } else {
          dispatch({
            type: 'biconfigs/biConfigOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              // this.setState({ showRecord: true });
              this.setState({ currentId: res })
              dispatch({
                type: 'biconfigs/biconfigDetails',
                payload: { id: res },
                callback: data => {
                  // this.setState(preState => ({
                  //   disabled: !preState.disabled,
                  // }));
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
                        router.push(`/system/Biconfig/BiconfigEdit/${res}`);
                      }
                    },
                  });
                },
              });
              // this.dispatchFun('wmspo/interfaceTypeList', {});
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

  getValue = (values, type) => {
    console.log('values, type', values, type)
    const { form: { setFieldsValue } } = this.props
    this.setState({
      [type]: values,
    });
    if (type == "warehouse") {
      setFieldsValue({
        warehouse: values[0]?.countryName
      })
    }
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
  addDetail = () => {
    const { currentId } = this.state
    if (currentId) {
      this.setState({ modalVisible: true, detailsId: '' })
    } else {
      Prompt({ content: transferLanguage('PoDetailList.prompt.saveBaseInfo', this.props.language), type: 'warn' })
    }

  }
  abledStatus = (type) => {
    const { checkIds, currentId } = this.state
    const { dispatch } = this.props
    const params = {
      ids: checkIds,
      type,
    }
    console.log('123', type, params)
    dispatch({
      type: 'wmspo/ableOperate',
      payload: params,
      callback: data => {
        this.getSelectDetailsList(currentId)
        if (type == 'cancelDetail') this.getSelectDetails(currentId)
      }
    })
  }
  cancel = () => {
    this.setState({ modalVisible: false })
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
      _SelectColumns,
      warehouse,
      beGlobal,
      beGlobalChar,
    } = this.state;
    const {
      biconfigs: { biconfigDetails },
      form,
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      showType,
      loading,
      language,
    } = this.props;
    const currentId = params.id;
    let selectDetails = biconfigDetails[currentId];
    const checkDisabled = selectDetails ? true : false;
    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.code : transferLanguage('BiConfigList.field.addBiConfig', language)}</span>
        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            code={codes.detailEdit}
            text={transferLanguage('Common.field.edit', language)}
          />
        ) : (
          <Button.Group>
            <Button type="primary" onClick={e => this.operatePaneButton(e)}>
              {transferLanguage('Common.field.save', language)}
            </Button>
            {currentId && (
              <AdButton
                onClick={() => {
                  this.setState(preState => ({
                    disabled: !preState.disabled,
                  }));
                }}
                text={transferLanguage('Common.field.cancel', language)}
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

    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };

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
                      <Form.Item label={transferLanguage('BiConfigList.field.typeCode', language)}>
                        {getFieldDecorator('typeCode', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.typeCode : '',
                        })(
                          <Input placeholder=""  />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('BiConfigList.field.biUrl', language)}>
                        {getFieldDecorator('biUrl', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.biUrl : '',
                        })(
                          <Input placeholder=""  />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('BiConfigList.field.warehouse', language)}>
                        {getFieldDecorator('warehouse', {
                          rules: [{ required: true, message: '请选择' }],
                          initialValue: selectDetails ? selectDetails.warehouse : '',
                        })(
                          <SearchSelect
                            dataUrl={'/wms-warehouse/selectWmsWarehouseList'}
                            selectedData={warehouse} // 选中值
                            showValue="name"
                            searchName="name"
                            multiple={false}
                            columns={_SelectColumns}
                            onChange={values => this.getValue(values, 'warehouse')}
                            id="warehouseId"
                            allowClear={true}
                            scrollX={200}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('BiConfigList.field.beGlobal', language)}>
                        {getFieldDecorator('beGlobal', {
                          rules: [{ required: true, message: '请选择' }],
                          initialValue: beGlobalChar?beGlobalChar:'',
                        })(
                          <AdSelect payload={{ code: allDictList.BOOLE }}   />
                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('BiConfigList.field.remarks', language)}>
                        {getFieldDecorator('remarks', {
                          initialValue: selectDetails ? selectDetails.remarks : '',
                        })(<TextArea placeholder=""  rows={4} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Panel>
          </Collapse>
        </PageHeaderWrapper>
      </div>
    );
  }
}
