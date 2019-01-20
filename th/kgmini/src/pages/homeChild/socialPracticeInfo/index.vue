<template>
  <div>
    <div class="box">
      <swiper class="swiper" indicator-dots="false" v-if="!isH5"
              autoplay="true">
        <swiper-item v-if="info.doorImgs.length !== 0" v-for="(item, index) in info.doorImgs" :key="index">
          <image mode="scaleToFill" :src="item.fileUrl"
                 class="slide-image"/>
        </swiper-item>
        <swiper-item v-if="info.doorImgs.length === 0">
          <image mode="scaleToFill" :src="defaultSrc"
                 class="slide-image"/>
        </swiper-item>
      </swiper>
      <mt-swipe :auto="3000" v-if="isH5" class="swiper" :show-indicators="false">
        <mt-swipe-item v-for="item in info.doorImgs" :key="item.id">
          <img :src="item.fileUrl"
               class="slide-image"/>
        </mt-swipe-item>
        <mt-swipe-item v-if="info.doorImgs.length === 0">
          <img :src="defaultSrc"
               class="slide-image"/>
        </mt-swipe-item>
      </mt-swipe>

      <div class="title-name">{{info.name}}</div>
      <div class="title-intro">{{info.briefIntro}}</div>
      <!--   <div class="price">
           <span>课程价格：</span>
           <span>¥ 1220</span>
         </div>-->
    </div>
    <div class="box">
      <AddressShow :address="info.provinceName+info.cityName+info.countyName+info.address"
                   :phone="info.tellphone" :info="info" @map="toMap"/>
    </div>
    <!-- <div class="box">
       <p class="row">
         <label>举办单位：</label>
         <span>机构名称</span>
       </p>
       <p class="row">
         <label>时间：</label>
         <span>机构名称</span>
       </p>
       <p class="row">
         <label>成团要求：</label>
         <span>机构名称</span>
       </p>
       <p class="row">
         <label>适龄年级：</label>
         <span>机构名称</span>
       </p>
     </div>
     <div class="box">
       <div class="tabs">
         <div class="active">目标</div>
         <div>特色环节</div>
         <div>活动流程</div>
       </div>
       <div class="tabs-content">
         <p>1. 十多个十多个特唐僧多福多寿国师国师额我问十分</p>
         <p>1. 十多个十多个特唐僧多福多寿国师国师额我问十分</p>
         <p>1. 十多个十多个特唐僧多福多按时大大说打删掉阿萨德爱思寿国师国师额我问十分</p>
         <p>1. 十多个十多个特唐僧多福多寿国师国师额我问十分</p>
       </div>
     </div>
     <div class="bottom">
       <div><img src="/static/img/util/xing1.png" alt=""><span>已收藏</span></div>
       <div>立即报名</div>
     </div>-->

    <div class="curriculum-introduce" v-if="list.length">
      <div class="title">
        <span>活动介绍</span>
        <span style="float: right;font-size: 24rpx;font-weight: normal;padding-right: 30rpx;" v-if="totalNum>3"
              @click="showMorecurriculum">查看更多</span>
      </div>
      <scroll-view class="curriculum-scroll"
                   lower-threshold="30">
        <div class="curriculum" v-for="item in list" :key="item.id">
          <img class="main-img" :src="item.logoUrl" alt="">
          <div class="info">
            <p>
              <span>{{item.name}}</span>
            </p>
            <p>活动时间：{{item.createdAt }}</p>
            <p>适用：{{item.gradeNames}}</p>
          </div>
          <div class="end">
            <p class="price">¥ {{item.fee}}</p>
            <p>
              <a class="button" @click="toCurriculumDetail(item.courseId)">查看</a>
            </p>
          </div>
        </div>
      </scroll-view>

    </div>
  </div>
</template>

