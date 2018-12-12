import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import('../components/main.vue')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('../components/userList.vue')
      },
      {
        path: '/unknow',
        name: 'unknow',
        component: () => import('../components/unknowList.vue')
      }
    ]
  })
}
