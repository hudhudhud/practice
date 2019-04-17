<template>
    <section>
        <elm-form ref="searchForm" :config="configSearch" :formConfig="formConfig"  class="search-form"
                  @form-submit="search"
                  @form-cancel="resetSearch">
        </elm-form>
        <base-table  v-loading="loading" :columns="columns" @handleViewOrder="handleView" :list="list">
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
    import {list_order_detail} from "@/service/module/order"
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
                formConfig:{showCancelButton: true,cancelButtonText:'重置', confirmButtonText: '查询',inline:true,},//size:'mini'
                columns:[
                    { key: 'orderMainSn', title: '主单编号'},
                    { key: 'sn', title: '子单编号'},
                    { key:'productSn',title: '商品编号'},
                    { key:'productTitle',title: '商品名称',},
                    { key:'orderTypeName',title: '订单类型',},
                    { key:'orderStatus',title: '订单状态',format:selectDown.getLabel.bind(selectDown.orderStatus)},
                    { key:'amount',title: '订单金额',},
                    { key:'createTime',title: '下单时间'},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '查看',emitKey: 'handleViewOrder'},
                        ]
                    }
                ],
                configSearch:[
                    new formItem.Input({
                        key: 'orderMainSn',
                        label: '主单编号',
                    }),
                    new formItem.Input({
                        key: 'sn',
                        label: '子单编号',
                    }),
                    new formItem.Input({
                        key: 'productSn',
                        label: '商品编号',
                    }),
                    new formItem.Input({
                        key: 'productName',
                        label: '商品名称',
                    }),
                    new formItem.Select({
                        key: 'orderStatus',
                        label: '订单状态',
                        options:selectDown.orderStatus
                    }),
                    new formItem.SingDate({
                        key: 'createOderTimeBegin',
                        label: '下单时间',
                        format:'yyyy-MM-dd HH:mm:ss',
                        valueFormat:'yyyy-MM-dd HH:mm:ss',
                    }),
                    new formItem.SingDate({
                        key: 'createOderTimeEnd',
                        label: '-',
                        format:'yyyy-MM-dd HH:mm:ss',
                        valueFormat:'yyyy-MM-dd HH:mm:ss',
                    }),
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
                    id:this.id,
                };
                if(query){
                    Object.assign(params,query)
                }
                let res = await list_order_detail(params);
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
            handleView(row){
                let {href} = this.$router.resolve({
                    name: 'orderEdit',
                    params: {id:row.id}
                })
                window.open(href,'_blank')
            }
        }
    }
</script>
