import * as formItem from "htadmin-form";
import {area_list} from "../../service/module/supplierAddress";

export default [
    new formItem.Cascader({
        key:'districtIds',
        label:'收货地址',
        services:area_list,
        filterable:false,
        remote:true,
        //changeOnSelect:true,
        // options: area_list({type:0}),
        servicesParamsKey:'parentId',
        labelKey:'name',
        valueKey:'id',
        hasChildrenKey:'childCount',
        rules: [
             {required: true, message: '请选择收货地址', trigger: 'blur'},
        ]
    }),
    new formItem.Input({
        key:'street',
        label:'详细地址',
    }),
    new formItem.Input({
        key:'contact',
        label:'收货人',
        rules: [
            {required: true, message: '请输入收货人', trigger: 'blur'},
        ]
    }),
    new formItem.Input({
        key:'mobile',
        label:'收货电话',
        rules: [
            {required: true, message: '请输入收货电话', trigger: 'blur'},
        ]
    }),
]
