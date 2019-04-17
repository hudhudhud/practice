import {post} from "./../http";
let mainOrderUrl='/authc/order_main/'

//分页查询主订单
export function list() {
    return post(mainOrderUrl+'find_page', arguments)
}

//查询主订单信息
export function view() {
    return post(mainOrderUrl+'view', arguments)
}

// 查询主单下的子单
export function find_detail_all() {
    return post(mainOrderUrl+'find_detail_all', arguments)
}

//查询物流信息
export function find_logistics() {
    return post(mainOrderUrl+'find_logistics', arguments)
}
//查询主单支付信息
export function find_main_payment_detai() {
    return post(mainOrderUrl+'find_main_payment_detai', arguments)
}

//查询收货地址
export function find_receiving_address() {
    return post(mainOrderUrl+'find_receiving_address', arguments)
}
//编辑收货地址
export function edit_receiving_address() {
    return post(mainOrderUrl+'edit_receiving_address', arguments)
}

//按类型查询备注
export function find_remark() {
    return post(mainOrderUrl+'find_remark', arguments)
}

//查询买家信息
export function find_seller_info() {
    return post(mainOrderUrl+'find_seller_info', arguments)
}

//添加备注
export function save_remark() {
    return post(mainOrderUrl+'save_remark', arguments)
}
//手动发货
export function shipments() {
    return post(mainOrderUrl+'shipments', arguments)
}

//获得用户订单
export function list_order_detail() {
    return post('/authc/order_detail/find_page', arguments)
}
