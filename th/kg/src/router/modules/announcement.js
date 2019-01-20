
import Home from '@/views/Home'
export default {
    path: '/announcement',
    name: 'announcement',
    component: Home,
    children:[
        {
            path: 'notice',
            name: 'notice',
            component: resolve => require(['../../views/announcement/Notice.vue'], resolve)
        }, {
            path: 'banner',
            name: 'banner',
            component: resolve => require(['../../views/announcement/Banner.vue'], resolve)
        },
        {
            path: 'comment',
            name: 'comment',
            component: resolve => require(['../../views/announcement/comment.vue'], resolve)
        },
    ]
}

      
