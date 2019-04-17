import {
    baseUrl
} from './config.js';
import { login } from "../services/auth";

 let token = '';
export function post(url, params) {
    if(!token&&url!=='/login/authorization_login'){
        try {
            const value = wx.getStorageSync('token')
            if (value) {
                token = value;
                // Do something with return value
            }
        } catch (e) {
            // Do something when catch error
        }
    }
    params[1] = params[1] || {};
    if(params[1].load){
        wx.showLoading({
            title: typeof params[1].load === 'string'?params[1].load:'等待中......',
        })
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + url, // 仅为示例，并非真实的接口地址
            data: params[0],
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                token: token
            },
            success: (res) => {
                if(params[1].load){
                    wx.hideLoading()
                }
                if (res.data.status === 0) {
                    resolve(res.data.data);
                    // 显示成功消息
                    if (params[1].successMsg) {
                        wx.showToast({
                            title: params[1].successMsg === true? res.data.msg:params[1].successMsg,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                } else {
                    if(res.data.msg === '登录过期请重新登录'){
                        token= '';
                        loginOutTime(url, params, resolve, reject);
                        return;
                    }
                    reject();
                    // 失败  提示
                    if (params[1].errorMsg !== false) {
                        wx.showToast({
                            title: params[1].errorMsg || res.data.msg,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }

            },
            fail: (err) => {
                if(params[1].load){
                    wx.hideLoading()
                }
                reject();
                wx.showToast({
                    title: params[1].errorMsg||err.data.msg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    });
}

function loginOutTime(url, params, resolve, reject) {
    wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
            console.log('[云函数] [login] user openid: ', res)
            login({unionid: res.result.unionid,openid: res.result.openid}, {errorMsg: '登录失败'}).then(res => {
                try {
                    wx.setStorageSync('token', res.token)
                } catch (e) { }
                post(url, params).then(res => resolve(res), err => reject(err))
            });
        }
    })
}
