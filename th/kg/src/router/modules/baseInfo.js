import Home from '@/views/Home'
export default {
    path: '/baseInfo',
    name: 'baseInfo',
    component: Home,
    children:[
        {
            path: 'teacherSch',
            name: 'teacherSch',
            component: resolve => require(['../../views/baseInfo/TeacherSch.vue'], resolve)
        },
        {
            path: 'teacherMech',
            name: 'teacherMech',
            component: resolve => require(['../../views/baseInfo/TeacherMech.vue'], resolve)
        },
        {
            path: 'regional',
            name: 'regional',
            component: resolve => require(['../../views/baseInfo/Regional.vue'], resolve)
        },
        {
            path: 'partner',
            name: 'partner',
            component: resolve => require(['../../views/baseInfo/Partner.vue'], resolve)
        },
        {
            path: 'gradeManage', 
            name: 'gradeManage',
            component: resolve => require(['../../views/baseInfo/GradeManage.vue'], resolve)
        },
        {
            path:'studentMessage',
            name:'studentMessage',
            component:resolve=>require(['../../views/baseInfo/StudentMessage.vue'],resolve)
        },
        {
            path:'mechanism',
            name:'mechanism',
            component:resolve=>require(['../../views/baseInfo/Mechanism.vue'],resolve)
        },
        {
            path:'classManage',
            name:'classManage',
            component:resolve=>require(['../../views/baseInfo/ClassManage.vue'],resolve)
        },
        {
            path:'school',
            name:'school',
            component:resolve=>require(['../../views/baseInfo/School.vue'],resolve)
        },
        {
            path:'importStudentParent',
            name:'importStudentParent',
            component:resolve=>require(['../../views/baseInfo/ImportStudentParent.vue'],resolve)
        },
        {
            path:'schoolSemester',
            name:'schoolSemester',
            component:resolve=>require(['../../views/baseInfo/SchoolSemester.vue'],resolve)
        },
        {
            path:'practiceBase',
            name:'practiceBase',
            component:resolve=>require(['../../views/baseInfo/PracticeBase.vue'],resolve)
        },
    ]
}

      

  
 