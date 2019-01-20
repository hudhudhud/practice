import Vue from "vue";
import Router from "vue-router";

import Home from './home'
import Auth from './auth'
import Profile from './profile'
import FeatureList from './featureList'
import Teacher from './teacher'
import store from "../pages/store/store";
import { getItem } from "../utils/localStorage";
import { loginData } from "../utils/variable";
import { getUserInfo } from "../service/auth";
import { teacherDetail } from "../service/teacher/main";

Vue.use(Router);
const index = new Router({
  routes: [
    {path: '/', redirect: '/pages/index/main'},
    Home,
    Auth,
    Profile,
    FeatureList,
    Teacher
  ]
});

let exclude = ['login','register', 'updatePsw1', 'updatePsw2', 'index'];
index.beforeEach((to, from, next) => {
  // ...
  if(exclude.includes(to.name)){
    next();
  }else{
    if(store.state.userInfo.id !== undefined){
      next();
    }else{
      // 获取数据
      const data = getItem(loginData);
      console.log(data);
      if (data) {
        const role = getItem('loginRole');
        store.commit("saveLogin", data);
        store.commit('saveRole', role);
        if(String(role) === '1'){
          getUserInfo({ id: store.state.loginData.userId }).then(res => {
            store.commit("saveUser", res);
            next();
          },e => {
            next('/pages/auth/login/main')
          });
        }else{
         teacherDetail({ id: store.state.loginData.userId }).then(res => {
           store.commit("saveUser", res);
           next();
         },e => {
           if(e.status === 2){
             next('/pages/auth/login/main')
           }
         })
        }
       // commit("saveUser", data);
      } else {
        next('/pages/auth/login/main')
      }
    }
  }

})

export default index;
