import Home from '@/views/Home'
export default {
    path: '/message',
    name: 'message',
    component: Home,
    children:[
        {   
            path:'feedBack',
            name: 'feedBack',
            component: resolve => require(['../../views/message/feedBack.vue'], resolve)    
        }
    ]
}