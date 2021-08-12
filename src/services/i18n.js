import request from '@/utils/request';

export async function fetchLanguage({ type }) {
    return request('/server/api/international/list', {
        type: 'headers',
        addHeaders: {
            'Accept-Language': type
        },
        method: 'POST'
    });
}
