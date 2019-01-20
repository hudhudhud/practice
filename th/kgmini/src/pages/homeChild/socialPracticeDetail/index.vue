<template>
  <div style="padding-bottom: 100px;">
    <div class="box">
      <swiper class="swiper" indicator-dots="false" v-if="!isH5"
              autoplay="true">
        <swiper-item v-for="item in info.imgs" :key="item.fileUrl">
          <image mode="scaleToFill" :src="item.fileUrl"
                 class="slide-image"/>
        </swiper-item>
      </swiper>
      <mt-swipe :auto="3000" v-if="isH5" class="swiper" :show-indicators="false">
        <mt-swipe-item v-for="item in info.imgs" :key="item.id">
          <img :src="item.fileUrl"
               class="slide-image"/>
        </mt-swipe-item>
      </mt-swipe>

      <div class="title-name">{{info.name}}</div>
      <div class="price">
        <span>课程价格：</span>
        <span>¥ {{info.fee}}</span>
      </div>
      <div class="end-time">
        <span>报名截止时间：{{info.enrollDeadline}}</span>
        <span>{{info.enrollNumber}}/{{info.maxNumber}}</span>
      </div>
    </div>
    <div class="box">
      <div class="item">
        <label>举办单位： </label>
        <span>{{info.orgName}}</span>
      </div>
      <div class="item">
        <label>时间： </label>
        <span>{{info.createdAt }}</span>
      </div>
      <div class="item">
        <label>成团要求： </label>
        <span>{{info.minNumber }}人（已报名{{info.enrollNumber}}人）</span>
      </div>
      <div class="item">
        <label>适龄年级： </label>
        <span>{{info.gradeNames }}</span>
      </div>
    </div>
    <div class="box">
      <div class="tabs">
        <div :class="{active: active===0}" @click="activeChange(0)">目标</div>
        <div :class="{active: active===1}" @click="activeChange(1)">特色环节</div>
        <div :class="{active: active===2}" @click="activeChange(2)">活动流程</div>
      </div>
      <div class="content" v-if="info.intro">
        <div v-if="active===0">
          <p>{{info.intro.goal}}</p>
        </div>
        <div v-if="active===1">
          <p>{{info.intro.tache}}</p>
        </div>
        <div v-if="active===2">
          <p>{{info.intro.flow}}</p>
        </div>
      </div>
    </div>

    <div class="nav-bar">
      <div @click="favoriteSave">
        <img class="xing" :src="info.favoriteStatus?'/static/img/main/xing.png':'/static/img/main/5xing.png'" alt="">
        <span>{{info.favoriteStatus?"已收藏":"收藏"}}</span>
      </div>
      <a class="next" @click="next">立即报名</a>
    </div>
  </div>
</template>

<script>
  import { practiseActivityDetail } from "../../../service/home/socialPractice";
  import store from "../../store/store";
  import { favoriteSave } from "../../../service/home/curriculum";

  export default {

    name: "index",
    data: function() {
      return {
        id: "",
        info: {},
        active: 0
      };
    },
    computed: {
      childCount: function() {
        return store.state.userInfo.childCount;
      }
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.getInfo();
    },
    methods: {
      activeChange: function(n) {
        this.active = n;
      },
      getInfo: async function() {
        this.info = await practiseActivityDetail({ courseId: this.id });
      },
      /**
       * 收藏课程
       */
      favoriteSave: async function() {
        await favoriteSave({ courseId: this.info.courseId }, {
          load: true,
          successMsg: true,
          favoriteStatus: this.info.favoriteStatus
        });
        this.getInfo();
      },
      next: function() {
        if (!this.childCount) {
          return store.dispatch("isBindChild");
        }
        store.commit("saveCurriculum", {...this.info, feeType: 1});
        this.navigateTo({
          url: "/pages/homeChild/confirmOrder/main"
        });
      }
    }
  };
</script>

<style scoped lang="scss">


  .nav-bar {
    position: fixed;
    height: rpx(100);
    width: 100%;
    bottom: 0;
    left: 0;
    background-color: #fff;
    @extend %flex;
    .xing {
      margin-right: rpx(21);
      vertical-align: middle;
      width: rpx(42);
      height: rpx(42);
    }
    .xing + span {
      vertical-align: middle;
    }
    .next {
      font-size: rpx(32);
      background-color: $them;
      font-weight: bold;
    }
    & > div, a {
      font-size: rpx(28);
      color: #000;
      flex: 1;
      text-align: center;
      line-height: rpx(100);
    }
  }

  .tabs {
    @extend %flex;
    @extend %flex-align-center;
    @extend %justify-content-space-between;
    padding: 0 rpx(70);
    border-bottom: 1px solid $border;
    height: rpx(89);
    margin: 0 rpx(30);
    box-sizing: border-box;
    div {
      white-space: nowrap;
      font-size: rpx(28);
      color: #5b5b5b;
      font-weight: normal;
    }
    div.active {
      font-size: rpx(32);
      color: #313131;
      font-weight: bold;
    }
  }

  .content {
    font-size: rpx(26);
    color: #9d9d9d;
    p {
      margin: rpx(30) rpx(30) 0;

    }
  }

  .item {
    margin-top: rpx(40);
    margin-left: rpx(30);
    font-size: rpx(28);
    color: #6c6c6c;
    label {
      font-size: rpx(30);
      color: #313131;
    }
  }

  .end-time {
    margin: rpx(30) rpx(30) 0;
    @extend %flex;
    @extend %justify-content-space-between;
    font-size: rpx(26);
    color: #5b5b5b;
    span:last-of-type {
      font-size: rpx(34);
      color: $subThem-red;
    }
  }

  .box {
    background-color: #fff;
    margin-bottom: rpx(20);
    padding-bottom: rpx(39);
    overflow: hidden;

  }

  .slide-image {
    width: 100%;
    height: rpx(344);
  }

  .title-name {
    padding-top: rpx(38);
    line-height: rpx(38);
    font-size: rpx(38);
    color: #313131;
    font-weight: bold;
    padding-left: rpx(31);
  }

  .title-intro {
    color: #9A9A9A;
    font-size: rpx(26);
    margin: rpx(38) rpx(31) 0;
  }

  .price {
    padding: rpx(36) rpx(30) 0;
    color: #5B5B5B;
    font-size: rpx(26);
    line-height: rpx(26);
    span:last-of-type {
      color: $subThem-red;
      font-size: rpx(34);
    }
  }
</style>
