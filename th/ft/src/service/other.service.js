import { post, getBody } from './http';

const url = '/rest/customerProtocol';

// 获取协议列表
export function findProtocolList(params={}) {
    return post(url + '/findProtocolList', getBody(params));
}
// 同意协议
export function saveProtocol(params={}) {
    return post(url + '/saveProtocol', getBody(params));
}

// 获取订单详情滚动名单 列表
export function getScrollOrderByProductId(params) {
    return post( '/product/getScrollOrderByProductId', getBody(params));
}
// 获取我的详情滚动名单 列表
export function showUpgradeList(params) {
    return post( '/rest/customer/showUpgradeList', getBody(params));
}