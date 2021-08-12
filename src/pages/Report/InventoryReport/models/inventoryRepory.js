import { inventoryReportList, exportFile } from '@/services/report/inventoryReport';

export default {
    namespace: 'inventoryReport',

    state: {
        inventoryReportList: {},
    },

    effects: {
        // 库存报表列表：
        *inventoryReportList({ payload, callback }, { call, put }) {
            const response = yield call(inventoryReportList, payload);
            if (response.code === 0) {
                const { list, pageSize, total, pageNum } = response.data;
                yield put({
                    type: 'show',
                    payload: {
                        inventoryReportList: {
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
                inventoryReportList: payload.inventoryReportList,
            };
        },
    },
};