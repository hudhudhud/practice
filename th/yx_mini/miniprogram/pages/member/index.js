// pages/profile/index.js
import { getUserInfo } from "../../services/profile/userInfo";
import {
  find_order,//统计查询销售额
  find_saleroom,//统计查询自身销量及销售量
  find_account//统计查询余额和临时收益
} from '../../services/member/member.js'
const app = getApp();
Page({
  data: {
    userInfo: {},
    linewith:'50%',//销售订单百分比
    rank:true,
    performanceData:'',//业绩数据
    saleroomData:'',//销量数据
    accountData:'',//资产模块显示的数据
  },
  onLoad: function(options) {
    this.memberDataFun();
  },
  onReady: function() {
    // console.log(app.globalData)
  },
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  /* * 生命周期函数--监听页面隐藏*/
  onHide: function() {

  },

  /*** 生命周期函数--监听页面卸载*/
  onUnload: function() {

  },
  memberDataFun:function(){//会员页面数据初始化
    if (app.globalData.userInfo.avatarUrl){
      this.setData({ userInfo: app.globalData.userInfo })
    }else{
      this.getUserInfo();
    }
    // find_order().then(res=>{
    //   this.setData({ performanceData: res.data });
    // });
    // find_saleroom().then(res=>{
    //   this.setData({ saleroomData: res.data });
    //   if (res.data.mySaleroom) {
    //     var lineLength = (res.data.mySaleroom / res.data.goalSaleroom).toFixed(2) * 100;
    //     this.setData({ linewith: lineLength })
    //   }
    // });
    // find_account().then(res => {
    //   this.setData({ accountData: res.data });
    // });
  },
  getUserInfo: function () {//获取用户信息
    getUserInfo().then(res => {
      app.globalData.userInfo = res;
      this.setData({
        userInfo: res
      })
    });
  },
  storeShareFun:function(){//进入店铺分享页
    wx.navigateTo({
      url: '/packageMember/storeShare/index',
      success: function (res) { }
    });
  },
  proDataFun: function () {//点击进入业绩数据
    wx.navigateTo({
      url: '/packageMember/performanceData/index',
      success: function (res) { }
    });
  },
  enterBalanceFun:function(){//点击进入余额详情页
    wx.navigateTo({
      url: '/packageMember/balance/index',
      success: function (res) { }
    });
  },
  enterStayOutFun: function () {//点击进入待发放详情页
    wx.navigateTo({
      url: '/packageMember/stayOut/index',
      success: function (res) { }
    });
  },
  applyBtnFun:function(event){//应用的八个点击
    var applytype = event.currentTarget.dataset.applytype-1;
    var navigateToArr = ["trainTutor", "myTeam", "salesOrder", "learnShare", "bankCard", "autonym", "contract", "achChart"];
    wx.navigateTo({
      url: '/packageMember/' + navigateToArr[applytype]+'/index',
      success: function (res) { }
    });
  },
  /*** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function() {

  },

  /*** 页面上拉触底事件的处理函数*/
  onReachBottom: function() {

  },

  /*** 用户点击右上角分享*/
  onShareAppMessage: function() {

  }
})