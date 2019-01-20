<template>
  <div id="studentMessage">
    <div class="seek form-search">
      <label v-if="orgType !=  orgTypeRole.sch">学校</label>
      <formSelectSchool  v-if="orgType !=  orgTypeRole.sch" 
        :option="{placeholder:'学校关键字检索'}" 
        :model.sync="orgId"
        :changeCb='fetchClasses'
      />
      <label>班级</label>
      <el-select  style="width:160px;" clearable placeholder="请选择" v-model="classId" >
           <el-option v-for="item in classes" :label="item.name" :value="item.id" :key="item.id">
           </el-option>
      </el-select>
      <el-input v-model="studentName" placeholder="请输入学生姓名"></el-input>
      <el-button icon="el-icon-search" @click="show">搜索</el-button>
      <el-button @click="cancelSearch">重置</el-button>
      <el-button type="primary" @click.native="goBack" v-if="this.$route.query.cla" class="fr">返回</el-button>  
      <el-button type="primary" @click="handleAdd" class="fr">添加</el-button>
     </div>

    <!--表-->
    <base-table v-loading="loading" :columns="columns" :list="list" @handleEdit='handleEdit'>
        <template slot-scope="{scope}" slot='gender'>
            <span>
                {{selectDown.getLabel(selectDown.gender,scope.row.gender)}}
            </span>
        </template>
        <template slot-scope="{scope}" slot='bindCode'>
            <span>
                <span v-if="scope.row.parentId">已绑定家长</span>
                <span v-else-if="scope.row.bindCode">{{scope.row.bindCode}}</span>
                <span v-else>- -</span>
            </span>
        </template>
    </base-table>

    <el-dialog :title="student.id?'修改学生信息':'添加学生信息'" :visible.sync="dialogVisible" width="50%" class="student-dialog">
    <el-row>
        <el-col :span="20" :offset="1">
            <el-form :model="student" :rules="rules" ref="student" label-width="120px" label-position="right">
                <el-row :gutter="24" v-if="orgType !=  orgTypeRole.sch" class="top">
                    <el-col :span="30">
                            <formSelectSchool     
                                :option="{label:'学校',placeholder:'学校关键字检索',required:true}" 
                                :model.sync="student.orgId"
                                :modelText="student.schooName"
                                ref="schSelect"
                                :changeCb='fetchClasses2Add'
                                />
                    </el-col>
                </el-row>
                <el-row :gutter="24" class="top">
                    <el-col :span="30">
                        <el-form-item label="班级" prop="classId">
                            <el-select  style="width:240px;" v-model="student.classId">
                                    <el-option v-for="item in classes2Add" :label="item.name" :value="item.id" :key="item.id">
                                    </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" class="top">
                    <el-col :span="30">
                        <el-form-item label="学生姓名" prop="realname">
                            <el-input v-model="student.realname"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" class="top">
                    <el-col :span="30">
                        <el-form-item label="性别" prop="gender">
                            <el-select  style="width:240px;" v-model="student.gender"  filterable>
                                <el-option v-for="item in selectDown.gender" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" class="top">
                    <el-col :span="30">
                        <el-form-item label="学号" prop="number">
                            <el-input v-model="student.number"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" class="top">
                    <el-col :span="30">
                        <el-form-item label="民族" prop="nation">
                            <el-select  style="width:240px;" v-model="student.nation"  filterable>
                                <el-option v-for="(item,index) in nations" :key="index" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" class="top">
                    <el-col :span="30">
                        <imgUpload :item="{key:'avatar',type:'form-url',label:'头像'}" :url.sync="student.avatar" />
                    </el-col>
                </el-row>
                
                <el-form-item>
                    <el-button type="text" @click="handleCancel">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
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
   

  </div>
</template>

