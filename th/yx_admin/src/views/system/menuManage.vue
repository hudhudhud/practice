<template>
    <section>
        <el-button  type="text" @click="append">添加根菜单</el-button>
        <el-tree
                :data="list"
                :props="props"
                node-key="id"
                :default-expand-all="true"
                :expand-on-click-node="false"
                :render-content="renderContent">
        </el-tree>
        <elm-alert-form ref="addForm" :config="config">
        </elm-alert-form>
    </section>
</template>
<script>
    import * as formItem from "htadmin-form";
    import {list,save,update,del,view} from "@/service/module/menu";

    export default{
        data() {
            return {
                list: [],
                props:{label:"name"},
                config:[
                    new formItem.Input({
                        key:'name',
                        label:'菜单名称',
                        rules:[
                            {required:true,message:'请输入权菜单名称',trigger:'blur'},
                        ]
                    }),
                    new formItem.Input({
                        key:'href',
                        label:'菜单地址'
                    }),
                    new formItem.Input({
                        key:'permission',
                        label:'权限标识',
                        rules:[
                            {required:true,message:'请输入权限标识',trigger:'blur'},
                        ]
                    }),
                    new formItem.Input({
                        key:'icon',
                        label:'菜单图标'
                    }),
                    new formItem.Switch({
                        key:'show',
                        label:'是否显示',
                        value:true,
                    }),
                    new formItem.Input({
                        key:'sort',
                        label:'菜单序号',
                        rules:[
                            {required:true,message:'请输入菜单序号',trigger:'blur'},
                            { pattern: /^[0-9]+$/, message: '请输入数字' },
                        ]
                    }),
                    new formItem.Input({
                        key:'parentName',
                        label:'上级菜单名称',
                        disabled:true
                    }),
                    new formItem.Input({
                        key:'parentId',
                        label:'上级菜单编号',
                        disabled:true,
                        //inputType:"hidden"
                    }),
                ]
            }
        },
        async mounted(){
            this.list=await list()
        },
        methods: {
             append(node) {
                let self=this
                let newChild={parentId:node.id,parentName:node.name}
                this.$refs.addForm.openAlert(newChild, {
                    title:'新增菜单',
                    labelWidth: '100px',
                    closeOnClickModal: true,
                    beforeClose: async function (action, instance, done, form) {
                        if (action === 'confirm') {
                             instance.confirmButtonLoading = true;
                             instance.confirmButtonText = '执行中...';
                             let error=false
                             Object.assign(newChild,form,{children: [] })
                             await save(newChild).catch(()=>{error=true;})
                             self.list=await list().catch(()=>{error=true;})
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
                 let obj= await view({id:data.id})
                 obj.parentName=node.parent.label
                this.$refs.addForm.openAlert(obj, {
                    title:'修改菜单',
                    labelWidth: '100px',
                    closeOnClickModal: true,
                    beforeClose: async function (action, instance, done, form) {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            let error=false
                            await update(form).catch(()=>{error=true;})
                            self.list=await list().catch(()=>{error=true;})
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
            remove(node, data) {
                 let self=this
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    //await del(data.id)
                    // const parent = node.parent;
                    // const children = parent.data.children || parent.data;
                    // const index = children.findIndex(d => d.id === data.id);
                    // children.splice(index, 1);
                    await del({id:data.id})
                    self.list=await list()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            renderContent(h, { node, data, store }) {
                return (
                    <span class="custom-tree-node">
                       <span>{node.label}</span>
                       <span class="operate">
                           <el-button size="mini" type="text" on-click={ () => this.append(data) }>添加</el-button>
                           <el-button size="mini" type="text" on-click={ () => this.edit(node, data) }>修改</el-button>
                           <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
                       </span>
                  </span>);
            }
        }
    }
</script>
<style lang="scss" >
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
