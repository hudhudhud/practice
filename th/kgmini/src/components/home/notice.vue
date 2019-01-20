<template>
  <div>
    <div class="tip-scroll" @click="toDetail">
      <img class="tip-img" src="/static/img/main/jyj_tip.png" alt="">
      <div class="scroll-content">
        <div class="animation" :style="{transform: isH5?('translateY('+scrollIndex*(-1.5275)+'rem)'):('translateY('+scrollIndex*(-36.66)+'rpx)')}">
          <div class="scroll-item" v-for="item in list" :key="item.id">
            <span class="label">标题</span>
            <span>{{item.title}}</span>
          </div>
        </div>
      </div>
      <img class="tip-right" src="/static/img/main/repeat-right.png" alt="">
    </div>

  </div>
</template>

<script>
  import { noticeList } from "../../service/tabs/home";
  import store from "../../pages/store/store";

  export default {
    name: "notice",
    data: function() {
      return {
        list: [],
        scrollIndex: 0,
        interval: null,
        page: 0,
        size: 10,
        loading: false
      };
    },
    onLoad: function() {
      if (!this.interval) {
        this.startAnimation();
      }
      this.loadMore();
    },
    onHide: function() {
      clearInterval(this.interval);
    },
    onUnload: function() {
      clearInterval(this.interval);
    },
    onShow: function() {
      this.startAnimation();
    },
    destroyed: function() {
      if (!this.isH5) {
        return;
      }
      clearInterval(this.interval);
    },
    computed: {
      partner: function() {
        return this.$store.state.partnerDetail;
      }
    },
    methods: {
      startAnimation: function() {
        this.interval = setInterval(() => {
          if (this.scrollIndex >= this.list.length - 5) {
            this.loadMore();
          }
          this.scrollIndex++;
          if (this.scrollIndex >= this.list.length - 2) {
            this.scrollIndex = 0;
          }
        }, 3000);
      },
      loadMore: function() {
        if (!this.loading) {
          this.page++;
          this.noticeList();
        }

      },
      noticeList: async function() {
        const data = await noticeList({ pageNo: this.page, pageSize: this.size });
        if (this.page === 1) {
          this.list = data.list;
        } else {
          this.list = this.list.concat(data.list);
        }
        this.loading = Number(data.list.length) < Number(this.size);
        // this.startAnimation();
      },
      toDetail: function() {
        this.navigateTo({
          url: "/pages/homeChild/noticeList/main"
        });
      }
    }
  };
</script>

<style scoped lang="scss">


  %cla {
    content: '';
    position: absolute;
    top: 50%;
    @include translate(0, -50%);
    border-radius: rpx(1);
    width: rpx(2);
    height: rpx(50);
    background-color: rgba(0, 0, 0, .2);
  }

  .tip-scroll {
    margin: rpx(50) 0 rpx(30) 0;
    height: rpx(110);
    @extend %flex;
    @extend %flex-align-center;
    @extend %justify-content-center;
    .tip-img {
      width: rpx(80);
      height: rpx(110);
    }
    .scroll-content {
      .animation {
        @include transition(transform .3s linear);
        width: 100%;
        height: 100%;
      }
      margin: 0 rpx(20);
      position: relative;
      width: rpx(550);
      height: rpx(109.98);
      overflow: hidden;
      .scroll-item {
        box-sizing: border-box;
        width: 100%;
        padding: 0 rpx(20);
        height: rpx(36.66);
        color: #8D8D8D;
        font-size: rpx(22);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        span {
          vertical-align: middle;
        }
        .label {
          border: 1px solid black;
          margin-right: rpx(10);
          display: inline-block;
          width: rpx(56);
          height: rpx(26);
          line-height: rpx(26);
          font-size: rpx(18);
          text-align: center;
        }
      }
      .scroll-item:nth-of-type(3n+1) {
        .label {
          border-color: #5851F5;
          color: #5851F5;
          background-color: #EBEAF5;
        }
      }
      .scroll-item:nth-of-type(3n+2) {
        .label {
          border-color: #00AA10;
          color: #00AA10;
          background-color: #EEF9EF;
        }
      }
      .scroll-item:nth-of-type(3n+3) {
        .label {
          border-color: #F75174;
          color: #F75174;
          background-color: #F7E8EB;
        }
      }
      &::before {
        @extend %cla;
        left: 0;
      }
      &::after {
        @extend %cla;
        right: 0;
      }

    }
    .tip-right {
      width: rpx(20);
      height: rpx(20);
    }
  }

</style>
