<template>
    <el-dialog  :visible.sync="isShow" @closed="cancel">
        <elm-form ref="searchForm" :config="configSearch" :formConfig="formConfig"  class="search-form"
                  @form-submit="search"
                  @form-cancel="resetSearch">
        </elm-form>
        <el-button type="primary" @click="batchOpearte" class="fl">确认选择</el-button>
        <base-table v-loading="loading" :columns="columns" :list="list" @selectionChange="selectionChange" >
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
    </el-dialog>
</template>
<script>
    import * as formItem from "htadmin-form";
    import pageMix from '@/mixins/pagerList'
    import {list,add,update,view,del} from "@/service/module/tag"
    import {selectDown} from "@/assets/const"
    export default{
        props:{
            visible:Boolean
        },
        mixins:[pageMix],
        watch:{
            visible:{
                handler(val){
                    this.isShow=val
                    if(val){
                        this.show()
                    }
                },
                immediate:true,
            }
        },
        data(){
            return {
                isShow:false,
                batchSelect:[],
                configSearch:[
                    new formItem.Input({
                        key: 'name',
                        label: '标签名称',
                    }),
                ],
                formConfig:{showCancelButton: true,cancelButtonText:'重置', confirmButtonText: '查询',inline:true},
                columns:[
                    {type: 'selection'},
                    { key: 'name', title: '标签名'},
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
                    type: 1
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
            cancel(){
                this.isShow=false
                this.$emit('update:visible',this.isShow)
            },
            selectionChange(rows) {
                this.batchSelect = rows
            },
            batchOpearte() {
                if (this.batchSelect && this.batchSelect.length > 0) {
                    this.$emit('pushHelTagFromChoose',this.batchSelect)
                    this.isShow=false
                    this.$emit('update:visible',this.isShow)
                }
                else {
                    this.$message({
                        message: '请选择要操作的数据！',
                        type: 'error'
                    });
                }
            },
        }
    }
</script>
