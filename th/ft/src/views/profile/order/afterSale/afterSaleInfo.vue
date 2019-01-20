<template>
    <div>
        <!--红色的-->
        <div class="order-status">
            <div>
                <p class="order-status-text">{{info.applyStatusStr}}</p>
                <p class="order-status-intro"></p>
            </div>
            <div class="icon">
                <img src="../../../../assets/img/order/cancel_order.png" alt="">
            </div>
        </div>


        <!--退款 信息-->
        <div class="refund-info1" v-if="info.type===1||info.type===3">
            <p class="title">{{info.showInfo}}</p>
            <div class="intro" v-if="info.applyStatus===0">
                <p>·客服审核通过后，系统将根据实际情况予以退款；</p><br/>
                <p v-if="info.type===1">·如果售后申请拒绝，您可以修改售后申请后，再次发起，客服会重新处理；</p>
            </div>
            <div class="intro" v-if="info.applyStatus===1">
                <p>·申请受理成功后，退款将在1-2个工作日内，原路退还</p><br/>
                <p v-if="info.type===1">·如果售后的订单已发货，我们将在收到寄回的商品后，确认收到的商品不会影响二次销售的情况下，将在1-2个工作日内完成退款。</p>
            </div>
            <div class="fail" v-if="info.applyStatus===2">
                <span>被拒原因：</span>
                <span>{{info.remark}}</span>
            </div>
            <div class="btns">
                <div class="btn" @click="cancelRefund" v-if="[0,4].includes(info.applyStatus)&&info.type===1">撤销申请</div>
                <div class="btn" @click="reapply" v-if="info.applyStatus===2">修改申请</div>
            </div>
        </div>
        <!--退货退款信息-->
        <div class="refund-info2" v-if="info.type===2">
            <div class="status">{{info.showInfo}}</div>
            <div class="status" style="border-bottom: none" v-if="info.applyStatus>=3">退货邮寄地址：</div>
            <div class="address"  v-if="info.applyStatus>=3">
                <p>{{info.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{info.phone}}</p>
                <p>{{info.address}}</p>
            </div>
            <div class="intro" v-if="info.applyStatus===0">
                <p>·客服审核通过后，系统将根据实际情况予以退款；</p><br/>
                <p>·如果售后申请拒绝，您可以修改售后申请后，再次发起，客服会重新处理；</p>
            </div>
            <div class="intro"  v-if="[3,5].includes(info.applyStatus)">
                <p>·请按照指定的收货地址将商品寄回，并请记录退货运单号；</p><br/>
                <p>·如果已收到货的请看下，我们将在收到寄回的商品后，确认收到的商品不影响二次销售的，将在1-2个工作日内日完成退款。</p>
            </div>
            <div class="fail" v-if="info.applyStatus===2">
                <span>被拒原因：</span>
                <span>{{info.remark}}</span>
            </div>
            <div class="btns">
                <div class="btn" @click="addLogisticsInfo" v-if="info.applyStatus===5">填写物流</div>
                <div class="btn" @click="cancelRefund" v-if="[0,4,5].includes(info.applyStatus)">撤销申请</div>
                <div class="btn" @click="reapply" v-if="info.applyStatus===2">修改申请</div>
            </div>
            <div class="logistics" v-if="info.logisticsNumber&&info.applyStatus!==2">
                <div class="log-title">邮寄信息</div>
                <p class="info">
                    <span>物流单号：</span>
                    <span>{{info.logisticsNumber}}</span>
                </p>
                <p class="info">
                    <span>物流公司：</span>
                    <span>{{info.logisticsName}}</span>
                </p>
                <p class="info">
                    <span>邮寄时间：</span>
                    <span>{{info.logisticsTime}}</span>
                </p>
            </div>
        </div>
        <!--退款金额-->
        <div class="refund-money" v-if="info.applyStatus===1">
            <div class="total">
                <span>{{['', '退款','退货','赔付'][info.type]}}总金额</span>
                <span class="them">￥{{(info.refundAmount||0).toFixed(2)}}</span>
            </div>
            <div class="item" v-if="Number(info.refundUB)">
                <span>退回U币</span>
                <span>
                    <!--<span class="small">（实际支付¥1400.66)</span>-->
                    ￥{{info.refundUB}}</span>
            </div>
            <div class="item" v-if="Number(info.refundRemain)">
                <span>退回余额</span>
                <span>￥{{info.refundRemain}}</span>
            </div>
            <div class="item" v-if="Number(info.refundEcard)">
                <span>退回E卡</span>
                <span>￥{{info.refundEcard}}</span>
            </div>
            <div class="item" v-if="Number(info.refundThirdPay)">
                <span>退回第三方</span>
                <span>￥{{info.refundThirdPay}}</span>
            </div>
        </div>

        <!--备注-->
          <div class="remark" v-if="info.applyStatus!==2">
              <div class="label">备注：</div>
              <div class="value">{{info.appleRemark}}</div>
          </div>

        <!--售后记录-->
           <div class="after-sale" @click="$router.push({name: 'afterSaleList', query: {id: id}})">
               <span>{{info.type===3?'赔付':'售后'}}记录</span>
               <i class="iconfont icon-right"></i>
           </div>
        <!--退款订单商品信息-->
        <div class="refund-order-info">
            <div class="title">{{['', '退款申请','退货申请','赔付信息'][info.type]}}</div>
            <div class="bor-top bor-bottom">
                <Shop :detail="item" v-for="item in info.orders" :key="item.id"></Shop>
            </div>
            <p class="info">
                <span class="label">{{['', '退款','退货','赔付'][info.type]}}原因：</span>
                <span class="value">{{info.reason}}</span>
            </p>
            <p class="info" v-if="info.type===2">
                <span class="label">退款数量：</span>
                <span class="value">{{info.orders[0].quantity}}</span>
            </p>
            <p class="info">
                <span class="label">{{['', '退款','退货','赔付'][info.type]}}金额：</span>
                <span class="value">¥{{info.refundAmount}}</span>
            </p>
            <p class="info">
                <span class="label">申请时间：</span>
                <span class="value">{{info.applyTime}}</span>
            </p>
            <p class="info">
                <span class="label">售后编号：</span>
                <span class="value">{{info.sn}}</span>
            </p>
        </div>
        <LogisticsAlert ref="logistics"/>
    </div>
