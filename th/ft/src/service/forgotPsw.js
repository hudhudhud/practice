import { post, getBody } from './http';

const url = '/rest/customer';

// 发送验证码
export function sendFindPayPasswordCode(params) {
    return post(url + '/sendFindPayPasswordCode', getBody(params));
}
export function updatePayPassworde(params) {
    return post(url + '/updatePayPasswordByPhoneCode', getBody(params));
}