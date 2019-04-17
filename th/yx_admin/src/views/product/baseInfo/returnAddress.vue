<template>
    <section>
        <div>
            <el-button   type="primary" class="fr"  @click="add">新建地址</el-button>
        </div>
        <base-table v-loading="loading" :columns="columns" :list="list"    @handleEdit='add'
                    @handleDelete="handleDelete"  @handleSetDefault="handleSetDefault"  @handleCancelDefault="handleCancelDefault">
            <template slot-scope="{scope}" slot='address'>
               <span>{{scope.row.zone+scope.row.street}}</span>
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
        <elm-alert-form ref="addForm" :config="returnAddressConfig">
        </elm-alert-form>
    </section>
</template>
<script>
    import pageMix from '@/mixins/pagerList'
    import {list,add,del,update,view,set_default,cancel_default} from "@/service/module/supplierAddress"
    import returnAddressConfig  from "@/assets/formConfig/returnAddressConfig"

    export default{
            mixins:[pageMix],
            data(){
                return {
                    columns:[
                        { key: 'id', title: '地址编号'},
                        { key:'street',title: '退货地址',slot:'address'},
                        { key:'contact',title: '收货人',},
                        {
                            title: '操作', type: 'operate',
                            operates: [
                                {name: '编辑',emitKey: 'handleEdit'},
                                {name: '设为默认',emitKey: 'handleSetDefault',show:false,showKey:'defaultStatus'},
                                {name: '取消默认',emitKey: 'handleCancelDefault',show:true,showKey:'defaultStatus'},
                                {name:'删除',emitKey:'handleDelete'},
                            ]
                        }
                    ],
                    returnAddressConfig,
                    supplierId:''
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
                    let obj=row.id?row:{};
                    let self=this;
                    let title='新增退货地址'
                    if(row.id){
                        title='修改退货地址'
                        obj =await view({id:row.id})
                        //obj.districtId=[39,64,66]
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
                                let formSend=JSON.parse(JSON.stringify(form))
                                if(formSend.districtIds&&formSend.districtIds.length){
                                    formSend.districtId=formSend.districtIds[formSend.districtIds.length-1]
                                }
                                delete formSend.districtIds
                                formSend.defaultStatus=formSend.defaultStatus?1:0
                                formSend.supplierId=self.supplierId
                                if(obj.id){
                                    formSend.id=obj.id
                                    await update(formSend).catch(()=>{error=true;})
                                }
                                else{
                                    await add(formSend).catch(()=>{error=true;})
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
                    await this.$confirm('确认删除该退货地址', '提示', {type: 'warning'});
                    await del({id:row.id}, {successMsg: '删除成功'})
                    this.show(this.pageNo)
                },
                async handleSetDefault(row){
                    await set_default({id:row.id})
                    this.show(this.pageNo)
                },
                async handleCancelDefault(row){
                    await cancel_default({id:row.id})
                    this.show(this.pageNo)
                },
            }
    }
</script>
