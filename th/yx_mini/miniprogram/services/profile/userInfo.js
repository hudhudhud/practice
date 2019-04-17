import { post } from '../../api/request.js';

export function getUserInfo() {
    return post('/authc/user/find_info', arguments);
}


export function updateAvatar() {
    return post('/authc/user/update_avatar', arguments);
}

export function updateNickName() {
    return post('/authc/user/update_nick_name', arguments);
}

export function bindingMobile() {
    return post('/authc/user/binding_mobile', arguments);
}

export function bindingInviter() {
    return post('/authc/user/binding_invite', arguments);
}
export function bindingMobileAndInviter() {
    return post('/authc/user/binding_invite_or_mobile', arguments);
}
export function sendBindingCode() {
    return post('/authc/shortMessage/sendBindingCode', arguments);
}
export function setPayPasswordCode() {
    return post('/authc/shortMessage/setPayPasswordCode', arguments);
}

export function updatePayPassword() {
    return post('/authc/user/update_pay_password', arguments);
}

export function updateQrCode() {
    return post('/authc/user/update_qr_code', arguments);
}
export function check_user_first_order() {
    return post('/authc/order/check_user_first_order', arguments);
}
