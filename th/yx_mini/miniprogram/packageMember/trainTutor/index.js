// packageProfile/trainTutor/index.js
import { roundRect, textWrap } from "../../js/common";
import {
  find_parent_qr_code//查询上级二维码
} from '../../services/member/member.js'
const app = getApp();
Page({
  data: {
    trainTabType:0,//tab
    dataInfo:'',
    postCanvasImg:'',//生成海报图片
  },
  onLoad: function (options) {
    this.dataInitFun();
  },
  onReady: function () {

  },
  onShow: function () {
    
  },
  dataInitFun:function(){//数据初始化
    find_parent_qr_code().then(res=>{
      this.setData({ dataInfo:res});
      this.drawImg(0);
    });
  },
  /* * 生命周期函数--监听页面隐藏*/
  onHide: function () {

  },
  trainTabBtn: function (event) {//点击Tab切换
    this.setData({ trainTabType: event.currentTarget.dataset.type });
    this.drawImg(event.currentTarget.dataset.type);
  },
  saveImgFun:function(){//保存图片到手机按钮
    wx.saveImageToPhotosAlbum({
      filePath: this.data.postCanvasImg,
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
  drawImg:function(n){//绘制海报(社群导师)
    wx.showLoading({
      title: '',
    })
    let that = this;
    let postInfo = {
      avatarUrl:'',//头像
      nickName: that.data.dataInfo[n].nickName ? that.data.dataInfo[n].nickName :'火兔火兔火兔火兔火兔火兔火兔火兔火兔火兔火兔火兔',//昵称
      qrcodeUrl: ''//二维码
    }
    let pro1 =new Promise(function(resole,reject){
      let defalutPhoto = 'https://zy-image.oss-cn-hangzhou.aliyuncs.com/image/49002924816c4f75b88be4f2ce78ce49';//默认头像
      let avatarUrl = that.data.dataInfo[n].avatarUrl ? that.data.dataInfo[n].avatarUrl : defalutPhoto;
      wx.downloadFile({
        url: avatarUrl,
        success: function (res) {
          if (res.statusCode === 200) {
            postInfo.avatarUrl = res.tempFilePath;
            resole();
          }else{
            wx.hideLoading()
            wx.showToast({
              title: '海报生成失败！',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail:function(res){
          wx.hideLoading()
          wx.showToast({
            title: '海报生成失败！',
            icon: 'none',
            duration: 2000
          })
        }
      });
    });
    let pro2 = new Promise(function (resole, reject) {
      if (that.data.dataInfo[n].qrcodeUrl){
        wx.downloadFile({
          url: that.data.dataInfo[n].qrcodeUrl,
          success: function (res) {
            if (res.statusCode === 200) {
              postInfo.qrcodeUrl = res.tempFilePath;
              resole();
            }else{
              wx.hideLoading()
              wx.showToast({
                title: '海报生成失败！',
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '海报生成失败！',
              icon: 'none',
              duration: 2000
            })
          }
        });
      }
    });
    Promise.all([pro1, pro2]).then((result) => {
      let ctx = wx.createCanvasContext('postCanvas'+n);
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
      ctx.drawImage(postInfo.avatarUrl, 137.5, 30, 100, 100) //绘制头像图片    
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
        text: postInfo.nickName,
        bold: false
      }
      textWrap(ctx, details);
      ctx.drawImage(postInfo.qrcodeUrl, 67.5, 180, 240, 240) //绘制二维码图片
      ctx.draw(false, function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 375,
          height: 531,
          destWidth: 1500,
          destHeight: 2124,
          canvasId: 'postCanvas'+n,
          fileType: 'jpg',
          success: a => {
            that.setData({ postCanvasImg: a.tempFilePath });
            wx.hideLoading()
          },
          fail: e => { 
            wx.hideLoading()
            wx.showToast({
              title: '海报生成失败！',
              icon: 'none',
              duration: 2000
            })
          }
        })
      });
    }).catch((error) => {
      console.log(error)
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


