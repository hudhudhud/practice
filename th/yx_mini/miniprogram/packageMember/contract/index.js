// packageMember/contract/index.js
import {
  protocol_find_all,//查询协议列表
  protocol_view_detail//查询协议详情
} from '../../services/member/member.js'
Page({
  data: {
    dataList:''//协议列表
  },
  onLoad: function (options) {
    this.dataInitFun();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  dataInitFun:function(){//数据初始化
    protocol_find_all().then(res=>{
      this.setData({ dataList:res})
    });
  },
  enterDetailFun: function ({ currentTarget: { dataset: { id } } }){//进入详情页
    protocol_view_detail({ id: id }).then(res => {
      
    });
    // wx.navigateTo({
    //   url: '/packageMember/contractDetail/index?id=' + id,
    //   success: function (res) { }
    // });
  },
  /* * 生命周期函数--监听页面隐藏*/
  onHide: function () {

  },
  /*** 生命周期函数--监听页面卸载*/
  onUnload: function () {

  },
  /*** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {

  },

  /*** 页面上拉触底事件的处理函数*/
  onReachBottom: function () {

  },

  /*** 用户点击右上角分享*/
  onShareAppMessage: function () {

  }
})
