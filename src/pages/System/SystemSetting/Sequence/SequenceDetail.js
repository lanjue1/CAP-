import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import EditPage from '@/components/EditPage';
import DetailPage from '@/components/DetailPage';
import { formItemFragement, queryDict } from '@/utils/common';
import { allDictList } from '@/utils/constans';
import { sequenceDetail, renderTableAdSelect, allDispatchType, IcCardStatus } from './utils';

@connect(({ sequence, loading, component }) => ({
  sequenceDetail: sequence.sequenceDetail,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.detail],
}))
export default class DeclareDetail extends Component {
  state = {
    detailId: '',
  };

  componentWillMount() {
    // 查询字典项
    const allDict = [allDictList.manifest_transport, allDictList.manifest_goods];
    queryDict({ props: this.props, allDict });
  }
  componentDidMount() {
    const { detailId, match } = this.props;
    const currentId = match && match.params.id ? match.params.id : detailId;
    if (!currentId) return;
    this.handleStateChange([{ detailId: currentId }]);
    this.sequenceDetail();
  }

  sequenceDetail = () => {
    const { detailId, match } = this.props;
    const currentId = match && match.params.id ? match.params.id : detailId;
    currentId &&
      sequenceDetail({
        type: allDispatchType.detail,
        payload: { id: currentId },
        props: this.props,
      });
  };

  handleStateChange = (options = []) => {
    options.map(item => {
      this.setState(item);
    });
  };

  render() {
    const { loading, sequenceDetail } = this.props;
    const { detailId } = this.state;
    const detail = sequenceDetail[detailId] || {};

    const editPageParams = {
      title: detail.sequenceType || '',
      panelTitle: ['基础信息'],
    };

    const formItem = [
      [
        <DetailPage label="类型名称" value={detail.sequenceType} />,
        <DetailPage label="当前值" value={detail.curStep} />,
      ],
      [
        <DetailPage label="流水号长度" value={detail.codeLength} />,
        <DetailPage label="前缀" value={detail.fix} />,
      ],
      [
        <DetailPage label="日期格式" value={detail.formatStr} />,
        <DetailPage label="进制单位" value={detail.scale} />,
      ],
      [
        <DetailPage label="增长步长" value={detail.incrementStep} />,
        <DetailPage label="最大值" value={detail.maxValue} />,
      ],
    ];

    return (
      <Fragment>
        <EditPage {...editPageParams}>
          <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
        </EditPage>
      </Fragment>
    );
  }
}
