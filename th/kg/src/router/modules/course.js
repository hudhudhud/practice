import Home from '@/views/Home'
export default {
    path: '/course',
    name: 'course',
    component: Home,
    children:[
        {
            path:'courseMech',
            name:'courseMech',
            component:resolve=>require(['../../views/course/CourseMech.vue'],resolve)
        },{
            path:'courseSch', 
            name:'courseSch',
            component:resolve=>require(['../../views/course/CourseSch.vue'],resolve)
        },{
            path:'courseConfig',
            name:'courseConfig',
            component:resolve=>require(['../../views/course/CourseConfig.vue'],resolve)
        },{
            path:'courseLibrary',
            name:'courseLibrary',
            component:resolve=>require(['../../views/course/CourseLibrary.vue'],resolve)
        },{
            path:'courseColumnTwo',
            name:'courseColumnTwo',
            component:resolve=>require(['../../views/course/CourseColumnTwo.vue'],resolve)
        },{
            path:'courseColumn',
            name:'courseColumn',
            component:resolve=>require(['../../views/course/CourseColumn.vue'],resolve)
        }
        ,{
            path:'courseSchedule/:courseid',
            name:'courseSchedule',
            component:resolve=>require(['../../views/course/CourseSchedule.vue'],resolve)
        }
        ,{
            path:'orderManage',
            name:'orderManage',
            component:resolve=>require(['../../views/course/OrderManage.vue'],resolve)
        },
        {
            path:'practicalActivity',
            name:'practicalActivity',
            component:resolve=>require(['../../views/course/PracticalActivity.vue'],resolve)
        },
        {
            path:'courseComm',
            name:'courseComm',
            component:resolve=>require(['../../views/course/courseComm.vue'],resolve)
        },
    ]
}
