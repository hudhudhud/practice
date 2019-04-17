<template>
    <section>
        <table class="detail_table">
            <tr>
                <td class="label">产品编号</td>
                <td>{{detail.skuId}}</td>
                <td class="label">更新时间</td>
                <td>{{detail.updatedAt}}</td>
            </tr>
            <tr>
                <td class="label">商品名字</td>
                <td>{{detail.productName}}</td>
                <td class="label">商品规格</td>
                <td>{{skuStr.replace(/[{}"]+/g,'')}}</td>
            </tr>
            <tr>
                <td class="label">库存余量</td>
                <td colspan="3">{{detail.sumQuantity}}</td>
            </tr>
        </table>
        <base-table  v-loading="loading" :columns="columns" :list="list" @sortChange="sortChange">
            <template slot="num" slot-scope="{scope}">
                {{scope.row.afterNumber - scope.row.beforeNumber}}
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
    </section>
</template>
<script>
    import pageMix from '@/mixins/pagerList'
    import {list_stock_flow,view_stock} from "@/service/module/product"
    export default{
        mixins:[pageMix],
        props:{
            id:{
                type:[String,Number],
            },
            skuStr:String
        },
        async created(){
            if(this.id){
                this.show(1)
                this.detail =await view_stock({id:this.id})
            }
        },
        data(){
            return {
                columns:[
                    {key: 'createdAt', title: '时间', sortable: 'custom',},
                    {key: '', title: '出库/入库数量',slot:'num'},
                    {key: 'afterNumber', title: '余量'},
                    {key: 'orderId', title: '订单编号'},
                    {key: 'remark', title: '备注'},
                ],
                detail:{},
                isShow:false
            }
        },
        methods:{
            async show(pageNo,query){
                if(!this.id)return
                this.beforeShow(pageNo)
                let params = {
                    current: this.pageNo,
                    size: this.pageSize,
                    id:this.id,
                };
                if(query){
                    Object.assign(params,query)
                }
                let res = await list_stock_flow(params);
                this.listSuccessCb(res)
            },
            //排序
            sortChange(column) {
                if(!column.prop)return
                let orderType={descending:false,ascending:true}
                let params={
                    orderByField:'ppsf.created_at',//后端说先写死.. column.prop
                    asc:orderType[column.order]
                }
                this.show(1,params)
            },
            // search(form){
            //     this.show(1,form)
            // },
            // resetSearch(){
            //     let newSet={}
            //     this.configSearch.forEach(item=>{
            //         newSet[item.key]=(item.type==='cascader')?[]:'';
            //     })
            //     this.$refs.searchForm.resetFormData(newSet)
            //     this.search()
            // },
        }
    }
</script>
