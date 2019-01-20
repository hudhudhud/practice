import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'

import account from './modules/account.js'
import announcement from './modules/announcement.js'
import baseInfo from './modules/baseInfo.js'
import bill from './modules/bill.js'
import course from './modules/course.js'
import lunch from './modules/lunch.js'
import message from './modules/message.js'


Vue.use(Router)

const router = new Router({
  scrollBehavior(to, from, savedPosition) {
    //scrollBehavior 方法接收 to 和 from 路由对象。第三个参数 savedPosition 当且仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。
    if (savedPosition) {
        return savedPosition
    } else {
        return {x: 0, y: 0}
    }
  },
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta:{auth:false}
    },
    {
      path:'/register',
      name:'register',
      component:resolve=>require(['../views/Register.vue'],resolve),
      meta:{auth:false}
    },
    {
      path: '/',//总后台
      name: 'home',
      component:Home,
      meta:{auth:false}
    },
    account,
    announcement,
    baseInfo,
    bill,
    course,
    lunch,
    message,
    {
        path:'/error',
        name:'error',
        component:Home,
        children:[
            {
                path:'404',
                name:'404',
                component: resolve => require(['../views/errorPage/404'],resolve),
                meta:{auth:false}
            },
            {
                path:'401',
                name:'401',
                component: resolve => require(['../views/errorPage/401'],resolve),
                meta:{auth:false}
            }
        ]
    },
    {
        path:'*',
        redirect:'/error/404'
    }
  ]
})

export default router