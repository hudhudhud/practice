<template>
  <div class="page">
    <div class="box">
      <div class="input-item">
        <input type="number" placeholder="请输入手机号码" v-model="phone">
      </div>
      <div class="input-item">
        <input type="number" v-model="code" placeholder="请输入验证码">
        <div class="btn" @click="sendCode">{{time}}</div>
      </div>
    </div>
    <div class="tip">为了安全，我们会向您的手机发送短信验证码</div>
    <div class="submit-btn" @click="signCode">下一步</div>
  </div>
</template>

<script>
  import { passwordSendCode, updateUserPassword } from "../../../../service/profile/updateInfo";
  import { isPhone } from "../../../../utils";

  export default {

    name: "index",
    data: function() {
      return {
        phone: "",
        code: "",
        time: "获取验证码",
        inner: null
      };
    },
    destroyed: function() {
      if (this.inner)
        clearInterval(this.inner);
    },
    onLoad: function(){
      Object.assign(this.$data, this.$options.data());
    },
    methods: {
      sendCode: async function() {
        if (!isPhone(this.phone)) {
          return this.$toast("请输入正确的手机号!");
        }
        await passwordSendCode({ phone: this.phone });
        this.startTime();
      },
      startTime: function() {
        this.time = 60;
        this.inner = setInterval(() => {
          this.time--;
          if (this.time <= 0) {
            clearInterval(this.inner);
            this.time = "请输入验证码";
          }
        }, 1000);
      },

      /**
       * 验证
       */
      signCode: async function() {
        if (!isPhone(this.phone)) {
          return this.$toast("请输入正确的手机号!");
        }
        if (!this.code) {
          return this.$toast("请输入验证码!");
        }
        await updateUserPassword({
          phone: this.phone,
          smsCode: this.code
        }, {load: true});
        this.next();
      },
      next: function() {
        this.navigateTo({
          url: "../updatePsw2/main?type=2&phone="+this.phone
        });
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

  .tip {
    margin: rpx(30);
    font-size: rpx(26);
    color: #5B5B5B;
  }
</style>
