import router from "./router/index.js";
import Vue from "vue";
import "../static/js/rem";

import AppH5 from "./AppH5";
import store from "./pages/store/store";
import { baseUrl,imageUrl,  practiseDoorDefaultImg, mechanismDoorDefaultImg, mechanismEnvDefaultImg, mechanismLogoDefaultImg } from "./service/config";
import { Toast, MessageBox } from "mint-ui";
import axios from 'axios';

import ScrollView from '@/components/h5/scrollView'
import Tabs from '@/components/h5/tab'
import H5Picker from '@/components/h5/picker'
import { Tabbar, TabItem , InfiniteScroll, Swipe, SwipeItem, Popup, Picker} from 'mint-ui';

Vue.use(InfiniteScroll)
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Picker.name, Picker);
Vue.component(Popup.name, Popup);
Vue.component('scroll-view', ScrollView);
Vue.component('tabs', Tabs);
Vue.component('picker', H5Picker);
axios.defaults.baseURL = process.env.NODE_ENV === 'development'? '/api':baseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const data = getItem(loginData);
if (data) {
  axios.defaults.headers.post["token"] = data.token;
}
Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$imgBaseUrl = imageUrl;

const toast = {
  icon: "none",
  duration: 2000,
  position: "middle"
};
Vue.prototype.$toast = function(text = "提示", option = toast) {
  Toast({
    ...option,
    message: text
  });
};
Vue.prototype.$showModal = function(option={}) {
  option.closeOnClickModal = false;
  option.message = option.content;
  option.confirmButtonText = option.confirmText;
  option.cancelButtonText = option.cancelText;
  option.showCancelButton = option.showCancel !== false;
  return new Promise((resolve, reject) => {
    MessageBox(option).then(action => {
      if (action === "confirm") {
        resolve({confirm: true})
        if(option.success){
          option.success({confirm: true});
        }
      } else {
        resolve({confirm: false});
        if(option.success){
          option.success({confirm: false});
        }
      }
    });
  });
};

import * as service from './api/httpService'
import { getItem } from "./utils/localStorage";
import { loginData } from "./utils/variable";
// 定义一个混入对象
Vue.mixin({
  data() {
    return {
      service: "",
      router: "/",
      imgSrc: "/",
      isH5: true
    };
  },
  mounted: function(){
    if(this.$options.onLoad){
      this.$options.onLoad.call(this);
    }
    if(this.$options.onShow){
      this.$options.onShow.call(this);
    }
  },
  destroyed: function(){
    if(this.$options.onHide){
      this.$options.onHide.call(this);
    }
    if(this.$options.onUnload){
      this.$options.onUnload.call(this);
    }
  },
  methods: {
    route() {
      return this.$route;
    },
    navigateTo(obj) {
      if(typeof obj === 'string'){
        this.$router.push(obj);
      }else{
        this.$router.push(obj.url);
      }
    },
    redirectTo(obj) {
      if(typeof obj === 'string'){
        this.$router.replace(obj);
      }else{
        this.$router.replace(obj.url);
      }
    },
    navigateBack(obj = { detail: 1 }) {
      this.$router.go(-(obj.detail||1));
    },
    reLaunch(obj) {
      this.$router.replace(obj.url);
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
    //
    makePhone:function(phone){
      window.location.href = "tel:"+phone;
    }
  },
  created() {
    // console.log('wx')
     this.service = service
  }
});

window.wx = {
  authorize: function() {

  },
  previewImage: function() {

  },
  setNavigationBarTitle: function() {

  },
  chooseImage: function() {

  }
};

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router: router,
  components: { App: AppH5 },
  template: "<App/>"
});
