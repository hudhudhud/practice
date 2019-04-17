<template>
    <section>
        <elm-form ref="searchForm" :config="configSearch" :formConfig="formConfig"  class="search-form"
                  @form-submit="search"
                  @form-cancel="resetSearch">
        </elm-form>
        <div>
            <el-button   type="primary" class="fr"  @click="add">新增角色</el-button>
        </div>
        <base-table v-loading="loading" :columns="columns" :list="list"    @handleEdit='add'
                    @handleDelete="handleDelete"  @handleRoleSet="handleRoleSet" @handleUserSet="handleUserSet">
            <template slot-scope="{scope}" slot='values'>
                <span>{{scope.row.values&&scope.row.values.length?scope.row.values.join():''}}</span>
            </template>
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

        <el-dialog title="角色权限设置"  :visible.sync="roleSetDialogVisible"  custom-class="role-set-form">
            <el-tree
                    ref="tree"
                    show-checkbox
                    :data="menusList"
                    :props="treeProps"
                    node-key="id"
                    :expand-on-click-node="true"
                    :check-strictly="true"
                    >
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleSetDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleRoleSetSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="用户权限设置" :visible.sync="userSetDialogVisible" custom-class="user-set-form">
            <el-transfer
                    v-model="currentUserList"
                    filterable
                    :titles="['未分配用户', '已分配用户']"
                    :button-texts="['取消用户','添加用户']"
                    :format="{
                        noChecked: '${total}',
                        hasChecked: '${checked}/${total}'
                      }"
                    :data="userList">
                <span slot-scope="{ option }">{{ option.label }}</span>
            </el-transfer>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userSetDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleUserSetSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
    import * as formItem from "htadmin-form";
    import pageMix from '@/mixins/pagerList'
    import {list,del,update,view,save,editRoleResource,listUserByRole} from "@/service/module/role";
    import {list as list_menu,find_resource_ids_by_role_id} from "@/service/module/menu";
    import {list as list_user,allocate_role_2_users} from "@/service/module/user";

    export default{
        mixins:[pageMix],
        data(){

            return {
                configSearch:[
                    new formItem.Input({
                        key: 'name',
                        label: '角色名称',
                    }),
                ],
                formConfig:{showCancelButton: true,cancelButtonText:'重置', confirmButtonText: '查询',inline:true},
                columns:[
                    { key: 'name', title: '名称'},
                    { key: 'describe', title: '描述'},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '编辑',emitKey: 'handleEdit'},
                            {name: '角色权限设置',emitKey: 'handleRoleSet'},
                            {name: '用户权限设置',emitKey: 'handleUserSet'},
                            {name:'删除',emitKey:'handleDelete'},
                        ]
                    }
                ],
                addConfig:[
                    new formItem.Input({
                        key: 'name',
                        label: '角色名称',
                        rules:[
                            {required:true,message:'请输入角色名称',trigger:'blur'},
                        ]
                    }),
                    new formItem.Input({
                        key: 'describe',
                        label: '描述',
                        inputType:'textarea',
                        rows:5,
                    }),
                ],
                menusList:[],
                treeProps:{
                    label:"name",
                },
                currentId:'',
                roleSetDialogVisible:false,
                userSetDialogVisible:false,
                userList: [],
                currentUserList: [],
            }
        },
        created(){
            // let {records}=await list_user({current:1,size:100})
            // this.userList=records.map(item=>{
            //     return {key:item.id,label:`账号： ${ item.mobile}；昵称： ${ item.nickName}`}
            // })
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
            add(row){
                let obj=row.id?row:{};
                let self=this;
                let title=row.id?'修改角色':'新增角色'
                this.$refs.addForm.openAlert(obj, {
                    title,
                    labelWidth: '100px',
                    closeOnClickModal: true,
                    beforeClose:async function (action, instance, done, form) {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            let error=false
                            if(obj.id){
                                form.id=obj.id
                                await update(form).catch(()=>{error=true;})
                            }
                            else{
                                await save(form).catch(()=>{error=true;})
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
                this.show(this.pageNo,this.$refs.searchForm.formData)
            },
            async handleRoleSet(row){
                this.currentId=row.id;
                this.roleSetDialogVisible=true;
                let selected = await find_resource_ids_by_role_id({id:this.currentId});
                this.menusList=  await list_menu();
                this.$refs.tree.setCheckedKeys(selected)
            },
            async handleRoleSetSubmit(){
                let vals=this.$refs.tree.getCheckedKeys()
                this.roleSetDialogVisible = false
                //更新
                await editRoleResource({id:this.currentId,resourceIds:vals.join()})
            },
            handleUserSet(row){
                this.currentId=row.id
                this.userSetDialogVisible=true
                this.$nextTick(async ()=>{
                    // let {records} = await list_user({current:1,size:100})
                    // this.userList=records.map(item=>{
                    //     return {key:item.id,label:`账号： ${ item.mobile}；昵称： ${ item.nickName}`}
                    // })
                    // let {records:recordsChoosed}=await listUserByRole({id:this.currentId,status:1,current:1,size:100})
                    // this.currentUserList=recordsChoosed.map(item=>{
                    //     return item.id
                    // })

                    let {records}= await listUserByRole({id:this.currentId,current:1,size:100})
                    this.userList=records.map(item=>{
                        return {key:item.id,label:`账号： ${ item.mobile}；昵称： ${ item.nickName}`}
                    })
                    this.currentUserList=records.filter(item=>item.assignFlag).map(item=>item.id)
                })
            },
            async handleUserSetSubmit(){
                await allocate_role_2_users({roleId:this.currentId,userIdList:this.currentUserList.join()})
                this.userSetDialogVisible=false
            }
        }
    }
</script>
<style lang="scss">
.role-set-form{
    width:600px;
    height: 500px;
    .el-tree{
        width:550px;
        height: 300px;

        overflow-y: scroll;
    }
}
.user-set-form {
    width: 800px;
    height:500px;
    .el-transfer-panel{
        width:300px;
    }
}
</style>
