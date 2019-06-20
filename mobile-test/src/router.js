import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component:Login
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (test.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "register" */ './views/Register.vue')
    },
    {
      path: '/rank',
      name: 'rank',
      component: () => import(/* webpackChunkName: "rank" */ './views/Rank.vue')
    },
    {
      path: '/catg',
      name: 'catg',
      component: () => import(/* webpackChunkName: "catg" */ './views/Catg.vue')
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: () => import(/* webpackChunkName: "detail" */ './views/Detail.vue'),

    },
    {
      path:'/forgetPassword',
      name:"forgetPassword",
      component: () => import(/* webpackChunkName: "detail" */ './views/ForgetPassword.vue'),
    },
    {
      path:'/mobile/index',
      name:"m",
      component: () => import(/* webpackChunkName: "detail" */ './mobile/index.vue'),
    }
  ]
})
