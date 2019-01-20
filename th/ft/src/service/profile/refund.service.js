import {post, getBody} from '../http';

const url = '/rest/afterSale';

// 退款
export function applyRefund(params = {}) {
    return post(url + '/applyRefund', getBody(params));
}

// 退货  returnedGoods
export function returnedGoods(params = {}) {
    return post(url + '/returnedGoods', getBody(params));
}

// 填写物流
export function addLogisticsInfo(params = {}) {
    return post(url + '/addLogisticsInfo', getBody(params));
}

// 退款原因 列表
export function getLogisticsNameReason(params = {}) {
    return post(url + '/getLogisticsNameReason', getBody(params));
}

// 物流公司列表
export function getLogisticsName(params = {}) {
    return post(url + '/getLogisticsName', getBody(params));
}

// 获取售后详情
export function refundFindone(params = {}) {
    return post(url + '/findOne', getBody(params));
}

// 撤销
export function cancelAfterSaleApply(params = {}) {
    return post(url + '/cancelAfterSaleApply', getBody(params));
}

//  售后流水记录
export function findAfterSaleFlow(params = {}) {
    return post(url + '/findAfterSaleFlow', getBody(params));
}

//  售后记录 退款
export function findRefundPage(params = {}) {
    return post(url + '/findAfterSalePage', getBody(params));
}
