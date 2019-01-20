
const router = {
  path: '/pages/profile',
  component: resolve => require(['../pages/profile/indexH5'], resolve),
  children: [
    {
      path: 'main',
      component: resolve => require(['../pages/profile/index'], resolve),
    },
    {
      path: 'set/updateSet/main',
      component: resolve => require(['../pages/profile/set/updateSet/index'], resolve),
    },
    {
      path: 'set/updatePsw2/main',
      name: 'updatePsw2',
      component: resolve => require(['../pages/profile/set/updatePsw2/index'], resolve),
    },
    {
      path: 'set/updatePsw1/main',
      name: 'updatePsw1',
      component: resolve => require(['../pages/profile/set/updatePsw1/index'], resolve),
    },
    {
      path: 'set/updateInfo/main',
      component: resolve => require(['../pages/profile/set/updateInfo/index'], resolve),
    },
    {
      path: 'set/aboutMine/main',
      component: resolve => require(['../pages/profile/set/aboutMine/index'], resolve),
    },
    {
      path: 'sub/collection/main',
      component: resolve => require(['../pages/profile/sub/collection/index'], resolve),
    },
    {
      path: 'sub/myEvaluation/main',
      component: resolve => require(['../pages/profile/sub/myEvaluation/index'], resolve),
    },
    {
      path: 'sub/needInvoice/main',
      component: resolve => require(['../pages/profile/sub/needInvoice/index'], resolve),
    },
    {
      path: 'sub/needInvoice/invoiceDetail/main',
      component: resolve => require(['../pages/profile/sub/needInvoice/invoiceDetail/index'], resolve),
    },
    {
      path: 'sub/proposal/main',
      component: resolve => require(['../pages/profile/sub/proposal/index'], resolve),
    },
    {
      path: 'sub/orderList/main',
      component: resolve => require(['../pages/profile/sub/orderList/index'], resolve),
    },
    {
      path: 'sub/orderList/orderDetail/main',
      component: resolve => require(['../pages/profile/sub/orderList/orderDetail/index'], resolve),
    }
  ]
};
export default router;
