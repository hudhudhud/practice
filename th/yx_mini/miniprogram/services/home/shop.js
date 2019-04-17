import { post } from '../../api/request.js';

export function getShopDetail() {
    return post('/authc/product/view', arguments);
}


export function getShopDetailSkuList() {
    return post('/authc/product_sku/find_list_by_product_id', arguments);
}


export function calculate_postage() {
    return post('/authc/postage/calculate_postage', arguments);
}

export function create_and_pay() {
    return post('/authc/order/create_and_pay', arguments);
}

export function pay() {
    return post('/authc/order/pay', arguments);
}
export function find_mobile() {
    return post('/authc/user/find_mobile', arguments);
}
