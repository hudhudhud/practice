<template>
    <section class="page">
        <header-login title="欢迎注册">
            <div slot="right" class="tip">
                <span>已有账号？</span>
                <router-link to="/Login">立即登录</router-link>
            </div>
        </header-login>
        <div class="content">
            <div class="register-form">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" >
                    <el-form-item  prop="username">
                        <el-input v-model="ruleForm.username" placeholder="创建用户名" prefix-icon="fa fa-user"/>
                    </el-form-item>
                    <el-form-item  prop="phone">
                        <el-input v-model.number="ruleForm.phone" placeholder="请输入手机号码" prefix-icon="fa fa-mobile"/>
                    </el-form-item>
                    <el-form-item  prop="registerCode" :error="errMsg_yzm" class="yzm">
                        <el-input v-model="ruleForm.registerCode" placeholder="请输入短信验证码" prefix-icon="fa fa-mobile"/>
                        <el-button type="text" @click="codeBtnAction" :disabled="captchaDisable">
                            {{codeBtnValue}}
                        </el-button>
                    </el-form-item>
                    <el-form-item  prop="password">
                        <el-input v-model="ruleForm.password" placeholder="设置6至20位登录密码" type="password" prefix-icon="fa fa-unlock-alt"/>
                    </el-form-item>
                    <el-form-item  prop="ensurePassword">
                        <el-input v-model="ruleForm.ensurePassword" placeholder="请再次输入登录密码" type="password" prefix-icon="fa fa-unlock-alt"/>
                    </el-form-item>
                    <p class="clearfix rem">
                        <el-checkbox v-model="ruleForm.agreement" @change="agreementFunc"><span>勾选同意</span></el-checkbox>
                        <router-link to="url?"><span class="link">《用户服务协议》</span></router-link>
                    </p>
                    <el-button type="primary" :disabled="registerDisable" @click="registerBtnAction" class="submit">注册</el-button>
                    <el-form-item :error="regMsg">
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <Footer/>
    </section>
</template>

