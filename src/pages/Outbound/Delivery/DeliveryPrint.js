import React, { Component } from 'react';
import JsBarcode from 'jsbarcode';
import { connect } from 'dva';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import QRCode from 'qrcode.react';
import { allDictList } from '@/utils/constans';
import hic from '@/assets/hic.png';
import { queryDict, formatPrice } from '@/utils/common';
import AdButton from '@/components/AdButton';
import { allDispatchType, renderTableAdSelect } from './utils';
import styles from '@/pages/print.less';

@connect(({ component, Delivery }) => ({
  Delivery,
  dictObject: component.dictObject,
  printData: Delivery.pickingPrintDetail
}))
export default class BillPrint extends Component {
  state = {
    time: new Date(),
    detail: [],
  };
  barcode = {}
  componentDidMount() {
    console.log('Picking', this.props.printData)
    const { printData } = this.props
    const { dispatch } = this.props;
    const {
      match: { params },
    } = this.props;
    if (!params || !params.id) return;
    dispatch({
      type: allDispatchType.print,
      payload: { moveIds: JSON.parse(params.id) },
      callback: data => {
        if (!data) return;
        this.setState({ detail: data }, () => {
          data.map(v => this.toJsBarcode(v))
        });
      },
    });

    // this.toJsBarcode();
  }

  componentWillUnmount() {

  }

