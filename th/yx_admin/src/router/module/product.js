import layout from '../../views/layout'
import baseInfo from './baseInfo'
export default  {
    path: '/product',
    name: 'product',
    redirect:"noredirect",
    component: layout,
    meta: {
        title: '商品管理',
    },
    children: [
        {
            path: 'productManage',
            name: 'productManage',
            component: () => import(/* webpackChunkName: "about" */ '../../views/index.vue'),
            meta:{
                title:'常规商品管理',
            },
            children:[
                {
                    path:'',
                    name:'productManage',
                    component: () => import(/* webpackChunkName: "about" */ '../../views/product/productManage.vue'),
                    meta:{
                        title:'',
                    },
                },
                {
                    path: 'edit/:id',
                    name: 'edit',
                    component: () => import(/* webpackChunkName: "about" */ '../../views/product/productEdit.vue'),
                    meta:{
                        title:'修改商品',
                    }
                },
                {
                    path: 'add',
                    name: 'add',
                    component: () => import(/* webpackChunkName: "about" */ '../../views/product/productAdd.vue'),
                    meta:{
                        title:'新增商品',
                    }
                },
                {
                    path: 'view',
                    name: 'view',
                    component: () => import(/* webpackChunkName: "about" */ '../../views/product/productView.vue'),
                    meta:{
                        title:'商品预览',
                    }
                },
            ]
        },
        // {
        //     path: 'productEdit/:id',
        //     name: 'productEdit',
        //     component: () => import(/* webpackChunkName: "about" */ '../views/product/productEdit.vue'),
        //     meta:{
        //         title:'修改商品',
        //     }
        // },
        // {
        //     path: 'productAdd',
        //     name: 'productAdd',
        //     component: () => import(/* webpackChunkName: "about" */ '../views/product/productAdd.vue'),
        //     meta:{
        //         title:'新增商品',
        //     }
        // },
        // {
        //     path: 'productView',
        //     name: 'productView',
        //     component: () => import(/* webpackChunkName: "about" */ '../views/product/productView.vue'),
        //     meta:{
        //         title:'商品预览',
        //     }
        // },
        baseInfo,
    ]
};
