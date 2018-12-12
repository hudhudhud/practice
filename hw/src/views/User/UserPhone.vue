<template>
    <section>
        <div class="userCenter-form">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
                <el-form-item prop="oldphone">
                    <el-input v-model.number="ruleForm.oldphone" placeholder="请输入已绑定手机号码"/>
                </el-form-item>
                <el-form-item prop="registerCode" :error="errMsg_yzm" class="yzm">
                    <el-input v-model="ruleForm.registerCode" placeholder="请输入短信验证码"/>
                    <el-button type="text" @click="codeBtnAction" :disabled="captchaDisable">
                        {{codeBtnValue}}
                    </el-button>
                </el-form-item>
                <el-form-item  prop="newphone">
                    <el-input v-model.number="ruleForm.newphone" placeholder="请输入新手机号码"/>
                </el-form-item>
                <el-form-item :error="regMsg" v-if="regMsg">
                </el-form-item>
                <el-button type="primary" @click="click" class="submit">立即绑定</el-button>
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
        MessageBox
    } from "element-ui";
    import myaxios from "../../assets/js/myaxios";
    export default {
        name: "UserPhone",
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
                    oldphone: '',
                    newphone:'',
                    registerCode: '',
                },
                rules: {
                    oldphone: [
                        {required: true, validator: this.checkoldPhone, trigger: 'change'}
                    ],
                    newphone: [
                        {required: true, validator: this.checknewPhone, trigger: 'change'}
                    ],
                     registerCode: [
                        {required: true, validator: this.checkRegisterCode, trigger: 'blur'}
                    ],
                }
            };
        },
        mounted(){
        },
        methods: {
            checkoldPhone(rule, value, callback) {
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
            checknewPhone(rule, value, callback) {
                if (!value) {
                    this.captchaDisable = true;
                    return callback(new Error('手机号不能为空'));

                } else {
                    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                    if (reg.test(value)) {

                        callback();
                    } else {
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
            codeBtnAction: function () {
                //发送请求
                myaxios.post('/web/register/sendMsg' , {phone: this.ruleForm.oldphone})
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
            validateForm() {
                let flag = false
                this.$refs['ruleForm'].validate((valid) => {
                    flag = valid
                })
                return flag
            },
            click(){
                if(this.validateForm()){
                    myaxios.post('/web/user/changePhone',{
                        oldPhone:this.ruleForm.oldphone,
                        newPhone:this.ruleForm.newphone,
                        checkCode:this.ruleForm.registerCode
                    }).then(data=>{
                        if (data.data.code == 0) {
                            MessageBox({
                                title:'操作提示',
                                type: 'success',
                                message: '修改成功',
                            }).then(()=>{
                                 this.$router.push('/userCenter/info')
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

<style lang="less" scoped>

</style>
