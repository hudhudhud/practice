import { post, getBody } from './http';
const url = '/product';
export function getWxInitInfo() {
    const urlValue = location.href.split('#')[0];
    return post(url + '/wxShare', getBody({url: urlValue}));
}