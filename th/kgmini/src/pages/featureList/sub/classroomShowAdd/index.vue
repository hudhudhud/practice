<template>
  <div class="show-add">
    <div class="submit " :class="{disabled:!content}" @click="handleSubmit">提交</div>
    <div class="gray-box"></div>
    <div style="padding: 10rpx 0;">
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
        <span class="value">{{info.realname}}</span>
      </div>
      <div class="item">
        <span>上课机构：</span>
        <span class="value">{{info.orgName}}</span>
      </div>
      <div class="item">
        <span>上课时间：</span>
        <span class="value">{{info.startTime+'---'+info.endTime}}</span>
      </div>
    </div>
    <div class="gray-box"></div>
    <div class="item">
      <div>课堂风采&nbsp;&nbsp;&nbsp;<span class="value" style="font-size: 26rpx;">{{time}}</span></div>
    </div>
    <div class="content">
      <textarea  placeholder="请输入内容" v-model="content"></textarea>
    </div>
    <UploadImg @change="imgChange" />
  </div>
</template>

<script>
  import UploadImg from '@/components/global/uploadImg'
  import { courseTableDetail } from "../../../../service/featureList/schoolSelect";
  import { tempFileToImageUrl } from "../../../../utils";
  import { saveCourseStyle } from "../../../../service/teacher/main";
    export default {

    name: "index",
    components: {
      UploadImg
    },
    data: function(){
      return {
        id: '',
        info: {},
        content: '',
        imgs: [],
        time: ''
      }
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.time = this.route().query.time;
      this.getInfo();
    },
    methods: {
      imgChange: function(imgs) {
        this.imgs = imgs;
      },
      getInfo:async function(){
          this.info = await courseTableDetail({id: this.id});
      },
      handleSubmit:async function(){
        if(!this.content){
          return this.$toast('请输入内容');
        }
        let param = {courseId: this.id,courseDate: this.time,comment: this.content};
        // 转化图片
        if (this.imgs.length) {
          let imgs = [];
          for (let i = 0; i < this.imgs.length; i++) {
            imgs.push({ fileHash: await tempFileToImageUrl(this.imgs[i]) })
          }
          param.imgJson = JSON.stringify(imgs);
        }
        await saveCourseStyle(param, {load: true,successMsg: true});
        setTimeout(() => {
          this.navigateBack({});
        }, 1500);
      },
    }
  };
</script>

<style scoped lang="scss">

  .show-add{
    padding-bottom: rpx(130);
  }
  .item{
    margin: rpx(20) rpx(30);
    @extend %flex;
    @extend %justify-content-space-between;
    font-size: rpx(30);
    color: #313131;
    font-weight: bold;
    .value{
      font-size: rpx(28);
      color: #6C6C6C;
      font-weight: normal;
    }
  }
  .content{
    overflow: hidden;
    box-sizing: border-box;
    padding: rpx(30);
    border-radius: rpx(20);
    width: rpx(690);
    height: rpx(180);
    margin: rpx(10) auto 0;
    background-color: #f2f2f2;
    textarea{
      height: rpx(150);
    }
  }
  .submit{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: rpx(100);
    line-height: rpx(100);
    text-align: center;
    font-size: rpx(32);
    color: #fff;
    background-color: $them;
    font-weight: bold;
  }
  .submit.disabled{
    background-color: #9A9A9A;
  }
</style>
<style>
  page{
    background-color: #fff;
  }
</style>
