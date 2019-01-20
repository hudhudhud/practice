<template>
  <div>
    <div class="fixed">
      <ListTab :text="tabs" :status.sync="status" />
    </div>
    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">
      <MsgItem></MsgItem>
      <MsgItem></MsgItem>
    </scroll-view>
  </div>
</template>

<script>
  import MsgItem from '@/components/msg/msgItem'
  import ListTab from '@/components/style/listTab'
    export default {

    name: "index",
    components: {
      ListTab,
      MsgItem
    },
    data: function() {
      return {
        tabs : ['消息', '动态', '通讯录'],
        status: 0
      }
    }
  };
</script>

<style scoped lang="scss">

  .fixed{
    background-color: #fff;
    padding-bottom: rpx(24);
  }
  .scroll-view{
    height: 100vh;
    padding-top: rpx(130);
  }
</style>
