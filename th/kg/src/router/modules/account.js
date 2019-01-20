import Home from '@/views/Home'
export default {
    path: '/account',
    name: 'account',
    component: Home,
    children:[
        {
            path: 'accountSch',
            name: 'accountSch',
            component: resolve => require(['../../views/account/AccountSch.vue'], resolve),
        }, {
            path: 'accountMech',
            name: 'accountMech',
            component: resolve => require(['../../views/account/AccountMech.vue'], resolve)
        }, {
            path: 'accountEdu',
            name: 'accountEdu',
            component: resolve => require(['../../views/account/AccountEdu.vue'], resolve)
        },{
            path: 'passwordEdit',
            name: 'passwordEdit',
            component: resolve => require(['../../views/account/PasswordEdit.vue'], resolve)
        },{
            path: 'accountComm',
            name: 'accountComm',
            component: resolve => require(['../../views/account/AccountComm.vue'], resolve)
        },
    ]
}

      
