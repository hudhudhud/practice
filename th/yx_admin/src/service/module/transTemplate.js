import {post} from "./../http";

let postageTemplateUrl='/authc/postage_template/'
export function  del() {
    return post(postageTemplateUrl+'delete', arguments)
}
export function list() {
    return post(postageTemplateUrl+'find_page', arguments)
}
export function update() {
    return post(postageTemplateUrl+'update',arguments)
}
export function add() {
    return post(postageTemplateUrl+'save',arguments)
}
export function view() {
    return post(postageTemplateUrl+'view',arguments)
}
export function set_default() {
    return post(postageTemplateUrl+'set_default',arguments)
}
export function cancel_default() {
    return post(postageTemplateUrl+'cancel_default',arguments)
}
export function check_used() {
    return post(postageTemplateUrl+'check_used',arguments)
}
