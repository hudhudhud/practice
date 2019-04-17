// components/setPayPsw/index.js
import { sendBindingCode, setPayPasswordCode, updatePayPassword } from "../../services/profile/userInfo";
import MD5 from "../../js/md5";

const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            observer(newVal, oldVal, changedPath) {
                if (newVal) {
                    this.setData({
                        phone: app.globalData.userInfo.mobile || ''
                    })
                }
            }
        },
        title: {
            type: String,
            value: '设置支付密码'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        phone: '',
        code: '',
        payPsw: '',
        time: '获取验证码'
    },
    /**
     * 组件的方法列表
     */
    methods: {
        handleInput: function (e) {
            this.data[e.currentTarget.dataset.type] = e.detail.value;
        },
        close: function () {
            this.triggerEvent('cancel')
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
            setPayPasswordCode({mobile: this.data.phone}).then(res => {
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
        setPayPsw: function () {
            if (this.data.payPsw.length !== 6 || isNaN(this.data.payPsw)) {
                wx.showToast({
                    title: '请输入正确的六位支付密码',
                    icon: 'none'
                })
                return;
            }
            updatePayPassword({
                payPassword: MD5(this.data.payPsw),
                msgCode: this.data.code,
                mobile: this.data.phone
            }, {successMsg: '设置成功'}).then(() => {
                this.triggerEvent('confirm')
            })
        }
    }
})
