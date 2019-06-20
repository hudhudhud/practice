<template>
    <section class="xpage">
        <header-login title="欢迎登陆"/>
             <div class="content-login clearfix">
                <div class="fr logContent">
                    <el-tabs v-model="activeName" type="card" stretch>
                        <el-tab-pane label="微信扫一扫" name="wx">
                            
                        </el-tab-pane>
                        <el-tab-pane label="账号登陆" name="account">
                            <div class="loginForm">
                                <el-input
                                    placeholder="请输入用户账号"
                                    prefix-icon="fa fa-user"
                                    v-model="account"
                                    @input="inputchange"
                                    ref="account">
                                </el-input>
                                <el-input
                                    placeholder="请输入登录密码"
                                    prefix-icon="fa fa-lock"
                                    v-model="password"
                                    @input="inputchange"
                                    ref="password">
                                </el-input>
                                <p class="errInfo" v-if="errInfo"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>{{errInfo}}</p>
                                <p class="clearfix rem" >
                                    <el-checkbox v-model="remeberLogin" class="fl">记住登录状态</el-checkbox>
                                    <router-link to="/forgetPassword" class="fr">忘记密码?</router-link>
                                </p>
                                <el-button @click="login">登录</el-button>
                                <p class="reg"><span>还没有账号?</span><router-link to="/Register">立即注册</router-link></p>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
      <!-- <footer-login /> -->
    </section>
</template>

<script>
import {Input,Button,Tabs,TabPane,Checkbox} from 'element-ui'    
import {mapGetters, mapMutations, mapActions} from 'vuex';
import axios from 'axios';
import HeaderLogin from '@/components/HeaderLogin.vue'
import FooterLogin from '@/components/FooterLogin.vue'
import md5 from 'js-md5'
export default {
  components:{
    HeaderLogin,
    FooterLogin,
    elTabs:Tabs,
    elTabPane:TabPane,
    elInput:Input,
    elCheckbox:Checkbox,
    elButton:Button,
  },
  data:function(){
    return {
      activeName:"account",
      account:"",
      password:"",
      errInfo:"",
      remeberLogin:false
    }
  },
  mounted(){

  },
  computed: {
        ...mapGetters([
            'userInfo',
        ]),
  },
  methods:{
        ...mapMutations([
            'setUserInfo'
        ]),
        ...mapActions([
            'userInfoAsyn'
        ]),
        inputchange(){
            this.errInfo=""
        },
        login(){
            if(!this.account){
                this.$refs.account.focus()
                this.errInfo="请输入用户账号！"
                return 
            }
            if(!this.password){
                this.$refs.password.focus()
                this.errInfo="请输入登录密码！"
                return
            }
          //this.userNameAsyn(userInfo).then(()=>{})//调用异步


          //用户登录
          //var password=md5(this.password)
          // axios.post('/api/login',{
          //   account:this.account,
          //   pwd:password,
          // }).then((res)=>{
          //   res=res.data;
          //   if(res.status===0){
          //     this.setUserInfo({
          //       id:res.userInfo.id,
          //       name:res.userInfo.name
          //     })
          //   }
          //   else{
         //      this.$refs.account.focus()
          //     this.errInfo=res.msg
          //   }
          // })

          //模拟登录操作
          setTimeout(()=>{
             var userInfo={id:1,name:this.account}
             this.$router.push('/')
             this.setUserInfo(userInfo)            
          },1000)

        }
  }
}
</script>
<style lang="less" scoped>
.content-login{
    background-color: #f2f2f2;
    padding:20px;
    .logContent{
        width:350px;
        height: 400px;
        background-color: #fff;
        box-shadow: 1px 1px 0 1px 1px rgba(0,0,0,0.3);
        box-sizing: border-box;
        font-size:14px;
        .loginForm{
            padding:25px;
            .el-input{
                margin:auto;
                margin-top:20px;
                display: block;
                width:300px;
                &.err{
                     .el-input__inner{
                        border-color:red;
                        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
                    }
                }
               
            }
            .el-button{
                width:100%;
                background-color: #278dfe;
                color:#fff;
                margin-top: 20px;
            }
            .rem{
                margin-top:50px;
            }
            .reg{
                 margin-top:10px;
                text-align: center;
            }
            .errInfo{
                margin-top:10px;
                color:red;
                i{
                    margin-right: 5px;
                }
            }
        }
       
    }
}
</style>
