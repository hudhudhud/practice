import { post, getBody } from '../http';

const url = '/rest/customerAccount';

//我的信息；
export function accountAndSafe(params={}) {
    return post(url + '/accountAndSafe', getBody(params));
}

// 修改手机号
export function sendChangPhoneCode(params) {
    return post( '/rest/customer/sendChangPhoneCode', getBody(params));
}

export function updatePhone(params) {
    return post( '/rest/customer/updatePhone', getBody(params));
}