<script>
  import services from '../../services'
  import imgUpload from '../../component/imgUpload.vue'
  import formSelectSchool from '../../component/formSelectSchool.vue'
  import pageMix from '../../mixins/pagerList'
  import {selectDown,orgTypeRole} from '../../assets/js/const.js'
  export default {
    name:'studentMessage',
    mixins: [pageMix],
    components: {
        formSelectSchool,
        imgUpload
    },
    data() {
      return {
        dialogVisible: false,
        orgType: '',
        classes: [],
        classes2Add: [],
        classes2Update: [],
        nations: [],
        schoolId: '',
        orgId:"",
        classId: '',
        studentName: '',
        student: {
          id: '',
          classId: '',
          className: '',
          realname: '',
          gender: '',
          nation: '',
          number: '',
          avatar: ''
        },
        rules: {
          schoolId: [
                    { required: true, message: '请选择学校', trigger: 'blur' },
                ],
          classId: [
                    { required: true, message: '请选择班级', trigger: 'blur' },
                ],
          realname: [
                    { required: true, message: '请输入学生姓名', trigger: 'blur' },
                ],
          gender: [
                    { required: true, message: '请选择性别', trigger: 'blur' },
                ],
        },
        orgTypeRole,
        selectDown,
        isShow:false,
        columns:[]
      }
    },
    created: function() {
        if(localStorage.getItem("info")){
            this.orgType = JSON.parse(localStorage.getItem("info")).orgType;
        }else{
            this.$router.push('/login');
        }

        this.student = {};

        services.dict_list({type: "NATION"}).then((res) => {
            this.nations = res.data.data;
        })
        //学校登录则初始化该学校的班级，否则都要根据所选的学校联动班级
        if (this.orgType == orgTypeRole.sch) {
            services.class_list().then((res) => {
                this.classes = res.data.data.list;
                this.classes2Add = res.data.data.list;
            })
        }

        if(this.$route.query&&this.$route.query.cla){
            this.classId=parseInt(this.$route.query.cla)
        }
        this.show()

        this.columns=[
            { key:"schoolName", title:"学校名称",hidden:this.orgType === this.orgTypeRole.sch},
            { key: 'className', title: '班级'},
            { key:'realname',title: '学生姓名'},
            { key:'number',title: '学号'},
            { key:'gender',title: '性别',slot:'gender'},
            { key:'parentName',title: '家长姓名'},
            { key:'parentPhone',title: '家长手机号 '},
            { key:'',title: '验证码',slot:'bindCode'},
            {
                title: '操作', type: 'operate',
                operates: [
                    {name: '编辑',emitKey: 'handleEdit'}
                ]
            }
        ]
    },
    methods: {
      goBack(){
        window.history.go(-1)
      },
      show(pageNo){
        this.beforeShow(pageNo)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          name: this.studentName,
          classId: this.classId,
          orgId:this.orgId
        };
        services.student_list(params)
        .then((res) => {
            this.listSuccessCb(res)
        })
        .catch((err) => {
            this.listExceptionCb(err)
        })
      },
      handleAdd(){
        this.dialogVisible = true;
        this.student = {};
      },
      handleEdit({id}){
        this.dialogVisible = true;
        services.student_detail({id})
        .then((res) => {
            let resData = res.data;
            if(resData.status == 0){
                if(resData.data){
                    this.student = resData.data;
                    this.fetchClasses2Add()
                }
            }
        })
        .catch(function(error){
            console.log('error值：', error)
        })
      },
      handleSubmit(){
        if(this.orgType!='school'){
          if(!this.$refs['schSelect'].check()){
              this.$message({
                  type: 'warning',
                  message: '请填写完整信息'
              });
              return
          }
        }
        this.$refs.student.validate((valid) => {
          if (valid) {
              let params = JSON.parse(JSON.stringify(this.student));
              if(this.student.id){
                    services.student_update(params)
                    .then((data) => {
                        this.dialogVisible = false;
                        this.student = {};
                        this.show(this.pageNo);
                    })
                    .catch(function(error){
                        console.log('error值：', error)
                    })
              }
              else{
                    services.student_save(params)
                    .then((data) => {
                        this.dialogVisible = false;
                        this.student = {};
                        this.show();
                    })
                    .catch(function(error){
                        console.log('error值：', error)
                    })
              }
             
          } else {
              console.log('error submit!!');
              this.$message({
                  type: 'warning',
                  message: '请填写完整信息'
              });
              return false;
          }
       });
      },
      handleCancel(){
        this.dialogVisible = false;
      },
      fetchClasses2Add(){
        services.class_list({orgId: this.student.orgId}).then((res) => {
          this.classes2Add = res.data.data.list;
        })
      },
      fetchClasses(){
        services.class_list({orgId: this.orgId}).then((res) => {
          this.classes = res.data.data.list;
        })
      },
      clearClasses(){
        this.classes = [];
      },
      cancelSearch (){
        this.schoolId = null;
        this.classId = null;
        this.studentName = null;
        this.orgId=""
        
        this.show();
      }
    }
  }
</script>
<style scoped>
  .seek .el-input,
  .student-dialog .el-input{
    width: 240px;
  }
</style>
<style lang="less">
.student-dialog{
  .formSelectSchool{
    label{
      width:120px ;
    }
    input{
        width:240px;
    }
  }
  .imgUpload{
      label{
          width:120px;
      }
  }
}
</style>

