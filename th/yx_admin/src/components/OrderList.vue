<template>
    <section>
        <elm-form ref="searchForm" :config="configSearch" :formConfig="formConfig"  class="search-form"
                  @form-submit="search"
                  @form-cancel="resetSearch">
        </elm-form>
        <!--<div>-->
            <!--<el-button   type="primary" class="fr"  @click="exportData">导出订单</el-button>-->
            <!--<el-button   type="primary" class="fr"  @click="delivery">订单发货</el-button>-->
        <!--</div>-->
        <base-table v-loading="loading" :columns="columns" :list="list"    @handleEdit='handleEdit' >
             <template  slot-scope="{scope}" slot='orderNo'>
                 <span>{{scope.row.sn+'-'+scope.row.supplierSn}}</span>
             </template>
             <template  slot-scope="{scope}" slot='memberInfo'>
                 <a href="javascript:void(0)" @click="goMemberDetail(scope.row.userId)" title="点击查看该会员详情">
                     <p>{{scope.row.orderMainUserVo.name+';'}} </p>
                     <p>{{scope.row.orderMainUserVo.sn+'（会员编号）;'}} </p>
                     <p>{{scope.row.orderMainUserVo.rankName}} </p>
                 </a>
             </template>
            <template slot-scope="{scope}" slot='specInfo'>
                <div v-for="item in scope.row.orderMainDetailVoList" class="order-detail">
                    <img :src="item.productImage" alt="" class="row-img fl" v-if="item.productImage">
                    <i class="fa fa-picture-o fl" aria-hidden="true"  v-else title="无产品图片"></i>
                    <div class="detail">
                        <p>{{item.productTitle}}</p>
                        <p>{{item.productSpecName}}</p>
                        <p>{{item.quantity}}</p>
                    </div>
                </div>
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
    import * as formItem from "htadmin-form";
    import pageMix from '@/mixins/pagerList'
    import {list} from "@/service/module/order";
    import {list as list_supplier} from "@/service/module/supplier";
    import {selectDown} from "@/assets/const.js"
    export  default {
        mixins:[pageMix],
        props:{
            // origin:{
            //     type:String,
            //     required:true,
            // }
        },
        data(){
            return {
                configSearch:[
                    new formItem.Input({
                        key: 'sn',
                        label: '订单编号',
                    }),
                    new formItem.Input({
                        key: 'productSn',
                        label: '商品编号',
                    }),
                    new formItem.Input({
                        key: 'productTitle',
                        label: '商品名称',
                    }),
                    new formItem.Input({
                        key: 'nickName',
                        label: '会员昵称',
                    }),
                    new formItem.Input({
                        key: 'userSn',
                        label: '会员编号',
                    }),
                    new formItem.SingDate({
                        key: 'createOrderTimeBegin',
                        label: '下单时间',
                        format:'yyyy-MM-dd HH:mm:ss',
                        valueFormat:'yyyy-MM-dd HH:mm:ss',
                    }),
                    new formItem.SingDate({
                        key: 'createOrderTimeEnd',
                        label: '-',
                        format:'yyyy-MM-dd HH:mm:ss',
                        valueFormat:'yyyy-MM-dd HH:mm:ss',
                    }),
                    new formItem.Select({
                        key: 'status',
                        label: '订单状态',
                        options:selectDown.orderStatus
                    }),
                ],
                formConfig:{showCancelButton: true,cancelButtonText:'重置', confirmButtonText: '查询',inline:true},
                columns:[
                    { key: '', title: '订单号',slot:'orderNo',width:'200px'},//主单号+供应商编号
                    { key: '', title: '商品信息',slot:'specInfo',width:'250px'},
                    { key: 'orderMainUserVo', title: '买家会员',slot:'memberInfo',width:'250px'},
                    { key: 'statusName', title: '订单状态',},
                    { key: 'amount', title: '订单金额'},
                    { key: 'userAmount', title: '实付金额'},
                    { key: 'supplierName', title: '供应商'},
                    { key: 'userRemark', title: '买家留言'},
                    { key: 'createTime', title: '下单时间'},
                    { key: 'updateTime', title: '更新时间'},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '操作订单',emitKey: 'handleEdit'},
                        ]
                    }
                ],
                supplierOptions:[]
            }
        },
        created: async function () {
            let self=this
            this.configSearch.push(
                new formItem.Select({
                    key:'supplierSn',
                    label:'供应商',
                    options:self.supplierOptions,
                    resKey:'records',
                    labelKey:'name',
                    valueKey:'sn',
                    remote:true,
                    filterable:true,
                    services:list_supplier,
                    paramQueryName:'name',
                    otherParams:{current:1,size:10},
                }),)
            let {records}=await list_supplier({current:1,size:10})
            this.supplierOptions.splice(0,0,...records)
        },
        methods:{
            async show(pageNo,query){
                this.beforeShow(pageNo)
                let params = {
                    current: this.pageNo,
                    size: this.pageSize,
                    //origin:this.origin
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
           async resetSearch(){
                let newSet={}
                this.configSearch.forEach(item=>{
                    newSet[item.key]=(item.type==='cascader')?[]:'';
                })
                this.$refs.searchForm.resetFormData(newSet)
                this.show()

                //初始化供应商的数据源，以防因为搜索而丢失初始化数据源
                let {records}=await list_supplier({current:1,size:10})
                this.supplierOptions.splice(0,this.supplierOptions.length,...records)
            },
            handleEdit(row){
                this.$router.push('/order/edit/'+row.id)
            },
            exportData(){

            },
            goMemberDetail(userId){
                let {href} = this.$router.resolve({
                    name: 'memberEdit',
                    params: {id:userId}
                })
                window.open(href,'_blank')
            }
        }
    }
</script>
<style lang="scss" scoped>
    .fa.fa-picture-o{
        font-size:45px;
    }
    .order-detail{
        display:flex;
        flex-direction: row;
        .detail{
            margin-left:5px;
            display:flex;
            flex-direction: column;
            align-items:stretch;
        }
    }
</style>
