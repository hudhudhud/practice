<template>
    <section class="comment-page">
        <div class="search form-search">
            <label>点评对象</label>
            <formSelectOrg  :option="{placeholder:'输入机构名称',clearable:true,params:{'trainingClubFlag':true}}" :model.sync="orgId" />
            <el-button icon="el-icon-search" @click.native="show">搜索</el-button>
            <el-button @click="cancelSearch">重置</el-button>
        </div>
        <el-table :data="list" style="width: 100%"  highlight-current-row v-loading='loading' class='table-row-elli'>
            <el-table-column prop="orgLoginname" label="机构账号" width="180"> </el-table-column>
            <el-table-column  prop="orgName" label="点评对象"  width="180"> </el-table-column>
            <el-table-column  prop="createdAt" label="点评时间"  width="180"> </el-table-column>
            <el-table-column  prop="commentStar" label="打分"  width="100"></el-table-column>
            <el-table-column  prop="content" label="内容" > </el-table-column>
            <el-table-column label="操作" width="100"> 
                <template slot-scope="scope">
                    <a @click="handleEval(scope.row.id,scope.row.orgName)">编辑</a>
                </template>
            </el-table-column>
        </el-table>
       <evalOrgDialog :visible.sync='dialogVisible' :option="evalOption"  :cb='afterSave'/>

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
import evalOrgDialog from '../../component/evalOrgDialog.vue'
import formSelectOrg from '../../component/formSelectOrg.vue'
import pageMix from '../../mixins/pagerList'
import {orgTypeRole} from '../../assets/js/const.js'
export default {
    mixins:[pageMix],
    components:{
        evalOrgDialog,
        formSelectOrg
    },
    data(){
        return {
            dialogVisible:false,
            name:'',
            evalOption:{},
            orgId:""
        }
    },
    created(){
    },
    methods:{
        show(pageNo){
            this.beforeShow(pageNo)
            let params={
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                orgId:this.orgId
            }
            services.comment_listOrgComment(params)
            .then((res) => {
                this.listSuccessCb(res)
            })
            .catch((err) => {
                this.listExceptionCb(err)
            })
        },
        handleEval(id,orgName){
            this.evalOption.id=id
            this.evalOption.orgName=orgName
            this.dialogVisible=true
        },
        afterSave(){
            this.show(this.pageNo)
        },
        cancelSearch(){
            this.orgId=''
            this.show()
        }
    }
}
</script>
