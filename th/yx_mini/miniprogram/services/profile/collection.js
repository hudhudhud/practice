import { post } from '../../api/request.js';

export function getCollectionList() {
    return post('/authc/user_favorite/find_page', arguments);
}

export function deleteCollection() {
    return post('/authc/user_favorite/delete', arguments);
}

export function addCollection() {
    return post('/authc/user_favorite/save', arguments);
}

export function checkFavorite() {
    return post('/authc/user_favorite/check_favorite', arguments);
}
