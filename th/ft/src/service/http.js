import axios from 'axios';
import {Toast, Indicator} from 'mint-ui';


export function getBody(param = {}) {
    delete param.sign;
    if (param.load) {
        Indicator.open(param.loadText);
        delete param.load;
        delete param.loadText;
    }
    let token;
    try {
        const UserInfo = JSON.parse(localStorage.getItem('UserInfo'));
        token = UserInfo.token;
    } catch (e) {
    }
        param.token = token||'';
    let newParam = {};
    let keys =  Object.keys(param).filter(i => {
        return param[i]||param[i]===0||param[i]===false||i==='token';
    });

    let sign = keys.map(i => {
        newParam[i] = param[i];
        let value = param[i];
        if(typeof value === 'string')
            value = value.replace(/^\s+|\s+$/g,'');
        return i + '=' + value;
    }).join('&');
    newParam.sign = hex_md5(hex_md5(sign));
    return newParam;
}

import qs from 'qs';
//http request 拦截器
axios.interceptors.request.use(
    config => {
        config.data = qs.stringify(config.data);
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
            .then(response => {
                resolve(response.data);
                // 如果报错了 弹个提示
                if (response.data.status !== '0') {
                    if (data.body.errorMsg) {
                        Toast(data.body.errorMsg);
                    } else if (data.body.errorMsg !== false) {
                        Toast(response.data.msg);
                    }
                }
            })
            .catch(err => {
                if (err.request.status === 404) {
                    Toast('服务接口404');
                }
                if (err.request.status === 500) {
                    Toast('服务器错误');
                }
                reject(err)
            })
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                resolve(response.data);
                // 如果报错了 弹个提示
                if (response.data.status !== '0') {
                    if (data.errorMsg) {
                        Toast(data.errorMsg);
                    } else if (data.errorMsg !== false) {
                        Toast(response.data.msg);
                    }
                }
            }, err => {
                if (err.request.status === 404) {
                    Toast('服务404');
                }
                if (err.request.status === 500) {
                    Toast('服务器错误');
                }
                reject(err)
            })
    })
}
