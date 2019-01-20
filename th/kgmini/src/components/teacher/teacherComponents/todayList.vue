<template>
  <div>
    <scroll-view class="scroll-view" scroll-y="true" v-if="list.length">
      <div class="task">
        <div class="text" v-for="(item, index) in list" :key="index">
          <span class="point" ></span>{{item.startTime}}-{{item.endTime}} {{item.courseName}}
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  import { listTodayCourses } from "../../../service/teacher/main";

  export default {
    name: "todayList",
    data: function() {
      return {
        page: 0,
        size: 5,
        list: []
      };
    },
    onLoad: function() {
      this.loadMore();
    },
    methods: {
      loadMore: function() {
        this.page++;
        this.getList();
      },
      getList: async function() {
        try {
          const data = await listTodayCourses();
          if (this.page === 1) {
            this.list = data.list;
          } else {
            this.list = this.list.concat(data.list);
          }
          if(Number(data.list.length) >= Number(this.size)){
            this.loadMore();
          }
        } catch (e) {
          this.loading = false;
        }
      }
    }
  };
</script>

<style scoped lang="scss">


  .scroll-view {
    margin-top: rpx(30);
    width: rpx(524);
    height: rpx(140);
    background-color: #FFF9D9;
    border-radius: 0 rpx(70) rpx(70) 0;
    .task {
      .point {
        position: absolute;
        width: rpx(16);
        height: rpx(16);
        vertical-align: middle;
        top: rpx(10);
        left: rpx(-30);
        border-radius: 50%;
        background-color: #F73C49;
      }
      .text {
        position: relative;
        margin-top: rpx(29);
        margin-left: rpx(72);
        font-size: rpx(24);
        color: #313131;
        white-space: nowrap;
      }
    }
  }
</style>
