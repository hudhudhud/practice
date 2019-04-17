// miniprogram/packageProfile/orderDetail/index.js
import { findOrderDetail } from "../../services/profile/order";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        detail: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function ({id}) {
        this.data.id = id;
        this.findOrderDetail();
    },

    findOrderDetail: function () {
        findOrderDetail({id: this.data.id}).then(res => {
            let total = (Number(res.userAmount)+Number(res.postage)).toFixed(2)
            this.setData({
                detail: {total: total, ...res}
            })
        })
    },
    toExpress: function(){
        wx.navigateTo({
            url: '../express/index?id='+this.data.detail.id
        })
    },
    copy:function () {
        wx.setClipboardData({
            data: this.data.detail.sn,
            success(res) {
                wx.showToast({
                    title: '复制成功',
                    icon: 'none'
                })
            }
        })
    }
})
