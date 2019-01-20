<template>
  <div id="mycourse">
    <div class="form-search"  >
      <label  v-permission='[orgTypeRole.admin,orgTypeRole.edu]'>机构</label>
      <formSelectOrg  :option="{placeholder:'输入关键字检索',clearable:true}" :model.sync="orgIdSearch"  v-permission='[orgTypeRole.admin,orgTypeRole.edu]'/>
      <el-input v-model="name" placeholder="请输入检索名称" style="width:150px;"></el-input>
      <el-button icon="el-icon-search" @click="show">搜索</el-button>
      <el-button @click="cancelSearch" >重置</el-button>
      <el-button type="primary" class="fr" @click="batchUnpublish">批量下架</el-button>
      <el-button type="primary" class="fr" @click="batchPublish">批量上架</el-button>
      <el-button type="primary" @click="handleAdd" class="fr">添加</el-button>
    </div>


    <!--表格-->
    <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" @selection-change="changeFun" highlight-current-row v-loading='loading'>
      <el-table-column type="selection" style="width:5%;" >
      </el-table-column>
      <el-table-column property="orgName" label="机构名称" style="width:15%" v-if="showJg">
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
       <el-table-column property="className" label="班级名称" style="width:10%">
      </el-table-column>
      <el-table-column property="level" label="级别" style="width:10%">
      </el-table-column>
      <el-table-column property="gradeNames" label="适用年级" style="width:5%">
      </el-table-column>
      <el-table-column property="totalClassFee" label="课时费总(￥)" style="width:5%">
      </el-table-column>
       <el-table-column property="equipmentFee" label="器材费(￥)" style="width:5%">
      </el-table-column>
      <el-table-column property="" label="报名人数" style="width:10%">
        <template slot-scope="scope">
          {{scope.row.minNumber}} - {{scope.row.maxNumber}}
        </template>
      </el-table-column>
      <el-table-column property="enrollNumber" label="已报人数" style="width:5%">
      </el-table-column>
      <el-table-column property="enrollDeadline" label="报名截止时间" style="width:5%">
      </el-table-column>
      <el-table-column property="" label="状态" style="width:5%">
        <template slot-scope="scope">
          <span>
            {{selectDown.getLabel(selectDown.status,scope.row.status)}}
          </span>
        </template>
      </el-table-column>
       <el-table-column label="操作" style="width:20%">
        <template slot-scope="scope">
          <a  @click="getCourseDetail(scope.row.id)">编辑</a> 
          <!-- <a  @click="gotoSchedule(scope.row.id)">课表</a> -->
          <el-dropdown @command="handleCommand($event, scope.row)">
              <a>
                  更多<i class="el-icon-caret-bottom el-icon--right"></i>
              </a>
              <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item command='ed'>编辑</el-dropdown-item> -->
                  <el-dropdown-item command='sch'>课表</el-dropdown-item>
                  <el-dropdown-item command='ol'>大纲</el-dropdown-item>
                  <el-dropdown-item command='ord'>订单</el-dropdown-item>
                  <el-dropdown-item command='pub' v-if="scope.row.status!='published'">上架</el-dropdown-item>
                  <el-dropdown-item command='unpub' v-if="scope.row.status!='unpublished'">下架</el-dropdown-item>
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
   <outlineDialog :visible.sync="outlineDialogVisible" :courseId="course.id" />
   <el-dialog :title="course.id?'修改课程':'添加课程'" :visible.sync="addDialogVisible" width="60%"  @closed="courseInit"  class="mycourse-dialog">  <!--  -->
     <form>
        <div v-if="showJg">
             <label class="form-label required">机构</label> 
             <formSelectOrg   
              :option="{label:'',placeholder:'输入关键字检索',required:true,clearable:true}" 
              :model.sync="course.orgId"  
              :modelText="course.orgName"   
              :changeCb="searchSchoolTeachersByOrg"
              ref="orgSelect"/>
        </div>
        <formInput  :item="{key:'name',label:'课程名称',required:true,readonly:true}"  :model.sync="course.name" ref="name" @click.native="chooseCourse"/>
        <input type="hidden"  v-model="course.courseId" />
        <formInput   :item='{key:"className",label:"班级名称",required:true}'  :model.sync="course.className" ref="className"/>
        <formSelect  :option="{label:'级别',list:selectDown.levels}"  :model.sync="course.level"/>
        <formSelect  :option="{label:'性别限制',list:selectDown.genders}"   :model.sync="course.gender"/>
        <formSelect  :option="{label:'上课老师',list:select.teachers,required:true}" :kv="{k:'realname',v:'userId'}" :model.sync="course.teacherIds" ref='teacherIds'/>
        <formSelect  :option="{label:'适合年级',list:select.grades,multiple:true,required:true}" :kv="{k:'label',v:'value'}" :model.sync="course.grades" ref='grades'/>
        <formInput  :item="{key:'teachAddress',label:'上课地址'}"  :model.sync="course.teachAddress" />
        <div class="bmrs">
          <formInput  :item="{key:'minNumber',label:'报名人数',type:'number'}"  :model.sync="course.minNumber"  ref="minNumber"/> ~
          <formInput  :item="{key:'maxNumber',label:'',type:'number'}"  :model.sync="course.maxNumber" ref="maxNumber"/>
        </div>
        <formDate  :option="{label:'选课截至时间',key:'enrollDeadline',required:true}"  :model.sync="course.enrollDeadline" ref="enrollDeadline"/>
        <formDate  :option="{label:'开课时间',key:'timeRange',required:true,type:'range'}"  :startDate.sync="course.startDate" :endDate.sync="course.endDate" ref="timeRange"/>
        <div class="sksj form-line">
          <label class="form-label">上课时间</label>
          <div class="time-group"> 
            <el-collapse  @change="collapseHandleChange" v-model="collapseActive">
              <el-collapse-item :title="collapseTitle" name="1">
                  <p v-for="(item,i) in (new Array(7).fill(true))" :key="i" class="form-line" >
                    <el-checkbox v-model="timepick.day[i]">{{timepick.week[i]}}</el-checkbox>
                    <el-time-picker is-range v-model="timepick.day_time[i]" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
                      placeholder="选择时间范围" value-format="HH:mm" format="HH:mm">
                    </el-time-picker>
                  </p>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <formInput  :item='{key:"totalClass",label:"课程总节数",type:"number"}'  :model.sync="course.totalClass" ref="totalClass"/>
        <formInput  :item="{key:'classFee',label:'课时费',type:'decimal'}"  :model.sync="course.classFee" ref="classFee"/>
        <div class="qcf">	
          <formInput  :item="{key:'equipmentFee',label:'器材费',type:'decimal'}"  :model.sync="course.equipmentFee"  ref="equipmentFee"/>
          <el-checkbox v-model="course.equipmentRequired" :true-label="1" :false-label="0">已有，不买</el-checkbox>
        </div>
        <div class="sub-btns-left">
              <el-button type="text" @click="handleCancel">取消</el-button>
              <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
     </form>
    </el-dialog>
    <courseOrderListDialog  :visible.sync="orderDialogVisible" :courseId="courseId" :courseName="courseName"/>

    <el-dialog title="添加/选择课程" :visible.sync="chooseDialogVisible" width="60%" >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="选择课程" name="choose" >
              <div class="search">
                  <formInput :item="{key:'name',label:'',placeholder:'课程名称',clearable:true,style:'width:200px;'}"  :model.sync="courselibrary.name" style='display:inline-block'/>
                  <el-button @click="libraryshow">检索</el-button>
              </div>
             <el-table ref="libraryTable" :data="courselibrarys" highlight-current-row style="width: 100%">
              <el-table-column property="name" label="课程名称" style="width:20%">
              </el-table-column>
              <el-table-column property="termTaxonomyPathDesc" label="品种" style="width:10%">
              </el-table-column>
              <el-table-column label="操作" style="width:30%">
                <template slot-scope="scope">
                  <a >查看</a>
                  <a  @click="selectCourseId2AddDialog(scope.row.id,scope.row.name)">选择</a>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination" v-if="courselibrarys.length !== 0">
                <el-pagination
                    :current-page='courselibrary.pageNo'
                    @current-change="librarypage"
                    class="pages"
                    :page-size="10"
                    layout="total,prev, pager, next,jumper"
                    :total="libraryPageTotal">
                </el-pagination>
            </div>
        </el-tab-pane>
        <el-tab-pane label="新建课程" name="add">
          <courseLibraryAdd  :subCb="libSubCb" :canCb="libCanCb"  :showAddress="false"/>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
  import cfg from '../../config/config'
  import services from '../../services'
  import formInput from '../../component/formInput.vue'
  import formTextarea from '../../component/formTextarea.vue'
  import formSelect from '../../component/formSelect.vue'
  import courseColumnSel from '../../modulePage/courseColumnSelect.vue'
  import imgUpload from '../../component/imgUpload.vue'
  import courseOrderListDialog from '../../component/courseOrderListDialog.vue'
  import formSelectOrg from '../../component/formSelectOrg.vue'
  import courseLibraryAdd from '../../component/courseLibraryAdd.vue'
  import formDate from '../../component/formDate.vue'
  import outlineDialog from '../../component/outlineDialog.vue'
  import pageMix from '../../mixins/pagerList'
  import coursePublish from '../../mixins/coursePublish'
  import {selectDown,orgTypeRole,orgTypeParam} from '../../assets/js/const.js'
  export default {
    name: 'mycourse',
    mixins:[pageMix,coursePublish],
    components:{
      formInput,
      formTextarea,
      formSelect,
      imgUpload,
      courseColumnSel,
      courseOrderListDialog,
      formSelectOrg,
      courseLibraryAdd,
      formDate,
      outlineDialog
    },
    data() {
      return {
        yearTermId: '',
        status: '',
        name: '',
        orgId: '',
        orgType:'',
        remoteMechanism: '',
        currentYearTermName: '',
        addDialogVisible: false,
        chooseDialogVisible: false,
        orderDialogVisible:false,
        pageTotal: '',
        courses:[],
        courselibrarys: [],
        libraryPageTotal: '',
        courselibrary: {
          pageNo: 1
        },
        multipleSelection: [],
        chosedIds: '',
        course: {},
        courseImg:{},
        courseImgs:[],
        select: {
          grades: [],
          mechanisms: [],
          teachers: [],
          yearterms: []
        },
        timepick: {
          chosedDays: [],
          day:new Array(7),
          day_time:(new Array(7)).fill(["8:00","23:59"]),
          week:["周一","周二","周三","周四","周五","周六","周日",],
        },
        courseId:"",
        collapseTitle:"点击收起上课时间",
        collapseActive:"1",
        courseName:"",
        showJg:false,
        orgIdSearch:"",
        courselibrarys: [],
        libraryPageTotal: '',
        courselibrary: {
          pageNo: 1,
          name:"",
        },
        activeTab:"choose",
        outlineDialogVisible:false,
        selectDown,
        isAdmin:false,
        orgTypeRole,
      }
    },
    created: function(){
      let self = this;
      this.orgType=JSON.parse(localStorage.info).orgType
      this.orgId=JSON.parse(localStorage.info).orgId;
      if(this.orgType==orgTypeRole.admin|this.orgType==orgTypeRole.edu){
        this.showJg=true
      }
      this.isAdmin=this.orgType==orgTypeRole.admin
      this.courseInit()
      self.show();

      services.option_listGrades().then((res) => {
        self.select.grades = res.data.data;
      });

      self.searchSchoolTeachers();
    },
    methods: {
        show(pageNo){
          let self = this;
          this.beforeShow(pageNo)
          let params = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            yearTermId: this.yearTermId,
            status: this.status,
            name: this.name,
            orgType:orgTypeParam.mech
          };

          if(this.showJg){
            params.orgType=orgTypeParam.mech
            params.orgId=this.orgIdSearch
          }

          services.course_list(params)
          .then((res) => {
            this.listSuccessCb(res)
            this.list=this.list.map(item=>{
              if(item.courseTimeStr){
                item.courseTimeStr=item.courseTimeStr.replace(/br/ig,'<br>');
              }
              return item
            });
          })
          .catch((err) => {
              this.listExceptionCb(err)
          })
        },
        gotoSchedule(val){
          this.$router.push({name: 'courseSchedule', params: { courseid: val } });
        },
        cancelSearch (){
          this.name = null;
          this.orgIdSearch=null;
          this.show();
        },
        handleCommand (command, row) {
            switch (command) {
                case 'detail':{
                  break
                }
                case 'ol':
                  this.course.id=row.id;
                  this.outlineDialogVisible=true;
                  break
                case 'ord':{
                  this.orderDialogVisible=true
                  this.courseId=row.id
                  this.courseName=row.name
                  break
                }
                case 'tea':
                    console.log("上课老师")
                    break
                case 'pub':{
                  this.publish(row.id);
                  break
                }
                case 'unpub':{
                  this.unPublish(row.id);
                  break
                }
                case 'sch':{
                  this.$router.push({name: 'courseSchedule', params: { courseid: row.id } });
                  break
                }
            }
        },
        getCourseDetail(id){
          this.addDialogVisible=true;
          services.course_detail({id}).then(data=>{
            let res=data.data
            if(res){
              Object.keys(this.course).forEach(key=>{
                this.course[key]=res.data[key]
              })
              if(this.showJg&&this.course.orgId)
                  this.searchSchoolTeachers(this.course.orgId)
              this.course.grades=res.data.grades.split(',').map(item=>item=item-'')
              this.course.teacherIds=res.data.teacherIds?res.data.teacherIds[0]:''
              this.courseImg={"imageUrl":res.data.logo}
              this.courseImgs=res.data.imgs.map(item=>{item.imageUrl=item.fileUrl;return item})
              res.data.times.forEach((item,i)=>{
                let day=item.day-1
                this.timepick.day[day]=true
                this.timepick.day_time[day]=[item.startTime,item.endTime]
              })
            }
          })
          .catch(e=>{
            console.log(e)
          })
        },
        handleAdd(){
          this.addDialogVisible=true;
        },
        searchSchoolTeachersByOrg(){
          this.searchSchoolTeachers(this.course.orgId)
        },
        searchSchoolTeachers(orgId){
          let self = this;
          self.select.teachers = [];
          this.course.teacherIds=''
          let params = {
            orgId: orgId?orgId:self.orgId,
            orgType: orgTypeParam.mech
          };

          services.teacher_list(params)
          .then((res) => {
              let resData = res.data;
              
              if(resData.status == 0){
                  if(resData.data){
                    self.select.teachers = resData.data.list;
                  }
              }
          })
          .catch(function(error){
              console.log('error值：', error)
          })
        },
        handleSubmit(){
          let complete = Object.keys(this.course).every(key=>{
                if(this.$refs[key]&&(this.$refs[key].item||this.$refs[key].option)){
                    return this.$refs[key].check()
                }
                return true
          })
          if(this.showJg){
            complete=this.$refs['orgSelect'].check()&&complete
          }
          if(!complete){
            this.$message({
                type: 'warning',
                message: '请填写完整信息'
            });
            return
          }
          
          let params = {};
          Object.keys(this.course).forEach(key=>{
              params[key]=this.course[key]
          })

          if(this.course.startDate)
              params.startDate = Date.parse(this.course.startDate);
          if(this.course.endDate)    
              params.endDate = Date.parse(this.course.endDate);
          if(this.course.enrollDeadline)
              params.enrollDeadline= Date.parse(this.course.enrollDeadline);

          if(this.course.grades)
            params.grades = this.course.grades.join(',');
          // if(this.course.teacherIds)
          //   params.teacherIds = this.course.teacherIds.join(',');

          this.timepick.day.forEach((item,i)=>{
            if(item){
              let time=this.timepick.day_time[i]
              this.timepick.chosedDays.push({day: i+1, startTime: time[0], endTime: time[1]})
            }
          })
          if(this.timepick.chosedDays.length){
            params.timeJson = JSON.stringify(this.timepick.chosedDays);
          } 

          if(!params.id){
              services.course_savemechanismcourse(params)
              .then((data) => {
                console.log('save success')
                this.addDialogVisible = false;
                this.courseInit()
                this.show();
              })
              .catch(function(error){
                console.log('error值：', error)
              })
          }
          else{
              services.course_updateOrgCourse(params)
              .then((data) => {
                console.log('eidt success')
                this.addDialogVisible = false;
                this.courseInit()
                this.show(this.pageNo);
              })
              .catch(function(error){
                console.log('error值：', error)
              })
          }
        },
        handleCancel(){
          this.addDialogVisible=false;
          this.courseInit()
        },
        courseInit(){
          this.course = { name: '',
            classroomType: '',
            belong: '',
            courseId: '',
            grades: [],
            startDate: '',
            endDate: '',
            timeJson: '',
            teachAddress: '',
            totalClass: '',
            classFee: '',
            equipmentFee: '',
            equipmentRequired: '',
            minNumber: '',
            maxNumber: '',
            level: '',
            gender: '',
            feeNotes: '',
            perClassMins: '',
            teacherIds: '',
            id:"",
            orgId:"",
            orgName:"",
            enrollDeadline:'',
            className:'',
            timeRange:''}
          this.timepick.chosedDays=[]
          this.timepick.day=(new Array(7)).fill(false)
          this.timepick.day_time=(new Array(7)).fill(["8:00","23:59"])
          this.collapseTitle="点击收起上课时间"
          this.collapseActive="1"
        },
        collapseHandleChange(val){
          if(val.length){
            this.collapseTitle="点击收起上课时间"
          }else{
            this.collapseTitle="点击展开上课时间"
          }
        },
        chooseCourse(){
          this.chooseDialogVisible = true;
          this.libraryshow();
        },
        libraryshow(pageNo){
          let self = this;
          this.courselibrarys = [];
          this.activeTab="choose"
          self.courselibrary.pageNo=1
          if(typeof pageNo =="number"){
            self.courselibrary.pageNo=pageNo
          }
          let params = {
            pageNo: self.courselibrary.pageNo,
            pageSize: 10,
            name:self.courselibrary.name
          };
          if(this.orgType=="edu_bureau"){//区教育局才需要增加该参数
            params.standardRequired=1
          }

          services.courselibrary_list(params)
          .then((res) => {
              let resData = res.data;
              if(resData.status == 0){
                  if(resData.data){
                      self.courselibrarys = resData.data.list;
                      self.libraryPageTotal = resData.data.totalNum ||0;
                  }else{
                      self.pageTotal = 0;
                  }
              }
          })
          .catch(function(error){
              console.log('error值：', error)
          })
        },
        librarypage(val){
          this.libraryshow(val);
        },
        libSubCb(payload){
          this.course.courseId=payload.id
          this.course.name=payload.name
          this.chooseDialogVisible = false;
        },
        libCanCb(){
          this.chooseDialogVisible=false
        },
        selectCourseId2AddDialog(val,name){
          this.course.courseId = val;
          this.course.name=name;
          this.chooseDialogVisible = false;
          this.$nextTick(()=>{
            this.$refs['name'].check()
          })
          
        },
      },
    
  }
