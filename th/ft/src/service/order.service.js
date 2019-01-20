import { post, getBody } from './http';

const url = '/rest/order';

// 获取订单列表
export function getOrderListService(params) {
    return post(url + '/findPage', getBody(params));
}
export function outingFindPage(params) {
    return post(url + '/outingFindPage', getBody(params));
}

// 取消订单
export function cancelOrder(params) {
    return post(url + '/cancelOrder', getBody(params));
}


// 获取订单详情 根据id
export function getOrderDetail(params) {
    return post(url + '/findOne', getBody(params));
}
// 获取订单详情 根据id
export function confirmAccept(params) {
    return post(url + '/confirmAccept', getBody(params));
}

// 获取 默认地址
export function getDefaultAddress(params={}) {
    return post( '/rest/customer/getDefaultAddress', getBody(params));
}

// 创建订单
export function createOrder(params={}) {
    return post( url + '/createOrder', getBody(params));
}

// 查询物流
export function findLogisticsLocal(params={}) {
    return post( url + '/findLogisticsLocal', getBody(params));
}//
// 查询物流详情
export function findLogistics(params={}) {
    return post( url + '/findLogistics', getBody(params));
}