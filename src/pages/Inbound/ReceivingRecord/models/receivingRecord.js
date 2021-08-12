import {
    fetchReceivingList,
} from '@/services/inbound/receivingRecord';
import { memberExpression } from '@babel/types';
import Prompt from '@/components/Prompt';

export default {
    namespace: 'receivingRecord',

    state: {
        receivingList: {},
    },

    effects: {
        // ASN管理列表：
        *fetchReceivingList({ payload, callback }, { call, put }) {
            const response = yield call(fetchReceivingList, payload);
            if (response.code === 0) {
                const { list, pageSize, total, pageNum } = response.data;
                yield put({
                    type: 'show',
                    payload: {
                        receivingList: {
                            pagination: {
                                current: pageNum,
                                pageSize,
                                total,
                            },
                            list
                        },
                    },
                });
                callback && callback(list);
            }
        },
    },
    reducers: {
        // ASN列表数据
        show(state, { payload }) {
            return {
                ...state,
                receivingList: payload.receivingList,
            };
        },
    },
};

