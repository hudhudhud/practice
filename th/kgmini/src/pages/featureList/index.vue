<template>
  <div class="page">
    <a class="item back1" @click="toDetail('/schoolSelect/main?type1=school', true)">
      <span>校园课表</span>
    </a>
    <a class="item back2" @click="toDetail('/selectClassList/main?type1=school', true)">
      <span>选课中心</span>
    </a>
    <a class="item back3" @click="toDetail('/lunch/main?type1=school', true)">
      <span>午餐中心</span>
    </a>
    <a class="item back4" @click="toDetail('/classroomShowList/main?type1=school', true)">
      <span>课堂风采</span>
    </a>
    <a class="item back5" @click="toDetail('/classroomEvaluateList/main?type1=school', true)">
      <span>课程评价</span>
    </a>
    <a class="item back6" v-if="false" @click="toDetail('/childManage/main?type1=school', false)">
      <span>子女管理</span>
    </a>
    <a class="item back7" @click="toDetail('/policy/main', true)">
      <span>保单中心</span>
    </a>
  </div>
</template>

<script>

  import store from "../store/store";

  export default {

    name: "index",
    computed: {
      childCount: function() {
        return store.state.userInfo.childCount;
      }
    },
    methods: {
      toDetail: function(url, limit) {
        if (limit && !this.childCount)
          return this.$toast("请先绑定孩子");
        this.navigateTo({
          url: "/pages/featureList/sub" + url
        });
      }
    }
  };
</script>

<style scoped lang="scss">


  .page {
    padding-top: rpx(10);
    padding-bottom: rpx(30);
    background-color: #F2F2F2;
  }

  .item {
    position: relative;
    margin: rpx(30) auto 0;
    width: rpx(690);
    height: rpx(144);
    background-color: #fff;
    span {
      position: absolute;
      right: rpx(60);
      top: rpx(58);
      font-size: rpx(32);
      line-height: rpx(32);
      color: #313131;
    }
  }

  .back1 {
    background: url("http://image.zhi-you.net/000/c9fbd5651ca44a37a9607c8349a9c042") no-repeat;
    background-size: 100% 100%;
  }

  .back2 {
    background: url("http://image.zhi-you.net/000/4d517aa811a1449bba84479d87f38c5d") no-repeat;
    background-size: 100% 100%;
  }

  .back3 {
    background: url("http://image.zhi-you.net/000/f47844bfc1bc45e3beb28f895e161135") no-repeat;
    background-size: 100% 100%;
  }

  .back4 {
    background: url("http://image.zhi-you.net/000/17ae0e9a306b4a45bdceea7f283eaa3a") no-repeat;
    background-size: 100% 100%;
  }

  .back5 {
    background: url("http://image.zhi-you.net/000/f642706534a84d4eb6b640c383b062d1") no-repeat;
    background-size: 100% 100%;
  }

  .back6 {
    background: url("http://image.zhi-you.net/000/946e5e0097ad4666bc1e7b22c3cd132f") no-repeat;
    background-size: 100% 100%;
  }

  .back7 {
    background: url("http://image.zhi-you.net/000/266f3d90ce4d4b1c8c3cc5c8464e14f2") no-repeat;
    background-size: 100% 100%;
  }
</style>
