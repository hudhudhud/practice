import axios from 'axios';
import { Message } from 'element-ui';
import {getToken} from "../assets/auth";
import qs from 'qs';

// request拦截器
axios.interceptors.request.use(
    config => {
        config.data = qs.stringify(config.data);
        if(config.url==='/authc/product/export2Excel'){
            config.responseType='blob'
        }
        let token=getToken()
        if(token){
            config.headers['token'] =token;
        }
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

export function get(url, data = {}) {
    return new Promise((resolve, reject) => {
        if(!getToken()&&url!=="/login/login_in"){
           location.hash = "#/login";
            return
        }
        axios.get(url, {params:data[0]},)
            .then(response => {
                data[1] = data[1]||{};
                if(response.data.status === 0){
                    resolve(response.data.data);
                    // 显示成功消息
                    if(typeof data[1].successMsg === 'string'){
                        Message({
                            message: data[1].successMsg,
                            type: 'success'
                        });
                    }else if(data[1].successMsg === true){
                        Message({
                            message: response.data.msg,
                            type: 'success'
                        });
                    }
                }
                else  if(response.data.status === 2){
                    location.href = "/#/login";
                }else{
                    // 失败  提示
                    if(typeof data[1].errorMsg === 'string'){
                        Message.error(data[1].errorMsg);
                    }else if(!data[1].errorMsg){
                        Message.error(response.data.msg);
                    }
                }

            }, err => {
                if (err.request.status === 404) {
                    Message.error(err.request.status);
                }
                if (err.request.status === 500) {
                }
                Message.error(err.request.status);
                reject(err)
            })
            .catch(e=>{
                Message.error(e.message);
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
        if(!getToken()&&url!=="/login/login_in"){
            location.hash = "#/login";
            return
        }
       axios.post(url,data[0])
            .then(response => {
                data[1] = data[1]||{};
                if(response.data.status===undefined){
                    resolve(response.data)
                }
                else if(response.data.status === 0){
                    let res=response.data.data===null?response.data:response.data.data
                    resolve(res);
                    // 显示成功消息
                    if(typeof data[1].successMsg === 'string'){
                        Message({
                            message: data[1].successMsg,
                            type: 'success'
                        });
                    }else if(data[1].successMsg === true){
                        Message({
                            message: response.data.msg,
                            type: 'success'
                        });
                    }
                }
                else  if(response.data.status === 2){
                    location.href = "/#/login";
                }
                else{
                    // 失败  提示
                    if(typeof data[1].errorMsg === 'string'){
                        Message.error(data[1].errorMsg);
                    }else if(!data[1].errorMsg){
                        Message.error(response.data.msg);
                    }
                    reject(response.data);
                }
            }, err => {
                if (err.request.status === 404) {
                    Message.error(err.request.status);
                }
                if (err.request.status === 500) {
                }
                Message.error(err.request.status);
                reject(err)
            })
            .catch(e=>{
                Message.error(e.message);
                throw e
            })
    })
}
