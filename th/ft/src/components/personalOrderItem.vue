<template>
    <div style="background-color: white" class="component">
        <div class="title">
            <span>订单号：{{item.sn}}</span>
            <span>{{item.orderStatuStr}} <i class="iconfont icon-right"></i></span>
        </div>
        <div class="pay-by" v-if="service">
            <span>下单人：{{item.buyerNickName}}</span>
            <span><span class="phone_a_box"><a class="phone_a" :href="'tel:' + item.buyerPhone"></a></span><span class="phone_num">{{item.buyerPhone.replace(/^(\d{4})\d{4}(\d+)/,"$1****$2")}}</span></span>
            <span>{{item.buyerRank}}</span>
        </div>
        <div class="content" v-for="child in item.detailListVos" :key="child.id">
            <div class="img">
                <img :src="child.productImage" alt="">
            </div>
            <div class="intro">
                <p>{{child.productTitle}}</p>
                <p>{{child.tagInfo||''}}</p>
                <p class="take-money" v-if="service && getMoneyFunShow(child.money,child.settleType)">{{getMoneyFun(child.money,child.settleType)}}</p>
                <p class="take-money" v-else-if="item.orderType===3&&rank>0">福利商品自购返{{child.money}}元</p>
            </div>
            <div class="money">
                <p v-if="item.orderType===4"><b>{{child.price}}积分</b> </p>
                <p v-else><b>￥{{child.price}}</b> </p>
                <p>{{child.marketPrice}}</p>
                <p>x {{child.quantity}}</p>
                <div class="discount" v-if="child.discount">{{parseInt(child.discount)}}折</div>
            </div>
        </div>
        <div class="total">
            <span class="count">共{{item.quantity}}件商品</span>
            <div>
                合计：<b>{{(item.orderType===4?'':'￥')+item.customerAmount+(item.orderType===4?'积分':'')}}</b><span>（含运费 ¥{{item.logisticsFee}} ）</span>
            </div>
        </div>
        <div class="buttons" v-if="!service">
            <div v-if="item.orderStatus===0" class="button" @click="cancelOrder(item.id)">取消订单</div>
            <!--<div v-if="[2,3,5].includes(item.orderStatus)" class="button" @click="handleLogistics">查看物流</div>-->
            <!--<div class="button" v-if="item.orderStatus===2" @click="handleConfirmReceipt">确认收货</div>-->
            <div @click="handleOrderDetail(item.id)"  class="button " :class="{active:(item.orderStatus!=5&&item.orderStatus!=4) }">查看订单</div>
            <!--<div v-if="(item.orderStatus===5||item.orderStatus===4||item.orderStatus===3)&&item.orderType!=1&&item.orderType!=2" class="button active" @click="handleAgainPay">再次购买</div>-->
            <div v-if="item.orderStatus===0" class="button active" @click="handlePay">立即支付</div>
        </div>
        <div class="buttons" v-else>
            <div @click="handleOrderDetail(item.id,item.buyerNickName,item.buyerPhone)"  class="button active" >查看订单</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "personal-order-item",
        props: ['item', 'service'],
        methods:{
            getMoneyFun:function(money,type){
                if(money == '0.00'){
                    if(type==1 || type==2 || type==3){
                        return "此单有月度收益";
                    }else{
                        return "";
                    }
                }else{
                    return '赚了：'+money;
                }
            },
            getMoneyFunShow:function(money,type){
                if(money == '0.00'){
                    if(type==1 || type==2 || type==3){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return true;
                }
            },
            cancelOrder: function (id) {
                this.$emit('cancel-order', id);
            },
            handleOrderDetail: function (id) {
                this.$emit('order-detail', {id:id});
            },
            handlePay: function () {
                this.$emit('order-pay', {id: this.item.paymentsId, price: this.item.customerAmount, orderType: this.item.orderType})
            },
            handleAgainPay: function () {
                this.$emit('order-again', this.item.productId);
            },
            handleLogistics: function () {
                this.$emit('order-logistice', this.item.id);
            },
            handleConfirmReceipt: function () {
                this.$emit('order-confirm', this.item.id);
            }
        },
        computed: {
            rank() {
                return Number(this.$store.state.userInfo.rank);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/public";
    .component{
      //  margin-top: rem(10);
    }
    .title{
        border-top: 1px solid $border;
        height: rem(40);
        padding: 0 rem(10);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: rem(13);
        color: #333333;
        span:last-of-type{
            color: $them;
        }
    }
    .content{
        border-top: 1px solid $border;
        padding: rem(10);
        display: flex;
        align-items: center;
        .img img{
            display: block;
            width: rem(80);
            height: rem(80);
        }
        .intro{
            position: relative;
            flex: 1;
            height: rem(80);
            margin-left: rem(10);
            font-size: rem(13);
            p:nth-of-type(1){
               // height: rem(36);
                color: #333333;
            }
            p:nth-of-type(2){
                margin: rem(4) 0;
                color: #BBBBBB;
            }
            .take-money{
                display: inline-block;
                border: 1px solid #F97306;
                border-radius: rem(11);
                color: #F97306;
                padding: rem(2) rem(5);
                font-size: rem(11);
            }

        }
        .money{
            text-align: right;
            .discount{
                color: $them;
                position: absolute;
                right: 0;
                bottom: 0;
            }
            color: #bbbbbb;
            p:first-of-type{
                color: #333333;
            }
            p:nth-of-type(2){
                text-decoration:line-through;
                margin: 2px 0;
            }
            font-size: rem(13);
            position: relative;
            height: rem(80);
        }
    }

    .pay-by{
        border-top: 1px solid $border;
        height: rem(44);
        padding: 0 rem(10);
        font-size: rem(13);
        color: #333333;
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-space-between;
        span:last-of-type{
            color: #FF8B1A;
            flex: 1;
        }
        span{
            @extend %nowrap;
          flex: 2;
          align-items: center;
        }
        .phone_a_box{
            display: inline-block;
            width: rem(18);
            height: rem(18);
            border-radius: 50%;
            background:linear-gradient(312deg,rgba(252,220,78,1) 0%,rgba(255,171,55,1) 100%);
            margin-right: rem(8);
            margin-top: rem(5);
        }
        .phone_a{
            display: inline-block;
            width: rem(18);
            height: rem(18);
            border-radius: 50%;
            text-decoration:none ;
            out-line: none;
            color: #000;
            background-image: url("../assets/images/phpne_icon@2x.png");
            background-size: rem(10) rem(10);
            background-repeat: no-repeat;
            background-position: center;
        }
        .phone_num{
            display: inline-block;
            height: 100%;
            /*line-height: 100%;*/
        }
    }
    .total{
        height: rem(40);
        line-height: rem(40);
        color: #333333;
        @extend %flex;
        @extend %justify-content-space-between;
        @extend %flex-align-center;
        border-top: 1px solid $border;
        font-size: rem(16);
        padding: 0 rem(15);
        .count{
            font-size: rem(13);
            color: #333333;
        }
        span{
            font-size: rem(12);
        }
    }
    .buttons{
        display: flex;
        align-items: center;
        justify-content:  flex-end ;
        border-top: 1px solid $border;
        height: rem(46);
        .button{
            border-radius: rem(13);
            margin-left: rem(15);
            border: 1px solid #999999;
            height: rem(26);
            line-height: rem(26);
            padding: 0 rem(10);
            font-size: rem(11);
            color: #333333;
        }
        .button:last-of-type{
            margin-right: rem(20);
        }
        .button.active{
            border-color: $them;
         //   background: $them;
            color: $them;
        }
    }
</style>