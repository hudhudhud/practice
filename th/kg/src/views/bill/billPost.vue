<template>
    <section>
        <div class="search form-search">
            <el-input v-model="courseName" placeholder="请输入课程名称" style="width:150px;"></el-input>
            <el-button icon="el-icon-search" @click="show">搜索</el-button>
            <el-button @click="reset">重置</el-button>
        </div>
        <el-table :data="list" style="width: 100%"  highlight-current-row v-loading='loading'>
            <el-table-column  prop="courseName" label="开票课程"   > </el-table-column>
            <el-table-column  prop="totalFee" label="开票金额"  > </el-table-column>
            <el-table-column  prop="userName" label="家长姓名"  > </el-table-column>
            <el-table-column  prop="userPhone" label="手机号码" width="150" > </el-table-column>
             <el-table-column  prop="receiverName" label="收件人" > </el-table-column>
             <el-table-column  prop="receiverPhone" label="收件电话" > </el-table-column>
            <el-table-column  prop="address" label="收件地址" > </el-table-column>
            <el-table-column  prop="type" label="抬头类型"  > 
                <template slot-scope="scope">
                    <span>{{scope.row.type==0?"个人":"单位"}}</span>
                </template>
            </el-table-column>
            <el-table-column  prop="companyName" label="发票抬头"  > </el-table-column>
            <el-table-column  prop="taxPersonalNo" label="税号"  > </el-table-column>
            <el-table-column  prop="addressPhone" label="地址和电话"  width="150"> </el-table-column>
            <el-table-column  prop="bankAccount" label="开户行和账号" width="200" > </el-table-column>
            <el-table-column label="操作" width="180"> 
                <template slot-scope="scope">
                    <a @click="send(scope.row)" v-if="scope.row.invoiceStatus==0">去邮递</a>
                    <span v-else>已邮递</span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" width="500px" title='发送邮递' class="bill-post-dialog" >
            <formInput  :item="{label:'发送对象',key:'receiverName',disabled:true}" :model.sync="receiverName" />
            <imgUpload  :item="{label:'上传快递凭证',key:'img',type:'form-url',required:true}" :url.sync="img" ref='img' />
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
            receiverName:"",
            dialogVisible:false,
            receiverEmail:"",
            img:"",
            id:"",
            courseName:''
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
            this.id=obj.id
            this.receiverName=obj.receiverName
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
            let params={id:this.id,img:this.img}
            services.invoice_sendAddress(params).then(data=>{
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
.bill-post-dialog{
    .formInput{
         label{
            width:120px;
        }
    }
    .imgUpload{
        label{
            width:120px;
        }
    }
}

</style>
