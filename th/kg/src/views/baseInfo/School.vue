<template>
  <div id="school">
    <div>
      <div class="search form-search">
        <el-input v-model="schoolName" placeholder="请输入检索名称"></el-input>
        <label v-if='isAdmin'>省市区</label>
        <addressSel  
            v-if='isAdmin'
            :province.sync="address.province"
            :city.sync="address.city"
            :county.sync='address.county'>
        </addressSel>
        <el-button icon="el-icon-search" @click="show">搜索</el-button>
        <el-button @click="cancelSearch">重置</el-button>
        <el-button type="primary" @click="handleAdd" class="fr">添加</el-button>
      </div>

      <el-dialog :title="school.id?'修改学校信息':'添加学校信息'" :visible.sync="dialogVisible" width="50%">
        <el-row>
           <el-col :offset="1">
               <el-form :model="school" :rules="rules" ref="school" label-width="120px" label-position="right">
                    <el-row :gutter="24" class="top">
                        <el-col :span="30">
                            <el-form-item label="学校名称" prop="name">
                                <el-input v-model="school.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                     <el-row :gutter="24" class="top">
                        <el-col :span="30">
                            <el-form-item label="类型" prop="type">
                                <el-select  style="width:202px;" v-model="school.type"  filterable :disabled="!!school.id">
                                    <el-option v-for="item in selectDown.schoolTypes" :label="item.label" :value="item.value" :key="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" class="top"  v-if='isAdmin'>
                        <el-col :span="30">
                            <el-form-item label="所属省市区" prop="zone">
                              <addressSel 
                              :province.sync="school.province"
                              :city.sync="school.city"
                              :county.sync='school.county'
                              ></addressSel>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" class="top">
                        <el-col :span="30">
                            <el-form-item label="地址" prop="address">
                                <el-input v-model="school.address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" class="top">
                        <el-col :span="30">
                            <el-form-item label="联系人" prop="contact">
                                <el-input v-model="school.contact" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" class="top">
                        <el-col :span="30">
                            <el-form-item label="电话号码" prop="phone">
                                <el-input v-model="school.phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" class="top">
                        <el-col :span="30">
                            <el-form-item label="用户名" prop="">
                                <el-input v-model="school.loginname" disabled v-if="school.id"></el-input>
                                <el-input v-model="school.phone" disabled v-else></el-input>
                            </el-form-item>
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
         <!--表-->
        <base-table v-loading="loading" :columns="columns" :list="list" @handleEdit='handleEdit'>
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
    </div>
  </div>
</template>

<script>
  import cfg from '../../config/config'
  import services from '../../services'
  import addressSel from '../../modulePage/addressSelect.vue'
  import formSelect from '../../component/formSelect.vue'
  import pageMix from '../../mixins/pagerList'
  import {selectDown,orgTypeRole} from '../../assets/js/const.js'
  export default {
    name: 'school',
    mixins:[pageMix],
    components: {
      addressSel,
      formSelect
    },
    data() {
      return {
        dialogVisible: false,
        orgType: '',
        schoolName: '',
        school: {
          id: null,
          name: '',
          loginname: '',
          address: '',
          contact: '',
          phone: '',
          province: '',
          city: '',
          county: '',
          type:'',
        },
        addOptions2Add: {
          size: '',
          address: ''
        },
        rules: {
            name: [
                        { required: true, message: '请输入学校名称', trigger: 'blur' },
                    ],
            loginname: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
            contact: [
                        { required: true, message: '请输入联系人', trigger: 'blur' },
                    ],
            phone: [
                        { required: true, message: '请输入电话号码', trigger: 'blur' },
                    ],
            type:[
                 { required: true, message: '请选择类型', trigger: 'blur' },
            ]
        },
        selectDown,
        orgTypeRole,
        address:{},
        isAdmin:false,
        columns:[]
      }
    },
    created: function() {
      if(localStorage.getItem("info")){
          this.orgType = JSON.parse(localStorage.getItem("info")).orgType;
      }else{
          this.$router.push('/login');
      }
      this.isAdmin=this.orgType==orgTypeRole.admin
      this.school = {};
      this.columns=[
            { key: 'name', title: '学校名称' },
            { key:'typeDesc',title: '类型'},
            { key:'address',title: '学校地址'},
            { key:'contact',title: '联系人'},
            { key:'phone',title: '联系电话'},
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
      show(pageNo){
        this.beforeShow(pageNo)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          name: this.schoolName
        };
        Object.assign(params,this.address)
        services.school_list(params)
       .then((res) => {
            this.listSuccessCb(res)
        })
        .catch((err) => {
            this.listExceptionCb(err)
        })
      },
      handleAdd(){
        this.dialogVisible = true;
        this.school = {};
      },
      handleEdit({id}){
        this.dialogVisible = true;
        services.school_detail({id})
        .then((res) => {
            let resData = res.data;
            if(resData.status == 0){
                if(resData.data){
                    this.school = resData.data;
                    this.school.province = resData.data.province;
                    this.school.city = resData.data.city;
                    this.school.county = resData.data.county;
                }
            }
        })
        .catch(function(error){
            console.log('error值：', error)
        })
      },
      handleSubmit(){
        this.$refs.school.validate((valid) => {
          if (valid) {
                let params = JSON.parse(JSON.stringify(this.school)); 
                if(!this.school.id){             
                    params.loginname=this.school.phone
                    services.user_verification({loginname:params.loginname}).then(res=>{
                        if(res.data.status==0){
                                services.school_save(params)
                                .then((data) => {
                                    this.dialogVisible = false;
                                    this.school = {};
                                    this.show();
                                })
                        }
                    })
                }
                else{
                    services.school_update(params)
                    .then((data) => {
                        this.dialogVisible = false;
                        this.school = {};
                        this.show(this.pageNo);
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
      cancelSearch (){
        this.schoolName = null;
        this.address={}
        this.show();
      },
    }
  }
</script>

<style scoped>
  .search .el-input {
    width: 200px;
  }
</style>