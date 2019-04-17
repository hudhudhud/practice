<template>
    <section>
        <base-table   :columns="columns" :list="list">
        </base-table>
        <!--<div class="pagination" v-if="list&&list.length">-->
            <!--<el-pagination-->
                    <!--background-->
                    <!--:current-page='pageNo'-->
                    <!--@current-change="show"-->
                    <!--class="pages"-->
                    <!--:page-size="pageSize"-->
                    <!--:layout="pageLayout"-->
                    <!--:total="pageTotal">-->
            <!--</el-pagination>-->
        <!--</div>-->
    </section>
</template>
<script>
    import pageMix from '@/mixins/pagerList'
    import {fing_by_invite_id,fing_by_parent_id,fing_by_team} from "@/service/module/member"
    export default{
        mixins:[pageMix],
        props:{
            id:{
                type:[String,Number],
                required:true,
            },
            teamType:{
                type:String,
                required:true,
            }
        },
        watch:{
            id(val){
                if(val){
                    this.show(1)
                }
            },
            teamType(val){
                if(val){
                    this.show(1)
                }
            }
        },
        data(){
            return {
                columns:[
                    { key: 'sn', title: '会员编号'},
                    { key: 'nickName', title: '昵称'},
                    { key: 'rankName', title: '会员等级'},
                    { key: 'registerTime', title: '注册时间'},
                ],
                getDataMethod:{
                    inviteNumber:fing_by_invite_id,
                    parentNumber:fing_by_parent_id,
                    teamNumber:fing_by_team,
                }
            }
        },
        methods:{
            async show(pageNo,query){
                if(!this.id)return
                //this.beforeShow(pageNo)
                let params = {
                    // current: this.pageNo,
                    // size: this.pageSize,
                    id:this.id,
                };
                if(query){
                    Object.assign(params,query)
                }
                this.list = await this.getDataMethod[this.teamType](params);
                //this.listSuccessCb(res)
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
