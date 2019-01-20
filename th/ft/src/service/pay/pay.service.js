import { fetch, post, getBody } from '../http';

const url = '/rest/customerAccount';
const url2 = '/rest/order';


// 获得余额
export function getAccount(params = {}) {
    return post(url + '/getAccount', getBody(params));
}

// 本地货币支付
export function payByLocalCurrency(params) {
    return post(url2 + '/payByLocalCurrency', getBody(params));
}

// 获取 积分
export function getIntegral(params) {
    return post( '/rest/customerAccount/getIntegral', getBody(params));
}

// 微信支付 获得验签
export function getPaySignature(params) {
    return post('/rest/orderPay/getPaySignature', getBody(params));

}

//第三方充值U币
export function getUPaySignature(params) {
    return post('/rest/orderPay/getUPaySignature', getBody(params));
}

// 通过小金库充值u币 depositByCoffers
export function depositByCoffers(params) {
    return post(url+'/depositByCoffers', getBody(params));
}
//获取支付金额
export function getCustomerAmountByOrderId(params) {
    return post(url2+'/getCustomerAmountByPayId', getBody(params));
}

// 确认代付信息
export function getPayInfo(params) {
    return post(url2+'/getPayInfo', getBody(params));
}

// 代付的人   获取代付信息
export function getPayInfo2(params) {
    return post('/anotherPay/getPayInfo', getBody(params));
}
// 代付的人   代付交易
export function getAnotherPaySignature(params) {
    return post('/orderAnotherPay/getAnotherPaySignature', getBody(params));
}
//获取今日收益
export function getfindTodayEarnings(params) {
    return post('/rest/customer/findTodayEarnings', getBody(params));
}
//获取本月收益
export function getMonthlyIncome(params) {
    return post('/rest/customer/findMonthEarnings',getBody(params));
}


//获取 e卡  可抵扣额度
export function getSkuEcardAmount(params) {
    return post('/product/getSkuEcardAmount',getBody(params));
}

//获取提现费率
export function getWithdrawalServiceRate(params) {
    return post(url+'/getWithdrawalServiceRate',getBody(params));
}
