<template>
  <div>
    <div class="pay-time-box">
      <div class="pay-time">
        <p>剩余支付时间</p>
        <p>{{timeText}}</p>
      </div>
      <div class="info">{{info.name}}</div>
      <div class="info">实际支付：<span class="cost">¥ {{info.totalFee}}</span></div>
    </div>
    <div class="pay-type">
      <div class="title">
        <span class="tag"></span>
        <span>选择支付方式</span>
      </div>
      <!--   <div class="item" @click="payType=0">
           <div>
             <img class="icon" src="/static/img/util/aliPay.png" alt="">
             <span class="pay-name">支付宝</span>
           </div>
           <Check :check="payType===0"/>
         </div>-->
      <div class="item" @click="payType=1">
        <div>
          <img class="icon" src="/static/img/util/wxPay.png" alt="">
          <span class="pay-name">微信</span>
        </div>
        <Check :check="payType===1"/>
      </div>
    </div>

    <div class="pay" @click="pay">确认支付</div>
  </div>
</template>

<script>
  import Check from "@/components/home/checkbox";
  import { courseOrderDetail, getWxPayInfo } from "../../../service/home/order";

  export default {

    name: "index",
    components: {
      Check
    },
    data: function() {
      return {
        payType: 1,
        timeText: "",
        interval: null,
        id: "",
        info: {},
        source: ''
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.source = this.route().query.source;
      this.getData();
      // this.getTime();
    },
    onUnload: function() {
      clearInterval(this.interval);
    },
    methods: {
      getData: async function() {
        this.info = await courseOrderDetail({ id: this.id });
        // 如果是免费的 直接跳转
        if(this.info.totalFee === 0){
          this.redirectTo({
            url: '/pages/profile/sub/orderList/main?status=2'
          })
        }

        let time = this.info.remainPaySecs;
        if(time <=0){
          setTimeout(() => {
            this.navigateBack({});
          }, 1500);
          return this.$toast('超过支付时间');
        }
        this.startCountDown(time);
      },

      pay: async function() {
        switch (this.payType) {
          case 1:
            const data = await getWxPayInfo({ id: this.id });
            wx.requestPayment({
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.packageInfo,
              signType: "HMAC-SHA256",
              paySign: data.paySign,
              success: (res) => {
                this.$toast('支付成功');
                setTimeout(() => {
                  if(this.source === 'orderList'){
                    this.navigateBack({ })
                  }else{
                    this.redirectTo({
                      url: '/pages/profile/sub/orderList/main?status=2'
                    })
                  }

                }, 2000)
              },
              fail: (res) => {
                this.$toast(res);
              }
            });
            break;
        }
      },
      startCountDown: function(time) {
        this.getTimeText(time);
        this.interval = setInterval(() => {
          time--;
          if (time >= 0) {
            this.getTimeText(time);
          } else {
            clearInterval(this.interval);
            this.$toast('订单已过期，请重新下单');
            setTimeout(() => {
              this.navigateBack({ });
            }, 1500);
          }
        }, 1000);
      },
      getTimeText: function(time = 900) {
        let minute = parseInt(time / 60).toString();
        let second = parseInt(time % 60).toString();
        this.timeText = minute.padStart(2, "0") + ":" + second.padStart(2, "0");
      }
    }
  };
</script>

<style scoped lang="scss">


  .pay-time-box {
    padding-bottom: rpx(30);
    background-color: #fff;
    .pay-time {
      overflow: hidden;
      width: rpx(690);
      padding: rpx(40) 0;
      margin: 0 auto;
      text-align: center;
      border-bottom: 1px solid $border;
      p:first-of-type {
        margin-bottom: rpx(40);
        line-height: rpx(28);
        font-size: rpx(28);
        color: #9A9A9A;
      }
      p:last-of-type {
        line-height: rpx(56);
        font-size: rpx(56);
        color: #000;
      }
    }
    .info {
      margin-top: rpx(30);
      padding-left: rpx(28);
      font-size: rpx(28);
      line-height: rpx(28);
      color: #000;
      span {
        font-size: rpx(34);
        color: $subThem-red;
        font-weight: bold;
      }
    }
  }

  .pay-type {
    background-color: #fff;
    margin-top: rpx(30);
    .title {
      padding: rpx(30) 0 rpx(20) 0;
      font-size: rpx(32);
      font-weight: bold;
      .tag {
        border-radius: 0 rpx(10) rpx(10) 0;
        width: rpx(30);
        height: rpx(40);
        display: inline-block;
        margin-right: rpx(11);
        background-color: $them;
      }
      span {
        vertical-align: middle;
      }
    }

    .item {
      @extend %flex;
      @extend %flex-align-center;
      @extend %justify-content-space-between;
      font-size: rpx(28);
      padding: rpx(25) rpx(30) rpx(25) rpx(40);
      .icon {
        display: inline-block;
        width: rpx(50);
        height: rpx(50);
        vertical-align: middle;
      }
      .pay-name {
        margin-left: rpx(21);
        vertical-align: middle;
      }
    }
  }

  .pay {
    font-size: rpx(32);
    line-height: rpx(100);
    height: rpx(100);
    text-align: center;
    width: 100%;
    position: absolute;
    background-color: $them;
    font-weight: bold;
    bottom: 0;
    left: 0;
  }
</style>
