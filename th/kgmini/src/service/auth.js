import { post } from "./httpRequest";
const url = "/user";
// import md5 from '../utils/md5';
export function login() {
  return post(url + "/mplogin", arguments);
}


export function regist(params) {
  //params.password = md5(params.password);
  return post(url + "/regist", arguments);
}

export function sendRegistCode() {
  return post(url + "/sendRegistCode", arguments);
}

export function getUserInfo() {
  return post(url + "/detail", arguments);
}

export function loginout() {
  return post(url + "/loginout", arguments);
}
