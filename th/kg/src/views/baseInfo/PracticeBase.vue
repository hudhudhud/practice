<template>
    <div id="practiceBase">
        <div class="search form-search">
            <label >运营情况</label>
            <formSelect :option="{list:selectDown.operationFlag}" style="display:inline-block;" :model.sync="operationFlag"/>
            <label >省市区</label>
            <addressSel  :addOptions="searchAdd" @handelChoose="searchAreaChange"></addressSel>
            <el-input v-model="name" style="width:150px;margin-left:10px" placeholder="请输入检索名称"></el-input>
            <el-button icon="el-icon-search" @click.native="show">搜索</el-button>
            <el-button @click="cancelSearch">重置</el-button>
            <el-button type="primary" @click="handleAdd" class="fr">添加</el-button>
        </div>
        
        <!--表-->
        <base-table v-loading="loading" :columns="columns" :list="list" @handleEdit='handleEdit'>
            <template slot-scope="{scope}" slot="operationFlag">
                <span>
                    {{selectDown.getLabel(selectDown.operationFlag,scope.row.operationFlag)}}
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
         <!--新增修改-->
        <el-dialog :title="praticeBase.id?'修改基地信息':'添加基地信息'" :visible.sync="addDialogVisible" width="50%"  @closed="praticeBaseInit">
            <el-form :model="praticeBase" ref="praticeBase" :rules="rules" label-width="140px" label-position="right">
                <el-row :gutter="30">
                    <el-col :span="30">
                        <el-form-item label="基地名称" prop="name">
                            <el-input v-model="praticeBase.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" class="top">
                    <el-col :span="30">
                        <el-form-item label="所属省市区" prop="zone">
                            <addressSel :addOptions="addOptions2Add" @handelChoose="handleChoose2Add"></addressSel>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <imgUpload  :item="{label:'LOGO',key:'logo',type:'form-url',}" :url.sync="praticeBase.logo" />
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
                            <el-date-picker v-model="praticeBase.registerDate" type="date">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="负责人" prop="contact">
                            <el-input v-model="praticeBase.contact"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model="praticeBase.phone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" class="top" >
                    <el-col :span="30">
                        <el-form-item label="基地地址" prop="address">
                            <el-input v-model="praticeBase.address"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" class="top" >
                    <el-col :span="30">
                        <el-form-item label="基地电话" prop="tellphone">
                            <el-input v-model="praticeBase.tellphone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="基地简介" prop="briefIntro">
                            <el-input v-model="praticeBase.briefIntro"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="30">
                        <el-form-item label="红白黑等级" prop="">
                            <el-radio-group v-model="praticeBase.board">
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
                            <el-radio-group v-model="praticeBase.operationFlag">
                                <el-radio :label="item.value" v-for='(item,i) in selectDown.operationFlag' :key="i">{{item.label}}</el-radio>
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
    </div>
</template>
<script>
  import services from '../../services'
  import imgUpload from '../../component/imgUpload.vue'
  import addressSel from '../../modulePage/addressSelect.vue'
  import formSelect from '../../component/formSelect.vue'
  import pageMix from '../../mixins/pagerList'
  import {selectDown} from '../../assets/js/const.js'
  export default {
    mixins: [pageMix],
    components: {
      addressSel,
      imgUpload,
      formSelect
    },
    data() {
      return {
        name: '', 
        addDialogVisible: false,
        doorImgList:[],
        praticeBase: {},
        addOptions2Add: {
          size: '',
          address: ''
        },
        rules: {
            name: [{ required: true, message: '请输入基地名称', trigger: 'blur' },],
            contact: [{ required: true, message: '请输入负责人', trigger: 'blur' },],
            phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' },],
            address: [{ required: true, message: '请输入基地地址', trigger: 'blur' },],
            tellphone: [{ required: true, message: '请输入基地电话', trigger: 'blur' },]
        },
        approveDialogVisible:false,
        operationFlag:"",
        searchAdd:{
            address:[]
        },
        selectDown,
        columns:[
            { key: 'name', title: '基地名称' },
            { key:'operationFlag',title: '运营情况',slot:'operationFlag'},
            { key:'contact',title: '负责人'},
            { key:'phone',title: '联系电话'},
            { key:'',title: '所属区域',slot:'address'},
            { key:'registerDate',title: '入驻时间'},
            {
                  title: '操作', type: 'operate',
                  operates: [
                      {name: '编辑',emitKey: 'handleEdit'}
                  ]
            }
        ]
      }
    },
    created: function() {
        this.praticeBaseInit()
    },
    methods: {
        handleEdit({id}) {
            this.addDialogVisible = true;
            services.practiseBase_detail({id}).then(data=>{
                let res=data.data.data
                Object.keys(this.praticeBase).forEach(key=>{
                    this.praticeBase[key]=res[key]
                })
                this.addOptions2Add.address=[res.province,res.city,res.county]
                this.praticeBase.board = res.board?res.board:''
                this.doorImgList= res.doorImgs.map(item=>{item.imageUrl=item.fileHash;return item})
            })
        },
        show(pageNo) {
            this.beforeShow(pageNo)
            let params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                name: this.name,
                operationFlag:this.operationFlag,
                province:this.searchAdd.address[0],
                city:this.searchAdd.address[1],
                country:this.searchAdd.address[2],
            };
            services.practiseBase_list(params)
            .then((res) => {
                this.listSuccessCb(res)
            })
            .catch((err) => {
                this.listExceptionCb(err)
            })
        },
        handleAdd(){
            this.addDialogVisible = true;
            this.praticeBaseInit()
        },
        handleSubmit(){
            this.$refs.praticeBase.validate((valid) => {
            if (valid) {
                    let params = JSON.parse(JSON.stringify(this.praticeBase));
                    if(this.praticeBase.registerDate)
                        params.registerDate = Date.parse(this.praticeBase.registerDate);
                    params.doorImgJsons = JSON.stringify(this.doorImgList)

                    if(!this.praticeBase.id){
                        services.practiseBase_save(params)
                            .then((data) => {
                                if(data.data.status==0){
                                    this.addDialogVisible = false;
                                    this.praticeBaseInit()
                                    this.show();
                                }
                            })
                            .catch(function(error){
                                console.log('error值：', error)
                            })
                        }
                    else{
                        params.id=this.praticeBase.id
                        services.practiseBase_update(params)
                        .then((data) => {
                            if(data.data.status==0){
                                this.addDialogVisible = false;
                                this.praticeBaseInit()
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
        handleChoose2Add (value, status) {
            this.praticeBase.province = value.province;
            this.praticeBase.city = value.city;
            this.praticeBase.county = value.county;
        },
        searchAreaChange(value, status){
            this.searchAdd.address[0]= value.province;
            this.searchAdd.address[1] = value.city;
            this.searchAdd.address[2] = value.county;
        },
        cancelSearch (){
            this.name = null;
            this.operationFlag=null;
            this.searchAdd={address:[]}
            this.show();
        },
        praticeBaseInit(){
            this.praticeBase={
                id: null,
                name: '',
                registerDate: '',
                contact: '',
                phone: '',
                province: '',
                city: '',
                county: '',
                tellphone: '',
                briefIntro: '',
                classservice: 0,
                orgId:"",
                address:"",
                tellphone:"",
                logo:"",
                operationFlag:"",
                board:""
            }
            this.addOptions2Add.address=[]
            this.doorImgList=[]
        },
    }
  }
</script>
<style scoped lang="less">
 
</style>
<style lang="less">
#practiceBase{
    .imgUpload{
        label{
            width:140px;
        }
    }
}
</style>
