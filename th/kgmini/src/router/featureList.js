
const router = {
  path: '/pages/featureList',
  name: 'featureList',
  component: resolve => require(['../pages/featureList/indexH5'], resolve),
  children: [
    {
      path: 'main',
      component: resolve => require(['../pages/featureList/index'], resolve),
    },
    {
      path: 'sub/selectClassList/main',
      component: resolve => require(['../pages/featureList/sub/selectClassList/index'], resolve),
    },
    {
      path: 'sub/lunch/main',
      component: resolve => require(['../pages/featureList/sub/lunch/index'], resolve),
    },
    {
      path: 'sub/lunch/info/main',
      component: resolve => require(['../pages/featureList/sub/lunch/info/index'], resolve),
    },
    {
      path: 'sub/lunch/createOrder/main',
      component: resolve => require(['../pages/featureList/sub/lunch/createOrder/index'], resolve),
    },
    {
      path: 'sub/lunch/addEvaluate/main',
      component: resolve => require(['../pages/featureList/sub/lunch/addEvaluate/index'], resolve),
    },
    {
      path: 'sub/classroomShowList/main',
      component: resolve => require(['../pages/featureList/sub/classroomShowList/index'], resolve),
    },
    {
      path: 'sub/classroomEvaluateList/main',
      component: resolve => require(['../pages/featureList/sub/classroomEvaluateList/index'], resolve),
    },
    {
      path: 'sub/childManage/main',
      component: resolve => require(['../pages/featureList/sub/childManage/index'], resolve),
    },
    {
      path: 'sub/childManage/searchChild/main',
      component: resolve => require(['../pages/featureList/sub/childManage/searchChild/index'], resolve),
    },
    {
      path: 'sub/childManage/addChild/main',
      component: resolve => require(['../pages/featureList/sub/childManage/addChild/index'], resolve),
    },
    {
      path: 'sub/policy/main',
      component: resolve => require(['../pages/featureList/sub/policy/index'], resolve),
    },
    {
      path: 'sub/mineSelect/main',
      component: resolve => require(['../pages/featureList/sub/mineSelect/index'], resolve),
    },
    {
      path: 'sub/schoolSelect/main',
      component: resolve => require(['../pages/featureList/sub/schoolSelect/index'], resolve),
    },
    {
      path: 'sub/selectClassDetail/main',
      component: resolve => require(['../pages/featureList/sub/selectClassDetail/index'], resolve),
    },
    {
      path: 'sub/checkIn/main',
      component: resolve => require(['../pages/featureList/sub/checkIn/index'], resolve),
    }
  ]
};
export default router;
