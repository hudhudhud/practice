<template>
  <div>
    <div class="box">

      <div class="input-item">
        <label>地址</label>
        <input type="text" placeholder="点击填写地址">
        <img class="icon-right" src="/static/img/util/iconRight.png" alt="">
      </div>
      <div class="input-item">
        <label>详细地址</label>
        <input type="text" placeholder="点击填写详细地址">
      </div>
    </div>
    <div class="submit-btn" @click="submit">提交地址</div>

  </div>
</template>

<script>
  import { addAddress } from "../../../../service/profile/address";

  export default {

    name: "index",
    methods: {
      submit:async function() {
        const data = await addAddress();
        this.navigateBack({});
      }
    }
  };
</script>

<style scoped lang="scss">


  .box {
    margin-top: rpx(20);
    background-color: #fff;
  }

  .input-item {
    position: relative;
    margin: 0 rpx(30);
    border-bottom: 1px solid $border;
    padding: rpx(40) 0;
    label {
      display: inline-block;
      vertical-align: middle;
      width: rpx(160);
      font-size: rpx(30);
    }
    input {
      vertical-align: middle;
      font-size: rpx(26);
      height: rpx(40);
      line-height: rpx(40);
      display: inline-block;
      width: rpx(500);
    }
    .icon-right {
      position: absolute;
      right: 0;
      top: 50%;
      @include translate(0, -50%);
      width: rpx(14);
      height: rpx(24);
    }
  }

  .input-item:last-of-type {
    border-bottom: none;
  }


</style>
