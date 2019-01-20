<template>
  <div class="order-list" @click="handleDetail">
    <div class="title">
      <div class="level">{{level}}</div>
      <span class="name">{{info.className || info.name}}</span>
      <span class="count" style="font-weight:bold">¥ {{info.totalFee || totalPrice}}</span>
      <!--<span class="count" v-if="info.maxNumber">{{info.enrollNumber }}/{{info.maxNumber}}</span>-->
    </div>
    <div class="labels" v-if="!invoiceBtn">
      <span class="label1" v-if="info.parentTermName">{{info.parentTermName}}</span>
      <span class="label2" v-if="info.name">{{info.name}}</span>
      <span class="label3" v-if="termName">{{termName}}</span>
      <span class="count" v-if="info.maxNumber - info.enrollNumber <= 10">仅剩{{info.maxNumber - info.enrollNumber}}个名额</span>
    </div>
    <div class="time"><span style="width: 150rpx;display: inline-block">课程时间：</span>{{info.startDate}}~{{info.endDate}}</div>
    <div  class="time" style="overflow: hidden">
      <span class="titles" style="float: left;display: block;">上课时间：</span>
      <div class="value" style="margin-left: 150rpx">
        <p v-for="item in times" style="margin-bottom: 20rpx;margin-top: 0" :key="item">{{item}}</p>
      </div>
    </div>
    <div  class="time"><span style="width: 150rpx;display: inline-block">课程人数：</span>{{info.maxNumber}}</div>
  </div>
</template>

<script>
  import { institutionNature } from "../../service/config";

  export default {
    name: "orderItem",
    props: {
      info:null,
      btn: null,
      invoiceBtn:null
    },
    data: function(){
      return {
        institutionNature: institutionNature,
        orgType: {
          school:'学校课程',
          mechanism: '机构课程',
        }
      }
    },
    computed: {
      totalPrice:function(){
        return (this.info.equipmentFee+this.info.totalClassFee).toFixed(2) || 0;
      },
      level: function() {
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
      },
      times:function() {
        console.log(this.info.times,1);
        var items = this.info.times && this.info.times.map(item => {
          var time = item.day == 1?"星期一：":item.day == 2?"星期二：":item.day == 3?"星期三：":item.day == 4?"星期四：":item.day == 5?"星期五：":item.day == 6?"星期六：":item.day == 7?"星期天：":'星期天：';
          var timeStr = time + item.startTime + "--" + item.endTime;
          return timeStr
        });
        return items
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


  .order-list {
    margin: 0 rpx(30);
    padding: rpx(30) 0;
    border-bottom: 1px solid $border;
  }

  .count.data-v-65ae625b {
    float:right;
    color:#F73C49;
    font-size:rpx(30);
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
