import Vue from 'vue'
import Router from 'vue-router'
import Tabs from '../views/tabs/tabs'
import Home from '../views/tabs/home'
import Msg from '../views/tabs/msg'
import Classification from '../views/tabs/classification'
import Profile from '../views/tabs/profile'
import Cart from '../views/tabs/cart'
import signIn from './signIn'
import ProfileIndex from './profile'
import order from './order'

Vue.use(Router)
const router = new Router({
    routes: [
        {
            path: '/',
            // name: 'tabs',
            component: Tabs,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: Home
                },
                {
                    path: 'profile',
                    name: 'profile',
                    component: Profile,
                },
                {
                    path: 'msg',
                    name: 'msg',
                    component: Msg
                },
                {
                    path: 'cart',
                    name: 'cart',
                    component: Cart
                },
                {
                    path: 'classification',
                    name: 'classification',
                    component: Classification
                }

            ]
        },
        {
          path: '/other',
          component: resolve => require(['../views/other/index'], resolve),
            children: [
                {
                    path: 'msgDetail/:id',
                    name: 'msgDetail',
                    component: resolve => require(['../views/tabs/msg/msgDetail'], resolve),
                }
            ]
        },
        signIn,
        ProfileIndex,
        order,
        {  path: '/home',
            name: 'homeIndex',
            component: resolve => require(['../views/home/index'], resolve),
            children: [
                {
                    path: 'classify',
                    name: 'classify',
                    component: resolve => require(['../views/home/classDetail'], resolve)
                },
                {
                    path: 'classifyList',
                    name: 'classifyList',
                    component: resolve => require(['../views/home/classifyDetail'], resolve)
                }
            ]

        },
        {
            path: '/login',
            name: 'login',
            component: resolve => require(['../views/login'], resolve)
        },
        {
            path: '/register',
            name: 'register',
            component: resolve => require(['../views/register'], resolve)
        },
        {
            path: '/wxRegister',
            name: 'wxRegister',
            component: resolve => require(['../views/wxRegister'], resolve)
        }
    ]
})

const include = ['profile', 'balance', 'ucurrency',
    'vault', 'integral', 'bankInfo', 'sales',
    'mineItem', 'orderList', 'logistics', 'collection', 'personalOrder', 'addressList', 'addressEdit', 'certification', 'accountInfo']; // 需要登录才能进的页面
router.beforeEach((to, from, next) => {
    // clearInterval(window.clearTimer1);
    if (!include.includes(to.name)) {
        next();
        return;
    }
    let userInfo = localStorage.getItem('UserInfo');
    if (!userInfo) {
        next('/login');
    } else {
        next();
    }
})
export default router;
