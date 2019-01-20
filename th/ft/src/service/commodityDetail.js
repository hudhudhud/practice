import { post, getBody } from './http';

const url = '/rest/customer';
// getProductDiscount
export function getProductDiscount(params) {
    return post(url + '/getProductDiscount', getBody(params));
}
// 获取 商品详情
export function getProductDetail(params = {}) {
    return post('/product/findOne', getBody(params));
}

// 获取商品规格
export function getProductTagList(params = {}) {
    return post('/productTag/findList', getBody(params));
}
// 下单 获取 skuId
export function getSkuIdByProductTags(params = {}) {
    return post('/product/getSkuIdByProductTags', getBody(params));
}
// 添加入购物车
export function addToCard(params = {}) {
    return post('/rest/cart/addToCart', getBody(params));
}
// 获取 邀请人 信息
export function getInviteInfo(params) {
    return post('/customerLogin/getCustomerByNumber', getBody(params));
}

// 获取 积分商品  第三方价格
export function findBenchmarkPrice(params) {
    return post('/product/findBenchmarkPrice', getBody(params));
}
// 下单 获取 规格显示  *lxb*
export function findTag(params = {}) {
    return post('/productTag/findTag', getBody(params));
}

