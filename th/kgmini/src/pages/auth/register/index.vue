<template>
  <div class="page">
    <img class="logo" src="/static/img/util/login_logo.png" alt="">
    <div class="input-item">
      <input type="number" placeholder="请输入手机号码" v-model="username">
    </div>
    <div class="input-item">
      <input type="number" placeholder="请输入验证码" v-model="code">
      <div class="code" @click.stop="sendCode">{{time===60?'获取验证码':time}}</div>
    </div>
    <div class="input-item">
      <input type="password" placeholder="请输入密码" v-model="password">
    </div>
    <p class="tip">点击注册即代表同意 <span @click="toProtocol">《课管用户注册协议》</span></p>

    <div class="submit-btn" @click="register">注册</div>
  </div>
</template>

<script>
  import { regist, sendRegistCode } from "../../../service/auth";
  import { isPhone } from "../../../utils";
  export default {

    name: "index",
    data: function() {
      return {
        username: "",
        password: "",
        code: "",
        time: 60,
        inter:''
      };
    },
    onLoad: function(){
      Object.assign(this.$data, this.$options.data());

    },
    onLoad: function(){

    },
    onShow:function(){
      this.time = 60;
    },
    onUnload:function(){
      this.inter && clearInterval(this.inter);
      console.log(this.inter)
    },
    methods: {
      sendCode: async function() {
        if (!isPhone(this.username)) {
          this.$toast("请输入正确的手机号");
          return;
        }
        await sendRegistCode({ loginname: this.username });
        this.CountDown();
      },
      register:async function(){
        if (!isPhone(this.username)) {
          this.$toast("请输入正确的手机号");
          return;
        }
        if (!this.code) {
          this.$toast("请输入验证码");
          return;
        }
        if (!this.password) {
          this.$toast("请输入密码");
          return;
        }
       await regist({loginname: this.username,password: this.password,registerCode: this.code}, {load: true, successMsg: '注册成功'});
        setTimeout(() => {
          this.navigateBack({});
        },1500);
      },
      /**
       * 倒计时
       */
      CountDown: function() {
        this.time--;
        this.inter = setInterval(() => {
          this.time--;
          if (!this.time) {
            this.time = 120;
            clearInterval(inter);
          }
        }, 1000);
      },
      toProtocol:function() {
        this.navigateTo({url:'../protocol/main'})
      }
    }
  };
</script>

<style scoped lang="scss">


  .logo {
    margin: rpx(50) auto rpx(80);
    display: block;
    width: rpx(234);
    height: rpx(281);
  }

  .tip {
    margin-left: rpx(101);
    font-size: rpx(24);
    color: #9A9A9A;
    margin-top:rpx(20);
    span {
      color: $subThem-red;
    }
  }

  .code {
    z-index: 10;
    position: absolute;
    width: rpx(180);
    height: rpx(64);
    line-height: rpx(64);
    border-radius: rpx(32);
    background-color: $them;
    font-size: rpx(26);
    color: #313131;
    right: 0;
    top: rpx(-20);
    text-align: center;

  }

  .input-item {
    position: relative;
    font-size: rpx(30);
    margin: rpx(80) rpx(100) 0;
    border-bottom: 1px solid $border;
  }

  .wx-login {
    text-align: center;
    font-size: rpx(28);
    color: #5B5B5B;
    img {
      margin: 0 auto;
      display: block;
      width: rpx(160);
      height: rpx(160);
    }
  }
</style>
<style>
  page {
    background-color: #fff;
  }
</style>
