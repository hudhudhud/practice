<template>
  <div id="agencyteacher">
    <div class="search form-search">
        <label >机构</label>
        <formSelectOrg  :option="{label:'',placeholder:'输入关键字检索',clearable:true}" :model.sync="mechanismId" />
        <label v-if='isAdmin'>省市区</label>
        <addressSel  
            v-if='isAdmin'
            :province.sync="address.province"
            :city.sync="address.city"
            :county.sync='address.county'>
        </addressSel>
        <el-input v-model="teacherName" placeholder="请输入老师姓名"></el-input>
        <el-button icon="el-icon-search" @click="show">搜索</el-button>
        <el-button @click="cancelSearch">重置
        </el-button>
        <el-button type="primary" @click="dialogVisible = true" class="float_right">添加</el-button>
    </div>
    
    <!--表-->
    <base-table v-loading="loading" :columns="columns" :list="list" @handleEdit='handleEdit'>
        <template slot-scope="{scope}" slot="gender">
            <span>
                {{selectDown.getLabel(selectDown.gender,scope.row.gender)}}
            </span>
        </template>
        <template slot-scope="{scope}" slot="address">
            <span>
                <span v-if="scope.row.provinceName">{{scope.row.provinceName}}</span>
                <span v-if="scope.row.cityName">{{scope.row.cityName}}</span>
                <span v-if="scope.row.countyName">{{scope.row.countyName}}</span>
            </span>
        </template>
     </base-table>
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
    <div>
      <el-dialog :title="teacher.teacherId?'修改机构老师':'添加机构老师'" :visible.sync="dialogVisible" width="50%" @closed="teacherInit">
        <el-row>
           <el-col :span="20" :offset="1">
               <el-form :model="teacher" :rules="rules" ref="teacher" label-width="120px" label-position="right">
                    <el-row :gutter="24" class="top" v-if="showJg">
                         <div class="form-line">
                            <label class="form-label required" style='width:130px;'>机构</label>
                            <formSelectOrg   
                            :option="{label:'',placeholder:'输入关键字检索',required:true,clearable:true}" 
                            :model.sync="teacher.orgId"  
                            :modelText="teacher.orgName"   
                            ref="orgSelect"/>
                        </div>
                    </el-row>
                    <el-row :gutter="24" class="top">
                        <el-col :span="30">
                            <el-form-item label="老师姓名" prop="realname">
                                <el-input v-model="teacher.realname" style="width:240px;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" class="top">
                        <el-col :span="30">
                            <el-form-item label="手机号" prop="phone">
                                <el-input v-model="teacher.phone" style="width:240px;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" class="top">
                        <el-col :span="30">
                            <el-form-item label="登录名" prop="number">
                                <el-input disabled v-model="teacher.phone" style="width:240px;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" class="top">
                        <el-col :span="30">
                            <el-form-item label="性别" prop="gender">
                                <el-select  style="width:240px;" v-model="teacher.gender"  filterable>
                                    <el-option v-for="item in selectDown.gender" :label="item.label" :value="item.value" :key="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" class="top">
                        <el-col :span="30">
                            <imgUpload   :item='{key:"avatar",label:"头像",type:"form-url"}' :url.sync="teacher.avatar" />
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
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import axios from 'axios'
  import cfg from '../../config/config'
  import services from '../../services'
  import formSelectOrg from '../../component/formSelectOrg.vue'
  import imgUpload from '../../component/imgUpload.vue'
  import pageMix from '../../mixins/pagerList'
  import addressSel from '../../modulePage/addressSelect.vue'
  import {selectDown,orgTypeRole,orgTypeParam} from '../../assets/js/const.js'
  export default {
    name: 'agencyteacher',
    mixins:[pageMix],
    components: {
        formSelectOrg,
        imgUpload,
        addressSel
    },
    data() {
      return {
        dialogVisible: false,
        mechanismId: '',
        teacherName: '',
        teacher: {},
        rules: {
          orgId: [
                    { required: true, message: '请选择机构', trigger: 'blur' },
                ],
          realname: [
                    { required: true, message: '请输入老师姓名', trigger: 'blur' },
                ],
          phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                ]
        },
        orgType:"",
        showJg:false,
        selectDown,
        isAdmin:false,
        address:{},
        columns:[]
      }
    },
    created: function() {
        this.orgType=JSON.parse(localStorage.info).orgType
        this.isAdmin=this.orgType==orgTypeRole.admin
        if(this.orgType!=orgTypeRole.mech){
            this.showJg=true
        }

        this.teacherInit()
        this.columns=[
            { key: 'orgName', title: '机构',hidden:!this.showJg },
            { key:'realname',title: '姓名'},
            { key:'gender',title: '性别',slot:'gender'},
            { key:'loginname',title: '用户登录名'},
            { key:'',title: '所属区域',slot:'address',hidden:!this.isAdmin},
            { key:'createdAt',title: '创建时间'},
            {
                title: '操作', type: 'operate',
                operates: [
                    {name: '编辑',emitKey: 'handleEdit'}
                ]
            }
        ]
    },
    methods: {
      teacherInit(){
        this.teacher={
          id: null,
          orgId: '',
          orgType: '',
          realname: '',
          loginname: '',
          phone: '',
          avatar: '',
          gender: '',
          uniqueId:''
        }
      },
      show (pageNo){
        this.beforeShow(pageNo)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          name: this.teacherName,
          orgId: this.mechanismId,
          orgType: orgTypeParam.mech
        };
        Object.assign(params,this.address)
        services.teacher_list(params)
        .then((res) => {
            this.listSuccessCb(res)
        })
        .catch((err) => {
            this.listExceptionCb(err)
        })
      },
      handleAdd (){
        this.dialogVisible = true;
        this.teacher = {};
      },
      handleEdit ({teacherId}){
        this.dialogVisible = true;
        services.teacher_detail({id:teacherId})
        .then((res) => {
            let resData = res.data;
            
            if(resData.status == 0){
                if(resData.data){
                    this.teacher = resData.data;
                }
            }
        })
        .catch(function(error){
            console.log('error值：', error)
        })
      },
      handleSubmit (){
        if(this.showJg){
            if(!this.$refs['orgSelect'].check()){
                this.$message({
                    type: 'warning',
                    message: '请填写完整信息'
                });
                return
            }
        }
        this.$refs.teacher.validate((valid) => {
          if (valid) {
              let params = JSON.parse(JSON.stringify(this.teacher));
              params.orgType = 0;
              params.loginname = this.teacher.phone;
              
              let res_this = this.$data;
              if(this.teacher.teacherId){
                    services.teacher_update(params)
                    .then((data) => {
                        this.dialogVisible = false;
                        this.teacherInit()
                        this.show(this.pageNo);
                    })
                    .catch(function(error){
                        console.log('error值：', error)
                    })
              }
              else{
                    services.teacher_save(params)
                    .then((data) => {
                        this.dialogVisible = false;
                        this.teacherInit()
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
      handleCancel (){
        this.dialogVisible = false;
      },
      cancelSearch (){
        this.mechanismId = null;
        this.teacherName = null;
        this.address={}
        this.show();
      },
    }
  }
</script>
<style scoped >
  .search .el-input {
    width: 150px;
  }

  .float_right {
    float: right;
  }

  .center {
    text-align: center
  }

  .margin-top {
    margin-top: 20px;
  }

  .add .el-input {
    width: 300px;
  }

  .phone span {
    padding-left: 15px;
  }

  .register span {
    padding-left: 15px;
  }

  .password span {
    padding-left: 28px;
  }
  .portrait{
      margin-top:40px;
      position: relative;
  }
  .portrait span{
      position: absolute;
      left:180px;
      top:-20px;
  }
  .block{
      margin-top:40px;
      text-align: right
  }

  .pages{margin: 0 auto; padding: 0;}

  .avatar_img{
    vertical-align: top;
    text-align: center;
    margin-right: 10px;
    line-height: 100px;
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px dashed #eee;
    img{
        max-width: 100px;
        max-height: 120px;
        vertical-align: middle;
    }
  }

  .up_img{
    display: inline-block;
    width: 100px;
    height: 100px;
    background: url(../../assets/img/btn_import@2x.png);
    background-size: contain;
    position: relative;
    
  }

  .up_input{
        cursor: pointer;
        position: absolute;
        top: 0;
        display: inline-block;
        width: 100px;
        height: 100px;
        opacity: 0;
    }
</style>
<style lang='less'>
#agencyteacher{
    .el-dialog{
        .imgUpload{
            label{
                width:120px;
            }
        }
    }
}
</style>
