import * as formItem from "htadmin-form";
import {area_list} from "../../service/module/supplierAddress";

export default [
    new formItem.Input({
        key:'name',
        label:'模板名称',
        rules: [
            {required: true, message: '请输入模板名称', trigger: 'blur'},
        ],
    }),
    new formItem.Radio({
        key: 'type',
        label: '计价方式',
        options: [{label:'按照件数',value:'按照件数'}],
        value: '按照件数',
        rules: [
            {required: true, message: '请选择计价方式', trigger: 'blur'},
        ],
    }),
    new formItem.CustomComponent({
        key:'defaultFee',
        name:'defaultFee',
        label:'默认运费',
        required:true,
    }),
    new formItem.CustomComponent({
        key:'datailVoList',
        name:'datailVoList',
        label:'指定地区运费',
        options: area_list()
    }),
    new formItem.Select({
        key:'noDeliverDistrictIdList',
        label:'不发货地区',
        options: area_list(),
        labelKey:'name',
        valueKey:'id',
        remote:false,
        filterable:true,
        multiple:true,
    }),
];
