<template>
    <section>
        <elm-form ref="searchForm" :config="configSearch" :formConfig="formConfig" class="search-form"
                  @form-submit="search"
                  @form-cancel="resetSearch">
        </elm-form>
        <div class="clearfix">
            <el-button type="primary" @click="batchOpearte(batchPublish)" class="fl">批量上架</el-button>
            <el-button type="primary" @click="batchOpearte(batchUnPublish)" class="fl">批量下架</el-button>
            <el-button type="primary" @click="batchOpearte(batchDelete)" class="fl">批量删除</el-button>
            <el-button type="primary" @click="exportData" class="fr">导出商品</el-button>
            <el-button type="primary" @click="addNew" class="fr">新增商品</el-button>
        </div>

        <base-table v-loading="loading" :columns="columns" :list="list"
                    @handleEdit='handleEdit'
                    @selectionChange="selectionChange" @sortChange="sortChange"
                    @handleUnpublish="handleUnpublish" @handlePublish="handlePublish" @handleDelete="handleDelete">
            <template slot-scope="{scope}" slot='expand'>
                <base-table :columns="columnsExpand" :list="scope.row.skuStocks" @handleStock="handleStock"
                            @handleStockList="handleStockList"
                            @handleAward="handleAward"></base-table>
            </template>
            <template slot-scope="{scope}" slot='mainFile'>
                <div class="pro-detail">
                    <img :src="scope.row.mainFile?scope.row.mainFile.url:''" alt="" class="pro-img" v-if="scope.row.mainFile&&scope.row.mainFile.url">
                    <i class="fa fa-picture-o" aria-hidden="true" v-else title="无产品图片"></i>
                    <div class="detail">
                        <span>{{scope.row.name}}</span>
                        <span>{{scope.row.sn}}</span>
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
        <elm-alert-form ref="alertForm" :config="config"></elm-alert-form>
        <elm-alert-form ref="stockForm" :config="stockConfig">
        </elm-alert-form>
        <elm-alert-form ref="stockListForm" :config="stockListConfig">
            <template slot="stockList" slot-scope="{options}">
                <ProductStockLog :id="currentSkuRow.skuId" :skuStr="currentSkuRow.skuStr"/>
            </template>
        </elm-alert-form>

        <AwardFlowDialog :visible.sync="awardDialogVisible" :productId="currentSkuRow.productId" :skuId="currentSkuRow.skuId"/>
    </section>
</template>