</script>
<style scoped lang="less">
  .pages{margin: 0 auto; padding: 0;}
  .kcld .formInput{
    display: inline-block;
  }
  .bmrs .formInput{
    display: inline-block;
  }
  .sksj .time-group{
    display: inline-block;
    vertical-align: top;
    p:first-child{
      padding-top:0,
    }
    p:last-child{
      padding-bottom:0,
    }
  }

  .qcf >*{
	  display: inline-block;
  }
</style>
<style lang="less">
#mycourse{
  .el-collapse-item__header{
    border:none;
    height: 25px;
    line-height:40px;
    margin-bottom:10px;
  }
  .el-collapse-item__arrow{
    line-height:25px;
  }
  .el-collapse{
    border:none;
    padding-top:8px;
    width:430px;
  }
  .el-collapse-item__wrap{
    border:none;
  }
  .mycourse-dialog{
    .formInput{
      .el-input{
        width:217px
      }
      label{
          width:120px;
      }
    }
  }
  .form-label{
    width:120px;
  }
  .formSelect{
    label{
      width:120px
    }
  }
  .mycourse-dialog{
      .el-select{
        width:217px;
      }
  }
  .outline-dialog{
      .formInput{
        .el-input{
          width:250px;
        }
      }
      .lines{
          .formInput{
              .el-input{
                  width:175px;
              }
          }
      }
      .form-label{
        width:80px;
      }
    }
}
</style>
