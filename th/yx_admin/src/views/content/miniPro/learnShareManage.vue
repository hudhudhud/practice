<template>
    <section>
        <elm-form ref="searchForm" :config="configSearch" :formConfig="formConfig"  class="search-form"
                  @form-submit="search"
                  @form-cancel="resetSearch">
        </elm-form>
        <div>
            <el-button   type="primary" class="fr"  @click="add">新增文章</el-button>
        </div>
        <base-table v-loading="loading" :columns="columns" :list="list"    @handleEdit='add'
                    @handleDelete="handleDelete"  @handlePub="handlePub" @handleUnPub="handleUnPub">
            <template slot-scope="{scope}" slot='file'>
                <img :src="scope.row.file?scope.row.fileVo.url:''" alt="" class="row-img">
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
            <!--<template slot="editor" >-->
                <!--<div>-->
                    <!--<Tinymce ref="editor" :height="200" v-model="editorContext" />-->
                <!--</div>-->
            <!--</template>-->
        </elm-alert-form>
    </section>
</template>
<script>
    import * as formItem from "htadmin-form";
    import pageMix from '@/mixins/pagerList'
    import * as service from "@/service/module/studyShare";
    import {selectDown,fileUploadUrl} from "@/assets/const.js"
    // import Tinymce from '@/components/Tinymce'
    export default{
        mixins:[pageMix],
        // components: {
        //     Tinymce,
        // },
        data(){
            return {
                configSearch:[
                    new formItem.Input({
                        key: 'title',
                        label: '文章标题',
                    }),
                    new formItem.SingDate({
                        key: 'createdAtBegin',
                        label: '创建时间',
                        format:'yyyy-MM-dd HH:mm:ss',
                        valueFormat:'yyyy-MM-dd HH:mm:ss',
                    }),
                    new formItem.SingDate({
                        key: 'createdAtEnd',
                        label: '-',
                        format:'yyyy-MM-dd HH:mm:ss',
                        valueFormat:'yyyy-MM-dd HH:mm:ss',
                    }),
                    new formItem.Select({
                        key: 'released',
                        label: '上下架状态',
                        options:selectDown.releaseStatus
                    }),
                ],
                formConfig:{showCancelButton: true,cancelButtonText:'重置', confirmButtonText: '查询',inline:true},
                columns:[
                    { key: 'title', title: '文章标题'},
                    { key: 'intro', title: '简介'},
                    { key: 'createdAt', title: '创建时间'},
                    { key: 'released', title: '发布状态',format:selectDown.getLabel.bind(selectDown.releaseStatus)},
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
                        label: '文章标题',
                        rules:[
                            {required:true,message:'请输入文章标题',trigger:'blur'},
                        ]
                    }),
                    new formItem.Input({
                        key: 'intro',
                        label: '文章简介',
                        inputType:'textarea',
                        rows:3,
                        rules:[
                            {required:true,message:'请输入文章简介',trigger:'blur'},
                        ]
                    }),
                    new formItem.Radio({
                        key: 'released',
                        label: '是否发布',
                        options:selectDown.learnShareReleaseStatus,
                        value:true,
                        rules:[
                            {required:true,message:'请选择发布状态',trigger:'blur'},
                        ]
                    }),
                    new formItem.UploadImg({
                        key: 'file',
                        label: '封面图片',
                        url:fileUploadUrl,
                        one:true,
                        rules:[
                            {required:true,message:'请上传封面图片',trigger:'blur'},
                        ]
                    }),
                    new formItem.Editor({
                        key: 'detail',
                        label: '咨询详情',
                        rules:[
                            {required:true,message:'请输入咨询详情',trigger:'blur'},
                        ],
                        url:fileUploadUrl
                    }),
                    // new formItem.CustomComponent({
                    //     key:'detail',
                    //     name: 'editor',
                    //     label: '咨询详情',
                    // })
                ],
                selectDown,
                editorContext:''
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
                let title='新增文章'
                if(row.id){
                    title='修改文章'
                    obj =await service.view({id:row.id})
                    obj.file=obj.fileVo
                    obj.id=row.id
                }
                this.$refs.addForm.openAlert(obj, {
                    title,
                    customClass:'share-alert-form',
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
<style >
    .share-alert-form{
        width:800px;
        height:800px;
        overflow-y: scroll;
    }
</style>
