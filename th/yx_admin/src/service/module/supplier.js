import {post} from "./../http";
let supplierUrl='/authc/supplier/'
export function  del() {
    return post(supplierUrl+'delete', arguments)
}
export function list() {
    return post(supplierUrl+'find_page', arguments)
}
export function add() {
    return post(supplierUrl+'save',arguments)
}
export function view() {
    return post(supplierUrl+'view',arguments)
}

export function update() {
    return post(supplierUrl+'update',arguments)
}


