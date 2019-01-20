<template>
  <div class="show-item" >
    <img class="show-img" :src="info.courseLogoUrl" alt="">
    <div class="show-info">
      <div class="name">{{info.className}}</div>
      <p>{{info.orgName}}</p>
      <p>{{info.courseDate}}</p>
      <div class="btn" @click="handleClick">{{btn}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "classroomItem",
    props: ['btn', 'info'],
    methods: {
      handleClick: function() {
        this.$emit('detail', this.info);
      }
    }
  };
</script>

<style scoped lang="scss">

  .show-item{
    margin: 0 rpx(30);
    padding: rpx(40) 0;
    border-bottom: 1px solid $border;
    font-size: 0;
    .show-img{
      margin-right: rpx(30);
      vertical-align: middle;
      display: inline-block;
      width: rpx(300);
      height: rpx(200);
    }
    .show-info{
      vertical-align: middle;
      display: inline-block;
      line-height: rpx(24);
      font-size: rpx(24);
      color: #9A9A9A;
      p{
        margin-top: rpx(19);
      }
    }
    .btn{
      padding: 0 rpx(45);
      margin-top: rpx(31);
      height: rpx(60);
      line-height: rpx(60);
      background-color: $them;
      border-radius: rpx(30);
      text-align: center;
      font-size: rpx(28);
      color: #000;
    }
    .name{
      font-size: rpx(30);
      line-height: rpx(30);
      color: #000;
    }
  }
  .show-item:last-of-type{
    border-bottom: none;
  }
</style>
