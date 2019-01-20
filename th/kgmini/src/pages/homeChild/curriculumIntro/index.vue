<template>
  <div class="page">
    <div class="end-time">报名截止时间：{{info.startDate+" "+info.startTime}}</div>
    <div class="card">
      <div class="title">
        <span class="tag"></span>
        <span>课程价格</span>
      </div>
      <div class="price">
        <p>
          <span>总额：</span>
          <span class="count">¥ {{total}}</span>
        </p>
        <p>
          器材费：¥{{info.equipmentFee}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;课时费：¥ {{info.totalClassFee}}
        </p>
      </div>
    </div>
    <div class="card">
      <div class="title">
        <span class="tag" style="background-color: #756EFD"></span>
        <span>课程说明</span>
      </div>
      <div class="list">
        <div class="item"><span class="titleValue" style="letter-spacing:9rpx">班级名：</span><span class="value">{{info.className }}</span></div>
        <div class="item"><span class="titleValue" style="letter-spacing:9rpx">总课时：</span><span class="value">{{info.totalClass}}</span></div>
        <div class="item"><span class="titleValue">适龄年级：</span><span class="value">{{gradeNames}}</span></div>
        <div class="item"><span class="titleValue">上课地址：</span><span class="value">{{info.teachAddress}}</span></div>
        <div class="item"><span class="titleValue">开班人数：</span><span class="value">最少{{info.minNumber}}人</span></div>
        <div class="item"><span class="titleValue">开课时间：</span><span class="value">{{info.startDate + "~" + info.endDate}}</span></div>
        <div class="item"><span class="titleValue">上课时间：</span>
          <div class="value">
            <p v-for="item in times" :key="item">{{item}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="title bottom">
        <span :class="{active: active===0}" @click="activeChange(0)">课程介绍</span>
        <span :class="{active: active===1}" @click="activeChange(1)">课程大纲</span>
      </div>
      <div class="content" v-show="!active">
        <h3>课程特点：</h3>
        <p>{{info.outline.feature}}</p>
        <h3>课程目标：</h3>
        <p>{{info.outline.goal}}</p>
        <h3>课程提升：</h3>
        <p>{{info.outline.promotion}}</p>
      </div>
      <div v-show="active">
        <div class="sub-title">能力提升：<span class="sub">{{improvementList || ''}}</span></div>
        <div class="sub-title">教学成果：<span class="sub">{{info.outline.achievements || ''}}</span></div>
        <table>
          <thead>
          <tr>
            <td>内容</td>
            <td>课时</td>
            <td>教学目标</td>
            <td>备注</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in info.outline.courseOutlineList" :key="index">
            <td>{{item.content}}</td>
            <td>{{item.section}}</td>
            <td>{{item.aim}}</td>
            <td>{{item.remark}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="nav-bar">
      <div @click="favoriteSave">
        <img class="xing" :src="info.favoriteStatus?'/static/img/main/xing.png':'/static/img/main/5xing.png'" alt="">
        <span>{{info.favoriteStatus?'已收藏':'收藏'}}</span>
      </div>
      <div @click="toPhone">咨询</div>
      <a class="next" @click="next">立即报名</a>
    </div>
  </div>
</template>

<script>
  import { favoriteSave, getCurriculumIntro } from "../../../service/home/curriculum";
  // import { weekText } from "../../../service/config";
  import store from "../../store/store";

  export default {

    name: "index",
    data: function() {
      return {
        active: 0,
        id: "",
        info: {
          outline: {}
        }
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.getInfo();
    },
    computed: {
      childCount: function() {
        return store.state.userInfo.childCount;
      },
      total: function() {
        return (this.info.equipmentFee + this.info.totalClassFee ).toFixed(2);
      },
      gradeNames: function() {
        return (this.info.gradeNames || "").replace(",", " ~ ");
      },
      times: function() {
        if (this.info.courseTimeStr) {
          return this.info.courseTimeStr.split("br");
        } else {
          return [];
        }
      },
      improvementList: function() {
        if(!this.info.outline)
          return '';
        return (this.info.outline.improvementList||[]).join('/')
      }
    },
    methods: {
      activeChange: function(n) {
        this.active = n;
      },
      getInfo: async function() {
        const data = await getCurriculumIntro({ id: this.id });
        this.info = data;
      },
      toPhone:function(){
        this.makePhone(this.info.phone)
      },
      /**
       * 收藏课程
       */
      favoriteSave: async function() {
        await favoriteSave({ courseId: this.id }, { load: true, successMsg: true, favoriteStatus: this.info.favoriteStatus });
        this.getInfo();
      },
      next: function() {
        if (!this.childCount) {
          return store.dispatch("isBindChild");
        }
        store.commit("saveCurriculum", this.info);
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

  .page {
    background-color: #f2f2f2;
    color: #313131;
    padding-bottom: rpx(130);
  }

  .end-time {
    width: rpx(690);
    height: rpx(80);
    line-height: rpx(80);
    border-radius: rpx(40);
    margin: rpx(30) auto 0;
    background-color: $them;
    font-size: rpx(28);
    text-align: center;
  }

  .list {
    font-size: rpx(30);
    color: #000;
    padding: 0 0 rpx(1) rpx(40);
    .item {
      @extend %flex;
      margin: rpx(25) 0;
      line-height: rpx(40);
    }
    .value {
      margin-left: rpx(20);
      color: #9D9D9D;
      font-size: rpx(28);
      max-width: rpx(500);
    }
    .titleValue {
      width: rpx(150);
    }
  }

  .title.bottom {
    text-align: center;

    span {
      color: #5B5B5B;
      font-size: rpx(28);
      font-weight: normal;
      display: inline-block;
    }
    span.active {
      font-size: rpx(32) !important;
      color: #313131 !important;
      font-weight: bold !important;
    }
    span:last-of-type {
      margin-left: rpx(115);
    }
  }

  .content {
    padding: rpx(30) rpx(40) rpx(40);
    h3 {
      margin: rpx(30) 0 rpx(10);
      line-height: rpx(30);
      font-size: rpx(30);
      color: #424242;
    }
    p {
      font-size: rpx(28);
      color: #9D9D9D;
    }
  }

  .sub-title {
    margin-left: rpx(30);
    margin-top: rpx(30);
    margin-bottom: rpx(6);
    font-size: rpx(30);
    color: #000;
  }

  table {
    text-align: center;
    margin-top: rpx(30);
    font-size: rpx(26);
    width: 100%;
    td:nth-of-type(1), td:nth-of-type(3) {
      white-space: nowrap;
    }
    td {
      border-top: 1px solid $border;
      border-left: 1px solid $border;
      vertical-align: middle;
      padding: rpx(20) rpx(30);
    }
    td:first-of-type {
      border-left: none;
    }
  }
</style>
