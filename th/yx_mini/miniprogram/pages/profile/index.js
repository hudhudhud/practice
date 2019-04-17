// pages/profile/index.js
import { getUserInfo } from "../../services/profile/userInfo";

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        linewith: '50%',//销售订单百分比
        rank: true,
        userInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getUserInfo();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 2
            })
        }
    },
    getUserInfo: function () {
        getUserInfo().then(res => {
            app.globalData.userInfo = res;
            this.setData({
                userInfo: res
            })
        });
    },


    oderListFun: function (event) {//我的订单列表
        wx.navigateTo({
            url: '/packageProfile/orderList/index?status='+event.currentTarget.dataset.statustype
        });
    },
    operationFun: function (event) {//点击进入我的收藏、地址管理、联系我们、账号设置
        let operationArr = ['myCollection', 'addressList', 'contactUs', 'userSet'];
        let opIndex = event.currentTarget.dataset.operationtype - 1;
        wx.navigateTo({
            url: '/packageProfile/' + operationArr[opIndex] + '/index'
        });
    },

})
