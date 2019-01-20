import { post, getBody } from './http';

const url = '/customerLogin';

// 注册
export function registByPhone(params) {
    return post(url + '/registByPhone', getBody(params));
}

// 设置密码
export function updatePassword(params) {
    return post( '/rest/customer/updatePassword', getBody(params));
}