</template>

<script>
    import LogisticsAlert from '@/components/profile/fillLogisticsInfo'
    import {cancelAfterSaleApply, refundFindone, addLogisticsInfo} from "../../../../service/profile/refund.service";
    import Shop from '@/components/profile/shopDetail'

    export default {
        name: "afterSaleInfo",
        components: {
            LogisticsAlert,
            Shop
        },
        data: function () {
            return {
                info: {},
                id: ''
            }
        },
        activated: function () {
            this.id = this.$route.query.id;
            this.setTitle('售后信息');
            this.getInfo();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getInfo: async function () {
                const res = await refundFindone({id: this.$route.query.id});
                if (res.status === '0') {
                    this.info = res.data;
                }
            },
            /**
             * 填写物流
             * */
            addLogisticsInfo: async function () {
                const info = await this.$refs.logistics.getInfo();

                const res = await addLogisticsInfo({
                    id: this.$route.query.id,
                    logisticsSn: info.nameId,
                    logisticsNumber: info.num,
                    load: true,
                    successMsg: '填写成功'
                });
                if (res.status === '0') {
                    this.getInfo();
                }
            },
            /**
             * 撤销退款
             */
            cancelRefund: async function () {
                await this.confirm('真的要撤销申请吗?', '确认');
                const res = await cancelAfterSaleApply({
                    id: this.$route.query.id,
                    afterSaleType: this.info.type,
                    load: true,
                    successMsg: '取消成功'
                });
                if (res.status === '0') {
                    this.getInfo();
                }
            },
            reapply: function () {
                if(this.info.type === 1){
                    localStorage.setItem('refund-data', JSON.stringify({...this.info,id: this.info.orderId,customerAmount: this.info.refundAmount, detailListVos: [this.info.orders]}));
                }else{
                    localStorage.setItem('refund-data', JSON.stringify({...this.info.orders[0], detailListVos: [this.info.orders]}));
                }
                this.$router.push({name: 'refund', query: {status: this.info.type}});
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../../assets/public";

    .refund-info1 {
        padding: 0 rem(15);
        line-height: rem(55);
        font-size: rem(14);
        color: #333333;
        background-color: #ffffff;
        padding-bottom: rem(10);
        .fail {
            padding: rem(15) 0;
            font-size: rem(14);
            color: #333333;
            span:last-of-type {
                color: #999999;
            }
        }
        .intro {
            font-size: rem(14);
            line-height: rem(20);
            color: #999999;
        }
        .btn{
            margin-bottom: 0;
        }
        .btns{
          line-height: normal;
        }
    }

    .refund-info2 {
        background-color: #ffffff;
        font-size: rem(14);
        color: #333333;
        .status {
            text-indent: rem(15);
            line-height: rem(50);
            border-bottom: 1px solid $border;
        }
        .fail {
            padding: rem(15) 0 0 rem(15);
            font-size: rem(14);
            color: #333333;
            span:last-of-type {
                color: #999999;
            }
        }
        .address {
            font-size: rem(13);
            color: #999999;
            text-indent: rem(15);
            background-color: #F1F4F3;
            p {
                line-height: rem(33);
                height: rem(33);
            }
        }
        .intro {
            padding: rem(15);
            font-size: rem(14);
            color: #999;
        }
        .btns {
            margin-right: rem(15);
        }
        .logistics {
            border-top: 1px solid $border;
            .log-title {
                font-weight: bold;
                text-indent: rem(15);
                height: rem(40);
                line-height: rem(40);
                font-size: rem(14);
                color: #333333;
            }
            .info {
                text-indent: rem(15);
                line-height: rem(28);
                span:last-of-type {
                    color: #BBBBBB;
                }
            }
        }
    }

    .refund-money {
        .small {
            font-size: rem(12);
            color: #999999;
        }
        background-color: #ffffff;
        margin-top: rem(10);
        color: #333333;
        .total {
            box-sizing: border-box;
            margin: 0 rem(15);
            font-size: rem(15);
            height: rem(51);
            @extend %flex-align-center;
            @extend %flex;
            @extend %justify-content-space-between;
            border-bottom: 1px solid $border;
        }
        .item {
            font-size: rem(14);
            @extend .total;
            border: none;
            height: rem(35);
            line-height: rem(35);
        }
    }

    .remark {
        background-color: #ffffff;
        margin-top: rem(10);
        padding: rem(15) 0;
        font-size: rem(14);
        color: #333;
        @extend %flex;
        .label {
            text-align: right;
            width: rem(57);
        }
        .value {
            flex: 1;
            color: #999999;
        }
    }

    .after-sale {
        height: rem(44);
        background-color: #ffffff;
        margin-top: rem(10);
        padding: 0 rem(15);
        color: #333333;
        font-size: rem(14);
        font-weight: bold;
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-space-between;
    }

    .refund-order-info {
        margin-top: rem(10);
        background-color: #ffffff;
        .title {
            font-weight: bold;
            text-indent: rem(15);
            height: rem(40);
            line-height: rem(40);
            font-size: rem(14);
            color: #333333;
        }
        .info {
            margin: rem(10) rem(10) 0 rem(15);
            font-size: rem(13);
            color: #333333;
            .value {
                color: #BBBBBB;
            }
        }
        padding-bottom: rem(10);
    }

    .btns {
        overflow: hidden;
       padding: rem(5) 0 ;
        &::after {
            display: inline-block;
            content: '';
            clear: both;
        }
    }

    .btn {
        margin: 0 rem(5);
        border-radius: rem(13);
        padding: 0 rem(10);
        border: 1px solid #999999;
        float: right;
        height: rem(26);
        line-height: rem(26);
        font-size: rem(11);
        color: #333333;
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
</style>