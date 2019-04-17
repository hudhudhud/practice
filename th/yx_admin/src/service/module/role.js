import {post} from "./../http";

let publicUrl='/authc/role/'
export function list() {
    return post(publicUrl+'find_page', arguments)
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
export function del() {
    return post(publicUrl+'delete', arguments)
}
export function editRoleResource() {
    return post(publicUrl+'edit_role_resource', arguments)
}
export function listUserByRole() {
    return post(publicUrl+'find_page_user_by_role_id', arguments)
}
