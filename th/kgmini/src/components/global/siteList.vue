<template>
  <div class="curriculumInfo" @click="toDetail(info)">
    <div class="info">
      <p>
        <span class="className vertical-align">{{info.name}}</span>
      </p>
      <p class="intro">
        <img src="/static/img/component/location.png" alt="">
        <span>{{info.address}}</span>
      </p>
    </div>
    <div class="btns">
      <div class="btn"><img src="/static/img/component/next.png" alt=""></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "siteList",
    props: ["info"],
    methods: {
      toDetail: function(info) {
        this.$emit("toDetail", info);
      }
    }
  };
</script>

<style scoped lang="scss">


  .level {
    width: 1em;
    overflow: hidden;
  }

  .curriculumInfo:last-of-type {
    border-bottom: none;
  }

  .curriculumInfo {
    background-color:white;
    border-radius:rpx(20);
    margin-top:rpx(20);
    padding:rpx(30);
    border-bottom: 1px solid $border;
    @extend %flex;
    @extend %flex-align-center;
    .info {
      color: #9a9a9a;
      font-size: rpx(24);
      margin-left: rpx(21);
      width: rpx(500);
      .className {
        font-weight: bold;
        line-height: rpx(30);
        font-size: rpx(30);
        color: #313131;
      }
      .intro {
        @extend %nowrap;
        overflow: hidden;
        margin-top: rpx(20);
        line-height: rpx(30);
        display: -webkit-box;
        word-break: break-all;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        img {
          width: rpx(22);
          height: rpx(27);
          position:relative;
          top:rpx(6);
          margin-right:rpx(11);

        }
      }
      .show {
        margin-top: rpx(25);
        line-height: rpx(24);
        @extend %nowrap;
      }
    }
    .btns {
      flex: 1;
      text-align: right;
      .btn {
        img {
          width: rpx(40);
          height: rpx(40);
        }
      }
    }

  }
</style>
