// pages/balance/balance.js
Page({
  data: {
    balTabType:1,//tab切换
  },

  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  balTabBtn:function(event){//点击Tab切换
    this.setData({ balTabType:event.currentTarget.dataset.type});
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /* * 生命周期函数--监听页面隐藏*/
  onHide: function () {

  },

  /*** 生命周期函数--监听页面卸载*/
  onUnload: function () {

  },
  enterBalanceFun: function () {//点击进入余额详情页
    wx.navigateTo({
      url: '/pages/balance/balance',
      success: function (res) { }
    });
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