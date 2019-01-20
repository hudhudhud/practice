<template>
  <div>
    <Child @update:student="getStudent" :type1="type1" :index.sync="studentIndex" all="1"/>
    <div class="card flex">
      <div class="info">
        <p class="name">午餐收费</p>
        <p>{{info.yearTermName}}</p>
      </div>
      <div class="count">
        ¥ {{price}}
      </div>
      <div class="btn" @click="alipayLunchOrder"
           :class="{disabled: info.status==='paid'||info.status==='finished'||info.status==='cancelled'}">
        {{statusText[info.status]||"支付"}}
      </div>
    </div>
    <a class="card flex-b flex" @click="toInfo">
      <div>供应商信息</div>
      <div><img class="icon-right" src="/static/img/util/icon_back_right.png" alt=""></div>
    </a>
    <a class="card flex-b flex" @click="toEvaluate">
      <div>我的评价</div>
      <div><img class="icon-right" src="/static/img/util/icon_back_right.png" alt=""></div>
    </a>
  </div>
</template>

<script>
  import Child from "@/components/global/child";
  import { alipayLunchOrder, queryLunchFee } from "../../../../service/featureList/lunch";

  export default {

    name: "index",
    components: {
      Child
    },
    data: function() {
      return {
        student: {},
        studentIndex: 0,
        info: {},
        statusText: {
          committed: "支付",
          paid: "已付款",
          finished: "已完成",
          cancelled: "待退款"
        },
        type1:''
      };
    },
    computed: {
      price: function() {
        try {
          return this.info.price * this.info.consumeDay || "0";
        } catch (e) {
          console.log(e);
          return "";
        }
      }
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.type1 = this.route().query.type1;
      // this.getInfo();
    },
    methods: {
      getStudent: function(stu) {
        this.student = stu;
        this.getInfo();
      },
      getInfo: async function() {
        this.info = await queryLunchFee({
          schoolId: this.student.schoolId,
          classId: this.student.classId,
          studentId: this.student.studentId
        });
      },
      // 支付
      alipayLunchOrder: async function() {
        //  const data = await alipayLunchOrder();
        if (["paid", "finished", "cancelled"].includes(this.info.status)) {
          return;
        }
        this.navigateTo({
          url: "./createOrder/main?id=" + this.info.id + "&total=" + this.price + "&studentIndex=" + this.studentIndex + "&orderId=" + (this.info.orderId || "")
        });

      },
      toInfo: function() {
        this.navigateTo({
          url: "./info/main?id=" + this.info.id
        });
      },
      toEvaluate: function() {
        if (!this.info.status || this.info.status === "committed") {
          return this.$toast("请先完成支付");
        }
        this.navigateTo({
          url: "./addEvaluate/main?id=" + this.info.id
        });
      }
    }
  };
</script>

<style scoped lang="scss">


  .card {
    overflow: hidden;
  }

  .icon-right {
    width: rpx(40);
    height: rpx(40);
  }

  .flex-b {
    height: rpx(160);
    box-sizing: border-box;
    padding: 0 rpx(30);
    @extend %justify-content-space-between;
  }

  .flex {
    @extend %flex;
    @extend %flex-align-center;
    .info {
      box-sizing: border-box;
      padding-left: rpx(29);
      flex: 2;
      line-height: rpx(26);
      font-size: rpx(26);
      color: #9A9A9A;
      .name {
        font-weight: bold;
        margin-bottom: rpx(33);
        font-size: rpx(32);
        line-height: rpx(32);
        color: #313131;
      }
    }
    .count {
      flex: 1;
      box-sizing: border-box;
      text-align: right;
      padding-right: rpx(31);
      color: $subThem-red;
    }
    .btn {
      width: rpx(160);
      height: rpx(160);
      line-height: rpx(160);
      text-align: center;
      font-size: rpx(32);
      color: #313131;
      background-color: $them;
      font-weight: bold;
    }
    .btn.disabled {
      background-color: gainsboro;
    }
  }

</style>
