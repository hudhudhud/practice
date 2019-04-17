// miniprogram/packageProfile/express/index.js
import { findLogistics } from "../../services/profile/order";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        info: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function ({id}) {
        this.data.id = id;
        this.findLogistics();
    },
    findLogistics: function () {
        findLogistics({id: this.data.id}, {load: '获取物流信息'}).then(res => {
            this.setData({
                info: res
            })
        });
    },
    copy:function () {
        wx.setClipboardData({
            data: this.data.info.number,
            success(res) {
                wx.showToast({
                    title: '复制成功',
                    icon: 'none'
                })
            }
        })
    }

})
