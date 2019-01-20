<template>
  <div style="padding-bottom: 130rpx;">
    <div class="card">
      <div class="title">
        <span class="tag"></span>
        <span>课程价格</span>
      </div>
      <div class="price">
        <p>
          <span>总额：</span>
          <span class="count">¥ {{total}}</span>
        </p>
        <p>
          器材费：¥{{info.equipmentFee}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;课时费：¥ {{info.totalClassFee}}
        </p>
      </div>
    </div>
    <div class="card">
      <div class="title">
        <span class="tag" style="background-color: #756EFD;"></span>
        <span>班级信息</span>
      </div>
      <ul>
        <li>
          <span>{{gradeName}}：</span>
          <span class="value">{{info.orgName }}</span>
        </li>
        <li>
          <span>班级名称：</span>
          <span class="value">{{info.className}}</span>
        </li>
        <li>
          <span>上课老师：</span>
          <span class="value">{{info.teachers[0].teacherName}}</span>
        </li>
        <li v-if="info.belong">
          <span>所属机构：</span>
          <span class="value" @click="toInstitution()">{{info.belongName}}</span>
        </li>
      </ul>
    </div>
    <div class="card">
      <div class="title">
        <span class="tag" style="background-color: #F73C49;"></span>
        <span>课程说明</span>
      </div>
      <ul>
        <li>
          <span>总课时：</span>
          <span class="value">{{info.totalClass }}</span>
        </li>
        <li>
          <span>适龄年级：</span>
          <span class="value">{{info.gradeNames}}</span>
        </li>
        <li>
          <span>上课地址：</span>
          <span class="value">{{info.teachAddress }}</span>
        </li>
        <li>
          <span>开班人数：</span>
          <span class="value">{{info.minNumber}}</span>
        </li>
        <li>
          <span>开课时间：</span>
          <span class="value">{{info.startDate + "~" + info.endDate}}</span>
        </li>
      </ul>
    </div>
    <div class="card">
      <div class="title bottom">
        <span @click="activeChange(0)" :class="{active: active===0}">课程介绍</span>
        <span @click="activeChange(1)" :class="{active: active===1}">课程大纲</span>
      </div>
      <div class="bottom-content" v-if="active===0">
        <div class="sub-title">课程特点：</div>
        <p>{{info.outline.feature || ''}}</p>
        <div class="sub-title">课程目标：</div>
        <p>{{info.outline.goal || ''}}</p>
        <div class="sub-title">课程提升：</div>
        <p>{{info.outline.promotion || ''}}</p>
      </div>
      <div class="bottom-content" v-else style="padding-bottom: 0;">
        <div class="sub-title">能力提升：<span class="sub">{{improvementList || ''}}</span></div>
        <div class="sub-title">教学成果：<span class="sub">{{info.outline.achievements || ''}}</span></div>
        <table>
          <thead>
          <tr>
            <td>内容</td>
            <td>课时</td>
            <td>教学目标</td>
            <td>备注</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in info.outline.courseOutlineList" :key="index">
            <td>{{item.content}}</td>
            <td>{{item.section}}</td>
            <td>{{item.aim}}</td>
            <td>{{item.remark}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="nav-bar" v-if="type!=='detail'">
      <div @click="favoriteSave">
        <img class="xing" :src="info.favoriteStatus?'/static/img/main/xing.png':'/static/img/main/5xing.png'" alt="">
        <span>{{info.favoriteStatus?'已收藏':'收藏'}}</span>
      </div>
      <div @click="toPhone">咨询</div>
      <a class="next" @click="next">立即报名</a>
    </div>

    <!--<div class="fixed-bottom" v-if="type!=='detail'">-->
      <!--<div class="collect" @click="favoriteSave">-->
        <!--<img :src="info.favoriteStatus?'/static/img/main/xing.png':'/static/img/main/5xing.png'" alt="">-->
        <!--<span>{{info.favoriteStatus?"已收藏":"收藏"}}</span>-->
      <!--</div>-->
      <!--<div @click="toPhone">咨询</div>-->
      <!--<a class="next" @click="next">立即报名</a>-->
    <!--</div>-->
  </div>
</template>

<script>
  import { favoriteSave, getCurriculumIntro } from "../../../../service/home/curriculum";
  import store from "../../../store/store";
  import { getOrderDetail } from "../../../../service/profile/order";

  export default {

    name: "index",
    data: function() {
      return {
        active: 0,
        type: "",
        id: "",
        orderId: '',
        orderInfo: {},
        studentIndex: "",
        info: {
          outline: {},
          teachers: [{}]
        },
        gradeName:'学校名称',
        selectStatus:''
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.orderId = this.route().query.orderId;
      this.type = this.route().query.type;
      this.id = this.route().query.id;
      this.studentIndex = this.route().query.studentIndex;
      this.selectStatus = this.route().query.selectStatus;
      if(this.type === 'communityCollege'){
        this.gradeName = '社区名称'
      }else {
        this.gradeName = '学校名称'
      }
      this.getInfo();
      this.getOrderInfo();
    },
    computed: {
      total: function() {
        return (this.info.equipmentFee + this.info.totalClassFee).toFixed(2);
      },
      gradeNames: function() {
        return (this.info.gradeNames || "").replace(",", " ~ ");
      },
      times: function() {
        if (this.info.courseTimeStr) {
          return this.info.courseTimeStr.split("br");
        } else {
          return [];
        }
      },
      improvementList: function() {
        if (!this.info.outline)
          return "";
        return (this.info.outline.improvementList || []).join("/");
      },
      childCount: function() {
        return store.state.userInfo.childCount;
      }
    },
    methods: {
      /**
       * 收藏课程
       */
      favoriteSave: async function() {
        await favoriteSave({ courseId: this.id }, {
          load: true,
          successMsg: true,
          favoriteStatus: this.info.favoriteStatus
        });
        this.getInfo();
      },
      activeChange: function(n) {
        this.active = n;
      },
      getOrderInfo:async function(){
        if(this.orderId){
          this.orderInfo = await getOrderDetail({ id: this.orderId });
        }
      },
      getInfo: async function() {
        try {

          //  this.info = await getOrderDetail({ id: this.id });

            this.info = await getCurriculumIntro({ id: this.id }, {load: true});
            // this.setNavigationTitle(this.info.className)
        } catch (e) {
          setTimeout(() => {
            this.navigateBack({});
          }, 1500);
        }
      },
      next: function() {
        if (!this.childCount) {
          return store.dispatch("isBindChild");
        }
        if(this.selectStatus == "0"){
          this.$toast('选课未开始');
          setTimeout( () => {
            this.navigateBack({});
          }, 1500);
          return
        }else if(this.selectStatus == 2){
          this.$toast('选课已结束');
          setTimeout( () => {
            this.navigateBack({});
          }, 1500);
          return
        }
        store.commit("saveCurriculum", this.info);
        this.navigateTo({
          url: "/pages/homeChild/confirmOrder/main?studentIndex=" + this.studentIndex
        });
      },
      toInstitution:function() {
        this.navigateTo({
          url: "/pages/homeChild/institutionInfo/main?id="+ this.info.mechanismId+'&orgId='+this.info.belong
        });
      },
      toPhone:function() {
        this.makePhone(this.info.phone)
      }
    }
  };
</script>

<style scoped lang="scss">


  ul {
    padding-bottom: rpx(30);
    font-size: rpx(28);
    line-height: rpx(28);
    color: #000;
    li {
      margin: rpx(30) 0 0 rpx(41);
    }
    .value {
      color: #9d9d9d;
    }
  }

  .bottom {
    .active {
      font-size: rpx(32);
      color: #313131;
      font-weight: bold !important;
    }
    @extend %flex;
    @extend %justify-content-center;
    font-size: rpx(28);
    color: #5B5B5B;
    span {
      font-weight: normal;
    }
    span:first-of-type {
      margin-right: rpx(115);
    }
  }

  .bottom-content {
    padding-bottom: rpx(30);
    font-size: rpx(28);
    color: #9D9D9D;
    .sub-title {
      margin-left: rpx(30);
      margin-top: rpx(30);
      margin-bottom: rpx(6);
      font-size: rpx(30);
      color: #000;
    }
    p {
      margin-left: rpx(30);
    }
    .sub {
      font-size: rpx(28);
      color: #9d9d9d;
    }
    table {
      width: 100%;
      text-align: center;
      margin-top: rpx(30);
      /*td:nth-of-type(1), td:nth-of-type(3) {*/
        /*white-space: nowrap;*/
      /*}*/
      td {
        border-top: 1px solid $border;
        border-left: 1px solid $border;
        vertical-align: middle;
        padding: rpx(20) rpx(30);
      }
      td:first-of-type {
        border-left: none;
      }
    }
  }

  .nav-bar {
    position: fixed;
    height: rpx(100);
    width: 100%;
    bottom: 0;
    left: 0;
    background-color: #fff;
    @extend %flex;
    .xing {
      margin-right: rpx(21);
      vertical-align: middle;
      width: rpx(42);
      height: rpx(42);
    }
    .xing + span {
      vertical-align: middle;
    }
    .next {
      font-size: rpx(32);
      background-color: $them;
      font-weight: bold;
    }
    & > div, a {
      font-size: rpx(28);
      color: #000;
      flex: 1;
      text-align: center;
      line-height: rpx(100);
    }
  }

  .fixed-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: rpx(100);
    background-color: #fff;
    @extend %flex;
    text-align: center;
    line-height: rpx(100);
    .collect {
      width: rpx(250);
      img {
        width: rpx(42);
        height: rpx(42);
        margin-right: rpx(21);
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
        font-size: rpx(28);
        color: #313131;
      }
    }
    .next {
      flex: 1;
      background-color: $them;
      font-size: rpx(32);
      color: #000;
      font-weight: bold;
    }
  }
</style>
