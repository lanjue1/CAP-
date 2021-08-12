import { poReportList, exportFile } from '@/services/report/poReport';

export default {
    namespace: 'poReport',

    state: {
        poReportList: {},
    },

    effects: {
        // 库存报表列表：
        *poReportList({ payload, callback }, { call, put }) {
            const response = yield call(poReportList, payload);
            if (response.code === 0) {
                const { list, pageSize, total, pageNum } = response.data;
                yield put({
                    type: 'show',
                    payload: {
                        poReportList: {
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
        *exportFile({ payload, callback }, { call }) {
            yield call(exportFile, payload)
        }
    },
    reducers: {
        // ASN列表数据
        show(state, { payload }) {
            return {
                ...state,
                poReportList: payload.poReportList,
            };
        },
    },
};