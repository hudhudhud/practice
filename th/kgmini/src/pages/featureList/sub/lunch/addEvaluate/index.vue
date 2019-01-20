<template>
  <div style="padding-bottom: 110rpx;">
    <div class="xing-item">
      <span>味道：</span>
      <div class="xing" v-for="item in 5" :key="item">
        <img @click="changeFraction(1,item)"
             :src="item<fraction1?'/static/img/util/xing1.png':'/static/img/util/xing1_gray.png'" alt="">
      </div>
    </div>
    <div class="xing-item">
      <span>卫生：</span>
      <div class="xing" v-for="item in 5" :key="item">
        <img @click="changeFraction(2,item)"
             :src="item<fraction2?'/static/img/util/xing1.png':'/static/img/util/xing1_gray.png'" alt="">
      </div>
    </div>
    <div class="xing-item">
      <span>分量：</span>
      <div class="xing" v-for="item in 5" :key="item">
        <img @click="changeFraction(3,item)"
             :src="item<fraction3?'/static/img/util/xing1.png':'/static/img/util/xing1_gray.png'" alt="">
      </div>
    </div>
    <div class="xing-item">
      <span>营养：</span>
      <div class="xing" v-for="item in 5" :key="item">
        <img @click="changeFraction(4,item)"
             :src="item<fraction4?'/static/img/util/xing1.png':'/static/img/util/xing1_gray.png'" alt="">
      </div>
    </div>
    <div class="xing-item">
      <span>具体评价：</span>
      <input type="text" placeholder="请填写评价" v-model="content">
    </div>
    <div class="line">添加照片</div>
    <UploadImg @change="imgChange"/>
    <div class="submit" :class="{disabled: !content}" @click="handleSubmit">提交评价</div>
  </div>
</template>

<script>
  import UploadImg from "@/components/global/uploadImg";
  import { commentSaveLunchComment } from "../../../../../service/featureList/lunch";
  import store from "../../../../store/store";
  import { tempFileToImageUrl } from "../../../../../utils";

  export default {

    name: "index",
    components: {
      UploadImg
    },
    data: function() {
      return {
        fraction1: 1,
        fraction2: 1,
        fraction3: 1,
        fraction4: 1,
        id: "",
        content: "",
        imgs: []
      };
    },
    computed: {
      userInfo: function() {
        return store.state.userInfo;
      }
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
    },
    methods: {
      changeFraction: function(index, n) {
        this["fraction" + index] = n;
      },
      imgChange: function(imgs) {
        this.imgs = imgs;
        console.log(this.imgs);
      },
      handleSubmit: async function() {
        if (!this.content) {
          return this.$toast("请填写内容");
        }
        let param = {
          supplierId: this.id,
          //  commentor: this.userInfo.id,
          taste: this.fraction1,
          health: this.fraction2,
          component: this.fraction3,
          nutrition: this.fraction4,
          comment: this.content
        };
        // 转化图片
        if (this.imgs.length) {
          let imgs = [];
          for (let i = 0; i < this.imgs.length; i++) {
            imgs.push({ fileHash: await tempFileToImageUrl(this.imgs[i]) })
          }
          param.lunchImgJson = JSON.stringify(imgs);
        }

        const data = await commentSaveLunchComment(param, { load: true, successMsg: "添加成功" });
        setTimeout(() => {
          this.navigateBack({});
        }, 1500);

        //
      }
    }
  };
</script>

<style scoped lang="scss">


  .line {
    border-top: 1px solid $border;
    margin: rpx(130) rpx(30) 0;
    padding-top: rpx(69);
    line-height: rpx(32);
    font-size: rpx(32);
    font-weight: bold;
    color: #313131;
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: rpx(100);
    line-height: rpx(100);
    text-align: center;
    font-size: rpx(32);
    color: #000;
    background-color: $them;
  }

  .xing-item {
    margin: rpx(60) 0 0 rpx(32);
    font-size: rpx(30);
    color: #313131;
    input {
      display: inline-block;
      vertical-align: middle;
      width: 50vw;
    }
    span {
      font-weight: bold;
      vertical-align: middle;
    }
    .xing {
      padding: 0 rpx(10);
      vertical-align: middle;
      display: inline-block;
      img {
        vertical-align: middle;
        width: rpx(36);
        height: rpx(36);
      }
    }
  }

</style>

<style>
  page {
    background-color: #fff;
  }
</style>
