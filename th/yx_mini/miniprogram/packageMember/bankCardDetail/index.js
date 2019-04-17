// packageMember/bankCardDetail/index.js
import {
  bank_get_detail,//银行卡详细信息
  bankSave,//添加用户银行卡
  bankEdit//编辑用户银行卡
} from '../../services/member/member.js'
Page({
  data: {
    bankId:null,//银行卡id
    bankIndex:1,//开户银行的标记
    name:'',//持卡人姓名
    branchBankName: '',//所属支行
    cardNumber: '',//银行卡号
    byDefault: false,//是否默认
    salaryStatus: false,//是否工资卡
    bankList: [{ id: 1, name: "工商银行" },
      { id: 2, name: "建设银行" },
      { id: 3, name: "农业银行" },
      { id: 4, name: "中国银行" },
      { id: 5, name: "招商银行" },
      { id: 6, name: "浦东发展银行" },
      { id: 8, name: "广发银行" },
      { id: 9, name: "交通银行" }, 
      { id: 10, name: "民生银行" },
      { id: 11, name: "光大银行" },
      { id: 12, name: "中信银行" }
    ],
  },
  onLoad: function (options) {
    if (options.id){
      this.setData({ bankId: options.id });
      this.bank_get_detailFun();
    }
  },
  onReady: function () {

  },
  bank_get_detailFun: function () {//银行卡详细信息
    let that = this;
    if (this.data.bankId != null && this.data.bankId != "undefined"){
      bank_get_detail({ id: this.data.bankId }).then(res => {
        this.setData({ 
          name: res.name,
          bankIndex: res.bankId,
          branchBankName: res.branchBankName,
          cardNumber: res.cardNumber,
          byDefault: res.byDefault?true:false,
          salaryStatus: res.salaryStatus?true:false
        });
        this.data.bankList.forEach((item,index)=>{
          if (item.id == res.bankId){
            that.setData({ bankIndex:index});
            return;
          }
        });
      });
    }
  },
  inputBlurFun1:function(e){//持卡人姓名
    this.setData({ name: e.detail.value})
  },
  bindPickerChange(e) {//开户银行
    this.setData({
      bankIndex: e.detail.value
    });
  },
  inputBlurFun2: function (e) {//所属支行
    this.setData({ branchBankName: e.detail.value })
  },
  inputBlurFun3: function (e) {//银行卡号
    this.setData({ cardNumber: e.detail.value })
  },
  switch1Change(e) {//默认银行卡
    this.setData({ byDefault: e.detail.value })
  },
  switch2Change(e) {//月结银行卡
    this.setData({ salaryStatus: e.detail.value })
  },
  bindBankCardBtn: function () {//同意并绑定按钮
    var that = this;
    setTimeout(function(){
      if (that.data.name == null || that.data.name == '' || that.data.name == undefined) {
        wx.showToast({
          title: '请填写持卡人姓名！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (that.data.branchBankName == null || that.data.branchBankName == '' || that.data.branchBankName == undefined) {
        wx.showToast({
          title: '请填写所属支行！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (that.data.cardNumber == null || that.data.cardNumber == '' || that.data.cardNumber == undefined) {
        wx.showToast({
          title: '请填写银行卡号！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      let data = {
        name: that.data.name,
        bankName: that.data.bankList[that.data.bankIndex].name,
        bankId: that.data.bankList[that.data.bankIndex].id,
        branchBankName: that.data.branchBankName,
        cardNumber: that.data.cardNumber,
        byDefault: that.data.byDefault ? 1 : 0,
        salaryStatus: that.data.salaryStatus ? 1 : 0
      }
      if (that.data.bankId != null && that.data.bankId != "undefined"){
        data.id = that.data.bankId;
        bankEdit(data, { successMsg: "修改成功！" }).then(res => {//编辑
          wx.navigateTo({
            url: '/packageMember/bankCard/index',
            success: function (res) { }
          });
        });
      }else{
        bankSave(data, { successMsg: "添加成功！" }).then(res => {//新增
          wx.navigateTo({
            url: '/packageMember/bankCard/index',
            success: function (res) { }
          });
        });
      }
    },100);
  },
  onShow: function () {

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
