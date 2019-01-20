import Vue from "vue";
import App from "./App";
import { imageUrl, practiseDoorDefaultImg, mechanismDoorDefaultImg, mechanismEnvDefaultImg, mechanismLogoDefaultImg} from "./service/config";
import store from "./pages/store/store";


Vue.config.productionTip = false;
App.mpType = "app";

const toast = {
  icon: "none",
  duration: 2000
};
Vue.prototype.$toast = function(text = "提示", option = toast) {
  wx.showToast({ ...option, title: text });
};
Vue.prototype.$store = store
Vue.prototype.$imgBaseUrl = imageUrl;
Vue.prototype.$showModal = function(option) {
  return new Promise((resolve, reject) => {
    let old = option.success || function() {
    };
    let fail = option.fail || function() {
    };
    option.success = function(res) {
      old(res);
      resolve(res);
    };
    option.fail = function(res) {
      fail(res);
      reject();
    };
    wx.showModal(option);
  });
};

import * as wxService from './api/wxService'
// 定义一个混入对象
Vue.mixin({
  data() {
    return {
      service: "",
      router: "/",
      imgSrc: "/",
      isH5: false
    };
  },
  onShareAppMessage: function() {

  },
  methods: {
    route() {
      return this.$root.$mp;
    },
    navigateTo(obj) {
      if(typeof obj === 'string'){
        wx.navigateTo({url: obj});
      }else{
        wx.navigateTo(obj);
      }
    },
    redirectTo(obj) {
      if(typeof obj === 'string'){
        wx.redirectTo({url: obj});
      }else{
        wx.redirectTo(obj);
      }
    },
    navigateBack(obj = {}) {
      wx.navigateBack(obj);
    },
    reLaunch(obj) {
      wx.reLaunch(obj);
    },
    previewImage(event) {
      let imgArr = event.currentTarget.dataset.list.map(function(item) {
        return item.fileUrl
      });
      wx.previewImage({
        current: event.currentTarget.dataset.src,
        urls: imgArr
      })
    },
    payState(state){
      let orderState = '';
      switch (state){
        case "committed":
          orderState = "代付款";
          break;
        case "paid":
          orderState = "已付款";
          break;
        case "cancelled":
          orderState = "订单关闭";
          break;
        case "finished":
          orderState = "已完成";
          break;
        default:
          orderState = "退款中";
          break;
      }
      return orderState;
    },
    getDefaultImg(src){
      let defaultSrc = '';
      switch (src){
        case "practiseLogo":
          defaultSrc = practiseDoorDefaultImg;
          break;
        case "institutionLogo":
          defaultSrc = mechanismLogoDefaultImg;
          break;
        case "institutionEnv":
          defaultSrc = mechanismEnvDefaultImg;
          break;
        case "institutionDoor":
          defaultSrc = mechanismDoorDefaultImg;
          break;
        default:
          defaultSrc = mechanismDoorDefaultImg;
          break;
      }
      return defaultSrc;
    },
    setNavigationTitle(title){
      wx.setNavigationBarTitle({
        title:title
      })
    },
    makePhone:function(phone){
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }

  },
  created() {
    // console.log('wx')
     this.service = wxService
  }
});

const app = new Vue(App);
app.$mount();
