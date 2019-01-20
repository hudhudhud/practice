import { fetch, post, getBody } from './http';

const url = '/product';


// 获得套餐  图片
export function findMealList(params) {
    return post(url + '/findShopMealList', getBody(params));
}
// 换取SkuId
export function getSkuIdByProductTags(params) {
    return post(url + '/getSkuIdByProductTags', getBody(params));
}

// 判断信息
export function checkChangeInvite(params) {
    return post('/rest/customer/checkChangeInvite', getBody(params));
}
// inviteNumber 换取 invitePhone
export function getPhoneByNumber(params) {
    return post('/customerLogin/findCusByNum', getBody(params));
}

//  invitePhone 换取  inviteNumber
export function getNumberByPhone(params) {
    return post('customerLogin/checkInviterPhone', getBody(params));
}
// 获取邮费
export function findPostage(params) {
    return post('/rest/postage/findPostage', getBody(params));
}
// 购物车结算 获取邮费

export function findPostageCart(params) {
    return post('/rest/postage/findPostageForCartList', getBody(params));
}


// invitePhone 获取信息
export function getInviterInfo(params) {
    return post('/rest/customer/getInviterInfo', getBody(params));
}
