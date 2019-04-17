// packageMember/bankCard/index.js
import {
  find_bank_list,//查询用户银行卡
  bankDelete//删除用户银行卡
} from '../../services/member/member.js'
Page({
  data: {
    bankList:'',//银行卡列表
    bankStyle:{
      '1': { back: 'rgba(237, 27, 36, .7)', icon: 'ICBC' },
      '2': { back: 'rgba(0,55,122, .7)', icon: 'CCB' },
      '3': { back: 'rgba(49,136,111, .7)', icon: 'ABC' },
      '4': { back: 'rgba(237, 27, 36, 0.7)', icon: 'BOC' },
      '5': { back: 'rgba(237, 27, 36, 0.7)', icon: 'CMB' },
      '6': { back: 'rgba(0,55,122, .7)', icon: 'SPDB' },
      '8': { back: 'rgba(237, 27, 36, 0.7)', icon: 'CGB' },
      '9': { back: 'rgba(0,55,122, .7)', icon: 'BCM' },
      '11': { back: 'rgba(237,27,36,0.74)', icon: 'CMBC' },
      '12': { back: 'rgba(49,136,111,0.75)', icon: 'CEB' },
      '13': { back: 'rgba(0,55,122,0.74)', icon: 'ECITIC' },
    }
  },
  onLoad: function (options) {
    this.dataInitFun();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  dataInitFun:function(){//数据初始化
    find_bank_list().then(res=>{
      res.forEach(i=>{
        i.cardNumber = i.cardNumber.substr(-4,4);
        return;
      });
      this.setData({ bankList: res });
    });
  },
  deleteBankFun:function(e){//删除银行卡
  var that = this;
    wx.showModal({
      title: '火兔优选提示',
      content: '确认删除所选银行卡？',
      success(res) {
        if (res.confirm) {
          bankDelete({ id: e.target.dataset.id }, { successMsg: "删除成功！" }).then(res => {
            that.dataInitFun();
          });
        } else if (res.cancel) {
          
        }
      }
    })
  },
  /* * 生命周期函数--监听页面隐藏*/
  onHide: function () {

  },
  editBankCardFun: function ({ currentTarget: { dataset: { bankid } } }){//编辑银行卡
    wx.navigateTo({
      url: '/packageMember/bankCardDetail/index?id=' + bankid,
      success: function (res) { }
    });
  },
  addBankCardFun: function () {//新增银行卡
    wx.navigateTo({
      url: '/packageMember/bankCardDetail/index',
      success: function (res) { }
    });
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
