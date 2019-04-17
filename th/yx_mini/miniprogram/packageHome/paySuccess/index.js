// miniprogram/packageHome/paySuccess/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    back: function () {
        wx.navigateBack({
            delta: 2
        })
    },
    orderList: function () {
        wx.redirectTo({
            url: '/packageProfile/orderList/index'
        })
    }
})
