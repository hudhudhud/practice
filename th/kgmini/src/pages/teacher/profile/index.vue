<template>
  <div class="box page">
    <Profile v-if="tab===0" />
    <Msg v-if="tab===1" />

    <div class="tabs">
      <div class="tab" :class="{active: tab===0}" @click="tabCheck(0)">
        <img src="/static/img/tab/tab.png" alt="" v-if="tab===0">
        <img src="/static/img/tab/tab_gray.png" alt="" v-else>
        <p style="font-size: 20rpx">首页</p>
      </div>
      <!--<div class="tab" :class="{active: tab===1}" @click="tabCheck(1)">-->
        <!--<img src="/static/img/tab/tab4.png" alt="" v-if="tab===1">-->
        <!--<img src="/static/img/tab/tab4_gray.png" alt="" v-else>-->
        <!--<p>消息</p>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  import Profile from '@/components/teacher/profile'
  import Msg from '@/components/teacher/msg'
    export default {

    name: "index",
    data: function(){
      return {
        tab: 0
      }
    },
    components: {
      Profile,
      Msg
    },
    methods: {
      tabCheck: function(n) {
        this.tab = n;
      }
    }
  };
</script>

<style scoped lang="scss">

  .box{
    padding-bottom: rpx(120);
  }
  .tabs{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: rpx(100);
    background-color: #fff;
    @extend %flex;
    @extend %justify-content-center;
    @extend %flex-align-center;
    text-align: center;
    font-size: rpx(18);
    color: #AEAEAE;
    .tab{
      padding: 0 rpx(150);
    }
    .tab.active{
      color: #000;
    }
    img{
      margin: 0 auto;
      display: block;
      width: rpx(56);
      height: rpx(56);
    }
  }
</style>
<style>
  page {
    background-color: #fff;
  }
</style>
