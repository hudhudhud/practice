<template>
  <div class="page">
    <tabs selected="home"></tabs>
    <Search/>

    <swiper class="swiper" v-if="!isH5"
            autoplay="true">
      <swiper-item v-for="item in bannerList" :key="item.id">
        <image mode="scaleToFill" :src="imageUrl+item.img"
               class="slide-image"/>
      </swiper-item>
    </swiper>
    <mt-swipe :auto="3000" v-if="isH5" class="swiper" :show-indicators="false">
      <mt-swipe-item v-for="item in bannerList" :key="item.id">
        <img :src="imageUrl+item.img"
               class="slide-image"/>
      </mt-swipe-item>
    </mt-swipe>
    <div class="title-tab">

      <a class="title-tab-item" v-for="(item, index) in widgets" :key="index" @click="switchTab(item.url)">
        <img :src="item.icon" alt="">
        <span>{{item.name}}</span>
      </a>
    </div>
    <Notice></Notice>
    <div class="school-name">
      <div class="name">{{partner.assignedOrgName}}</div>
      <div class="sub-title">指定服务机构</div>
    </div>
    <div class="phone-tip">
      <img src="/static/img/main/phone_icon.png" alt="">
      <span>教育咨询服务电话：</span>
      <span class="red" @click="callPhone">{{partner.hotLine}}</span>
    </div>

    <!--机构列表-->
    <template v-if="institutionAuth">
      <ListTab :text="tabsText" :status.sync="status"/>
      <div class="list">
        <InstitutionItem @detail="detail" :isHome="true" :info="item" v-for="(item,index) in list" :key="index"></InstitutionItem>
        <div v-if="!list.length" style="text-align: center;line-height: 50px">正在定位中......</div>
      </div>
    </template>

  </div>
</template>

<script>
  import Search from "@/components/home/search";
  import Notice from "@/components/home/notice";
  import ListTab from "@/components/style/listTab";
  import InstitutionItem from "@/components/global/institutionItem";
  import { bannerList } from "../../service/tabs/home";
  import { nearbyList } from "../../service/tabs/nearby";
  import { imageUrl } from "../../service/config";

  export default {
    name: "index",

    data: function() {
      return {
        bannerList: [],
        tabsText: ["认证机构", "课后服务机构"],
        list: [],
        imageUrl: imageUrl,
        again: false,
        status: 0
      };
    },
    components: {
      Search,
      ListTab,
      InstitutionItem,
      Notice
    },
    onHide: function() {
      this.again = !this.location.longitude;
    },
    onShow: function() {
      if (this.again) {
        this.getLocation();
      }
    },
    onLoad: function() {
      this.getLocationAuth();
      this.getBannerList();
      this.$store.dispatch("getPartnerDetail");
      // this.getPartnerDetail();
    },
    watch: {
      status: function() {
        this.getInstitutionList();
      }
    },
    computed: {
      location: function() {
        return this.$store.state.location;
      },
      partner: function() {
        return this.$store.state.partnerDetail;
      },
      widgets: function() {
        return this.$store.state.userInfo.widgets||[];
      },
      institutionAuth: function() {
        return this.widgets.find(i => {
          return i.url === "/pages/nearby/main";
        });
      },
      childCount: function() {
        return this.$store.state.userInfo.childCount;
      }
    },
    methods: {
      limit: function() {
        this.$toast("暂未开放，敬请期待");
      },
      callPhone: function() {
        wx.makePhoneCall({
          phoneNumber: this.partner.hotLine
        });
      },
      getBannerList: async function() {
        const data = await bannerList();
        this.bannerList = data.list;
      },
      /**
       * 获得位置 授权
       */
      getLocationAuth: function() {
        this.getInstitutionList();
        if(this.isH5){
          let map, geolocation, self = this;
          //加载地图，调用浏览器定位服务
          map = new AMap.Map('container', {
            resizeEnable: true
          });
          map.plugin('AMap.Geolocation', function () {
            geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,//是否使用高精度定位，默认:true
              timeout: 5000,          //超过15秒后停止定位，默认：无穷大
              buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              zoomToAccuracy: false,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              buttonPosition: 'RB'
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', function(e) {
              self.$store.commit("saveLocation", {longitude: e.position.lng, latitude: e.position.lat});
              if(!self.list.length)
              self.getInstitutionList();
            });//返回定位信息
            AMap.event.addListener(geolocation, 'error', function(e) {
              self.$toast('定位失败');
            });      //返回定位出错信息
          });

        }else{
          wx.authorize({
            scope: "scope.userLocation",
            success: () => {
              this.getLocation();
              this.$store.dispatch("isBindChild");
            },
            fail: async () => {
              await this.$showModal({
                title: "无法获得位置信息",
                content: "请[右上角」 - 「关于」 - 「右上角」 - 「设置」修改授权信息",
                showCancel: false,
                confirmText: "我知道了"
              });
              this.$store.dispatch("isBindChild",this);
              this.getInstitutionList();
            }
          });

        }
      },
      getLocation: function() {
        wx.getLocation({
          type: "gcj02",
          success: (res) => {
            this.$store.commit("saveLocation", res);
            if(!this.list.length)
            this.getInstitutionList();
          }
        });
      },
      /**
       * 获得机构列表
       */
      getInstitutionList: async function() {
        if(!this.location.longitude){
          return;
        }
        let params = {
          pageNo: 1, pageSize: 15, lng: this.location.longitude, lat: this.location.latitude
        };
        if (this.status) {
          params.trainingClubFlag = true;
        } else {
          params.registerStatus = "verified";
        }
        const data = await nearbyList(params);

        this.list = data.list.map(i=>{
          i.star = i.commentStar&&i.commentStar.toFixed(1).toString() || '0.0';
          if(parseInt(i.commentStar) == i.commentStar){
            i.count = 5 - parseInt(i.commentStar)
          }else {
            i.count = 4 - parseInt(i.commentStar);
          }
          i.commentStarNew = parseInt(i.commentStar);
          return i;
        })
      },

      detail: function(id, orgId) {
        this.navigateTo({
          url: "../homeChild/institutionInfo/main?id=" + id + "&orgId=" + orgId
        });
      },
      switchTab: function(url) {
        if (!this.childCount && url === "/pages/featureList/main") {
          return this.$store.dispatch("isBindChild");
        }
        this.navigateTo({
          url: url
        });

      }
    }

  };
