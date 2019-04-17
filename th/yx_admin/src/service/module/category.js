import {post} from "./../http";

let publicUrl='/authc/category/';

export function list() {
    return post(publicUrl+'find_all', arguments)
}

export function del() {
    return post(publicUrl+'delete', arguments)
}
export function find_by_parent_id() {
    return post(publicUrl+'find_by_parent_id', arguments)
}

export function update() {
    return post(publicUrl+'update', arguments)
}

export function save() {
    return post(publicUrl+'save', arguments)
}
export function view() {
    return post(publicUrl+'view', arguments)
}
