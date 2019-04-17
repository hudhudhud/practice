<template>
<section>
    <el-button  type="text" @click="append">添加根级品类</el-button>
    <el-tree
            :data="list"
            :props="props"
            node-key="id"
            :default-expand-all="false"
            :expand-on-click-node="false"
            :render-content="renderContent">
    </el-tree>
    <elm-alert-form ref="addForm" :config="config">
    </elm-alert-form>
</section>
</template>
<script>
    import * as formItem from "htadmin-form";
    import {fileUploadUrl} from '@/assets/const'
    import * as service  from "@/service/module/category";
    export default{
        data() {
            return {
                props:{label:"name"},
                list: [],
                config:[
                    new formItem.Input({
                        key:'name',
                        label:'品类名称',
                        rules:[
                            {required:true,message:'请输入品类名称',trigger:'blur'},
                        ]
                    }),
                    new formItem.UploadImg({
                        key: 'file',
                        label: '品类图片',
                        url:fileUploadUrl,
                        //value:{id:1,url: "http://image.zhi-you.net/image/4e46a345ce9f42eea2ad507aa3ba4232"},
                        one:true,
                    }),
                    new formItem.Switch({
                        key:'reveal',
                        label:'是否隐藏',
                        value:false,
                    }),
                    new formItem.Input({
                        key:'parentName',
                        label:'上级品类名称',
                        disabled:true
                    }),
                    new formItem.Input({
                        key:'parentId',
                        label:'上级品类编号',
                        disabled:true,
                        //inputType:"hidden"
                    }),
                ]
            }
        },
        async created(){
            this.list=await service.list()
        },
        methods: {
            append(node) {
                let self=this
                let newChild={parentId:node.id,parentName:node.name}
                this.$refs.addForm.openAlert(newChild, {
                    title:'新增品类',
                    labelWidth: '100px',
                    closeOnClickModal: true,
                    beforeClose: async function (action, instance, done, form) {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            let error=false
                            if(form.file){
                                newChild.fileId=form.file.id
                            }
                            delete form.file
                            Object.assign(newChild,form)
                            await service.save(newChild).catch(()=>{error=true;})
                            self.list=await service.list().catch(()=>{error=true;})
                            instance.confirmButtonText='确定'
                            instance.confirmButtonLoading = false;
                            if(!error)done();
                        } else {
                            instance.confirmButtonLoading = false;
                            done();
                        }
                    }
                })
            },
            async edit(node,data){
                let self=this
                let obj= await service.view({id:data.id})
                obj.parentName=node.parent.label
                obj.file=obj.fileVo
                this.$refs.addForm.openAlert(obj, {
                    title:'修改品类',
                    labelWidth: '100px',
                    closeOnClickModal: true,
                    beforeClose: async function (action, instance, done, form) {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            let error=false
                            if(form.file){
                                form.fileId=form.file.id
                            }
                            delete form.file
                            await service.update(form).catch(()=>{error=true;})
                            self.list=await service.list().catch(()=>{error=true;})
                            instance.confirmButtonText='确定'
                            instance.confirmButtonLoading = false;
                            if(!error){
                                instance.confirmButtonLoading = false;
                                done();
                            }
                        } else {
                            instance.confirmButtonLoading = false;
                            done();
                        }
                    }
                })
            },
           async remove(node, data) {
                await this.$confirm('是否确认删除?', '提示', {type: 'warning'})
                await service.del({id:data.id},{successMsg:'删除成功！'})
                this.list=await service.list()
            },
            renderContent(h, { node, data, store }) {
                return (
                  <span class="custom-tree-node">
                      <span>{node.label}</span>
                       <span className="operate">
                           <el-button size="mini" type="text" on-click={() => this.append(data)}>添加</el-button>
                           <el-button size="mini" type="text" on-click={() => this.edit(node, data)}>修改</el-button>
                           <el-button size="mini" type="text" on-click={() => this.remove(node, data)}>删除</el-button>
                       </span>
                  </span>);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        .operate{
            display: inline-block;
            padding:0 20px;
        }
    }
</style>
