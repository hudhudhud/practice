<template>
    <section class="trans-template">
        <div>
            <el-button   type="primary" class="fr"  @click="add">新建运费模板</el-button>
        </div>
        <base-table v-loading="loading" :columns="columns" :list="list"    @handleEdit='add'
                    @handleDelete="handleDelete"  @handleSetDefault="handleSetDefault">
            <template slot-scope="{scope}" slot='type'>
                <span>{{"按照件数"}}</span>
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
        <AddTransTemplate :id="currentRow.id"  ref="addForm"/>
    </section>
</template>
<script>
    import pageMix from '@/mixins/pagerList'
    import AddTransTemplate from "@/components/AddTransTemplate"
    import {list,add,del,update,view,check_used,set_default,cancel_default} from "@/service/module/transTemplate"
    export default{
        mixins:[pageMix],
        components:{
            AddTransTemplate,
        },
        data(){
            return {
                columns:[
                    { key: 'name', title: '模板名称'},
                    { key:'',title: '寄件方式',slot:'type'},
                    { key:'defaultDescribe',title: '默认运费',},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '设为默认',emitKey: 'handleSetDefault',show:false,showKey:'byDefault'},
                            {name: '取消默认',emitKey: 'handleSetDefault',show:true,showKey:'byDefault'},
                            {name: '编辑',emitKey: 'handleEdit'},
                            {name:'删除',emitKey:'handleDelete'},
                        ]
                    }
                ],
                currentRow:{}
            }
        },
        methods:{
            async show(pageNo){
                this.supplierId=this.$route.params.id
                this.beforeShow(pageNo)
                let params = {
                    current: this.pageNo,
                    size: this.pageSize,
                    supplierId:this.supplierId
                };
                let res = await list(params);
                this.listSuccessCb(res)
            },
            async add(row){
                let self=this;
                let obj=row.id?row:{};
                if(!obj.address){
                    obj.address=[]
                }
                let title='新增运费模板'
                if(row.id){
                    title='修改运费模板'
                    //obj =await view({id:row.id})
                    obj['noDeliverDistrictIdList']=self.$refs.addForm.noAddressIdList//保证连续点击同一条数据时，因为组件中id未发生变化而没有重新绑定
                }
                this.currentRow=obj
                this.$refs.addForm.$refs.addForm.openAlert(obj, {
                    title:'运费模板',
                    customClass:'trans-template-form',
                    labelWidth: '100px',
                    closeOnClickModal: true,
                    beforeClose:async function (action, instance, done, form) {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            let error=false
                            let sendForm={}
                            sendForm.supplierId=self.supplierId
                            sendForm.name=form.name
                            let feeList=Array.of(self.$refs.addForm.defaultFee,...self.$refs.addForm.otherFeeList)
                            sendForm.postageTemplateDetail=JSON.stringify(feeList)
                            if(form.noDeliverDistrictIdList){
                                sendForm.noDeliverDistrictIdList=form.noDeliverDistrictIdList.join()
                            }
                            if(obj.id){
                                sendForm.id=obj.id
                                await update(sendForm).catch(()=>{error=true;})
                            }
                            else{
                                await add(sendForm).catch(()=>{error=true;})
                            }
                            instance.confirmButtonText='确定'
                            instance.confirmButtonLoading = false;
                            if(!error){
                                self.show(self.pageNo)
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
                //检查是否有商品用该模板，有则弹框提示
                let res = await check_used({id:row.id})
                let msg='是否确认删除'
                if(res.msg){
                    msg='该运费模板正在被使用，若被删除则商品的运费模板自动取消，是否确认删除?'
                }

                await this.$confirm(msg, '提示', {type: 'warning'});
                await del({id:row.id}, {successMsg: '删除成功'})
                this.show(this.pageNo)
            },
            async handleSetDefault(row){
                await set_default({id:row.id,byDefault:!row.byDefault})
                this.show(this.pageNo)
            },
        }

    }
</script>

