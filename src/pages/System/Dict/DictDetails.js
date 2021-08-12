import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';
import EditPage from '@/components/EditPage';
import DetailPage from '@/components/DetailPage';
import FileReader from '@/components/FileReader';
import StandardTable from '@/components/StandardTable';

import { formItemFragement, queryDict, queryPerson, formatPrice } from '@/utils/common';
import { allDictList, billStateOnlyReadList } from '@/utils/constans';
import { allDispatchType, selectDetailAndInfo } from './utils';
import DictInfo from './DictInfo';

@connect(({ Dict, loading, component }) => ({
  dictDetails: Dict.dictDetails,
  dictDataList: Dict.dictDataList,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.detail],
}))
export default class DictDetail extends Component {
  state = {};
  componentWillMount() {}

  componentDidMount() {
    const { detailId } = this.props;
    const id = detailId;
    if (!id) return;
    selectDetailAndInfo({
      type: allDispatchType.detail,
      payload: { id },
      props: this.props,
      callback: data => {},
    });
  }

  render() {
    const { loading, dictDetails, detailId, dictDataList } = this.props;
    const {} = this.state;
    const detail = dictDetails[detailId] || {};

    const editPageParams = {
      panelValue: [{ key: '字典信息' }, { key: '字典数据明细' }],
    };
    const infoParams = {
      id: detailId,
      type: 'details',
      loading,
    };
    const formItem = [
      [
        <DetailPage label="字典类型" value={detail.dictType} />,
        [<DetailPage label="状态" value={detail.beActive ? '启用' : '禁用'} />, <></>],
      ],
      [<DetailPage label="备注" value={detail.remarks} />],
    ];

    return (
      <EditPage {...editPageParams}>
        <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
        <Fragment>
          <DictInfo {...infoParams} data={dictDataList} onRef={this.onRef} />
        </Fragment>
      </EditPage>
    );
  }
}
