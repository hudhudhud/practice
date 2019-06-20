import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	  	userInfo:{}
  },
  getters:{ //store.getters.personInfo()
		userInfo(state,getters) {
           return state.userInfo
        },
        isXiaomin(state,getters){
        	return (userName)=>{
        		return state.userInfo.name=='xiaomin'
        	}
        }
  },
  mutations: {//相当于setter,只支持同步事件 //外部调用方式：store.commit('setAge', {age:20})
        setUserInfo(state, user) {
           state.userInfo=user
        }

  },
  actions: {//支持异步操作  //外部调用方式：store.dispatch('userNameAsyn',{userName:'xiaomin'}).then()。
  		ageSync(context){//默认context参数，与store对象具有相同属性，如state,getters,commit

  		},
  		userInfoAsyn({commit},user) {
            setTimeout(() => {
                commit('setUserInfo',user);
            }, 1000);
        }
  }
})
