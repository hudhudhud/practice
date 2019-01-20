const router =    {
    path: '/commodity',
    name: 'commodity',
    component: resolve => require(['../views/commodity/index'], resolve),
    children: [
        {
            path: 'commodityDetail',
            name: 'commodityDetail',
            component: resolve => require(['../views/commodity/commodityDetail'], resolve)
        },
        {
            path: 'myOrder',
            name: 'myOrder',
            component: resolve => require(['../views/commodity/myOrder'], resolve)
        },
        {
            path: 'pay',
            name: 'pay',
            component: resolve => require(['../views/commodity/pay'], resolve)
        },
        {
            path: 'payIntegral',
            name: 'payIntegral',
            component: resolve => require(['../views/commodity/payIntegral'], resolve)
        },
        {
            path: 'otherPay/:id',
            name: 'otherPay',
            component: resolve => require(['../views/commodity/otherPay'], resolve)
        },
        {
            path: 'otherPayRes/:id',
            name: 'otherPayRes',
            component: resolve => require(['../views/commodity/otherPayRes'], resolve)
        },
        {
            path: 'result',
            name: 'result',
            component: resolve => require(['../views/commodity/result'], resolve)
        },
        {
            path: 'result2',
            name: 'result2',
            component: resolve => require(['../views/commodity/result'], resolve),
            meta: { other: true }
        },
        {
            path: 'life',
            name: 'life',
            component: resolve => require(['../views/commodity/life'], resolve)
        },
        {
            path: 'commodityBuyerVip',
            name: 'commodityBuyerVip',
            component: resolve => require(['../views/commodity/commodityBuyerVip'], resolve)
        },
        {
            path: 'upgradeVip',
            name: 'upgradeVip',
            component: resolve => require(['../views/commodity/upgradeVip'], resolve)
        }
    ]
};
export default router;