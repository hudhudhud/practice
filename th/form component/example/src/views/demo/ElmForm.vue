<template>
    <div class="form">
        <elm-form ref="myForm" :config="config" :formConfig="{showCancelButton: false, confirmButtonText: '点击添加'}"
                    @form-submit="submit">
            <template slot="myCus" slot-scope="{options}">
                <select>
                    <option v-for="(item, index) in options" :key="index">{{item}}</option>
                </select>
            </template>
        </elm-form>
    </div>
</template>

<script>
    // import * as type from '../../data/type'
    import * as type from 'htadmin-form'

    import {getListItem} from "../../service/test";

    export default {
        name: "elm-form-page",
        data: function () {
            return {
                config: [
                    new type.Test({
                        key: 'test',
                        label: '测试',
                        value: 1
                    }),
                    new type.Input({
                        key: 'name',
                        label: '名字',
                        rules: [
                            {required: true, message: '请输入活动名称', trigger: 'blur'},
                            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                        ]
                    }),
                    new type.Input({
                        key: 'age',
                        label: '年龄',
                        inputType: 'number'
                    }),
                    new type.Checkbox({
                        key: 'checkbox',
                        label: '兴趣',
                        options: Promise.resolve(['打球', '读书', '跑步', '游泳']),
                        //  max: 3,
                        //  min:1
                    }),
                    new type.Select({
                        key: 'gender',
                        label: '性别',
                        // labelKey: 'label',// 默认值 label
                        // valueKey: 'value',// 默认值 value
                        options: getListItem(),
                        rules: [
                            //    {required: true, message: '请选择性别', trigger: 'blur'},
                        ]
                    }),
                    new type.CustomComponent({ // 这个基本是确定位置的作用
                        name: 'myCus',
                        label: 'label不传也行',
                        options: Promise.resolve(['选项1', '选项2']) //
                    }),
                    new type.Switch({
                        key: 'isd',
                        label: '切换',
                        // trueValue: '123',
                        //  falseValue: '0'
                    }),
                    new type.Radio({
                        key: 'radio',
                        label: '婚姻',
                        options: ['已婚', '未婚'],
                        //  value: '未婚'
                    }),

                    new type.SingDate({
                        key: 'time',
                        label: '选择时间',
                        showTime: true
                    }),
                    new type.UploadImg({
                        key: 'img',
                        label: '上传图片啊啥',
                        // size: '1024', // kb为单位
                        //  value: ['http://image.zhi-you.net/1/e8a1dabde87543a4958517ac0bd6ef2f']
                    }),
                    new type.Editor({
                        key: 'ftext',
                        label: '富文本'
                    })
                ]
            }
        },
        mounted: function () {
            setTimeout(() => {
                this.$refs.myForm.resetFormData({age: 18, time: new Date(), radio: '已婚', test: 10});
            }, 2000)
        },
        methods: {
            submit: function (e) {
                console.log(Object.assign({}, e));
            }
        },
        deactivated: function () {
            //  Object.assign(this.$data, this.$options.data());
        },
    }
</script>

<style scoped lang="scss">
    .form {
        padding: 50px;
        width: 80%;
    }
</style>
