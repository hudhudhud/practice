import '@babel/polyfill'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import myaxios from './assets/js/myaxios';
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(Vuetify)

let toRoute=""
//路由检查需要放到挂载el之前，否则页面刷新不会检查路由
router.beforeEach((to, from, next) => {
	toRoute=to
	//检查登录状态
	//home页面虽然不需要登陆也能查看，但是要显示header上的登陆信息，所以还是需要发请求的
	if(to.name != 'home' && !to.meta.auth){
		next()
	}
	else{
		//this.$store.dispatch('userInfoAsyn',routerName)
		console.log("check login")
		myaxios.post("/web/user/isLogin").then(res=>{
			res=res.data
			if(res.code==0){
				store.commit('setUserInfo',res.data)
				next()
			} 
			else if(res.code==-3){
				store.commit('setUserInfo',{})
				if(to.name!="home"){
					next({name:"login",query:{redirect:to.fullPath}})
				}
				else{
					next()
				}
			}
			else{
				console.log("登录出错:",res)
			}
		})
	}

	//赋值页面title
	if(to.meta&&to.meta.title){
		window.document.title = to.meta.title
	}
	//路由切换时清除hearderBar上的搜索数据
	if(store.state.searchObj&&store.state.searchObj.route){
		if((to.name!="rank"&&to.name!="detail")||to.name!=store.state.searchObj.route){
			store.commit('setSearchObj',{})
		}
	}
 });

router.beforeResolve((to, from, next) => {
  next();
});

router.afterEach((to, from) => {
//   console.log('afterEach 全局后置钩子');
});


let el=new Vue({
	store,
	router,
	render: h => h(App),
	mounted(){
		//var router=this.$router.history.pending?this.$router.history.pending:this.$router.currentRoute
		//this.checkLogin(router)
	},
}).$mount('#app')


// 添加响应拦截器
axios.interceptors.response.use(function (response) {
	var res=response.data
	if(res.code==-3){
		//如果是不需要验证登陆的页面，直接返回response
		if(!toRoute.meta.auth){
			//防止因多个异步请求同时执行，有一个响应被拦截到登陆页之后toRoute变为登录页，其他的请求响应之后因为toRoute是登录页而执行了回调的程序
			if(toRoute.name=="login"){
				return Promise.reject(res.msg);
			}
			return Promise.resolve(response);
		}
		//否则跳转到登陆页面并且报错，以防止执行请求之后的代码
		el.$router.push({name:'login',query:{redirect:toRoute.fullPath}})
		return Promise.reject(res.msg);
	}
	else if(res.code==-1){
		return Promise.reject(res.msg);
	}
	else if(res.code==0){
		return Promise.resolve(response);
	}
    return Promise.reject(response);
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });