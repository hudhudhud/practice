// packageProfile/myTeam/index.js
import {
  find_market_order_page//查询销售单
} from '../../services/member/member.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    salesOrderList:'',//销售订单列表
  },
  onLoad: function (options) {
    this.dataInitFun();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  dataInitFun:function(){//销售订单数据初始哈
    find_market_order_page().then(res=>{
      if(res.status==='0'){
        this.setData({ salesOrderList:res.data})
      }
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



