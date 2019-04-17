// packageMember/storeShare/index.js
import { roundRect, textWrap } from "../../js/common";
const app = getApp()
Page({
  data: {
    userInfo:'',
    postCanvasImg:'',//海报图片
  },
  onLoad: function (options) {
    this.setData({ userInfo: app.globalData.userInfo})
    this.drawImg();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  saveImgFun: function () {//保存图片到手机按钮
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
  drawImg: function () {//绘制海报(社群导师)
    wx.showLoading({
      title: '',
    })
    let that = this;
    let postInfo = {
      avatarUrl: '',//头像
      nickName: that.data.userInfo.nickName ? that.data.userInfo.nickName:'火兔火兔火兔火兔火兔火兔火兔火兔火兔火兔火兔火兔',//昵称
      qrcodeUrl: ''//二维码
    }
    let pro1 = new Promise(function (resole, reject) {
      let defalutPhoto = 'https://zy-image.oss-cn-hangzhou.aliyuncs.com/image/49002924816c4f75b88be4f2ce78ce49';//默认头像
      let avatarUrl = that.data.userInfo.avatarUrl ? that.data.userInfo.avatarUrl:defalutPhoto;
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
        fail: function (res) {
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
      if (that.data.userInfo.qrcodeUrl){
        wx.downloadFile({
          url: that.data.userInfo.qrcodeUrl,
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
      }else{
        resole();
      }
    });
    Promise.all([pro1, pro2]).then((result) => {
      let ctx = wx.createCanvasContext('canvasBoxId');
      ctx.setFillStyle('#FF4048');    //图片背景色
      ctx.fillRect(0, 0, 750, 1310);
      ctx.fill();
      ctx.drawImage('../../images/member/store_share_bg@2x.png', 17.5, 50, 340, 555) //绘制店铺背景图
      ctx.fill();
      ctx.beginPath(); //开始绘制
      ctx.save();
      roundRect(ctx, 70, 167, 80, 80, 8);
      ctx.fill();
      ctx.clip();//画好了圆 剪切
      ctx.fill();
      ctx.drawImage(postInfo.avatarUrl, 70, 167, 80, 80) //绘制头像图片    
      ctx.restore();
      let details = {
        x: 165,
        y: 179,
        width: 146,
        height: 24,
        line: 1,
        color: '#3C3C3C',
        size: 17,
        align: 'left',
        baseline: 'top',
        text: postInfo.nickName,
        bold: true
      }
      textWrap(ctx, details);
      ctx.drawImage('../../images/profile/balance_bg@2x.png', 69, 275, 238, 238) //绘二维码

      ctx.draw(false, function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 375,
          height: 655,
          destWidth: 1500,
          destHeight: 2620,
          canvasId: 'canvasBoxId',
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