<template>
    <section>
        <base-table  v-loading="loading" :columns="columns" :list="list">
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
    </section>
</template>
<script>
    import pageMix from '@/mixins/pagerList'
    import {list_rank} from "@/service/module/member"
    import {selectDown} from "@/assets/const"
    export default{
        mixins:[pageMix],
        props:{
            id:{
                type:[String,Number],
            }
        },
        watch:{
            id(val){
                if(val){
                    this.show(1)
                }
            }
        },
        data(){
            return {
                columns:[
                    { key: '', title: '序号',type:'index'},
                    { key: 'type', title: '类型'},
                    { key: 'time', title: '时间'},
                    { key: 'content', title: '内容'},
                    { key: 'remark', title: '原因'},
                ],
                selectDown,
            }
        },
        methods:{
            async show(pageNo,query){
                if(!this.id)return
                this.beforeShow(pageNo)
                let params = {
                    current: this.pageNo,
                    size: this.pageSize,
                    userId:this.id,
                };
                if(query){
                    Object.assign(params,query)
                }
                let res = await list_rank(params);
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
        }
    }
</script>
