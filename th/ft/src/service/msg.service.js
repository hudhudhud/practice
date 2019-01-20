import { post, getBody } from './http';


export function systemNotice(params) {
    return post( '/systemNotice/findPage', getBody(params));
}
//
export function findPageLogistics(params) {
    return post( '/rest/notice/findPageLogistics', getBody(params));
}

export function noticeDetail(params) {
    return post( '/systemNotice/findOne', getBody(params));
}
