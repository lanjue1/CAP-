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
import {dispatchFun} from '@/utils/utils';
import { Status,allDispatchType } from './utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ WarehouseBin, common, loading }) => ({
  WarehouseBin,
  warehouseBinDetail:WarehouseBin.warehouseBinDetail,
  dictObject: common.dictObject,
  loading: loading.effects[allDispatchType.detail],

}))
@Form.create()
export default class WarehouseBinOperate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: '',
      visible: false,
      activeKey: ['1', '2'],
      senders: [],
      disabled: true,
      beUseRule: true,
      requestTypeList: [],
    };
  }
  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
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
    
    // console.log('ID===',ID)
    
    this.props.dispatch({
      type: allDispatchType.detail,
      payload: { id: ID },
      callback: data => {
        this.setState({
          // senders: [{ id: data.senderId }],
          // beUseRule: data.beUseRule,
        });
      },
    });
  };

  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

 //保存、编辑
  saveInfo = e => {
    e.stopPropagation();
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { senders, ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        value.id = params.id;
        dispatch({
          type:allDispatchType.operate,
          payload:value,
          callback:(res)=>{
            if (!res) return;
            this.setState(preState => ({
              disabled: !preState.disabled,
            }));
            if(params.id){
              dispatchFun(allDispatchType.list, {},this.props)
              dispatchFun(allDispatchType.detail, {id: params.id},this.props)
            }else{
              dispatchFun(allDispatchType.detail, {id: params.id},this.props)
              dispatch({
                type: 'common/setTabsName',
                payload: {
                  id: res,
                  name: data.businessTypeCode,
                  isReplaceTab: true,
                },
                callback: result => {
                  if (result) { 
                    router.push(`/basicData/warehouseBin/warehouseBinEdit/${res}`);
                  }
                },
              });
            }
          }
        })
      }
    });
  };
  // // dispatch 方法
  // dispatchFun(type, params) {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: type,
  //     payload: params,
  //   });
  // }

  // 明细查看详情
  showDetail = () => {
    this.setState({ visible: true });
  };

  // 明细关闭详情
  infoHandleCancel = () => {
    this.setState({ visible: false, visiblePay: false });
  };
 
  onRef = ref => {
    this.child = ref;
  };

  getValue = (type,values )=> {
    this.setState({
      [type]: values,
    });
  };

  render() {
    const {
      visible,
      
      disabled,
    } = this.state;
    const {
      warehouseBinDetail,
      form: { getFieldDecorator },
      match: { params },
      loading,
    } = this.props;

    const currentId = params.id;
    let selectDetails = warehouseBinDetail[currentId];

    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.code : '新增仓库库位'}</span>
        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text="编辑"
          />
        ) : (
          <Button.Group>
            <Button type="primary" onClick={e => this.saveInfo(e)}>
              保存
            </Button>
            {currentId && (
              <AdButton
                onClick={() => {
                  this.setState(preState => ({
                    disabled: !preState.disabled,
                  }));
                }}
                text="取消"
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
            <Panel header="基础信息" key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="code">
                        {getFieldDecorator('code', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.code : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="warehouseId">
                        {getFieldDecorator('warehouseId', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.warehouseId : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="warehouseAreaId">
                        {getFieldDecorator('warehouseAreaId', {
                          initialValue: selectDetails ? selectDetails.warehouseAreaId : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                    <Form.Item label="状态">
                        {getFieldDecorator('status', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails && selectDetails.status == 'DISABLE' ? '禁用' : '启用',
                        })(
                          // <Select disabled={disabled}>
                          //   {Status.map(v => {
                          //     return <Option value={v.code}>{v.value}</Option>;
                          //   })}
                          // </Select>
                          <Input value='启用' disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="beDeleted">
                        {getFieldDecorator('beDeleted', {
                          initialValue: selectDetails ? selectDetails.beDeleted : '',
                        })(<Input placeholder="true or false" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="typeCode">
                        {getFieldDecorator('typeCode', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.typeCode : '',
                        })(
                          <Input  disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="zoneNo">
                        {getFieldDecorator( 'zoneNo',{
                           rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.zoneNo : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="colNo">
                        {getFieldDecorator( 'colNo',{
                           rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.colNo : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="lineNo">
                        {getFieldDecorator( 'lineNo',{
                           rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.lineNo : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="layerNo">
                        {getFieldDecorator( 'layerNo',{
                           rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.layerNo : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="useRate">
                        {getFieldDecorator( 'useRate',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.useRate : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="weight">
                        {getFieldDecorator( 'weight',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.weight : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="volume">
                        {getFieldDecorator( 'volume',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.volume : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="palletQty">
                        {getFieldDecorator( 'palletQty',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.palletQty : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="boxQty">
                        {getFieldDecorator( 'boxQty',{
                          //  rules: [{ required: true, message: '请输入' }],
                           initialValue: selectDetails ? selectDetails.boxQty : '',
                        }
                        )(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    
                  </Row>







                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label="备注">
                        {getFieldDecorator(
                          'remarks',
                          {}
                        )(<TextArea  disabled={disabled} rows={4} />)}
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
