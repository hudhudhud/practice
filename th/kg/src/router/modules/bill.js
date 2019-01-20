import Home from '@/views/Home'
export default {
    path: '/bill',
    name: 'bill',
    component: Home,
    children:[
        {
            path: 'billEmail',
            name: 'billEmail',
            component: resolve => require(['../../views/bill/BillEmail.vue'], resolve)
        }, {
            path: 'billPost',
            name: 'billPost',
            component: resolve => require(['../../views/bill/BillPost.vue'], resolve)
        },
    ]
}

      
