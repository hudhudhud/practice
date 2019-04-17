<template>
   <section>
       <elm-form ref="searchForm" :config="configSearch" :formConfig="formConfig"  class="search-form"
                 @form-submit="search"
                 @form-cancel="resetSearch">
       </elm-form>
       <div>
           <el-button  type="primary" class="fr"  @click="add">新增标签</el-button>
       </div>
       <base-table v-loading="loading" :columns="columns" :list="list" @handleEdit='add' @handleDelete="handleDelete" >
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
    import {list,add,update,view,del} from "@/service/module/tag"
    import {selectDown} from "@/assets/const"
    export default{
        mixins:[pageMix],
        data(){
            return {
                configSearch:[
                    new formItem.Input({
                        key: 'name',
                        label: '标签名称',
                    }),
                    new formItem.Select({
                        key: 'type',
                        label: '标签类型',
                        options: selectDown.tagType,
                    }),
                ],
                formConfig:{showCancelButton: true,cancelButtonText:'重置', confirmButtonText: '查询',inline:true},
                addConfig:[
                    new formItem.Select({
                        key: 'type',
                        label: '标签类型',
                        options: selectDown.tagType,
                        value:1,
                        rules: [
                             {required: true, message: '请选择标签类型', trigger: 'blur'},
                        ],
                    }),
                    new formItem.Input({
                        key: 'name',
                        label: '标签名称',
                        rules: [
                            {required: true, message: '请输入标签名称', trigger: 'blur'},
                        ]
                    }),
                ],
                columns:[
                    { key: 'type', title: '标签类型',format:selectDown.getLabel.bind(selectDown.tagType)},
                    { key: 'name', title: '标签名'},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '编辑',emitKey: 'handleEdit'},
                            {name:'删除',emitKey:'handleDelete'},
                        ]
                    }
                ],
                selectDown,
            }
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
                this.search()
            },
            async add(row){
                let obj=row.id?row:{};
                let self=this;
                let title='新增标签'
                if(row.id){
                    title='修改标签'
                }
                this.$refs.addForm.openAlert(obj, {
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
        }
    }
</script>
