<template>
    <div class="commodity-group">
        <div class="commodity-box" v-for='item in classify' @click='classifyProductClick(item.id)'>

            <div>
                <div class="commodity-img">
                    <div class="health_num_box" v-if="item.healthCount!=null && item.healthCount!=undefined">
                        <div class="health_num_box_ch1">{{item.healthCount!=null && item.healthCount!=undefined?item.healthCount:''}}</div>
                    </div>
                    <div class="new-shop" v-if="item.isNew">新品</div>
                    <img :src="item.mainImg+'@200w'" alt="">
                </div>
                <p class="commodity-title">{{item.title}}</p>
                <div class="activity_lable_box">
                    <div class="activity_e_card" v-if="item.useEcard"></div>
                    <div class="activity_limit_icon" v-if="item.isLimitedSale==1"></div>
                </div>
            </div>
            <div class="commodity-price" v-if="!hide">
                <template v-if="item.type!==4">
                    <p>
                        <span>￥</span>{{isShop?item.v1Price:item.v0Price}}
                    </p>
                    <p >
                        <span>￥</span>{{item.marketPrice}}
                    </p>
                    <div class="commodity-btn">立即购买</div>
                </template>
                <template v-else>
                    <p>{{item.v0Price}}<span>积分</span></p>
                    <p ><span>￥</span>{{Number(item.marketPrice).toFixed(2)}}</p>
                </template>


            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "shop",
        props: ['classify', 'hide', 'isNo'],
        methods: {
            classifyProductClick: function (id) {
                this.$router.push({name: 'commodityBuyerVip', query: {id: id}})
            }
        },
        computed: {
            isShop() {
                return this.$store.state.userInfo.rank&&this.$store.state.userInfo.rank>0;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .commodity-group {
        width: 100%;
        @extend %flex;
       @extend %flex-wrap;
        font-size: 0;
        .commodity-box {
            flex-direction: column;
            @extend %inline-flex;
            @extend %justify-content-space-between;
            border-bottom: 1px solid lighten(gainsboro, 10%);
            box-sizing: border-box;
            width: 50%;
            overflow: hidden;
            //  min-height: rem(270);
            vertical-align: middle;
            font-size: rem(13);
            padding-bottom: rem(10);

            .commodity-img {
                margin: rem(16) auto 4px;
                width: rem(150);
                height: rem(150);
                position: relative;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .eCard::before {
                margin-right: rem(5);
                content: '';
                vertical-align: sub;
                background: url("../../assets/img/balance/e.png") no-repeat center;
                background-size: 100% 100%;
                display: inline-block;
                text-align: center;
                width: rem(18);
                height: rem(18);
            }
            .commodity-title {
                margin: 0 rem(10);
                font-size: rem(13);
                color: #000000;
                line-height: rem(20);
                min-height: rem(26);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .commodity-price {
                position: relative;
                padding: 0 rem(10);
                p:nth-of-type(1) {
                    font-size: rem(18);
                    color: $them;
                    span {
                        font-size: rem(13);
                    }
                }
                p:nth-of-type(2) {
                    font-size: rem(13);
                    color: #999999;
                    text-decoration: line-through;
                }
                .commodity-btn {
                    position: absolute;
                    right: rem(10);
                    bottom: 0;
                    padding: 0 rem(10);
                    height: rem(26);
                    line-height: rem(26);
                    background-color: $them;
                    //  background-image: linear-gradient(-135deg, #FF4C76 0%, #FF3B56 100%);
                    border-radius: 2px;
                    font-size: rem(11);
                    text-align: center;
                    color: #FFFFFF;
                }
            }
            .new-shop{
                position: absolute;
                left: rem(-5);
                top: 0;
                width: rem(46);
                height: rem(25);
                line-height: rem(30);
                font-size: rem(13);
                text-indent: rem(6);
                color: #ffffff;
                background: url("../../assets/img/home/new_shop.png") no-repeat;
                background-size: 100% 100%;
            //    background-color: $them;

            }
        }
        .commodity-box:nth-of-type(2n+1) {
            border-right: 1px solid lighten(gainsboro, 10%);
        }
        .commodity-box:nth-of-type(1), .commodity-box:nth-of-type(2) {
            border-top: 1px solid lighten(gainsboro, 10%);
        }

    }
    .health_num_box{
        width: rem(28);
        height: rem(44);
        position: absolute;
        top: 0;
        right: rem(4);
        /*z-index: 0;*/
        background-image: url("../../assets/images/health_list_bg@2x.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        .health_num_box_ch1{
            color: #fff;
            text-align: center;
            font-size: rem(12);
        }
    }
    .activity_lable_box{
        display: flex;
        .activity_e_card{
            width: rem(18);
            height: rem(18);
            background-image: url("../../assets/img/balance/e.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;
            margin-left: rem(10);
        }
        .activity_limit_icon{
            width: rem(33);
            height: rem(13);
            background-image: url("../../assets/images/limit_time_icon@2x.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;
            margin-left: rem(10);
            align-self: flex-end;
        }
    }
</style>