<script>
    import * as formItem from "htadmin-form";
    import {selectDown} from "../../assets/const";
    import {list as list_catg} from "@/service/module/category";
    import {list as list_supplier} from "@/service/module/supplier";
    import pageMix from '@/mixins/pagerList'
    import * as service from '@/service/module/product'
    import ProductStockLog from '@/components/ProductStockLog'
    import AwardFlowDialog from "@/components/AwardFlowDialog"
    export default {
        name: "ElmTable",
        mixins: [pageMix],
        components:{
            ProductStockLog,
            AwardFlowDialog,
        },
        data: function () {
            return {
                stockListLoading: false,
                list: [],
                config: [
                    new formItem.SingDate({
                        key: 'date',
                        label: '日期'
                    }),
                    new formItem.Input({
                        key: 'string',
                        label: '名字',
                        rules: [
                            //    {required: true, message: '请输入活动名称', trigger: 'blur'},
                            //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                        ]
                    }),
                    new formItem.Input({
                        key: 'county',
                        label: '地址'
                    }),
                    new formItem.Input({
                        key: 'email',
                        label: '邮箱'
                    })
                ],
                configSearch: [
                    new formItem.Input({
                        key: 'name',
                        label: '商品名称'
                    }),
                    new formItem.Input({
                        key: 'sn',
                        label: '商品编号',
                    }),
                    new formItem.Select({
                        key: 'putawayStatus',
                        label: "状态",
                        options: selectDown.proStatus,
                        value: ''
                    }),
                    new formItem.Cascader({
                        key:'categoryId',
                        label:'商品类目',
                        options:list_catg(),
                        filterable:true,
                        // changeOnSelect:true,
                        remote:false,
                        labelKey:'name',
                        valueKey:'id',
                    }),
                ],
                formConfig: {showCancelButton: true, cancelButtonText: '重置', confirmButtonText: '查询', inline: true},
                columns: [
                    {type: 'selection'},
                    {key: '', title: '', type: 'expand', slot: 'expand',width:'50px'},
                    {key: 'mainFile', title: '商品名称',slot:'mainFile',width:'300px'},
                    {key: 'supplierName', title: '供应商名称'},
                    {key:'showStatus',title:'是否显示',format:(val)=>{
                        return val?'是':'否'
                        }},
                    {key: 'orderNumber', title: '排序值'},
                    {
                        key: 'putawayStatus', title: '状态', format:selectDown.getLabel.bind(selectDown.proStatus)
                    },
                    {key: 'path', title: '商品分类'},
                    {key: 'createdAt', title: '创建时间', sortable: 'custom'},
                    // { key:'',title: '自定义列',slot:'customer'},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '编辑', emitKey: 'handleEdit'},
                            {name: '下架', emitKey: 'handleUnpublish', show: true, showKey: 'putawayStatus'},
                            {name: '上架', emitKey: 'handlePublish', show: false, showKey: 'putawayStatus'},
                            {name: '删除', emitKey: 'handleDelete'}
                        ]
                    }
                ],
                columnsExpand: [
                    {key: 'skuStr', title: '商品名称',format:(val)=>{
                                 return val.replace(/[{}"]+/g,'')
                            }
                    },
                    {key: 'skuId', title: '规格码'},
                    {key: 'price', title: '售价'},
                    {key: 'quantity', title: '库存',sortable:true},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '奖励设置', emitKey: 'handleAward'},
                            {name: '库存管理', emitKey: 'handleStock'},
                            {name: '库存流水', emitKey: 'handleStockList'},
                        ]
                    }
                ],
                selectDown,
                batchSelect: [],
                stockConfig: [
                    new formItem.Select({
                        key: 'type',
                        label: '类型',
                        options:selectDown.stockType,
                        rules: [
                            {required: true, message: '请选择类型', trigger: 'blur'},
                        ],
                    }),
                    new formItem.Input({
                        key: 'quantity',
                        label: '数量',
                        rules: [
                            {required: true, message: '请输入数量', trigger: 'blur'},
                        ],
                    })
                ],
                stockListConfig: [
                    new formItem.CustomComponent({
                        key: 'stockList',
                        name: 'stockList',
                        label: '',
                    }) ],
                supplierOptions:[],
                currentSkuRow:{},
                searchParams:{},
                awardDialogVisible:false,
                awardDetail:[]
            }
        },
        created: async function () {
            let self=this
            this.configSearch.push(
                new formItem.Select({
                    key:'supplierId',
                    label:'供应商',
                    options:self.supplierOptions,
                    resKey:'records',
                    labelKey:'name',
                    valueKey:'id',
                    remote:true,
                    filterable:true,
                    services:list_supplier,
                    paramQueryName:'name',
                    otherParams:{current:1,size:10},
                    placeholder:'输入关键字搜索供应商',
                }),)
            let {records}=await list_supplier({current:1,size:10})
            this.supplierOptions.splice(0,0,...records)
        },
        methods: {
            async show(pageNo, otherParams) {
                this.beforeShow(pageNo)
                let params = {
                    current: this.pageNo,
                    size: this.pageSize,
                    ...otherParams
                };
                if(otherParams){
                    this.searchParams=otherParams
                }
                let res = await service.list(params);
                this.listSuccessCb(res)
            },
            //单行操作
            addNew() {
                this.$router.push('/product/productManage/add')
            },
            handleEdit: function (e) {
                this.$router.push('/product/productManage/edit/' + e.id)
            },
            async handleUnpublish(e) {
                await this.$confirm('确认下架该商品', '提示', {type: 'warning'});
                await service.put_off({id: e.id}, {successMsg: '操作成功'});
                this.show(this.pageNo);
            },
            async handlePublish(e) {
                await this.$confirm('确认上架该商品', '提示', {type: 'warning'});
                await service.put_on({id: e.id}, {successMsg: '操作成功'});
                this.show(this.pageNo);
            },
            async handleDelete(e) {
                await this.$confirm('确认删除该商品', '提示', {type: 'warning'});
                await service.del({id: e.id}, {successMsg: '删除成功'})
                this.show(this.pageNo);
            },
            search(data) {
                let sendForm=JSON.parse(JSON.stringify(data))
                if(data.categoryId&&data.categoryId.length){
                    sendForm.categoryId=data.categoryId[data.categoryId.length-1]
                }
                this.show(1, sendForm);
            },
            async resetSearch() {
                let newSet = {}
                this.configSearch.forEach(item => {
                    newSet[item.key] = (item.type === 'cascader') ? [] : '';
                })
                this.$refs.searchForm.resetFormData(newSet)
                this.show(1)
                //初始化供应商的数据源，以防因为搜索而丢失初始化数据源
                let {records}=await list_supplier({current:1,size:10})
                this.supplierOptions.splice(0,this.supplierOptions.length,...records)
            },
            async exportData() {
                if (this.batchSelect && this.batchSelect.length > 0){
                    Object.assign(this.searchParams,{ids:this.batchSelect.map(({id})=>id).join()})
                }
                let data =await  service.export2Excel(this.searchParams)
                let url = URL.createObjectURL(new Blob([data]))
                let a=document.createElement('a')
                a.download='商品列表.xls'
                a.href=url
                a.click()
            },
            //排序
            sortChange(column) {
                if(!column.prop)return
                let orderType={descending:false,ascending:true}
                let params={
                    orderByField:'pp.created_at',//后端说先写死.. column.prop
                    asc:orderType[column.order]
                }
                this.show(1,params)
            },
            //批量操作
            selectionChange(rows) {
                this.batchSelect = rows
            },
            batchOpearte(func) {
                if (this.batchSelect && this.batchSelect.length > 0) {
                    if (typeof func === 'function')
                        func()
                }
                else {
                    this.$message({
                        message: '请选择要操作的数据！',
                        type: 'error'
                    });
                }
            },
            async batchPublish() {
                await this.$confirm('确认批量上架?', '提示', {type: 'warning'})
                await service.batch_put_on({ids: this.batchSelect.map(i => i.id).join(',')},{successMsg:'批量上架成功！'});
                this.show(this.pageNo)
            },
            async batchUnPublish() {
                await this.$confirm('确认批量下架?', '提示', {type: 'warning'})
                await service.batch_put_off({ids: this.batchSelect.map(i => i.id).join(',')},{successMsg:'批量下架成功！'});
                this.show(this.pageNo)
            },
            async batchDelete() {
                await this.$confirm('确认批量删除?', '提示', {type: 'warning'})
                await service.batch_delete({ids: this.batchSelect.map(i => i.id).join(',')},{successMsg:'批量删除成功！'});
                this.show(this.pageNo)
            },
            //库存
            handleStock(row) {
                let self=this
                this.$refs.stockForm.openAlert({}, {
                    title: '修改库存',
                    labelWidth: '100px',
                    closeOnClickModal: true,
                    beforeClose: async function (action, instance, done, form) {
                        let  quantity;
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            let error=false
                            form.skuId=row.skuId

                            if(form.type===1){
                                quantity = await service.out_stock(form,{successMsg:'出库成功！'}).catch(()=>{error=true;})
                            }
                            else{
                                quantity = await service.in_stock(form,{successMsg:'入库成功！'}).catch(()=>{error=true;})
                            }
                            instance.confirmButtonText='确定'
                            instance.confirmButtonLoading = false;
                            if(!error){
                                //self.show(self.pageNo,self.$refs.searchForm.formData)
                                done();
                                self.list.find(item=>item.id===row.productId).skuStocks.find(item=>item.skuId===row.skuId).quantity=quantity
                            }
                        } else {
                            instance.confirmButtonLoading = false;
                            done();
                        }
                    }
                });
            },
            handleStockList(row) {
                this.currentSkuRow=row
                this.$refs.stockListForm.openAlert({}, {
                    title: '商品库存流水',
                    closeOnClickModal: true,
                    customClass:'stock-template-form',
                    showConfirmButton:false,
                    cancelButtonText:'关闭'
                });
            },
            //奖励设置
           async handleAward(row){
               this.awardDialogVisible=true
               this.currentSkuRow=row
               // this.awardDetail.productId=row.productId
               // this.awardDetail.skuId=row.skuId
            },
        }
    }
</script>

<style scoped lang="scss">
    .customer {
        @include clearfix;
        .right {
            @include fr;
        }
        .left {
            @include fl;
            width: 20px;
        }
    }
    .pro-img{
        width:50px;
        height: 50px;
    }
    #myDiagramDiv{
        width:500px;
        height: 500px;
    }
    .pro-detail{
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
<style>
    .stock-template-form {
        width: 1000px;
    }

</style>
