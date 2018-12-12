import Vue from 'vue'
import Router from 'vue-router'
import lists from '@/components/lists'
import HelloWorld from '@/components/HelloWorld'
import Customer from '@/components/Customer'

Vue.use(Router)

export default new Router({
  // mode: 'history', // 必须设置为history,否则PrerenderSpaPlugin预渲染得到的index文件都是一样的
  routes: [
    {
      path: '/',
      name: 'List',
      component: lists
    },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/customer',
      name: 'Customer',
      component: Customer
    }
  ]
})
