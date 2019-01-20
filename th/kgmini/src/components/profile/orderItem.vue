<template>
  <div class="order-list" @click="handleDetail">
    <div class="orderCode">
      <div class="left">
        <span style="border-right: 2px solid #EAEAEA;padding-right: 6px">{{info.createdAt}}</span><span style="margin-left: 6px">{{info.orgType1}}</span>
      </div>
      <div class="right">{{info.orderType1}}</div>
    </div>
    <div class="title">
      <div class="level" v-if="isShowLeve">{{level}}</div>
      <span class="name">{{info.name||info.className}}</span>
      <!--<span class="count" v-if="info.maxNumber">{{info.enrollNumber }}/{{info.maxNumber}}</span>-->
    </div>
    <div class="labels" v-if="!invoiceBtn && !isShowOrg">
        <span class="label1" v-if="orgType[info.orgType||info.type]">{{orgType[info.orgType||info.type]}}</span>
        <span class="label2" v-if="info.className">{{info.className}}</span>
        <span class="label3" v-if="termName">{{termName}}</span>
    </div>
    <div class="labels fz-28" v-if="isShowOrg">
      <span style="padding-right: 6px;border-right: 2px solid #EAEAEA">{{info.orgName}}</span>
      <span style="padding-left: 6px;">学生姓名：{{info.studentName}}</span>
    </div>
    <div class="price">
      <span class="price-count">¥ {{info.totalFee||((info.equipmentFee||0)+(info.totalClassFee||0))}}</span>
      <!--<div class="btn">待退款</div>-->
      <!--<div class="btn gray" v-if="info.status === 'paid'||info.status === 'finished'" @click.stop="">已付款</div>-->

      <div class="btn" v-if="info.status === 'committed'" @click.stop="toPayOrder">待付款</div>
      <!--<div class="btn" v-if="info.status === 'cancelled'" @click.stop="">已关闭</div>-->
      <div class="btn" v-if="(info.status === 'paid'||'finished'===info.status)&&!info.commentStatus" @click.stop="handlePJ">待评价</div>
      <div class="btn" v-if="btn" @click.stop="handleButton">{{btn}}</div>
      <div class="btn" :class="{isdisable:info.invoiced == '1'}" v-if="invoiceBtn" @click.stop="handleButton1">{{invoiceBtn}}</div>
    </div>
    <div v-if="info.endDate && !isShowOrg" class="time">{{info.startDate}}~{{info.endDate}} <p>{{courseTimeStr}}</p></div>
    <div v-if="!info.endDate && !isShowOrg" class="time">{{info.startDate}} <p>{{courseTimeStr}}</p></div>

  </div>
</template>

<script>
  import { institutionNature } from "../../service/config";

  export default {
    name: "orderItem",
    props: {
      info:null,
      btn: null,
      invoiceBtn:null,
      isHideLeve:null,
      isHideOrg:null
    },
    data: function(){
      return {
        institutionNature: institutionNature,
        orgType: {
          school:'学校课程',
          mechanism: '机构课程'
        },
        isShowLeve:true,
        orgType:["全部","校园课程","社区课程","社会实践","机构课程"],
        orgTypeState:["all","school","community","practise_base","mechanism"],
        orderType:["全部", "待付款", "已付款", "已关闭", "待评价"],
        orderTypeState:["all","committed","paid","cancelled","evaluation"],
        isShowOrg:false
      }
    },
    computed: {
      level: function() {
        if(this.isHideOrg){
          this.isShowOrg = true
        }else {
          this.isShowOrg = false
        }
        if(this.isHideLeve === "practise_base"){
          this.isShowLeve = false;
        }else {
          this.isShowLeve = true;
        }
        if (this.info.level) {
          return this.info.level[0];
        } else {
          return "";
        }
      },
      courseTimeStr: function() {
        return (this.info.courseTimeStr || "").replace("br", "   ");
      },
      termName: function() {
        if(this.info.termTaxonomyPathDesc){
          return this.info.termTaxonomyPathDesc.split('>')[0];
        }
        return ''
      }
    },
    methods: {
      handleButton: function(){
        this.$emit('handleBtn', this.info.id)
      },
      handleButton1:function(){
        this.$emit('handleBtn', this.info)
      },
      handleDetail: function() {
        this.$emit("detail", this.info);
      },
      select:function(){

      },
      handlePJ: function(){
        this.$emit("evaluation", this.info);
      },
      /**
       * 去付款
       */
      toPayOrder: function() {
        this.navigateTo({
          url: "/pages/homeChild/payOrder/main?id=" + this.info.id
        });
      }
    }
  };
</script>
<style scoped lang="scss">

  .fz-28{
    font-size: rpx(28);
  }
  .orderCode {
    border-bottom:2px solid #EAEAEA;
    overflow:hidden;
    font-size:rpx(28);
    padding-top:0;
    padding-bottom:rpx(15);
    margin-bottom: rpx(15);
    .left {
      float: left;
      width: rpx(500);
      span {
        display: inline-block;
      }
    }
    .right {
      margin-left: rpx(500);
      text-align: right;
    }
  }
  .order-list {
    margin: 0 rpx(30);
    padding: rpx(30) 0;
    border-bottom: 1px solid $border;
    margin-bottom: rpx(30);
  }

  .title {
    line-height: rpx(30);
  }

  .name {
    font-size: rpx(30);
    color: #313131;
    font-weight: bold;
  }

  .count {
    float: right;
    color: #707070;
    font-size: rpx(26);
  }

  .time {
    margin-top: rpx(23);
    font-size: rpx(26);
    color: #9D9D9D;
    line-height: rpx(26);
    p {
      margin-top: rpx(10);
    }
  }

  .price {
    margin-top: rpx(14);
    height: rpx(60);
    line-height: rpx(69);
    text-align: right;
    font-size: 0;
    .price-count {
      float: left;
      color: $subThem-red;
      font-size: rpx(30);
    }
    .btn {
      margin-left: rpx(40);
      display: inline-block;
      padding: 0 rpx(26);
      line-height: rpx(60);
      background-color: $them;
      text-align: center;
      border-radius: rpx(30);
      font-size: rpx(30);
    }
    .btn.gray {
      color: #fff;
      background-color: #C5C5C5;
    }
    .isdisable {
      pointer-events: none;
      background-color: gray;
      color: #fff;
    }
  }
</style>
