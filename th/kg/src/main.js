// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import baseTable from './component/baseTable'
Vue.use(VueAxios, axios)

// axios.defa=process.env.API_HOST
// axios.defaults.baseURL=process.API_HOST
// axios.defaults.baseURL = process.env.API_HOST
// axios.defaults.baseURL = process..VUE_APP_BASE_API;
// window.https = process.env.API_HOST;

window.Promise = require('es6-promise-polyfill').Promise;
axios.defaults.withCredentials=true;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(baseTable)

// router.beforeEach((to, from, next) => {
//   if (to.meta.auth === false) {
//     next()
//   }
//   else {
//     if (store.getters.routes.length === 0) { // 判断当前用户是否已拉取完user_info信息
//       let info = JSON.parse(localStorage.getItem("info"))
//       if(info && info.menus){
//         let res=[]
//         let f=(items)=>{
//             items.forEach(item=>{
//                 if(item.url){
//                     res.push(item.url)
//                 }
//                 if(item.children&&item.children.length){
//                     f(item.children)
//                 }
//             })
//         }
//         f(info.menus)
//         store.commit('setRoutes', res)
//         store.commit('setUserInfo',info)
//       }
//       else{
//         next({ path: '/login'})
//       }
//     }
//     if(store.getters.routes.indexOf(to.path)>-1) {
//       next()
//     } else {
//       next({ path: '/error/401', replace: true})
//     }
//   }
// })

/* eslint-disable no-new */
let el=new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

Vue.directive('permission',{
  inserted(el,bind){
     let role = store.getters.userInfo.orgType || JSON.parse(localStorage.info).orgType
     let {value} = bind
     let permission=value
     if(role){
        if(permission&&permission instanceof Array && permission.length>0){
          if(permission.indexOf(role)==-1){
            el.parentNode && el.parentNode.removeChild(el)
          }
        }
        else{
          console.error('v-permission need permission like [a,b]')
        }
     }
  }
})


axios.interceptors.response.use(
    response => {
      if(response.data.status == 1){
        Message.warning(response.data.msg);
      }else if(response.data.status == 2){
        el.$router.push('/login')
      }
      return response;
    },
    error => {
      if(error.response){
        console.error(error)
        return Promise.reject(error.response.data)
      }
      else{
        Message.warning("服务器无响应！"+error.message);
      }
    }
);

