// miniprogram/packageProfile/updatePsw1/index.js
import { bindingMobile, sendBindingCode, setPayPasswordCode, updatePayPassword } from "../../services/profile/userInfo";
import MD5 from '../../js/md5';
// 修改手机号 ，绑定手机号，
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: '1', // 1绑定手机号，  2修改手机号,  3修改支付密码
        userInfo: app.globalData.userInfo,
        phone: '',
        code: '',
        payPsw: '',
        time: '获取验证码'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.type === '1') {
            wx.setNavigationBarTitle({
                title: '绑定手机号'
            })
        } else if (options.type === '2') {
            wx.setNavigationBarTitle({
                title: '修改手机号'
            })
        } else {
            wx.setNavigationBarTitle({
                title: '修改支付密码'
            })
        }
        this.setData({
            type: options.type
        });
    },

    handleInput: function (e) {
        switch (e.currentTarget.dataset.type) {
            case '1':
                this.data.phone = e.detail.value;
                break;
            case '2':
                this.data.code = e.detail.value;
                break;
            case '3':
                this.data.payPsw = e.detail.value;
                break;
        }
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
        let sendFc;
        if (this.data.type === '3') {
            sendFc = setPayPasswordCode;
        } else {
            sendFc = sendBindingCode;
        }
        sendFc({mobile: this.data.phone}).then(res => {
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
    save: function () {
        switch (this.data.type) {
            case '1':
            case '2':
                bindingMobile({
                    verificationCode: this.data.code,
                    mobile: this.data.phone
                }, {successMsg: '操作成功'}).then(() => {
                    app.globalData.userInfo.mobile = this.data.phone;
                   setTimeout(() => {
                       wx.navigateBack({
                           detail: 1
                       })
                   }, 2000)
                })
                break;
            case '3':
                updatePayPassword({
                    payPassword: MD5(this.data.payPsw),
                    msgCode: this.data.code,
                    mobile: this.data.phone
                }, {successMsg: '修改成功'}).then(() => {
                    setTimeout(() => {
                        wx.navigateBack({
                            detail: 1
                        })
                    }, 2000)
                })
                break;
        }

    }

})
