<template>
<div class="page">
     <div class="content">
       <header>
            <router-link to="/register" class="regi-btn">注册</router-link>
       </header>
      
        <div class="login-boy"></div>
        <div id="login">
            <div class="login-box-a">
                <div class="img-title"></div>
                <form class="login-form" v-on:keyup.enter="loginin">
                  <input class="login-input" type="text" name="account" placeholder="请输入手机号"  autocomplete="on"
                    v-model="loginname">
                  <input class="login-input" type="password" name="password" placeholder="请输入密码" 
                    v-model="password">

                  <!-- <p class="remember"><el-checkbox v-model="checked">记住我</el-checkbox></p> -->
                  <a class="btn" href="javascript:;" @click="loginin" >登录</a>
                  <!-- <button class="btn" @click="loginin">登录</button> -->
                </form>
            </div>
        </div>
        <div class="boll"></div>
    </div>
</div>
</template>

<script>
  import store from '../store'
  import services from '../services'
  import {orgTypeRoleIndexPage} from '../assets/js/const.js'
  export default {
    data() {
      return {
        loginname: '',
        password: '',
        checked:false,
      }
    },          
    created(){
      services.user_isLogin().then(res=>{
        if(res.data.data){
          if(localStorage.info){
            let orgType=JSON.parse(localStorage.info).orgType
            this.afterLogin(orgType)
          }
        }
      })
    },
    methods: {
      afterLogin(orgType){
          if (orgType&&orgTypeRoleIndexPage[orgType]) {
            this.$router.push(orgTypeRoleIndexPage[orgType]);
          }
          else {
            this.$router.push('/');
          }
      },
      loginin() {
        let self = this;
        let params = {
          loginname: self.loginname,
          password: self.password,
          rememberMe:self.checked
        };
        services.user_login(params).then((res) => {
          let resData = res.data;
          if (resData.status == 0) {
            if (!window.localStorage) {
              return false
            } else {
              let info;
              info = JSON.stringify(resData.data);
              localStorage.setItem('info',info);

              let orgType = resData.data.orgType;
              this.afterLogin(orgType)

              if(resData.data && resData.data.menus){
                let res=[]
                let f=(items)=>{
                    items.forEach(item=>{
                        if(item.url){
                            res.push(item.url)
                        }
                        if(item.children&&item.children.length){
                            f(item.children)
                        }
                    })
                }
                f(resData.data.menus)
                store.commit('setRoutes', res)
                store.commit('setUserInfo',resData.data)
              }
            }
          } else {
            this.$message({
                type: 'warning',
                message: resData.msg
            });
            return false;
          }
        })
      },
    },
  }
</script>
<style scoped lang=less>
  body,
  html,
  div,
  h4,
  form,
  p {
    padding: 0px;
    margin: 0px;
  }
  .page{
    min-width: 1400px;
    min-height: 1080px;
    height: 100%;
    width:100%;
    overflow: hidden;
    background-color: #311561;
  }
  .content{
    margin:auto;
    width:1400px;
    height: 100%;
    position:relative;
    
    /* background-image: url('../assets/img/boy.png'),url('../assets/img/boll.png');
    background-position:left 0 top 272px,bottom 0 right 0;
    background-repeat: no-repeat, no-repeat; */
    header{
        height: 80px;
        .regi-btn{
          z-index: 3;
          margin-top:20px;
          position: absolute;
          right:0;
          display: inline-block;
          width:100px;
          height: 40px;
          background:rgba(256, 256, 256, 0.2);
          border-radius:20px;
          color:#fff;
          text-align: center;
          line-height: 40px;
          cursor: pointer;
        }
    }

  }

  a {
    text-decoration: none;
  }

  .login-boy {
    width:739px;
    height:569px;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url('../assets/img/boy.png');
    position:absolute;
    right: 732px;
    top:279px;
  }
  .boll{
      position: absolute;
      top:344px;
      left:770px;
      width:664px;
      height:734px;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url('../assets/img/boll.png');
      z-index:1;
  }

#login{
     position: absolute;
     right: 103px;
     top:69px;
     width:644px;
     z-index:2;
    .login-box-a {
      box-sizing: border-box;
      width:100%;
      height: 100%;
      box-sizing: border-box;
      padding-top:69px;
      .img-title{
        width:100%;
        height: 178px;
        background-repeat: no-repeat;
        background-size: contain;
        background-image:url('../assets/img/title.png');
      }
      .login-form{
        margin:auto;
        background-image: url('../assets/img/login-box.png');
        background-repeat: no-repeat;
        background-size: contain;
        width:429px;
        height:496px;
        box-sizing: border-box;
        text-align:center;
        color:#fff;
        margin-top:22px;
        .login-input {
          &:first-child{
            margin-top:115px;
          }
          &:nth-child(2){
            margin-top:30px;
          }
          width:300px;
          height: 48px;
          background:#31135D;
          border-radius:29px;
          margin:auto;
          font-size:18px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#9C86BD;
          padding-left:29px;
          border:none;   
          box-sizing: border-box;
        }
        .btn {
          display: block;
            margin:auto;
            background:rgba(250,219,9,1);
            margin-top: 92px;
            font-size: 20px;
            font-weight:600;
            color:#31135D;
            border: 1px solid transparent;
            line-height: 48px;
            border-radius:29px;
            width:300px;
            height: 48px;
            cursor: pointer;
          }
      }
  }
}
  .playnow {
    padding: 20px;
    font-size: 12px;
    word-spacing: 8px;
    letter-spacing: 0.5px;
    font-family: "Microsoft YaHei";
  }

  .box-tit {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: normal;
  }

 

  .js-tip {
    font-size: 12px;
    word-spacing: 8px;
    letter-spacing: 0.5px;
    font-family: "Microsoft YaHei";
  }

  .f1 {
    float: left;
  }

  #rememberme {
    margin: 3px 2px 0 0;
    float: left;
  }

  label {
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .fr {
    float: right;
  }

  .fr>a {
    color: #6d6d6d;
  }

  .clearfix {
    text-align: center;
    clear: both;
    display: block;
  }


</style>
<style lang="less">
 #login{
  .remember{
      margin-top:17px;
      position:relative;
      .el-checkbox{
        position:absolute;
        left:70px;
        color:#fff;
        .el-checkbox__inner{
          background-color:transparent;
        }
      }
      .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
        border-color:#fff;
      }
      .el-checkbox__input.is-checked+.el-checkbox__label{
        color:#fff;
      }
      .el-checkbox__input.is-focus .el-checkbox__inner{
        color:#fff;
      }
    }
}
</style>
