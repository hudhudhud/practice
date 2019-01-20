<template>
  <div>
    <Child @update:student="getStudent" hide="hide" :index.sync="studentIndex" all="1"/>
    <div class="card">
      <div class="title">
        <span class="tag" style="background-color: #FFD200"></span>
        <span class="time">2018-04-05 ~ 2018-08-27</span>
      </div>
      <p class="intro">共计：150 消费日</p>
      <p class="cost">费用: <span class="them">￥{{total}}</span></p>
    </div>
    <div class="btns">
      <div class="btn">总计：<span class="them">￥{{total}}</span></div>
      <div class="btn next" @click="next">提交订单</div>
    </div>
  </div>
</template>

<script>
  import Child from "@/components/global/child";
  import { prePayUnderMini, saveLunchOrder } from "../../../../../service/featureList/lunch";
  import { getItem } from "../../../../../utils/localStorage";

  export default {

    name: "index",

    components: {
      Child
    },
    data: function() {
      return {
        student: "",
        studentIndex: 0,
        lunchId: "",
        total: "",
        orderId: ""
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.lunchId = this.route().query.id;
      this.total = this.route().query.total;
      this.orderId = this.route().query.orderId||'';
      this.studentIndex = this.route().query.studentIndex;
    },
    methods: {
      getStudent: function(stu) {
        this.student = stu;
      },
      next: async function() {
        if (!this.orderId) {
          this.orderId = await saveLunchOrder({
            schoolId: this.student.schoolId,
            lunchId: this.lunchId,
            classId: this.student.classId,
            studentId: this.student.studentId
          });
        }
        const data = await prePayUnderMini({ id: this.orderId });
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.packageInfo,
          signType: "HMAC-SHA256",
          paySign: data.paySign,
          success: (res) => {
            this.$toast("支付成功");
            setTimeout(() => {
              this.navigateBack({});
            }, 2000);
          },
          fail: (res) => {
            this.$toast(res);
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">


  .card {
    border-radius: 0;
    margin-top: rpx(20);
    width: 100%;
    padding-bottom: rpx(40);
    .time {
      font-size: rpx(28);
      color: #000;
    }
    .intro {
      margin: rpx(40) 0 0 rpx(40);
      font-size: rpx(31);
      color: #313131;
    }
    .cost {
      margin: rpx(40) 0 0 rpx(40);
      font-size: rpx(31);
      color: #313131;
      font-weight: bold;
    }

  }

  .them {
    color: $subThem-red;
  }

  .btns {
    position: absolute;
    background-color: #fff;
    width: 100%;
    height: rpx(100);
    bottom: 0;
    left: 0;
    @extend %flex;
    text-align: center;
    .btn {
      flex: 1;
      height: rpx(100);
      line-height: rpx(100);
    }
    .btn.next {
      background-color: $them;
    }
  }
</style>
