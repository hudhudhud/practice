<template>
    <div class="order-info">
        <img class="product-image" :src="detail.productImage" alt="">
        <div class="product-info">
            <p class="product-title">{{detail.productTitle}}</p>
            <p class="product-config">{{detail.tagInfo}}</p>
            <p class="product-price">
                <template v-if="detail.orderType===4">
                    <span>{{detail.marketPrice}}积分</span>
                    <span></span>
                </template>
                <template v-else>
                    <span>￥{{detail.price}}</span>
                    <span>{{detail.marketPrice}}</span>
                </template>
            </p>
            <div class="count" v-if="detail.quantity">x{{detail.quantity}}</div>
            <div class="time" v-if="detail.collectTime">{{detail.collectTime}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "shop",
        props: ['detail']
    }
</script>

<style scoped lang="scss">
    @import "../assets/public";
    .order-info{
        .time{
            color: #bbbbbb;
            font-size: rem(13);
            position: absolute;
            right: rem(10);
            bottom: 0;
        }
        @extend %flex;
        @extend %flex-align-center;
        border-bottom: 1px solid $border;
        .product-image{
            margin: rem(10);
            width: rem(80);
            height: rem(80);
        }
        .product-info{
            position: relative;
            font-size: rem(13);
            color: #333333;
            box-sizing: border-box;
            flex: 1;
            height: rem(80);
            padding-right: rem(10);
            .product-title{
                height: rem(40);
            }
            .product-config{
                color: #BBBBBB;
                font-size: rem(11);
                line-height: rem(11);
            }
            .product-price{
                margin-top: rem(10);
                color: $them;
                span:last-of-type{
                    margin-left: rem(10);
                    color: #BBBBBB;
                    text-decoration: line-through;
                }
            }
            .count {
                position: absolute;
                font-size: rem(13);
                color: #333333;
                right: rem(10);
                bottom: 0;
            }
        }
    }
</style>