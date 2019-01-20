export const selectDown={
    classroomTypes: {
        sch:[
            {label: '社团课', value: 1},
            {label: '拓展课', value: 2},
            {label: '安心班', value: 3}
        ],
        comm:[
            {label: '青少年', value: 1},
            {label: '成年', value: 2},
        ]
    },
    levels: [
      {label: '初级(基础)', value: '初级(基础)'},
      {label: '中级(提高)', value: '中级(提高)'},
      {label: '高级(精英/校队)', value: '高级(精英/校队)'}
    ],
    genders: [
      {label: '男', value: 0},
      {label: '女', value: 1},
      {label: '不限', value: ''}
    ],
    gender: [
        {label: '男', value: 0},
        {label: '女', value: 1},
    ],
    status: [
      {label: '全部状态', value: ''},
      {label: '未上架', value: 'committed'},
      {label: '已上架', value: 'published'},
      {label: '已下架', value: 'unpublished'}
    ],
    operationFlag:[
        {label: '启用', value: 0},
        {label: '禁用', value: 1}
    ],
    schoolTypes:[
        {label:"学校",value:'school'},
        {label:"社区",value:'community'}
    ],
    orderStatus:[
        {label:"全部",value:""},
        {label:"已提交",value:"committed"},
        {label:"已支付",value:"paid"},
        {label:"已取消",value:"cancelled"},
        {label:"已完成",value:"finished"},
    ],
    getLabel(down,val){
        if(val==='')return ''
        let item=down.find(item=>item.value==val)
        if(item){
            return item.label
        }
        return ''
    }
}

export const orgTypeParam={
    mech:0,
    sch:1,
    comm:2
}

export  const orgTypeRole={
    admin:'admin',
    edu:'edu_bureau',
    mech:'mechanism',
    sch:'school',
    comm:'community'
}

export  const orgTypeRoleName={
    admin:'总后台',
    edu_bureau:'教育局',
    mechanism:'机构',
    school:'学校',
    community:'社区'
}

export const orgTypeRoleIndexPage={
    admin:'/',
    edu_bureau:'/account/accountEdu',
    mechanism:'/account/accountMech',
    school:'/account/accountSch',
    community:'/account/accountComm'
}