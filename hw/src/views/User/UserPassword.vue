<template>
    <section>
        <div class="userCenter-form">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
                <el-form-item prop="oldpassword">
                    <el-input v-model="ruleForm.oldpassword" placeholder="请输入原密码" type="password"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="ruleForm.password" placeholder="设置6至20位新密码" type="password"/>
                </el-form-item>
                <el-form-item prop="ensurePassword">
                    <el-input v-model="ruleForm.ensurePassword" placeholder="请再次输入新密码" type="password"/>
                </el-form-item>
                <el-form-item :error="regMsg" v-if="regMsg">
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="click" class="submit">确定</el-button>

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
    } from "element-ui";
    import myaxios from "../../assets/js/myaxios";
    export default {
        name: "UserPassword",
        components: {
            elInput: Input,
            elButton: Button,
            elForm: Form,
            elFormItem: FormItem
        },
        data() {
            return {
                regMsg:'',
                ruleForm: {
                    oldpassword: '',
                    password:'',
                    ensurePassword: '',
                },
                rules: {
                    oldpassword: [
                        {required: true, validator: this.checkPassword, trigger: 'change'}
                    ],
                    password: [
                        {required: true, validator: this.checkPassword, trigger: 'change'}
                    ],
                     ensurePassword: [
                        {required: true, validator: this.checkEnsurePassword, trigger: 'blur'}
                    ],
                }
            };
        },
        methods: {
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
            validateForm() {
                let flag = false
                this.$refs['ruleForm'].validate((valid) => {
                    flag = valid
                })
                return flag
            },
            click(){
                if(this.validateForm()){
                    myaxios.post('/web/user/changeUserPwd',{
                        oldPassword:this.ruleForm.oldpassword,
                        newPassword:this.ruleForm.password,
                        reNewPassword:this.ruleForm.ensurePassword
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