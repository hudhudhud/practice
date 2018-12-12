import Vue from 'vue'
import { createApp } from './main'
const { app, router, store } = createApp()

Vue.mixin({
  // 路由改变，组件被复用，即只是改变了参数的情况，更新数据
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    console.log(asyncData)
    if (asyncData) {
      console.log(asyncData)
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
// 路由完成初始导航时调用
// 因为可能存在异步组件，所以等待router将所有异步组件加载完毕，服务器端配置也需要此操作
router.onReady(() => {
  // 所有组件内守卫和异步路由组件被解析之后
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    // 筛选发生更新的组件
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    // ???获取发生更新组件是否需要新数据的函数
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    console.log(asyncDataHooks)
    if (!asyncDataHooks.length) {
      return next()
    }

    // 依次调用更新数据函数
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
      .then(() => {
        next()
      })
      .catch(next)
  })
  console.log('router ready')
  app.$mount('#app')
})
