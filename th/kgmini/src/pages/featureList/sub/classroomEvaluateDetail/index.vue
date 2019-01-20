<template>
    <div>
      <div class="card">
       <div class="content" style="padding-bottom: 1px;">
         <div class="item">
           <span>班级名称：</span>
           <span class="value">{{info.className}}</span>
         </div>
         <div class="item">
           <span>学校名称：</span>
           <span class="value">{{info.orgName}}</span>
         </div>
         <div class="item">
           <span>上课老师：</span>
           <span class="value">{{info.teacherName}}</span>
         </div>
         <div class="item">
           <span>上课机构：</span>
           <span class="value">{{info.belongName}}</span>
         </div>
         <div class="item">
           <span>上课时间：</span>
           <span class="value">{{info.createdAt}}</span>
         </div>
         <div class="item">
           <span>班级评价：</span>
           <span class="value">{{info.classComment}}</span>
         </div>
       </div>
      </div>

      <div class="card">
        <div class="title">
          <span class="tag"></span>
          <span>课程提升</span>
        </div>
        <div class="content">
          <table v-if="info.improvements&&info.improvements.length">
            <thead>
            <tr>
              <td></td>
              <td>优</td>
              <td>良</td>
              <td>及格</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in info.improvements" :key="item.improveId ">
              <td>{{item.improvement}}</td>
              <td><div class="radius1" v-if="item.improveStar===1"></div></td>
              <td><div class="radius2" v-if="item.improveStar===2"></div></td>
              <td><div class="radius3" v-if="item.improveStar===3"></div></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="title">
          <span class="tag" style="background-color: #756EFD;"></span>
          <span>期末成果</span>
        </div>
        <div class="content imgs">
          <img v-for="(item, index) in info.teacherCommentImgs" :src="item.fileUrl" :key="index" alt="">
        </div>
      </div>
      <div class="card">
        <div class="title">
          <span class="tag" style="background-color: #F73C49;"></span>
          <span>教师寄语</span>
        </div>
        <div class="content">
         {{info.comment }}
        </div>
      </div>
    </div>
</template>

<script>
  import { commentlistTeacherComment } from "../../../../service/featureList/evaluate";

  export default {

    name: "index",
    components: {
    },
    data: function(){
      return {
        id: '',
        studentId: '',
        info: {}
      }
    },
    onLoad: function(){
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.studentId = this.route().query.studentId;
      this.getInfo();
    },
    methods: {
      getInfo:async function() {
        this.info = await commentlistTeacherComment({studentId: this.studentId,courseId: this.id});
      }
    }
  };
</script>

<style scoped lang="scss">


  table{
    width: 100%;
    text-align: center;
    td{
      padding: rpx(10);
    }
    td:first-of-type{
      text-align: left;
    }
  }
  .content{
    padding: rpx(30) rpx(30);
    font-size: rpx(28);
    color: #6C6C6C;
  }
  .imgs{
    @extend %flex;
    @extend %justify-content-space-between;
    img{
      width: rpx(190);
      height: rpx(190);
    }
  }
  .item{
    margin-bottom: rpx(40);
    font-size: rpx(30);
    color: #313131;
    font-weight: bold;
    @extend %flex;
    span:first-of-type{
      white-space: nowrap;
    }
    .value{
      font-weight: normal;
      color: #6C6C6C;
      font-size: rpx(28);
    }
  }
</style>
