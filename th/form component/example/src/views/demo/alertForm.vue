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
    import {Test, Input, Editor, CustomComponent} from "htadmin-form";

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
            open: async function () {
                const {form, close} = await this.$refs.alertForm.openAlert({name: '名字'}, {
                    labelWidth: '80px',
                    closeOnClickModal: false
                });
                this.$message(JSON.stringify(form));
                close();
            }
        }
    }
</script>

<style scoped>

</style>
