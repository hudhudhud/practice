<template>
    <section class="order-manage">
        <div class="search form-search" >
            <label>下单时间</label>
            <el-date-picker
                v-model="search.orderStartDate"
                type="datetime"
                placeholder="选择日期时间">
            </el-date-picker>
            ~
            <el-date-picker
                v-model="search.orderEndDate"
                type="datetime"
                placeholder="选择日期时间">
            </el-date-picker>
            <label>状态</label>
            <formSelect  :option="{list:selectDown.orderStatus}"  :model.sync="search.status"/>
            <formInput :item="{key:'keywords',label:'',placeholder:'订单号/手机号/家长/学生/学校',style:'width:220px;'}"  :model.sync="search.keywords"/>
            <el-button @click="show">检索</el-button>
            <el-button @click="cancelSearch">重置</el-button>
        </div>
        <ul class="ul-order-type">
            <li v-for='(item,i) in orderType' :key='i' :class="{active:currentOrderType==i}" @click='currentOrderType=i;show()'>{{item.name}}</li>
            <li class="line" :style='"transform: translateX("+132*currentOrderType+"px)"'></li>
        </ul>
		<el-table :data="list"  style="width: 100%" fit highlight-current-row v-loading='loading'>
			<el-table-column prop="orderNo"  label="订单编号" width="200" align="left"></el-table-column>
			<el-table-column prop="parentName" label="家长姓名" ></el-table-column>
            <el-table-column prop="phone" label="家长手机号" ></el-table-column>
            <el-table-column prop="studentName" label="学生名称" ></el-table-column>
            <el-table-column prop="gradeName" label="年级" ></el-table-column>
            <el-table-column prop="schoolName" label="学校名称" v-if='orderType[currentOrderType].id=="school"' ></el-table-column>
            <el-table-column prop="orgName" label="机构名称" v-if='orderType[currentOrderType].id=="mechanism"' ></el-table-column>
            <el-table-column prop="orgName" label="基地名称" v-if='orderType[currentOrderType].id=="practise_base"' ></el-table-column>
            <el-table-column prop="courseName" label="活动名称" v-if='orderType[currentOrderType].id=="practise_base"' ></el-table-column>
            <el-table-column prop="orgName" label="社区名称" v-if='orderType[currentOrderType].id=="community"' ></el-table-column>
            <el-table-column prop="courseName" label="课程名称" v-if='orderType[currentOrderType].id=="community"' ></el-table-column>
            <el-table-column prop="className" label="班级名称" ></el-table-column>
            <el-table-column prop="totalFee" label="支付金额" ></el-table-column>
            <el-table-column prop="statusDesc" label="支付状态" ></el-table-column>
            <el-table-column prop="createdAt" label="添加时间" ></el-table-column>
		</el-table>

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
import formSelect from '../../component/formSelect'
import formInput from '../../component/formInput'
import pageMix from '../../mixins/pagerList'
import {selectDown,orgTypeRole} from '../../assets/js/const.js'
export default {
    mixins:[pageMix],
    components: {
        formSelect,
        formInput
    },
    data(){
        return {
            search:{},
            selectDown,
            orderType:[
                {name:'学校',id:'school',show:true},
                {name:'机构',id:'mechanism',show:true},
                {name:'实践',id:'practise_base',show:true},
                {name:'社区',id:'community',show:true}
            ],
            currentOrderType:0,
            isMech:false,
        }
    },
    created(){
        this.orgType=JSON.parse(localStorage.info).orgType
        this.isMech=this.orgType==orgTypeRole.mech
        if(this.isMech){
            this.orderType[2].show=false
            this.orderType=this.orderType.filter(item=>item.show)
        }
        this.searchInit()
        this.show()
    },
    methods:{
        show(pageNo){
            this.beforeShow(pageNo)
            let params=JSON.parse(JSON.stringify(this.search))
            params.pageNo=this.pageNo
            params.pageSize=this.pageSize
            if(this.search.orderStartDate)
                params.orderStartDate=Date.parse(this.search.orderStartDate)
            if(this.search.orderEndDate)
                params.orderEndDate=Date.parse(this.search.orderEndDate)
            params.type=this.orderType[this.currentOrderType].id
            services.course_getorders(params)
            .then((res) => {
                this.listSuccessCb(res)
            })
            .catch((err) => {
                this.listExceptionCb(err)
            })
        },
        cancelSearch(){
             this.searchInit()
             this.show()
        },
        searchInit(){
            this.search={
                orderStartDate:"",
                orderEndDate:"",
                status:"",
                keywords:"",
            }
        }
    }
}
</script>

<style lang="less" scoped>
.search>*{
    display: inline-block;
}
.formInput{
    margin-left:50px;
}
.pagination{
    margin-top:20px;
    text-align: center;
}
.ul-order-type{
    border-bottom:1px solid rgba(0, 0, 0, 0.1);
    position:relative;
    padding:0;
    font-size: 14px;
    li{
        display: inline-block;
        padding:10px 50px;
        color:rgba(0, 0, 0, 0.65);
        cursor: pointer;
        &.active{
            color:#1890ff;
        }
        &.line{
            position: absolute;
            top:100%;
            left:0;
            width:132px;
            height: 2px;
            padding:0;
            background-color: #1890ff;
            transform:translateX(0);
            transition:transform .2s linear;
        }
    }
}
</style>
<style lang="less">
.order-manage{
    .formSelect{
        .tit{
            width:100px;
        }
        label{
            width:100px;
            font-size:16px;
            color:#000
        }
        .el-select{
            width:100px;
        }
    }
}
</style>

