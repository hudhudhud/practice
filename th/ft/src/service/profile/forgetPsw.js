import { post, getBody } from '../http';

const url = '/rest/customer';

//向手机号发送验证码；
export function sendFindPayPasswordCode(params={}) {
    return post(url + '/sendFindPayPasswordCode', getBody(params));
}

export function sendFindPayPasswordCode2(params={}) {
    return post( '/customerLogin/sendFindPasswordCode', getBody(params));
}

//验证手机号
export function checkFindPasswordCode(params={}) {
    return post( url + '/checkFindPayPasswordCode', getBody(params));
}

export function checkFindPasswordCode2(params={}) {
    return post( '/customerLogin/checkFindPasswordCode', getBody(params));
}

//修改密码
export function updatePassword(params={}) {
    return post( url + '/updatePassword', getBody(params));
}

export function updatePayPassword(params={}) {
    return post( '/customer/updatePayPassword', getBody(params));
}