import layout from '../../views/layout'

export default  {
    path: 'baseInfo',
    name: 'baseInfo',
    component: () => import(/* webpackChunkName: "about" */ '../../views/index.vue'),
    redirect: 'noredirect',
    meta: {title: '相关信息管理',},
    children:[
        {
            path: 'catgManage',
            name: 'catgManage',
            component: () => import(/* webpackChunkName: "about" */ '../../views/product/baseInfo/catgManage.vue'),
            meta:{
                title:'品类结构管理',
            }
        },
        {
            path: 'tagManage',
            name: 'tagManage',
            component: () => import(/* webpackChunkName: "about" */ '../../views/product/baseInfo/tagManage.vue'),
            meta:{
                title:'商品标签库管理',
            }
        },
        {
            path: 'specManage',
            name: 'specManage',
            component: () => import(/* webpackChunkName: "about" */ '../../views/product/baseInfo/specManage.vue'),
            meta:{
                title:'商品规格管理',
            }
        },
        {
            path: 'supplierManage',
            name: 'supplierManage',
            component: () => import(/* webpackChunkName: "about" */ '../../views/index.vue'),
            meta: {
                title: '供应商管理',
            },
            children:[
                {
                    path: '',
                    name: 'supplierManage',
                    component: () => import(/* webpackChunkName: "about" */ '../../views/product/baseInfo/supplierManage.vue'),
                    meta: {
                        title: '',
                    }
                },
                {
                    path: 'returnAddress/:id',
                    name: 'returnAddress',
                    component: () => import(/* webpackChunkName: "about" */ '../../views/product/baseInfo/returnAddress.vue'),
                    meta: {
                        title: '退货地址',
                    }
                },
                {
                    path: 'transTemplate/:id',
                    name: 'transTemplate',
                    component: () => import(/* webpackChunkName: "about" */ '../../views/product/baseInfo/transTemplate.vue'),
                    meta: {
                        title: '运费模板',
                    }
                }
            ]
        },

    ]
}
