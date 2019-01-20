
const router = {
  path: '/pages',
  name: 'homePages',
  component: resolve => require(['../pages/home/indexH5'], resolve),
  children: [
    {
      path: 'index/main',
      name: 'index',
      component: resolve => require(['../pages/index/index'], resolve),
    },
    {
      path: 'home/main',
      name: 'home',
      component: resolve => require(['../pages/home/index'], resolve),
    },
    {
      path: 'nearby/main',
      name: 'nearby',
      component: resolve => require(['../pages/nearby/index'], resolve),
    },
    {
      path: 'homeChild/searchPage/main',
      component: resolve => require(['../pages/homeChild/searchPage/index'], resolve),
    },
    {
      path: 'homeChild/institutionInfo/main',
      component: resolve => require(['../pages/homeChild/institutionInfo/index'], resolve),
    },
    {
      path: 'homeChild/noticeList/main',
      component: resolve => require(['../pages/homeChild/noticeList/index'], resolve),
    },
    {
      path: 'homeChild/communityCollege/main',
      component: resolve => require(['../pages/homeChild/communityCollege/index'], resolve),
    },
    {
      path: 'homeChild/confirmOrder/main',
      component: resolve => require(['../pages/homeChild/confirmOrder/index'], resolve),
    },
    {
      path: 'homeChild/curriculumDetail/main',
      component: resolve => require(['../pages/homeChild/curriculumDetail/index'], resolve),
    },
    {
      path: 'homeChild/curriculumIntro/main',
      component: resolve => require(['../pages/homeChild/curriculumIntro/index'], resolve),
    },
    {
      path: 'homeChild/curriculumList/main',
      component: resolve => require(['../pages/homeChild/curriculumList/index'], resolve),
    },
    {
      path: 'homeChild/map/main',
      component: resolve => require(['../pages/homeChild/map/index'], resolve),
    },
    {
      path: 'homeChild/noticeDetail/main',
      component: resolve => require(['../pages/homeChild/noticeDetail/index'], resolve),
    },
    {
      path: 'homeChild/payOrder/main',
      component: resolve => require(['../pages/homeChild/payOrder/index'], resolve),
    },
    {
      path: 'homeChild/socialPracticeDetail/main',
      component: resolve => require(['../pages/homeChild/socialPracticeDetail/index'], resolve),
    },
    {
      path: 'homeChild/socialPracticeInfo/main',
      component: resolve => require(['../pages/homeChild/socialPracticeInfo/index'], resolve),
    },
    {
      path: 'homeChild/socialPracticeList/main',
      component: resolve => require(['../pages/homeChild/socialPracticeList/index'], resolve),
    },
  ]
};
export default router;
