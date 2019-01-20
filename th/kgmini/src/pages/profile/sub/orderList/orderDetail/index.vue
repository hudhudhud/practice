<template>
  <div style="padding-bottom: 130rpx;">
    <div class="card">
      <!--<div class="title">-->
        <!--<span class="tag"></span>-->
        <!--<span>代付款</span>-->
      <!--</div>-->
      <div class="price">
        <div>
          <span class="count">{{orderType}}</span>
          <p v-if="orderInfo.status === 'cancelled'" style="margin-top: 0;color: #F73C49">退款成功</p>
          <p v-if="orderInfo.status === 'paid'" style="margin-top: 0;color: #F73C49">课程开始后退款请自行联系授课方</p>
        </div>
        <div class="flow">
          <div class="left">总金额</div>
          <div class="right">
            <p class="count">￥{{orderInfo.totalFee}}</p>
            <p style="margin-top: 20rpx">器材费：￥{{orderInfo.equipmentFee}}  课时费：￥{{orderInfo.classFee}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card" v-if="orgType !== '社会实践'">
      <ul>
        <li style="overflow: hidden">
          <span class="titles" style="float: left;display: block;">班级名称：</span>
          <div class="value value1">
            {{orderInfo.className}}
          </div>
        </li>
        <!--<li>-->
          <!--<span class="titles">班级名称：</span>-->
          <!--<span class="value">{{orderInfo.className}}</span>-->
        <!--</li>-->
        <li>
          <span class="titles">总课时：</span>
          <span class="value">{{orderInfo.totalClass}}</span>
        </li>
        <li style="overflow: hidden">
          <span class="titles" style="float: left;display: block;">适龄年级：</span>
          <div class="value value1">
            {{orderInfo.gradeName}}
          </div>
        </li>
        <!--<li>-->
          <!--<span class="titles">适龄年级：</span>-->
          <!--<span class="value">{{orderInfo.gradeName}}</span>-->
        <!--</li>-->
        <li style="overflow: hidden">
          <span class="titles" style="float: left;display: block;">上课地址：</span>
          <div class="value value1">
            {{orderInfo.teachAddress}}
          </div>
        </li>
        <!--<li>-->
          <!--<span class="titles">上课地址：</span>-->
          <!--<span class="value">{{orderInfo.teachAddress}}</span>-->
        <!--</li>-->
        <li>
          <span class="titles">开班人数：</span>
          <span class="value">{{orderInfo.enrollNumber}}</span>
        </li>
        <li>
          <span class="titles">开课时间：</span>
          <span class="value">{{orderInfo.startDate}}</span>
        </li>
        <li style="overflow: hidden">
          <span class="titles" style="float: left;display: block;">授课时间：</span>
          <div class="value" style="margin-left: 200rpx">
            <p v-for="item in times" style="margin-bottom: 20rpx" :key="item">{{item}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="card">
      <!--<div class="title">-->
        <!--<span class="tag" style="background-color: #F73C49;"></span>-->
        <!--<span>课程说明</span>-->
      <!--</div>-->
      <ul>
        <li style="overflow: hidden">
          <span class="titles" style="float: left;display: block;">服务提供方：</span>
          <div class="value value1">
            {{orderInfo.orgName || orderInfo.schoolName}}
          </div>
        </li>
        <!--<li>-->
          <!--<span class="titles">服务提供方：</span>-->
          <!--<span class="value">{{orderInfo.orgName || orderInfo.schoolName}}</span>-->
        <!--</li>-->
        <li>
          <span class="titles">学生姓名：</span>
          <span class="value">{{orderInfo.studentName}}</span>
        </li>
        <li>
          <span class="titles">手机号：</span>
          <span class="value">{{orderInfo.phone }}</span>
        </li>
        <li>
          <span class="titles">订单编号：</span>
          <span class="value">{{orderInfo.orderNo}}</span>
        </li>
      </ul>
    </div>

    <div v-if="orderInfo.status === 'committed' || orderInfo.status === 'paid'&& orderInfo.refundStatus=== 0"  class="fixed-bottom">
      <div v-if="orderInfo.status === 'committed'" class="next" @click="next(1)">去付款</div>
      <div v-if="orderInfo.status === 'paid'&& orderInfo.refundStatus=== 0 " class="next" @click="next(2)">申请退款</div>
    </div>
  </div>
</template>

<script>
  import { favoriteSave, getCurriculumIntro } from "../../../../../service/home/curriculum";
  import store from "../../../../store/store";
  import { getOrderDetail, refundOrder} from "../../../../../service/profile/order";

  export default {

    name: "index",
    data: function() {
      return {
        orderType:"代付款",
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
        times:[],
        orgType:''
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.orderId = this.route().query.orderId;
      this.orgType = this.route().query.orgType;
      // this.type = this.route().query.type;
      // this.id = this.route().query.id;
      // this.studentIndex = this.route().query.studentIndex;
      // this.getInfo();
      this.getOrderInfo();
    },
    computed: {
      total: function() {
        return (this.info.equipmentFee + this.info.totalClassFee).toFixed(2);
      },
      gradeNames: function() {
        return (this.info.gradeNames || "").replace(",", " ~ ");
      },
      improvementList: function() {
        if (!this.info.outline)
          return "";
        return (this.info.outline.improvementList || []).join("/");
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
          this.orderInfo = await getOrderDetail({ id: this.orderId }) || [];
          console.log(this.orderInfo);
          this.times = this.orderInfo.times && this.orderInfo.times.map(item => {
            var time = item.day == 1?"星期一：":item.day == 2?"星期二：":item.day == 3?"星期三：":item.day == 4?"星期四：":item.day == 5?"星期五：":item.day == 6?"星期六：":item.day == 7?"星期天：":'星期天：';
            var timeStr = time + item.startTime + "--" + item.endTime;
            return timeStr
          });
          this.orderType = this.payState(this.orderInfo.status);
          console.log(this.orderInfo.status);
        }
      },
      getInfo: async function() {
        try {

          //  this.info = await getOrderDetail({ id: this.id });

            this.info = await getCurriculumIntro({ id: this.id });

        } catch (e) {
          setTimeout(() => {
            this.navigateBack({});
          }, 1500);
        }
      },
      next:async function(type) {
        if(type === 1){
          this.navigateTo({
            url: "/pages/homeChild/payOrder/main?id="+this.orderInfo.id
          });
        }else {
          await refundOrder({
            id: this.orderInfo.id
          }, {load: true, successMsg: '提交成功'});
          setTimeout( () => {
            this.navigateBack({});
          }, 1500);
        }
      },
      toInstitution:function() {
        this.navigateTo({
          url: "/pages/homeChild/institutionInfo/main?id="+ this.info.mechanismId+'&orgId='+this.info.belong
        });
      }
    }
  };
</script>

<style scoped lang="scss">


  ul {
    padding-bottom: rpx(30);
    font-size: rpx(30);
    line-height: rpx(30);
    color: #000;
    li {
      margin: rpx(30) 0 0 rpx(41);
    }
    .value {
      color: #9d9d9d;
    }
    .value1 {
      margin-left:rpx(200);
      padding-right:rpx(20);
      line-height:rpx(40);
      position:relative;
      top:rpx(-4);

    }
    .titles {
      width: rpx(200);
      text-align: left;
      display: inline-block;
    }
  }
  .card {
    .flow {
      overflow: hidden;
      width: 100%;
      padding-right:rpx(40);
      box-sizing:border-box;
      .left {
        float: left;
        width: 30%;
        height: rpx(90);
        line-height: rpx(90);
        font-size: rpx(30);
      }
      .right {
        float: right;
        width: 70%;
        height: rpx(90);
        p {
          text-align: right;
        }
      }
    }
    .price .count {
      color:#F73C49;
      font-size:rpx(30);
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
      td:nth-of-type(1), td:nth-of-type(3) {
        white-space: nowrap;
      }
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
