import {post} from "./../http";
let publicUrl='/authc/resource/'
export function del() {
    return post(publicUrl+'delete', arguments)
}
export function list() {
    return post(publicUrl+'find_all', arguments)
}
export function listByUser() {
    return post(publicUrl+'find_all_by_user_id', arguments)
}
export function save() {
    return post(publicUrl+'save', arguments)
}
export function update() {
    return post(publicUrl+'update', arguments)
}
export function view() {
    return post(publicUrl+'view', arguments)
}
export function find_resource_ids_by_role_id() {
    return post(publicUrl+'find_resource_ids_by_role_id', arguments)
}
