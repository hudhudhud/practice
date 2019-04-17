// packageProfile/myTeam/index.js
import {
  find_by_invite_id//查询直属团队（直推）
} from '../../services/member/member.js'
const app = getApp();
Page({
  data: {
    myTeamList:'',//我的团队列表
  },
  onLoad: function (options) {
    this.dataInitFun();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  dataInitFun: function () {//我的团队数据初始化
    find_by_invite_id().then(res=>{
      if(res.status==='0'){
        this.setData({ myTeamList: res.data })
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



