<template>
    <section class="page" id="login-page">
        <header-login title="欢迎登陆"/>
        <div class="content clearfix">
            <div class="fl hiwh">
                <img src="/img/hiwh-mid.png" alt="">
            </div>
            <div class="fr logContent">
                <el-tabs v-model="activeName" type="card" stretch>
                    <el-tab-pane label="微信扫一扫" name="wx">

                    </el-tab-pane>
                    <el-tab-pane label="账号登陆" name="account">
                        <form class="loginForm">
                            <!-- 输入用户名用el-input在ie上偶然会出现@input事件失灵的情况，所以换成原生input -->
                            <p class="el-input el-input--prefix">
                               <span class="el-input__prefix"><i class="el-input__icon fa fa-user"></i></span>
                                <input type="text"  placeholder="请输入用户账号"  v-model="account" @input="inputchange"
                                    @keyup.enter="login"
                                    ref="account" class="el-input__inner">
                            </p>
                            <el-input
                                    type="password"
                                    placeholder="请输入登录密码"
                                    prefix-icon="fa fa-lock"
                                    v-model="password"
                                    @input="inputchange"
                                    @keyup.enter.native="login"
                                    ref="password">
                            </el-input>
                            <p class="errInfo" v-if="errInfo"><i class="fa fa-exclamation-circle"
                                                                 aria-hidden="true"></i>{{errInfo}}</p>
                            <p class="clearfix rem">
                                <!--<el-checkbox v-model="remeberLogin" class="fl">记住登录状态</el-checkbox>-->
                                <router-link to="/forgetPassword" class="fr gray">忘记密码?</router-link>
                            </p>
                            <el-button @click="login" :disabled="disabled">{{btnMsg}}</el-button>
                            <p class="reg"><span class="gray">还没有账号?</span>
                                <router-link to="/Register" class="ljzc">立即注册</router-link>
                            </p>
                        </form>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <Footer/>
    </section>
</template>

<script>
    import {Input, Button, Tabs, TabPane, Checkbox,MessageBox} from 'element-ui'
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import myaxios from "../assets/js/myaxios";
    import HeaderLogin from '@/components/HeaderLogin.vue'
    import Footer from '@/components/Footer.vue'
    import md5 from 'js-md5'

    export default {
        components: {
            HeaderLogin,
            Footer,
            elTabs: Tabs,
            elTabPane: TabPane,
            elInput: Input,
            elCheckbox: Checkbox,
            elButton: Button,
        },
        data: function () {
            return {
                activeName: "account",
                account: "",
                password: "",
                errInfo: "",
                remeberLogin: false,
                btnMsg:"登录",
                disabled:false,
            }
        },
        mounted() {

        },
        computed: {
            ...mapGetters([
                'userInfo',
            ]),
        },
        methods: {
            ...mapMutations([
                'setUserInfo'
            ]),
            ...mapActions([
                'userInfoAsyn'
            ]),
            inputchange() {
                this.errInfo = ""
            },
            login() {
                if (!this.account) {
                    console.log(99999,this,this.account)
                    this.$refs.account.focus()
                    this.errInfo = "请输入用户账号！"
                    return
                }
                if (!this.password) {
                    this.$refs.password.focus()
                    this.errInfo = "请输入登录密码！"
                    return
                }
                //this.userNameAsyn(userInfo).then(()=>{})//调用异步

                this.disabled=true
                this.btnMsg="登录中..."
                //用户登录
                var password = md5(this.password)
                myaxios.post('/web/login',{username: this.account,password:password}).then((res) => {
                    res = res.data;
                    this.disabled=false
                    if (res.code == 0) {
                        this.btnMsg="登录成功"
                        this.setUserInfo(res.data)
                        //判断是否需要跳转到上一个页面
                        let redirect=this.$route.query.redirect
                        if(redirect){
                            //替换登录页的历史记录为上一个页面
                            this.$router.replace(redirect)
                        }else{
                            //替换登录页的历史记录为首页
                            this.$router.replace('/');
                        }
                    }
                    else {
                        this.btnMsg="登录"
                        this.$refs.account.focus()
                        this.errInfo = res.msg
                    }
                })
                .catch(err=>{
                    this.disabled=false
                    this.btnMsg="登录"
                    MessageBox({
                        title:'错误提示',
                        message:err.toString(),
                        type:'error'
                    })
                })

            }
        }
    }
</script>
<style lang="less" scoped>
    #login-page .content{
        width:1200px;
        .hiwh{
            margin-top:180px;
        }
        .logContent {
            margin-top:140px;
            width: 430px;
            height: 440px;
            background-color: #fff;
            box-shadow: 1px 1px 0 1px 1px rgba(0, 0, 0, 0.3);
            box-sizing: border-box;
            font-size: 14px;
            .loginForm {
                padding: 25px;
                .rem {
                    margin-top: 50px;
                }
                .reg {
                    margin-top: 10px;
                    text-align: center;
                }
                .errInfo {
                    margin-top: 10px;
                    color: red;
                    i {
                        margin-right: 5px;
                    }
                }
            }
            .gray{
                opacity: 0.5;
                color:#000;
            }
            .ljzc{
                color:@mainColor;
                opacity: 0.54;
            }

        }
    }
</style>
<style lang="less">
 #login-page{
     .el-tabs__item.is-active{
         color:@mainColor;
         border-bottom: 2px solid;
     }
     .el-tabs__item:hover{
         color:@mainColor;
     }
     .el-tabs__item{
        font-size:18px;
        border-left: none;
        height: 60px;
        box-sizing:border-box;
        line-height:60px;
     }
 }
.loginForm {
    .el-input {
        margin: auto;
        margin-top: 20px;
        display: block;
        width: 372px;
        height: 50px;
        .el-input__inner{
            height: 100%;
            line-height:50px;
        }
        &.err {
            .el-input__inner {
                border-color: red;
                transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
            }
        }
    }
    .el-input.is-active .el-input__inner, .el-input__inner:focus {
        border-color: @mainColor;
        outline: 0;
    }
    .el-button {
        width: 372px;
        height: 50px;
        background-color: @mainColor;
        color: #fff;
        margin-top: 20px;
        font-size:24px;
        font-family: "Microsoft YaHei";
    }
}
</style>

