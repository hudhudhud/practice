// miniprogram/packageHome/confirmOrder/index.js
import { addressKey, commoditKey } from "../../api/config";
import { calculate_postage, create_and_pay, find_mobile } from "../../services/home/shop";
import MD5 from '../../js/md5'
import { bindingInviter, check_user_first_order } from "../../services/profile/userInfo";

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail: {},
        remark: '',
        address: {},
        postAge: 0,
        payType: '0',
        districtId: '',
        showBindPhone: false,
        bindPhone: '', // 备选手机号
        showSetPayPsw: false,
        setPayPswTitle: '设置支付密码',
        showInputPayPsw: false,
        isSetPayPassword: 0,
        showPrompt: false,
        firstOrder: false,
        inviter: '', // 邀请人信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let detail;
        try {
            detail = JSON.parse(wx.getStorageSync(commoditKey));
        } catch (e) {}
        this.setData({
            detail: detail,
            inviter: app.globalData.inviter
        })
        console.log(detail);
        this.getAddress({currentTarget: {dataset: {}}});
        wx.nextTick(() => {
            this.checkBindPhone();
            this.checkIsFirst();
        })

    },
    getAddress: function (e) {
        // wx.chooseAddress(Object object)
        if (e.currentTarget.dataset.refresh) {
            this.chooseAddress();
            return;
        }
        let address;
        try {
            address = JSON.parse(wx.getStorageSync(addressKey));
            console.log(address);
            this.setData({
                address: address
            })
            this.getPostAge();
        } catch (e) {
            this.chooseAddress();
        }

    },
    // 微信选择地址
    chooseAddress: function () {
        wx.chooseAddress({
            success: (res) => {
                this.setData({
                    address: res
                });
                this.getPostAge();
                try {
                    wx.setStorageSync(addressKey, JSON.stringify(res));
                } catch (e) {
                }
            },
            fail: () => {
                wx.getSetting({
                    success: res => {
                        if (res.authSetting['scope.address'] === false) {
                            wx.showToast({
                                title: '获取地址失败!可在[右上角-关于-右上角-设置]修改授权',
                                icon: 'none',
                                duration: 4000
                            })
                        }
                    }
                })
            }
        })
    },
    getPostAge: function () {
        calculate_postage({
            productId: this.data.detail.id,
            quantity: this.data.detail.count,
            provinceName: this.data.address.provinceName,
            cityName: this.data.address.cityName,
            districtName: this.data.address.countyName
        }).then(res => {
            this.setData({
                postAge: res.cost,
                districtId: res.districtId
            })
        });
    },
    /**
     * 检查手机号是否绑定
     */
    checkBindPhone: function () {
        find_mobile().then(res => {
            this.data.isSetPayPassword = res.isSetPayPassword;
            if (!res.mobile) {
                // 如果没有绑定手机号
                this.setData({
                    showBindPhone: true,
                    bindPhone: this.data.address.telNumber || ''
                })
            } else {
                app.globalData.userInfo.mobile = res.mobile;
            }
        });
    },
    // 绑定手机和邀请人
    bindPhoneConfirm: function () {
        this.setData({
            inviter: app.globalData.inviter
        })
    },
    /**
     * 检查是否第一次下单, 是，则显示邀请人输入框
     */
    checkIsFirst: function () {
        check_user_first_order().then(res => {
            if (res.flag === '1' ) {
                this.setData({
                    firstOrder: true
                })
            }
        });
    },
    // 修改邀请人  显示弹窗
    changeInviter: function () {
        this.setData({
            showPrompt: true
        })
    },
    inviterConfirm: function (e) {
        this.setData({
            inviter: e.detail.content,
            showPrompt: false
        })
    },
    inviterCancel: function () {
        this.setData({
            showPrompt: false
        })
    },
    changeRemark: function (e) {
        this.data.remark = e.detail.value;
    },
    payTypeCheck: function (e) {
        this.setData({
            payType: e.currentTarget.dataset.type
        })
    },
    submit: function () {
        if (!this.data.address.userName) {
            wx.showToast({
                title: '请选择收货地址',
                icon: 'none'
            });
            return;
        }
        if (!this.data.inviter && this.data.firstOrder) {
            wx.showToast({
                title: '请输入邀请人ID',
                icon: 'none'
            });
            return;
        }
        if (this.data.payType === '0') {
            if (!this.data.isSetPayPassword) {
                this.setPayPsw();
                return;
            }
            this.setData({
                showInputPayPsw: true
            })
        } else {
            // 走微信支付流程
            wx.showToast({
                title: '暂未支持',
                icon: 'none'
            })
        }

    },
    inputPayPswConfirm: function (e) {
        this.setData({
            showInputPayPsw: false
        })
        this.createOrder(e.detail.psw);

    },
    inputPayPswCancel: function (e) {
        this.setData({
            showInputPayPsw: false
        })
        if (e.detail.forget) {
            // 忘记密码
            this.setData({
                showSetPayPsw: true,
                setPayPswTitle: '忘记支付密码'
            })
        }
    },
    /**
     * 提交订单
     */
    createOrder: function (psw) {
        if (this.data.firstOrder) {
            bindingInviter({inviteSn: this.data.inviter}).then(() => {
                this.createOrderHttp(psw);
            })
        } else {
            this.createOrderHttp(psw);
        }


    },
    createOrderHttp: function (psw) {
        create_and_pay({
            productId: this.data.detail.id,
            skuId: this.data.detail.skuId,
            quantity: this.data.detail.count,
            payType: this.data.payType,
            districtId: this.data.districtId,
            remark: this.data.remark,
            skuName: Object.values(JSON.parse(this.data.detail.skuStr)).join(','),
            entrance: 0,
            address: this.data.address.provinceName + this.data.address.cityName + this.data.address.countyName + this.data.address.detailInfo,
            mobile: this.data.address.telNumber,
            name: this.data.address.userName,
            payPassword: MD5(psw)
        }, {successMsg: '支付成功', load: '正在支付'}).then(res => {
            setTimeout(() => {
                wx.redirectTo({
                    url: '../paySuccess/index'
                })
            }, 2000)
        });
    },
    // 设置支付密码
    setPayPsw: function () {
        // isSetPayPassword
        this.setData({
            showSetPayPsw: true,
            setPayPswTitle: '设置支付密码'
        })
    },
    setPayPswConfirm: function () {
        this.data.isSetPayPassword = 1;
        this.setPayPswCancel()
    },
    setPayPswCancel: function () {
        this.setData({
            showSetPayPsw: false
        })
    }

})
