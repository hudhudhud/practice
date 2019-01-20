<template>
  <div class="component">
    <div class="img" v-for="(item, index) in imgs" :key="item" @click="handlePreviewImage(index)">
      <img class="show-img" :src="(isH5?imageUrl:'')+item" alt="">
      <img class="close" @click.stop="clear(index)" src="/static/img/component/img_close.png" alt="">
    </div>
    <div class="img add" @click="handleChooseImage">
      <img class="add-img" src="/static/img/component/img_add.png" alt="">
      <p>上传照片</p>
      <input type="file" v-if="isH5" class="file" @change="uploadImgH5" multiple="multiple">
    </div>
  </div>
</template>

<script>
  import {Indicator} from 'mint-ui'
  import { uploadImg } from "../../utils";
  import { imageUrl } from "../../service/config";
  export default {
    name: "uploadImg",
    data: function() {
      return {
        imgs: [],
        imageUrl: imageUrl
      };
    },
    methods: {
      handlePreviewImage: function(n){
        wx.previewImage({
          current: this.imgs[n], // 当前显示图片的http链接
          urls: this.imgs // 需要预览的图片http链接列表
        })
      },
      clear: function(n) {
        this.imgs.splice(n, 1);
      },
      handleChooseImage: function() {
        let self = this;
        wx.chooseImage({
          // count: 1,
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"],
          success(res) {
            // tempFilePath可以作为img标签的src属性显示图片
            self.imgs = self.imgs.concat(res.tempFilePaths);
            self.$emit('change', self.imgs);
          }
        });
      },
      uploadImgH5:async function(e) {
        if(!e.target.files.length){
          return;
        }
        Indicator.open('正在上传');
        for(let file of e.target.files){
          const type = file.type.split('/')[0];//按照惯例，不应该由前端判断格式，因为这里是根据后缀名判断的，修改后缀名仍旧可以上传，理应由后端根据文件格式来判断。
          if (type !== 'image') {
            this.$toast('请上传图片格式');
            continue;
          }
          const size = Math.round(file.size / 1024 / 1024);
          if (size > 3) {
            this.$toast('图片大小不得超过3M');
            continue;
          }
          try {
            const url = await uploadImg(file);
            this.imgs.push(url);
            // this.avatarImgUrl = url;
          }catch (e) {}
        }
        Indicator.close();
        this.$emit('change', this.imgs);
      }
    }
  };
</script>

<style scoped lang="scss">

  .file{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }
  .component {
    padding: rpx(30) 0 rpx(30) rpx(30);
    font-size: 0;
  }

  .img {
    box-sizing: border-box;
    margin-bottom: rpx(20);
    margin-right: rpx(20);
    vertical-align: middle;
    display: inline-block;
    width: rpx(156);
    height: rpx(156);
    position: relative;
    .show-img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .close {
      position: absolute;
      width: rpx(30);
      height: rpx(30);
      right: rpx(-5);
      bottom: rpx(-5);
    }
  }

  .add {
    overflow: hidden;
    border: 1px dashed #9A9A9A;
    .add-img {
      display: block;
      margin: rpx(38) auto 0;
      width: rpx(38);
      height: rpx(38);
    }
    p {
      text-align: center;
      font-size: rpx(24);
      line-height: rpx(24);
      margin-top: rpx(20);
      color: #9A9A9A;
    }
  }
</style>
