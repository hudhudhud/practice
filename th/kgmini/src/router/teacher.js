
const router = {
  path: '/pages/teacher',
  component: resolve => require(['../pages/teacher/indexH5'], resolve),
  children: [
    {
      path: 'profile/main',
      component: resolve => require(['../pages/teacher/profile/index'], resolve),
    },
    {
      path: 'curriculum/curriculumList/main',
      component: resolve => require(['../pages/teacher/curriculum/curriculumList/index'], resolve),
    },
    {
      path: 'evaluateList/main',
      component: resolve => require(['../pages/teacher/evaluateList/index'], resolve),
    },
    {
      path: 'curriculum/evaluateStudent/main',
      component: resolve => require(['../pages/teacher/curriculum/evaluateStudent/index'], resolve),
    },
    {
      path: 'curriculum/evaluateStudentAdd/main',
      component: resolve => require(['../pages/teacher/curriculum/evaluateStudentAdd/index'], resolve),
    }
  ]
};
export default router;
