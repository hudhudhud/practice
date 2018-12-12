import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'


Vue.use(Router)


export default new Router({
  scrollBehavior(to, from, savedPosition) {
    //scrollBehavior 方法接收 to 和 from 路由对象。第三个参数 savedPosition 当且仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
 // mode:"history",
  routes: [
    {
      path: '/',
      name: 'home',
     // component: () => import('./views/Home.vue'),
      component: Home,
      meta: {
        title: '首页',
      },
    },
    {
      path: '/login',
      name: 'login',
      component:Login,
      meta: {
        title: '登录',
      },
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (test.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "register" */ './views/Register.vue'),
      meta: {
        title: '注册',
      },
    },
    {
      path: '/rank',
      name: 'rank',
	  component: () => import('./views/Rank.vue'),
	  meta: {
        title: '主播匹配',
        auth:1,
      },
	},
	{
		path: '/rank/:id',
		name: 'rankSearch',
		component: () => import('./views/Rank.vue'),
		meta: {
			title: '主播匹配',
			auth:1,
		},
	},
    {
      path: '/catg',
      name: 'catg',
	  component: () => import('./views/Catg.vue'),
	  meta: {
        title: '行情概览',
        auth:1,
      },
    },
    {
      path: '/detail/:id',
      name: 'detail',
	  component: () => import('./views/Detail.vue'),
	  meta: {
        title: '主播详情',
        auth:1,
      },
    },
    {
      path: '/detailzbxg/:id',
      name: 'detailzbxg',
	  component: () => import('./views/DetailZbxg.vue'),
	  meta: {
        title: '直播效果',
        auth:1,
      },

    },
    {
      path: '/detailzbpk/:id/:toid',
      name: 'detailzbpk',
      component: () => import('./views/DetailZbpk.vue'),
	  meta: {
        title: '主播pk',
        auth:1,
      },
    },
    {
      path:'/forgetPassword',
      name:"forgetPassword",
	  component: () => import('./views/User/ForgetPassword.vue'),
	  meta: {
        title: '忘记密码',
      },
    },
    {
      path:'/userCenter',
      name:"userCenter",
	  component: () => import( './views/User/UserCenter.vue'),
	  meta: {
        title: '个人中心',
        auth:1,
      },
      children: [
        {
          path: 'info',
          name:"userInfo",
		  component: () => import('./views/User/UserInfo.vue'),
		  meta: {
			title: '我的资料',
			auth:1,
		  },
        },
        {
          path: 'fav',
          name:"userFav",
		  component: () => import('./views/User/UserFav.vue'),
		  meta: {
			title: '我的收藏',
			auth:1,
		  },
        },
          {
          path: 'password',
          name:"userPassword",
		  component: () => import('./views/User/UserPassword.vue'),
		  meta: {
			title: '修改密码',
			auth:1,
		  },
        },
          {
          path: 'email',
          name:"userEmail",
		  component: () => import('./views/User/UserEmail.vue'),
		  meta: {
			title: '绑定邮箱',
			auth:1,
		  },
        },
          {
          path: 'phone',
          name:"userPhone",
		  component: () => import('./views/User/UserPhone.vue'),
		  meta: {
			title: '绑定手机',
			auth:1,
		  },
        }
      ]
    }
  ]
})
