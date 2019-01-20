import { post, getBody } from './http';

const url = '/rest/cart';


// 收藏商品
export function productCollect(params={}) {
    return post('/rest/customerCollect/productCollect', getBody(params));
}

// 获取列表
export function getCartList(params={}) {
    return post(url + '/getCartList', getBody(params));
}
// 改变数量
export function updateCartCount(params={}) {
    return post(url + '/updateCartCount', getBody(params));
}

// 删除商品
export function deleteCart(params={}) {
    return post(url + '/deleteCart', getBody(params));
}
// 下单 获取 信息
export function toSettle(params={}) {
    return post(url + '/toSettle', getBody(params));
}

