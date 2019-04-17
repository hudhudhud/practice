<template>
    <section>
        <elm-form ref="searchForm" :config="configSearch" :formConfig="formConfig"  class="search-form"
                  @form-submit="search"
                  @form-cancel="resetSearch">
        </elm-form>
        <div>
            <el-button   type="primary" class="fr"  @click="add">新增banner</el-button>
        </div>
        <base-table v-loading="loading" :columns="columns" :list="list"    @handleEdit='add'
                    @handleDelete="handleDelete"  @handlePub="handlePub" @handleUnPub="handleUnPub">
            <template slot-scope="{scope}" slot='file'>
                <img :src="scope.row.fileVo?scope.row.fileVo.url:''" alt="" class="row-img">
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

        <elm-alert-form ref="addForm" :config="addConfig">
        </elm-alert-form>
    </section>
</template>
<script>
    import * as formItem from "htadmin-form";
    import pageMix from '@/mixins/pagerList'
    import * as service from "@/service/module/banner";
    import {selectDown,fileUploadUrl} from "@/assets/const.js"
    export default{
        mixins:[pageMix],
        data(){
            return {
                configSearch:[
                    new formItem.Select({
                        key: 'released',
                        label: '上下架状态',
                        options:selectDown.releaseStatus
                    }),
                ],
                formConfig:{showCancelButton: true,cancelButtonText:'重置', confirmButtonText: '查询',inline:true},
                columns:[
                    { key: 'file', title: '图片',slot:'file'},
                    { key: 'released', title: '上架状态',format:selectDown.getLabel.bind(selectDown.releaseStatus)},
                    { key: 'url', title: '链接地址'},
                    { key: 'title', title: '标题'},
                    { key: 'sort', title: '顺序'},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '编辑',emitKey: 'handleEdit'},
                            {name: '上架',emitKey: 'handlePub',show:false, showKey:'released'},
                            {name: '下架',emitKey: 'handleUnPub',show:true, showKey:'released'},
                            {name:'删除',emitKey:'handleDelete'},
                        ]
                    }
                ],
                addConfig:[
                    new formItem.Input({
                        key: 'title',
                        label: '标题',
                        rules:[
                            {required:true,message:'请输入标题',trigger:'blur'},
                        ]
                    }),
                    new formItem.Select({
                        key: 'position',
                        label: '位置',
                        options:selectDown.bannerPosition,
                        rules:[
                            {required:true,message:'请选择位置',trigger:'blur'},
                        ]
                    }),
                    new formItem.UploadImg({
                        key: 'file',
                        label: '图片',
                        url:fileUploadUrl,
                        one:true,
                        rules:[
                            {required:true,message:'请上传图片',trigger:'blur'},
                        ]
                    }),
                    new formItem.Select({
                        key: 'released',
                        label: '上下架',
                        options:selectDown.releaseStatus,
                        rules:[
                            {required:true,message:'请选择上下架状态',trigger:'blur'},
                        ]
                    }),
                    new formItem.Input({
                        key: 'url',
                        label: '跳转地址',
                        rules:[
                            {required:true,message:'请输入跳转地址',trigger:'blur'},
                        ]
                    }),
                    new formItem.Input({
                        key: 'sort',
                        label: '排序',
                        rules:[
                            {required:true,message:'请输入排序',trigger:'blur'},
                            { pattern: /^[0-9]+$/, message: '请输入数字' },
                        ]
                    }),
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
                };
                if(query){
                    Object.assign(params,query)
                }
                let res = await service.list(params);
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
                this.show()
            },
            async add(row){
                let obj=row.id?row:{};
                let self=this;
                let title='新增banner'
                if(row.id){
                    title='修改banner'
                    obj =await service.view({id:row.id})
                    obj.file=obj.fileVo
                }
                this.$refs.addForm.openAlert(obj, {
                    title,
                    customClass:'banner-alert-form',
                    labelWidth: '100px',
                    closeOnClickModal: true,
                    beforeClose:async function (action, instance, done, form) {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            let error=false
                            let submitForm=JSON.parse(JSON.stringify(form))
                            if(form.file){
                                submitForm.fileId=form.file.id
                            }
                            delete submitForm.file
                            if(obj.id){
                                submitForm.id=obj.id
                                await service.update(submitForm).catch(()=>{error=true;})
                            }
                            else{
                                await service.add(submitForm).catch(()=>{error=true;})
                            }
                            instance.confirmButtonText='确定'
                            instance.confirmButtonLoading = false;
                            if(!error){
                                self.show(self.pageNo,self.$refs.searchForm.formData)
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
                if(row.id) {
                    await this.$confirm('是否确认删除', '提示', {type: 'warning'});
                    await service.del({id: row.id}, {successMsg: '删除成功'})
                    this.show(this.pageNo, this.$refs.searchForm.formData)
                }
            },
            async handlePub(row){
                if(row.id){
                    await  service.release_update({id:row.id,released:true},{successMsg: '上架成功！'})
                    this.show(this.pageNo,this.$refs.searchForm.formData)
                }
            },
            async handleUnPub(row){
                if(row.id) {
                    await service.release_update({id: row.id, released: false}, {successMsg: '下架成功！'})
                    this.show(this.pageNo, this.$refs.searchForm.formData)
                }
            }
        }
    }
</script>
<style>
.banner-alert-form{
    width:500px;
}
</style>
