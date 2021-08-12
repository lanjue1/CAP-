import { Modal } from 'antd';
import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import { keyValue } from '@/utils/utils';
import router from 'umi/router';

export const formate = 'YYYY-MM-DD HH:mm:ss';
export const formateNOSecond = 'YYYY-MM-DD HH:mm';
export const routeUrl = {
  add: '/basicData/warehouseBin/warehouseBinAdd',
  edit: '/basicData/warehouseBin/warehouseBinEdit',


};

export const allDispatchType = {
  //请求的url
  list: 'UCI/selectUCI',
};
export const codes = {
  select: 'ENDORSELISTSELECT',
  showDetail: 'ENDORSELIST_VIEW',
  confirm:'ENDORSELIST_CONF',
  remove:'ENDORSELIST_DEL',
  add: 'ENDORSELIST_ADD',
  addEndorse:'ENDORSE_ADD',
  edit: 'ENDORSELIST_UPD',
  upload: 'ENDORSELIST_IMPORT',
  page: 'ENDORSELIST',
  bill: 'ENDORSELIST_GENERATE',
  import:'ENDORSELIST_IMPORT',
  export:'ENDORSELIST_EXPORT',
  
};


export function selectList({ payload = {}, props,  } = {}) {
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
    title: 'UCI.field.partNumber',
    dataIndex: 'partNumber',
    //是否显示type为from时的输入框，不写默认显示（用在新增编辑）
    width: 120,
  },
  {
    title: 'UCI.field.countryCode',
    dataIndex: 'countryCode',
    width: 120,
  },{
    title: 'UCI.field.partBasicPrice',
    dataIndex: 'partBasicPrice',
    width: 120,
  },
  // {
  //   title: 'UCI.field.editFlag',
  //   dataIndex: 'editFlag',
  //   width: 120,
  // },
  // {
  //   title: 'UCI.field.fmapDays',
  //   dataIndex: 'fmapDays',
  //   width: 120,
  // },
  // {
  //   title: 'UCI.field.fmapOrigmfr',
  //   dataIndex: 'fmapOrigmfr',
  //   width: 120,
  // },
  // {
  //   title: 'UCI.field.fmapWarranty',
  //   dataIndex: 'fmapWarranty',
  //   width: 120,

  // },
  // {
  //   title: 'UCI.field.fmapWarrtype',
  //   dataIndex: 'fmapWarrtype',
  //   width: 120,
  // },
  // {
  //   title: 'UCI.field.partBasicPrice',
  //   dataIndex: 'partBasicPrice',
  //   width: 120,
  // },
  // {
  //   title: 'UCI.field.partCommGroup',
  //   dataIndex: 'partCommGroup',
  //   width: 120,

  // },
  
  // {
  //   title: 'UCI.field.partPriceCurrency',
  //   dataIndex: 'partPriceCurrency',
  //   width: 120,

  // },
  // {
  //   title: 'UCI.field.partRedType',
  //   dataIndex: 'partRedType',
  //   width: 120,

  // },
  // {
  //   title: 'UCI.field.spVendor',
  //   dataIndex: 'spVendor',
  //   width: 120,
  // },
  // {
  //   title: 'UCI.field.createBy',
  //   dataIndex: 'createBy',
  //   width: 120,
  // },
  // {
  //   title: 'UCI.field.createTime',
  //   dataIndex: 'createTime',
  //   width: 120,
  // },
  // {
  //   title: 'UCI.field.updateBy',
  //   dataIndex: 'updateBy',
  //   width: 120,
  // },
  // {
  //   title: 'UCI.field.updateTime',
  //   dataIndex: 'updateTime',
  //   width: 120,
  // },
];

