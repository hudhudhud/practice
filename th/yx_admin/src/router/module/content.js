import layout from '../../views/layout'
export default  {
    path: '/content',
    name: 'content',
    redirect:"noredirect",
    component: layout,
    meta: {
        title: '内容管理',
    },
    children: [
        {
            path: 'miniPro',
            name: 'miniPro',
            redirect:"noredirect",
            component: () => import(/* webpackChunkName: "about" */ '../../views/index.vue'),
            meta:{
                title:'优选会员小程序',
            },
            children:[
                {
                    path:'bannerManage',
                    name:'bannerManage',
                    component: () => import(/* webpackChunkName: "about" */ '../../views/content/miniPro/bannerManage.vue'),
                    meta:{
                        title:'banner管理',
                    },
                },
                {
                    path:'announceManage',
                    name:'announceManage',
                    component: () => import(/* webpackChunkName: "about" */ '../../views/content/miniPro/announceManage.vue'),
                    meta:{
                        title:'通知公告管理',
                    },
                },
                {
                    path:'popManage',
                    name:'popManage',
                    component: () => import(/* webpackChunkName: "about" */ '../../views/content/miniPro/popManage.vue'),
                    meta:{
                        title:'首页弹窗管理',
                    },
                },
                {
                    path:'learnShareManage',
                    name:'learnShareManage',
                    component: () => import(/* webpackChunkName: "about" */ '../../views/content/miniPro/learnShareManage.vue'),
                    meta:{
                        title:'学习分享管理',
                    },
                },

            ]
        },
    ]
};
