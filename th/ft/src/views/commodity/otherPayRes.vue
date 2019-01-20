<template>
    <div>
        <header>
            <img class="head" :src="data.avatar" alt="">
            <div class="info">
                <p class="nikeName">{{data.nickname}}</p>
                <p>“我在火兔商城相中了好货，快帮人家付款吧！ 我会感谢你的！”</p>
            </div>
        </header>
        <section class="money">
            <p class="tip">代付金额</p>
            <p>¥{{data.customerAmount}}</p>
        </section>
        <section class="info">
            <p class="tip">代付订单信息</p>
            <p class="intro">代付交易—{{data.productTitle}}</p>
            <p class="info-money">¥{{data.customerAmount}}</p>
        </section>
        <section class="pay-type">
            <p class="type-tip">您可以通过以下支付方式完成代付</p>
            <div class="pay-type-select">
                <div  :class="{active: payType === 'WXP'}" @click="payType='WXP'">
                    <img src="../../assets/img/pay/icon/wxPay.png" alt="">
                    <p>微信</p>
                </div>
                <div :class="{active: payType === 'ALP'}" @click="payType='ALP'">
                    <img src="../../assets/img/pay/icon/aliPay.png" alt="">
                    <p>支付宝</p>
                </div>
                <div :class="{active: payType === 'HTP'}" @click="payType='HTP'">
                    <img src="../../assets/img/pay/icon/htPay.png" alt="">
                    <p>本地货币</p>
                </div>
            </div>
        </section>
        <p class="instructions">
            代付说明：<br/>1.付款前请您务必和好友再次确认，避免遇到诈骗行为。 <br/>
            2.付款前请务必核实订单信息及代付金额，避免出错。
        </p>
        <div class="btn" @click="pay">慷慨付款</div>
    </div>
</template>

<script>

    import { getPayInfo2, getAnotherPaySignature } from "../../service/pay/pay.service";

    export default {
        name: "other-pay-res",
        data: function () {
            return {
                id: '',
                data: {},
                payType:  'WXP'
            }
        },
        activated: function () {
            this.id = this.$route.params.id;
            this.getInfo();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getInfo: function () {
                getPayInfo2({id: this.id}).then(res => {
                    if(res.status === '0'){
                        this.data = res.data;
                    }
                })
            },
            pay: function () {
                if(this.payType === 'HTP'){
                    this.$router.push({name: 'pay', query: {OrderId: this.id, type: 'df'}});
                    return;
                }
                getAnotherPaySignature({paymentsId: this.id, load: true, payType: this.payType}).then(res => {
                    if(res.status === '0'){
                        location.href = res.data;
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    header {
        height: rem(85);
        background-color: $them;
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-center;
        img.head {
            margin-right: rem(15);
            width: rem(58);
            height: rem(58);
            border-radius: 50%;
        }
        .info {
            color: #ffffff;
            font-size: rem(13);
            .nikeName{
                font-size: rem(18);
            }
            width: rem(267);
        }

    }
    .tip{
        font-size: rem(18);
        margin: rem(16) 0 0;
        text-align: center;
        color: #333333;
    }
    .money{
        overflow: hidden;
        height: rem(102);
        background-color: #ffffff;
        font-size: rem(30);
        color: #333333;
        text-align: center;
        p:last-of-type{
            margin-top: rem(5);
        }
    }
    section.info{
        margin-top: rem(15);
        overflow: hidden;
        background-color: #ffffff;
        .intro{
            margin: rem(14) auto 0;
            width: rem(335);
            font-size: rem(14);
            color: #666666;
        }
        .info-money{
            margin-top: rem(5);
            margin-left: rem(20);
            margin-bottom: rem(15);
            font-size: rem(14);
            color: #333333;
        }
    }

    .pay-type{
        margin-top: rem(15);
        text-align: center;
        background-color: #ffffff;
        overflow: hidden;
        .type-tip{
            margin-top: rem(15);
            font-size: rem(18);
            color: #333333;
        }
        .pay-type-select{
            margin-top: rem(10);
            @extend %flex-align-center;
            @extend %flex;
            @extend %justify-content-center;
            text-align: center;
            font-size: rem(13);
            color: #333333;
            & > div{
                width: rem(64);
                height: rem(64);
                box-sizing: border-box;
                margin: 0 rem(15) rem(10);
                padding-top: rem(6);
            }
            div.active {
                border: 1px solid $them;
                position: relative;
                &::after{
                    content: '';
                    position: absolute;
                    right: rem(-9);
                    top: rem(-9);
                    width: rem(18);
                    height: rem(18);
                    background: url("../../assets/img/pay/select1.png") no-repeat center;
                    background-size: 100% 100%;
                }
            }
            img{
                margin: 0 auto rem(3);
                width: rem(30);
                height: rem(30);
                display: block;
            }
        }
    }
    .instructions{
        margin: rem(15) rem(20);
        font-size:rem(13);
        color:rgba(102,102,102,1);
        line-height:rem(18);
    }

    .btn{
        margin: rem(32) auto;
        @include btn( rem(48), #ffffff, rem(18));
        background-color: $them;
        width:rem(325);
        border-radius:rem(24);
    }
</style>