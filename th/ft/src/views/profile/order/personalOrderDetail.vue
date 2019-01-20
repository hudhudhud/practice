<template>
    <div>
        <div class="order-status">
            <div>
                <p class="order-status-text">{{detail.orderStatuStr}}</p>
                <p class="order-status-intro">{{detail.orderStatus <= 1? '请耐心等待':detail.warningInfo}}</p>
            </div>
            <div class="icon">
                <img v-if="detail.orderStatus === 5" src="../../../assets/img/order/cancel_order.png" alt="">
                <img v-if="detail.orderStatus === 4" src="../../../assets/img/order/cancel_order.png" alt="">
                <img v-if="detail.orderStatus === 1" src="../../../assets/img/order/Collect_goods.png" alt="">
                <img v-if="detail.orderStatus === 2" src="../../../assets/img/order/Deliver_goods.png" alt="">
                <img v-if="detail.orderStatus === 0" src="../../../assets/img/order/wait_pay.png" alt="">
            </div>
        </div>
        <div class="account-info">
            <div class="info-head">
                <img class="head" :src="detail.customerAvatar" alt="">
            </div>
            <div class="info-person">
                <div>
                    <p class="nickname" v-if="detail.buyerName">用户名：{{detail.buyerName}} &nbsp;&nbsp;&nbsp;{{detail.buyerPhone}}</p>
                    <p v-if="detail.buyerName"><span class="rank">{{detail.buyerRank}}</span></p>
                    <p v-if="!service" class="address-title">收货信息：{{detail.addressRealname}}&nbsp;&nbsp;&nbsp;{{detail.addressPhone}}&nbsp;&nbsp;&nbsp;</p>
                    <p v-if="!service" class="address-info">收货地址：{{detail.allAddress}}</p>
                </div>
            </div>
        </div>
        <div class="order-detail">
            <div class="group-title" style="color: #333333">{{detail.shopName}}</div>
            <div class="group" v-for="(group, index) in detail.detailListVos">
                <div class="group-title">
                    <img src="../../../assets/img/order/detail_icon.png" alt="">
                    <span>{{index+1}}号包裹</span>
                </div>
                <template v-for="item in group">
                    <Shop :detail="item" :update="!service" :order="detail.orderStatus" @order-confirm="confirmGet"></Shop>
                </template>

            </div>
            <div class="group-btns" v-if="!service&&(detail.canApplyRefund||detail.afterSaleId)">
                <div class="group-btn" @click="afterSaleGroup()">{{detail.afterSaleStatusStr||'申请售后'}}</div>
            </div>

            <div class="order-pay-info">
                <p class="item">
                    <span>商品金额</span>
                    <span v-if="detail.orderType===4">{{detail.productTotalAmount}}积分</span>
                    <span v-else>￥{{detail.productTotalAmount}}</span>
                </p>
                <p class="item" v-if="Number(detail.discount)&&detail.orderType!==4">
                    <span>折扣</span>
                    <span>-￥{{detail.discount}}</span>
                </p>
                <p class="item" v-if="Number(detail.integralAmount)">
                    <span>积分抵扣</span>
                    <span>-{{detail.integralAmount}}</span>
                </p>
                <p class="item" v-if="Number(detail.ecardAmount)">
                    <span>E卡抵扣</span>
                    <span>-￥{{detail.ecardAmount}}</span>
                </p>
                <p class="item">
                    <span>快递运费</span>
                    <span>￥{{detail.logisticsFee}}</span>
                </p>
                <p class="item important">
                    <span>实付金额（含运费）</span>
                    <span class="them">￥{{detail.customerAmount}}</span>
                </p>
            </div>
        </div>

        <div class="express-info" style="margin-bottom: 10px;">
            <p>订单编号：{{detail.sn}}</p>
            <p>下单时间：{{detail.createTime}}</p>
            <p>支付时间：{{detail.paidTimeStr}}</p>
            <p>备注：{{getRemark(detail.buyerMemo)}} </p>
            <!--<div class="copy">复制</div>-->
        </div>
        <f-w></f-w>
    </div>
</template>

