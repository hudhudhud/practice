<template>
    <div>
        <el-table
                :data="list"
                style="width: 100%">
            <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="string"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="county"
                    label="地址">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button @click="handleLook(scope.row)" type="text" size="small">查看</el-button>
                    <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>


        <elm-alert-form ref="alertForm" :config="config"></elm-alert-form>
    </div>
</template>

<script>
    import {getList, updateItem} from "../../service/test";
    import * as item from "htadmin-form";

    export default {
        name: "ElmTable",
        data: function () {
            return {
                list: [],
                config: [
                    new item.SingDate({
                        key: 'date',
                        label: '日期'
                    }),
                    new item.Input({
                        key: 'string',
                        label: '名字',
                        rules: [
                            //    {required: true, message: '请输入活动名称', trigger: 'blur'},
                            //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                        ]
                    }),
                    new item.Input({
                        key: 'county',
                        label: '地址'
                    }),
                    new item.Input({
                        key: 'email',
                        label: '邮箱'
                    })
                ]
            }
        },
        mounted: function () {
            this.getList();
        },
        methods: {
            getList: async function () {
                ({list: this.list} = await getList());
            },
            handleClick:async function (e) {
                const {form, close} = await this.$refs.alertForm.openAlert(e, {confirmButtonText: '修改'});
                await updateItem(form, {successMsg:'修改成功'});
                close();
            },
            handleLook: function (e) {
                this.$refs.alertForm.openAlert(e, {showConfirmButton: false});
            }
        }
    }
</script>

<style scoped>

</style>
