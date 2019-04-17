import {post} from "./../http";

let supplierAddressUrl='/authc/supplier_address/'
export function  del() {
    return post(supplierAddressUrl+'delete', arguments)
}
export function list() {
    return post(supplierAddressUrl+'find_page', arguments)
}
export function add() {
    return post(supplierAddressUrl+'save',arguments)
}
export function set_default() {
    return post(supplierAddressUrl+'set_default',arguments)
}
export function cancel_default() {
    return post(supplierAddressUrl+'cancel_default',arguments)
}

//地址处理
export function update(){
    return post('/authc/address/update',arguments)
}
export function view(){
    return post('/authc/address/view',arguments)
}

//省市区获取
export function area_list(){
    return post('/authc/district/find_list',arguments)
}
