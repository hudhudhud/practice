<template>
    <section>
        <div class="search form-search">
            <label>基地名称</label> 
            <formSelectRemote  :option="{label:'',placeholder:'请输入检索名称'}" 
                :remote="practiceBaseRemoteSearch"  :model.sync="search.orgId"
                :kv="{k:'name',v:'orgId'}"  style="display:inline-block;margin-right:10px"/> 
            <el-input v-model="search.name" style="width:150px;" placeholder="请输入检索名称"></el-input>
            <el-button icon="el-icon-search" @click.native="show">搜索</el-button>
            <el-button @click="cancelSearch">重置</el-button>
            <el-button type="primary" class="fr" @click="batchUnpublish">批量下架</el-button>
            <el-button type="primary" class="fr" @click="batchPublish">批量上架</el-button>
            <el-button type="primary" class="fr" @click="addDialogVisible=true" >添加</el-button>
        </div>

        <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%"  @selection-change="changeFun" highlight-current-row
        v-loading='loading'>
            <el-table-column type="selection" style="width:5%;" >
            </el-table-column>
            <el-table-column property="orgName" label="基地名称" style="width:10%">
            </el-table-column>
            <el-table-column property="" label="所属区域" style="width:10%;" v-if='isAdmin'>
                <template slot-scope="scope">
                    <span>
                        <span v-if="scope.row.provinceName">{{scope.row.provinceName}}</span>
                        <span v-if="scope.row.cityName">{{scope.row.cityName}}</span>
                        <span v-if="scope.row.countyName">{{scope.row.countyName}}</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column property="name" label="活动名称" style="width:10%">
            </el-table-column>
            <el-table-column property="typeDesc" label="活动类型" style="width:5%">
            </el-table-column>
            <el-table-column property="gradeNames" label="适用年级" style="width:5%">
            </el-table-column>
            <el-table-column property="fee" label="活动费用" style="width:5%">
            </el-table-column>
            <el-table-column property="" label="报名人数" style="width:5%">
                <template slot-scope="scope">
                    {{scope.row.minNumber}} - {{scope.row.maxNumber}}
                </template>
            </el-table-column>
            <el-table-column property="enrollNumber" label="已报人数" style="width:5%">
            </el-table-column>
            <el-table-column property="enrollDeadline" label="报名截止时间" style="width:10%">
            </el-table-column>
            <el-table-column property="status" label="状态" style="width:5%">
                <template slot-scope="scope">
                <span>
                    <span v-if="(scope.row.status=='published')">已上架</span>
                    <span v-if="(scope.row.status=='unpublished')">已下架</span>
                    <span v-if="(scope.row.status=='committed')">未上架</span>
                </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" style="width:20%">
                <template slot-scope="scope">
                <a  @click="detail(scope.row.id)">编辑</a>
                <el-dropdown @command="handleCommand($event, scope.row)">
                    <a >
                        更多<i class="el-icon-caret-bottom el-icon--right"></i>
                    </a>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command='intro'>活动介绍</el-dropdown-item>
                        <el-dropdown-item command='pub'>上架</el-dropdown-item>
                        <el-dropdown-item command='unpub'>下架</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                </template>
            </el-table-column>
        </el-table>

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

        <el-dialog :title="activity.id?'修改活动':'添加活动'" :visible.sync="addDialogVisible" width="60%"  @closed="activityInit"  class="active-dialog">
            <form>
                <div class="form-line">
                    <label class="form-label required">举办基地</label> 
                    <formSelectRemote  :option="{label:'',placeholder:'请输入关键字搜索',required:true}" 
                    :remote="practiceBaseRemoteSearch"  :model.sync="activity.orgId"
                    :kv="{k:'name',v:'orgId'}"  style="display:inline-block;"
                    :modelText="activity.orgName"
                    ref="orgId"/> 
                </div>
                <formInput  :item="{key:'name',label:'活动名称',required:true}"  :model.sync="activity.name" ref="name" />
                <formSelect :option="{label:'活动类型',list:select.types,required:true}"  :model.sync="activity.type"  ref="type" />
                <imgUpload  :item="{label:'活动封面',key:'logo',type:'form-url',required:true}"   :url.sync="activity.logo" ref="logo"/>
                <imgUpload  :item="{label:'活动照片',key:'imgsList',multiple:true,maxLen:15,required:true}"   :model.sync="imgSrcList" ref="imgsList"/>
                <div class="form-line">
                  <label class="form-label required">活动时间</label>
                  <el-date-picker v-model="activity.startDate" type="date" placeholder="选择日期">
                  </el-date-picker>
                  ~
                  <el-date-picker v-model="activity.endDate" type="date" placeholder="选择日期">
                  </el-date-picker>
                </div>
                <div class="bmrs">
                    <formInput  :item="{key:'minNumber',label:'报名人数',type:'number',required:true}"  :model.sync="activity.minNumber"  ref="minNumber" /> ~
                    <formInput  :item="{key:'maxNumber',label:'',type:'number',required:true}"  :model.sync="activity.maxNumber" ref="maxNumber" />
                </div>
                <formSelect :option="{label:'适合年级',list:select.grades,multiple:true,required:true}" :kv="{k:'label',v:'value'}" :model.sync="activity.grades" ref='grades'/>
                <formDate  :option="{label:'报名截止时间',key:'enrollDeadline',required:true}"  :model.sync="activity.enrollDeadline" ref="enrollDeadline"/>
                <formInput  :item="{key:'fee',label:'活动费用',type:'decimal',required:true}"  :model.sync="activity.fee" ref="fee"/>
                <div class="sub-btns-left">
                    <el-button type="text" @click="handleCancel">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </div>
            </form>
        </el-dialog>

        <el-dialog title="活动介绍" :visible.sync="introDialogVisible" width="50%"  @closed="introInit"  class="intro-dialog">
             <form>
                <formTextarea :item='{label:"活动目标",key:"goal"}' :model.sync="intro.goal"/>
                <formTextarea :item='{label:"特色环节",key:"tache"}' :model.sync="intro.tache"/>
                <formTextarea :item='{label:"活动流程",key:"flow"}' :model.sync="intro.flow"/>
                <div class="sub-btns-left">
                    <el-button type="text" @click="handleCancelIntro">取消</el-button>
                    <el-button type="primary" @click="handleSubmitIntro">确定</el-button>
                </div>
            </form>
        </el-dialog>
    </section>
