import { post, getBody } from './http';

const url = '/rest/customerAccount';

// 获得用户 资金流水 列表
export function getAccountLogList(params) {
    return post(url + '/getAccountLogList', getBody(params));
}

// 获得银行卡列表
export function getDefaultBankCard(params = {}) {
    return post(url + '/getDefaultBankCard', getBody(params));
}

// 提现
export function applyWithdrawal(params = {}) {
    return post(url + '/applyWithdrawal', getBody(params));
}

// 获取保证金  列表 findCashDepositList
export function findCashDepositList(params = {}) {
    return post(url + '/findCashDepositList', getBody(params));
}

// 获取对公账户
export function getSystemBankCard(params = {}) {
    return post(url + '/getSystemBankCard', getBody(params));
}
// 充值U币 线下提交凭证
export function depositByOffline(params = {}) {
    return post(url + '/depositByOffline', getBody(params));
}