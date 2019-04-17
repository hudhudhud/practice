// packageProfile/learnShare/index.js
import {
  getBannar//学习分享banner
} from '../../services/home/home.js'

import {
  findLeanShareList//分页查询学习分享
} from '../../services/member/member.js'
Page({
  needPage: true,
  data: {
    bannerList:'',//学习分享banner
    learnShareList:''//学习分享列表
  },
  onLoad: function (options) {
    this.getBannarFun();
    this.addMoreFun();
  },
  addMoreFun: function () {
    this.moreList.call(this, 'learnShareList', findLeanShareList)
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  getBannarFun: function () {
    getBannar({ id:1}).then(res => {
      this.setData({bannerList: res});
    });
  },
  learnShareDetailFun: function ({ currentTarget: { dataset: { id } } }){//学习分享详情页
    wx.navigateTo({
      url: '/packageMember/learnShareDetail/index?id='+id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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
