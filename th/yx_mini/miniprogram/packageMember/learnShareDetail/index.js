// packageProfile/learnShareDetail/index.js
import {
  findLeanShareDetail//分页查询学习分享
} from '../../services/member/member.js'
const WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    id:'',
    learnShareData:''
  },
  onLoad: function (options) {
    this.setData({id:options.id});
    this.dataInitFun();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  dataInitFun:function(){
    let that = this;
    findLeanShareDetail({id:this.data.id}).then(res=>{
      this.setData({ learnShareData:res})
      WxParse.wxParse('article', 'html', res.detail, that, 0);
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
