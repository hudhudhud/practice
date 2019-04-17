//index.js

import { getShopDetail } from "../../services/home/shop";
import { commoditKey } from "../../api/config";
import { addCollection, checkFavorite, deleteCollection } from "../../services/profile/collection";

const app = getApp()
import WxParse from '../../wxParse/wxParse'

Page({
    data: {
        menuShow: false,
        scrollTop: 0,
        id: '',
        detail: {},
        show: false,
        isCollect: false,
        userInfo: {}
    },
    onShareAppMessage: function (e) {
        return {
            imageUrl: this.data.detail.images[0],
            path: '/packageHome/shopDetail/index?id=' + this.data.id + '&code=' + this.data.userInfo.sn
        }
    },
    onLoad: function ({id, code}) {
        this.saveInviter(code);
        this.data.id = id;
        app.globalData.init.then(() => {
            this.getShopDetail();
            this.isCollection();
            //  this.getShopDetailSkuList();
        });
        this.setData({
            userInfo: app.globalData.userInfo
        })
        if (!this.data.userInfo.rank) {
            wx.hideShareMenu({});
        }
    },
    saveInviter: function (code) {
        if (!code)
            return;
        app.globalData.inviter = code;
        wx.setStorage({
            key: 'inviter',
            data: code
        });
    },
    toHome: function () {
        if (getCurrentPages().length === 1) {
            wx.reLaunch({
                url: '/pages/index/index'
            })
        } else {
            wx.navigateBack({})
        }
    },
    getShopDetail: function () {
        getShopDetail({id: this.data.id}).then(
            res => {
                this.setData({
                    detail: res
                })
                WxParse.wxParse('article', 'html', res.detail, this, 5);
            }
        );
    },

    isCollection: function () {
        checkFavorite({id: this.data.id}).then((res) => {
            this.setData({
                isCollect: res.flag
            })
        });
    },
    collection: function () {
        if (this.data.isCollect) {
            deleteCollection({id: this.data.id}, {successMsg: '操作成功'}).then(() => {
                this.isCollection();
            })
        } else {
            addCollection({id: this.data.id}, {successMsg: '操作成功'}).then(() => {
                this.isCollection();
            })
        }

    },
    // 显示隐藏 菜单
    checkMenu: function () {
        this.setData({
            menuShow: !this.data.menuShow
        })
    },
    handleScrollTop: function () {
        this.setData({
            scrollTop: 0,
            menuShow: false
        });
    },
    //立即 购买
    submit: function () {
        this.setData({
            show: true
        })

    },
    /**
     * 规格选择 关闭
     */
    specCancel: function () {
        this.setData({
            show: false
        })
    },
    /**
     * 规格选中，确认
     */
    specConfirm: function (e) {
        try {
            wx.setStorageSync(commoditKey, JSON.stringify({
                ...e.detail.sku,
                count: e.detail.count,
                name: this.data.detail.name,
                id: this.data.detail.id,
                imageUrl: this.data.detail.infoImageUrl
            }))
        } catch (e) {
        }
        wx.navigateTo({
            url: '../confirmOrder/index',
        });
        this.specCancel();

    }

})
