import React, { Component, Fragment } from 'react';
import { Row, Col } from 'antd';
import { editCol, editGutter, editRow } from '@/utils/constans';
import EditPage from '@/components/EditPage';
import DetailPage from '@/components/DetailPage';

export default class Center extends Component {
  render() {
    const user = JSON.parse(localStorage.getItem('user'));
    const editPageParams = {
      panelTitle: ['个人信息'],
    };
    const formItem = [
      [<DetailPage label="登录账号" value={user.loginName} />],
      [<DetailPage label="登录姓名" value={user.sysName} />],
    ];
    return (
      <EditPage {...editPageParams}>
        <Fragment>
          {formItem.map((item, index) => {
            return (
              <Row gutter={editGutter} key={index}>
                {item.map((v, i) => {
                  const colSpan = item.length === 1 ? editRow : editCol;
                  return (
                    <Col {...colSpan} key={index + i}>
                      {v}
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </Fragment>
      </EditPage>
    );
  }
}
