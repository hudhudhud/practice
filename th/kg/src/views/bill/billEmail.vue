<template>
    <section>
        <div class="search form-search">
            <el-input v-model="courseName" placeholder="请输入课程名称" style="width:150px;"></el-input>
            <el-button icon="el-icon-search" @click="show">搜索</el-button>
            <el-button @click="reset">重置</el-button>
        </div>
        <el-table :data="list" style="width: 100%"  highlight-current-row v-loading='loading'>
            <el-table-column  prop="courseName" label="课程名称"  width="180" > </el-table-column>
            <!-- <el-table-column  prop="name" label="学生姓名"  width="180"> </el-table-column> -->
            <el-table-column  prop="userName" label="家长姓名"  > </el-table-column>
            <el-table-column  prop="receiverPhone" label="手机号码"  > </el-table-column>
            <el-table-column  prop="receiverEmail" label="邮箱" > </el-table-column>
            <el-table-column  prop="type" label="抬头"  > 
                <template slot-scope="scope">
                    <span>{{scope.row.type==0?"个人":"单位"}}</span>
                </template>
            </el-table-column>
            <el-table-column  prop="companyName" label="单位名称"  > </el-table-column>
            <el-table-column  prop="taxPersonalNo" label="纳税人识别码"  > </el-table-column>
            <el-table-column label="操作" width="180"> 
                <template slot-scope="scope">
                    <a @click="send(scope.row)" v-if="scope.row.invoiceStatus==0">去发送</a>
                    <span v-else>已发送</span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" width="500px" class="bill-email-dialog">
            <formInput  :item="{label:'邮箱地址',key:'receiverEmail',style:'width:200px'}" :model.sync="receiverEmail" />
            <imgUpload  :item="{label:'上传发票',key:'img',type:'form-url',required:true}" :url.sync="img" ref='img' />
            <div class="sub-btns-left">
                <el-button type="text" @click="dialogVisible=false">取消</el-button>
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
import services from '../../services'
import formInput from '../../component/formInput'
import imgUpload from '../../component/imgUpload'
import pageMix from '../../mixins/pagerList'
export default {
    mixins:[pageMix],
    components: {
        formInput,
        imgUpload,
    },
    data(){
        return {
            courseName:"",
            dialogVisible:false,
            receiverEmail:"",
            img:"",
            id:"",
        }
    },
    created(){
    },
    methods:{
        show(pageNo){
            this.beforeShow(pageNo)
            let params={
                courseName:this.courseName,
                pageNO:this.pageNo,
                pageSize:this.pageSize
            }
            services.invoice_list(params)
            .then((res) => {
                this.listSuccessCb(res)
            })
            .catch((err) => {
                this.listExceptionCb(err)
            })
        },
        send(obj){
            this.dialogVisible=true
            this.receiverEmail=obj.receiverEmail
            this.id=obj.id
            this.img=''
        },
        handleSubmit(){
            if(!this.$refs['img'].check()){
                 this.$message({
                    type: 'warning',
                    message: '请填写完整信息'
                });
                return
            }
            let params={id:this.id,receiverEmail:this.receiverEmail,img:this.img,courseName:this.courseName}
            services.invoice_sendMail(params).then(data=>{
                if(data.data.status==0){
                    this.$message({
                        type: 'success',
                        message: '发送成功'
                    });
                    this.dialogVisible=false
                    this.show(this.pageNo)
                }
            })
        },
        reset(){
            this.courseName=''
            this.show()
        }
    }
}
</script>

<style lang='less'>
.bill-email-dialog{
    .formInput{
         label{
            width:100px;
        }
    }
    .imgUpload{
        label{
            width:100px;
        }
    }
}

</style>
