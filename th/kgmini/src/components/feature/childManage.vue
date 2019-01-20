<template>
    <div class="card">
      <div class="head">
        <img class="head-img"  :src="info.avatarUrl?(imgBaseUrl+info.avatarUrl):'http://image.zhi-you.net/avatar_default.jpg'"  alt="">
        <img class="sex" :src="info.gender?'/static/img/main/girl.png':'/static/img/main/boy.png'" alt="">
      </div>
      <div class="name">{{info.realname}}</div>
      <div class="item">
        <label>性别：</label>
        <span>{{['男','女'][info.gender]}}</span>
      </div>
      <div class="item">
        <label>民族：</label>
        <span>{{info.nation || ""}}</span>
      </div>
      <div class="item">
        <label>学校：</label>
        <span>{{info.schoolName || ""}}</span>
      </div>
      <div class="item">
        <label>年级：</label>
        <span>{{info.gradeName || ""}}</span>
      </div>
      <div class="item">
        <label>班级：</label>
        <span>{{info.className || ""}}</span>
      </div>
      <div class="item">
        <label>学号：</label>
        <span>{{info.number || ""}}</span>
      </div>
      <div class="item">
        <label>生日：</label>
        <span>{{info.birthday||''}}</span>
      </div>
      <div class="submit-btn" @click="handleClick" v-if="btn">{{btn}}</div>
    </div>
</template>

<script>
  export default {
    name: "childManage",
    props: ['btn', 'info'],
    data: function(){
      return {
        imgBaseUrl: ''
      }
    },
    onload: function(){
      this.imgBaseUrl = this.$imgBaseUrl;
    },
    methods: {
      handleClick: function() {
        this.$emit('btnClick')
      }
    }
  };
</script>

<style scoped lang="scss">

  .card{
    padding-bottom: rpx(50);
  }
  .head{
    position: relative;
    margin: rpx(40) auto 0;
    width: rpx(110);
    height: rpx(110);
    .head-img{
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }
    .sex{
      width: rpx(36);
      height: rpx(36);
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  .name{
    margin-bottom: rpx(60);
    margin-top: rpx(30);
    text-align: center;
    font-size: rpx(32);
    line-height: rpx(32);
    color: #313131;
    font-weight: bold;
  }
  .submit-btn{
    margin-bottom: 0;
  }

  .item{
    margin: rpx(20) rpx(60);
    line-height: rpx(30);
    font-size: rpx(30);
    color: #313131;
    label{
      font-weight: bold;
    }
    span{
      font-size: rpx(28);
      color: #000;
    }
  }
</style>
