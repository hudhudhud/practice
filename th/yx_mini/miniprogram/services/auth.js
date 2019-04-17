import { post } from '../api/request.js';
export function login() {
    if(!arguments[0].unionid){
        wx.showToast({
            title: '没有unionid',
            icon: 'none'
        })
    }
  return post('/login/authorization_login', arguments);
}

export function checkWxInfo() {
    return post('/authc/user_rank_we_chat/chech_info', arguments);
}
export function saveWXInfo() {
    return post('/authc/user_rank_we_chat/save_info', arguments);
}
