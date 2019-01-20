<template>
  <div class="page">
    <img class="logo" src="/static/img/util/login_logo.png" alt="">
    <div class="input-item">
      <input type="number" placeholder="请输入手机号码" v-model="user.loginname">
    </div>
    <div class="input-item">
      <input type="password" placeholder="请输入密码" v-model="user.password">
    </div>
    <div class="btns" v-if="role==='1'">
      <a class="btn" @click="navigateTo('/pages/profile/set/updatePsw1/main')">忘记密码</a>
      <a class="btn" @click="navigateTo({url:'/pages/auth/register/main'})">注册新用户</a>
    </div>
    <div class="submit-btn" @click="login">登录</div>
    <!--<div class="wx-login" v-if="role==='1'" @click="login2">-->
    <!--<img src="/static/img/util/wx_login.png" alt="">-->
    <!--<span>微信登录</span>-->
    <!--</div>-->
  </div>
</template>

<script>
  import { defaultOptions } from "../../../service/httpRequest";
  import { login } from "../../../service/auth";
  import { isPhone } from "../../../utils";
  import { getItem, setItem } from "../../../utils/localStorage";

  export default {

    name: "index",
    data: function() {
      return {
        role: "1", // 1家长   ，2教师
        user: {
          loginname: "",
          password: ""
        }
      };
    },
    onLoad: async function() {
      this.role = this.route().query.role || "1";
    },
    methods: {
      // 教师
      login: async function() {
        console.log("登录了");
        if (!isPhone(this.user.loginname)) {
          this.$toast("请输入正确的手机号");
          return;
        }
        if (!this.user.password) {
          this.$toast("请输入密码");
          return;
        }
        let params = {
          ...this.user, type: this.isH5 ? 0 : 1
        };
        if (this.isH5) {
          params.zoneInfo = getItem("re-address");
        }
        const res = await login(params, { successMsg: "登录成功", load: true });
        let key = defaultOptions.header.randomKey;
        //  res.role = this.role;
        this.$store.commit("logout");
        this.$store.commit("saveLogin", { ...res, userKey: key });
        setTimeout(() => {
          if (this.role === "1") {
            if (res.isParent) {
              this.$store.commit("saveRole", "1");
            } else {
              this.$store.commit("saveRole", "2");
            }
          } else {
            if (res.isTeacher) {
              this.$store.commit("saveRole", "2");
            } else {
              this.$store.commit("saveRole", "1");
            }
          }
          this.reLaunch({
            url: "/pages/index/main"
          });
          //this.$store.dispatch("getUserInfo");
        }, 1000);
      },
      login2: function() {

      }
    },
    onShow: function() {
      this.user.loginname = "";
      this.user.password = "";
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

  .input-item {
    font-size: rpx(30);
    margin: 0 rpx(100) rpx(80);
    border-bottom: 1px solid $border;
  }

  .btns {
    margin-top: rpx(40);
    font-size: 0;
    text-align: center;
    white-space: nowrap;
    .btn:first-child {
      border-right: 2px solid $border;
    }
    .btn {
      line-height: rpx(44);
      display: inline-block;
      width: rpx(213);
      font-size: rpx(28);
      color: #5B5B5B;
    }
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
