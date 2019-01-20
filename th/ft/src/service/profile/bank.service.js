import { post, getBody } from '../http';

const url = '/rest/customerAccount';

// 获取用户银行卡
export function getUserBankCardList(params={}) {
    return post(url + '/getUserBankCardList', getBody(params));
}
// 获取银行列表
export function getBankList(params={}) {
    return post(url + '/getBankList', getBody(params));
}

export function deleteBankCard(params={}) {
    return post(url + '/deleteBankCard', getBody(params));
}
