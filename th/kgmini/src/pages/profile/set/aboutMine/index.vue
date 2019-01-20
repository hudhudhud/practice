<template>
  <div class="page">
    <div class="infos">
      <div class="bg">
        <div class="title" style="float: left">介绍：</div>
        <div>课管中心，教育培训行业的互联网创新模式与商业地产服务方案提供商。</div>
      </div>
      <div class="bg">
        <div class="title">联系我们</div>
        <div>
          <p style="margin-bottom: 10rpx">
            <span>电话：</span>400870760
          </p>
          <p>
            <span>邮箱：</span>15824220003@139.com
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>


    export default {

    name: "index",
    onLoad: function() {

    },
    methods: {

    }
  };
</script>

<style scoped lang="scss">


  .infos {
    padding: 0 rpx(30);
  }

  .bg {
    margin-bottom:10px;
    border-radius:10px;
    padding:10px;
    overflow: hidden;
    div {
      font-size: rpx(35);
    };
    .title {
      font-weight: bold;
      font-size: rpx(30);
      margin-bottom: rpx(20);
    }
    p {
      font-size: rpx(30);
    }
    span {
      font-size: rpx(30);
      font-weight: bold;
      margin-right: rpx(20);
    }
  }
</style>
<style>
  page {
    background-color: #fff;
  }
</style>
