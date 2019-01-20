<template>
  <div>
    <div class="float-window">
      <div class="content">
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
          <input type="text" placeholder="请输入抬头" v-model="title">
        </div>
        <div class="info" v-if="active === 1">
          <label>税号</label>
          <input type="text" placeholder="请输入税号" v-model="dutyNumber">
        </div>
        <div class="info">
          <label>发票金额</label>
          <span>{{totalFee}}元</span>
        </div>
        <div class="info">
          <label>地址和电话</label>
          <input type="text" placeholder="选填" v-model="phoneAddress">
        </div>
        <div class="info">
          <label>开户行账号</label>
          <input type="text" placeholder="选填" v-model="bankAccount">
        </div>
        <div class="type-text">接受方式</div>
        <div class="info" v-if="active1 === 0">
          <label>邮箱地址</label>
          <input type="text" placeholder="请输入邮箱地址" v-model="email">
        </div>
        <div class="info" v-if="active1 === 1">
          <label>收件人</label>
          <input type="text" placeholder="请输入收件人姓名" v-model="name">
        </div>
        <div class="info" v-if="active1 === 1">
          <label>联系电话</label>
          <input type="text" placeholder="请输入联系电话" v-model="phoneNumber">
        </div>
        <div class="info" v-if="active1 === 1">
          <label>详细地址</label>
          <input type="text" placeholder="请输入收件地址" v-model="detailAddress">
        </div>
        <div class="submit" @click="submit">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {invoiceDetail} from "../../../../../service/profile/invoice";
    export default {

    name: "index",
    components: {

    },
    data: function() {
      return {
        page: 0,
        size: 10,
        loading: true,
        list: [],
        active: 0,
        active1: 0,
        detailAddress:'',
        phoneNumber:'',
        name:'',
        email:'',
        bankAccount:'',
        phoneAddress:'',
        dutyNumber:'',
        title:'',
        orderId:'',
        courseId:'',
        totalFee:''

      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.orderId = this.route().query.orderId;
      this.courseId = this.route().query.courseId;
      this.totalFee = this.route().query.totalFee;
    },
    methods: {
      changeActive: function(n,type){
        // type: 1  发票类型  2  抬头类型
        if(type === 0){
          this.active1 = n;
        }else {
          this.active = n;
        }
      },
      invoiceDet:async function(){
        if(this.active1 === 0){
          if(this.active === 0){
            if(!this.title || !this.email){
              return this.$toast("请输必填选项");
            }
          }else {
            if(!this.title || !this.email || !this.dutyNumber){
              return this.$toast("请输必填选项");
            }
          }
        }else {
          if(this.active === 0){
            if(!this.title || !this.email || !this.name || !this.phoneNumber || !this.detailAddress){
              return this.$toast("请输必填选项");
            }
          }else {
            if(!this.title || !this.email || !this.dutyNumber || !this.name || !this.phoneNumber || !this.detailAddress){
              return this.$toast("请输必填选项");
            }
          }
        }
        let param = {
          orderId:this.orderId,
          courseId:this.courseId,
          invoiceType:this.active1,
          type:this.active,
          companyName:this.title,
          totalFee:this.totalFee,
          addressPhone:this.phoneAddress,
          bankAccount:this.bankAccount,
        };
        if(this.active1 === 0){
          param.receiverName && delete param.receiverName;
          param.recipientPhone && delete param.recipientPhone;
          param.receiverPhone && delete param.receiverPhone;
          param.address && delete param.address;
          param.receiverEmail = this.email;
          if(this.active === 1){
            param.taxPersonalNo = this.dutyNumber;
          }else {
            param.taxPersonalNo && delete param.taxPersonalNo;
          }
        }else {
          param.receiverEmail && delete param.receiverEmail;
          param.receiverName = this.name;
          param.recipientPhone = this.phoneNumber;
          param.receiverPhone = this.phoneNumber;
          param.address = this.detailAddress;
          if(this.active === 1){
            param.taxPersonalNo = this.dutyNumber;
          }else {
            param.taxPersonalNo && delete param.taxPersonalNo;
          }
        }
        try {
          const data = await invoiceDetail(param,{ successMsg: true, load: true });
          setTimeout(() => {
            this.navigateTo({
              url: "../main"
            });
          },1500)
        } catch (e) {
          this.loading = false;
        }
      },
      submit:function() {
        this.invoiceDet()
      }
    }
  };
</script>

<style scoped lang="scss">

  @import "../../../../../utils/animation";

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

  .float-window {
    .content {
      animation: result-show .3s ease-out;
      box-sizing: border-box;
      padding: rpx(35) rpx(30);
      border-radius: 20 rpx 20 rpx 0 0;
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
