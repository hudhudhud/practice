<template>
  <div class="tabs">
    <div class="tab" :class="{active: status === index}" @click="check(index)" v-for="(item,index) in text" :key="index">{{item}}</div>
  </div>
</template>

<script>
  export default {
    name: "listTab",
    props: ['text', 'status'],
    methods: {
      check: function(index) {
      //  this.tabActive = index;
        this.$emit('update:status', index);
      }
    }
  };
</script>

<style scoped lang="scss">

  .tabs {
    font-size: rpx(28);
    color: #313131;
    text-align: center;
    @extend %flex;
//    margin-top: rpx(30);
    .tab {
      flex: 1;
      box-sizing: border-box;
      position: relative;
      height: rpx(60);
      line-height: rpx(60);
    }
    .tab.active {
      font-weight: bold;
      font-size: rpx(34);
      &::after {
        content: '';
        width: rpx(38);
        height: rpx(4);
        background-color: $them;
        position: absolute;
        bottom: 0;
        left: 50%;
        @include translate(-50%, 0)
      }
    }
  }
</style>
