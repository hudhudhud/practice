import { getItem } from "../utils/localStorage";
import md5 from '../utils/md5.js';

import axios from "axios";
import { Toast, Indicator } from "mint-ui";
import qs from 'qs';
import store from '../pages/store/store'
export const defaultOptions = {
  header: {
    "content-type": "application/x-www-form-urlencoded", // 默认值
    randomKey: ""
  }
};
import { baseUrl } from "./config";

/**
 *
 * @param url 接口路径
 * @param params 接口参数  params[0] api参数   params[1]配置参数 显示load(load),显示成功信息(successMsg),自定义失败信息(errorMsg)......
 * @param options 接口配置参数  header头
 * @returns {Promise<*>}
 */
export const post = async function(url, params, options = {}) {
  if (global.App === undefined) {
    return postH5(...arguments);
  }
  if (url === '/user/mplogin') {
    await getKey(getItem("re-address"));
  }
  options = { ...defaultOptions, ...options };
  if (params[1] && params[1].load) {
    wx.showLoading({
      title: params[1].loadText || ""
    });
  }
  if(params[0]){
    let sign=getSign(params[0])
    params[0].sign=sign
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url, //仅为示例，并非真实的接口地址
      data: params[0],
      method: "POST",
      header: options.header,
      success(res) {
        if (params[1] && params[1].load && !params[1].more) {
          wx.hideLoading();
        }
        if (res.data.status === 0) {
          if (params[1] && params[1].successMsg) {
            let msg = typeof params[1].successMsg === "string" ? params[1].successMsg : res.data.msg;
            wx.showToast({
              title: msg,
              icon: "none",
              duration: 1500
            });
          }
          resolve(res.data.data);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 2000
          });
          if (res.data.status === 2) {
          //  defaultOptions.header.randomKey = "";
            store.commit('logout');
            wx.navigateTo({
              url: "/pages/auth/login/main"
            });
          }
          reject(res.data);
        }
      },
      fail(e) {
        if (params[1] && params[1].load && !params[1].more) {
          wx.hideLoading();
        }
        wx.showToast({
          title: e.errMsg,
          icon: "none",
          duration: 2000
        });
        reject(e);
      },
      complete() {

      }
    });
  });
};

axios.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
const postH5 = async function(url, params, options = {}) {
  if (params[1] && params[1].load) {
    Indicator.open(params[1].loadText || "");
  }
  if(params[0]){
    let sign=getSign(params[0])
    params[0].sign=sign
  }
  return new Promise((resolve, reject) => {
    axios.post(url, params[0]).then(res => {
      if (params[1] && params[1].load && !params[1].more) {
        Indicator.close();
      }
      if (res.data.status === 0) {
        if (params[1] && params[1].successMsg) {
          let msg = typeof params[1].successMsg === "string" ? params[1].successMsg : res.data.msg;
          Toast(msg);
        }
        resolve(res.data.data);
      } else {
        Toast(res.data.msg);
        if (res.data.status === 2) {
          location.href = "/#/pages/auth/login/main";
        }
        reject(res.data);
      }
    }, error => {
      if (params[1] && params[1].load) {
        Indicator.close();
      }
      console.log(error);
      reject(error);
    });
  });
};

export const getKey = function(address='') {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: baseUrl + "/user/login",
            data: { code: res.code,zoneInfo: address },
            method: "POST",
            header: defaultOptions.header,
            success(res1) {
              if (res1.data.status === 0) {
                defaultOptions.header.randomKey = res1.data.data.randomKey;
                resolve();
              } else {
                wx.showToast({
                  title: res1.data.msg,
                  icon: "none",
                  duration: 2000
                });
                reject();
              }
            },
            fail(e) {
              wx.showToast({
                title: e.errMsg,
                icon: "none",
                duration: 2000
              });
              reject();
            }
          });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      }
    });
  });
};

function getSign(params){
  let ary=Object.keys(params).sort().map(key=>{
    return `${key}=${params[key]}`
  })
  let appscrect='acb96571ba23a46d76dh8253d5c6ed12'
  let arystr=ary.join('&')+appscrect
  let encryptedStr = md5(arystr).toUpperCase();
  return encryptedStr
}
