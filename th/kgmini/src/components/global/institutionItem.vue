<template>
  <div class="school" @click="handleClick">
    <img class="img" :src="info.logoUrl || defaultSrc" alt="">
    <div class="school-info">
      <div class="name-info" style="overflow: hidden">
        <span class="name flow">{{info.name}}</span>
        <span class="name-tip" v-if="info.registerStatus">{{info.registerStatus === "verified"?"已认证":"未认证"}}</span>
      </div>
      <div class="score">
          <img class="score-img" src="/static/img/util/xing1.png" v-for="item in info.commentStarNew" :key="item" alt="">
          <img class="score-img" src="/static/img/util/xing5.png" alt=""
               v-if="info.commentStarNew!==info.commentStar&&info.commentStar">
          <span>
            <img class="score-img" v-for="item in info.count" :key="item" src="/static/img/util/xing1_gray.png"  alt="">
          </span>
        <span>{{info.star||''}}</span>
      </div>
      <div class="labels">
        <span class="label1">{{institutionNature[info.nature]}}</span>
        <span class="label2" v-if="info.trainingClubFlag">课后机构</span>
        <span class="label3" v-if="info.termName">{{info.termName}}</span>
      </div>
    </div>
    <!--红榜还是黑板-->
    <div class="school-label" :class="types[info.board]" v-if="info.board">{{info.board}}</div>
    <!--距离-->
    <div class="distance" v-if="!isHome">
      <img src="/static/img/util/distance.png" alt="" v-if="distance">
      <span>{{distance}}</span>
    </div>
  </div>
</template>

<script>
  import { institutionNature } from "../../service/config";

  export default {
    name: "institutionItem",
    props: ["info","isHome"],
    data: function() {
      return {
        types: {
          "红榜": "red",
          "黑榜": "black",
          "白榜": "white"
        },
        institutionNature: institutionNature,
        star:'',
        count:''
      };
    },
    computed: {
      distance: function() {
        if (typeof this.info.distance === "number") {
          switch (true) {
            case this.info.distance < 200:
              return "<200m";
            case this.info.distance < 1000:
              return parseInt(this.info.distance)+'m';
            default:
              return (this.info.distance / 1000).toFixed(2) + "km";
          }
        } else {
          return "";
        }
      },
      defaultSrc:function() {
        return this.getDefaultImg('institutionLogo')
      }
    },
    methods: {
      handleClick: function() {
        this.$emit("detail", this.info.id,this.info.orgId);
      }
    }
  };
</script>

<style scoped lang="scss">


  .school {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: rpx(30);
      width: rpx(690);
      border-bottom: 1px solid #E2E2E2;
    }
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding-left: rpx(30);
    height: rpx(220);
    @extend %flex;
    @extend %flex-align-center;
    font-size: rpx(18);
    .img {
      width: rpx(160);
      height: rpx(160);
    }
    .school-info {
      margin-left: rpx(30);
    }
    .name {
      vertical-align: middle;
      font-size: rpx(30);
      line-height: rpx(30);
      color: #313131;
      font-weight: bold;
    }
    .flow {
      max-width:rpx(350);
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      word-break:keep-all;
      display:block;
      float:left;
    }
    .name-tip {
      margin-left: rpx(20);
      vertical-align: middle;
      display: inline-block;
      height: rpx(26);
      line-height: rpx(26);
      padding: 0 rpx(11);
      border: 1px solid #F75174;
      color: #F75174;
      border-radius: rpx(2);
    }
    .score {
      margin-top: rpx(23);
      .score-img {
        margin-right: rpx(10);
        width: rpx(26);
        height: rpx(26);
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
        font-size: rpx(22);
        color: #9A9A9A;
      }
    }

    .distance {
      position: absolute;
      right: rpx(30);
      bottom: rpx(40);
      img {
        vertical-align: middle;
        width: rpx(22);
        height: rpx(26);
        margin-right: rpx(11);
      }
      span {
        vertical-align: middle;
        font-size: rpx(22);
        color: #9A9A9A;
      }
    }

  }
</style>
