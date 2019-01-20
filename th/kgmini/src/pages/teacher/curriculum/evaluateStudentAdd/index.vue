<template>
  <div class="add page">
    <div class="user" >
      <div class="head-img">
        <img class="img"
             :src="child.avatarUrl?(imageUrl+child.avatarUrl):'http://image.zhi-you.net/avatar_default.jpg'" alt="">
        <img class="six" :src="child.gender?'/static/img/main/girl.png':'/static/img/main/boy.png'" alt="">
        <!--<img class="six" src="/static/img/main/boy.png" alt="">-->
      </div>
      <div class="user-info">
        <p>
          <span class="name">{{child.realname}}</span>
          <span>{{child.className}}</span>
        </p>
        <p>{{child.schoolName}}</p>
      </div>
    </div>
    <div class="gray-box"></div>
    <div class="result">
      <div class="title">
        成果
      </div>
      <UploadImg @change="imgChange"/>
      <!--课程提升-->
      <div class="curriculum-upload">
        <div class="title">课程提升</div>
        <table>
          <thead>
          <tr>
            <td></td>
            <td>优</td>
            <td>良</td>
            <td>及格</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in list" :key="item.id">
            <td>{{item.improvement}}</td>
            <td @click="changeStar(index, 1)">
              <div class="radius1" v-show="item.star===1"></div>
            </td>
            <td @click="changeStar(index, 2)">
              <div class="radius2" v-show="item.star===2"></div>
            </td>
            <td @click="changeStar(index, 3)">
              <div class="radius3" v-show="item.star===3"></div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="evaluate-text">
        <div class="title">评价</div>
        <div class="text-back">
          <textarea placeholder="说点什么吧" v-model="comment"/>
        </div>
      </div>
      <button class="submit " :disabled="!comment" @click="handleSubmit">提交</button>
    </div>
  </div>
</template>

<script>
  import Child from "@/components/global/child";
  import UploadImg from "@/components/global/uploadImg";
  import { listImprovementComment, saveTeacherComment, studentDetail } from "../../../../service/teacher/main";
  import { imageUrl } from "../../../../service/config";
  import { tempFileToImageUrl } from "../../../../utils";

  export default {

    name: "index",
    components: {
      Child,
      UploadImg
    },
    data: function() {
      return {
        id: "",
        studentId: "",
        child: {},
        imageUrl: imageUrl,
        list: [],
        comment: '',
        imgs: []
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.studentId = this.route().query.studentId;
      this.getStudentDetail();
      this.listImprovementComment();
    },
    methods: {
      imgChange: function(imgs) {
        this.imgs = imgs;
      },
      getStudentDetail: async function() {
        this.child = await studentDetail({ id: this.studentId });
      },
      /**
       * 获得能力提升列表
       */
      listImprovementComment:async function(){
        const data = await listImprovementComment({courseId: this.id});
        this.list= data.list.map((i) =>{
          i.star = 1;
          return i;
        });
      },
      changeStar: function(index, type){
        this.list[index].star = type;
      },
      handleSubmit:async function() {
        if(!this.comment){
          return this.$toast('请输入评价内容')
        }

        let params = {
          studentId:this.studentId,
          courseId: this.id,
          comment: this.comment,
          improveJson: JSON.stringify(this.list.map(i=> {
            return {
              improveId: i.id,
              improveStar: i.star
            }
          }))
        }
        // 转化图片
        if (this.imgs.length) {
          let imgs = [];
          for (let i = 0; i < this.imgs.length; i++) {
            imgs.push({ fileHash: await tempFileToImageUrl(this.imgs[i]) })
          }
          params.teacherImgJson = JSON.stringify(imgs);
        }
        await saveTeacherComment(params, {load: true, successMsg: true});
        setTimeout(() => {
           this.navigateBack({});
        }, 1500);
      }
    }
  };
</script>

<style scoped lang="scss">


  .add {
    padding-bottom: rpx(150);
  }

  .result {
    .title {
      margin: rpx(39) rpx(30) 0;
      font-weight: bold;
      font-size: rpx(34);
      color: #313131;
    }
    .curriculum-upload {
      margin: 0 rpx(30);
      padding-bottom: rpx(40);
      border-top: 1px solid $border;
      border-bottom: 1px solid $border;
      .title {
        margin-left: 0;
      }
      table {
        text-align: center;
        width: 100%;
        td {
          padding: rpx(10) 0;
        }
        td:first-of-type {
          text-align: left;
        }
      }
    }

    .evaluate-text {
      .text-back {
        box-sizing: border-box;
        margin: rpx(30) auto 0;
        width: rpx(690);
        height: rpx(310);
        background-color: #F2F2F2;
        border-radius: rpx(20);
        padding: rpx(40) rpx(31);
      }
      textarea {
        height: rpx(250);
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: rpx(100);
    font-size: rpx(32);
    color: #313131;
    text-align: center;
    line-height: rpx(100);
    font-weight: bold;
    background-color: $them;
  }
  .user {
    margin-left: rpx(30);
    width: rpx(630);
    height: rpx(190);
    @extend %flex;
    @extend %flex-align-center;
    .head-img {
      position: relative;
      .img {
        display: block;
        width: rpx(110);
        height: rpx(110);
        border-radius: 50%;
      }
      .six {
        position: absolute;
        width: rpx(36);
        height: rpx(36);
        bottom: 0;
        right: 0;
      }
    }
  }

  .user-info {
    margin-left: rpx(30);
    font-size: rpx(28);
    color: #9A9A9A;
    line-height: rpx(28);
    .name {
      line-height: rpx(31);
      margin-right: rpx(31);
      font-size: rpx(32);
      color: #313131;
    }
    p:first-of-type {
      margin-bottom: rpx(39);
    }
  }
</style>
<style>
  page {
    background-color: #fff;
  }
</style>
