<template>
    <section>
        <div class="userCenter-form">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" >
                <el-form-item prop="email">
                    <el-input v-model="ruleForm.email" placeholder="请输入需要绑定的邮箱"/>
                </el-form-item>
                <el-form-item prop="emailCode" :error="errMsg_yzm" class="yzm">
                    <el-input v-model="ruleForm.emailCode" placeholder="请输入邮箱验证码" />
                    <el-button type="text" @click="codeBtnAction" :disabled="captchaDisable">
                        {{codeBtnValue}}
                    </el-button>
                </el-form-item>
                <el-form-item :error="regMsg" v-if="regMsg">
                </el-form-item>
                <el-button type="primary" @click="click" class="submit">绑定</el-button>
            </el-form>
        </div>
    </section>
</template>

<script>
     import {
        Input,
        Button,
        Form,
        FormItem,
        Message
    }from "element-ui";
     import myaxios from "../../assets/js/myaxios";
    export default {
        name: "UserEmail",
        components: {
            elInput: Input,
            elButton: Button,
            elForm: Form,
            elFormItem: FormItem
        },
        data() {
            return {
                regMsg:'',
                errMsg_yzm: '',
                captchaDisable: true,
                codeBtnValue: '点击发送验证码',
                ruleForm: {
                    email: '',
                    emailCode: '',
                },
                rules: {
                    email: [
                        {required: true, validator: this.checemail, trigger: 'change'}
                    ],
                     emailCode: [
                        {required: true, validator: this.checkemailCode, trigger: 'blur'}
                    ],
                }
            };
        },
        methods: {
            checemail(rule, value, callback) {
                if (!value) {
                    this.captchaDisable = true;
                    return callback(new Error('邮箱不能为空'));

                } else {
                    const reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                    if (reg.test(value)) {

                        callback();
                        this.captchaDisable = false
                    } else {
                        this.captchaDisable = true;
                        return callback(new Error('请输入正确的邮箱'));
                    }
                }
            },
            checkemailCode(rule, value, callback) {
                if (!value) {
                    return callback(new Error('邮箱验证码不能为空'))
                } else {
                    const reg = /^\d{6}$/;
                    if (reg.test(value)) {
                        callback()
                    } else {
                        return callback(new Error('请输入正确的邮箱验证码'))
                    }
                }
            },
            codeBtnAction: function () {
                //发送请求
                myaxios.post('/web/user/sendMail' , {mail: this.ruleForm.email})
                    .then(data => {
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
            validateForm() {
                let flag = false
                this.$refs['ruleForm'].validate((valid) => {
                    flag = valid
                })
                return flag
            },
            click(){
                if(this.validateForm()){
                    myaxios.post('/web/user/changeEmail',{
                        mail:this.ruleForm.email,
                        mailVerCode:this.ruleForm.emailCode,
                    }).then(data=>{
                        if (data.data.code == 0) {
                            Message({
                                type: 'success',
                                message: '修改成功'
                            });
                        }else {
                            this.regMsg = data.data.msg
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>