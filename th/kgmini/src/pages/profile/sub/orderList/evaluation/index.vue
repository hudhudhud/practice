<template>
  <div>
    <div class="org">
      <div class="info">
        <img :src="info.logoUrl" alt="">
        <div class="text">
          <p class="name">{{info.orgName}}</p>
          <p>{{info.courseName}}</p>
        </div>
      </div>
    <!--  <div class="check">
        <CheckBox :check.sync="isAnonymous" />
        <span>匿名评论</span>
      </div>-->
    </div>
    <div>
      <div class="xing" >
        <img @click="changeFraction(item)" v-for="item in 5" :key="item"
             :src="item<fraction?'/static/img/util/xing1.png':'/static/img/util/xing1_gray.png'" alt="">
      </div>
    </div>
    <div class="content">
      <textarea v-model="content" placeholder="请输入评价内容"></textarea>
    </div>
    <div class="submit" :class="{disabled: !content}" @click="submit">提交</div>
  </div>
</template>

<script>
  import CheckBox from '@/components/home/checkbox'
  import { saveMechanismComment } from "../../../../../service/profile/profile";
  import { getOrderDetail } from "../../../../../service/profile/order";
    export default {

    name: "index",
    components: {
      CheckBox
    },
    data: function() {
      return {
        id: "",
        info: {},
        isAnonymous: false,
        fraction: 1,
        content: ''
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.getDetail();
    },
    methods: {
      changeFraction: function(n){
        this.fraction = n;
      },
      getDetail: async function() {
        try {
          this.info = await getOrderDetail({ id: this.id });
        } catch (e) {
          setTimeout(() => {
            this.navigateBack({});
          }, 1500);
        }
      },
      submit:async function() {
        if(!this.content){
          return this.$toast('请输入评价内容')
        }
        await saveMechanismComment({
          orgId: this.info.orgId,
          courseId: this.info.courseId,
          teacherId: this.info.teacherId,
          studentId: this.info.studentId,
          commentStar: this.fraction,
       //   isAnonymous: this.isAnonymous,
          comment: this.content
        }, {load: true, successMsg: '评价成功'});
        setTimeout( () => {
          this.navigateBack({});
        }, 1500);
      }
    }
  };
</script>
<style>
  page{
    background-color: #fff;
  }
</style>
<style scoped lang="scss">

  .submit{
    position: absolute;
    bottom: 0;
    left: 0;
    height: rpx(100);
    line-height: rpx(100);
    text-align: center;
    font-size: rpx(32);
    color: #000;
    width: 100%;
    background-color: #FFD200;
  }
  .org{
    border-bottom: 1px solid $border;
    margin: 0 auto;
    width: rpx(690);
    height: rpx(181);
    @extend %flex;
    @extend %flex-align-center;
    @extend %justify-content-space-between;
    .info{
      img{
        margin-right: rpx(31);
        display: inline-block;
        vertical-align: middle;
        width: rpx(100);
        height: rpx(100);
      }
      .text{
        display: inline-block;
        vertical-align: middle;
        font-size: rpx(24);
        line-height: rpx(24);
        color: #9a9a9a;
      }
      .name{
        font-size: rpx(30);
        color: #313131;
        margin-bottom: rpx(28);
      }
    }
    .check{
      font-size: rpx(24);
      color: #313131;
      span{
        vertical-align: middle;
        margin-left: rpx(19);
      }
    }
  }
  .xing{
    height: rpx(150);
    @extend %flex;
    @extend %flex-align-center;
    @extend %justify-content-center;
    img{
      margin: 0 rpx(12);
      width: rpx(50);
      height: rpx(50);
    }
  }
  .content{
    background-color: #f2f2f2;
    width: rpx(690);
    height: rpx(320);
    margin: 0 auto;
    textarea{
      width: 100%;
      height: 100%;
      padding: rpx(30);
      font-size: rpx(26);
    }
  }
</style>
