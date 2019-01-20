import { post, getBody } from '../http';

const url = '/rest/customer';

//修改密码
export function updatePasswordByOld(params={}) {
    return post( url + '/updatePasswordByOld', getBody(params));
}

export function updatePayPasswordByOld(params={}) {
    return post( url +'/updatePayPasswordByOld', getBody(params));
}


// 重置密码
export function updatePassword(params={}) {
    return post( url + '/updatePassword', getBody(params));
}

export function updatePayPassword(params={}) {
    return post( url +'/updatePayPassword', getBody(params));
}//
export function updatePasswordByPhoneCode(params={}) {
    return post( '/customerLogin/updatePasswordByPhoneCode', getBody(params));
}