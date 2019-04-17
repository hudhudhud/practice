import * as formItem from "htadmin-form";

export default [
    new formItem.Input({
        key:'name',
        label:'供应商名称',
        rules: [
            {required: true, message: '请输入供应商名称', trigger: 'blur'},
        ],
    }),
    new formItem.Input({
        key:'contact',
        label:'联系人',
        rules: [
            {required: true, message: '请输入联系人', trigger: 'blur'},
        ],
    }),
    new formItem.Input({
        key:'mobile',
        label:'联系人电话',
        rules: [
            {required: true, message: '请输入联系人电话', trigger: 'blur'},
        ],
    }),
];
