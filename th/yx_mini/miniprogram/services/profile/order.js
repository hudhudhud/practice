import { post } from '../../api/request.js';

export function findOrderPage() {
    return post('/authc/order/find_page', arguments);
}

export function findOrderDetail() {
    return post('/authc/order/find_order_detail', arguments);
}

export function findLogistics() {
    return post('/authc/logistics_info/find_logistics', arguments);
}
