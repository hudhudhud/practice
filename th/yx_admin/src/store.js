import Vue from 'vue'
import Vuex from 'vuex'
import {login,logOut,loginDetail} from '@/service/module/user.js'
import {setToken,removeToken} from "./assets/auth";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      userInfo:{},
      menus:[],
  },
  getters:{
    userInfo(state, getters) {
      return state.userInfo
    },
     menus(state,getters){
        return state.menus
    }
  },
  mutations: {
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo
    },
     setMenus:(state,menus)=>{
        state.menus=menus
     }
  },
  actions: {
        // 登录
        async Login({ commit }, userInfo) {
            let data= await login(userInfo)
            setToken(data.token)
            let info=await loginDetail()
            commit('setUserInfo', info)
            //commit('setMenus',menu)
        },
      // 登出
      async LogOut({ commit, state }) {
          await logOut()
          removeToken()
      },
      async isLogin({commit}){
         let info=await loginDetail()
         commit('setUserInfo', info)
      }
  }
})