<script>
import HeaderLogin from '@/components/HeaderLogin.vue'
import myaxios from "../assets/js/myaxios";
import Footer from '@/components/Footer.vue'
import md5 from 'js-md5'
import {
    Input,
    Button,
    Checkbox,
    Form,
    FormItem
}
from "element-ui";
export default {
    components: {
        Footer,
        HeaderLogin,
        elInput: Input,
        elButton: Button,
        elCheckbox: Checkbox,
        elForm: Form,
        elFormItem: FormItem
    },
    data() {
        return {
            regMsg: '',
            errMsg_yzm: '',
            captchaDisable: true,
            codeBtnValue: '点击发送验证码',
            agreement: false,
            registerDisable: true,
            ruleForm: {
                phone: '',
                username: '',
                registerCode: '',
                password: '',
                ensurePassword: '',

            },
            rules: {
                phone: [
                    {required: true, validator: this.checkPhone, trigger: 'change'}
                ],
                username: [
                    {required: true, validator: this.checkUsername, trigger: 'blur'}
                ],
                registerCode: [
                    {required: true, validator: this.checkRegisterCode, trigger: 'blur'}
                ],
                password: [
                    {required: true, validator: this.checkPassword, trigger: 'blur'}
                ],
                ensurePassword: [
                    {required: true, validator: this.checkEnsurePassword, trigger: 'blur'}
                ],
            }
        };
    },
    methods: {
        checkPhone(rule, value, callback) {
            if (!value) {
                this.captchaDisable = true;
                return callback(new Error('手机号不能为空'));

            } else {
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                if (reg.test(value)) {

                    callback();
                    this.captchaDisable = false
                } else {
                    this.captchaDisable = true;
                    return callback(new Error('请输入正确的手机号'));
                }
            }
        },
        checkUsername(rule, value, callback) {
            if (!value) {
                return callback(new Error('用户名不能为空'))
            } else {
                callback();
            }
        },
        checkRegisterCode(rule, value, callback) {
            if (!value) {
                return callback(new Error('短信验证码不能为空'))
            } else {
                const reg = /^\d{6}$/;
                if (reg.test(value)) {
                    callback()
                } else {
                    return callback(new Error('请输入正确的短信验证码'))
                }
            }
        },
        checkPassword(rule, value, callback) {
            if (!value) {
                return callback(new Error('密码不能为空'))
            } else {
                if (value.length < 8) {
                    return callback(new Error('密码长度不能小于8位'))
                } else if (value.length > 20) {
                    return callback(new Error('密码长度不能大于20位'))
                } else {
                    callback();
                }
            }
        },
        checkEnsurePassword(rule, value, callback) {
            if (value !== this.ruleForm.password) {
                return callback(new Error('两次密码不匹配'))
            } else {
                callback();
            }
        },

        codeBtnAction: function () {
            //发送请求
            myaxios.post('/web/register/sendMsg' , {phone: this.ruleForm.phone})
                .then(data => {
                    console.log(data);
                    if (data.data.code != 0) {
                        this.errMsg_yzm = data.data.msg
                    }
                }).catch(e=>{
                    console.log(e)
                });

            let timelen = 60;
            var interval = setInterval(() => {
                this.codeBtnValue = timelen - 1 + '秒后重新发送';
                timelen--;
                this.captchaDisable = true;
                if (timelen == 0) {
                    clearTimeout(interval);
                    this.codeBtnValue = '重新发送验证码';
                    this.captchaDisable = false
                }
            }, 1000);

        },
        agreementFunc: function () {
            if (this.agreement) {

                this.agreement = false;
                this.registerDisable = true
            } else {
                this.agreement = true;
                this.registerDisable = false
            }
        },
        validateForm() {
            let flag = false
            this.$refs['ruleForm'].validate((valid) => {
                flag = valid
            })
            return flag
        },
        registerBtnAction: function () {
            if (this.validateForm()) {
                let password1 = md5(this.ruleForm.password);
                let password2 = md5(this.ruleForm.ensurePassword);
                myaxios.post('/web/static/register', {
                        username: this.ruleForm.username,
                        phone: this.ruleForm.phone,
                        markCode: this.ruleForm.registerCode,
                        password1: password1,
                        password2: password2
                })
                    .then(data => {
                        console.log(data);
                        if (data.data.code == 0) {
                            this.$router.push("/Login")
                        } else {
                            this.regMsg = data.data.msg
                        }
                    });
            }
        }
    }

}
</script>
<style scoped lang="less">
 .page{
     position:relative;
     padding-bottom:@footerHeight;
     box-sizing: border-box;
     footer{
         position:absolute;
         bottom:0;
     }
 }
.tip{
    width:160px;
    margin:auto;
    color:#fff;
    font-size:14px;
    a{
        color:#fff;
    }
}
.register-form{
    margin-top:10px;
     padding-top:70px;
     background-color: #fff;
     width:100%;
     height: 600px;
     box-sizing: border-box;
     .rem{
         padding-bottom:23px;
         span{
            color:#000;
            opacity:0.54;
            font-size:14px;
            &.link{
                text-decoration: underline;
            }
         }
     }
}

</style>
<style lang="less">
.register-form{
    .el-form{
        width:372px;
        margin:auto;
        .el-form-item__content {
            height: 50px;
            line-height:0;
        }
        .el-input__inner{
            height: 50px;
        }
        .submit{
            width:100%;
            height: 50px;
            background-color:@mainColor;
            color:#fff;
            font-size:18px;
            font-weight:bold;
            border:none;
            outline:none;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: @mainColor;
            border-color: @mainColor;
        }
        .el-checkbox__input.is-checked+.el-checkbox__label {
            color: @mainColor;
        }
        .el-input.is-active .el-input__inner, .el-input__inner:focus {
            border-color:@mainColor;
            outline: 0;
        }
        .yzm{
            position:relative;
            .el-button{
                height:50px;
                position:absolute;
                right:30px;
                
            }
        }
    }
}
</style>