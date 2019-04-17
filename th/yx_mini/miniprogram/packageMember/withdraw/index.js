// pages/withdraw/index.js
import {
  findByUserId//通过userid查看实名认证信息
} from '../../services/member/member.js'
Page({
  data: {
    autonymShow:false,//实名认证显示
  },
  onLoad: function (options) {
    this.initFun();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  initFun:function(){//数据初始化
    findByUserId().then(res=>{
      if (res.status === 1) {
        wx.showToast({
          title: '实名认证正在审核中！',
          icon: 'none',
          duration: 2000
        });
      } else if (res.status === 2) {
        
      }else{
        this.setData({autonymShow:true});
      }
    });
  },
  autonymBtn:function(){
    wx.navigateTo({
      url: '/packageMember/autonym/index',
      success: function (res) { }
    });
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