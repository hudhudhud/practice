<template>
    <div id="institution">
        <div class="search form-search">
            <label >运营情况</label>
            <formSelect :option="{list:selectDown.operationFlag}" style="display:inline-block;" :model.sync="operationFlag"/>
            <label v-if='isAdmin'>省市区</label>
            <addressSel  
                v-if='isAdmin'
                :province.sync="address.province"
                :city.sync="address.city"
                :county.sync='address.county'>
            </addressSel>
            <el-input v-model="name" style="width:150px;" placeholder="请输入检索名称"></el-input>
            <el-button icon="el-icon-search" @click.native="show">搜索</el-button>
            <el-button @click="cancelSearch">重置</el-button>
            <el-button type="primary" @click="handleAdd" class="fr">添加</el-button>
        </div>
        
        <el-dialog :title="mechanism.id?'修改机构':'添加机构'" :visible.sync="addDialogVisible" width="50%"  @closed="mechanismInit">
            <el-form :model="mechanism" ref="mechanism" :rules="rules" label-width="140px" label-position="right">
                <el-row :gutter="30">
                    <el-col :span="30">
                        <el-form-item label="机构名称" prop="name">
                            <el-input v-model="mechanism.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                <el-col :span="30">
                      <formSelect   :option="{label:'性质',list:naturesList}" :kv="{k:'name',v:'code'}" :model.sync="mechanism.nature"/>
                </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <imgUpload  :item="{label:'LOGO',key:'logo',type:'form-url'}" :url.sync="mechanism.logo" />
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <imgUpload  :item="{label:'门头',key:'doorImg',multiple:true}"   :model.sync="doorImgList"/>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="入驻时间" prop="registerDate">
                            <el-date-picker v-model="mechanism.registerDate" type="date">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="负责人" prop="contact">
                            <el-input v-model="mechanism.contact"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model="mechanism.phone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="登录用户名" prop="phone">
                            <el-input v-model="mechanism.loginname" disabled v-if="mechanism.id"></el-input>
                            <el-input v-model="mechanism.phone" disabled v-else></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" class="top" v-if="orgType == orgTypeRole.admin">
                    <el-col :span="30">
                        <el-form-item label="所属省市区" prop="zone">
                            <addressSel 
                              :province.sync="mechanism.province"
                              :city.sync="mechanism.city"
                              :county.sync='mechanism.county'
                            ></addressSel>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" class="top" >
                    <el-col :span="30">
                        <el-form-item label="机构地址" prop="address">
                            <el-input v-model="mechanism.address"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" class="top" >
                    <el-col :span="30">
                        <el-form-item label="机构电话" prop="tellphone">
                            <el-input v-model="mechanism.tellphone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="机构简介" prop="briefIntro">
                            <el-input v-model="mechanism.briefIntro"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="机构校长" prop="headmaster">
                            <el-input v-model="mechanism.headmaster"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="机构法人" prop="legal">
                            <el-input v-model="mechanism.legal"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="办学内容" prop="teachRange">
                            <el-input v-model="mechanism.teachRange" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <imgUpload  :item="{label:'教学环境',key:'envImg',multiple:true,maxLen:15}"   :model.sync="envImgSrcList"/>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <imgUpload  :item="{label:'营业执照',key:'businessLicenseImg',type:'form-url'}" :url.sync="mechanism.businessLicenseImg" />
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <imgUpload  :item="{label:'办学许可证',key:'teachingLicenseImg',type:'form-url'}" :url.sync="mechanism.teachingLicenseImg" />
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <imgUpload  :item="{label:'消防证书',key:'fireCertificateImg',type:'form-url'}" :url.sync="mechanism.fireCertificateImg" />
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="是否认证" prop="">
                            <el-radio-group v-model="mechanism.verified">
                                <el-radio  :label="1">是</el-radio>
                                <el-radio  :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="是否为训练营" prop="">
                            <el-radio-group v-model="mechanism.classservice">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="红白黑等级" prop="">
                            <el-radio-group v-model="mechanism.board">
                                <el-radio  label="红榜">红榜</el-radio>
                                <el-radio  label="白榜">白榜</el-radio>
                                <el-radio  label="黑榜">黑榜</el-radio>
                                <el-radio  label="">无</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="运营情况" prop="">
                            <el-radio-group v-model="mechanism.operationFlag">
                                <el-radio :label="item.value" v-for='(item,i) in selectDown.operationFlag' :key='i'>{{item.label}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="text" @click="handleCancel">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--表-->
        <el-table ref="singleTable" :data="list" highlight-current-row style="width: 100%" v-loading='loading'>
            <el-table-column property="name" label="机构名称" style="width:20%;">
            </el-table-column>
            <el-table-column property="operationFlag" label="运营情况" style="width:10%;">
                <template slot-scope="scope">
                    <span>
                        <span v-if="(scope.row.operationFlag==0)">启用</span>
                        <span v-if="(scope.row.operationFlag==1)">禁用</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column property="contact" label="负责人" style="width:10%;">
            </el-table-column>
            <el-table-column property="phone" label="联系电话" style="width:10%;">
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
            <el-table-column property="registerDate" label="入驻时间" style="width:20%;">
            </el-table-column>
            <el-table-column property="registerStatus" label="是否认证" style="width:5%;">
                <template slot-scope="scope">
                    <span>
                        <span v-if="(scope.row.registerStatus!='verified')">否</span>
                        <span v-if="(scope.row.registerStatus=='verified')">是</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column property="approveStatus" label="审核状态" style="width:5%;">
                <template slot-scope="scope">
                    <span>
                        <span v-if="(scope.row.approveStatus=='committed')" @click="approve(scope.row.id)" style="cursor:pointer;padding:5px 10px;background-color:#ff4081;color:#fff;">待审核</span>
                        <span v-if="(scope.row.approveStatus=='passed')"  style="color:#a1a0f1;">审核通过</span>
                        <span v-if="(scope.row.approveStatus=='denied')"  style="color:red;">审核失败</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" style="width:15%;">
                <template slot-scope="scope">
                <a  @click="handleEdit(scope.row.id)">编辑</a>
                <a  v-if='isEdu' @click="handleEval(scope.row.orgId,scope.row.name)">评价</a>
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

        <el-dialog :visible.sync="approveDialogVisible" title="待审核机构详情"  width="50%"  class="approveDialog"  @closed="mechanismInit"> 
            <table>
                <tr><td>机构名称：</td><td>{{mechanism.name}}</td></tr>
                <tr><td>手机号：</td><td>{{mechanism.phone}}</td></tr>
                <tr><td>机构地址：</td><td>{{mechanism.provinceName+mechanism.cityName+mechanism.countyName}}</td></tr>
                <tr><td>机构具体地址：</td><td>{{mechanism.address}}</td></tr>
                <tr><td>机构负责人：</td><td>{{mechanism.contact}}</td></tr>
                <tr><td>授课范围：</td><td>{{mechanism.teachRange}}</td></tr>
                <tr>
                    <td>营业执照：</td>
                    <td>
                        <img :src="imgSrc(mechanism.businessLicenseImg)" alt="" v-if="mechanism.businessLicenseImg">
                    </td>
                </tr>
                <tr>
                    <td>消防证书：</td>
                    <td>
                        <img :src="imgSrc(mechanism.fireCertificateImg)" alt="" v-if="mechanism.fireCertificateImg">
                    </td>
                </tr>
            </table>
            <el-button  @click="approveFail" type="danger">审核失败</el-button>
            <el-button  @click="approveSucc" ctype="primary">通过审核</el-button>
        </el-dialog>

        <evalOrgDialog   :visible.sync='evalDialogVisible' :option="evalOption" />
    </div>
</template>
<script>
  import cfg from '../../config/config'
  import services from '../../services'
  import imgUpload from '../../component/imgUpload.vue'
  import addressSel from '../../modulePage/addressSelect.vue'
  import formSelect from '../../component/formSelect.vue'
  import evalOrgDialog from '../../component/evalOrgDialog.vue'
  import pageMix from '../../mixins/pagerList'
  import {selectDown,orgTypeRole} from '../../assets/js/const.js'
  export default {
    name: 'institution',
    mixins: [pageMix],
    components: {
      addressSel,
      imgUpload,
      formSelect,
      evalOrgDialog
    },
    data() {
      return {
        orgType: '',
        name: '', 
        addDialogVisible: false,
        envImgSrcList: [],
        doorImgList:[],
        mechanism: {},
        rules: {
            name: [{ required: true, message: '请输入机构名称', trigger: 'blur' },],
            loginname: [{ required: true, message: '请输入登录用户名', trigger: 'blur' },],
            contact: [{ required: true, message: '请输入联系人', trigger: 'blur' },],
            phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' },],
            address: [{ required: true, message: '请输入机构地址', trigger: 'blur' },],
            tellphone: [{ required: true, message: '请输入机构地址', trigger: 'blur' },]
        },
        approveDialogVisible:false,
        naturesList:[],
        operationFlag:"",
        selectDown,
        orgTypeRole,
        isAdmin:false,
        isEdu:false,
        address:{},
        evalDialogVisible:false,
        evalOption:{}
      }
    },
    created: function() {
        this.mechanismInit()
        this.orgType = JSON.parse(localStorage.getItem("info")).orgType;
        services.mechanism_naturesList().then(data=>{
            this.naturesList=data.data.data
        })
        this.isAdmin=this.orgType==orgTypeRole.admin
        this.isEdu=this.orgType==orgTypeRole.edu
    },
    methods: {
        handleEdit(id) {
            this.addDialogVisible = true;
            services.mechanism_detail({id}).then(data=>{
                let res=data.data.data
                Object.keys(this.mechanism).forEach(key=>{
                    this.mechanism[key]=res[key]
                })
                this.mechanism.classservice=(res.classserviceStatus=="service")?1:0
                this.mechanism.verified=(res.registerStatus=="verified")?1:0 //认证状态(committed/未认证,verified/已认证)
                this.envImgSrcList = res.teachEnvImgs.map(item=>{item.imageUrl=item.fileHash;return item})
                this.doorImgList= res.doorImgs.map(item=>{item.imageUrl=item.fileHash;return item})
                this.mechanism.board = res.board?res.board:''
            })
      },
      show(pageNo) {
        this.beforeShow(pageNo)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          name: this.name,
          operationFlag:this.operationFlag
        };
        Object.assign(params,this.address)
        services.mechanism_list(params)
        .then((res) => {
            this.listSuccessCb(res)
        })
        .catch((err) => {
            this.listExceptionCb(err)
        })
      },
      handleAdd(){
        this.addDialogVisible = true;
        this.mechanismInit()
      },
      handleSubmit(){
        this.$refs.mechanism.validate((valid) => {
          if (valid) {
                let params = JSON.parse(JSON.stringify(this.mechanism));
                if(this.mechanism.registerDate){
                   params.registerDate = Date.parse(this.mechanism.registerDate);
                }
                params.teachEnvImgJsons = JSON.stringify(this.envImgSrcList);
                params.doorImgJsons = JSON.stringify(this.doorImgList)

                if(!this.mechanism.id){
                    params.loginname=this.mechanism.phone
                    services.user_verification({loginname:params.loginname}).then(res=>{
                        if(res.data.status==0){
                            services.mechanism_save(params)
                            .then((data) => {
                                if(data.data.status==0){
                                    this.addDialogVisible = false;
                                    this.mechanismInit()
                                    this.show();
                                }
                            })
                            .catch(function(error){
                                console.log('error值：', error)
                            })
                        }
                    })
                }
                else{
                    params.id=this.mechanism.id
                    services.mechanism_update(params)
                    .then((data) => {
                        if(data.data.status==0){
                            this.addDialogVisible = false;
                            this.mechanismInit()
                            this.show(this.pageNo);
                        }
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
      cancelSearch (){
        this.name = null;
        this.operationFlag=null;
        this.address={}
        this.show();
      },
      imgSrc (qiniuName) {
        if(!qiniuName)return
        if (qiniuName.indexOf('http://') > -1) {
            return qiniuName.replace('imageslim', 'imageView2/2/w/100')
        }
        return cfg.baseDomain + qiniuName + '?imageView2/2/w/100'
      },
      mechanismInit(){
        this.mechanism={
            id: null,
            name: '',
            registerDate: '',
            loginname: '',
            contact: '',
            phone: '',
            gender: '',
            province: '',
            city: '',
            county: '',
            tellphone: '',
            teachRange: '',
            briefIntro: '',
            verified: 0,
            classservice: 0,
            orgId:"",//页面上没有，添加之后会返回，需要该值修改数据
            address:"",
            board:"",
            nature:"",
            address:"",
            tellphone:"",
            headmaster:"",
            legal:"",
            fireCertificateImg:"",
            logo:"",
            teachingLicenseImg:"",
            businessLicenseImg:"",
            operationFlag:""
        }
        this.envImgSrcList = []
        this.doorImgList=[]
      },
      approve(id){
            this.approveDialogVisible = true;
            services.mechanism_detail({id}).then(data=>{
                let res=data.data.data
                Object.keys(this.mechanism).forEach(key=>{
                    this.mechanism[key]=res[key]
                })
                this.mechanism.provinceName=res.provinceName
                this.mechanism.cityName=res.cityName
                this.mechanism.countyName=res.countyName
            })
      },
      approveSucc(){
            services.mechanism_pass({id:this.mechanism.id})
            .then(data=>{
                    let res=data.data
                    if(res.status==0){
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.approveDialogVisible=false;
                        this.mechanismInit()
                        this.show(this.pageNo);
                    }
                    else{
                        this.$message.error(res.msg);
                    }
            })
            .catch(function(error){
                console.log('error值：', error)
            })
      },
      approveFail(){
          this.$prompt('请填写审核失败原因', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /.+/,
                inputErrorMessage: '请输入失败原因'
            }).then(({ value }) => {
                services.mechanism_deny({id:this.mechanism.id,reason:value})
                .then((data) => {
                    let res=data.data
                    if(res.status==0){
                        this.approveDialogVisible=false;
                        this.mechanismInit()
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.show(this.pageNo);
                    }
                    else{
                        this.$message.error(res.msg);
                    }
                })
                .catch(function(error){
                    console.log('error值：', error)
                })
            })
      },
      handleEval(orgId,orgName){
        this.evalOption.orgId=orgId
        this.evalOption.orgName=orgName
        this.evalOption.orgType=orgTypeRole.edu
        this.evalDialogVisible=true
      },
    }
  }
</script>
<style scoped lang="less">
  .seach .el-input {
    width: 150px;
  }

  .seach .el-select {
    width: 150px;
  }
  
  .approveDialog{
      table{
          tr{
            td{
                padding:10px;
            }
            td:first-child{
                vertical-align: top;
                width:100px;
                text-align: right;
            }
            td:last-child{
                text-align: left;
                img{
                    width:100px;
                }
            }
          }
        
      }
  }
</style>
<style lang="less">
#institution{
    .imgUpload,.formSelect{
        label{
            width:140px;
        }
    }
}
</style>
