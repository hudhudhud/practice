<template>
    <div class="detail-page">
        <div class="detail">
            <img class="productImage" :src="detail.productImage" alt="">
            <div class="info">
                <div class="text">
                    <p class="title">{{detail.productTitle}}</p>
                    <p>{{detail.tagName}}</p>
                </div>
                <div class="price">
                    <p>¥{{detail.price}}</p>
                    <p>¥{{detail.marketPrice}}</p>
                    <p>x{{detail.quantity}}</p>
                </div>
            </div>
        </div>
        <div class="pos" v-if="update">
            <div @click="afterSale" v-if="(detail.canApplyRefundGoods||detail.afterSaleId)&&detail.settleType!==5">
                {{detail.afterSaleStatusStr||'申请售后'}}
            </div>
            <div v-if="[2,3,5].includes(detail.orderStatus)" @click="toLogistics">查看物流</div>
            <div v-if="detail.orderStatus===2" @click="handleConfirmReceipt">确认收货</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "shopDetail",
        props: ['detail', 'sale', 'update', 'order'],
        methods: {
            afterSale: function () {
                if (!this.detail.afterSaleId) {
                    localStorage.setItem('refund-data', JSON.stringify({...this.detail, detailListVos: [[this.detail]]}));
                    this.$router.push({name: 'refund', query: {status: 2}});
                } else {
                    this.$router.push({name: 'afterSaleInfo', query: {id: this.detail.afterSaleId}});
                }
            },
            toLogistics: function () {
                localStorage.setItem('logistics', JSON.stringify(this.detail));
                this.$router.push({name: 'logistics', query: {id: this.detail.id}});
            },
            handleConfirmReceipt: function () {
                this.$emit('order-confirm', this.detail.logisticsId);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .detail-page {
        padding-bottom: rem(15);
    }

    .pos {
        padding: rem(5) 0;
        &:after {
            content: '';
            width: 0;
            height: 0;
            display: block;
            clear: both;
        }
        div {
            height: rem(26);
            margin-right: rem(15);
            float: right;
            display: inline-block;
            padding: 0 rem(16);
            color: #333333;
            font-size: rem(11);
            line-height: rem(26);
            border-radius: rem(13);
            border: 1px solid #999999;
        }
    }

    .detail {
        position: relative;
        // height: rem(134);
        padding: rem(15);
        padding-bottom: 0;
        box-sizing: border-box;
        background-color: #ffffff;
        @extend %flex;
        @extend %justify-content-center;
    }

    .productImage {
        width: rem(78);
        height: rem(78);
    }

    .info {
        flex: 1;
        @extend %flex;
        .text {
            margin-left: rem(10);
            width: rem(205);
            font-size: rem(13);
            color: #BBBBBB;
            .title {
                font-size: rem(13);
                color: #333333;
                margin-bottom: rem(4);
            }
        }
        .price {
            text-align: right;
            flex: 1;
            font-size: rem(13);
            color: #BBBBBB;
            p:first-of-type {
                color: #333333;
            }
            p:nth-of-type(2) {
                text-decoration: line-through;
            }
        }
    }
</style>