
const router = {
    path: '/signInIndex',
    name: 'signInIndex',
    component: resolve => require(['../views/signIn/index'], resolve),
    children: [
        {
            path: 'check',
            name: 'check',
            component: resolve => require(['../views/signIn/check'], resolve),
        },
        {
            path: 'validationPhone',
            name: 'validationPhone',
            component: resolve => require(['../views/signIn/validationPhone'], resolve),
        },
        {
            path: 'error',
            name: 'signError',
            component: resolve => require(['../views/signIn/error'], resolve),
        },
        {
            path: 'signIn',
            name: 'signIn',
            component: resolve => require(['../views/signIn/signIn'], resolve),
        },

    ]
};
export default router;