// miniprogram/packageProfile/userSet/index.js
import { fileUpload } from "../../services/util";
import { updateAvatar, updateNickName, updateQrCode } from "../../services/profile/userInfo";

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        showPrompt: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        this.setData({
            userInfo: app.globalData.userInfo
        })
    },
    updateNickName: function () {
        this.setData({
            showPrompt: true
        })
    },
    promptConfirm: function ({detail}) {
        updateNickName({id: detail.content.replace(/\s/g, '')}, {successMsg: '修改成功'}).then(() => {
            app.globalData.userInfo.nickName = detail.content;
            this.setData({
                userInfo: app.globalData.userInfo
            })
            this.promptCancel();
        });
    },
    promptCancel: function () {
        this.setData({
            showPrompt: false
        })
    },
    updateHeadImg: function () {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                fileUpload(tempFilePaths[0]).then(res => {
                    updateAvatar({id: res.id}, {successMsg: '修改成功'}).then(() => {
                        app.globalData.userInfo.avatarUrl = res.url;
                        this.setData({
                            userInfo: app.globalData.userInfo
                        })
                    });
                })
            }
        })
    },
    uploadQrcode: function () {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                fileUpload(tempFilePaths[0]).then(res => {
                    updateQrCode({id: res.id}, {successMsg: '上传成功'}).then(() => {
                        app.globalData.userInfo.qrcodeUrl = res.url;
                        this.setData({
                            userInfo: app.globalData.userInfo
                        })
                    });
                })
            }
        })
    },
    updatePhone: function () {
        let type;
        if (this.data.userInfo.mobile) {
            type = '2';
        } else {
            type = '1';
        }
        wx.navigateTo({
            url: '/packageProfile/setPsw/index?type=' + type,
        })
    },
    setPsw: function (e) {
        wx.navigateTo({
            url: '/packageProfile/setPsw/index?type=3'
        })
    },
    // updatePsw: function(e){
    //   wx.navigateTo({
    //     url: '/packageProfile/updatePsw/index?type=' + e.target.dataset.type,
    //   })
    // }
})
