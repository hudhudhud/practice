//index.js
import {
    getBannar,
    getShopList
} from '../../services/home/home.js'

const app = getApp()

Page({
    needPage: true,
    data: {
        swiperActive: 0,
        bannerList: [],
        shopList: []
    },

    onLoad: function () {
        app.globalData.init.then(() => {
            this.getBanner();
            this.getShopList();
        });
    },

    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
        }
    },

    getBanner: function () {
        getBannar({id: 1}).then(res => {
            this.setData({
                bannerList: res
            })
        })
    },
    getShopList: function () {
        this.moreList.call(this, 'shopList', getShopList)
    },
    bannerClick: function (e) {
        switch (e.currentTarget.dataset.url) {
            case '/pages/profile/index':
            case '/pages/member/index':
                wx.switchTab({
                    url: e.currentTarget.dataset.url
                })
                break;
            default:
                wx.navigateTo({
                    url: e.currentTarget.dataset.url
                })
                break;
        }
    },

    transition: function (e) {
        this.setData({
            swiperActive: e.detail.current
        });
    },
    // 详情跳转
    toDetail: function ({currentTarget: {dataset: {id}}}) {
        wx.navigateTo({
            url: '/packageHome/shopDetail/index?id=' + id,
        })
    }

})
