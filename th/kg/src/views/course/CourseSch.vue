<template>
  <div id="coursemanage">
    <div class="form-search">
      <label v-if="orgType==orgTypeRole.sch">学年学期</label>
      <el-select v-model="yearTermId" filterable placeholder="学期学年检索" v-if="orgType==orgTypeRole.sch">
        <el-option v-for="item in select.yearterms" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <label v-if="isAdmin || orgType==orgTypeRole.edu">学校</label>
      <formSelectSchool  v-if="isAdmin || orgType==orgTypeRole.edu" 
        :option="{placeholder:'学校关键字检索'}" 
        :model.sync="schoolId"
      />
      <el-select v-model="status" filterable placeholder="状态">
        <el-option v-for="item in selectDown.status" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="name" placeholder="请输入课程名称" style="width:150px;"></el-input>
      <el-button icon="el-icon-search" @click="show">搜索</el-button>
      <el-button @click="cancelSearch">重置</el-button>
      <el-button type="primary" class="fr" @click="batchUnpublish" v-if="orgType!=orgTypeRole.mech">批量下架</el-button>
      <el-button type="primary" class="fr" @click="batchPublish" v-if="orgType!=orgTypeRole.mech">批量上架</el-button>
      <el-button type="primary" @click="handleAdd" class="fr" v-if="orgType!=orgTypeRole.mech">添加</el-button>
    </div>

    <!--表格-->
    <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%"  @selection-change="changeFun" highlight-current-row v-loading='loading'>
      <el-table-column type="selection" style="width:5%;" >
      </el-table-column>
      <el-table-column  v-if="isAdmin || orgType==orgTypeRole.edu" property="orgName" label="学校名称" style="width:10%">
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
      <el-table-column property="name" label="课程名称" style="width:10%">
      </el-table-column>
      <el-table-column property="className" label="班级名称" style="width:10%">
      </el-table-column>
      <el-table-column property="level" label="级别" style="width:5%">
      </el-table-column>
      <el-table-column property="" label="课堂分类" style="width:5%">
        <template slot-scope="scope">
          <span>
            {{selectDown.getLabel(selectDown.classroomTypes.sch,scope.row.classroomType)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column property="gradeNames" label="适用年级" style="width:5%">
      </el-table-column>
      <el-table-column property="totalClassFee" label="课时费总" style="width:5%">
      </el-table-column>
      <el-table-column property="equipmentFee" label="器材费" style="width:5%">
      </el-table-column>
      <el-table-column property="" label="报名人数" style="width:10%">
        <template slot-scope="scope">
          {{scope.row.minNumber}} - {{scope.row.maxNumber}}
        </template>
      </el-table-column>
      <el-table-column property="enrollNumber" label="已报人数" style="width:5%">
      </el-table-column>
      <el-table-column property="belongName" label="所属机构" style="width:10%">
          <template slot-scope="scope">
            <span v-if="scope.row.belongName">{{scope.row.belongName}}</span>
            <span v-else>本校</span>
          </template>
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
          <a  @click="gotoSchedule(scope.row.id)">课表</a>
          <el-dropdown @command="handleCommand($event, scope.row)">
              <a >
                  更多<i class="el-icon-caret-bottom el-icon--right"></i>
              </a>
              <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command='ed' v-if="orgType!=orgTypeRole.mech">编辑</el-dropdown-item>
                  <el-dropdown-item command='ol'>大纲</el-dropdown-item>
                  <el-dropdown-item command='pub' v-if="orgType!=orgTypeRole.mech&&scope.row.status!='published'">上架</el-dropdown-item>
                  <el-dropdown-item command='unpub' v-if="orgType!=orgTypeRole.mech&&scope.row.status!='unpublished'">下架</el-dropdown-item>
                  <el-dropdown-item command='tea' v-if="orgType!=orgTypeRole.mech">上课老师</el-dropdown-item>
                  <el-dropdown-item command='eval' v-if="orgType==orgTypeRole.sch&&scope.row.belongName">评价机构</el-dropdown-item>
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

    <el-dialog title="添加/选择课程" :visible.sync="chooseDialogVisible" width="60%" >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="选择课程" name="choose" >
            <div class="search">
                <formInput :item="{key:'name',label:'',placeholder:'课程名称',clearable:true,style:'width:200px;'}"  :model.sync="courselibrary.name" style='display:inline-block'/>
                <el-button @click="libraryshow">检索</el-button>
            </div>
            <el-table ref="libraryTable" :data="courselibrarys" highlight-current-row style="width: 100%" v-loading='libLoading'>
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

            <div class="pagination" v-if="courselibrarys&&courselibrarys.length">
                <el-pagination
                    :current-page='courselibrary.pageNo'
                    @current-change="librarypage"
                    class="pages"
                    :page-size="pageSize"
                    :layout="pageLayout"
                    :total="libraryPageTotal">
                </el-pagination>
            </div>
        </el-tab-pane>
        <el-tab-pane label="新建课程" name="add">
          <courseLibraryAdd  :subCb="libSubCb" :canCb="libCanCb"  :showAddress="false"/>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog  :title="course.id?'修改选课':'添加选课'" :visible.sync="addDialogVisible" width="60%" @closed="courseInit" class="course-dialog">
      <el-form :model="course" :rules="rules" ref="course" label-width="120px" label-position="right">
          <el-row  v-if="orgType!=orgTypeRole.sch">
              <el-col>
                <formSelectSchool     
                  :option="{label:'学校',placeholder:'学校关键字检索',required:true}" 
                  :model.sync="course.orgId"
                  :changeCb="searchTeaAndYearItemBySchool"
                  :modelText="course.orgName"
                  ref="schSelect"
                />
              </el-col>
          </el-row>
          <el-row  >
              <el-col :span="10">
                  <el-form-item label="学年学期">
                    <el-input v-model="currentYearTermName" :disabled="true"></el-input>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row >
              <el-col :span="10">
                  <el-form-item label="课堂分类" prop="classroomType">
                    <el-select v-model="course.classroomType" filterable placeholder="请选择">
                      <el-option v-for="item in selectDown.classroomTypes.sch" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row >
              <el-col :span="10">
                  <el-form-item label="级别" prop="level">
                    <el-select v-model="course.level" filterable>
                      <el-option v-for="item in selectDown.levels" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
          </el-row>
           <el-row >
              <el-col :span="8">
                  <el-form-item label="性别限制" prop="gender">
                    <el-select v-model="course.gender" filterable placeholder=" ">
                      <el-option v-for="item in selectDown.genders" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row >
              <el-col :span="10">
                  <el-form-item label="课程名称" prop="courseId">
                    <el-input @focus="chooseCourse" readonly v-model="course.name"></el-input>
                    <input type="hidden"  v-model="course.courseId" />
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row >
              <el-col :span="10">
                  <el-form-item label="班级名称" prop="className">
                    <el-input v-model="course.className"></el-input>
                  </el-form-item>
              </el-col>
          </el-row>
           <el-row >
              <el-col style='margin-bottom:15px'>
                    <formSelectOrg     
                      :option="{label:'服务提供方',
                                placeholder:'机构关键字检索',
                                disabled:localSchool,
                                clearable:true,
                                params:{'trainingClubFlag':true}
                              }" 
                      :model.sync="course.belong"
                      :changeCb="searchSchoolTeachersByBelong"
                      :modelText="course.belongName"
                    />
                    <el-checkbox v-model="localSchool" style='margin-top:10px;margin-left:50px;'>本校</el-checkbox>
              </el-col>
          </el-row>
          <el-row >
              <el-col :span="10">
                  <el-form-item label="上课老师" prop="teacherIds">
                    <el-select v-model="course.teacherIds" filterable  placeholder="请选择">
                      <el-option v-for="item in select.teachers" :key="item.userId" :label="item.realname" :value="item.userId">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
          </el-row>
           <el-row >
              <el-col :span="10">
                  <el-form-item label="适用年级" prop="grades">
                    <el-select v-model="course.grades" multiple placeholder="请选择">
                      <el-option v-for="item in select.grades" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row >
              <el-col :span="10">
                  <el-form-item label="上课地址" prop="teachAddress">
                    <el-input v-model="course.teachAddress" placeholder=" "></el-input>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row >
              <el-col >
                 <formInput  :item="{key:'minNumber',label:'报名人数',type:'number'}"  :model.sync="course.minNumber"  ref="minNumber" style='display:inline-block'/> ~
                 <formInput  :item="{key:'maxNumber',label:'',type:'number'}"  :model.sync="course.maxNumber" ref="maxNumber"  style='display:inline-block;margin-bottom:20px;'/>
              </el-col>
          </el-row>
          <el-row >
              <el-col >
                  <formDate  :option="{label:'开课时间',key:'timeRange',required:true,type:'range'}"  :startDate.sync="course.startDate" :endDate.sync="course.endDate" ref="timeRange"/>
              </el-col>
          </el-row>
          <el-row >
              <el-form-item label="上课时间" >
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
              </el-form-item>
          </el-row>
          <el-row >
              <el-col :span="10">
                  <el-form-item label="课程总节数" prop="totalClass">
                    <el-input v-model="course.totalClass"></el-input>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row >
              <el-col >
                  <el-form-item label="课时费" prop="classFee">
                    <el-input v-model="course.classFee" placeholder=" "></el-input>
                    <span style='margin-top:10px;margin-left:50px;'>节</span>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row >
              <el-col >
                  <el-form-item label="器材费" prop="equipmentFee">
                    <el-input v-model="course.equipmentFee" placeholder=" "></el-input>
                    <el-checkbox v-model="course.equipmentRequired" style='margin-left:50px;' :true-label="1" :false-label="0">已有，不买</el-checkbox>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row >
              <el-col :span="6">
                  <el-form-item label="每节课时间(分)" prop="perClassMins">
                    <el-input v-model="course.perClassMins" placeholder=" "></el-input>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-form-item>
              <el-button type="text" @click="handleCancel">取消</el-button>
              <el-button type="primary" @click="handleSubmit">确定</el-button>
          </el-form-item>
      </el-form>
    </el-dialog>

    <outlineDialog :visible.sync="outlineDialogVisible" :courseId="course.id" />
    <el-dialog title="修改上课老师" :visible.sync="teacherDialogVisible"  width="30%">
        <form>
            <formSelect  :option="{label:'上课老师',list:select.teachers,required:true}" :kv="{k:'realname',v:'userId'}" :model.sync="course.teacherIds"/>
            <div class="sub-btns">
                <el-button type="text" @click="handleCancelTeacher">取消</el-button>
                <el-button type="primary" @click="handleSubmitTeacher">确定</el-button>
            </div>
        </form>
    </el-dialog>
    <evalOrgDialog   :visible.sync='evalDialogVisible' :option="evalOption" />
  </div>
</template>
<script>
  import cfg from '../../config/config'
  import services from '../../services'
  import courseColumnSel from '../../modulePage/courseColumnSelect.vue'
  import formInput from '../../component/formInput.vue'
  import formTextarea from '../../component/formTextarea.vue'
  import imgUpload from '../../component/imgUpload.vue'
  import formSelect from '../../component/formSelect.vue'
  import outlineDialog from '../../component/outlineDialog.vue'
  import formSelectSchool from '../../component/formSelectSchool.vue'
  import formSelectOrg from '../../component/formSelectOrg.vue'
  import courseLibraryAdd from '../../component/courseLibraryAdd.vue'
  import evalOrgDialog from '../../component/evalOrgDialog.vue'
  import pageMix from '../../mixins/pagerList'
  import coursePublish from '../../mixins/coursePublish'
  import {selectDown,orgTypeRole,orgTypeParam} from '../../assets/js/const.js'
  import formDate from '../../component/formDate.vue'
  export default {
    name: 'coursemanage',
    mixins: [pageMix,coursePublish],
    components:{
      courseColumnSel,
      formInput,
      imgUpload,
      formTextarea,
      formSelect,
      outlineDialog,
      formSelectSchool,
      formSelectOrg,
      courseLibraryAdd,
      evalOrgDialog,
      formDate
    },
    data() {
      return {
        orgType:"",
        dialogVisible: false,
        timepick: {
          chosedDays: [],
          day:new Array(7),
          day_time:(new Array(7)).fill(["8:00","23:59"]),
          week:["周一","周二","周三","周四","周五","周六","周日",],
        },
        yearTermId: '',
        status: '',
        name: '',
        orgId: '',
        remoteMechanism: '',
        currentYearTermName: '',
        addDialogVisible: false,
        chooseDialogVisible: false,
        outlineDialogVisible:false,
        teacherDialogVisible:false,
        courselibrarys: [],
        libraryPageTotal: '',
        courselibrary: {
          pageNo: 1,
          name:''
        },
        course: {},
        select: {
          grades: [],
          mechanisms: [],
          teachers: [],
          yearterms: [],
        },
        rules: {
          courseId: [
                    { required: true, message: '请选择课程名称', trigger: 'blur' },
                ],
          className: [
                    { required: true, message: '请输入班级名称', trigger: 'blur' },
                ],
          minNumber: [
                    { required: true, message: '请输入最小报名人数', trigger: 'blur' },
                ],
          maxNumber: [
                    { required: true, message: '请输入最大报名人数', trigger: 'blur' },
                ],
          teacherIds: [
                    { required: true, message: '请选择上课老师', trigger: 'blur' },
                ],
          totalClass:[
              { pattern: /^[0-9]+$/, message: '请输入数字' }
          ],
          classFee:[
               { pattern: /^([1-9]\d*|0)(\.\d+)?$/, message: '请输入数字' }
          ],
          equipmentFee:[
               { pattern: /^([1-9]\d*|0)(\.\d+)?$/, message: '请输入数字' }
          ],
          perClassMins:[
              { pattern: /^[0-9]+$/, message: '请输入数字' }
          ],
        },
        activeTab:"choose",
        termTaxonomyId:'',
        collapseTitle:"点击收起上课时间",
        collapseActive:"1",
        schoolId:'',
        schools:[],
        remoteSchool: '',
        selectDown,
        orgTypeRole,
        libLoading:false,
        isAdmin:false,
        evalOption:{},
        evalDialogVisible:false,
      }
    },
    computed:{
      localSchool:{
        get(){
          return this.course.belong?false:true
        },
        set(val){
          if(val){
            this.course.belong=''
            this.searchSchoolTeachersByBelong()
          }
          else{
            this.course.belong='选择服务提供方'
            this.select.teachers=[]
          }
        }
      }
    },
    created: function(){
      let self = this;
      this.courseInit()

      if(localStorage.getItem("info")){
          self.orgId = JSON.parse(localStorage.getItem("info")).orgId;
          self.orgType = JSON.parse(localStorage.getItem("info")).orgType;
      }else{
          this.$router.push('/login');
      }
      self.show();

      services.yearterm_list().then((res) => {
        self.select.yearterms = res.data.data.list;
      });

      services.yearterm_currentdetail().then((res) => {
        if(res.data.data)
          self.currentYearTermName = res.data.data.name;
      });

      if(self.orgType==orgTypeRole.sch){
        services.grade_list().then((res) => {
          self.select.grades = res.data.data.list;
        });
      }

      this.isAdmin=this.orgType==orgTypeRole.admin
      
      
      // if(this.orgType=="school"){ //总后台和教育局默认没有老师,只有学校才默认当前学校老师
      //     self.searchSchoolTeachers();
      // }
    },
    methods: {
      show(pageNo){
        this.beforeShow(pageNo)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          yearTermId: this.yearTermId,
          status: this.status,
          name: this.name,
          orgType: orgTypeParam.sch,
          orgId:this.schoolId
        };

        services.course_list(params)
       .then((res) => {
            this.listSuccessCb(res)
        })
        .catch((err) => {
            this.listExceptionCb(err)
        })
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
          pageSize: this.pageSize,
          name:self.courselibrary.name
        };
        if(this.orgType==orgTypeRole.edu){//区教育局才需要增加该参数
          params.standardRequired=1
        }

        this.libLoading=true
        services.courselibrary_list(params)
        .then((res) => {
            this.libLoading=false
            let resData = res.data;
            if(resData.status == 0){
                if(resData.data){
                    self.courselibrarys = resData.data.list;
                    self.libraryPageTotal = resData.data.totalNum ||0;
                }else{
                    self.libraryPageTotal = 0;
                }
            }
        })
        .catch(function(error){
           this.libLoading=false
            console.log('error值：', error)
        })
      },
      librarypage(val){
          this.libraryshow(val);
      },
      searchTeaAndYearItemBySchool(){
        this.course.teacherIds=''
        this.searchTeaAndYearItem()
        this.searchGrade()
      },
      searchSchoolTeachersByBelong(){
        this.course.teacherIds=''
        this.searchSchoolTeachers(this.course.belong)
      },
      searchSchoolTeachers(belong){
        let self = this;
        //this.course.teacherIds=[]
        self.select.teachers = [];
        let params = { //有机构按机构查老师，否则按学校查老师
          //orgId: self.orgId,
          orgType: belong?orgTypeParam.mech:orgTypeParam.sch,//机构老师orgType为0，学校老师orgType为1
          orgId:belong?belong:self.course.orgId
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
      searchYearItem(){
        services.yearterm_currentdetail({orgId:this.course.orgId}).then((res) => {
          if(res.data.data){
              this.currentYearTermName = res.data.data.name;
          }
          else{
              this.currentYearTermName=""
          }
        });
      },
      searchTeaAndYearItem(belong){
        this.searchSchoolTeachers(belong)
        this.searchYearItem()
      },
      searchGrade(){
          services.grade_list({orgId:this.course.orgId}).then((res) => {
            this.select.grades = res.data.data.list;
          });
      },
      handleAdd(){
        this.addDialogVisible = true;
        this.courseInit()
        if(this.orgType==orgTypeRole.sch){ //总后台和教育局默认没有老师,只有学校才默认当前学校老师
          this.searchSchoolTeachers();
        }
      },
      handleCancel(){
        this.addDialogVisible = false;
      },
      chooseCourse(){
        this.chooseDialogVisible = true;
        this.libraryshow();
      },
      selectCourseId2AddDialog(val,name){
        this.course.courseId = val;
        this.course.name=name;
        this.chooseDialogVisible = false;
        this.$nextTick(()=>{
          this.$refs.course.validateField('courseId')
        })
      },
      handleSubmit (){
        if(this.orgType!=orgTypeRole.sch){
          if(!this.$refs['schSelect'].check()){
              this.$message({
                  type: 'warning',
                  message: '请填写完整信息'
              });
              return
          }
        }
        if(!this.$refs['timeRange'].check()){
           this.$message({
                type: 'warning',
                message: '请填写完整信息'
            });
            return
        }

        this.$refs.course.validate((valid) => {
          if (valid) {
                let params = {};
                Object.keys(this.course).forEach(key=>{
                    params[key]=this.course[key]
                })
                if(this.course.startDate)
                    params.startDate = Date.parse(this.course.startDate);
                if(this.course.endDate)
                    params.endDate = Date.parse(this.course.endDate);
                params.grades = params.grades.join(',');
                //params.teacherIds = params.teacherIds.join(',');
                //params.timeJson = JSON.stringify(this.timepick.chosedDays);
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
                  services.course_saveschoolcourse(params)
                    .then((data) => {
                        this.addDialogVisible = false;
                        this.courseInit()
                        this.show();
                    })
                    .catch(function(error){
                        console.log('error值：', error)
                    })
                }
                else{
                   services.course_updateSchCourse(params)
                    .then((data) => {
                        this.addDialogVisible = false;
                        this.courseInit()
                        this.show(this.pageNo);
                    })
                    .catch(function(error){
                        console.log('error值：', error)
                    })
                }
              }
              else {
                  console.log('error submit!!');
                  this.$message({
                      type: 'warning',
                      message: '请填写完整信息'
                  });
                  return false;
              }
       });
      },
      courseInit(){
        this.course = {
          classroomType: '',
          courseId: '',
          className: '',
          grades: [],
          startDate: '',
          endDate: '',
          timeJson: '',
          teachAddress: '',
          totalClass: '',
          classFee: '',
          toatlClassFee: '',
          equipmentFee: '',
          equipmentRequired: '',
          minNumber: '',
          maxNumber: '',
          level: '',
          gender: '',
          feeNotes: '',
          perClassMins: '',
          teacherIds: '',
          name:"",
          id:"",
          belong:"",
          orgId:"",
          orgName:"",
          belongName:""
        }
        this.select.teachers=[]
        this.termTaxonomyId=""
        this.timepick.chosedDays=[]
        this.timepick.day=(new Array(7)).fill(false)
        this.timepick.day_time=(new Array(7)).fill(["8:00","23:59"])
        this.collapseTitle="点击收起上课时间"
        this.collapseActive="1"
        //this.libray={}
      },
      gotoSchedule(val){
        this.$router.push({name: 'courseSchedule', params: { courseid: val } });
      },
      cancelSearch (){
        this.name = null
        this.yearTermId=null
        this.schoolId=null
        this.status=null
        this.show();
      },
      handleCommand (command, row) {
          switch (command) {
              case 'ed':{
                  this.addDialogVisible=true;
                  services.course_detail({id:row.id}).then(data=>{
                    let res=data.data
                    if(res){
                      this.course.orgId=res.data.orgId
                      //教育局或总后台需要根据学校机构联动学年老师
                      if(this.orgType==orgTypeRole.edu|| this.orgType==orgTypeRole.admin){
                          this.searchTeaAndYearItem(row.belong)
                      }
                      else{
                          this.searchSchoolTeachers(row.belong)
                      }
                      this.searchGrade()
                      
                      Object.keys(this.course).forEach(key=>{
                        this.course[key]=res.data[key]
                      })
                      //this.course.id=res.data.id
                      this.course.grades=res.data.grades.split(',').map(item=>item=item-'')
                      this.course.teacherIds=res.data.teacherIds?res.data.teacherIds[0]:''
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
                  break
              }
              case 'ol':{
                  this.course.id=row.id;
                  this.outlineDialogVisible=true;
                  break
              }
              case 'pub':
                  this.publish(row.id);
                  break
              case 'unpub':
                  this.unPublish(row.id);
                  break;
              case 'tea':{
                    this.course.id=row.id
                    this.course.orgId=row.orgId
                    this.searchSchoolTeachers(row.belong)
                    this.course.teacherIds=row.teacherIds?row.teacherIds[0]:''
                    this.teacherDialogVisible=true
                    //获取老师详情
                    break
                  }
              case 'eval':{
                  this.evalOption.orgId=row.belong
                  this.evalOption.orgName=row.belongName
                  this.evalOption.orgType=orgTypeRole.sch
                  this.evalDialogVisible=true
                  break
              }
          }
      },
      libSubCb(payload){
        this.course.courseId=payload.id
        this.course.name=payload.name
        this.chooseDialogVisible = false;
      },
      libCanCb(){
        this.chooseDialogVisible=false
      },
      handleSubmitTeacher(){
        let params={id:this.course.id,teacherIds:this.course.teacherIds}
        services.course_updateTeachers(params)
        .then(data=>{
          if(data.data.status==0){
            this.teacherDialogVisible=false
            //列表老师更新
            this.show(this.pageNo);
            this.courseInit()
          }
        })
      },
      handleCancelTeacher(){
        this.teacherDialogVisible=false
      },
      collapseHandleChange(val){
        if(val.length){
          this.collapseActive="1"
          this.collapseTitle="点击收起上课时间"
        }else{
          this.collapseActive=""
          this.collapseTitle="点击展开上课时间"
        }
      },
    },

  }
</script>
<style scoped lang="less">
  
</style>

<style lang="less">
#coursemanage{
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
    display: inline-block;
    width:430px;
  }
  .el-collapse-item__wrap{
    border:none;
  }
  .el-collapse-item__content{
    padding-bottom:0;
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
  }
}
.course-dialog{
  .formSelectSchool{
    label{
      width:120px ;
    }
  }
  .formSelectOrg{
    label{
      width:120px;
    }
  }
  .el-input{
    width:217px;
  }
  .formInput{
    label{
      width:120px;
    }
  }
}
</style>
