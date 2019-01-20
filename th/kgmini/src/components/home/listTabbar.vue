<template>
  <div class="tabbar-box">

    <scroll-view class="scroll-view" scroll-x="true">
      <div class="tabbar">
        <div class="tab" v-for="(item, index) of tabs" :key="index" :class="{active: actives[item.id]}"
             @click="check(item.id)">{{item.termName}}
        </div>
      </div>

    </scroll-view>
    <!--<div class="down" @click="tabShow=!tabShow">-->
    <!--<img :class="{back: tabShow}" src="/static/img/util/down.png" alt="">-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: "listTabbar",
    props: ["tabs", "actives"],
    data: function() {
      return {
        tabShow: false
      };
    },
    methods: {
      check: function(n) {
       // this.$set(this.actives, n, !this.actives[n]);
        this.$emit('update:actives', {...this.actives, [n]: !this.actives[n]})
        //  this.$emit('update:actives', this.actives);
      }
    }
  };
</script>

<style scoped lang="scss">


  .tabbar-box {
    height: rpx(60);
  }

  .tabbar.height {
    max-height: rpx(1000);
  }
  .scroll-view{
    margin-top: rpx(20);

  }

  .tabbar {
    background-color: #fff;
    height: rpx(60);
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    @extend %flex-align-center;
    padding: 0 rpx(20) 0 rpx(27);
    .down {
      top: rpx(10);
      right: rpx(15);
      position: absolute;
      width: rpx(40);
      height: rpx(40);
      img {
        margin: rpx(10) auto;
        display: block;
        width: rpx(26);
        height: rpx(17);
      }
    }
    .tab {
      padding: 0 rpx(18);
      margin-bottom: rpx(20);
      box-sizing: border-box;
      min-width: rpx(150);
      height: rpx(50);
      line-height: rpx(50);
      text-align: center;
      color: #5c5c5c;
      font-size: rpx(28);
      background-color: #EAEAEA;
      margin-right: rpx(20);
    }
    .tab.active {
      color: #000;
      background-color: $them;
    }
  }

</style>
