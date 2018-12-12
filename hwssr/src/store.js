import Vue from 'vue'
import Vuex from 'vuex'
import myaxios from './assets/js/myaxios';


Vue.use(Vuex)

export function createStore(){
	const store = new Vuex.Store({
		state: {
				userInfo: {},
				searchObj:{},
		},
		getters: { //store.getters.personInfo()
				userInfo(state, getters) {
					return state.userInfo
				},
				searchObj(state){
					return state.searchObj
				},
				isXiaomin(state, getters) {
					return (userName) => {
							return state.userInfo.name == 'xiaomin'
					}
				},
		},
		mutations: {//相当于setter,只支持同步事件 //外部调用方式：store.commit('setAge', {age:20})
				setUserInfo(state, user) {
					state.userInfo = user
				},
				setSearchObj(state,obj){
					state.searchObj=obj
				}
	
		},
		actions: {//支持异步操作  //外部调用方式：store.dispatch('userNameAsyn',{userName:'xiaomin'}).then()。
				ageSync(context) {//默认context参数，与store对象具有相同属性，如state,getters,commit
	
				},
				userInfoAsyn({ commit },routerName) {
					// setTimeout(() => {
					//       commit('setUserInfo', {id:1,name:222});
					// }, 1000);
				}
		}
	})
	return store
} 
