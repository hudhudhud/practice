import {post, get} from './http'
export function getList() {
    return post('/test/getTableList', arguments)
}

export function getListItem() {
    return get('/test/listItem', arguments)
}

export function updateItem() {
    return post('/test/updateItem', arguments)
}
