import layout from '../views/layout'

export default  {
    path: '/demo',
    name: 'demo',
    component: layout,
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
