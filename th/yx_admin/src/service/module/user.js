import {post,get} from "./../http";
//登录登出
export function login() {
    return post('/login/login_in', arguments)
}
export function logOut() {
    return post('/login/login_out', arguments)
}
export function loginDetail() {
    return get('/login/detail')
}

let publicUrl='/authc/seller_user/'
//用户管理
export function list() {
    return post(publicUrl+'find_page', arguments)
}
export function del() {
    return post(publicUrl+'delete', arguments)
}
export function update() {
    return post(publicUrl+'update', arguments)
}
export function view() {
    return post(publicUrl+'view', arguments)
}
export function add() {
    return post(publicUrl+'add_seller_user', arguments)
}
export function userRole() {
    return post(publicUrl+'roles_allocation', arguments)
}
//为多个用户分配同一个角色
export function allocate_role_2_users() {
    return post(publicUrl+'allocate_role_2_users', arguments)
}
