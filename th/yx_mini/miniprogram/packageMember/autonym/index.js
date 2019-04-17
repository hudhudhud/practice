// pages/autonym/index.js
import {
  baseUrl
} from '../../api/config.js';
import {
  check_salary_card,//检测是否设置月结银行卡
  fileupload,//上传文件
  findByUserId,//通过userid查看实名认证信息
  saveAutonymInfo,//保存实名认证信息
  update_and_reset//编辑并重置实名认证信息
} from '../../services/member/member.js'
Page({
  data: {
    salaryCardData:'',//检测是否设置银行卡数据
    dataInfo:'',//存储初始化数据
    image1:'',//正面照
    imageId1: null,//正面照id
    image2: '',//反面照
    imageId2: null,//反面照id
    realname:'',//真实姓名
    age: '',//年龄
    gender: 1,//性别
    cardNumber:'',//证件号码
    districtId:null,//区域Id
    street: '',//户籍地址
    readCheck:0,//合同阅读
    region: ['请选择']
  },
  onLoad: function (options) {
    this.checkSalaryCardFun();
    this.dataInitFun();
  },
  onReady: function () {

  },
  dataInitFun:function(){//初始化数据
    findByUserId().then(res=>{
      this.setData({ dataInfo:res})
      if (res.cardNumber!=null){
        this.setData({
          image1: res.image1,
          image2: res.image2,
          realname: res.realname,
          age: res.age,
          gender: res.gender,
          cardNumber: res.cardNumber,
          region: res.address,
          street: res.street
        })
      }
    });
  },
  checkSalaryCardFun:function(){//检测是否设置月结银行卡
    check_salary_card().then(res=>{
      this.setData({ salaryCardData:res})
    });
  },
  setSalaryCardFun:function(){//点击去设置月结银行卡
    wx.navigateTo({
      url: '/packageMember/bankCard/index',
      success: function (res) { }
    });
  },
  upAutonymImgFun:function(e){//上传身份证正反面
    var that = this;
    if (this.data.dataInfo.image1){
        return;
    }
    if (e.currentTarget.dataset.type === '1'){
      wx.chooseImage({
        count: 1,  //最多可以选择的图片总数  
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function (res) {
          console.log(res)
          wx.uploadFile({
            url: baseUrl +'/file/upload',
            filePath: res.tempFilePaths[0],
            name: 'file',
            formData: {},
            success(res1) {
              let data = JSON.parse(res1.data);
              console.log(data)
              console.log(data.data.url)
              if (data.status == 0){
                that.setData({ image1: res.tempFilePaths[0] });
                that.setData({ imageId1: data.data.id });
              }else{

              }
            }
          });
        }
      });  
    }else{
      wx.chooseImage({
        count: 1,  //最多可以选择的图片总数  
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function (res) {
          wx.uploadFile({
            url: baseUrl + '/file/upload',
            filePath: res.tempFilePaths[0],
            name: 'file',
            formData: {},
            success(res1) {
              let data = JSON.parse(res1.data);
              if (data.status == 0) {
                that.setData({ image2: res.tempFilePaths[0] });
                that.setData({ imageId2: data.data.id });
              } else {
                wx.showToast({
                  title: '上传失败！',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          });
        }
      });   
    }
  },
  inputBlurFun1:function(e){//真实姓名
    this.setData({ realname: e.detail.value })
  },
  inputBlurFun2: function (e) {//年龄
    this.setData({ age: e.detail.value })
  },
  radioChange(e) {//性别选择触发
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({ gender: e.detail.value })
  },
  inputBlurFun3: function (e) {//证件号
    this.setData({ cardNumber: e.detail.value })
  },
  bindRegionChange(e) {//省市区
    console.log('picker发送选择改变，携带值为', e)
    this.setData({
      region: e.detail.value
    });
    this.setData({
      districtId: e.detail.code[e.detail.code.length-1]
    });
  },
  inputBlurFun4: function (e) {//地址
    this.setData({ street: e.detail.value })
  },
  readCheckFun: function (event) {//合同阅读
    if (this.data.readCheck==1){
      this.setData({ readCheck: 0 });
    }else{
      this.setData({ readCheck: 1 });
    }
  },
  autonymBtn:function(){//提交按钮
    var that = this;
    if (that.data.dataInfo.status === 1 ) {
      wx.showToast({
        title: '正在审核中，请不要重复提交！',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (that.data.dataInfo.status === 2){
      wx.showToast({
        title: '审核已通过！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.salaryCardData.flag) {
      wx.showToast({
        title: '请设置月结银行卡！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.image1 == null || that.data.image1 == '' || that.data.image1 == undefined) {
      wx.showToast({
        title: '请选择身份证正面照！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.image2 == null || that.data.image2 == '' || that.data.image2 == undefined) {
      wx.showToast({
        title: '请选择身份证反面照！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.realname == null || that.data.realname == '' || that.data.realname == undefined) {
      wx.showToast({
        title: '请输入真实姓名！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.age == null || that.data.age == '' || that.data.age == undefined) {
      wx.showToast({
        title: '请输入年龄！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    setTimeout(function(){
      if (that.data.cardNumber == null || that.data.cardNumber == '' || that.data.cardNumber == undefined) {
        wx.showToast({
          title: '请输入证件号码！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (that.data.region[0] == null || that.data.region[0] == undefined || that.data.region[0] == '请选择') {//选择省市区
        wx.showToast({
          title: '请选择省市区！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (that.data.street == null || that.data.street == '' || that.data.street == undefined) {
        wx.showToast({
          title: '请输入户籍地址！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (that.data.readCheck == 0) {//必须选中已阅读
        return;
      }
      let data = {
        file1: that.data.imageId1,
        file2: that.data.imageId2,
        realname: that.data.realname,
        age: that.data.age,
        gender: that.data.gender,
        cardNumber: that.data.cardNumber,
        // districtId: that.data.districtId,//地区ID
        provinceName: that.data.region[0],
        cityName: that.data.region[1],
        districtName: that.data.region[2],
        street: that.data.street,
        protocolStatue: that.data.readCheck
      }
      if (that.data.dataInfo.status===3){
        if (that.data.dataInfo.id){
          data.id = that.data.dataInfo.id;
        }
        update_and_reset(data, { successMsg: "提交成功！" }).then(res => {

        });
      }else{
        saveAutonymInfo(data, { successMsg: "提交成功！" }).then(res => {

        });
      }
    },100);
  },
  onShow: function () {
    
  },
  onHide: function () {

  },
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
