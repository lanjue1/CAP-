import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
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
import AdButton from '@/components/AdButton';
import { Status, Flag,partNoColumns ,codes} from './utils';
import SearchSelect from '@/components/SearchSelect';
import { transferLanguage,columnConfiguration } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ itemRelation, common, loading , i18n }) => ({
  itemRelation,
  dictObject: common.dictObject,
  id: itemRelation.id,
  loading: loading.models.itemRelation,
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
      activeKey: ['1', '2'],
      showRecord: true, //init:false
      senders: [],
      disabled: true,
      beUseRule: true,
      requestTypeList: [],
      originalItem: [],
      replaceItem:[],
      _partNoColumns:[],
      _Flag:[],
    };
  }
  componentDidMount() {
    const { match, form, dispatch,language } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      showRecord: true,
      _partNoColumns:columnConfiguration(partNoColumns,language),
      _Flag:columnConfiguration(Flag,this.props.language)
    });
    if (ID) {
      this.getSelectDetails(ID);
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
      type: 'itemRelation/itemRelationDetails',
      payload: { id: ID },
      callback: data => {
        this.setState({
          senders: [{ id: data.senderId }],
          beUseRule: data.beUseRule,
          originalItem:[{code:data.originalPartCode}],
          replaceItem:[{code:data.replacePartCode}],
        });
      },
    });
  };

  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  operatePaneButton = e => {
    e.stopPropagation();
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { senders, ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        console.log('values', senders, value)
        
        if (params.id) {
          value.id = params.id;
          value.originalPartCode= this.state.originalItem[0].code;
          value.replacePartCode= this.state.replaceItem[0].code;
          dispatch({
            type: 'itemRelation/itemRelationOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('itemRelation/itemRelationList', {});
              this.dispatchFun('itemRelation/itemRelationDetails', { id: params.id });
            },
          });
        } else {
          value.originalPartCode= this.state.originalItem[0].code;
          value.replacePartCode= this.state.replaceItem[0].code;
          dispatch({
            type: 'itemRelation/itemRelationOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              // this.setState({ showRecord: true });
              dispatch({
                type: 'itemRelation/itemRelationDetails',
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
                        router.push(`/basicData/listItemRelation/editItemRelation/${res}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('itemRelation/interfaceTypeList', {});
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
  // 明细查看详情
  showDetail = () => {
    this.setState({ visible: true });
  };

  // 明细关闭详情
  infoHandleCancel = () => {
    this.setState({ visible: false, visiblePay: false });
  };
  handleSelectRows = rows => {
    // console.log('选择', rows);
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
		this.setState({
			[type]: values,
		});
	};

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
      originalItem,
      replaceItem,
      _partNoColumns,
      _Flag,
    } = this.state;
    const {
      itemRelation: { itemRelationDetails, eventReceiverList },
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      showType,
      loading,
      language
    } = this.props;

    const currentId = params.id;
    let selectDetails = itemRelationDetails[currentId];
    const checkDisabled = selectDetails ? true : false;

    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.code : transferLanguage('partRelation.field.addPartRelation',language)}</span>
        {disabled ? (
          <AdButton
            type="primary"
            code={codes.edit}
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text={transferLanguage('partRelation.button.edit',language)} //"编辑"
          />
        ) : (
            <Button.Group>
              <Button type="primary" onClick={e => this.operatePaneButton(e)}>
                {transferLanguage('partRelation.button.save',language)}
            </Button>
              {currentId && (
                <AdButton
                  onClick={() => {
                    this.setState(preState => ({
                      disabled: !preState.disabled,
                    }));
                  }}
                  text={transferLanguage('partRelation.button.cancel',language)}//"取消"
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
    };;

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
            <Panel header={transferLanguage('Common.field.baseInfo',language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partRelation.field.originalItemCode',language)}>
                        {getFieldDecorator('originalPartCode', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.originalPartCode : '',
                        })(<SearchSelect
                          dataUrl="wms-part/selectWmsPartList"
                          selectedData={originalItem} // 选中值
                          multiple={false} // 是否多选
                          showValue="code"
                          searchName="keyWord"
                          columns={_partNoColumns} // 表格展示列
                          onChange={e => this.getValue(e, 'originalItem')} // 获取选中值
                          scrollX={160}
                          id="ArchivesList_1"
                          allowClear={true}
                          // payload={{ categoryList: ['HEADSTOCK', 'CARLOAD'] }} //筛选为整车和车头的
                          disabled={disabled}
                        />)
                        }
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partRelation.field.replaceItemCode',language)}>
                        {getFieldDecorator('replacePartCode', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.replacePartCode : '',
                        })(<SearchSelect
                          dataUrl="wms-part/selectWmsPartList"
                          url=''
                          selectedData={replaceItem} // 选中值
                          multiple={false} // 是否多选
                          showValue="code"
                          searchName="keyWord"
                          columns={_partNoColumns} // 表格展示列
                          onChange={e => this.getValue(e, 'replaceItem')} // 获取选中值
                          scrollX={160}
                          id="ArchivesList_2"
                          allowClear={true}
                          // payload={{ categoryList: ['HEADSTOCK', 'CARLOAD'] }} //筛选为整车和车头的
                          disabled={disabled}
                        />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partRelation.field.replaceType',language)}>
                        {getFieldDecorator('replaceType', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.replaceType : replaceItem&&replaceItem[0]?replaceItem[0].partTypeName:'',
                        })(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partRelation.field.beActive',language)}>
                        {getFieldDecorator('status', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails && selectDetails.status == 'DISABLE' ? transferLanguage('Common.field.disable',language) : transferLanguage('Common.field.enable',language),
                        })(
                          // <Select disabled={disabled}>
                          //   {Status.map(v => {
                          //     return <Option value={v.code}>{v.value}</Option>;
                          //   })}
                          // </Select>
                          <Input  disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partRelation.field.mtSpe',language)}>
                        {getFieldDecorator('mtSpe', {
                          initialValue: selectDetails ? selectDetails.mtSpe : '',
                        })(
                          <Select disabled={disabled}>
                            {_Flag.map(v => {
                              return <Option value={v.code}>{v.value}</Option>;
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partRelation.field.mt',language)}>
                        {getFieldDecorator('mt', {
                          initialValue: selectDetails ? selectDetails.mt : '',
                        })(
                          <Select disabled={disabled}>
                            {Flag.map(v => {
                              return <Option value={v.code}>{v.value}</Option>;
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partRelation.field.priority',language)}>
                        {getFieldDecorator('priority', {
                          initialValue: selectDetails ? selectDetails.priority : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partRelation.field.topmost',language)}>
                        {getFieldDecorator('topmost', {
                          initialValue: selectDetails ? selectDetails.topmost : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('partRelation.field.remarks',language)}>
                        {getFieldDecorator('remarks', {
                        })(<TextArea placeholder="" disabled={disabled} rows={4} />)}
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
