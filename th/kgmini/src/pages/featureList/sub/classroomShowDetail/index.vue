<template>
  <div>
    <div class="card">
      <p class="item">
        <span>班级名称：</span>
        <span class="value">{{info.className}}</span>
      </p>
      <p class="item">
        <span>学校名称：</span>
        <span class="value">{{info.orgName}}</span>
      </p>
      <p class="item">
        <span>上课老师：</span>
        <span class="value">{{info.teachers[0].teacherName}}</span>
      </p>
      <p class="item">
        <span>上课机构：</span>
        <span class="value">{{info.orgName}}</span>
      </p>
      <p class="item">
        <span>上课时间：</span>
        <span class="value">{{info.courseDate}}</span>
      </p>
      <p class="item">
        <span>班级评价：</span>
        <span class="value">及刻录机看就看离开后了可好看了，好打翻虽然我若无群若无若。让我去若</span>
      </p>
    </div>
    <div class="card">
      <div class="title"><span class="tag"></span>课堂风采</div>
      <div class="content">
        <p class="tip">{{info.comment}}</p>
        <div class="imgs">
          <img :src="item.fileUrl" v-for="(item, index) in info.styleImgList" :key="index" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getShowDetail } from "../../../../service/featureList/classroomShow";

  export default {

    name: "index",
    data: function() {
      return {
        id: "",
        info: {
          teachers: [{}]
        }
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.getDetail();
    },
    methods: {
      getDetail: async function() {
        try {
          this.info = await getShowDetail({ id: this.id });
        } catch (e) {
          setTimeout(() => {
            this.navigateBack({});
          }, 1500);
        }
      }
    }
  };
</script>

<style scoped lang="scss">


  .card {
    padding: rpx(10) 0;
    .title {
      font-weight: bold;
      border-bottom: none;
    }
  }

  .content {
    .tip {
      box-sizing: border-box;
      padding: 0 rpx(30);
      text-align: left;
      font-size: rpx(26);
      color: #6C6C6C;
    }
    .imgs {
      @extend %flex;
      @extend %justify-content-center;
      @extend %flex-wrap;
      img {
        margin: rpx(30) rpx(15);
        width: rpx(190);
        height: rpx(190);
      }
    }
  }

  .item {
    @extend %flex;
    margin: rpx(20) rpx(30);
    font-size: rpx(28);
    color: #313131;
    font-weight: bold;
    .value {
      font-size: rpx(28);
      color: #6C6C6C;
      font-weight: normal;
    }
    span:first-of-type {
      white-space: nowrap;
    }
  }

</style>
