import layout from '../../views/layout'

export default {
    path: '/order',
    name: 'order',
    redirect: '/order/service',
    component: layout,
    meta: {
        title: '订单管理',
    },
    children:[
        {
            path:"service",
            name: 'service',
            component: () => import(/* webpackChunkName: "about" */ '../../views/order/orderServiceManage.vue'),
            meta: {
                title: '订单管理',//客服订单管理
            },
        },
        {
            path:"edit/:id",
            name: 'orderEdit',
            component: () => import(/* webpackChunkName: "about" */ '../../views/order/orderEdit.vue'),
            meta: {
                title: '订单编辑',
            },
        },
        {
            path:"operation",
            name: 'operation',
            component: () => import(/* webpackChunkName: "about" */ '../../views/order/orderOperateManage.vue'),
            meta: {
                title: '运营订单管理',
            },
        },
        {
            path:"finance",
            name: 'finance',
            component: () => import(/* webpackChunkName: "about" */ '../../views/order/orderFinanceManage.vue'),
            meta: {
                title: '财务订单管理',
            },
        }
    ]

}

