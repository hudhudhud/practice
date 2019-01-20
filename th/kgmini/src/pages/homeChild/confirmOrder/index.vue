<template>
  <div class="page">
    <div class="box">
      <Child :border="1" @update:student="getStudent"  :index.sync="studentIndex" />
      <div class="title-name">
        <div class="level" v-if="level">{{level}}</div>
        <span>{{curriculumOrder.className||curriculumOrder.name}}</span>
      </div>
      <div class="labels" style="margin-top: 10rpx">
        <div class="label1" v-for="item in labels" :key="item">{{item}}</div>
      </div>
    </div>
    <div class="box">
      <div class="cost">
        <span class="tag"></span>
        <span>费用</span>
      </div>
      <div class="item">
        <p>
          <span>{{curriculumOrder.feeType===1?'费用':'课时费'}}：</span>
          <span>¥ {{curriculumOrder.feeType===1?curriculumOrder.fee:curriculumOrder.totalClassFee}}</span>
        </p>
        <CheckBox :check="true"/>
      </div>
      <div class="item" v-if="curriculumOrder.feeType!==1">
        <p>
          <span>器材费：</span>
          <span>¥ {{curriculumOrder.equipmentFee}}</span>
        </p>
        <CheckBox :check.sync="equipment"/>
      </div>
    </div>

    <div class="navbar">
      <div>
        总计：<span>¥ {{total}}</span>
      </div>
      <div class="next" style="font-weight: bold" @click="confirmOrder">提交订单</div>
    </div>
  </div>
</template>

<script>
  import Child from "@/components/global/child";
  import CheckBox from "@/components/home/checkbox";
  import store from "../../store/store";
  import { createOrder } from "../../../service/home/order";
  import { getItem } from "../../../utils/localStorage";
  export default {

    name: "index",
    components: {
      Child,
      CheckBox
    },
    computed: {
      curriculumOrder: function() {
          return this.$store.state.curriculumOrder;
      },
      labels: function() {
        if(this.curriculumOrder.feeType === 1){
          return []
        }else{
          return this.curriculumOrder.termTaxonomyPathDesc.split(">");
        }
      },
      total: function() {
        if(this.curriculumOrder.feeType === 1){
          return this.curriculumOrder.fee;
        }
        if (this.equipment) {
          return (this.curriculumOrder.equipmentFee + this.curriculumOrder.totalClassFee).toFixed(2);
        } else {
          return (this.curriculumOrder.totalClassFee || 0).toFixed(2);
        }
      },
      level: function() {
        if(this.curriculumOrder.feeType === 1){
          return '';
        }
        return this.curriculumOrder.level[0];
      }
    },
    data: function() {
      return {
        equipment: false, // 器材
        studentId: "",
        studentIndex: 0,
        hide: false
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      console.log(this.studentId);
      this.studentIndex = this.route().query.studentIndex;
      if(this.studentIndex === undefined){
        this.studentIndex = 0;
      }else{
        this.studentIndex = +this.studentIndex;
        this.hide = true;
      }
    },
    methods: {
      confirmOrder: async function() {
        const data = await createOrder({
          orgId: this.curriculumOrder.orgId,
          totalFee: this.total,
          courseId: this.curriculumOrder.feeType===1?this.curriculumOrder.courseId: this.curriculumOrder.id,
          studentId: this.studentId
        }, {
          load: true
        });
        console.log(data);
        if (data) {
          this.navigateTo({
            url: "/pages/homeChild/payOrder/main?id=" + data
          });
        }
      },
      getStudent: function(stu) {
        this.studentId = stu.studentId;
      },
    }
  };
</script>

<style scoped lang="scss">


  .page {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #f2f2f2;
  }

  .navbar {
    position: fixed;
    width: 100%;
    height: rpx(100);
    bottom: 0;
    left: 0;
    background-color: #fff;
    @extend %flex;
    text-align: center;
    div {
      flex: 1;
      line-height: rpx(100);
      color: #000;
      font-size: rpx(32);
    }
    span {
      font-size: rpx(34);
      color: $subThem-red;
    }
    .next {
      background-color: $them;
    }
  }

  .box {
    margin-bottom: rpx(30);
    background-color: #fff;
    padding-bottom: rpx(31);
  }

  .title-name {
    padding: rpx(20) 0 0 rpx(30);
    font-size: rpx(30);
    color: #313131;
    font-weight: bold;
  }

  .labels {
    padding-left: rpx(30);
  }

  .cost {
    height: rpx(110);
    line-height: rpx(110);
    font-size: rpx(32);
    color: #313131;
    font-weight: bold;
    span {
      vertical-align: middle;
    }
    .tag {
      margin-right: rpx(12);
      display: inline-block;
      width: rpx(30);
      height: rpx(40);
      background-color: $them;
      border-radius: 0 rpx(20) rpx(20) 0;
    }
  }

  .item {
    padding-left: rpx(40);
    padding-right: rpx(30);
    font-size: rpx(30);
    line-height: rpx(30);
    color: #424242;
    margin-bottom: rpx(49);
    @extend %flex;
    @extend %flex-align-center;
    @extend %justify-content-space-between;
    span:last-of-type {
      font-size: rpx(28);
      color: #9D9D9D;
      margin-left: rpx(20);
    }
  }
</style>
