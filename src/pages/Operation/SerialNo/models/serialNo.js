import {
    fetchSerialNoList
} from '@/services/operation/serialNo';
import { memberExpression } from '@babel/types';
import Prompt from '@/components/Prompt';

export default {
    namespace: 'serialNo',

    state: {
        serialNoList: {},
    },

    effects: {
        // 序列号列表：
        *fetchSerialNoList({ payload, callback }, { call, put }) {
            const response = yield call(fetchSerialNoList, payload);
            if (response.code === 0) {
                const { list, pageSize, total, pageNum } = response.data;
                yield put({
                    type: 'show',
                    payload: {
                        serialNoList: {
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
                serialNoList: payload.serialNoList,
            };
        },
    },
};

