<template>
  <div>
    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">
      <div class="item" v-for="item in list" :key="item.id" @click="toDetail(item.id)">
        <span class="title">{{item.title}}</span>
        <span class="time">{{item.createdAt}}</span>
        <p class="content">{{item.content}}</p>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  import { noticeList } from "../../../service/tabs/home";

  export default {

    name: "index",
    data: function() {
      return {
        page: 0,
        size: 10,
        loading: false,
        list: []
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.loadMore();
    },
    methods: {
      loadMore: function() {
        if (this.loading) {
          return;
        }
        this.loading = true;
        this.page++;
        this.getList();
      },
      getList:async function() {
        const data = await noticeList({pageNo: this.page, pageSize: this.size});
        if(this.page === 1){
          this.list = data.list;
        }else{
          this.list = this.list.concat(data.list);
        }
        this.loading = Number(data.list.length) < Number(this.size);
      },
      toDetail:function(id) {
        console.log(id);
        this.navigateTo({
          url: '../noticeDetail/main?id='+id
        })
      }
    }
  };
</script>

<style scoped lang="scss">


  .scroll-view {
    height: 100vh;
    background-color: #fff;
  }
  .item{
    width: rpx(690);
    margin: 0 auto;
    padding: rpx(40) 0;
    border-bottom: 1px solid $border;
  }
  .item:last-of-type{
    border-bottom: none;
  }
  .title{
    font-size: rpx(30);
    line-height: rpx(30);
    color: #313131;
    font-weight: bold;
  }
  .time{
    float: right;
    font-size: rpx(22);
    color: #9A9A9A;
  }
  .content{
    margin-top: rpx(20);
    font-size: rpx(26);
    overflow:hidden;
    line-height:rpx(40);
    display:-webkit-box;
    word-break:break-all;
    text-overflow:ellipsis;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
    color: #9A9A9A;
  }
</style>
