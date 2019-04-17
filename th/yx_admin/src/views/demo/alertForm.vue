<template>
    <div>
        <elm-alert-form ref="alertForm" :config="config">
            <template slot="cus">
                <div style="border-top: 1px solid black;margin-bottom: 20px"></div>
            </template>
        </elm-alert-form>
        <el-button type="text" @click="open">点击打开弹框</el-button>
    </div>
</template>

<script>
    import {Test, Input, Editor, CustomComponent,Cascader} from "htadmin-form";
    import {getCatg} from "../../service/test";
    export default {
        name: "alertForm",
        data: function () {
            return {
                config: [
                    new Test({
                        key: 'test',
                        label: '测试',
                        value: 1
                    }),
                    new Input({
                        key: 'name',
                        label: '名字',
                        rules: [
                            //    {required: true, message: '请输入活动名称', trigger: 'blur'},
                            //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                        ]
                    }),
                    new CustomComponent({
                        name: 'cus'
                    }),
                    new Input({
                        key: 'age',
                        label: '年龄',
                        inputType: 'number'
                    }),
                    new Editor({
                        key: 'ftext',
                        label: '富文本'
                    })
                ]
            }
        },
        mounted: function () {
        },
        methods: {
            open: function () {
                // 第一个参数是 初始化表单数据，可不传, 第二个参数是各种配置项
                this.$refs.alertForm.openAlert({name: '名字',catg:[10,11]}, {
                    labelWidth: '80px',
                    closeOnClickModal: false,
                    /**
                     * 关闭之前
                     * @param action  action 的值为'confirm', 'cancel'或'close'；
                     * @param instance instance 为 MessageBox 实例，可以通过它访问实例上的属性和方法；
                     * @param done done 用于关闭 MessageBox 实例
                     * @param form form是表单的数据
                     */
                    beforeClose: function (action, instance, done, form) {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            setTimeout(() => {
                                done();
                                setTimeout(() => {
                                    instance.confirmButtonLoading = false;
                                }, 300);
                            }, 2000)
                        } else {
                            done();
                        }
                    }
                });

            }
        }
    }
</script>

<style scoped>

</style>
