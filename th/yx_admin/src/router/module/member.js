import layout from '../../views/layout'

export default {
    path: '/member',
    name: 'member',
    redirect: '/member/memberManage',
    component: layout,
    meta: {
        title: '会员管理',
    },
    children:[
        {
            path:"rankManage",
            name: 'rankManage',
            component: () => import(/* webpackChunkName: "about" */ '../../views/member/rankManage.vue'),
            meta: {
                title: '会员等级',
            },
        },
        {
            path:"memberManage",
            name: 'memberManage',
            component: () => import(/* webpackChunkName: "about" */ '../../views/member/memberManage.vue'),
            meta: {
                title: '会员列表',
            },
        },
        {
            path:"edit/:id",
            name: 'memberEdit',
            component: () => import(/* webpackChunkName: "about" */ '../../views/member/memberEdit.vue'),
            meta: {
                title: '会员编辑',
            },
        },
        {
            path:"indentityManage",
            name: 'indentityManage',
            component: () => import(/* webpackChunkName: "about" */ '../../views/member/indentityManage.vue'),
            meta: {
                title: '实名认证',
            },
        },
        {
            path:"protocolManage",
            name: 'protocolManage',
            component: () => import(/* webpackChunkName: "about" */ '../../views/member/protocolManage.vue'),
            meta: {
                title: '协议管理',
            },
        }
    ]

}

