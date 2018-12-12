<template>
    <section class="page">
        <header-login title="找回密码"/>
        <div class="content">
            <div class="findPassword-form">
                <div class="msg_box">
                    <el-steps :active="active" finish-status="success">
                        <el-step title="填写手机号"></el-step>
                        <el-step title="设置新密码"></el-step>
                        <el-step title="完成"></el-step>
                    </el-steps>
                    <div v-if="active==0" class="form-item">
                        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" >
                            <el-form-item  prop="phone">
                                <el-input v-model.number="ruleForm.phone" placeholder="请输入手机号码"/>
                            </el-form-item>
                            <el-form-item  prop="registerCode" :error="errMsg_yzm" class="yzm">
                                <el-input v-model="ruleForm.registerCode" placeholder="请输入短信验证码"/>
                                <el-button type="text" @click="codeBtnAction" :disabled="captchaDisable">
                                    {{codeBtnValue}}
                                </el-button>
                            </el-form-item>
                            <el-form-item :error="regMsg" v-if="regMsg"></el-form-item>
                            <el-button style="margin-top: 12px;" @click="next" class="submit">下一步</el-button>
                        </el-form>
                    </div>
                    <div v-else-if="active==1" class="form-item">
                        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" >
                            <el-form-item  prop="password">
                                <el-input v-model="ruleForm.password" placeholder="设置6至20位登录密码" type="password"/>
                            </el-form-item>
                            <el-form-item  prop="ensurePassword">
                                <el-input v-model="ruleForm.ensurePassword" placeholder="请再次输入登录密码" type="password"/>
                            </el-form-item>
                            <el-button style="margin-top: 12px;" @click="next" class="submit">下一步</el-button>
                        </el-form>
                    </div>
                    <div v-else-if="active==2" class="form-item">
                        <router-link to="/login">
                            <el-button style="margin-top: 12px;" @click="next" class="submit">登录</el-button>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </section>
</template>
<script>
    import HeaderLogin from '@/components/HeaderLogin.vue'
    import {Steps, Step, Button, Input, Form, FormItem} from 'element-ui'
    import myaxios from "../../assets/js/myaxios";
    import Footer from '@/components/Footer.vue'
    export default {
        components: {
            HeaderLogin,
            elSteps: Steps,
            elStep: Step,
            elButton: Button,
            elInput: Input,
            elForm: Form,
            elFormItem: FormItem,
            Footer,
        },
        data: function () {
            return {
                active: 0,
                captchaDisable: true,
                codeBtnValue: '点击发送验证码',
                errMsg_yzm: '',
                Disable:true,
                ruleForm: {
                    phone: '',
                    registerCode: '',
                    password: '',
                    ensurePassword: '',
                },
                rules: {
                    phone: [
                        {required: true, validator: this.checkPhone, trigger: 'change'}
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
                },
                regMsg:'',
            }
        },
        mounted() {

        },
        methods: {
            next() {
                if (this.validateForm()) {
                this.active++;
                }
            },
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
            validateForm() {
                let flag = false
                this.$refs['ruleForm'].validate((valid) => {
                    flag = valid
                })
                return flag
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
        },
    }
</script>
<style lang="less" scoped>
.page{
     position:relative;
     padding-bottom:@footerHeight;
     box-sizing: border-box;
     footer{
         position:absolute;
         bottom:0;
     }
}
.findPassword-form{
    width: 100%;
    background-color: #fff;
    padding-top:70px;
    height: 550px;
    box-sizing: border-box;
    margin-top:10px;
    .msg_box {
        width:600px;
        margin:auto;
    }

}
</style>

<style lang="less">
.form-item{
    padding:70px 0;
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

</style>