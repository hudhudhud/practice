<template>
    <section class="reg-page">
        <div class="content">
            <header>
                
            </header>
            <div class="con">
                <div  class="form-con">
                    <img src="../assets/img/jgzc.png" alt="" class="jgzc-img">
                    <form>
                        <formInput   :item="{key:'name',required:true,placeholder:'请输入机构名称',emptyMsg:'机构名称不能为空！'}" :model.sync="registerInfo.name" ref="name"/>
                        <formInput   :item="{key:'phone',required:true,placeholder:'请输入手机号',emptyMsg:'手机号不能为空！',rule:'^1(3|4|5|7|8)\\d{9}$',errorMsg:'手机号格式输入有误!'}"   :model.sync="registerInfo.phone" ref="phone"/>
                        <div class="yzm">
                            <formInput   :item="{key:'smsCode',required:true,placeholder:'请输入验证码',emptyMsg:'验证码不能为空！'}"  :model.sync="registerInfo.smsCode" ref="smsCode"/>
                            <span class="yzm-btn" v-if="!count" @click="getyzm">获取验证码</span>
                            <span class="yzm-btn" v-if="count">{{count+"s"}}</span>
                        </div>
                        <formInput   :item="{key:'password',required:true,placeholder:'请输入密码',emptyMsg:'密码不能为空！',type:'password'}"  :model.sync="registerInfo.password" ref="password"/>
                        <div class="address-select" >
                            <label>机构地址</label>
                             <addressSelect  @handelChoose="handleChoose" :addOptions="area" />
                        </div>
                        <formInput   :item="{key:'address',required:true,placeholder:'请输入机构具体地址',emptyMsg:'机构具体地址不能为空！'}"  :model.sync="registerInfo.address" ref="address"/>
                        <formInput   :item="{key:'contact',required:true,placeholder:'请输入机构负责人',emptyMsg:'机构负责人不能为空！'}"  :model.sync="registerInfo.contact" ref="contact"/>
                        <formInput   :item="{key:'teachRange',required:true,placeholder:'请输入授课范围',emptyMsg:'授课范围不能为空！'}"  :model.sync="registerInfo.teachRange" ref="teachRange"/>
                        <div class="clearfix file-upload">
                            <imgUpload  :item="{label:'上传营业执照',key:'yyzz',type:'one'}" :model.sync="img.businessLicense" class="fl"/>
                            <imgUpload  :item="{label:'上传消防证书',key:'xfzs',type:'one'}" :model.sync="img.fireCertificateImg" class="fr"/>
                        </div>
                        <el-button  @click="submit" class="submit-btn">提交注册</el-button>
                        <p class="msg">机构信息需审核后才能完成注册，如造成不便，请谅解。</p>
                    </form>
                </div>
            </div>
            <div class="confirm-dialog" v-if="sureDialogVisible" @click="sureDialogVisible=false">
                <div class="confirm">
                    <p class="tit">温馨提示</p>
                    <p class="msg">您的注册信息已提交，请耐心等待～</p>
                    <el-button @click="sureDialogVisible=false" class="sure-dialog-btn">确定</el-button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import  formInput from '../component/formInput'
import  addressSelect from '../modulePage/addressSelect'
import  imgUpload from '../component/imgUpload'
import cfg from '../config/config'
import services from '../services'