<script>
  import AddressShow from "@/components/style/addressShow";
  import { practiseActivityList, practiseBaseDetail } from "../../../service/home/socialPractice";

  export default {

    name: "index",
    components: {
      AddressShow
    },
    data: function() {
      return {
        id: "",
        info: {
          doorImgs:[]
        },
        page: 0,
        size: 10,
        loading: true,
        list: [],
        totalNum: 0
      };
    },
    computed: {
      defaultSrc:function() {
        return this.getDefaultImg('practiseLogo')
      }
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.getInfo();
    },
    methods: {
      showMorecurriculum: function(){
        this.navigateTo({
          url: './curriculumList/main?id='+this.info.orgId
        })
      },
      toCurriculumDetail: function(id){
        this.navigateTo({
          url: '../socialPracticeDetail/main?id='+id
        })
      },
      getInfo: async function() {
        this.info = await practiseBaseDetail({ id: this.id });
        this.check();
      },

      check: function() {
        this.list = [];
        this.loading = false; // 重新开启监听
        this.page = 0;
        this.loadMore();
      },
      loadMore: function() {
        if (this.loading) {
          return;
        }
        this.loading = true;
        this.page++;
        this.getList();
      },
      getList: async function() {
        let params = { pageNo: this.page, pageSize: this.size, orgId: this.info.orgId };
        try {
          const data = await practiseActivityList(params);
          this.totalNum = data.totalNum;
          if (this.page === 1) {
            this.list = data.list;
          } else {
            this.list = this.list.concat(data.list);
          }
          this.loading = Number(data.list.length) < Number(this.size);

        } catch (e) {
          this.loading = false;
        }
      },
      toMap:function(address,lat,lng,institutionName){
        this.navigateTo({
          url: '../map/main?address='+address+'&lat='+lat+'&lng='+lng+'&institutionName='+institutionName
        })
      },
    }
  };
</script>

<style scoped lang="scss">


  .curriculum-scroll {
    max-height: rpx(750);
  }

  .curriculum-introduce {
    .title {
      line-height: rpx(100);
      text-indent: rpx(31);
      font-weight: bold;
      height: rpx(60);
    }
  }

  .curriculum-introduce {
    margin-top: rpx(20);
    background-color: #fff;
    .curriculum:last-of-type {
      border-bottom: none;
    }
    .curriculum {
      @extend %flex;
      @extend %flex-align-center;
      //  padding: rpx(40) rpx(24) rpx(40) rpx(30);
      padding: rpx(40) 0;
      margin: 0 rpx(24) 0 rpx(30);
      border-bottom: 1px solid $border;
      .main-img {
        width: rpx(160);
        height: rpx(160);
      }
      .info {
        margin-left: rpx(21);
        color: #9A9A9A;
        font-size: rpx(24);
        line-height: rpx(24);
        span {
          vertical-align: middle;
        }
        p {
          margin: rpx(22) 0;
        }
        p:first-of-type {
          color: #313131;
          font-size: rpx(31);
        }
      }
      .end {
        min-width: rpx(150);
        flex: 1;
        text-align: right;
      }
      .price {
        color: $subThem-red;
        font-size: rpx(30);
      }
      .button {
        margin-top: rpx(36);
        display: inline-block;
        color: #000;
        font-size: rpx(30);
        line-height: rpx(60);
        background-color: $them;
        padding: 0 rpx(41);
        border-radius: rpx(30);
      }
    }
  }

  .box {
    background-color: #fff;
    margin-bottom: rpx(20);
    padding-bottom: rpx(39);
    overflow: hidden;

  }
  .swiper {
    width: 100%;
    height: rpx(300);
  }

  .slide-image {
    width: 100%;
    height: rpx(344);
  }

  .title-name {
    padding-top: rpx(38);
    line-height: rpx(38);
    font-size: rpx(38);
    color: #313131;
    font-weight: bold;
    padding-left: rpx(31);
  }

  .title-intro {
    color: #9A9A9A;
    font-size: rpx(26);
    margin: rpx(38) rpx(31) 0;
  }

  .price {
    padding: rpx(36) rpx(30) 0;
    color: #5B5B5B;
    font-size: rpx(26);
    line-height: rpx(26);
    span:last-of-type {
      color: $subThem-red;
      font-size: rpx(34);
    }
  }

  .tabs {
    @extend %flex;
    margin: 0 rpx(30);
    text-align: center;
    line-height: rpx(89);
    font-size: rpx(28);
    color: #5b5b5b;
    border-bottom: 1px solid $border;
    > div {
      flex: 1;
    }
    .active {
      font-weight: bold;
      font-size: rpx(32);
    }
  }

  .tabs-content {
    margin: 0 rpx(30);
    font-size: rpx(26);
    color: #9D9D9D;
    p {
      margin-top: rpx(30);
    }
  }

  .bottom {
    position: fixed;
    width: 100%;
    height: rpx(100);
    left: 0;
    bottom: 0;
    background-color: #fff;
    font-size: 0;
    white-space: nowrap;
    text-align: center;
    div {
      height: 100%;
      display: inline-block;
      color: #000;
      line-height: rpx(100);
    }
    div:first-of-type {
      width: rpx(250);
      font-size: rpx(28);
    }
    div:last-of-type {
      width: rpx(500);
      font-size: rpx(32);
      background-color: $them;
    }
    img {
      width: rpx(42);
      height: rpx(42);
      vertical-align: middle;
      margin-right: rpx(22);
    }
    span {
      vertical-align: middle;
    }
  }
</style>
