<template>
  <div class="tabs">
    <mt-tabbar :value="selected" @input="change">
      <mt-tab-item id="home">
        <img v-if="selected==='home'" slot="icon" src="/static/img/tab/tab.png">
        <img  v-else slot="icon" src="/static/img/tab/tab_gray.png">
        首页
      </mt-tab-item>
      <mt-tab-item id="profile">
        <img v-if="selected==='profile'" slot="icon" src="/static/img/tab/tab3.png">
        <img v-else slot="icon" src="/static/img/tab/tab3_gray.png">
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  export default {
    name: "tab",
    props: {
      selected: String
    },
    methods: {
      change: function(e) {
        console.log(e);
        switch (e) {
          case 'home':
            this.navigateTo('/pages/home/main');
            break;
          case 'profile':
            this.navigateTo('/pages/profile/main');
            break;
        }
      }
    }
  };
</script>

<style scoped lang="scss">

  .tabs {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: rpx(98);
    z-index: 100;

  }
</style>

<style lang="scss">

  .mint-tabbar{
    height: rpx(98);
    background-color: #fff!important;
    font-size: rpx(18);
    color: #AEAEAE;
    .mint-tab-item.is-selected {
      background-color: #fff!important;
      color: #000;
      font-size: rpx(18);
    }
  }
</style>
