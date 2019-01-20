<template>
    <div class="page" style="background-color: #F1F4F3">
        <div class="title">
            需支付：{{allprice}}积分
        </div>
        <div class="type">
            <img src="../../assets/img/order/jif.png" alt="">
            <span>积分支付</span>
        </div>
        <div class="items">
            <div class="item" @click="active=1">
                <span>
                    消费积分（可用积分{{info.consumeIntegral}}）
                </span>
                <span>
                    <img class="icon" v-if="active===1" src="../../assets/images2/select1.png" alt="">
                    <img class="icon" v-else src="../../assets/images2/select1_hui.png" alt="">
                </span>
            </div>
            <div class="item" @click="active=2">
                <span>
                   提现积分（可用积分{{info.integral}}）
                </span>
                <span>
                    <img class="icon" v-if="active===2" src="../../assets/images2/select1.png" alt="">
                    <img class="icon" v-else src="../../assets/images2/select1_hui.png" alt="">
                </span>
            </div>
        </div>
        <div class="btn" @click="pay">确认支付</div>
        <PayPsw ref="psw"/>
    </div>
</template>

<script>
    import {getCustomerAmountByOrderId, getIntegral, payByLocalCurrency} from "../../service/pay/pay.service";
    import PayPsw from '@/components/commodity/inputPsw'

    export default {
        name: "pay-integral",
        components: {
            PayPsw
        },
        data: function () {
            return {
                id: '',
                allprice: '',
                active: 1,
                info: {}
            }
        },
        activated: function () {
            this.id = this.$route.query.orderId;
            this.getPrice();
            this.getIntegral();
        },
        methods: {
            getPrice: async function () {
                const res = await getCustomerAmountByOrderId({id: this.id});
                if (res.status === '0') {
                    this.allprice = parseInt(res.data.amount);
                }
            },
            getIntegral: async function () {
                const res = await getIntegral();
                if (res.status === '0') {
                    this.info = res.data;
                }
            },
            pay: async function () {
                const psw = await this.$refs.psw.getPayPsw();
                this.pswInput(psw);
            },
            pswInput: async function (payPsw) {
                let params = {
                    load: true, successMsg: '支付成功',
                    payPassword: hex_md5(payPsw),
                    id: this.id
                };
                if (this.active === 1) {
                    params.consumeIntegralCount = this.allprice;
                } else {
                    params.integralCount = this.allprice;
                }
                payByLocalCurrency(params).then(
                    res => {
                        if (res.status === '0') {
                            setTimeout(() => {
                                this.$router.replace({name: 'personalOrder', params: {orderType: 0}})
                            }, 2000);
                        } else if (res.status === '1' && res.msg === '请先设置您的支付密码！') {
                            this.notPayPsw();
                        }
                    }
                );

            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .title {
        padding: rem(30) rem(20);
        color: #333333;
        font-size: rem(25);
        font-weight: bold;
    }

    .type {
        img {
            margin-left: rem(26);
            vertical-align: middle;
            width: rem(18);
            height: rem(18);
        }
        span {
            margin-left: rem(7);
            vertical-align: middle;
            font-size: rem(12);
            color: #333333;
        }
    }

    .items {
        margin-top: rem(10);
        padding: 0 rem(15);
        .item {
            padding: 0 rem(11);
            @extend %flex-align-center;
            @extend %flex;
            @extend %justify-content-space-between;
            background-color: #ffffff;
            font-size: rem(12);
            color: #333333;
            height: rem(47);
        }
        .icon {
            width: rem(16);
            height: rem(16);
        }

    }

    .btn {
        position: absolute;
        bottom: rem(87);
        left: 50%;
        @include translate(-50%, 0);
        text-align: center;
        width: rem(325);
        height: rem(48);
        line-height: rem(48);
        border-radius: rem(24);
        font-size: rem(18);
        color: #ffffff;
        background-color: $them;
    }
</style>