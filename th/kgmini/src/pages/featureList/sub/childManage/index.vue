<template>
  <div>
    <swiper v-if="!isH5" class="swiper" next-margin="50rpx" previous-margin="30rpx"
            :autoplay="false">
      <swiper-item v-for="item in list" :key="item.id">
        <div class="vh">
          <ChildManage btn="添加子女" @btnClick="handleClick" :info="item"></ChildManage>
        </div>
      </swiper-item>
      <swiper-item v-if="!list.length">
        <div class="submit-btn" @click="handleClick">添加子女</div>
      </swiper-item>
    </swiper>

    <mt-swipe :auto="0" v-if="isH5" class="swiper" :show-indicators="false">
      <mt-swipe-item v-for="item in list" :key="item.id">
        <div class="vh">
          <ChildManage btn="添加子女" @btnClick="handleClick" :info="item"></ChildManage>
        </div>
      </mt-swipe-item>
      <mt-swipe-item v-if="!list.length">
        <div class="submit-btn" @click="handleClick">添加子女</div>
      </mt-swipe-item>
    </mt-swipe>

  </div>
</template>

<script>
  import ChildManage from "@/components/feature/childManage";
  import { childListByParentId } from "../../../../service/featureList/child";
  import store from "../../../store/store";

  export default {

    name: "index",
    components: {
      ChildManage
    },
    data: function() {
      return {
        list: []
      };
    },
    onLoad: function() {
      this.getList();
    },
    computed: {
      userInfo: function() {
        return store.state.userInfo;
      }
    },
    methods: {
      getList: async function() {
        const data = await childListByParentId({ parentId: this.userInfo.id });
        this.list = data.list;
      },
      handleClick: function() {
        this.navigateTo({
          url: "./searchChild/main"
        });
      }
    }
  };
</script>

<style scoped lang="scss">


  .vh {
    height: 100vh;
    width: 100vw;
    border-right: 1px solid $border;
  }

  .swiper {
    height: 100vh;

  }
</style>
