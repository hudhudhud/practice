<template>
  <div style="padding-bottom: 50rpx;" class="page">
    <!--<img class="title-img" :src="info.logoUrl" alt="">-->
    <swiper class="swiper title-img" v-if="!isH5"
            autoplay="true">
      <swiper-item v-for="(item, index) in info.imgs" :key="index">
        <image mode="scaleToFill" :src="item.fileUrl"
               class="slide-image"/>
      </swiper-item>
    </swiper>
    <mt-swipe :auto="3000" v-if="isH5" class="swiper" :show-indicators="false">
      <mt-swipe-item v-for="(item, index) in info.imgs" :key="index">
        <img :src="item.fileUrl"
             class="slide-image"/>
      </mt-swipe-item>
    </mt-swipe>
    <div class="title-name">{{info.name}}</div>
    <p class="intro">{{info.briefIntro}}</p>
    <div class="line"></div>
    <div>
      <div class="row flow">
        <div>
          <label>目标：</label>
        </div>
        <div style="line-height: 35rpx">
          <span>{{info.goal || ''}}</span>
        </div>
      </div>
      <div class="row flow">
        <div> <label>提升：</label></div>
        <div style="line-height: 35rpx"><span>{{info.promotion || ""}}</span></div>
      </div>
      <div class="row flow">
        <div style="width: 150rpx"><label>成果展示：</label></div>
        <div style="width: 540rpx;line-height: 35rpx"><span>{{info.harvest || ''}}</span></div>
      </div>
      <div class="row">
        <label>授课机构：</label>
      </div>
      <div class="ins-select" v-for="(item, index) in list" :key="item.id" @click="toInstitution(index)">
        <span>{{item.name || ''}}</span>
        <div class="icon-right back-gray"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getCurriculumIntro2, listMechanismByCourse } from "../../../service/home/curriculum";


  export default {

    name: "index",
    data: function() {
      return {
        id: "",
        info: {},
        list: []
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.getInfo();
    },
    methods: {
      getInfo: async function() {
        const data = await getCurriculumIntro2({ id: this.id });
        this.info = data;
        this.getList(this.id);
      },
      getList: async function(id) {
        try {
          const data = await listMechanismByCourse({ courseId: id });
          this.list = data.list;
        }catch (e) {

        }

      },
      toInstitution: function(i) {
        this.navigateTo({
          url: '../institutionInfo/main?id='+this.list[i].id + '&courseId='+this.id+'&orgId='+this.list[i].orgId
        })
      }
    }
  };
</script>
<style>
  page {
    background-color: #fff;
  }
</style>
<style scoped lang="scss">


  .box {
    background-color: #fff;
    margin-bottom: rpx(20);
    padding-bottom: rpx(40);
  }

  .title-img {
    width: 100%;
    height: rpx(344);
    image{
      width: 100%;
    }
  }

  .title-name {
    margin-top: rpx(39);
    padding-left: rpx(31);
    color: #313131;
    font-size: rpx(38);
    line-height: rpx(38);
    font-weight: bold;
  }

  .intro {
    margin: rpx(38) rpx(71) 0 rpx(31);
    font-size: rpx(26);
    color: #9A9A9A;
  }

  .line {
    margin-top: rpx(40);
    height: rpx(20);
    background-color: #f2f2f2;
  }

  .ins-select {
    box-sizing: border-box;
    padding: 0 rpx(30);
    border-radius: rpx(20);
    margin: rpx(20) auto 0;
    width: rpx(690);
    height: rpx(86);
    background-color: #f2f2f2;
    font-size: rpx(28);
    color: #313131;
    @extend %flex;
    @extend %justify-content-space-between;
    @extend %flex-align-center;
  }

  .ins-select:first-of-type {
    margin-top: rpx(29);
  }

  .back-gray {
    background-color: #9A9A9A;
  }

  .icon-right {
    border-radius: 50%;
    width: rpx(40);
    height: rpx(40);
    position: relative;
    text-align: center;
  }

  .icon-right::after {
    box-sizing: border-box;
    content: '';
    position: absolute;
    left: rpx(8);
    top: rpx(14);
    width: rpx(16);
    height: rpx(16);
    border: rpx(4) solid #fff;
    border-color: #fff #fff transparent transparent;
    transform: rotate(45deg);
  }

  .flow {
    overflow: hidden;
    div {
      float: left;
    }
    div:first-child {
      width: rpx(90);
    }
    div:last-child {
      width: rpx(600);
    }
  }

  .swiper {
    width: 100%;
    height:rpx(344) ;
  }

  .slide-image {
    width: 100%;
    height: 100%;
  }

</style>
