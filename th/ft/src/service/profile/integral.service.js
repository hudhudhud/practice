import { post, getBody } from '../http';

const url = '/rest/customerAccount';

//
export function getAccountLogList(params={}) {
    return post(url+ '/getAccountLogList', getBody(params));
}
