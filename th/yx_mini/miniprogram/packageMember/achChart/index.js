// miniprogram/packageMember/achChart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let windowWidth = 375;
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      // do something when get system info failed
    }
    var wxCharts = require('../../js/wxcharts-min.js');
    new wxCharts({
      canvasId: 'firstCanvas',
      type: 'area',
      categories: ['18/03', '19/04', '18/03', '18/03', '18/03', '18/03'],
      series: [{
        name: '成交量1',
        data: [70, 40, 65, 100, 34, 18],
        format: function (val) {
          return val.toFixed(2) + '元';
        }
      }],
      yAxis: {
        format: function (val) {
          // 转化单位
          return val + '元';
        }
      },
      width: windowWidth,
      height: 377
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  }
})