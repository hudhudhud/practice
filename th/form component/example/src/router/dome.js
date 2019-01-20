export default  {
    path: '/demo',
    name: 'demo',
    component: () => import(/* webpackChunkName: "about" */ '../views/demo/index.vue'),
    children: [
        {
            path: 'ElmTable',
            name: 'ElmTable',
            component: () => import(/* webpackChunkName: "about" */ '../views/demo/ElmTable.vue')
        },
        {
            path: 'ElmForm',
            name: 'ElmForm',
            component: () => import(/* webpackChunkName: "about" */ '../views/demo/ElmForm.vue')
        },
        {
            path: 'ElmAlertForm',
            name: 'ElmAlertForm',
            component: () => import(/* webpackChunkName: "about" */ '../views/demo/alertForm.vue')
        }
    ]
};