</script>

<style scoped lang="scss">


  .page {
    background-color: #fff;
  }

  .text {
    transform: translateY(-36.66rpx);
  }

  .swiper {
    width: 100%;
    height: rpx(420);
  }

  .slide-image {
    width: 100%;
    height: 100%;
  }

  .phone-tip {
    margin-top: rpx(20);
    text-align: center;
    font-size: rpx(26);
    color: #313131;
    font-weight: bold;
    img {
      margin-right: rpx(21);
      display: inline-block;
      vertical-align: middle;
      width: rpx(40);
      height: rpx(40);
    }
    span {
      vertical-align: middle;
    }
    .red {
      color: #F73C49;
    }
  }

  .title-tab {
    position: relative;
    margin: 0 auto;
    margin-top: rpx(-77);
    width: rpx(690);
    height: rpx(200);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 2px 10px rgba(136, 135, 135, 0.31);
    border-radius: rpx(20);
    @extend %flex;
    @extend %flex-align-center;
    .title-tab-item {
      flex: 1;
    }
    font-size: rpx(26);
    text-align: center;
    img {
      margin: 0 auto rpx(21);
      display: block;
      width: rpx(92);
      height: rpx(92);
    }
  }

  .school-name {
    overflow: hidden;
    margin: rpx(60) auto 0;
    width: rpx(690);
    height: rpx(130);
    background: url("data:image/png;base64,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") no-repeat;
    background-size: 100% 100%;
    .name {
      margin-top: rpx(22);
      text-align: center;
      font-size: rpx(38);
      line-height: rpx(38);
      color: #5851F5;
      text-shadow: 0 1px #FFD200, 1px 0 #FFD200, -1px 0 #FFD200, 0 -1px #FFD200;
      /*  -webkit-text-stroke:1px rgba(255,210,0,.3);
        text-stroke:1px rgba(255,210,0,.3);*/
    }
    .sub-title {
      margin: rpx(16) auto 0;
      border-radius: rpx(16);
      background-color: #FFD200;
      width: rpx(300);
      height: rpx(32);
      line-height: rpx(32);
      color: #5851F5;
      font-size: rpx(22);
      text-align: center;
    }
  }


</style>
