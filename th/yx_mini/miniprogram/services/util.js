import { post } from '../api/request.js';
import { baseUrl } from "../api/config";

export function fileUpload(url) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: baseUrl + '/file/upload', // 仅为示例，非真实的接口地址
            filePath: url,
            name: 'file',
            success: (res) => {
                const data = JSON.parse(res.data);
                // do something
                resolve(data.data);
            },
            fail: () => {
                reject()
            }
        })
    })

}

