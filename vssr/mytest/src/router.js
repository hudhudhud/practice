import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
    return new Router({
      mode: 'history',
      scrollBehavior: () => ({ y: 0 }),
      routes: [
        { path: '/', component: () => import('./components/Home.vue') },
        { path: '/item/:id', component: () => import('./components/Item.vue') }
      ]
    })
}
  