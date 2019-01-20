import { post, getBody } from './http';

const url = '/rest/customer';


export function getAddressDetail(params={}) {
    return post(url+ '/getAddressDetail', getBody(params));
}

// 修改地址
export function updateAddress(params={}) {
    return post(url+ '/updateAddress', getBody(params));
}

export function addAddress(params={}) {
    return post(url+ '/addAddress', getBody(params));
}

//删除地址
export function deleteAddress(params={}) {
    return post(url+ '/deleteAddress', getBody(params));
}

export function getAddressList(params={}) {
    return post(url+ '/getAddressList', getBody(params));
}
