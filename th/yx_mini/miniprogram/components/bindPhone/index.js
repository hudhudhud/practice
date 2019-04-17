// components/bindPhone/index.js
import {
    bindingMobile,
    bindingMobileAndInviter,
    sendBindingCode,
    setPayPasswordCode
} from "../../services/profile/userInfo";
const app = getApp();
Component({

    properties: {
        propPhone: {
            type: String,
            observer(newVal, oldVal, changedPath) {
                if(newVal&&newVal.length === 11){
                    this.setData({
                        phone: newVal
                    })
                }
            }
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        show: true,
        inviter: '',
        phone: '',
        code: '',
        time: '获取验证码'
    },
    lifetimes: {
        attached() {
           this.setData({
               inviter: app.globalData.inviter
           })
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleInput: function (e) {
            this.data[e.currentTarget.dataset.type] = e.detail.value;
        },
        sendCode: function () {
            if (this.data.phone.length !== 11) {
                wx.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none'
                })
                return;
            }
            if (typeof this.data.time === 'number') {
                return;
            }
            sendBindingCode({mobile: this.data.phone}).then(res => {
                this.timeDecrease();
            });
        },
        timeDecrease: function () {
            this.setData({
                time: 120
            });
            let inter = setInterval(() => {
                if (this.data.time > 0) {
                    this.setData({
                        time: this.data.time - 1
                    });
                } else {
                    clearInterval(inter);
                    this.setData({
                        time: '获取验证码'
                    });
                }
            }, 1000)
        },
        bindPhone: function () {
            if (!this.data.inviter) {
                wx.showToast({
                    title: '请输入邀请人ID',
                    icon: 'none'
                })
                return;
            }
            if (this.data.phone.length !== 11) {
                wx.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none'
                })
                return;
            }
            if (!this.data.code) {
                wx.showToast({
                    title: '请输入验证码',
                    icon: 'none'
                })
                return;
            }
            bindingMobileAndInviter({
                verificationCode: this.data.code,
                mobile: this.data.phone,
                inviteSnOrMobile: this.data.inviter
            }, {successMsg: '操作成功'}).then(() => {
                app.globalData.userInfo.mobile = this.data.phone;
                app.globalData.inviter = this.data.inviter;
                wx.setStorage({
                    key: 'inviter',
                    data: this.data.inviter
                });
                this.triggerEvent('confirm')
                this.setData({
                    show: false
                })
            })
        }
    }
})
