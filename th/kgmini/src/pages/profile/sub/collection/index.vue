<template>
  <div>
    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">
      <OrderItem @detail="toDetail" v-for="item in list" :key="item.id" :info="item" btn="取消收藏"
                 @handleBtn="handleBtn"></OrderItem>
      <div class="no-list"style="margin-top: 20px" v-if="!list.length">暂无收藏</div>
    </scroll-view>
  </div>
</template>

<script>
  import OrderItem from "@/components/profile/orderItem";
  import { favoriteList } from "../../../../service/home/curriculum";
  import store from "../../../store/store";
  import { cancelFavorite } from "../../../../service/profile/profile";

  export default {

    name: "index",
    components: {
      OrderItem
    },
    data: function() {
      return {
        page: 0,
        size: 10,
        loading: false,
        list: []
      };
    },
    onLoad: function() {
      this.check();
    },
    computed: {
      userInfo: function() {
        return store.state.userInfo;
      }
    },
    methods: {
      handleBtn: async function(id) {
        await cancelFavorite({ courseId: id }, { load: true, successMsg: "取消成功" });
        this.check();
      },
      toDetail: function(item) {
        this.navigateTo({
          url: "/pages/featureList/sub/selectClassDetail/main?" + "id=" + item.courseId
        });
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
          const data = await favoriteList({ pageNo: this.page, pageSize: this.size, userId: this.userInfo.id });
          if (this.page === 1) {
            this.list = data.list;
          } else {
            this.list = this.list.concat(data.list);
          }
          this.loading = Number(data.list.length) < Number(this.size);

        } catch (e) {
          this.loading = false;
        }
      }
    }
  };
</script>

<style scoped lang="scss">


  .scroll-view {
    background-color: #fff;
    height: 100vh;
  }
</style>
