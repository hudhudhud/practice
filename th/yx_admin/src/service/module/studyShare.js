import {post} from "./../http";

let publicUrl='/authc/studyshare/';

export function list() {
    return post(publicUrl+'find_page', arguments)
}

export function del() {
    return post(publicUrl+'delete', arguments)
}

export function update() {
    return post(publicUrl+'update', arguments)
}

export function add() {
    return post(publicUrl+'save', arguments)
}
export function view() {
    return post(publicUrl+'view', arguments)
}

export function release_update() {
    return post(publicUrl+'release', arguments)
}
