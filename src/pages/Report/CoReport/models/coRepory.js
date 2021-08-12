import { coReportList, exportFile } from '@/services/report/coReport';

export default {
    namespace: 'coReport',

    state: {
        coReportList: {},
    },

    effects: {
        // 库存报表列表：
        *coReportList({ payload, callback }, { call, put }) {
            const response = yield call(coReportList, payload);
            if (response.code === 0) {
                const { list, pageSize, total, pageNum } = response.data;
                yield put({
                    type: 'show',
                    payload: {
                        coReportList: {
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
                coReportList: payload.coReportList,
            };
        },
    },
};