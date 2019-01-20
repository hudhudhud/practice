<template>
  <div>
    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">
      <OrderItem v-for="item in list" :key="item.id" :info="item" :invoiceBtn="btn" @handleBtn="needInvoice"></OrderItem>
      <div class="no-list"style="margin-top: 20px" v-if="!list.length">暂无发票</div>
    </scroll-view>
    <div class="float-window" v-show="show" @click="close">
      <div class="content" @click.stop="">
        <div class="title">发票类型</div>
        <div class="type-style" :class="{active:active1===0}" @click="changeActive(0,0)">电子发票</div>
        <div class="type-style" :class="{active:active1===1}" @click="changeActive(1,0)">纸质发票</div>
        <div class="type-text">发票详情</div>
        <div class="info" style="position: relative;">
          <label>抬头类型</label>
          <div class="selectType">
            <div class="selectTypeL" @click="changeActive(0,1)">
              <p class="selectTypeLbg"><span v-if="active === 0" class="selectTypeLbgCenter"></span></p><p>个人</p>
            </div>
            <div class="selectTypeL" @click="changeActive(1,1)">
              <p class="selectTypeLbg"><span v-if="active === 1" class="selectTypeLbgCenter"></span></p><p>单位</p>
            </div>
          </div>
        </div>
        <div class="info">
          <label>发票抬头</label>
          <input type="text" placeholder="请输入抬头">
        </div>
        <div class="info" v-if="active === 1">
          <label>税号</label>
          <input type="text" placeholder="请输入税号">
        </div>
        <div class="info">
          <label>发票金额</label>
          <span>2000元</span>
        </div>
        <div class="info">
          <label>地址和电话</label>
          <input type="text" placeholder="选填">
        </div>
        <div class="info">
          <label>开户行账号</label>
          <input type="text" placeholder="选填">
        </div>
        <div class="type-text">接受方式</div>
        <div class="info" v-if="active1 === 0">
          <label>邮箱地址</label>
          <input type="text" placeholder="请输入邮箱地址">
        </div>
        <div class="info" v-if="active1 === 1">
          <label>收件人</label>
          <input type="text" placeholder="请输入收件人姓名">
        </div>
        <div class="info" v-if="active1 === 1">
          <label>联系电话</label>
          <input type="text" placeholder="请输入联系电话">
        </div>
        <div class="info" v-if="active1 === 1">
          <label>详细地址</label>
          <input type="text" placeholder="请输入收件地址">
        </div>
        <div class="submit">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import OrderItem from "@/components/profile/orderItem";
  import { invoiceList2Claim } from "../../../../service/profile/invoice";

  export default {

    name: "index",
    components: {
      OrderItem
    },
    data: function() {
      return {
        page: 0,
        size: 10,
        loading: true,
        list: [],
        active: 0,
        active1: 0,
        show: false,
        showId: -1,
        btn:"索要发票",
        orderId:'',
        courseId:'',
        totalFee:''
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.check();
    },
    methods: {
      needInvoice: function(id){
        this.orderId = id.orderId;
        this.courseId = id.courseId;
        this.totalFee = id.totalFee;
        // this.show = true;
        this.navigateTo({
          url: "./invoiceDetail/main?orderId=" + this.orderId+"&courseId="+this.courseId+"&totalFee="+this.totalFee
        });
      },
      close: function(){
        this.show = false;
      },
      changeActive: function(n,type){
        // type: 1  发票类型  2  抬头类型
        if(type === 0){
          this.active1 = n;
        }else {
          this.active = n;
        }
      },
      check: function() {
        this.list = [];
        this.loading = false; // 重新开启监听
        this.page = 0;
        this.loadMore();
      },
      loadMore: function() {
        if (this.loading) {
          return;
        }
        this.loading = true;
        this.page++;
        this.getList();
      },
      getList: async function() {
        try {
          const data = await invoiceList2Claim({ pageNo: this.page, pageSize: this.size });
          if (this.page === 1) {
            this.list = data.list;
          } else {
            this.list = this.list.concat(data.list);
          }
          this.loading = Number(data.list.length) < Number(this.size);

        } catch (e) {
          this.loading = false;
        }
      }
    }
  };
</script>

<style scoped lang="scss">

  @import "../../../../utils/animation";

  .selectType {
    position: absolute;
    left: rpx(160);
    top: rpx(6);
    width: rpx(400);
    height: rpx(50);
    overflow: hidden;
    .selectTypeL {
      float: left;
      overflow: hidden;
      margin-right:rpx(50);
      .selectTypeLbg {
        border: 1px solid gray;
        width: rpx(20);
        height: rpx(20);
        border-radius: rpx(10);
        position: relative;
        top: rpx(8);
        margin-right: rpx(10);
        span {
          display: inline-block;
          background: gray;
          width: rpx(10);
          height: rpx(10);
          border-radius: rpx(5);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
        }
      }
      p {
        float: left;
      }


    }
  }
  .scroll-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }

  .float-window {
    z-index: 100;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    .content {
      animation: result-show .3s ease-out;
      box-sizing: border-box;
      padding: rpx(35) rpx(30);
      border-radius: 20 rpx 20 rpx 0 0;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: #fff;
      color: #313131;
      .title {
        font-size: rpx(36);
        font-weight: bold;
      }
      .type-text {
        font-weight: bold;
        margin-top: rpx(60);
        line-height: rpx(30);
        font-size: rpx(30);
      }
      .type-style {
        border-radius: rpx(30);
        margin-top: rpx(29);
        display: inline-block;
        width: rpx(140);
        height: rpx(60);
        line-height: rpx(60);
        border: 1px solid rgba(234, 234, 234, 1);
        text-align: center;
        font-size: rpx(28);
        color: #313131;
        margin-right: rpx(40);
      }
      .type-style.active {
        background-color: $them;
        border: none;
      }
      .type-input {
        box-sizing: border-box;
        margin-top: rpx(20);
        border-radius: rpx(35);
        width: 100%;
        height: rpx(70);
        background-color: #f2f2f2;
        padding-left: rpx(31);
        font-size: rpx(26);
      }
      .info{
        margin-top: rpx(39);
        font-size: rpx(26);
        span{
          vertical-align: middle;
        }
        label{
          margin-right: rpx(31);
          vertical-align: middle;
        }
        input{
          width: rpx(500);
          vertical-align: middle;
          display: inline-block;
        }
      }
      .submit{
        margin: rpx(120) auto rpx(30);
        border-radius: rpx(44);
        width: rpx(400);
        height: rpx(88);
        line-height: rpx(88);
        text-align: center;
        font-size: rpx(32);
        color: #000;
        background-color: #FEBF00;
        @include gradientToRight(#FFEB00,#FEBF00)
      }
    }
  }
</style>
