
const router = {
  path: '/pages/auth',
  name: 'authPages',
  component: resolve => require(['../pages/auth/index'], resolve),
  children: [
    {
      path: 'login/main',
      name: 'login',
      component: resolve => require(['../pages/auth/login/index'], resolve),
    },
    {
      path: 'register/main',
      name: 'register',
      component: resolve => require(['../pages/auth/register/index'], resolve),
    }
  ]
};
export default router;
