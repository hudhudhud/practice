// miniprogram/packageProfile/orderList/index.js
import { findOrderPage } from "../../services/profile/order";
import { pay } from "../../services/home/shop";
import MD5 from '../../js/md5'

Page({
    needPage: true,
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        status: '',
        showInputPayPsw: false,
        payOrderId: ''
    },
 /*   onPullDownRefresh: function(){
      this.data.pageNo = 1;
      this.data.loading = true;
      this.getOrderList();
      wx.showToast({
          title: '1'
      })
    },*/
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function ({status}) {
        if (status) {
            this.setData({
                status: status
            })
        }
        this.getOrderList();
    },
    checkOrderStatus: function (e) {
        this.data.pageNo = 1;
        this.data.loading = false;
        this.setData({
            status: e.currentTarget.dataset.type
        })
        this.getOrderList();
    },
    getOrderList: function () {
        this.moreList.call(this, 'list', findOrderPage, {status: this.data.status})
    },
    // 订单详情
    toDetail: function (e) {
        wx.navigateTo({
            url: '../orderDetail/index?id=' + this.data.list[e.currentTarget.dataset.i].id,
        })
    },
    // 支付
    payNow: function (e) {
        this.data.payOrderId = this.data.list[e.currentTarget.dataset.i].id;
        wx.showActionSheet({
            itemList: ['余额支付', '微信支付'],
            success: (res) => {
                switch (res.tapIndex) {
                    case 0:
                        this.setData({
                            showInputPayPsw: true
                        })
                        break;
                }
            }
        })
    },
    confirmPay: function (e) {
        this.setData({
            showInputPayPsw: false
        })
        pay({
            payType: 0,
            payPassword: MD5(e.detail.psw),
            orderId: this.data.payOrderId
        }, {successMsg: '支付成功', load: true}).then(() => {
            this.data.pageNo = 1;
            this.data.loading = false;
            this.getOrderList();
        })
    },
    cancel: function () {
        this.setData({
            showInputPayPsw: false
        })
    }

})
