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
import { allDispatchType, menuTypeData, selectDetailAndInfo, renderTableAdSelect } from './utils';

@connect(({ tmsMenu, loading, component }) => ({
  selectDetails: tmsMenu.selectDetails,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.detail],
}))
export default class MenulDetail extends Component {
  state = {};
  componentWillMount() {
    // 查询字典项
    // const allDict = [allDictList.otherFeeType, allDictList.currencyType];
    // queryDict({ props: this.props, allDict });
  }

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
    const { loading, selectDetails, detailId } = this.props;
    const {} = this.state;
    const detail = selectDetails[detailId] || {};

    const editPageParams = {
      panelValue: [{ key: '基础信息' }],
    };

    const formItem = [
      [
        <DetailPage label="菜单代码" value={detail.code} />,
        <DetailPage label="菜单名称" value={detail.name} />,
      ],
      [
        <DetailPage
          label="类型"
          value={renderTableAdSelect({
            props: this.props,
            value: detail.type,
            data: menuTypeData,
          })}
        />,
        <DetailPage label="ICO图标" value={detail.icon} />,
      ],
      [
        <DetailPage label="状态" value={detail.beActive ? '启用' : '禁用'} />,
        <DetailPage label="实体对象" value={detail.brandModel} />,
      ],
      [
        <DetailPage label="请求路径" value={detail.trueUrl} />,
        <DetailPage label="权限路径" value={detail.url} />,
      ],
      [<DetailPage label="备注" value={detail.remarks} />],
    ];

    return (
      <EditPage {...editPageParams}>
        <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
      </EditPage>
    );
  }
}
