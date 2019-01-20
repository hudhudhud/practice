<template>
  <div>
    <div class="head-info">
      <img class="head" :src="user.avatarUrl||'http://image.zhi-you.net/avatar_default.jpg'" alt="">
      <div class="info">
        <p class="name">{{user.nickname||'无昵称'}}</p>
        <a class="update" @click="navigateTo('/pages/profile/set/updateInfo/main')">修改信息</a>
      </div>

      <a class="set"  @click="navigateTo('/pages/profile/set/updateSet/main')">
        <img src="/static/img/profile/set.png" alt="">
      </a>
    </div>
    <Today></Today>

    <div class="options">
      <a class="option"  @click="navigateTo('/pages/teacher/curriculum/curriculumList/main')">
        <img class="head" src="/static/img/profile/icon/profile9.png" alt="">
        <p>课程管理</p>
      </a>
      <a class="option" @click="checkIn">
        <img class="head" src="/static/img/profile/icon/profile10.png" alt="" >
        <p>上课点名</p>
      </a>
      <a class="option" @click="navigateTo('/pages/featureList/sub/schoolSelect/main?type1=mine')">
        <img class="head" src="/static/img/profile/icon/profile3.png" alt="">
        <p>我的课表</p>
      </a>
      <a class="option" @click="navigateTo('/pages/featureList/sub/classroomShowList/main')">
        <img class="head" src="/static/img/profile/icon/profile11.png" alt="">
        <p>课堂风采</p>
      </a>
      <a class="option" @click="navigateTo('/pages/teacher/evaluateList/main')">
        <img class="head" src="/static/img/profile/icon/profile4.png" alt="">
        <p>课程评价</p>
      </a>

      <a class="option" @click="navigateTo('/pages/profile/sub/proposal/main')">
        <img class="head" src="/static/img/profile/icon/profile7.png" alt="">
        <p>投诉与建议</p>
      </a>
      <a class="option">
        <img class="head" src="/static/img/profile/icon/profile5.png" alt="">
        <p>我的动态</p>
      </a>
      <a class="option" @click="navigateTo('/pages/featureList/sub/policy/main')">
        <img class="head" src="/static/img/profile/icon/profile12.png" alt="">
        <p>保单中心</p>
      </a>
    </div>

    <button class="check" @click="logout">切换家长身份</button>
  </div>
</template>

<script>
  import store from '../../pages/store/store'
  import Today from './teacherComponents/todayList'
  import { defaultOptions } from "../../service/httpRequest";
  export default {
    name: "profile",
    components: {
      Today
    },
    computed: {
      user: function() {
        return {
          ...this.$store.state.loginData,...this.$store.state.userInfo
        }
      }
    },
    methods: {
      // 上课点名
      checkIn: function(){
        this.navigateTo({
          url: '/pages/featureList/sub/schoolSelect/main?type=check'
        })
      },
      logout: function() {
        this.navigateTo({
          url: '/pages/auth/login/main'
        })
      }
    }
  };
</script>

<style scoped lang="scss">

  .head-info {
    position: relative;
    margin-top: rpx(41);
    font-size: 0;
    .head {
      vertical-align: middle;
      border-radius: 50%;
      margin-left: rpx(30);
      margin-right: rpx(30);
      display: inline-block;
      width: rpx(136);
      height: rpx(136);
    }
    .info {
      vertical-align: middle;
      display: inline-block;
      .name {
        font-size: rpx(42);
        line-height: rpx(42);
        color: #313131;
      }
      .update {
        margin-top: rpx(29);
        border-radius: rpx(22);
        padding: 0 rpx(23);
        height: rpx(44);
        line-height: rpx(44);
        background-color: #756EFD;
        color: #fff;
        font-size: rpx(26);
      }
    }
    .set {
      position: absolute;
      right: rpx(12);
      top: 0;
      padding: 0 rpx(20) rpx(20) rpx(20);
      img {
        display: block;
        width: rpx(40);
        height: rpx(40);
      }
    }
  }

  .options {
    margin-top: rpx(100);
    text-align: center;
    @extend %flex;
    @extend %flex-wrap;
    .option {
      margin-right: rpx(42);
      margin-left: rpx(72);
      margin-bottom: rpx(50);
      // margin: 0 rpx(72);
      width: rpx(126);
      img {
        border-radius: 50%;
        display: block;
        width: rpx(126);
        height: rpx(126);
      }
      p {
        line-height: rpx(45);
        color: #313131;
        font-size: rpx(28);
        white-space: nowrap;
      }
    }
  }


  .check{
    border-radius: rpx(44);
    margin: rpx(58) auto;
    width: rpx(400);
    height: rpx(88);
    line-height: rpx(88);
    font-size: rpx(32);
    color: #313131;
    text-align: center;
    font-weight: bold;
    @include gradientToRight(#FFEB00, #FEBF00)
  }
</style>
