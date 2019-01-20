import axios from 'axios';
import { Message } from 'element-ui';

export function get(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, data[0])
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
        axios.post(url, data[0])
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
    })
}
