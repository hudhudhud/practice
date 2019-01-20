import { post, getBody } from '../http';

const url = '/rest/customerCollect';

// 获取收藏列表
export function findPage(params) {
    return post(url + '/findPage', getBody(params));
}
// 删除收藏
export function cancelProductCollect(params) {
    return post(url + '/cancelProductCollect', getBody(params));
}