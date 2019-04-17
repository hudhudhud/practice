//app.js
import { login } from './services/auth.js'
import { getUserInfo } from "./services/profile/userInfo";

let g_resolve;
App({
    onLaunch: function () {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: 'yx-abe90c',
                traceUser: true,
            })
        }

        let init = new Promise(resolve => {
            g_resolve = resolve;
        });

        this.globalData = {
            isIphonex: false,
            init: init, // 当init 承诺完成时候，才代表登录成功，后续的操作要在这之后
            userInfo: {}, // 用户个人信息
            commodit: {}, // 下单流程，商品信息
            inviter: '', // 邀请人ID
        }


        this.getInitInfo();
        wx.nextTick(() => {
            this.login();
        })
        this.completePage();
    },
    login: function () {
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                console.log('[云函数] [login] user openid: ', res)
                login({unionid: res.result.unionid, openid: res.result.openid}, {errorMsg: '登录失败'}).then(res => {
                    try {
                        wx.setStorageSync('token', res.token)
                    } catch (e) {
                    }
                    g_resolve();
                    this.getUserInfo();
                });
            },
            fail: err => {
                console.error('[云函数] [login] 调用失败', err)

            }
        })

    },
    completePage: function () {
        let isIPX = this.globalData.isIphonex;
        const oldPage = Page;
        Page = function (config) {
            config.data = config.data || {};
            config.data.isIPX = isIPX;
            if (config.needPage) {
                config.data.pageNo = 1;
                config.data.pageSize = 7;
                config.data.loading = false;
                config.moreList = function (name, api, otherParams = {}) {
                    if (this.data.loading) {
                        return;
                    }
                    this.setData({
                        loading: true
                    })
                    api({...otherParams, current: this.data.pageNo, size: this.data.pageSize}).then(
                        res => {
                            if (this.data.pageNo === 1) {
                                this.setData({
                                    [name]: res.records
                                })
                            } else {
                                this.setData({
                                    [name]: this.data[name].concat(res.records)
                                })
                            }
                            this.setData({
                                loading: res.records.length < this.data.pageSize
                            });
                            this.data.pageNo++;
                        }, () => {
                            this.setData({
                                loading: false
                            })
                        }
                    );
                };
            }

            oldPage(config);
        }

        const oldComponent = Component;
        Component = function (config) {
            config.data = config.data || {};
            config.data.isIPX = isIPX;
            oldComponent(config);
        }
    },
    getInitInfo: function () {
        wx.getSystemInfo({
            success: res => {
                // console.log('手机信息res'+res.model)
                let modelmes = res.model;
                if (modelmes.search('iPhone X') != -1) {
                    this.globalData.isIphonex = true
                }
            }
        })
        wx.getStorage({
            key: 'inviter',
            success: (res) => {
                this.globalData.inviter = res.data || '';
            }
        })
    },
    getUserInfo: function () {
        getUserInfo().then(res => {
            this.globalData.userInfo = res;
        });
    }
})
