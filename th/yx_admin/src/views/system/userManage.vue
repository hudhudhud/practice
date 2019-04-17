<template>
    <section>
        <elm-form ref="searchForm" :config="configSearch" :formConfig="formConfig"  class="search-form"
                  @form-submit="search"
                  @form-cancel="resetSearch">
        </elm-form>
        <div>
            <el-button   type="primary" class="fr"  @click="add">新增账号</el-button>
        </div>
        <base-table v-loading="loading" :columns="columns" :list="list"    @handleEdit='add'
                    @handleDelete="handleDelete"  >
        </base-table>
        <div class="pagination" v-if="list&&list.length">
            <el-pagination
                    background
                    :current-page='pageNo'
                    @current-change="show"
                    class="pages"
                    :page-size="pageSize"
                    :layout="pageLayout"
                    :total="pageTotal">
            </el-pagination>
        </div>

        <elm-alert-form ref="addForm" :config="addConfig">
        </elm-alert-form>
    </section>
</template>
<script>
    import * as formItem from "htadmin-form";
    import pageMix from '@/mixins/pagerList'
    import {list,del,update,view,add,userRole} from "@/service/module/user";
    import {list as list_role} from "@/service/module/role";
    import {selectDown} from "@/assets/const.js"
    export default{
        mixins:[pageMix],
        data(){
            return {
                configSearch:[
                    new formItem.Input({
                        key: 'mobile',
                        label: '账号名称',
                    }),
                    new formItem.Select({
                        key: 'status',
                        label: '用户状态',
                        options:selectDown.userStatus
                    }),
                ],
                formConfig:{showCancelButton: true,cancelButtonText:'重置', confirmButtonText: '查询',inline:true},
                columns:[
                    { key: 'sn', title: '会员编号'},
                    { key: 'mobile', title: '登录名'},
                    { key: 'mobile', title: '用户名'},
                    { key: 'mobile', title: '手机号'},
                    { key: 'nickName', title: '昵称'},
                    { key: 'status', title: '用户状态',format:selectDown.getLabel.bind(selectDown.userStatus)},
                    { key: 'createdAt', title: '创建时间',},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '编辑',emitKey: 'handleEdit'},
                            {name:'删除',emitKey:'handleDelete'},
                        ]
                    }
                ],
                addConfig:[
                    new formItem.Input({
                        key: 'sn',
                        label: '会员编号',
                        rules:[
                            {required:true,message:'请输入会员编号',trigger:'blur'},
                        ]
                    }),
                    new formItem.Select({
                        key: 'status',
                        label: '用户状态',
                        options:selectDown.userStatus,
                        rules:[
                            {required:true,message:'请选择用户状态',trigger:'blur'},
                        ]
                    }),
                ],
                roleList:[],
                selectDown,
            }
        },
        async created(){
          // this.addConfig[2].cb=((val)=>{if(val){
          //     this.$refs.addForm.$refs[Object.keys(this.$refs.addForm.$refs)[0]].resetFormData({password:'',repeatPassword:''})
          // }})
            let {records} = await list_role({current:1,size:100})
            this.roleList=records
            this.addConfig.splice(1,0,
                new formItem.Select({
                    key: 'roleIds',
                    label: '分配角色',
                    multiple:true,
                    labelKey:'name',
                    valueKey:'id',
                    options:this.roleList,
                    rules:[
                        {required:true,message:'请分配角色',trigger:'blur'},
                    ]
                }),)
        },
        methods:{
            async show(pageNo,query){
                this.beforeShow(pageNo)
                let params = {
                    current: this.pageNo,
                    size: this.pageSize,
                };
                if(query){
                    Object.assign(params,query)
                }
                let res = await list(params);
                this.listSuccessCb(res)
            },
            search(form){
                this.show(1,form)
            },
            resetSearch(){
                let newSet={}
                this.configSearch.forEach(item=>{
                    newSet[item.key]=(item.type==='cascader')?[]:'';
                })
                this.$refs.searchForm.resetFormData(newSet)
                this.show()
            },
            async add(row){
                let obj=row.id?row:{};
                let self=this;
                let title='新增账号'
                if(row.id){
                    title='修改账号'
                    obj =await view({id:row.id})
                    obj.roleIds=obj.roles.map(item=>item.id)
                }
                this.$refs.addForm.openAlert(obj, {
                    title,
                    labelWidth: '100px',
                    closeOnClickModal: true,
                    beforeClose:async function (action, instance, done, form) {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            let error=false
                            let submitForm={status:form.status,roleIds:form.roleIds.join(),sn:form.sn}
                            if(obj.id){
                                submitForm.id=obj.id
                                await update(submitForm).catch(()=>{error=true;})
                            }
                            else{
                                 await add(submitForm).catch(()=>{error=true;})
                            }
                            instance.confirmButtonText='确定'
                            instance.confirmButtonLoading = false;
                            if(!error){
                                self.show(self.pageNo,self.$refs.searchForm.formData)
                                done();
                            }
                        } else {
                            instance.confirmButtonLoading = false;
                            done();
                        }
                    }
                });
            },
            async handleDelete(row){
                await this.$confirm('是否确认删除', '提示', {type: 'warning'});
                await del({id:row.id}, {successMsg: '删除成功'})
                this.show(this.pageNo)
            },
        }
    }
</script>
<style>

</style>
