<template>
    <section>
        <el-form ref="form"  label-width="80px">
            <el-form-item label="资产类型">
                <el-select  v-model="accountType" placeholder="请选择资产类型" @change="show" >
                    <el-option
                            v-for="item in selectDown.accountType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
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
    import {list_account_log} from "@/service/module/member"
    import {selectDown} from "@/assets/const"
    export default{
        mixins:[pageMix],
        props:{
            id:{
                type:[String,Number],
            },
        },
        watch:{
            id(val){
                if(val){
                    this.show(1)
                }
            },
        },
        data(){
            return {
                accountType:0,//0代表结算，1代表用户账户
                columns:[
                    { key: 'currency', title: '资产'},
                    { key: 'describe', title: '变动'},
                    { key: 'number', title: '金额'},
                    { key: 'changeTime', title: '变动时间'},
                    { key: 'type', title: '变动类型'},
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
                    type:this.accountType,
                    id:this.id,
                };
                if(query){
                    Object.assign(params,query)
                }
                let res = await list_account_log(params);
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
