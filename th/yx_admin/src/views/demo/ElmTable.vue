<template>
    <div>
        <elm-form :config="config1" :formConfig="formConfig"
                  @form-submit="search"
                  @form-cancel="resetSearch">
        </elm-form>

        <el-table
                :data="list"
                style="width: 100%">
            <el-table-column
                    prop="date"
                    label="日期"
                    width="180"
                    sortable>
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
                loading:false,
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
                ],
                config1: [
                    new item.SingDate({
                        key: 'date1',
                        label: '日期'
                    }),
                    new item.Input({
                        key: 'string1',
                        label: '名字',
                        rules: [
                            //    {required: true, message: '请输入活动名称', trigger: 'blur'},
                            //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                        ]
                    }),
                ],
                formConfig:{showCancelButton: true,cancelButtonText:'重置', confirmButtonText: '查询',inline:true},
                columns:[
                    { key: 'date', title: '日期' },
                    { key:'string',title: '姓名'},
                    { key:'county',title: '地址'},
                    { key:'email',title: '邮箱'},
                    { key:'',title: '自定义列',slot:'customer'},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '查看',emitKey: 'handleLook'},
                            {name: '编辑',emitKey: 'handleClick'}
                        ]
                    }
                ],
                columns1:[
                    { key: 'name', title: '' },
                    { key:'age',title: ''},
                ]
            }
        },
        mounted: function () {
            this.getList();
        },
        methods: {
            getList: async function () {
                this.loading = true;
                ({list: this.list} = await getList());
                this.list.forEach((item,i)=>{
                    item.customer=[{name:'a',url:'http://image.zhi-you.net/1/e8a1dabde87543a4958517ac0bd6ef2f'},{name:'b',url:'http://image.zhi-you.net/1/e8a1dabde87543a4958517ac0bd6ef2f'}]
                })
                this.loading = false;
            },
            handleClick: function (e) {
                this.$refs.alertForm.openAlert(e, {
                    beforeClose: async function (action, instance, done, e) {
                        console.log(111111111,action)
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            try {
                                await updateItem(e, {successMsg: '修改成功'});
                                done();
                            } finally {
                                setTimeout(() => {
                                    instance.confirmButtonText = '修改';
                                    instance.confirmButtonLoading = false;
                                }, 300);
                            }
                        } else {
                            done();
                        }

                    }
                });
                //

            },
            handleLook: function (e) {
                this.$refs.alertForm.openAlert(e, {showConfirmButton: false});
            },
            search(){

            },
            resetSearch(){

            }
        }
    }
</script>

<style scoped lang="scss">
.customer{
    @include clearfix;
    .right {
        @include fr;
    }
    .left{
        @include fl;
        width:20px;
    }
}

</style>
