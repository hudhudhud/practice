<template>
     <el-dialog :title="`查看 ${courseName} 的订单`" :visible.sync="show"  width="60%" height="500px" @closed="closed">
       <div class="search" >
            <formSelect  :option="{label:'',list:statusList}"  :model.sync="search.status"/>
            <formInput :item="{key:'keywords',label:'',placeholder:'订单号/手机号/家长/学生/学校',}"  :model.sync="search.keywords"/>
            <el-button @click="searchFun">检索</el-button>
            <el-button @click="clearSearch">重置</el-button>
        </div>
        <el-table :data="orderList" height="400"  border fit highlight-current-row>
            <el-table-column prop="orderNo"  label="订单编号" width="200" align="left"></el-table-column>
            <el-table-column prop="parentName" label="父母姓名" width="70"></el-table-column>
            <el-table-column prop="phone" label="家长手机号" width="120"></el-table-column>
            <el-table-column prop="studentName" label="学生名称" ></el-table-column>
            <el-table-column prop="className" label="班级名称" ></el-table-column>
            <el-table-column prop="totalFee" label="支付金额" ></el-table-column>
            <el-table-column prop="statusDesc" label="支付状态" ></el-table-column>
            <el-table-column prop="createdAt" label="添加时间"  width="100"></el-table-column>
        </el-table>
        <div class="pagination" v-if="orderList&&orderList.length">
              <el-pagination
                  :current-page='search.pageNo'
                  @current-change="getDataBypage"
                  class="pages"
                  :page-size="search.pageSize"
                  layout="total,prev, pager, next,jumper"
                  :total="totalNum">
              </el-pagination>
        </div>
    </el-dialog>
</template>

<script>
import cfg from '../config/config'
import services from '../services'
import formInput from './formInput.vue'
import formSelect from './formSelect.vue'
export default {
    components:{
      formInput,
      formSelect,
    },
    props:{
        visible:{
            type:Boolean,
            default:false
        },
        courseId:"",
        courseName:""
    },
    watch:{
        visible(v){
            this.show=v
            if(this.show)
                this.searchFun()
        }
    },
    data(){
        return{
            show:this.visible,
            orderList:[],
            search:{
                courseId:"",
                status:"",
                keywords:"",
                pageNo:1,
                pageSize:10,
            },
            totalNum:0,
            statusList:[
                {label:"已提交",value:"committed"},
                {label:"已支付",value:"paid"},
                {label:"已取消",value:"cancelled"},
                {label:"已完成",value:"finished"},
            ],
        }
    },
    methods:{
        searchFun(pageNo){
            this.search.pageNo=1
            if(typeof pageNo=="number"){
                this.search.pageNo=pageNo
            }
            this.search.courseId=this.courseId
            services.course_getorders(this.search)
            .then(data=>{
                this.orderList=data.data.data.list
                this.totalNum=data.data.data.totalNum
            })
            .catch(function(error){
                console.log('error值：', error)
            })
        },
        getDataBypage(page){
          this.searchFun(page)
        },
        closed(){
            this.show=false
            this.$emit('update:visible', this.show)
        },
        clearSearch(){
            this.search={}
            this.searchFun()
        }   
    }
}
</script>

<style lang="less" scoped>
.search>*{
    display: inline-block;
}
</style>