  toJsBarcode(data) {
    // 调用 JsBarcode方法生成条形码
    console.log('data====', data)
    JsBarcode(this.barcode[data.moveId], data.soId || ' ', {

      text: data.soId || ' ',
      displayValue: true,
      width: 2.5,
      height: 65,
      margin: 5,
      fontSize: 25,
    });
  }
  render() {
    console.log('this.barcode', this.barcode)
    const {
      time,
      detail: {
        payCompany,
        realCurrencyType,
        reasons,
        realPayable,
        barcode,
        oaNo,
        relationObj,
        commitTime,
        payable,
        offsetAmount,
        billDetail,
      },
      detail,
    } = this.state;
    const { printData } = this.props
    const userName = JSON.parse(localStorage.getItem('user')).sysName;


    return (
      <div className={styles.customPrint}>
        <div className={styles.reactToPrint}>
          <ReactToPrint
            trigger={() => <AdButton text="打印" type="primary" />}
            content={() => this.refs}
          />
        </div>
        <div ref={el => (this.refs = el)}>
          {printData.map((item, index) => (<div style={printData.length > (index + 1) ? { marginBottom: '30px' } : {}} className={styles.printTable}>
            <div className={styles.codeBody}>
              <div style={{ height: '320px' }} >
                <div className={styles.wrapflex}>
                  <div style={{ fontSize: '25px' }} className={styles.left}><text >{item.soId}</text></div>
                  <div className={styles.right}>
                    <text className={styles.title}>ETA:</text>
                    <text>{item.eta}</text>
                  </div>
                </div>
                <div className={styles.wrapflex}>
                  <div className={styles.left}>
                    <text className={styles.title}>Customer:</text>
                    <text>{item.customerType}</text></div>
                  <div className={styles.right}>
                    <text className={styles.title}>Order:</text>
                    <text>{item.type}</text>
                  </div>
                </div>
                <div className={styles.wrapflex}>
                  {/* <div className={styles.left}> */}
                  <text className={styles.title}>Name:</text>
                  <text>{item.receiverName}</text></div>
                {/* </div> */}
                <div className={styles.wrapflex}>
                  <div>
                    <text className={styles.title}>Addr:</text>
                    <text>{item.receiverAddr}</text></div>
                </div>
                <div className={styles.wrapflex}>
                  <div className={styles.left}>
                    <text className={styles.title}>Contact:</text>
                    <text>{item.primContact}</text></div>
                  <div className={styles.right}>
                    <text className={styles.title}>ZIP:</text>
                    <text>{item.zip}</text>
                  </div>
                </div>
                <div className={styles.wrapflex}>
                  <text className={styles.title}>Shipping INS:</text>
                  <text>{item.shippingInstruction}</text>
                </div>
                <div style={{paddingLeft:'5px'}} /* className={styles.wrapflex} */>
                  <text className={styles.title} >Delivery INS:</text>
                  <text>{item.deliveryInstruction}</text>
                </div>
                <div className={styles.wrapflex}>
                  <div className={styles.left}>
                    <text style={{ fontSize: 22 }} className={styles.title}>Returnable:</text>
                    <text>{item.returnableInd ? 'Y' : 'N'}</text></div>
                  <div className={styles.right}>
                    <text style={{ fontSize: 22 }} className={styles.title}>CRU SWAY:</text>
                    <text>{item.cruSway ? 'Y' : 'N'}</text>
                  </div>
                </div>
                <div style={{ width: '100%', height: '1px', margin: '5px 1px', backgroundColor: '#000' }} ></div>
                <div className={styles.wrapflex}>
                  <div className={styles.left}>
                    <text className={styles.title}>Machine SN:</text>
                    <text>{item.machineSN}</text></div>
                  <div className={styles.right}>
                    <text className={styles.title}>Orig.PN:</text>
                    <text>{item.origPN}</text>
                  </div>
                </div>
                <div className={styles.wrapflex}>
                  <div className={styles.left}>
                    <text className={styles.title}>Ship PN:</text>
                    <text>{item.shipPN}</text></div>
                  <div className={styles.right}>
                    <text className={styles.title}>Ship SN:</text>
                    <text>{item.shipSN}</text>
                  </div>
                </div>
                <div className={styles.wrapflex}>
                  <div>
                    <text className={styles.title}>Ship PN Desc:</text>
                    <text>{item.receiverAddr}</text></div>
                </div>
                <div style={{ width: '100%', height: '1px', margin: '5px 1px', backgroundColor: '#000' }} />
                <div style={{ display: 'flex' }}>
                  <div style={{ padding: '10px' }}>
                    <QRCode
                      id="qrCode"
                      value={item}
                      size={88} // 二维码的大小
                      fgColor="#000000" // 二维码的颜色
                      style={{ margin: 'auto' }}
                    />
                  </div>
                  {item.cruSway ? (<div>
                    <div className={styles.flexCheckBox} style={{ width: '100%' }} >
                      <div className={styles.flexCheckBox} >
                        <div className={styles.checkBox} />
                        <div>RET</div>
                      </div>
                      <div className={styles.flexCheckBox} >
                        <div className={styles.checkBox} />
                        <div>UNU</div>
                      </div>
                      <div className={styles.flexCheckBox} >
                        <div className={styles.checkBox} />
                        <div>CID</div>
                      </div>
                      <div className={styles.flexCheckBox} >
                        <div className={styles.checkBox} />
                        <div>DOA</div>
                      </div>
                      <div className={styles.flexCheckBox} >
                        <div className={styles.checkBox} />
                        <div>WRP</div>
                      </div>
                    </div>

                    <div className={styles.flexCheckBox} style={{ padding: '1px 5px' }} >
                      <text>Return PN:</text>
                      <div style={{ width: '60%', height: '1px', margin: '30px 1px 0px', backgroundColor: '#000' }} />
                    </div>

                    <div className={styles.flexCheckBox} style={{ padding: '5px' }} >
                      <text>Return SN:</text>
                      <div style={{ width: '60%', height: '1px', margin: '30px 1px 0px', backgroundColor: '#000' }} />
                    </div>

                  </div>)
                    : (<div>
                      <p style={{ margin: '0px 10px' }} >For return collection arrangment，please</p>
                      <p style={{ margin: '0px 10px' }} >contact DHL personnel at <span style={{ fontWeight: 'bold' }}>+66-2-048-6489</span></p>
                      <p style={{ margin: '0px 10px' }} >Ext 421(LENOVO) or email</p>
                      <p style={{ margin: '0px 10px', fontWeight: 'bold' }} >TH.Lenovo@dhl.com</p>
                    </div>)
                  }
                </div>

              </div>
            </div>
            <div className={styles.barcode} style={{ position: 'relative', textAlign: 'center', }}>
              <div className={styles.svg}>
                <svg
                  ref={ref => {
                    this.barcode[item.moveId] = ref;
                  }}
                />
              </div>
            </div>
          </div>))}
        </div>
      </div>
    );
  }
}
