import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Form, Input, DatePicker, Row, Col, Select, Card, Steps, Switch } from 'antd';
import StandardTable from '@/components/StandardTable';
import styles from '@/pages/Operate.less';
import SelectForm from '@/components/SelectForm';
import { transferLanguage } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TextArea from 'antd/lib/input/TextArea';
import iqcStyles from './index.less'
import AntdFormItem from '@/components/AntdFormItem';
import Prompt from '@/components/Prompt';
import FileReader from '@/components/FileReader';
import { CheckCircleTwoTone } from '@ant-design/icons';
import {
    formItemFragement,
    queryDict,
    filterAddFile,
    filterDeteteFile,
    formatPrice,
} from '@/utils/common';

const { Step } = Steps;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
@connect(({ iqc, common, component, loading, i18n }) => ({
    iqc,
    dictObject: common.dictObject,
    id: iqc.id,
    language: i18n.language
}))
@Form.create()
export default class IQCTask extends Component {
    state = {
        isOpenBox: false,
        isMonitor: false,
        step: 0,
        dispositionList: ['RET', 'UNU', 'CID', 'DOA', 'WRP'],
        collectData: {},
        resultData: {},
        reviewData: {},
        loading: false
    }

    componentDidMount() {
        const { match, form, dispatch, language } = this.props;
        const paramsId = match && match.params ? match.params.id : '';
        this.setState({
            currentId: paramsId,
        });

        this.getSelectDetails(paramsId);
    }

    getSelectDetails = id => {
        this.props.dispatch({
            type: 'iqc/asnDetails',
            payload: { id: id },
        });
    };

    checkStep = (value, type) => {
        this.setState({
            [type]: value
        }, () => {
            console.log('this.satte', this.state)
        })
    }

    lastStep = () => {
        this.setState({
            step: this.state.step - 1
        })
    }

    nextStep = () => {
        const { step, isMonitor, isOpenBox, currentId, resultData } = this.state
        const { dispatch, form } = this.props
        let params = { id: currentId, }
        let type = ''
        let isReturn = false
        this.setState({
            loading: true
        })
        switch (step) {
            case 0:
                if (!isOpenBox) {
                    this.setState({ step: 2 }, () => {
                        this.nextStep()
                    })
                    return
                }
                params = {
                    ...params,
                    isMonitor: isMonitor,
                    isSurfaceOpen: isOpenBox
                }
                type = 'iqc/qualityDocCheck'
                break;

            case 1:
                form.validateFieldsAndScroll((err, values) => {
                    if (err) return isReturn = true;
                    values.collectProduction = moment(values.collectProduction).format(dateFormat)
                    params = {
                        ...params,
                        ...values
                    }
                    // this.setState({ collectData: values })
                    type = 'iqc/qualityDocCheck'
                })

                break;
            case 2:
                type = 'iqc/logicQualityResult'
                break;
            case 3:
                form.validateFieldsAndScroll((err, values) => {
                    params = {
                        ...params,
                        ...resultData,
                    }
                    if (resultData.uploadFile) {
                        if (values.attaQuantity) {
                            params.fileTokens = filterAddFile(attaQuantity);
                        } else {
                            Prompt({ content: 'Please upload pictures', type: 'error' });
                            isReturn = true
                        }
                    }
                })

                type = 'iqc/logicQualityConfirm'
                break;
            default:
                break;
        }
        if (isReturn) {
            return
        }

        dispatch({
            type: type,
            payload: params,
            finallyFn: () => this.setState({ loading: false }),
            callback: (data) => this.nextStepCallBack(data),
        })

    }

    reset = () => {
        this.setState({
            step: 0,
            resultData: {},
            reviewData: {},
            isOpenBox: false,
            isMonitor: false
        })
        this.props.form.resetFields();
    }

    nextStepCallBack = (data) => {
        const { dispatch } = this.props
        const { currentId, step } = this.state
        switch (step) {
            case 0:
                this.setState({
                    step: 1
                })
                break;
            case 1:
                this.setState({
                    step: 2,
                    reviewData: data
                })
                break;
            case 2:
                this.setState({
                    resultData: data,
                    step: 3
                })
                break;
            case 3:
                this.setState({
                    step: 4
                })
                break;
            default:
                break;
        }
    }

