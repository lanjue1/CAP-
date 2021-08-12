import { Modal } from 'antd';
import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import { keyValue } from '@/utils/utils';
import router from 'umi/router';



export const codes = {
  page: 'ENDORSELIST',
  snapshot:'Snapshot_Management_Initialize_Snapshot',
};



export const routeUrl = {
  add: '/outbound/load/AddLoad',
  edit: '/outbound/load/editLoad',
};
export const SelectColumns = [
  {
    title: 'Code',
    dataIndex: 'code',
    width: 120,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 150,
  },
]

export const allDispatchType = {
  //请求的url
  list: 'Snapshot/selectSnapshot',
  detail: 'Snapshot/viewSnapshot',
  operate: 'Snapshot/operateSnapshot',

  abled: 'Snapshot/abledSnapshot',
  detailList: 'Snapshot/selectSnapshotDelivery',

};



export function selectList({ payload = {}, props, typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.list,
    payload,
    callback: data => {
      if (!data) return;
      queryPerson({ data, props: props, url: allUrl.userList });
    },
  });
}

export const columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: 'Snapshot.field.warehouse',
    dataIndex: 'warehouseCode',
    width: 120,
  },
  {
    title: 'ASNDetail.field.partNo',
    dataIndex: 'partCode',
    width: 100,
  },
  {
    title: 'Common.field.status',
    dataIndex: 'partStatus',
    width: 100,
  },
  {
    title: 'Snapshot.field.snapshotDate',
    dataIndex: 'snapshotDate',
    width: 100,
  },
  {
    title: 'Snapshot.field.beginningQty',
    dataIndex: 'beginningQty',
    width: 100,
  },
  {
    title: 'Snapshot.field.receiveQty',
    dataIndex: 'receiveQty',
    width: 100,
  },
  {
    title: 'Delivery.field.deliveryQuantity',
    dataIndex: 'deliveryQty',
    width: 100,
  },{
    title: 'Snapshot.field.finalQty',
    dataIndex: 'endingQty',
    width: 100,
  },
  {
    title: 'Common.field.remarks',
    dataIndex: 'remarks',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'Common.field.createBy',
    dataIndex: 'createBy',
    width: 100,
  },
  {
    title: 'Common.field.createTime',
    dataIndex: 'createTime',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'Common.field.updateBy',
    dataIndex: 'updateBy',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'Common.field.updateTime',
    dataIndex: 'updateTime',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title: 'Snapshot.field.cargoOwnerId',
    dataIndex: 'cargoOwnerName',
    width: 150,
  },
];


