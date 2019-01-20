<template>
    <form class="org-account">
        <formInput  :item="{label:'机构名称',key:'name',required:true,style:'width:200px;',disabled:true}" :model.sync="accountInfo.name"  ref="name"/>
        <formSelect :option="{label:'性质',list:naturesList,disabled:true}" :kv="{k:'name',v:'code'}" :model.sync="accountInfo.nature"/>
        <imgUpload  :item="{label:'LOGO',key:'logo',type:'form-url',required:true,disabled:true}" :url.sync="accountInfo.logo" />
        <imgUpload  :item="{label:'门头',key:'doorImg',required:true,multiple:true,disabled:true}"   :model.sync="doorImgList"/>
        <div class="form-line">
            <label class="label">入驻时间</label>
            <el-date-picker v-model="accountInfo.registerDate" type="date" disabled>
            </el-date-picker>
        </div>
        <formInput  :item="{label:'负责人',key:'contact',required:true,disabled:true}" :model.sync="accountInfo.contact" ref="contact"/>
        <formInput  :item="{label:'联系电话',key:'phone',required:true,type:'phone',disabled:true}" :model.sync="accountInfo.phone" ref="phone"/>
        <formInput  :item="{label:'登录用户名',key:'loginname',required:true,disabled:true,}"  :model.sync="accountInfo.loginname"/>
         <div class="form-line">
            <label class="label">所属省市区</label>
            <addressSel  @handelChoose="handleChoose" :addOptions="area" :disabled="true"/>
        </div>
        <formInput  :item="{label:'机构地址',key:'address',disabled:true}"  :model.sync="accountInfo.address"/>
        <formInput  :item="{label:'机构电话',key:'tellphone',disabled:true}"  :model.sync="accountInfo.tellphone"/>
        <formInput  :item="{label:'机构简介',key:'briefIntro',disabled:true}"  :model.sync="accountInfo.briefIntro"/>
        <formInput  :item="{label:'机构校长',key:'headmaster',disabled:true}"  :model.sync="accountInfo.headmaster"/>
        <formInput  :item="{label:'机构法人',key:'legal',disabled:true}"  :model.sync="accountInfo.legal"/>
        <formInput  :item="{label:'办学内容',key:'teachRange',disabled:true}"  :model.sync="accountInfo.teachRange"/>
        <imgUpload  :item="{label:'教学环境',key:'envImg',multiple:true,maxLen:20,disabled:true}"  :model.sync="envImgSrcList"/>
        <imgUpload  :item="{label:'营业执照',key:'businessLicenseImg',type:'form-url',disabled:true}"   :url.sync="accountInfo.businessLicenseImg"/>
        <imgUpload  :item="{label:'办学许可证',key:'teachingLicenseImg',type:'form-url',disabled:true}" :url.sync="accountInfo.teachingLicenseImg"/>
        <imgUpload  :item="{label:'消防证书',key:'fireCertificateImg',type:'form-url',disabled:true}"   :url.sync="accountInfo.fireCertificateImg"/>
        <!-- <div class="form-line">
            <label class="label" >是否认证</label>
            <el-radio-group v-model="accountInfo.verified">
                <el-radio  :label="1">是</el-radio>
                <el-radio  :label="0">否</el-radio>
            </el-radio-group>
        </div>
        <div class="form-line">
            <label class="label">是否为训练营</label>
            <el-radio-group v-model="accountInfo.classservice">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
            </el-radio-group>
        </div>
        <div class="form-line">
            <label class="label">红白黑等级</label>
            <el-radio-group v-model="accountInfo.board">
                <el-radio  label="红榜">红榜</el-radio>
                <el-radio  label="白榜">白榜</el-radio>
                <el-radio  label="黑榜">黑榜</el-radio>
                <el-radio  label="">无</el-radio>
            </el-radio-group>
        </div>
        <div class="form-line">
            <label class="label">运营情况</label>
            <el-radio-group v-model="accountInfo.operationFlag">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
        </div> -->
        <!-- <div class="sub-btns-left" >
            <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div> -->
    </form>
</template>

<script>
import cfg from '../../config/config'
import services from '../../services'
import formInput from '../../component/formInput'
import addressSel from '../../modulePage/addressSelect'
import imgUpload from '../../component/imgUpload'
import formSelect from '../../component/formSelect'
export default {
    components: {
        formInput,
        addressSel,
        imgUpload,
        formSelect
    },
    data(){
        return {
            area:{address:[]} ,
            accountInfo:{
                id:"",
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
            },
            envImgSrcList:[],
            doorImgList:[],
            naturesList:[],
        }
    },
    created(){
        services.mechanism_naturesList().then(data=>{
            this.naturesList=data.data.data
        })
        services.mechanism_detailAccount().then(data=>{
            let res=data.data.data
            Object.keys(this.accountInfo).forEach(key=>{
                this.accountInfo[key]=res[key]
            })
            this.accountInfo.classservice=(res.classserviceStatus=="service")?1:0
            this.accountInfo.verified=(res.registerStatus=="verified")?1:0 //认证状态(committed/未认证,verified/已认证)
            this.area.address=[res.province,res.city,res.county]
            this.envImgSrcList = res.teachEnvImgs.map(item=>{item.imageUrl=item.fileHash;item.imageName=item.fileHash;return item})
            this.doorImgList = res.doorImgs.map(item=>{item.imageUrl=item.fileHash;item.imageName=item.fileHash;return item})
        })
    },
    methods:{
        handleSubmit(){
            let complete = Object.keys(this.accountInfo).every(key=>{
                if(this.$refs[key]&&this.$refs[key].item){
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

            let params = JSON.parse(JSON.stringify(this.accountInfo));
            if(this.accountInfo.registerDate)
                params.registerDate = Date.parse(this.accountInfo.registerDate);
            params.teachEnvImgJsons = JSON.stringify(this.img.env.map(img => {
                return {fileHash: img.imageName}
            }));
            params.doorImgJsons = JSON.stringify([{fileHash: this.img.logo.imageName}]);

            services.mechanism_update(params)
            .then((data) => {
                let res=data.data
                if(res.status==0){
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                }
                else{
                    this.$message.error(res.msg);
                }
            })
            .catch(function(error){
                console.log('error值：', error)
            })
        },
        handleChoose (value, status) {
            this.accountInfo.province = value.province;
            this.accountInfo.city = value.city;
            this.accountInfo.county = value.county;
        },
    }
}
</script>

<style lang="less" scoped>
.label{
    display: inline-block;
    width:100px;
    text-align: right;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

</style>
<style lang="less">
.org-account{
    .formInput{
        label{
            width:100px;
        }
        .el-input{
            width:200px;
        }
    }
    .imgUpload{
        label{
            width:100px;
        }
    }
    .formSelect{
        label{
            width:100px;
        }
    }
}
</style>
