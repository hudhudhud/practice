<template>
  <div class="curriculumInfo">
    <img class="img" :src="info.logoUrl" alt="">
    <div class="info">
      <p>
        <span class="level vertical-align" v-if="info.level && false">{{info.level}}</span>
        <span class="className vertical-align">{{info.name}}</span>
      </p>
      <p class="intro"><span>{{info.briefIntro}}</span></p>
      <p class="show"><span>成果展示：{{info.harvest}}</span></p>
    </div>
    <div class="btns">
      <div class="btn" @click="toDetail(info.id,info.orgId)">查看</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "curriculumItem",
    props: ["info"],
    methods: {
      toDetail: function(id,orgId) {
        this.$emit("toDetail", id,orgId);
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
    border-bottom: 1px solid $border;
    padding: rpx(30) 0;
    margin: 0 rpx(30);
    @extend %flex;
    @extend %flex-align-center;
    .img {
      width: rpx(160);
      height: rpx(160);
    }
    .info {
      color: #9a9a9a;
      font-size: rpx(24);
      margin-left: rpx(21);
      width: rpx(308);
      .level {
        margin-right: rpx(11);
      }
      .className {
        font-weight: bold;
        line-height: rpx(30);
        font-size: rpx(30);
     //   margin-left: rpx(11);
        color: #313131;
      }
      .intro {
        height: rpx(60);
        overflow: hidden;
        margin-top: rpx(20);
        line-height: rpx(30);
        display: -webkit-box;
        word-break: break-all;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        width: 100%;
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
        padding: 0 rpx(40);
        border-radius: rpx(30);
        display: inline-block;
        line-height: rpx(60);
        background-color: $them;
        text-align: center;
        font-size: rpx(30);
        color: #313131;
      }
    }

  }
</style>
