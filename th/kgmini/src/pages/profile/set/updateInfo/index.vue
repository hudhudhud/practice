<template>
  <div class="update-info page">

    <div class="self">
      <span>{{user.nickname|| user.realname ||"无昵称"}}</span>
      <img @click="getHeadImg" :src="avatarUrl" alt="">
      <input class="file" type="file" v-if="isH5" @change="uploadImgH5" >
    </div>
    <div class="gray-box"></div>
    <div class="infos">
      <div class="item"><label>用户昵称</label><input placeholder="请输入用户昵称" type="text" v-model.lazy="nickname"/></div>
      <div class="item"><label>手机号码</label><input disabled style="color:#9a9a9a;" disabled type="number" v-model.lazy="phone"/></div>
      <div class="item"><label>真实姓名</label><input placeholder="请输入真实姓名" type="text" v-model.lazy="realname"/></div>
      <div class="item">
        <label>性别</label>
        <div class="sex">
          <div @click="sexChange(0)" :class="{active: sex===0}">男</div>
          <div @click="sexChange(1)" :class="{active: sex===1}">女</div>
        </div>
      </div>
      <!--<div class="item" v-if="role==='1'"><label>微信号</label><input disabled type="text" v-model.lazy="WxNumber"/></div>-->
      <div class="item" v-if="role==='2'"><label>微信号</label><input type="text" v-model.lazy="WxNumber"/></div>
      <div class="item" v-if="role==='2' && !isInstitution"><label>所属学校</label><input style="color:#9a9a9a;" disabled type="text" v-model.lazy="institutionName"/></div>
      <div class="item" v-if="role==='2' && isInstitution"><label>所属机构</label><input style="color:#9a9a9a;" disabled type="text" v-model.lazy="institutionName"/></div>
      <div class="item" v-if="role==='2'&& false"><label>教龄</label><input maxlength="1" type="number"
                                                                      v-model.lazy="teachAge"></div>
      <div class="item" v-if="role==='2'&& false"><label>身份证</label><span>点击查看身份证照片</span></div>
      <div class="item" v-if="role==='2'&& false">
        <label>履历</label>
        <div>
          <span>王翠花</span>
          <img class="icon-right" src="/static/img/util/iconRight.png" alt="">
        </div>
      </div>

      <div class="item" v-if="role==='2'&& false">
        <label>一句话简介</label>
      </div>
      <div class="intro" v-if="role==='2'&& false">
        <textarea placeholder="用一句话介绍一下你自己吧" v-model="shortIntro"/>
      </div>

    </div>

    <div class="save" @click="submit">保存</div>

  </div>
</template>

