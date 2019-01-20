import { post, getBody } from './http';

const url = '/rest/customer';

// 获得升级
export function getRank(params) {
    return post(url + '/findCustomerRank', getBody(params));
}

export function getBanner(params) {
    return post('/banner/findList', getBody(params));

}

// 获得顶级目录
export function findTypeList(params = {}) {
    return post('/productType/findList', getBody(params));
}
// 获得 产品列表
export function findProductList(params = {}) {
    return post('/product/findPage', getBody(params));
}
export function findLablePage(params) {
    return post('/product/findLablePage', getBody(params));
}
// 分类 查询 分类列表
export function findThirdProductTypeList(params) {
    return post('/productType/findThirdProductTypeList', getBody(params));
}

// 获得热搜
export function findHotSearch(params) {
    return post('/product/findHotSearch', getBody(params));
}
// 广告弹窗*lxb*
export function getOne(params) {
    return post('/advertisement/getOne', getBody(params));
}