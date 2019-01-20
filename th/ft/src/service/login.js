import {post, getBody} from './http';


// 获取微信登录授权 url
export function getWxLoginAddress(params = {}) {
    return post('/customerLogin/getWxLoginAddress', getBody(params));
}

// 根据 code  微信登陆
export function wxLoginCallBack(params = {}) {
    return post('/customerLogin/wxLoginCallBack', getBody(params));
}

// 获取验证码
export function sendLoginCode(params = {}) {
    return post('/customerLogin/sendLoginCode', getBody(params));
}

// 登陆 ：手机号
export function loginByPhoneCode(params = {}) {
    return post('/customerLogin/loginByPhoneCode', getBody(params));
}

// 登陆  ：密码
export function loginByPassword(params = {}) {
    let newParams = {...params,password: hex_md5(params.password)};
    console.log(newParams);
    return post('/customerLogin/loginByPassword', getBody(newParams));
}

// 注册  获取验证码
export function sendRegistCode(params = {}) {
    return post('/customerLogin/sendRegistCode', getBody(params));
}

// 注册 使用微信 完成注册
export function loginAndBinDing(params = {}) {
    return post('/customerLogin/loginAndBinDing', getBody(params));
}