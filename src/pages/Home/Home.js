import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import { transferLanguage } from '@/utils/utils';
// 图标
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from "bizcharts";

const clientHeight = (document.body.clientHeight - 80) / 2;
@connect(({ home, common, component, loading, i18n }) => ({
  home,
  dictObject: common.dictObject,
  loading:loading.effects['home/dataList'],
  language: i18n.language

}))
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  className = 'home';





  componentWillUnmount() {
  }

  componentDidMount() {
    this.selectPendingReceiving()
    this.selectPendingPutaway()
    this.selectOutbound()
    this.selectPutaway()
    this.selectTotalOrder()
    this.selectUnpickedOrder()
    this.selectCurrentInventory()
    this.dataList()
  }

  triggerResizeEvent() {
  }

  componentWillReceiveProps(nextProps) {

  }
  selectPendingReceiving = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/selectPendingReceiving',
      payload: params,
      callback: data => {
        if (!data) return;

      },
    });
  }
  selectPendingPutaway = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/selectPendingPutaway',
      payload: params,
      callback: data => {
        if (!data) return;

      },
    });
  }
  selectPutaway = (params = {}) => {
    let date = new Date()
    let param={
      startTime:moment(new Date()).format('YYYY-MM-DD') + ' 08:00:00',
      endTime:moment(new Date()).format('YYYY-MM-DD') + ' 20:00:00',
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'home/selectPutaway',
      payload: param,
      callback: data => {
        if (!data) return;

      },
    });
  }
  selectOutbound = (params = {}) => {
    let date = new Date()
    let param={
      startTime:moment(new Date()).format('YYYY-MM-DD') + ' 08:00:00',
      endTime:moment(new Date()).format('YYYY-MM-DD') + ' 20:00:00',
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'home/selectOutbound',
      payload: param,
      callback: data => {
        if (!data) return;

      },
    });
  }
  selectTotalOrder = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/selectTotalOrder',
      payload: params,
      callback: data => {
        if (!data) return;

      },
    });
  }
  selectUnpickedOrder = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/selectUnpickedOrder',
      payload: params,
      callback: data => {
        if (!data) return;

      },
    });
  }
  selectCurrentInventory = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/selectCurrentInventory',
      payload: params,
      callback: data => {
        if (!data) return;

      },
    });
  }
  dataList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/dataList',
      payload: {pageSize:50},
      callback: data => {
        if (!data) return;

      },
    });
  }
  // 分页操作：改参数
	handleStandardTableChange = param => {
		const { dispatch } = this.props;
		const params = {
			...param,
		};
    dispatch({
      type: 'home/dataList',
      payload: params,
      callback: data => {
        if (!data) return;

      },
    });
	}
  render() {
    const {
      home: { pendingReceivingList, pendingPutawayList, putawayList, outboundList, currentInventorys, unpickedOrderList, totalOrderList, dataList },
      loading,
      language
    } = this.props;
    let cols = {
      count: { range: [0, 0.87] },
      date: { range: [0.05, 0.94]},
    };
    let colsPendingPutaway = {
      count: { range: [0, 0.87] },
      date: { range: [0.05, 0.94]},
    };
    let colsPendingReceiving = {
      count: { range: [0, 0.87] },
      date: { range: [0.05, 0.94]},
    }
    if(pendingPutawayList.length<6){
      colsPendingPutaway={
        count: { range: [0, 0.87] },
      }
    }
    if(pendingReceivingList.length<6){
      colsPendingReceiving={
        count: { range: [0, 0.87] },
      }
    }
    
    const COLORS = ["#4472C4", "#ED7D31"];
    const COLORS2 = ["#FF0066", "#A7CF8C"];

    const cols2 = {
      percent: {
        formatter: val => {
          return val;
        }
      }
    };

    const columns = [{
      title: '#',
      dataIndex: 'index',
			width: 50,
      render: (text, record, index) => (<span>{index + 1}</span>),
    },
    {
      title: transferLanguage('InventoryReport.field.so', language),
      dataIndex: 'soNo',
			width: 100,
      render: text => <span title={text}>{text}</span>
    },
    {
      title: transferLanguage('CoList.field.orderDate', language),
      dataIndex: 'orderDate',
			width: 150,
      render: text => <span title={text}>{text}</span>
    },
    {
      title: transferLanguage('PoList.field.status', language),
      dataIndex: 'status',
			width: 100,
      render: text => <span title={text}>{text}</span>
    },
    {
      title: transferLanguage('PoDetailList.field.partNo', language),
      dataIndex: 'pn',
			width: 200,
      render: text => <span title={text}>{text}</span>
    },
    {
      title: transferLanguage('PoList.field.pieceQty', language),
      dataIndex: 'qty',
			width: 100,
      render: text => <span title={text}>{text}</span>
    },
    {
      title: transferLanguage('PoList.field.shipTo', language),
      dataIndex: 'shipTo',
      render: text => <span title={text}>{text}</span>
    }]

    const colsZ = {
      count: { range: [0, 0.87] },
      time: { range: [0, 0.9] },
    };
    const noData = <div class="ant-table-placeholder" style={{border:'none',paddingTop:'50px'}}><div class="ant-empty ant-empty-normal"><div class="ant-empty-image"><svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 1)" fill="none" fill-rule="evenodd"><ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7"></ellipse><g fill-rule="nonzero" stroke="#D9D9D9"><path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path><path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#FAFAFA"></path></g></g></svg></div><p class="ant-empty-description">No Data</p></div></div>

    return (
      <div >
        <Row gutter={12}>
          <Col span={12}>
            <div style={{ background: '#ffffff', margin: 3 }}>
              <h3 style={{ textAlign: 'center' }}>Pending Receiving</h3>
              <div style={{ height: '275px' }}>
                {pendingReceivingList.length ? <Chart height={320} data={pendingReceivingList} scale={colsPendingReceiving} forceFit>
                  <Axis />
                  <Tooltip />

                  <Geom type="interval" position="date*count" color='#4472C4'>
                    <Label content={['count', (n) => {
                      return n;
                    }]} />
                  </Geom>
                </Chart> : noData}
              </div>


            </div>
          </Col>

          <Col span={12}>
            <div style={{ background: '#ffffff', margin: 3 }}>
              <Row gutter={24}>
                <Col span={12}>
                  <h3 style={{ textAlign: 'center' }}>Total Order</h3>
                  <div style={{ height: '275px' }}>
                  {totalOrderList.length ? <Chart
                      data={totalOrderList}
                      forceFit
                      height={320}
                      scale={cols2}
                    >
                      <Coord type="theta" />
                      <Legend position="bottom-center" />
                      <Tooltip showTitle={false} />
                      <Geom
                        type="intervalStack"
                        position="value"
                        color={["name", COLORS]}

                      >
                        <Label
                          content="value"
                          offset={-40}
                          textStyle={{
                            textAlign: "center",
                            shadowBlur: 2,
                            shadowColor: "rgba(0, 0, 0, .45)"
                          }}
                        />
                      </Geom>
                    </Chart>:noData}
                  </div>
                </Col>
                <Col span={12}>
                  <h3 style={{ textAlign: 'center' }}>Unpicked Order</h3>
                  <div style={{ height: '275px' }}>

                  {unpickedOrderList.length ? <Chart
                      data={unpickedOrderList}
                      forceFit
                      height={320}
                      scale={cols2}
                    >
                      <Coord type="theta" />
                      <Legend position="bottom-center" />
                      <Tooltip showTitle={false} />
                      <Geom
                        type="intervalStack"
                        position="value"
                        color={["name", COLORS2]}

                      >
                        <Label
                          content="value"
                          offset={-40}
                          textStyle={{
                            textAlign: "center",
                            shadowBlur: 2,
                            shadowColor: "rgba(0, 0, 0, .45)"
                          }}
                        />
                      </Geom>
                    </Chart>:noData}
                  </div>

                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }} gutter={12}>
          <Col span={12}>
            <div style={{ background: '#ffffff', margin: 3 }}>
              <h3 style={{ textAlign: 'center' }}>Pending Putaway</h3>
              <div style={{ height: '275px' }}>
              {pendingPutawayList.length ? <Chart height={320} data={pendingPutawayList} scale={colsPendingPutaway} forceFit>
                  <Axis />
                  <Tooltip />

                  <Geom type="interval" position="date*count" color='#BDD7EE'>
                    <Label content={['count', (n) => {
                      return n;
                    }]} />
                  </Geom>
                </Chart>:noData}
              </div>

            </div>
          </Col>
          <Col span={12}>
            <div style={{ background: '#ffffff', margin: 3 }}>
              <h3 style={{ textAlign: 'center' }}>Other Order</h3>
              <div style={{ height: '275px', overflowY: 'scroll' }}>
              


                <StandardTable
                  disabledRowSelected={true}
                  scrollY={190}
                  data={dataList}
                  columns={columns}
                  loading={loading}
                  onPaginationChange={this.handleStandardTableChange}
                />
              </div>

            </div>

          </Col>
        </Row>
        <Row gutter={12}>

          <Col span={8}>
            <div style={{ background: '#ffffff', margin: 3 }}>
              <h3 style={{ textAlign: 'center' }}>Putaway</h3>

              <div style={{ height: '200px' }}>
              {putawayList.length ? <Chart
                  height={230}
                  data={putawayList}
                  scale={colsZ}
                  forceFit
                >
                  <Axis />
                  <Legend position="bottom-center" />

                  <Tooltip crosshairs={{ type: 'y' }} />
                  <Geom type="line" position="time*count" color='#4472C4' size={2} ><Label content={['count', (n) => {
                    return n;
                  }]} /></Geom>
                  <Geom
                    type="point"
                    position="time*count"
                    size={4}
                    shape={'circle'}
                    style={{ stroke: '#fff', lineWidth: 1 }}
                    color="#4472C4"
                  />

                </Chart>:noData}
              </div>
            </div>

          </Col>
          <Col span={8}>
            <div style={{ background: '#ffffff', margin: 3 }}>
              <h3 style={{ textAlign: 'center' }}>Outbound</h3>
              <div style={{ height: '200px' }}>
              {outboundList.length ? <Chart
                  height={230}
                  data={outboundList}
                  scale={colsZ}
                  forceFit
                >
                  <Axis />
                  <Legend position="bottom-center" />

                  <Tooltip crosshairs={{ type: 'y' }} />
                  <Geom type="line" position="time*count" color='#4472C4' size={2} ><Label content={['count', (n) => {
                    return n;
                  }]} /></Geom>
                  <Geom
                    type="point"
                    position="time*count"
                    size={4}
                    shape={'circle'}
                    style={{ stroke: '#fff', lineWidth: 1 }}
                    color="#4472C4"
                  />

                </Chart>:noData}
              </div>

            </div>


          </Col>
          <Col span={8}>
            <div style={{ background: '#ffffff', margin: 3 }}>
              <h3 style={{ textAlign: 'center' }}>Current Inventory</h3>
              <div style={{ textAlign: 'center', lineHeight: '200px', fontSize: '50px', fontWeight: 'bold', color: '#178DF9' }}>{currentInventorys || 0}</div>

            </div>
          </Col>
        </Row>
      </div>
    );
  }
}