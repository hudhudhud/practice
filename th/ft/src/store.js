import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function getInfo() {
    let info;
    try {
        info = JSON.parse(localStorage.getItem('UserInfo'));
        setCookie('token', info.token || '');
     //   axios.defaults.headers.post['token'] =  info.token || '';
    } catch (e) {

    }
    return info;
}

function setCookie(name, value) {
    var Days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

import {getWxInitInfo} from './service/wx.service'
import axios from "axios";
import {systemNotice} from "./service/msg.service";

export default new Vuex.Store({
    state: {
        userInfo: getInfo() || {},
        inviterNumber: '', // 自己的inviterNumber
        agreementShow: false,
        showCode: false,
        wxCustomerShow: 0,
        wxInit: false,
        maskShow: true,
        msgCount: 0,
        STATIC_DATA: {
            roles: [
                '会员',
                '店主',
                '一星店主',
                '二星店主',
                '三星店主',
                '三星钻石店主',
                '三星皇冠店主'
            ],
            rolesCode:  ['member', 'shop', 'shop1', 'shop2', 'shop3', 'shop4', 'shop5']
        }
    },
    mutations: {
        login(state, payload) {
            // mutate state
            state.userInfo = payload;
            localStorage.UserInfo = JSON.stringify(payload);
            if (payload&&payload.token) {
                setCookie('token', payload.token);
            } else {
              //  localStorage.clear();
                setCookie('token', '');
            }
        },
        saveNumber(state, payload) {
            state.inviterNumber = payload;
        },
        showAgreement(state, payload) {
            state.agreementShow = payload;
        },
        handleShowCode(state, payload) {
            state.showCode = payload;
        },
        handleWxCustomerShow(state, payload) {
            state.wxCustomerShow = payload;
        },
        saveWxInit(state, payload) {
            state.wxInit = payload;
        },
        maskChange(state, payload) {
            state.maskShow = payload;
        },
        changeMsgCount(state, payload) {
            state.msgCount = payload;
        },
    },
    actions: {
        configShare({state, commit, dispatch}, payload) {
            dispatch('wxInit');
            wx.ready(res => {
                let link = location.origin + '/#/' + '?inviterNumber=' + state.inviterNumber + (payload?( '&redirect=' + payload):'');
                // <%--公共方法--%>
                let shareData = {
                    desc: '分享即赚',
                    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    success: function (res) {
                        //layer.msg('已分享');
                        // location.href= '../commodityInfo/commodityInfo?id=' +rewardPoint.GetRequest().pid+'&oid='+rewardPoint.GetRequest().oid；
                    },
                    cancel: function (res) {
                    }
                };
                // <%--分享给朋友接口--%>
                wx.onMenuShareAppMessage(shareData);
                // <%--分享到朋友圈接口--%>
                wx.onMenuShareTimeline(shareData);
            });
        },
        async wxInit({state, commit, dispatch}) {
            if (state.wxInit && state.inviterNumber) {
                return;
            }
            let {data: wxInfo} = await getWxInitInfo();
            if (!wxInfo) {
                return;
            }
            if (wxInfo.inviterNumber)
                commit('saveNumber', wxInfo.inviterNumber);
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: wxInfo.appId, // 必填，公众号的唯一标识
                timestamp: wxInfo.timestamp, // 必填，生成签名的时间戳
                nonceStr: wxInfo.nonceStr, // 必填，生成签名的随机串
                signature: wxInfo.signature,// 必填，签名
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ] // 必填，需要使用的JS接口列表
            });
            wx.ready(res => {
                commit('saveWxInit', true);
                console.log(res);
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            });
            wx.error((res) => {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

            });

        },

        async computeMsgCount({state, commit, dispatch}, payload) {
            if(payload !== undefined){
                commit('changeMsgCount', payload);
            }else{
               new Promise(function(resolve, reject){
                       systemNotice({noticeType: 1,pageNo: 1, pageSize: 10}).then(//通知
                           res=>{
                               if(res.status === '0'){
                                   let old = JSON.parse(localStorage.getItem('msgList')||JSON.stringify([]));
                                   let newList = (res.data.list||[]).filter(i => {
                                       return !old.includes(i.id)
                                   });
                                   resolve(newList.length)
                               }
                           }
                       );
                   }
               ).then(function(data){
                   systemNotice({noticeType: 2,pageNo: 1, pageSize: 10}).then(//公告
                       res=>{
                           if(res.status === '0'){
                               let old = JSON.parse(localStorage.getItem('msgList')||JSON.stringify([]));
                               let newList = (res.data.list||[]).filter(i => {
                                   return !old.includes(i.id)
                               });
                               commit('changeMsgCount',data + newList.length);
                           }
                       }
                   );
               })
            }
            // systemNotice
        }
    }
})
