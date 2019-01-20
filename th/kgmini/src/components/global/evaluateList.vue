<template>
  <div class="user-evaluate">
    <div class="normal-title" v-if="!hideTitle">用户评价<span class="count" v-if="totalNum">({{totalNum}})</span></div>
    <div class="other" v-if="tabs">
      <div class="label" :class="{active: active === index}" @click="check(index)" v-for="(item, index) in tabs" :key="item">{{item}}</div>
    </div>
    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">
      <Evaluate v-for="item in list" :key="item.id" :info="item"/>
      <div v-if="!list.length" class="center">
        暂无评价
      </div>
    </scroll-view>
  </div>
</template>

<script>
  // 整个用户评价
  import Evaluate from "@/components/global/evaluate";
  import { listMechanismComment } from "../../service/home/institution";
  import { commentListLunchComment } from "../../service/featureList/lunch";
  import { commentTeacherListComment } from "../../service/teacher/main";

  export default {
    name: "evaluateList",
  //  props: ["tabs", "hideTitle", "id", "type"], // type 2用户对午餐的评价   type3 教师端   ： 我的评价
    props: {
      tabs: {
        default: function() {
          return ['全部','教育局评价', '学校评价', '家长评价']
        }
      },
      hideTitle: null,
      id: null,
      type: null
    },
    components: {
      Evaluate
    },
    data: function() {
      return {
        page: 0,
        size: 5,
        loading: true,
        list: [],
        active: 0,
        totalNum: 0
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());

      setTimeout(() => {
        this.check();
      }, 300)
    },
    methods: {
      check: function(n = 0) {
        this.active = n;
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
          let data = {};
          switch (this.type) {
            case '2':
              data = await commentListLunchComment({pageNo: this.page, pageSize: this.size,supplierId: this.id});
              break;
            case '3':
              data = await commentTeacherListComment({pageNo: this.page, pageSize: this.size, status: this.active});
              break;
            default:
              data = await listMechanismComment({ pageNo: this.page, pageSize: this.size,mechanismId: this.id,eduStatus: this.active });
              break;
          }
          this.totalNum = data.totalNum;
          if (this.page === 1) {
            this.list = data.list;
          } else {
            this.list = this.list.concat(data.list);
          }
          this.loading = Number(data.totalNum) <= Number(this.size);

        } catch (e) {
          this.loading = false;
        }
      }
    }
  };
</script>

<style scoped lang="scss">


  .normal-title {
    margin-bottom: rpx(20);
  }
  .center{
    margin-top: rpx(50);
    font-size: rpx(30);
    color: #313131;
    text-align: center;
  //  @include translate(-50%,-50%)
  }
  .count {
    font-size: rpx(26);
    color: rgba(66, 66, 66, .7);
  }

  .scroll-view{
    position: relative;
    max-height: rpx(672);
    min-height: rpx(100);
    overflow: hidden;
  }
  .user-evaluate {
    padding-bottom: rpx(50);
    margin-top: rpx(20);
    background-color: #fff;
    .label {
      margin-left: rpx(20);
      display: inline-block;
      height: rpx(50);
      line-height: rpx(50);
      color: #424242;
      background-color: #F2F2F2;
      font-size: rpx(26);
      padding: 0 rpx(23);
      border-radius: rpx(25);
    }
    .label.active {
      color: #000;
      background-color: $them;
    }
  }
  .other{
    margin-left: rpx(10);margin-top: rpx(30)
  }
</style>
