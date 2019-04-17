import layout from '../../views/layout'

export default {
    path: '/system',
    name: 'system',
    redirect: 'noredirect',
    component: layout,
    meta: {
        title: '系统设置',
    },
    children:[
        {
            path:"menuManage",
            name: 'menuManage',
            component: () => import(/* webpackChunkName: "about" */ '../../views/system/menuManage.vue'),
            meta: {
                title: '菜单管理',
            },
        },
        {
            path:"roleManage",
            name: 'roleManage',
            component: () => import(/* webpackChunkName: "about" */ '../../views/system/roleManage.vue'),
            meta: {
                title: '角色管理',
            },
        },
        {
            path:"userManage",
            name: 'userManage',
            component: () => import(/* webpackChunkName: "about" */ '../../views/system/userManage.vue'),
            meta: {
                title: '账号管理',
            },
        }
    ]

}

