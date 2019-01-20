<template>
  <div>
    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">
      <div class="card" v-for="item in list" :key="item.id">
        <div class="type" v-if="item.classroomType" :style="{backgroundColor: typeColor[item.classroomType]}">{{curriculumType[item.classroomType]}}</div>
        <div class="title">
          <div class="tag"></div>
          <span>{{item.courseName}}</span>
        </div>
        <div class="content">
          <div class="name">{{item.className}}</div>
          <div class="intro">{{item.termName}}</div>
          <div class="btns">
            <div class="btn" @click="evaluateStudent(item.id)">评价学生</div>
            <div class="btn" @click="classroomShow">课堂风采</div>
            <div class="btn" @click="selectClassDetail(item.id)">课程详情</div>
          </div>
        </div>
      </div>
      <div v-if="!list.length" style="text-align: center;line-height: 50px;font-size: 16px;color: #000;">暂无数据</div>
    </scroll-view>
  </div>
</template>

<script>
  import { listTeacherCourse } from "../../../../service/teacher/main";
  import { curriculumType } from "../../../../service/config";

  export default {

    name: "index",
    data: function() {
      return {
        curriculumType: curriculumType,
        typeColor: ['', '#756EFD', '#F73C49','#FFD200'],
        page: 0,
        size: 10,
        loading: true,
        list: []
      };
    },
    onLoad: function() {
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
        // list2Teacher
        try {
          const data = await listTeacherCourse({ pageNo: this.page, pageSize: this.size }, {load: this.page===1});
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
      // 评价学生
      evaluateStudent: function(id) {
        this.navigateTo({
          url: "../evaluateStudent/main?id="+id
        });
      },
      // 课堂风采
      classroomShow: function() {
        this.navigateTo({
          url: "/pages/featureList/sub/classroomShowList/main"
        });
      },
      // 课程详情
      selectClassDetail: function(id) {
        this.navigateTo({
          url: "/pages/featureList/sub/selectClassDetail/main?id="+id+'&type=detail'
        });
      }
    }
  };
</script>

<style scoped lang="scss">


  .card {
    position: relative;
    .type {
      position: absolute;
      right: rpx(26);
      top: 0;
      width: rpx(150);
      height: rpx(60);
      text-align: center;
      line-height: rpx(60);
      font-size: rpx(26);
      color: #fff;
      background-color: $subThem-red;
      border-radius: 0 0 rpx(20) rpx(20);
    }
  }

  .scroll-view {
    //background-color: #fff;
    height: 100vh;
  }

  .content {
    padding: rpx(30) rpx(40);
    font-size: rpx(30);
    line-height: rpx(30);
    color: #424242;
    .intro {
      margin-top: rpx(31);
      margin-bottom: rpx(50);
      font-size: rpx(28);
      line-height: rpx(28);
      color: #9D9D9D;
    }
    .btns {
      @extend %flex;
      @extend %justify-content-space-between;
      .btn {
        padding: 0 rpx(35);
        display: inline-block;
        height: rpx(60);
        line-height: rpx(60);
        font-size: rpx(28);
        color: #756EFD;
        border-radius: rpx(30);
        border: 1px solid #756EFD;
      }
    }
  }
</style>
