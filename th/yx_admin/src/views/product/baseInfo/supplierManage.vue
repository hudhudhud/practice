<template>
    <section>
        <elm-form ref="searchForm" :config="configSearch" :formConfig="formConfig"  class="search-form"
                  @form-submit="search"
                  @form-cancel="resetSearch">
        </elm-form>
        <div>
            <el-button   type="primary" class="fr"  @click="add">新增供应商</el-button>
        </div>
        <base-table v-loading="loading" :columns="columns" :list="list"    @handleEdit='add'
                    @handleDelete="handleDelete"  @handleReturnAddress="handleReturnAddress" @handleTransTemplate="handleTransTemplate">
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

        <elm-alert-form ref="addForm" :config="supplierConfig">
        </elm-alert-form>
    </section>
</template>
<script>
    import * as formItem from "htadmin-form";
    import pageMix from '@/mixins/pagerList'
    import supplierConfig from "@/assets/formConfig/supplierConfig"
    import {list,add,update,view,del} from "@/service/module/supplier"
    export default{
        mixins:[pageMix],
        data(){
            return{
                configSearch:[
                    new formItem.Input({
                        key: 'name',
                        label: '供应商名称',
                    }),
                ],
                formConfig:{showCancelButton: true,cancelButtonText:'重置', confirmButtonText: '查询',inline:true},
                columns:[
                     { key: 'sn', title: '序号',type:"index"},
                    { key: 'name', title: '供应商名称'},
                    { key:'contact',title: '联系人'},
                    { key:'mobile',title: '联系电话',},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '编辑',emitKey: 'handleEdit'},
                            {name:'删除',emitKey:'handleDelete'},
                            {name: '退货地址',emitKey: 'handleReturnAddress'},
                            {name: '运费模板',emitKey: 'handleTransTemplate'},
                        ]
                    }
                ],
                supplierConfig,
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
                let title='新增供应商'
                if(row.id){
                    title='修改供应商'
                    obj =await view({id:row.id})
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
            handleReturnAddress(row){
                this.$router.push({name:'returnAddress',params:{id:row.id}})
            },
            handleTransTemplate(row){
                this.$router.push({name:'transTemplate',params:{id:row.id}})
            }

        }
    }
</script>
<style lang="scss" >
    .trans-template-form{
        width: 1000px;
        .temp-line{
            margin-top:10px;
            .el-input-number{
                width:120px;
                margin:0 10px;
            }
        }
        .area-fee{
            border:1px solid $borderColor;
            padding:5px;
            margin-top:10px;
        }
    }
</style>