<script>
    import { Toast } from 'mint-ui';
    import {confirmAccept, getOrderDetail} from '../../../service/order.service'
    import Shop from '@/components/profile/shopDetail'
    export default {
        name: "personal-order-detail",
        data: function () {
            return {
                id: '',
                detail: {},
                nickname:'',
                phone:'',
                service: ''
            }
        },
        components: {
            Shop,
        },
        computed: {
            discount: function () {
                if(this.detail.discount){
                    return this.detail.discount.replace(/[\.0]/g, '');
                }else{
                    return '';
                }
            }
        },
        activated: function () {
            this.service = +this.$route.query.service;
            this.id = this.$route.params.id;
            if (!this.id) {
                Toast('错误，请返回!');
                return;
            }
            this.getInfo();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getInfo: async function () {
                let res = await getOrderDetail({id: this.id, load: true});
                if (res.status === '0') {
                    this.detail = res.data;
                    //this.detail.orderType = 4;
                }
            },
            getRemark: function (remark) {

                    return remark;

            },
            confirmGet:async function(id){
                await this.confirm('确认收货?', '提示');
                const res = await confirmAccept({logisticsId: id,orderId: this.detail.id, load: true, successMsg: '确认收货成功'});
                if(res.status === '0'){
                    this.getInfo();
                }
            },
            afterSaleGroup: function(){
                if(this.detail.afterSaleId){
                    this.$router.push({name: 'afterSaleInfo',query: {id: this.detail.afterSaleId}});
                }else{
                    localStorage.setItem('refund-data', JSON.stringify(this.detail));
                    this.$router.push({name: 'refund', query:{status: 1}});
                }

            },

        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

        .group-title{
            border-bottom: 1px solid $border;
            padding: 0 rem(15);
            font-size: rem(14);
            line-height: rem(40);
            color: #999;
            img{
                margin-right: rem(5);
                vertical-align: middle;
                width: rem(18);
                height: rem(18);
            }
            span{
                vertical-align: middle;
            }
        }

    .group-btns{
        overflow: hidden;
        border-top: 1px solid $border;
        padding: rem(10);
        .group-btn{
            float: right;
            line-height: rem(26);
            padding: 0 rem(11);
            text-align: center;
            min-width: rem(64);
            color: #333333;
            font-size: rem(11);
            border: 1px solid #999999;
            border-radius: rem(13);
        }
    }





    .order-status {
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-space-between;
        height: rem(70);
        padding: rem(10) rem(20);
        color: #ffffff;
        background-color: $them;

        .order-status-text {
            font-size: rem(18);
        }
        .order-status-intro {
            font-size: rem(13);
        }
        .icon {
            img {
                width: rem(40);
                height: rem(40);
            }
        }
    }

    .account-info {
        height: rem(94);
        background-color: #ffffff;
        font-size: 0;
        white-space: nowrap;
        & > div {
            height: 100%;
            box-sizing: border-box;
            display: inline-block;
            vertical-align: middle;
        }
        .info-head {
            width: 20%;
            .head {
                margin: rem(22) auto;
                display: block;
                width: rem(50);
                height: rem(50);
            }
        }
        .info-person {
            @extend %inline-flex;
            @extend %flex-align-center;
            font-size: rem(13);
            color: #333333;
            width: 80%;
            p {
                white-space: nowrap;
                margin: rem(5) 0;
            }
            .address-title {

            }
            .address-info {
                color: #999999;
               white-space: normal;
            }
        }
    }

    .order-detail {
        margin-top: rem(10);
        background-color: #ffffff;
    }

    .order-pay-info {
        padding: rem(5) rem(10);
        font-size: rem(11);
        color: #333333;
        border-top: 1px solid $border;
        //   border-bottom: 1px solid lighten(gainsboro,5%);
        .item {
            margin-bottom: rem(5);
            @extend %flex;
            @extend %justify-content-space-between;
        }
        .item.important {
            font-size: rem(13);
            margin: rem(13) 0;
        }
    }

    .express-info {
        padding: rem(5) 0;
        margin-top: rem(10);
        background-color: #ffffff;
        font-size: rem(13);
        color: #636363;
        p {
            margin: rem(8);
        }
        position: relative;
        .copy {
            position: absolute;
            top: rem(10);
            right: rem(10);
            height: rem(26);
            line-height: rem(26);
            padding: 0 rem(21);
            border: 1px solid rgba(153, 153, 153, 1);
            border-radius: 1px;
        }

    }

    .rank {
        color: #FF8B1A;
    }


</style>