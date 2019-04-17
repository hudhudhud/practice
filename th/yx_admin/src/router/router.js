import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import demo from "./dome";
import product from "./module/product";
import order from "./module/order"
import system from "./module/system"
import member from "./module/member"
import content from "./module/content"
import layout from '../views/layout'


Vue.use(Router)
const array = [
    {
        path: '/',
        name: 'home',
        component: layout,
        children:[{
            path: '',
            component: Home,
            meta:{title:"首页"}
        }]
    },
    {
        path: '/login',
        name: 'login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
    },
    product,
    order,
    system,
    member,
    content,
];
if (process.env.NODE_ENV === 'development') {
    array.push(demo);
}
export default new Router({
    base: process.env.BASE_URL,
    routes: array,
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})
