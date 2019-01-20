<template>
    <section class="annouce-page">
        <div class="head fr form-search">
            <el-button type="primary" @click="dialogVisible=true" class="float_right">添加</el-button>
        </div>
        <el-table :data="list" style="width: 100%" highlight-current-row>
            <el-table-column prop="title" label="公告标题" width="180"> </el-table-column>
            <el-table-column prop="createdAt" label="发布时间" width="180"> </el-table-column>
            <el-table-column  prop="content" label="公告内容"  class="oneline"> </el-table-column>
            <el-table-column label="操作" width="180"> 
                <template slot-scope="scope">
                    <a @click="edit(scope.row.id,scope.row.title,scope.row.content)">编辑</a>
                    <a @click="del(scope.row.id)">删除</a>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" @closed="announceInit" width="600px">
            <formInput    :item="{label:'公告标题',key:'title',required:true,style:'width:400px'}"   :model.sync="announce.title" ref="title"/>
            <formTextarea :item="{label:'公告内容',key:'content',required:true,style:'width:400px;height:200px'}" :model.sync="announce.content" ref="content"/>
            <div class="sub-btns">
                <el-button type="text" @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </div>
        </el-dialog>
        <!--分页-->
        <div class="pagination" v-if="list&&list.length">
            <el-pagination
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
import cfg from '../../config/config'
import services from '../../services'
import formInput from '../../component/formInput'
import formTextarea from '../../component/formTextarea'
import pageMix from '../../mixins/pagerList'
export default {
    mixins: [pageMix],
    components: {
        formInput,
        formTextarea
    },
    data(){
        return {
            dialogVisible:false,
            announce:{},
        }
    },
    created(){
        this.announceInit()
    },
    methods:{
        show(pageNo){
            this.beforeShow(pageNo)
            let params={
                pageNo:this.pageNo,
                pageSize:this.pageSize,
            }
            services.notice_list(params)
            .then((res) => {
                this.listSuccessCb(res)
            })
            .catch((err) => {
                this.listExceptionCb(err)
            })
        },
        handleSubmit(){
             let complete = Object.keys(this.announce).every(key=>{
                if(this.$refs[key]&&this.$refs[key].item){
                    return this.$refs[key].check()
                }
                return true
            })
            if(!complete){
                this.$message({
                    type: 'warning',
                    message: '请填写完整信息'
                });
                return
            }

            if(!this.announce.id){
                services.notice_add(this.announce)
                .then(data=>{
                    if(data.data.status==0){
                        this.dialogVisible=false
                        this.show()
                    }
                })
            }
            else{
                services.notice_update(this.announce)
                .then(data=>{
                    if(data.data.status==0){
                        this.dialogVisible=false
                        this.show(this.pageNo)
                    }
                })
            }
        },
        handleCancel(){
            this.dialogVisible=false
        },
        edit(id,title,content){
            this.dialogVisible=true
            this.announce.id=id
            this.announce.title=title
            this.announce.content=content
        },
        del(id){
            this.$confirm('确定删除该公告?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                services.notice_del({id})
                .then(data=>{
                    if(data.data.status==0){
                    this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.show()
                    }
                })
            })
            
        },
        announceInit(){
            this.announce={
                id:"",
                title:"",
                content:"",
            }
        },
    }
}
</script>

<style lang="less" >
.annouce-page{
    .el-table .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis; 
    }
}

</style>