    render() {
        const {
            iqc: { asnDetails, iqcDetailsList },
            form: { getFieldDecorator, getFieldValue },
            match: { params },
            language
        } = this.props;
        const _gutter = { md: 8, lg: 24, xl: 48 };
        const _row = { md: 24 };
        const { step, dispositionList, isMonitor, resultData, reviewData, isOpenBox, loading } = this.state
        const currentId = params.id;
        let selectDetails = asnDetails[currentId];
        const genExtraBasicInfo = () => (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{selectDetails && currentId && selectDetails.asnNo}</span>
            </div>
        );
        const commonParams = {
            getFieldDecorator,
            getFieldValue
        };
        return (<div className={styles.CollapseUpdate}>
            <PageHeaderWrapper title={genExtraBasicInfo()}>
                <Card>
                    <Steps current={step}>
                        <Step title="Check" />
                        <Step title="Collect" />
                        <Step title="Review" />
                        <Step title="Confirm" />
                    </Steps>
                </Card>
                <Card bodyStyle={{ padding: '50px 0' }} >
                    <div hidden={step !== 0} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                        <div style={{ display: 'flex', marginBottom: '20px' }} ><div style={{ width: 150, fontSize: 18 }} >Open Box</div> <Switch checked={isOpenBox} onChange={(value) => this.checkStep(value, 'isOpenBox')} /></div>
                        <div style={{ display: 'flex', marginBottom: '20px' }} ><div style={{ width: 150, fontSize: 18 }} >Monitor</div> <Switch checked={isMonitor} onChange={(value) => this.checkStep(value, 'isMonitor')} /></div>
                    </div>
                    <div hidden={step !== 1} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                        <Form layout="inline">
                            <Row gutter={_gutter}>
                                <Col {..._row}>
                                    <Form.Item label={transferLanguage('iqcTask.field.PN', language)}>
                                        {getFieldDecorator('collectPn', {
                                            rules: [{ required: true, message: '请输入' }],
                                        })(
                                            <Input style={{ width: 300 }} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={_gutter}>
                                <Col {..._row}>
                                    <Form.Item label={transferLanguage('iqcTask.field.SN', language)}>
                                        {getFieldDecorator('collectSn', {
                                            rules: [{ required: true, message: '请输入' }],
                                        })(
                                            <Input style={{ width: 300 }} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={_gutter}>
                                <Col {..._row}>
                                    <Form.Item label={transferLanguage('iqcTask.field.COO', language)}>
                                        {getFieldDecorator('collectCoo', {
                                            rules: [{ required: true, message: '请输入' }],
                                        })(
                                            <Input style={{ width: 300 }} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={_gutter}>
                                <Col {..._row}>
                                    <Form.Item label={transferLanguage('iqcTask.field.Production', language)}>
                                        {getFieldDecorator('collectProduction', {
                                            rules: [{ required: isMonitor }],
                                        })(
                                            <DatePicker style={{ width: 300 }} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={_gutter}>
                                <Col {..._row}>
                                    <Form.Item label={transferLanguage('iqcTask.field.Disposition', language)}>
                                        {getFieldDecorator('collectDisposition', {
                                            rules: [{ required: true }],
                                        })(
                                            <Select style={{ width: 300 }} >{dispositionList.map(v => <Option key={v} value={v} >{v}</Option>)}</Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            {getFieldValue('collectDisposition') === 'CID' && <Row gutter={_gutter}>
                                <Col {..._row}>
                                    <Form.Item label={transferLanguage('iqcTask.field.CIDCode', language)}>
                                        {getFieldDecorator('cidCode', {
                                            rules: [{ required: true }],
                                        })(
                                            <Input style={{ width: 300 }} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>}
                            <Row gutter={_gutter}>
                                <Col {..._row}>
                                    <Form.Item label={transferLanguage('iqcTask.field.remarks', language)}>
                                        {getFieldDecorator('remarks', {
                                        })(
                                            <TextArea style={{ width: 300 }} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div hidden={step !== 2} style={{ display: 'flex', flexDirection: 'column', padding: '0px 50px' }}>
                        <div className={iqcStyles.lineTextBox} >
                            <div className={iqcStyles.lineLable} >PN</div>
                            <div>
                                <div>{reviewData.partNo}</div>
                                <div className={reviewData.partNo === reviewData.collectPn ? iqcStyles.greenText : iqcStyles.redText} >{reviewData.collectPn}</div>
                            </div>
                        </div>
                        <div className={iqcStyles.lineTextBox} >
                            <div className={iqcStyles.lineLable} >SN</div>
                            <div>
                                <div>{reviewData.snNo}</div>
                                <div className={reviewData.snNo === reviewData.collectSn ? iqcStyles.greenText : iqcStyles.redText} >{reviewData.collectSn}</div>
                            </div>
                        </div>
                        <div className={iqcStyles.lineTextBox} >
                            <div className={iqcStyles.lineLable} >COO</div>
                            <div>
                                <div>{reviewData.iqcCoo}</div>
                                <div className={reviewData.iqcCoo === reviewData.collectCoo ? iqcStyles.greenText : iqcStyles.redText} >{reviewData.collectCoo}</div>
                            </div>
                        </div>
                        <div className={iqcStyles.lineTextBox} >
                            <div className={iqcStyles.lineLable} >Production</div>
                            <div>
                                <div >{reviewData.collectProduction}</div>
                            </div>
                        </div>
                        <div className={iqcStyles.lineTextBox} >
                            <div className={iqcStyles.lineLable} >Disposition</div>
                            <div>
                                <div>{reviewData.collectDisposition}</div>
                            </div>
                        </div>
                        <div className={iqcStyles.lineTextBox} >
                            <div className={iqcStyles.lineLable} >Remarks</div>
                            <div>
                                <div>{reviewData.remarks}</div>
                            </div>
                        </div>
                    </div>
                    <div hidden={step !== 3} style={{ display: 'flex', flexDirection: 'column', padding: '0px 50px', marginBottom: '100px' }}  >
                        <div className={iqcStyles.lineTextBox} >
                            <div className={iqcStyles.lineLable} >Disposition:</div>
                            <div>
                                <div>{resultData.disposition}</div>
                            </div>
                        </div>
                        <div className={iqcStyles.lineTextBox} >
                            <div className={iqcStyles.lineLable} >Redemption:</div>
                            <div>
                                <div>{resultData.redemption}</div>
                            </div>
                        </div>
                        <div className={iqcStyles.lineTextBox} >
                            <div className={iqcStyles.lineLable} >Location:</div>
                            <div>
                                <div>{resultData.location}</div>
                            </div>
                        </div>
                        <div hidden={!resultData.uploadFile} className={iqcStyles.lineTextBox} >
                            <div className={iqcStyles.lineLable} >Upload Image:</div>
                            <AntdFormItem
                                code="attaQuantity"
                                // initialValue={detail.fileList || []}
                                rules={[{ required: step === 3 ? true : false, message: 'Please Select' }]}
                                {...commonParams}
                            >
                                <FileReader />
                            </AntdFormItem>
                        </div>
                    </div>
                    <div hidden={step !== 4} style={{ display: 'flex', flexDirection: 'column', padding: '0px 50px', alignItems: 'center' }} >
                        <CheckCircleTwoTone style={{ fontSize: '48px' }} twoToneColor="#52c41a" />
                        <p>succeed！</p>

                        <Button style={{ marginTop: '50px' }} onClick={this.reset}  >reset</Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '50px' }} >
                        <Button hidden={step === 0 || step === 4} style={{ marginRight: '100px' }} onClick={this.lastStep}  >Last Step</Button>
                        <Button hidden={step === 4} type='primary' loading={loading} onClick={this.nextStep} >{step === 4 ? 'Confirm IQC' : 'Next Step'}</Button>
                    </div>
                </Card>
            </PageHeaderWrapper>
        </div >)
    }
}
