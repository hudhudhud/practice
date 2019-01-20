<template>
  <div class="page">
    <div class="phone">
      <input type="number" placeholder="请输入手机号" v-model.lazy="phone">
    </div>
    <div class="text">
      <textarea placeholder="请输入评价" v-model.lazy="content"/>
    </div>
    <div class="submit-btn" @click="submit">提交</div>

  </div>

</template>

<script>
  import { isPhone } from "../../../../utils";
  import { saveFeedback } from "../../../../service/profile/profile";

  export default {

    name: "index",
    data: function() {
      return {
        phone: "",
        content: ""
      };
    },
    methods: {
      submit: function() {
        setTimeout(async () => {
          if(!isPhone(this.phone)){
            return this.$toast('请输入正确的手机号')
          }
          if(!this.content){
            return this.$toast('请输入评价内容')
          }
          await saveFeedback({phone: this.phone,content: this.content}, {load: true,successMsg: '提交成功'});
          setTimeout(() => {
            this.navigateBack({});
          }, 1500);
        },100);
      }
    }
  };
</script>
<style>
  page {
    background-color: #fff;
  }
</style>

<style scoped lang="scss">


  .phone {
    overflow: hidden;
    box-sizing: border-box;
    border-radius: rpx(20);
    padding-left: rpx(31);
    margin: rpx(30) auto 0;
    width: rpx(690);
    height: rpx(106);
    background-color: #f2f2f2;
    input {
      margin-top: rpx(25);
      line-height: rpx(56);
      height: rpx(56);
    }
  }

  .text {
    padding: rpx(40) rpx(30);
    overflow: hidden;
    box-sizing: border-box;
    border-radius: rpx(20);
    margin: rpx(30) auto 0;
    width: rpx(690);
    height: rpx(340);
    background-color: #f2f2f2;
  }
</style>
