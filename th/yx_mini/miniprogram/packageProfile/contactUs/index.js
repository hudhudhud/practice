// packageProfile/contactUs/index.js
import { roundRect, textWrap } from "../../js/common";
import {
  find_parent_qr_code//查询上级二维码
} from '../../services/member/member.js'
const app = getApp();
Page({
  data: {
    trainTabType: 1,//tab
    postCanvasImg: '',//生成海报图片
    postCanvasImg2: '',//生成海报图片2
  },
  onLoad: function (options) {
    this.dataInitFun();
  },
  onReady: function () {

  },
  onShow: function () {
    this.drawImg();
    this.drawImg2();
  },
  dataInitFun: function () {//数据初始化
    find_parent_qr_code().then(res => {

    });
  },
  /* * 生命周期函数--监听页面隐藏*/
  onHide: function () {

  },
  trainTabBtn: function (event) {//点击Tab切换
    this.setData({ trainTabType: event.currentTarget.dataset.type });
  },
  saveImgFun: function () {//保存图片到手机按钮
    wx.saveImageToPhotosAlbum({
      filePath: this.data.trainTabType === 1 ? this.data.postCanvasImg : this.data.postCanvasImg2,
      success(res) {
        wx.showToast({
          title: '保存图片成功！',
        })
      },
      fail(res) {
        wx.showToast({
          title: '保存图片失败！',
        })
      }
    });
  },
  drawImg: function () {//绘制海报(社群导师)
    // wx.downloadFile({
    //   url: 'http://image.zhi-you.net/000/1aa97119d07a470fbbda339bd37cfc0f',
    //   success: function (res) {
    //     if (res.statusCode === 200) {
          
    //     }
    //   }
    // });
    let that = this;
    let ctx = wx.createCanvasContext('postCanvas1');
    ctx.setFillStyle('#fff');    //这里是绘制白底，让图片有白色的背景
    ctx.fillRect(0, 0, 750, 1062);
    ctx.fill();
    roundRect(ctx, 32.5, 80, 310, 400, 10); //绘制圆角矩形方法
    ctx.setFillStyle('#fff');
    ctx.setShadow(0, 0, 15, 'rgba(223, 223, 223, 1)');//绘制阴影
    ctx.fill();
    ctx.save();
    ctx.beginPath(); //开始绘制
    ctx.arc(187.5, 80, 50, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.clip();//画好了圆 剪切
    ctx.drawImage('../../images/member/userPhoto_default@2x.png', 137.5, 30, 100, 100) //绘制商品图片    
    ctx.restore();
    let details = {
      x: 187.5,
      y: 140,
      width: 270,
      height: 24,
      line: 1,
      color: '#3C3C3C',
      size: 15,
      align: 'center',
      baseline: 'top',
      text: '新建项目选择小程序项目，选择代码存放的硬盘路径，填入刚刚申请到的小程序的 AppID，给你的项目起一个好听的名字。',
      bold: false
    }
    textWrap(ctx, details);
    ctx.drawImage('../../images/profile/balance_bg@2x.png', 67.5, 180, 240, 240) //绘制商品图片
    ctx.draw(false, function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 375,
        height: 531,
        destWidth: 1500,
        destHeight: 2124,
        canvasId: 'postCanvas1',
        fileType: 'jpg',
        success: a => {
          that.setData({ postCanvasImg: a.tempFilePath });
        },
        fail: e => { console.log('失败') }
      })
    });
  },
  drawImg2: function () {//绘制海报(社群导师)
    let that = this;
    let ctx = wx.createCanvasContext('postCanvas2');
    ctx.setFillStyle('#fff');    //这里是绘制白底，让图片有白色的背景
    ctx.fillRect(0, 0, 750, 900);
    ctx.fill();
    roundRect(ctx, 32.5, 50, 310, 350, 10); //绘制圆角矩形方法
    ctx.setFillStyle('#fff');
    ctx.setShadow(0, 0, 15, 'rgba(223, 223, 223, 1)');//绘制阴影
    ctx.fill();
    ctx.save();  
    ctx.restore();
    let details = {
      x: 187.5,
      y: 350,
      width: 270,
      height: 24,
      line: 1,
      color: '#3C3C3C',
      size: 15,
      align: 'center',
      baseline: 'top',
      text: '新建项目选择小程序项目，选择代码存放的硬盘路径，填入刚刚申请到的小程序的 AppID，给你的项目起一个好听的名字。',
      bold: false
    }
    textWrap(ctx, details);
    ctx.drawImage('../../images/profile/balance_bg@2x.png', 67.5, 90, 240, 240) //绘制商品图片
    ctx.draw(false, function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 375,
        height: 450,
        destWidth: 1500,
        destHeight: 1800,
        canvasId: 'postCanvas2',
        fileType: 'jpg',
        success: a => {
          console.log(a)
          that.setData({ postCanvasImg2: a.tempFilePath });
        },
        fail: e => { console.log('失败') }
      })
    });
  },
  phoneCallFun:function(){//400电话
    wx.makePhoneCall({
      phoneNumber: '400-1234-666',
      success:res=>{

      }
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


