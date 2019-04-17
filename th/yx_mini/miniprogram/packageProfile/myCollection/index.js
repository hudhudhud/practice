// miniprogram/packageProfile/myCollection/index.js
import { deleteCollection, getCollectionList } from "../../services/profile/collection";

Page({
    needPage: true,
    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCollectionList();
    },

    getCollectionList: function () {
        this.moreList.call(this,'list', getCollectionList);
    },
    deleteCollection: function (e) {
        wx.showModal({
            title: '提示',
            content: '确认删除！',
            success:(res) =>{
                if (res.confirm) {
                    let index = e.currentTarget.dataset.i;
                    deleteCollection({id: this.data.list[index].productId}, {successMsg: '删除成功',load: true}).then(() => {
                        this.data.pageNo = 1;
                        this.data.loading = false;
                        this.getCollectionList();
                    })
                }
            }
        })
    }
})
