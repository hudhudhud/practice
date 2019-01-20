<template>
  <div class="page">
    <header>
      <div class="img">
        <swiper class="swiper" v-if="!isH5"
                autoplay="true">
          <swiper-item v-if="info.doorImgs.length !== 0" v-for="(item, index) in info.doorImgs" :key="index">
            <image mode="scaleToFill" :src="item.fileUrl"
                   class="slide-image"/>
          </swiper-item>
          <swiper-item v-if="info.doorImgs.length === 0">
            <image mode="scaleToFill" :src="defaultDoorSrc"
                   class="slide-image"/>
          </swiper-item>
        </swiper>
        <mt-swipe :auto="3000" v-if="isH5" class="swiper" :show-indicators="false">
          <mt-swipe-item v-if="info.doorImgs.length !== 0" v-for="(item, index) in info.doorImgs" :key="index">
            <img mode="scaleToFill" :src="item.fileUrl"
                   class="slide-image"/>
          </mt-swipe-item>
          <mt-swipe-item v-if="info.doorImgs.length === 0">
            <img mode="scaleToFill" :src="defaultDoorSrc"
                 class="slide-image"/>
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="name">
        <span>{{info.name}}</span>
        <label>{{info.registerStatus==="verified"?"已认证":"未认证"}}</label>

        <div class="school-label" :class="types[info.board]" v-if="info.board">{{info.board}}</div>
      </div>
      <div class="scores">
        <template v-if="intCommentStar">
          <img class="score-img" src="/static/img/util/xing1.png" v-for="item in intCommentStar" :key="item" alt="">
          <img class="score-img" src="/static/img/util/xing5.png" alt=""
               v-if="intCommentStar!==info.commentStar&&info.commentStar">
          <span><img class="score-img" v-for="(item, index) in count" :key="index" src="/static/img/util/xing1_gray.png"  alt=""></span>
        </template>
        <template v-else>
          <img class="score-img" v-for="(item, index) in 5" :key="index" src="/static/img/util/xing1_gray.png"  alt="">
        </template>
        <span>{{star||''}}</span>
      </div>
      <!--<div class="type">性质</div>-->
       <div class="select-group">
         <div class="label2" v-if="info.nature">{{institutionNature[info.nature]}}</div>
         <div class="label1" v-if="info.trainingClubFlag">训练营机构</div>
         <div class="label3" v-if="info.termName">{{info.termName}}</div>
       </div>
    </header>

    <AddressShow :address="info.provinceName+info.cityName+info.countyName+info.address"
                 :phone="info.tellphone" :info="info" @map="toMap"></AddressShow>
    <!--课程介绍-->
    <div class="curriculum-introduce" v-if="list.length">
      <div class="title">
        <span>课程介绍</span>
        <span class="other" v-if="totalNum>2" @click="curriculumList">查看更多</span>
      </div>
      <scroll-view class="curriculum-scroll"
                   lower-threshold="30">
        <div class="curriculum" v-for="(item, index) in list" :key="index">
          <img class="main-img" :src="item.logoUrl" alt="">
          <div class="info">
            <p>
              <!--<span class="level">{{item.level}}</span>-->
              <span>{{item.className}}</span>
            </p>
            <p>开课时间：{{item.startDate}}</p>
            <p>适用：{{item.gradeNames}}</p>
          </div>
          <div class="end">
            <p class="price">¥ {{item.equipmentFee+item.totalClassFee}}</p>
            <p>
              <a class="button" @click="toCurriculumDetail(item.id)">查看</a>
            </p>
          </div>
        </div>
      </scroll-view>

    </div>
    <!--老师介绍-->
    <div class="teacher-introduce" v-if="info.teachers.length">
      <div class="title">
        老师介绍
      </div>
      <div class="teacher-group">
        <div class="teacher" v-for="(item, index) in info.teachers" :key="index">
          <img :src="item.avatar || '/static/img/component/defaultAvatar.png'" alt="">
          <p>{{item.realname}}</p>
        </div>
      </div>
    </div>
    <!--机构介绍-->
    <div class="institution-introduce">
      <div class="title">机构介绍</div>
      <div class="sub-title">
        资质
      </div>
      <div class="content-text">{{info.briefIntro}}
      </div>
      <div class="sub-title">
        教学环境
      </div>
      <!--<div class="content-text">故事大纲申达股份上都很外人田士大夫房东个地方，十-->
        <!--说的方式的，电饭锅东方红。-->
      <!--</div>-->
      <div class="imgs imgs1">
        <img v-if="info.teachEnvImgs.length !== 0" @click="showBigPicture(item.fileUrl)" :data-list="info.teachEnvImgs" :data-src="item.fileUrl" v-for="(item, index) in info.teachEnvImgs" :key="index" :src="item.fileUrl" alt="">
        <img v-if="info.teachEnvImgs.length === 0" @click="showBigPicture(defaultEnvSrc)" :src="defaultEnvSrc" alt="">
      </div>
      <div class="sub-title">
        机构详情
      </div>
      <table>
        <tr>
          <td>营业执照</td>
          <td v-if="info.businessLicenseImgs&&info.businessLicenseImgs[0]" @click="showBigPicture(info.businessLicenseImgs[0].fileUrl)">
            <span class="vertical-align">点击查看大图</span>
            <img class="vertical-align" :src="info.businessLicenseImgs[0].fileUrl"
                 alt="">
          </td>
          <td v-else>
            未上传
          </td>
        </tr>
        <tr>
          <td>办学许可证</td>
          <td v-if="info.teachingLicenseImgs&&info.teachingLicenseImgs[0]"  @click="showBigPicture(info.teachingLicenseImgs[0].fileUrl)">
            <span class="vertical-align">点击查看大图</span>
            <img class="vertical-align" :src=" info.teachingLicenseImgs[0].fileUrl"
                 alt="">
          </td>
          <td v-else>
            未上传
          </td>
        </tr>
        <tr>
          <td>消防证明</td>
          <td v-if="info.fireCertificateImgs&&info.fireCertificateImgs[0]"  @click="showBigPicture(info.fireCertificateImgs[0].fileUrl)">
            <span class="vertical-align">点击查看大图</span>
            <img class="vertical-align" :src="info.fireCertificateImgs[0].fileUrl"
                 alt="">
          </td>
          <td v-else>
            未上传
          </td>
        </tr>
        <tr>
          <td>校长</td>
          <td>{{info.headmaster}}</td>
        </tr>
        <tr>
          <td>法人</td>
          <td>{{info.legal}}</td>
        </tr>
        <tr>
          <td>办学内容</td>
          <td>{{info.teachRange}}</td>
        </tr>
      </table>
    </div>
    <!--用户评价-->
    <EvaluateList :id="orgId" v-if="orgId"></EvaluateList>
  </div>
