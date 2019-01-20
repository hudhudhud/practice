<template>
  <div class="evaluate">
    <img class="user" :src="info.avatar" alt="">
    <div class="content">
      <div class="name">{{info.realname}}</div>
      <div class="score">
        <template v-if="intCommentStar">
          <img class="score-img" src="/static/img/util/xing1.png" v-for="item in intCommentStar" :key="item" alt="">
          <img class="score-img" src="/static/img/util/xing5.png" alt=""
               v-if="intCommentStar!==info.commentStar&&info.commentStar">
          <span>
                      <img class="score-img" v-for="item in count" :key="item" src="/static/img/util/xing1_gray.png"  alt="">
          </span>
        </template>
        <template v-else>
          <img class="score-img" v-for="item in 5" :key="item" src="/static/img/util/xing1_gray.png"  alt="">
        </template>
        <span>{{star||''}}</span>
      </div>
      <div class="text">{{info.comment}}</div>
      <div class="imgs">
        <img :src="img.fileUrl" v-for="(img,index) in info.lunchCommentImgs" alt="" :key="index">
      </div>
    </div>
  </div>
</template>

<script>
  // 评价
  export default {
    name: "evaluate",
    props: {
      info: {
        default: {}
      }
    },
    data(){
      return {
        star:'',
        count:''
      }
    },
    computed: {
      intCommentStar: function() {
        this.star = this.info.commentStar&&this.info.commentStar.toFixed(1).toString() || '0.0';
        if(parseInt(this.info.commentStar) == this.info.commentStar){
          this.count = 5 - parseInt(this.info.commentStar)
        }else {
          this.count = 4 - parseInt(this.info.commentStar)
        }
        return parseInt(this.info.commentStar) || 0;
      }
    }
  };
</script>

<style scoped lang="scss">


  .evaluate {
    margin: 0 rpx(30);
    padding: rpx(30) 0;
    @extend %flex;
    border-bottom: 1px solid $border;
  }

  .evaluate:last-of-type {
    border-bottom: none;
  }

  .user {
    border-radius: 50%;
    width: rpx(70);
    height: rpx(70);
  }

  .content {
    flex: 1;
    margin-left: rpx(22);
    .name {
      line-height: rpx(30);
      font-size: rpx(30);
      color: #000;
    }
    .text {
      font-size: rpx(26);
      color: #5B5B5B;
    }
  }

  .score {
    margin: rpx(15) 0 rpx(20);
    font-size: 0;
    .score-img {
      margin-right: rpx(10);
      width: rpx(26);
      height: rpx(26);
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      font-size: rpx(22);
      color: #9A9A9A;
    }
  }

  .imgs {
    padding: rpx(10);
    img {
      margin-right: rpx(20);
      width: rpx(156);
      height: rpx(156);
    }
  }
</style>
