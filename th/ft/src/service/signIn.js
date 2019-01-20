import { post, getBody } from './http';


export function sendCode(params={}) {
    return post('/signUp/sendSignCode', getBody(params));
}

export function checkCode(params={}) {
    return post('/signUp/checkSignPhoneCode', getBody(params));
}
export function getInfo(params={}) {
    return post('/signUp/getSignUpInfo', getBody(params));
}

export function confirmSign(params={}) {
    return post('/signUp/confirmSign', getBody(params));
}