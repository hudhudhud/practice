<template>
    <section>
        <elm-form ref="searchForm" :config="configSearch" :formConfig="formConfig"  class="search-form"
                  @form-submit="search"
                  @form-cancel="resetSearch">
        </elm-form>
        <div>
            <el-button   type="primary" class="fr"  @click="addSpec">新增规格</el-button>
        </div>
        <base-table v-loading="loading" :columns="columns" :list="list"    @handleEdit='addSpec'
                     @handleDelete="handleDelete"  @handleEditDetail="handleEditDetail">
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

        <elm-alert-form ref="addSpecForm" :config="addSpecConfig">
        </elm-alert-form>

        <!--规格值-->
        <el-dialog title="规格值编辑"  :visible.sync="valuesDialogVisible"  custom-class="value-set-form">
            <el-button   type="primary" class="fr"  @click="addValue">新增规格值</el-button>
            <base-table :columns="valueColumns" :list="valueList" @handleEdit="addValue" @handleDelete="deleteValue" >
            </base-table>
        </el-dialog>
        <elm-alert-form ref="addValueForm" :config="addValueConfig">
        </elm-alert-form>
    </section>
</template>
<script>
    import * as formItem from "htadmin-form";
    import pageMix from '@/mixins/pagerList'
    import Tag from '@/components/Tag'
    import {list,add,update,del,find_by_parent_id} from '@/service/module/spec'
    export default{
        mixins:[pageMix],
        components:{
            'myTag':Tag,
        },
        data(){
            return {
                configSearch:[
                    new formItem.Input({
                        key: 'name',
                        label: '规格名称',
                    }),
                ],
                formConfig:{showCancelButton: true,cancelButtonText:'重置', confirmButtonText: '查询',inline:true},
                columns:[
                    { key: 'name', title: '规格名称'},
                    { key:'value',title: '规格值',},
                    { key:'createTime',title: '创建时间',},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '编辑',emitKey: 'handleEdit'},
                            {name:'删除',emitKey:'handleDelete'},
                            {name: '管理规格值',emitKey: 'handleEditDetail'},
                        ]
                    }
                ],
                valueColumns:[
                    { key: 'name', title: '规格值'},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '编辑',emitKey: 'handleEdit'},
                            {name:'删除',emitKey:'handleDelete'},
                        ]
                    }],
                addSpecConfig:[
                    new formItem.Input({
                        key: 'name',
                        label: '规格名称',
                        rules:[
                            {required: true, message: '请输入规格名称', trigger: 'blur'},
                        ]
                    }),
                ],
                addValueConfig:[
                    new formItem.Input({
                        key: 'name',
                        label: '规格值',
                        rules:[
                            {required: true, message: '请输入规格值', trigger: 'blur'},
                        ]
                    }),
                ],
                editDetailConfig:[
                    new formItem.CustomComponent({
                        key:'specValues',
                        name: 'specValues',
                        label: '商品规格值',
                    }),
                ],
                currentRow:{},
                valueList:[],
                valuesDialogVisible:false,
            }
        },
        created(){
          //this.list=list
        },
        methods:{
            async show(pageNo,form){
                this.beforeShow(pageNo)
                let params = {
                    current: this.pageNo,
                    size: this.pageSize,
                };
                if(form){
                    Object.assign(params,form)
                }
                let res =await list(params)//Promise.resolve({list:[{name:'颜色',values:['红','绿']}]});
                this.listSuccessCb(res)
            },
            search(form){
                this.show(this.pageNo,form)
            },
            resetSearch(){
                let newSet={}
                this.configSearch.forEach(item=>{
                    newSet[item.key]=(item.type==='cascader')?[]:'';
                })
                this.$refs.searchForm.resetFormData(newSet)
                this.search()
            },
            addSpec(row){
                let obj=row?row:{};
                let self=this;
                let title=row.id?'修改规格':'新增规格'
                this.$refs.addSpecForm.openAlert(obj, {
                    title,
                    labelWidth: '80px',
                    closeOnClickModal: true,
                    beforeClose: async function (action, instance, done, form) {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            let error=false
                            if(obj.id){
                                form.id=obj.id
                                await update(form).catch(()=>{error=true;})
                            }
                            else{
                                await add(form).catch(()=>{error=true;})
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
            //规格值操作
            async handleEditDetail(row){
                this.currentRow=row
                let {childSpecs}=await find_by_parent_id({id:this.currentRow.id})
                this.valueList=childSpecs
                this.valuesDialogVisible=true
            },
            addValue(row){
                let obj=row?row:{};
                let self=this;
                let title=row.id?'修改规格值':'新增规格值'
                this.$refs.addValueForm.openAlert(obj, {
                    title,
                    labelWidth: '80px',
                    closeOnClickModal: true,
                    beforeClose: async function (action, instance, done, form) {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            let error=false
                            form.parentId=self.currentRow.id
                            if(obj.id){
                                form.id=obj.id
                                await update(form).catch(()=>{error=true;})
                            }
                            else{
                                await add(form).catch(()=>{error=true;})
                            }
                            instance.confirmButtonText='确定'
                            instance.confirmButtonLoading = false;
                            if(!error){
                                self.refreshValuesList.apply(self)
                                done();
                            }
                        } else {
                            instance.confirmButtonLoading = false;
                            done();
                        }
                    }
                });
            },
            deleteValue(row){
                let self=this
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await del({id:row.id})
                    this.refreshValuesList.apply(self)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            async refreshValuesList(){
                let {childSpecs}=await find_by_parent_id({id:this.currentRow.id})
                this.valueList=childSpecs
                this.show(this.pageNo,this.$refs.searchForm.formData)
            }
        }
    }
</script>
