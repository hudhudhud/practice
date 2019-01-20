<template>
  <div>
    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">
    <div class="box" v-for="item in list" :key="item.id">
      <div class="ins" @click="insDetail(item.orgId)">
        <img class="ins-img" src="http://image.zhi-you.net/000/a16ded4b43fa4e908b0002d9f8c30155@200w" alt="">
        <div class="info">
          <p class="name">{{item.realname}}评价了{{item.orgName}}·{{item.courseName}}</p>
          <!--<p>{{item.courseName}}</p>-->
        </div>

        <!--<img src="/static/img/util/iconRight.png" class="icon-right" alt="">-->
      </div>
      <Evaluate :info="{realname: '',commentStar: item.commentStar,comment: item.comment,avatar: user.avatarUrl}"></Evaluate>
      <div class="btns">
        <div class="btn" @click="deleteEvaluation(item.id)">
          <img src="/static/img/util/delete.png" alt="">
          <span class="vertical-align">删除</span>
        </div>
      </div>
    </div>
      <div class="no-list"style="margin-top: 20px" v-if="!list.length">暂无评价</div>
    </scroll-view>
  </div>
</template>

<script>
  import Evaluate from "@/components/global/evaluate";
  import { commentDelete, commentListMyComment } from "../../../../service/profile/profile";
  import store from "../../../store/store";

  export default {

    name: "index",
    components: {
      Evaluate
    },
    computed: {
      user: function() {
        return store.state.userInfo;
      }
    },
    data: function(){
      return {
        page: 0,
        size: 7,
        loading: true,
        list: [],
      }
    },
    onLoad: function(){
      Object.assign(this.$data, this.$options.data());
      this.check();
    },
    methods: {
      deleteEvaluation:async function(id){
        const {confirm} = await this.$showModal({
          title: "提示",
          content: "确认删除评价？",
          confirmText: "确定"
        });
        if(confirm){
          await commentDelete({id: id},{load: true, successMsg:'删除成功'});
          this.check();
        }
      },
      check: function() {
        this.list = [];
        this.loading = false; // 重新开启监听
        this.page = 0;
        this.loadMore();
      },
      loadMore: function() {
        if (this.loading) {
          return;
        }
        this.loading = true;
        this.page++;
        this.getList();
      },
      getList: async function() {
        try {
          const data = await commentListMyComment({ pageNo: this.page, pageSize: this.size});
          if (this.page === 1) {
            this.list = data.list;
          } else {
            this.list = this.list.concat(data.list);
          }
          this.loading = Number(data.list.length) < Number(this.size);

        } catch (e) {
          this.loading = false;
        }
      },
      insDetail: function(id) {
        this.navigateTo({
          url: '/pages/homeChild/institutionInfo/main?id='+id
        })
      }
    }
  };
</script>

<style scoped lang="scss">


  .scroll-view{
    height: 100vh;
  }
  .box {
    margin-top: rpx(20);
    background-color: #fff;
  }

  .icon-right {
    width: rpx(14);
    height: rpx(24);
    position: absolute;
    right: 0;
    top: 50%;
    @include translate(0, -50%);
  }

  .btns {
    padding-right: rpx(23);
    height: rpx(80);
    @extend %flex;
    justify-content: flex-end;
    @extend %flex-align-center;
    font-size: rpx(24);
    color: #313131;
    .btn {
      padding: 0 rpx(10);
    }
    img {
      vertical-align: middle;
      margin-right: rpx(10);
      width: rpx(34);
      height: rpx(36);
    }
  }

  .ins {
    position: relative;
    box-sizing: border-box;
    font-size: 0;
    height: rpx(130);
    margin: 0 rpx(30);
    padding: rpx(15) 0;
    border-bottom: 1px solid $border;
    .ins-img {
      vertical-align: middle;
      display: inline-block;
      width: rpx(100);
      height: rpx(100);
      float: left;
    }
    .info {
      margin-left: rpx(100);
      vertical-align: middle;
      color: #9A9A9A;
      font-size: rpx(24);
      line-height: rpx(24);
      height: rpx(100);
      padding:rpx(20);
      overflow: hidden;
      box-sizing: border-box;
      display: table;
      .name {
        font-size:rpx(30);
        line-height:rpx(30);
        color:#313131;
        overflow: hidden;
        text-overflow:ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        width:100%;
        height:rpx(60);
        display: table-cell;
        vertical-align: middle;

      }
    }
  }
</style>