export default {
    components: {
        formInput,
        addressSelect,
        imgUpload
    },
    data(){
        return {
            area:{address:[]},
            img:{
                businessLicense:{},
                fireCertificateImg:{},
            },
            registerInfo:{
                name:"",
                phone:"",
                smsCode:"",
                password:"",
                address:"",
                contact:"",
                teachRange:"",
                province:"",
                city:"",
                county:"",
            },
            count:0,
            timeId:"",
            sureDialogVisible:false,
        }
    },
    beforeDestroy () {
        if(this.timeId)clearInterval(this.timeId)
    },
    methods:{
        handleChoose (value, status) {
            this.registerInfo.province = value.province;
            this.registerInfo.city = value.city;
            this.registerInfo.county = value.county;
        },
        getyzm(){
            if(this.$refs.phone.check()){
                this.count=120;
                if(this.timeId)clearInterval(this.timeId)
                this.timeId= setInterval(()=>{
                    if(this.count>0)
                        this.count--
                    else{
                        clearInterval(this.timeId)
                    }
                },1000)
                services.mechanism_RegisMechanismCode({loginname:this.registerInfo.phone})
                .then(data=>{
                    let res=data.data
                    if(res.status==0){
                        this.$message({
                            message: '验证码发送成功',
                            type: 'success'
                        });
                    }
                    else{
                        this.count=0
                        clearInterval(this.timeId)
                        this.$message.error(res.msg);
                    }
                })
            }
        },
        submit(){
            let complete = Object.keys(this.registerInfo).every(key=>{
                if(this.$refs[key]&&this.$refs[key].item){
                    return this.$refs[key].check()
                }
                else{
                    return true
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

            let params={}
            params=this.registerInfo
            params.loginname=this.registerInfo.phone
            params.businessLicenseImgJsons=JSON.stringify([{fileHash: this.img.businessLicense.imageName}]);
            params.fireCertificateImgJsons=JSON.stringify([{fileHash: this.img.fireCertificateImg.imageName}]);

            services.mechanism_register(params)
            .then((data) => {
                let res=data.data
                if(res.status==0){
                    this.sureDialogVisible=true;
                }
                else{
                    this.$message.error(res.msg);
                }
            })
            .catch(function(error){
                console.log('error值：', error)
            })
        },
    }
}
</script>

<style lang="less" scoped>
@contentWidth:1400px;
section{
    *{xbackground-color:rgba(0,0,0,0.1)}
    background-color:#350b75;
    width:100%;
    min-width: @contentWidth;
    min-height: 100%;
    .content{
        width:100%;
        margin:auto;
        header{
            height: 80px;
        }
        .con{
            margin-top:42px;
            width:100%;
            background-image: url('../assets/img/regbgk.png');
            background-repeat: no-repeat;
            background-size: cover;
            .form-con{
                box-sizing: border-box;
                padding-top:33px;
                .jgzc-img{
                    margin:auto;
                    display: block;
                    width:242px;
                }
                margin:auto;
                width:707px;
                height: 1354px;
                background-image: url('../assets/img/formbgk.png');
                background-repeat: no-repeat;
                background-size: cover;
                .file-upload{
                    padding-left:83px;
                    padding-right: 83px;
                }
                form{
                    &>*{
                        margin-top:30px;
                    }
                }
                .submit-btn{
                    display: block;
                    margin:auto;
                    width:540px;
                    height: 58px;
                    background-color:#dbcc2e;
                    font-size:28px;
                    font-weight:600;
                    color:rgba(49,19,93,1);
                    line-height:40px;
                    border-radius:29px;
                    margin-top:80px;
                }
                .msg{
                    text-align: center;
                    font-size:18px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(156,134,189,1);
                    line-height:40px;
                    opacity:0.6;
                }
                .address-select{
                    label{
                        color:#fff;
                        font-size:18px;
                        font-weight:400;
                        color:rgba(255,255,255,1);
                        line-height:40px;
                        opacity:0.6;
                        margin-right: 5px;
                    }
                    padding-left:83px;
                }
                .yzm{
                    position:relative;
                    .yzm-btn{
                        position:absolute;
                        right: 100px;
                        top: 10px;
                        color:#fff;
                        cursor:pointer;
                    }
                }
            }
        }
        .confirm-dialog{
            position:fixed;
            top:0;
            bottom:0;
            left:0;
            right:0;
            background-color:rgba(0,0,0,0.5);
            min-width: @contentWidth;
            .confirm{
                margin:auto;
                margin-top:296px;
                width:707px;
                height: 334px;
                background-image: url('../assets/img/confirm.png');
                background-repeat:no-repeat;
                background-size: cover;
                .tit{
                    text-align: center;
                    font-size:20px;
                    font-weight:bold;
                    color:rgba(0,222,255,1);
                    padding-top:63px;
                }
                .msg{
                    padding-top:38px;
                    text-align: center;
                    font-size:16px;
                    font-weight:bold;
                    color:rgba(255,255,255,1);
                }
                .sure-dialog-btn{
                    width:228px;
                    height:46px;
                    background:rgba(250,219,9,1);
                    border-radius:23px;
                    font-size:18px;
                    font-weight:600;
                    color:rgba(49,19,93,1);
                    display: block;
                    margin:auto;
                    margin-top:88px;
                    box-shadow:0 0 20px 15px #4b277b;
                    outline: none;
                }
            }
        }
    }
}
</style>
<style lang="less">
.reg-page{
    form{
        .formInput{
            position:relative;
            height: 60px;
            padding:0;
            .el-input{
                width:540px;
                height: 58px;
                margin:auto;
                position: absolute;
                left: 0;
                right: 0;
                .el-input__inner{
                    background-color: #302275;
                    border-radius:29px;
                    border:none;
                    font-size:18px;
                }
                
            }
        }
        .addressSelect{
            .el-select{
                width:140px !important;
                height: 58px;
                &:not(last-child){
                    margin-right: 15px;
                }
                .el-input .el-input__inner{
                    border-radius: 29px;
                    background-color:#31135D;
                    border:none;
                    font-size:18px;
                }
            }
        }
        .imgUpload{
            display: inline-block;
            width:190px;
            height: 190px;
            .btn{
                width:190px;
                height:190px;
                background:rgba(49,19,93,1);
                border-radius:10px;
                i.fa-plus{
                    color:rgba(156,134,189,1);
                    opacity:0.6;
                    line-height: 190px;
                }
                .txt{
                    color:rgba(156,134,189,1);
                    line-height:40px;
                    opacity:0.6;
                }
            }
            .cover-img{
                width:190px;
                height: 190px;
                border:none;
                .close{
                    color:#fff;
                }
            }
        }
        .el-input__inner{
            &::-webkit-input-placeholder{
                color:rgba(156,134,189,1);
                opacity:0.6;
            }
            &::-moz-placeholder{   /* Mozilla Firefox 19+ */
                color:rgba(156,134,189,1);
                opacity:0.6;
            }
            &:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                color:rgba(156,134,189,1);
                opacity:0.6;
            }
            &:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
                color:rgba(156,134,189,1);
                opacity:0.6;
            }
        }
    }
}
</style>

