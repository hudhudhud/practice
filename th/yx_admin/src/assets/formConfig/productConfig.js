import * as formItem from "htadmin-form";
import {fileUploadUrl, selectDown} from "../const";
import {list as list_catg} from "../../service/module/category";

export default {
    baseInfo:[
        new formItem.Input({
            key: 'name',
            label: '商品名称',
            rules:[
                 {required:true,message:'请输入商品名称',trigger:'blur'},
            ]
        }),
        new formItem.Input({
            key: 'unit',
            label: '商品单位',
            rules:[
                {required:true,message:'请输入商品单位',trigger:'blur'},
            ]
        }),
        new formItem.Radio({
            key: 'putawayStatus',
            label: '是否上架',
            options:selectDown.proStatus,
            value:true
        }),
        new formItem.Input({
            key: 'orderNumber',
            label: '排序值',
            rules:[
                 {required:true,message:'请输入排序值',trigger:'blur'},
                 { pattern: /^[0-9]+$/, message: '请输入数字' },
            ]
        }),
        new formItem.Radio({
            key: 'showStatus',
            label: '商城是否显示',
            options: selectDown.proShow,
            value:true
        }),
        new formItem.UploadImg({
            key: 'images',
            label: '商品图片',
            size: '10240', // kb为单位,10M
            url:fileUploadUrl,
            //value:[{id:1,url: "http://image.zhi-you.net/image/4e46a345ce9f42eea2ad507aa3ba4232"}],
            required:true,
            rules:[
                {required:true,message:'请上传商品图片',trigger:'blur'},
            ]
        }),
        new formItem.UploadImg({
            key: 'mainImg',
            label: '商品主图',
            size: '10240', // kb为单位
            url:fileUploadUrl,
            //value:{id:1,url: "http://image.zhi-you.net/image/4e46a345ce9f42eea2ad507aa3ba4232"},
            one:true,
            required:true,
            rules:[
                {required:true,message:'请上传商品主图',trigger:'blur'},
            ]
        }),
        new formItem.Input({
            key: 'intro',
            inputType:'textarea',
            label: '商品简介',
            rows:5,
            rules:[
                {required:true,message:'请输入商品简介',trigger:'blur'},
            ]
        }),
        new formItem.Cascader({
            key:'categoryIds',
            label:'商品类目',
            options:list_catg(),
            filterable:true,
            remote:false,
            labelKey:'name',
            valueKey:'id',
            //options: Promise.resolve([{label:'食品',value:0,children:[{label:'土豆',value:0},{label:'番茄',value:1},{label:'西红柿',value:2}]}, {label:'家具',value:1},{label:'服装',value:2}]),
            rules: [
                {required: true, message: '请选择类目', trigger: 'blur'},
            ],
        }),
        new formItem.CustomComponent({
            key:'proKeyWords',
            name: 'proKeyWords',
            label: '商品关键字',
            // options:self.proKeywords,
        }),
        new formItem.UploadImg({
            key: 'fileInfo',
            label: '商品信息',
            size: '10240', // kb为单位
            url:fileUploadUrl,
            one:true,
        }),
    ],
    specInfo:[
        new formItem.CustomComponent({
            key:'addSpec',
            name: 'addSpec',
            label: '商品型号',
            required:true
            // rules: [
            //     {required: true, message: '请选择商品型号', trigger: 'blur'},
            // ],
        }),
        new formItem.CustomComponent({
            key:'specList',
            name: 'specList',
            label: '价格与库存',
            required:true
            // rules: [
            //     {required: true, message: '请生成价格与库存', trigger: 'blur'},
            // ],
        }),],
    healthInfo:[
        new formItem.Input({
            key: 'healthIndex',
            label: '健康指数',
            rules:[
                { pattern: /^[0-9]+$/, message: '请输入数字' },
            ]
        }),
        new formItem.Input({
            key: 'healthEvaluation',
            inputType:'textarea',
            label: '编辑推荐',
            rows:5,
        }),
        new formItem.CustomComponent({
            key:'healthTag',
            name: 'healthKeyCode',
            label: "健康标签",
        })
    ]
}