</template>

<script>
import services from '../../services'
import formInput from '../../component/formInput.vue'
import formTextarea from '../../component/formTextarea.vue'
import formDate from '../../component/formDate.vue'
import formSelect from '../../component/formSelect.vue'
import formSelectRemote from '../../component/formSelectRemote.vue'
import imgUpload from '../../component/imgUpload.vue'
import pageMix from '../../mixins/pagerList'
import {orgTypeRole} from '../../assets/js/const.js'
export default {
    mixins: [pageMix],
    components:{
        formInput,
        formTextarea,
        formSelect,
        imgUpload,
        formSelectRemote,
        formDate,
    },
    data(){
        return {
            addDialogVisible:false,
            introDialogVisible:false,
            select:{
                grades:[],
                types:[]
            },
            activity:{},
            intro:{},
            imgSrcList:[],
            multipleSelection: [],
            chosedIds: '',
            practiceBaseRemoteSearch:{},
            search:{
                orgId:'',
                name:''
            },
            isAdmin:false,         
        }
    },
    created(){
        this.orgType=JSON.parse(localStorage.info).orgType
        this.isAdmin=this.orgType==orgTypeRole.admin
        services.option_listGrades().then((res) => {
            this.select.grades = res.data.data;
        });
        services.option_listActivityTypes().then((res) => {
            this.select.types = res.data.data;
        });
        this.activityInit()
        this.introInit()
        this.practiceBaseRemoteSearch={
            func:'practiseBase_list2Option'
        }
    },
    methods:{
        show(pageNo){
            this.beforeShow(pageNo)
            let params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                name: this.search.name,
                orgId:this.search.orgId
            };            
            services.practiseActivity_list(params)
            .then((res) => {
                this.listSuccessCb(res)
            })
            .catch((err) => {
                this.listExceptionCb(err)
            })
        },
        handleCommand (command, row) {
            switch (command) {
                case 'intro':{
                    this.introDialogVisible=true
                    //获取介绍详情
                    services.practiseActivity_queryIntro({id:row.id})
                    .then((data) => {
                        if(data.data.status==0){
                            Object.keys(this.intro).forEach(key=>{
                                this.intro[key]=data.data.data[key]
                            })
                            this.intro.id=row.id
                        }
                    })
                    break
                }
                case 'pub':{
                    this.publish(row.id);
                    break
                }
                case 'unpub':{
                    this.unPublish(row.id);
                    break
                }
            }
        },
        changeFun(val){
            this.multipleSelection = val;
            this.chosedIds = this.multipleSelection.map(each =>each.id).join(',');
        },
        detail(id){
            this.addDialogVisible=true
            services.practiseActivity_detail({id}).then(res=>{
                res=res.data
                if(res.status==0){
                    Object.keys(this.activity).forEach(key=>{
                        this.activity[key]=res.data[key]
                    })
                    this.imgSrcList=res.data.imgs.map(item=>{item.imageUrl=item.fileHash;return item})
                    this.activity.grades=res.data.grades.split(',').map(item=>item=item-'')
                }
            })
        },
        handleSubmit(){
            let complete = Object.keys(this.activity).every(key=>{
                if(this.$refs[key]&&(this.$refs[key].item||this.$refs[key].option)){
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
            let params=JSON.parse(JSON.stringify(this.activity))
            if(params.startDate){
                params.startDate=Date.parse(params.startDate)
            }
            if(params.endDate){
                params.endDate=Date.parse(params.endDate)
            }
            if(this.activity.enrollDeadline)
                params.enrollDeadline=Date.parse(this.activity.enrollDeadline)
            params.imgJson=JSON.stringify(this.imgSrcList)
            if(this.activity.grades&&this.activity.grades.length)
                params.grades=this.activity.grades.join(',')

            if(!this.activity.id){
                services.practiseActivity_save(params)
                .then((data) => {
                    if(data.data.status==0){
                        this.addDialogVisible = false;
                        this.activityInit()
                        this.show();
                    }
                })
                .catch(function(error){
                    console.log('error值：', error)
                })
            }
            else{
                services.practiseActivity_update(params)
                .then((data) => {
                    if(data.data.status==0){
                        this.addDialogVisible = false;
                        this.activityInit()
                        this.show(this.pageNo);
                    }
                })
                .catch(function(error){
                    console.log('error值：', error)
                })
            }
        },
        handleSubmitIntro(){
            let params=JSON.parse(JSON.stringify(this.intro))
            services.practiseActivity_saveIntro(params)
            .then((data) => {
                if(data.data.status==0){
                    this.introDialogVisible = false;
                    this.introInit()
                    this.show(this.pageNo);
                }
            })
            .catch(function(error){
                console.log('error值：', error)
            })
        },
        handleCancel () {
            this.addDialogVisible = false
        },
        handleCancelIntro(){
            this.introDialogVisible=false
        },
        publish(id){
          this.$confirm('是否确认上架该活动?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              services.practiseActivity_publish({id})
              .then((res) => {
                  let resData = res.data;
                  if(resData.status == 0){
                      this.$message({
                          type: 'success',
                          message: '上架成功!'
                      });
                      this.show();
                  }
              })
              .catch(function(error){
                console.log('error值：', error)
              })
          })
        },
        unPublish(id){
            this.$confirm('是否确认下架该活动?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                services.practiseActivity_unPublish({id})
                .then((res) => {
                    let resData = res.data;
                    if(resData.status == 0){
                        this.$message({
                            type: 'success',
                            message: '下架成功!'
                        });
                        this.show();
                    }
                })
                .catch(function(error){
                    console.log('error值：', error)
                })
            })
        },
        batchPublish(){
            if (this.multipleSelection.length == 0) {
                this.$alert('请先选择要操作的数据！', {
                    confirmButtonText: '确定'
                });
            }
            else {
                services.practiseActivity_batchPublish({ids: this.chosedIds})
                .then((res) => {
                    let resData = res.data;
                    if(resData.status == 0){
                        this.$message({
                            type: 'success',
                            message: '批量上架成功!'
                        });
                        this.show();
                    }
                })
                .catch(function(error){
                console.log('error值：', error)
                })
            }
        },
        batchUnpublish(){
            if (this.multipleSelection.length == 0){
                this.$alert('请先选择要操作的数据！', {
                    confirmButtonText: '确定'
                });
            }
            else {
                services.practiseActivity_batchUnpublish({ids: this.chosedIds})
                .then((res) => {
                    let resData = res.data;
                    if(resData.status == 0){
                        this.$message({
                            type: 'success',
                            message: '批量下架成功!'
                        });
                        this.show();
                    }
                })
                .catch(function(error){
                    console.log('error值：', error)
                })
          }
        },
        activityInit(){
            this.activity={
                id:'',
                orgId:'',
                orgName:'',
                name:'',
                type:'',
                logo:'',
                imgsList:'',
                imgJson:'',
                startDate:'',
                endDate:'',
                minNumber:'',
                maxNumber:'',
                grades:[],
                enrollDeadline:'',
                fee:'',
            }
            this.imgSrcList=[]
        },
        introInit(){
            this.intro={
                id:'',
                goal:'',
                tache:'',
                flow:''
            }
        },
        cancelSearch (){
            this.search={}
            this.show();
        },
    }
}
</script>

<style lang='less' scoped>
 .bmrs .formInput{
    display: inline-block;
  }
 
</style>
<style lang='less'>
.active-dialog{
    .formInput,.formSelect,.imgUpload,.form-line{
        label{
            width:120px;
        }
    }
    .formInput{
        .el-input{
            width:217px;
        }
    }
}
.intro-dialog{
    .formTextarea{
        .el-textarea{
            width:500px;
            .el-textarea__inner{
                height: 100px;
            }
        }
    }
}
</style>
