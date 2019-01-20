<template>
  <div style="background: white">
    <div class="item">
      <p class="title">{{item.title || 1}}</p>
      <p class="time">{{item.createdAt || "2018-12-26"}}</p>
      <p class="content">{{item.content || 1}}</p>
    </div>
  </div>
</template>

<script>
  import { noticeDetail } from "../../../service/tabs/home";
    export default {

    name: "index",
    data() {
      return {
        page: 0,
        size: 10,
        item:[],
        id:''
      };
    },
    onShow: function() {
      this.id = this.route().query.id;
      this.getList();
    },
    methods: {
      getList:async function() {
        const data = await noticeDetail({id: this.id});
        this.item = data;
        console.log(data);
      },
    }
  };
</script>

<style scoped lang="scss">



  .item{
    width: 100%;
    padding: rpx(40);
    border-bottom: 1px solid $border;
    box-sizing: border-box;
  }

  .title{
    font-size: rpx(30);
    line-height: rpx(30);
    color: #313131;
    font-weight: bold;
    margin-bottom: rpx(20);
  }
  .time{
    font-size: rpx(22);
    color: #9A9A9A;
    margin-bottom: rpx(20);
  }
  .content{
    margin-top: rpx(20);
    font-size: rpx(26);
    overflow:hidden;
    line-height:rpx(40);
    color: #9A9A9A;
  }
</style>
