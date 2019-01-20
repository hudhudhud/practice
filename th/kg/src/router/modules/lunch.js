import Home from '@/views/Home'
export default {
    path: '/lunch',
    name: 'lunch',
    component: Home,
    children:[
        {
            path:'lunchComment',
            name:'lunchComment',
            component:resolve=>require(['../../views/lunch/LunchComment.vue'],resolve)
        },
        {
            path: 'lunchManage',
            name: 'lunchManage',
            component: resolve => require(['../../views/lunch/LunchManage.vue'], resolve)
        },
        {
            path: 'supplierManage',
            name: 'supplierManage',
            component: resolve => require(['../../views/lunch/SupplierManage.vue'], resolve)
        },
    ]
}

      