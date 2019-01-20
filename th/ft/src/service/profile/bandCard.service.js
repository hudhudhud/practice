import { post, getBody } from '../http';

const url = '/rest/customerAccount';

//
export function addBankCard(params={}) {
    return post(url+ '/addBankCard', getBody(params));
}

//
export function getBankList(params={}) {
    return post(url+ '/getBankList', getBody(params));
}