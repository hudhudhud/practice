<template>
  <div>
    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">

      <div class="curriculum" v-for="item in list" :key="item.id">
        <img class="main-img" :src="item.logoUrl" alt="">
        <div class="info">
          <p>
            <span>{{item.name}}</span>
          </p>
          <p>开课时间：{{item.startDate}}</p>
          <p>适用：{{item.gradeNames}}</p>
        </div>
        <div class="end">
          <p class="price">¥ {{item.fee}}</p>
          <p>
            <a class="button" @click="toCurriculumDetail(item.courseId)">查看</a>
          </p>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  import { getCurriculumList } from "../../../../service/home/curriculum";
  import CurriculumItem from '@/components/global/curriculumItem'
  import { practiseActivityList } from "../../../../service/home/socialPractice";
    export default {

    name: "index",
    components: {
      CurriculumItem
    },
    data: function() {
      return {
        id: "",
        page: 0,
        size: 7,
        loading: false,
        list: [],
      };
    },
    onLoad: function({ id }) {
      Object.assign(this.$data, this.$options.data());
      this.id = id;
      this.check();
    },
    methods: {
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
          const data = await practiseActivityList({ pageNo: this.page, pageSize: this.size ,orgId: this.id});

          if (this.page === 1) {
            this.list = data.list;
          } else {
            this.list = this.list.concat(data.list);
          }
          this.loading = Number(data.list.length) < Number(this.size);

        } catch (e) {
          this.loading = false;
        }
      },
      toCurriculumDetail: function(id) {
        this.navigateTo({
          url: '../../socialPracticeDetail/main?id='+id
        })
      }
    }
  };
</script>

<style scoped lang="scss">

  .scroll-view{
    height: 100vh;
    background-color: #fff;
  }

    .curriculum:last-of-type {
      border-bottom: none;
    }
    .curriculum {
      @extend %flex;
      @extend %flex-align-center;
      //  padding: rpx(40) rpx(24) rpx(40) rpx(30);
      padding: rpx(40) 0;
      margin: 0 rpx(24) 0 rpx(30);
      border-bottom: 1px solid $border;
      .main-img {
        width: rpx(160);
        height: rpx(160);
      }
      .info {
        margin-left: rpx(21);
        color: #9A9A9A;
        font-size: rpx(24);
        line-height: rpx(24);
        span {
          vertical-align: middle;
        }
        p {
          margin: rpx(22) 0;
        }
        p:first-of-type {
          color: #313131;
          font-size: rpx(31);
        }
      }
      .end {
        min-width: rpx(140);
        flex: 1;
        text-align: right;
      }
      .price {
        color: $subThem-red;
        font-size: rpx(30);
      }
      .button {
        margin-top: rpx(36);
        display: inline-block;
        color: #000;
        font-size: rpx(30);
        line-height: rpx(60);
        background-color: $them;
        padding: 0 rpx(41);
        border-radius: rpx(30);
      }
    }
</style>