<script>
  import store from "../../../store/store";
  import * as service from "@/service/profile/updateInfo";
  import { isPhone, tempFileToImageUrl, uploadImg } from "../../../../utils";
  import { Indicator } from "mint-ui";
  export default {

    name: "index",
    computed: {
      user: function() {
        return {
          ...store.state.loginData, ...store.state.userInfo
        };
      },
      role: function() {
        return store.state.role;
      }
    },
    data: function() {
      return {
        nickname: "",
        phone: "",
        realname: "",
        teachAge: 0,
        idcard: "",
        shortIntro: "",
        sex: 0,
        avatarUrl: '',
        avatarImgUrl: '',
        isInstitution:true,
        institutionName:'',
        WxNumber:''
      };
    },
    onLoad: function() {
      this.nickname = this.nickname || this.user.nickname || this.user.realname;
      this.phone = this.user.phone || this.user.loginname;
     this.realname = this.realname || this.user.realname;
     this.sex = this.user.gender;
     this.teachAge = this.user.teachAge;
     this.shortIntro = this.user.shortIntro;
      this.avatarUrl = this.user.avatarUrl || 'http://image.zhi-you.net/avatar_default.jpg';
      if(this.user.type&&this.user.type === 'me_teacher'){
        this.isInstitution = true;
      }else if(this.user.type&&this.user.type === 'sc_teacher') {
        this.isInstitution = false;
      }
      this.institutionName = this.user.orgName;
      this.WxNumber = this.user.wechatId
    },
    methods: {
      getHeadImg: function(){
        wx.chooseImage({
          count: 1,
          sizeType: [ 'original'],
          sourceType: ['album', 'camera'],
          success: async (res) => {
            // tempFilePath可以作为img标签的src属性显示图片
            this.avatarUrl = res.tempFilePaths[0];
           this.avatarImgUrl = await tempFileToImageUrl(this.avatarUrl);
          }
        })
      },
      // H5上传图片
      uploadImgH5:async function(e){
        const file = e.target.files[0];
        const type = file.type.split('/')[0];//按照惯例，不应该由前端判断格式，因为这里是根据后缀名判断的，修改后缀名仍旧可以上传，理应由后端根据文件格式来判断。
        if (type !== 'image') {
          this.$toast('请上传图片');
          return;
        }
        const size = Math.round(file.size / 1024 / 1024);
        if (size > 3) {
          this.$toast('图片大小不得超过3M');
          return;
        }
        Indicator.open('正在上传');
        try {
          const url = await uploadImg(file);
          this.avatarImgUrl = url;
        }finally {
          Indicator.close();
        }
      },
      sexChange: function(n) {
        this.sex = n;
      },
      submit: async function() {
        if(!this.nickname){
          this.$toast('请输入昵称');
          return;
        }else{
          this.nickname = this.nickname.replace(/\s/g, '');
          if(!this.nickname){
            this.$toast('请输入昵称');
            return;
          }
        }
        if(!isPhone(this.phone)){
          this.$toast('请输入手机号码');
          return;
        }
        if(!this.realname){
          this.$toast('请输入真实姓名');
          return;
        }else{
          this.realname = this.realname.replace(/\s/g, '');
          if(!this.realname){
            this.$toast('请输入真实姓名');
            return;
          }
        }
        if(this.role === 2){
          if(!this.WxNumber){
            this.$toast('请输入真实微信号');
            return;
          }
        }
        let param = {
          id: this.user.id,
          userId:this.user.userId,
          nickname: this.nickname,
          phone: this.phone,
          realname: this.realname,
          gender: this.sex,
          wechatId:this.WxNumber,
          teacherId:this.user.teacherId,
        };
        if(this.avatarImgUrl){
          param.avatar = this.avatarImgUrl;
        }
        if (this.role==='1') {
          delete param.wechatId;
          delete param.teacherId;
          await service.updateInfo(param, { successMsg: "修改成功", load: true });
          store.dispatch('getUserInfo');
        } else {
          delete param.id;
          await service.updateTeacherInfo(param, { successMsg: "修改成功", load: true });
          store.dispatch('getUserInfo');
        }

        setTimeout(() => {
          this.navigateBack({});
        }, 1500);
        //  this.navigateBack({});
      }
    }
  };
</script>


<style scoped lang="scss">


  .update-info {
    padding-bottom: rpx(130);
  }

  .icon-right {
    margin-left: rpx(26);
    vertical-align: middle;
    width: rpx(13);
    height: rpx(23);
  }

  input {
    text-align: right;
  }

  .self {
    padding: 0 rpx(31);
    height: rpx(216);
    @extend %flex;
    @extend %flex-align-center;
    @extend %justify-content-space-between;
    span {
      font-size: rpx(42);
      color: #313131;
      font-weight: bold;
    }
    img {
      border-radius: 50%;
      width: rpx(136);
      height: rpx(136);
    }
    .file{
      opacity: 0;
      position: absolute;
      right: rpx(31);
      border-radius: 50%;
      width: rpx(136);
      height: rpx(136);
    }
  }

  .infos {
    padding: 0 rpx(30);
    .sex {
      font-size: 0;
      .active {
        color: #000 !important;
        background-color: $them;
      }
      div {
        margin-left: rpx(20);
        border-radius: rpx(25);
        display: inline-block;
        vertical-align: middle;
        width: rpx(98);
        height: rpx(50);
        line-height: rpx(50);
        font-size: rpx(26);
        color: #9a9a9a;
        text-align: center;
      }
    }
  }

  .item {
    margin: rpx(35) 0;
    height: rpx(50);
    line-height: rpx(50);
    @extend %flex;
    @extend %flex-align-center;
    @extend %justify-content-space-between;
    label {
      color: #313131;
      font-size: rpx(30);
      font-weight: bold;
    }
    span {
      vertical-align: middle;
      font-size: rpx(26);
      color: #9A9A9A;
    }
  }

  .intro {
    padding: rpx(40) rpx(30);
    background-color: #f2f2f2;
  }

  .save {
    z-index: 10;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: rpx(100);
    line-height: rpx(100);
    background-color: $them;
    text-align: center;
    font-size: rpx(32);
    color: #000;
    font-weight: bold;
  }
</style>

<style>
  page {
    background-color: #fff;
  }
</style>