</template>

<script>
  import AddressShow from "@/components/style/addressShow";
  import EvaluateList from "@/components/global/evaluateList";
  import { getInstitutionDetail } from "../../../service/home/institution";
  import { getCurriculumList } from "../../../service/home/curriculum";
  import { imageUrl, institutionNature } from "../../../service/config";

  export default {

    name: "index",
    components: {
      EvaluateList,
      AddressShow
    },
    data: function() {
      return {
        id: "",
        orgId:'',
        courseId: '',
        info: {
          businessLicenseImgs: [],
          fireCertificateImgs: [],
          teachingLicenseImgs: [],
          teachers: [],
          doorImgs:[],
          teachEnvImgs:[]
        },
        star:'',
        types: {
          "红榜": "red",
          "黑榜": "black",
          "白榜": "white"
        },
        imgBaseUrl: "",
        institutionNature: institutionNature,
        // 课程列表
        page: 0,
        size: 3,
        loading: false,
        list: [],
        totalNum: 0,
        count:''
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.orgId = this.route().query.orgId;
      this.courseId = this.route().query.courseId;
      this.getInfo();
      this.imgBaseUrl = imageUrl;
    },
    computed: {
      intCommentStar: function() {
        this.star = this.info.commentStar&&this.info.commentStar.toFixed(1).toString()|| '0.0';
        console.log(this.star);
        if(parseInt(this.info.commentStar) == this.info.commentStar){
          this.count = 5 - parseInt(this.info.commentStar)
        }else {
          this.count = 4 - parseInt(this.info.commentStar)
        }
        return parseInt(this.info.commentStar) || 0;
      },
      defaultDoorSrc:function() {
        return this.getDefaultImg('institutionDoor')
      },
      defaultEnvSrc:function() {
        return this.getDefaultImg('institutionEnv')
      }
    },
    methods: {
      showBigPicture: function(img) {
        wx.previewImage({
          current: img, // 当前显示图片的http链接
          urls: [img] // 需要预览的图片http链接列表
        });
      },
      getInfo: async function() {
        const data = await getInstitutionDetail({ id: this.id }, { load: true });
        this.info = data;
        this.loading = false;
        this.loadMore();
      },
      toMap:function(address,lat,lng,institutionName){
        this.navigateTo({
          url: '../map/main?address='+address+'&lat='+lat+'&lng='+lng+'&institutionName='+institutionName
        })
      },
      /**
       * 获得该机构下 所有课程
       */
      loadMore: function() {
        if (this.loading) {
          return;
        }
        this.loading = true;
        this.page++;
        this.getCurriculumList();
      },
      getCurriculumList: async function() {
        try {
          const data = await getCurriculumList({ pageNo: this.page, pageSize: this.size, orgId: this.info.orgId ,id:this.courseId || ''});
          this.totalNum = data.totalNum;
          if (this.page === 1) {
            this.list = data.list.map( i => {
              i.gradeNames = (i.gradeNames||'').replace(',',' ~ ');
              return i;
            });
          } else {
            this.list = this.list.concat(data.list.map( i => {
              i.gradeNames = (i.gradeNames||'').replace(',',' ~ ');
              return i;
            }));
          }
          if(this.list.length >3){
            this.list.splice(0,3);
          }
          this.loading = Number(data.list.length) < Number(this.size);
        } catch (e) {
          this.loading = false;
        }
      },
      /**
       * 查看该机构下的列表详情
       */
      curriculumList: function(){
        this.navigateTo({
          url: './curriculumList/main?id='+this.info.orgId+'&cId='+this.courseId
        })
      },
      toCurriculumDetail: function(id) {
        this.navigateTo({
          url: '../curriculumIntro/main?id='+id
        })
      },
    }
  };
</script>

<style scoped lang="scss">

  .other{
    float: right;font-size: rpx(24);font-weight: normal;padding-right:rpx(30);
  }
  .institution-introduce, .teacher-introduce, .curriculum-introduce, .user-evaluate {
    .title {
      line-height: rpx(100);
      text-indent: rpx(31);
      font-weight: bold;
      height: rpx(60);
    }
  }

  .page {
    background-color: #f2f2f2;
  }

  header {
    background-color: #fff;
    padding-bottom: rpx(40);
  }

  .curriculum-scroll {
    max-height: rpx(750);
    padding-top: rpx(40);
  }

  .img {
    .slide-image {
      display: block;
      height: rpx(344);
      width: 100%;
    }
  }

  .name {
    position: relative;
    height: rpx(105);
    @extend %flex;
    @extend %flex-align-center;
    padding-left: rpx(31);
    span {
      font-size: rpx(38);
      color: #313131;
    }
    label {
      border: 1px solid $subThem-red2;
      color: $subThem-red2;
      font-size: rpx(18);
      height: rpx(26);
      line-height: rpx(26);
      padding: 0 rpx(11);
      margin-left: rpx(20);
    }
  }

  .scores {
    padding-left: rpx(31);
    font-size: rpx(22);
    color: #9A9A9A;
    .score-img {
      margin-right: rpx(10);
      width: rpx(26);
      height: rpx(26);
    }
  }

  .level {
    width:1em;
    overflow:hidden;
  }

  .type {
    margin-top: rpx(28);
    font-size: rpx(28);
    line-height: rpx(28);
    color: #5B5B5B;
    padding-left: rpx(30);
  }

  .select-group {
    margin-top: rpx(30);
    font-size: 0;
    padding-left: rpx(30);
  }

  .curriculum-introduce {
    margin-top: rpx(20);
    background-color: #fff;
    .curriculum:last-of-type {
      border-bottom: none;
    }
    .curriculum:first-of-type {
      padding-top: rpx(10);
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
        min-width: rpx(140);
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

  .teacher-introduce {
    background-color: #fff;
    .teacher-group {
      padding: 0 rpx(15) rpx(40) rpx(30);
      @extend %flex;
      @extend %flex-wrap;
      .teacher {
        margin: rpx(30) rpx(20) 0;
        text-align: center;
        font-size: rpx(26);
        line-height: rpx(26);
        color: #bbbbbb;
      }
      img {
        border-radius: 50%;
        width: rpx(96);
        height: rpx(96);
        display: block;
        margin: 0 auto rpx(20);
      }
    }
  }

  .institution-introduce {
    padding-bottom: rpx(40);
    margin-top: rpx(20);
    background-color: #fff;
    .sub-title {
      margin-top: rpx(30);
      padding-left: rpx(31);
      color: #313131;
      font-size: rpx(30);
    }
    .content-text {
      padding: 0 rpx(49) 0 rpx(31);
      color: #9D9D9D;
      font-size: rpx(28);
    }
    .imgs {
      margin-top: rpx(30);
      @extend %flex;
      @extend %justify-content-center;
      img {
        margin: 0 rpx(15);
        width: rpx(210);
        height: rpx(210);
      }
    }
    .imgs1 {
      -webkit-box-pack:center;
      -webkit-justify-content:flex-start;
      -ms-flex-pack:center;
      justify-content:flex-start;
      padding-left:rpx(16);
      box-sizing:border-box;

    }

    table {
      width: rpx(690);
      margin: rpx(30) auto 0;
      border-radius: rpx(20);
      font-size: rpx(26);
      color: #313131;
      background-color: #f2f2f2;
      span {
        color: #9D9D9D;
        font-size: rpx(24);
      }
      img {
        margin-left: rpx(22);
        display: inline-block;
        width: rpx(86);
        height: rpx(66);
      }
      tr {
        height: rpx(84);
        line-height: rpx(84);
      }
      tr:last-of-type {
        border-bottom: none;
      }
      td {
        border-bottom: 1px solid rgba(0, 0, 0, .06);
      }
      td:first-of-type {
        width: rpx(230);
        text-indent: rpx(31);
      }
      td:last-of-type {
        text-align: right;
        padding-right: rpx(31);
      }
    }
  }

</style>
