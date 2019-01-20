const router = {
    path: '/profile',
    name: 'profileIndex',
    component: resolve => require(['../views/profile/index'], resolve),
    children: [
        {
            path: 'orderAfterSaleList',
            name: 'orderAfterSaleList',
            component: resolve => require(['../views/profile/order/orderAfterSaleList'], resolve),
        },
        {
            path: 'afterSaleInfo',
            name: 'afterSaleInfo',
            component: resolve => require(['../views/profile/order/afterSale/afterSaleInfo'], resolve),
        },
        {
            path: 'afterSaleList',
            name: 'afterSaleList',
            component: resolve => require(['../views/profile/order/afterSale/afterSaleList'], resolve),
        },
        {
            path: 'refund',
            name: 'refund',
            component: resolve => require(['../views/profile/order/afterSale/refund/refund'], resolve),
        },
        {
            path: 'updatePhone',
            name: 'updatePhone',
            component: resolve => require(['../views/profile/user/updatePhone'], resolve),
        },
        {
            path: 'userSet',
            name: 'userSet',
            component: resolve => require(['../views/profile/user/userSet'], resolve),
        },
        {
            path: 'option',
            name: 'option',
            component: resolve => require(['../views/profile/accountSecurity/option'], resolve),
        },
        {
            path: 'qrcode',
            name: 'qrcode',
            component: resolve => require(['../views/profile/accountSecurity/qrcode'], resolve),
        },
        {
            path: 'dataList',
            name: 'dataList',
            component: resolve => require(['../views/profile/order/dataList'], resolve),
        },
        {
            path: 'myGrowth',
            name: 'myGrowth',
            component: resolve => require(['../views/profile/myGrowth'], resolve),
        },{
            path:'myGrowup',
            name:'myGrowup',
            component: resolve => require(['../views/profile/myGrowup'], resolve),
        },
        {
            path: 'profit',
            name: 'profit',
            component: resolve => require(['../views/profile/profit'], resolve),
        },
        {
            path: 'balance',
            name: 'balance',
            component: resolve => require(['../views/profile/balance/balance'], resolve),
        },
        {
            path: 'ucurrency',
            name: 'ucurrency',
            component: resolve => require(['../views/profile/balance/ucurrency'], resolve),
        },
        {
            path: 'vault',
            name: 'vault',
            component: resolve => require(['../views/profile/balance/vault'], resolve),
        },
        {
            path: 'recharge',
            name: 'recharge',
            component: resolve => require(['../views/profile/balance/recharge'], resolve),
        },
        {
            path: 'withdrawal',
            name: 'withdrawal',
            component: resolve => require(['../views/profile/balance/withdrawal'], resolve),
        },
        {
            path: 'cashDepositList',
            name: 'cashDepositList',
            component: resolve => require(['../views/profile/balance/frozen/cashDepositList'], resolve),
        },
        {
            path: 'worldBonus',
            name: 'worldBonus',
            component: resolve => require(['../views/profile/balance/frozen/worldBonus'], resolve),
        },
        {
            path: 'frozenList',
            name: 'frozenList',
            component: resolve => require(['../views/profile/balance/frozen/frozenList'], resolve),
        },
        {
            path: 'rechargeOffline',
            name: 'rechargeOffline',
            component: resolve => require(['../views/profile/balance/recharge-offline'], resolve),
        },
        {
            path: 'integral',
            name: 'integral',
            component: resolve => require(['../views/profile/balance/integral'], resolve),
        },
        {
            path: 'bankInfo',
            name: 'bankInfo',
            component: resolve => require(['../views/profile/balance/bankCardManage/bankCardList'], resolve),
        },
        {
            path: 'bandCard',
            name: 'bandCard',
            component: resolve => require(['../views/profile/balance/bankCardManage/bandCard'], resolve),
        },
        {
            path: 'sales',
            name: 'sales',
            component: resolve => require(['../views/profile/sales'], resolve),
        },
        {
            path: 'mineItem',
            name: 'mineItem',
            component: resolve => require(['../views/profile/mineItem'], resolve),
        },
        {
            path: 'orderList',
            name: 'orderList',
            component: resolve => require(['../views/profile/order/orderList'], resolve),
        },
        {
            path: 'logistics',
            name: 'logistics',
            component: resolve => require(['../views/profile/order/logistics'], resolve),
        },
        {
            path: 'collection',
            name: 'collection',
            component: resolve => require(['../views/profile/collection'], resolve),
        },
        {
            path: 'personalOrder',
            name: 'personalOrder',
            component: resolve => require(['../views/profile/order/personalOrder'], resolve),
        },
        {
            path: 'personalOrderDetail/:id',
            name: 'personalOrderDetail',
            component: resolve => require(['../views/profile/order/personalOrderDetail'], resolve),
        },
        {
            path: 'personalInfo',
            name: 'personalInfo',
            component: resolve => require(['../views/profile/personalInfo'], resolve),
        },
        {
            path: 'addressList',
            name: 'addressList',
            component: resolve => require(['../views/profile/addressManage/addressList'], resolve),
        },
        {
            path: 'addressEdit',
            name: 'addressEdit',
            component: resolve => require(['../views/profile/addressManage/addressEdit'], resolve),
        },
        {
            path: 'certification',
            name: 'certification',
            component: resolve => require(['../views/profile/certification'], resolve),
        },
        {
            path: 'accountInfo',
            name: 'accountInfo',
            component: resolve => require(['../views/profile/accountSecurity/accountInfo'], resolve),
        },
        {
            path: 'updatePsw',
            name: 'updatePsw',
            component: resolve => require(['../views/profile/accountSecurity/updatePsw'], resolve),
        },
        {
            path: 'forgetPsw',
            name: 'forgetPsw',
            component: resolve => require(['../views/profile/accountSecurity/forgetPsw'], resolve),
        },
        {
            path: 'forgetPsw2',
            name: 'forgetPsw2',
            component: resolve => require(['../views/profile/accountSecurity/forgetPsw2'], resolve),
        },
        {
            path: 'eka',
            name: 'eka',
            component: resolve => require(['../views/profile/balance/eka'], resolve),
        },
        {
            path: 'performance',
            name: 'performance',
            component: resolve => require(['../views/profile/balance/performance'], resolve),
        },
        {
            path: 'integralDetail',
            name: 'integralDetail',
            component: resolve => require(['../views/profile/balance/integralDetail'], resolve),
        },
        {
            path: 'usableIntegral',
            name: 'usableIntegral',
            component: resolve => require(['../views/profile/balance/usableIntegral'], resolve),
        },
        {
            path: 'withdrawIntegral',
            name: 'withdrawIntegral',
            component: resolve => require(['../views/profile/balance/withdrawIntegral'], resolve),
        },
    ]
}
export default router;