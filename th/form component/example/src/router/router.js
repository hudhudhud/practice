import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import demo from "./dome";


Vue.use(Router)
const array = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/login',
        name: 'login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
    }
];
if (process.env.NODE_ENV === 'development') {
    array.push(demo);
}
export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: array
})
