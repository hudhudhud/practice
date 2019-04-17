import {post} from "./../http";

let publicUrl='/authc/product_spec/'


export function list() {
    return post(publicUrl+'find_page', arguments)
}
export function add() {
    return post(publicUrl+'save', arguments)
}
export function update() {
    return post(publicUrl+'update', arguments)
}
export function view() {
    return post(publicUrl+'view', arguments)
}
//按id删除商品
export function del() {
    return post(publicUrl+'delete', arguments)
}

export function find_by_parent_id() {
    return post(publicUrl+'find_by_parent_id', arguments)
}
