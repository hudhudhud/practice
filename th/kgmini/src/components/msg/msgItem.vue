<template>
    <div class="msg-item">
      <div class="img">
        <img src="/static/img/util/group_default.png" alt="">
      </div>
      <div class="info">
        <p class="title">班级群</p>
        <p class="content">xuasnd nasidn asji</p>
      </div>
      <div class="time">11:30</div>
    </div>
</template>

<script>
  export default {
    name: "msgItem"
  };
</script>

<style scoped lang="scss">

  .msg-item{
    box-sizing: border-box;
    position: relative;
    height: rpx(150);
    background-color: #fff;
    @extend %flex;
    @extend %flex-align-center;
    border-top: 1px solid $border;
  }
  .msg-item:first-of-type{
    border-top: none;
  }
  .img{
    img{
      margin: 0 rpx(30);
      width: rpx(96);
      height: rpx(96);
    }
  }
  .info{
    .title{
      line-height: rpx(30);
      font-size: rpx(30);
      color: #313131;
    }
    .content{
      @extend %nowrap;
      width: rpx(401);
      margin-top: rpx(30);
      font-size: rpx(26);
      color: #9d9d9d;
      line-height: rpx(26);
    }
  }
  .time{
    position: absolute;
    right: rpx(31);
    top: rpx(36);
    font-size: rpx(24);
    color: #9D9D9D;
  }
</style>
