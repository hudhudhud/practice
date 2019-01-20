<template>
  <div>
    <div class="cellItem">
      <div class="text-area">
        <div class="title">{{info.courseName}}</div>
        <div class="sub-title">{{(info.courseStatus==='stopped'&&'课程调至下周一'||'')+info.startTime+'——'+info.endTime}}</div>
      </div>
      <div class="btn-area">
        <div class="btn red show"  v-if="info.courseStatus==='committed'" @click="action(1)">停课</div>
        <div class="btn them show"  v-if="info.courseStatus==='committed'" @click="action(2)">去点名</div>
        <div class="btn gray"  v-if="info.courseStatus!=='committed'">{{curriculumStatus[info.courseStatus]}}</div>
      </div>
      <!--<div class="btn-area" @touchmove="touchmove" @touchstart="touchstart">-->
        <!--<div class="btn red show" :class="{hide: hideAnimation}" v-show="showBtn" @click="action(1)">停课</div>-->
        <!--<div class="btn them show" :class="{hide: hideAnimation}" v-show="showBtn" @click="action(2)">去点名</div>-->
        <!--<div class="btn gray" v-show="!showBtn">{{curriculumStatus[info.courseStatus]}}</div>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  // import lodash from "lodash";
  import { curriculumStatus } from "../../service/config";
  export default {
    name: "cellItem",
    props: ['info'],
    data: function() {
      return {
        inter: null,
        hideAnimation: 0,
        showBtn: 0,
        startX: 0,
        curriculumStatus: curriculumStatus
      };
    },
    methods: {
      action: function(e){
        this.$emit('action', e);
        this.close();
      },
      touchstart: function(e) {
        if(this.info.courseStatus === 'committed')
        this.startX = e.clientX;
      },
      touchmove: function(e) {
        if(this.info.courseStatus === 'committed')
        this.computedAction(e);
      },
      computedAction: function(){
        if (this.startX - e.clientX > 30) {
          this.open();
        }
        if (e.clientX - this.startX > 30) {
          this.close();
        }
      },
      open: function() {
        this.showBtn = 1;
        this.hideAnimation = 0;
        if (this.inter)
          clearTimeout(this.inter);
      },
      close: function() {
        this.hideAnimation = 1;
        this.inter = setTimeout(() => {
          this.showBtn = 0;
          this.hideAnimation = 0;
        }, 250);
      }
    }
  };
</script>

<style scoped lang="scss">

  @import "../../utils/animation";

  .cellItem {
    overflow: hidden;
    border-radius: rpx(20);
    height: rpx(160);
    width: rpx(690);
    margin: rpx(40) auto 0;
    background-color: #fff;
    @extend %flex;
  }

  .text-area {
    box-sizing: border-box;
    padding-left: rpx(29);
    flex: 1;
    height: 100%;
    .title{
      margin-top: rpx(35);
      line-height: rpx(32);
      height: rpx(70);
      font-size: rpx(32);
      color: #313131;
    }
    .sub-title{
    //  margin-top: rpx(35);
      line-height: rpx(26);
      font-size: rpx(26);
      color: #9a9a9a;
    }
  }

  .btn-area {
    text-align: center;
    height: 100%;
    @extend %flex;
    .btn {
      width: rpx(130);
      line-height: rpx(160);
      color: #000;
      font-size: rpx(30);
      background-color: #fff;
    }
    .btn.show {
      animation: cell-show .3s ease-out;
    }
    .btn.hide {
      animation: cell-hide .3s ease-out;
    }
    .gray {
      color: #fff;
      background-color: #c5c5c5;
    }
    .them {
      background-color: $them;
      color: #000;
    }
    .red {
      color: #fff;
      background-color: $subThem-red2;
    }
  }
</style>
