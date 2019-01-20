<template>
  <div class="page">
    <div class="box">
      <div class="input-item">
        <input type="password" :placeholder="type==='1'?'请输入原密码':'请输入新密码'" v-model="psw1">
      </div>
      <div class="input-item">
        <input type="password" :placeholder="type==='1'?'请输入新密码':'请确定新密码'" v-model="psw2">
      </div>
      <div class="input-item" v-if="type==='1'">
        <input type="password" placeholder="请确认新密码" v-model="psw3">
      </div>
    </div>
    <div class="submit-btn" @click="next">确定</div>
  </div>
</template>

<script>
  import { forgetPassword, updatePassword } from "../../../../service/profile/updateInfo";
  import { defaultOptions } from "../../../../service/httpRequest";
  import { loginout } from "../../../../service/auth";
  import store from '../../../store/store'

  export default {

    name: "index",
    data: function() {
      return {
        psw1: "",
        psw2: "",
        psw3: "",
        type: "",
        phone:''
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.type = this.route().query.type;
      this.phone = this.route().query.phone;
    },
    methods: {


      next: async function() {
        if (!this.psw1 || !this.psw2) {
          return this.$toast("请输入密码");
        }

        if (this.type === "1") {
          if (this.psw2 !== this.psw3) {
            return this.$toast("俩次新密码输入不一致!");
          }
          await updatePassword({
            oldPassword: this.psw1,
            newPassword: this.psw2,
            Password: this.psw3
          }, { successMsg: "修改成功" });
        } else {
          if (this.psw2 !== this.psw1) {
            return this.$toast("俩次新密码输入不一致!");
          }
          await forgetPassword({
            newPassword: this.psw1,
            againPassword: this.psw2,
            loginname:this.phone
          }, { successMsg: "修改成功即将重新登录" });

        }
        // await updatePassword();
        await loginout();
        store.commit('logout');
        setTimeout(() => {
          this.reLaunch({
            url: "/pages/auth/login/main"
          });
        }, 1500)
      }
    }
  };
</script>

<style scoped lang="scss">


  .box {
    margin-top: rpx(20);
    background-color: #fff;
    overflow: hidden;
  }

  .input-item {
    border-bottom: 1px solid $border;
    margin: 0 rpx(30);
    height: rpx(104);
    @extend %flex;
    @extend %flex-align-center;
    @extend %justify-content-space-between;
    input {
      height: rpx(56);
      line-height: rpx(56);
    }
    .btn {
      text-align: center;
      border-radius: rpx(32);
      background-color: $them;
      width: rpx(180);
      height: rpx(64);
      line-height: rpx(64);
      font-size: rpx(26);
      color: #313131;
    }
  }
</style>
