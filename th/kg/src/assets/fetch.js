import axios from 'axios';
import Qs from 'qs';

let request = function (config) {
  // Do something before request is sent
  return config;
};

let response = function (response) {
  // Do something with response data
  // if (response.data.error_no === '20') { // 未登录已超时
  //     window.localStorage.removeItem('user_token');
  //     return;
  // }
  return response;
};

/**
 * 基于axios ajax请求
 * @param url
 * @param method
 * @param data
 * @param timeout
 * @param headers
 * @returns {Promise<R>|Promise.<T>|*}
 */
export default function fetch (url, {method = 'post', data = {}, timeout = 30000, headers = {}}) {
  // let baseUrl = 'http://118.178.254.31:8050';
  // let baseUrl = window.localConfig.API_HOME;
  /**
   *   全局请求及响应拦截器
   */
  // Add a request interceptor
  axios.interceptors.request.use(request, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor
  axios.interceptors.response.use(response, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });
  headers = Object.assign({}, {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  }, headers);
  return axios({
    // baseURL: baseUrl,
    url: url,
    method: method,
    params: method === 'get' && data,
    data: method === 'post' && data,
    timeout: timeout,
    headers: headers,
  
    // paramsSerializer: function(params) {
    //   return Qs.stringify(params)
    // },
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    transformResponse: [function (response) {
      // Do whatever you want to transform the data
      var res = null;
      try {
        // statements
        res = JSON.parse(response);
        return res;
        // return [res.data][0] ? res.data : res;
      } catch (e) {
        // statements
        console.log('axios transformResponse ' + e);
      }
    }]
  }).catch(function (error) {
    if (error.response) {
      // The request was made, but the server responded with a status code
      // that falls out of the range of 2xx
      console.log('error: ' + error.response.data);
      console.log('error: ' + error.response.status);
      console.log('error: ' + error.response.headers);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log('error: ' + error.config);
    return {error_no: -1, error_info: '请求异常!'};
  });
}
