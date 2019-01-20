<template>
  <div id="regional">
    <div class="seach form-search">
      <label>所属区域</label>
      <addressSel :addOptions="addOptions" @handelChoose="handleChoose"></addressSel>
      <label>名称</label>
      <el-input v-model="name" placeholder="请输入区域运营商"></el-input>
      <el-button icon="el-icon-search" @click.native="show">搜索</el-button>
      <el-button @click="cancelSearch">重置</el-button>
      <el-button type="primary" @click="handleAdd" class="fr">添加</el-button>
    </div>
    <el-dialog :title="edubureau.id?'修改区教育局':'添加区教育局'" :visible.sync="addDialogVisible" width="50%" @closed="edubureauInit">
      <el-row>
          <el-col  :offset="1">
              <el-form :model="edubureau" ref="edubureau" :rules="rules" label-width="140px" label-position="right">
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="区域运营商名称" prop="name">
                              <el-input v-model="edubureau.name"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="所属省市区" prop="zone">
                            <addressSel :addOptions="area" @handelChoose="handleChoose2Add"></addressSel>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="固定号码" prop="tellphone">
                              <el-input v-model="edubureau.tellphone"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="联系人" prop="contact">
                              <el-input v-model="edubureau.contact" ></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="电话号码" prop="phone">
                              <el-input v-model="edubureau.phone"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="登录用户名" prop="phone">
                              <el-input disabled v-model="edubureau.loginname" v-if="edubureau.id"></el-input>
                              <el-input disabled v-model="edubureau.phone" v-else></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="性别" prop="gender">
                              <el-select  style="width:202px;" v-model="edubureau.gender"  filterable>
                                  <el-option v-for="item in selectDown.gender" :label="item.label" :value="item.value" :key="item.value">
                                  </el-option>
                              </el-select>
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
    <el-table ref="singleTable" :data="list" highlight-current-row style="width: 100%" v-loading='loading'>
      <el-table-column property="name" label="区域运营商" style="width:20%;">
      </el-table-column>
      <el-table-column property="contact" label="区域负责人" style="width:10%;">
      </el-table-column>
      <el-table-column property="phone" label="联系电话" style="width:10%;">
      </el-table-column>
      <el-table-column property="" label="所属区域" style="width:20%;">
        <template slot-scope="scope">
            <span>
                <span v-if="scope.row.provinceName">{{scope.row.provinceName}}</span>
                <span v-if="scope.row.cityName">{{scope.row.cityName}}</span>
                <span v-if="scope.row.countyName">{{scope.row.countyName}}</span>
            </span>
        </template>
      </el-table-column>
      <el-table-column property="createdAt" label="创建时间" style="width:20%;">
      </el-table-column>
      <el-table-column label="操作" style="width:20%;">
        <template slot-scope="scope">
          <a  @click="handleEdit(scope.row.id)">编辑</a>
          <a  @click="handlePermission(scope.row.orgId,scope.row.name)">权限</a>
        </template>
      </el-table-column>
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

    <!--权限-->
    <el-dialog title="权限配置" :visible.sync="permiDialogVisible" width="50%" @closed="edubureauInit" class="permission-dialog">
        <formInput  :item="{key:'name',label:'对象',required:true,disabled:true}"  :model.sync="edubureau.name" ref="name" /> 
        <ul>
            <li v-for="(item,i) in permissionList" :key="i">
              <div>
                  <el-checkbox v-if="item.children&&item.children.length" v-model="item.privileged" @change="handleCheckAllChange(item)">
                    {{item.name}}
                  </el-checkbox>
                  <el-checkbox v-else  v-model="item.privileged">{{item.name}}</el-checkbox>
                  <formInput  :item="{key:'name',label:'-展示名称:'}"  :model.sync="item.displayName" /> 
              </div>                 
              <ul v-if="item.children&&item.children.length" >
                <li  v-for="(it,i) in item.children" :key="i">
                   <el-checkbox  v-model="it.privileged"  @change="handleCheckChange(item)">{{it.name}}</el-checkbox>
                   <formInput  :item="{key:'name',label:'-展示名称:'}"  :model.sync="it.displayName" /> 
                </li>
              </ul>
            </li>
        </ul>
        <div class="sub-btns">
          <el-button type="text" @click="handleCancelPer">取消</el-button>
          <el-button type="primary" @click="handleSubmitPer">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
  import addressSel from '../../modulePage/addressSelect.vue'
  import services from '../../services'
  import formInput from '../../component/formInput.vue'
  import pageMix from '../../mixins/pagerList'
  import {selectDown,orgTypeRole,orgTypeParam} from '../../assets/js/const.js'
  export default {
    name: 'regional',
    mixins: [pageMix],
    components: {
      addressSel,
      formInput
    },
    data() {
      return {
        addOptions: {
            size: '',
            address: ''
        },
        searchAddressInfo: {
          province: '',
          city: '',
          county: ''
        },
        name: '',
        addDialogVisible: false,
        edubureau: {},
        rules: {
          name: [
                    { required: true, message: '请输入区教育局名称', trigger: 'blur' },
                ],
          loginname: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
          contact: [
                    { required: true, message: '请输入联系人', trigger: 'blur' },
                ],
          phone: [
                    { required: true, message: '请输入电话号码', trigger: 'blur' },
                ]
        },
        area:{address:[]},
        permiDialogVisible:false,
        permissionList: [], 
        selectDown,
      }
    },
    created: function() {
      this.edubureauInit()
    },
    methods: {
      handleEdit(id) {
        this.addDialogVisible=true
        services.edubureau_detail({id}).then(data=>{
          let res=data.data
          if(res.data){
            Object.keys(this.edubureau).forEach(key=>{
              this.edubureau[key]=res.data[key]
            })
            this.area.address=[res.data.province,res.data.city,res.data.county]
          }
        })
      },
      show(pageNo) {
        this.beforeShow(pageNo)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          name: this.name,
          province: this.searchAddressInfo.province,
          city: this.searchAddressInfo.city,
          county: this.searchAddressInfo.county
        };

        services.edubureau_list(params)
        .then((res) => {
            this.listSuccessCb(res)
        })
        .catch((err) => {
            this.listExceptionCb(err)
        })
      },
      handleAdd(){
        this.addDialogVisible = true;
        this.edubureauInit()
      },
      handleSubmit(){
        this.$refs.edubureau.validate((valid) => {
          if (valid) {
              let params = JSON.parse(JSON.stringify(this.edubureau));
              if(!this.edubureau.id){
                params.loginname=this.edubureau.phone;
                services.user_verification({loginname:params.loginname}).then(res=>{
                    if(res.data.status==0){
                      services.edubureau_save(params)
                      .then((data) => {
                          this.addDialogVisible = false;
                          this.edubureauInit();
                          this.show();
                      })
                      .catch(function(error){
                          console.log('error值：', error)
                      })
                    }
                })               
              }
              else{
                  services.edubureau_update(params)
                  .then((data) => {
                      this.addDialogVisible = false;
                      this.edubureauInit()
                      this.show(this.pageNo);
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
      handleCancel () {
        this.addDialogVisible = false;
      },
      handleChoose (value, status) {
        this.searchAddressInfo.province = value.province;
        this.searchAddressInfo.city = value.city;
        this.searchAddressInfo.county = value.county;
      },
      handleChoose2Add (value, status) {
        this.edubureau.province = value.province;
        this.edubureau.city = value.city;
        this.edubureau.county = value.county;
      },
      cancelSearch (){
        this.name = null;
        this.searchAddressInfo = {
          province: '',
          city: '',
          county: ''
        };
        this.addOptions.address=[]
        this.show();
      },
      edubureauInit(){
        this.edubureau={
          id: null,
          name: '',
          loginname: '',
          contact: '',
          phone: '',
          gender: '',
          province: '',
          city: '',
          county: '',
          tellphone: '',
          orgId:''
        }
        this.area={address:[]}
      },
      handlePermission(id,name){
        this.permiDialogVisible=true
        this.edubureau.name=name
        this.edubureau.orgId=id
        //获取权限
        services.orgWidget_list({orgId:id})
        .then(res=>{
          if(res.data.status==0){
             this.permissionList=res.data.data
          }
        })
      },
      handleCheckAllChange(item) {
        item.children.forEach(it=>{
          this.$nextTick(()=>{it.privileged=item.privileged})
        })
      },
      handleCheckChange(parent){
        if(parent.children.some(it=>it.privileged)){
          parent.privileged=true
        }
        else{
          parent.privileged=false
        }
      },
      handleSubmitPer(){
        let ary=[]
        this.permissionList.forEach(item=>{
            if(item.children&&item.children.length){
              ary=ary.concat(item.children.filter(it=>it.privileged).map(({id,displayName})=>{return {id,displayName}}))
            }
            if(item.privileged)
              ary.push({id:item.id,displayName:item.displayName})
        })
        let params={widgetJson:JSON.stringify(ary),orgId:this.edubureau.orgId}
        //提交权限
        services.orgWidget_post(params)
        .then(res=>{
           if(res.data.status==0){
              this.permiDialogVisible=false
           }
        })
      },
      handleCancelPer(){
        this.permiDialogVisible=false
      }
    }
  }
</script>
<style scoped lang='less'>
  .seach .el-input {
    width: 150px;
  }

  .seach .el-select {
    width: 150px;
  }  
  .pages{margin: 0 auto; padding: 0;}

  .permission-dialog{
    ul{
      li{
        .formInput{
          display: inline-block;
        }
        ul{
          background-color: #f5f7fa;
          margin-left:20px;
          padding:20px;
        }
      }
    }
  }
</style>