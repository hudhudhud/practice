<template>
    <div>
        <div class="recharge">
            <p class="tip">充值金额</p>
            <div class="input">
                <i class="iconfont icon-money"></i>
                <input type="number" placeholder="输入充值金额" v-model.number="money">
            </div>
        </div>
        <div style="background-color: #ffffff;margin-top: 10px">
            <div class="pay-type">
                充值方式
            </div>
            <div class="pay-type" @click="payType=0">
                <div class="title">
                    <img src="../../../assets/images/Vault.png" alt="">
                    <span>余额</span>
                </div>
                <div class="check" :class="{active: payType===0}">
                </div>
            </div>
            <div class="pay-type" @click="payType=1">
                <div class="title">
                    <img src="../../../assets/images/WeChat.png" alt="">
                    <span>微信</span>
                </div>
                <div class="check" :class="{active: payType===1}"></div>
            </div>
            <div class="pay-type" @click="payType=2">
                <div class="title">
                    <i class="iconfont icon-umidd17" style="color:#00aaef;margin-right: 3px"></i>
                    <span>支付宝</span>
                </div>
                <div class="check" :class="{active: payType===2}"></div>
            </div>


        </div>
        <div class="btn" @click="recharge">
            充值
        </div>
        <PayPsw ref="psw"/>
    </div>
</template>

<script>
    import Check from '@/components/check'
    import {Toast} from 'mint-ui'
    import {depositByCoffers, getUPaySignature} from "../../../service/pay/pay.service";
    import PayPsw from '@/components/commodity/inputPsw'

    export default {
        name: "recharge",
        components: {
            Check,
            PayPsw
        },
        data: function () {
            return {
                payType: 1,
                money: ''
            }
        },
        methods: {
            recharge: async function () {
                if (this.money) {
                    let payType = '';
                    switch (this.payType) {
                        case 1:
                            payType = 'WXP';
                            break;
                        case 2:
                            payType = 'ALP';
                            break;
                        case 0:
                            const psw = await this.$refs.psw.getPayPsw();
                            const res = depositByCoffers({payPassword: hex_md5(psw), amount: this.money, load: true,successMsg: '充值成功'});
                            if(res.status === '0'){
                                setTimeout(() => {
                                    this.$router.back();
                                }, 2000);
                            }
                            return;
                    }
                    const res = await getUPaySignature({number: this.money, load: true, payType: payType});
                    if (res.status === '0') {
                        location.href = res.data;
                    }
                } else {
                    Toast('请输入正确的金额');
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    .recharge {
        background-color: #ffffff;
        .tip {
            padding: rem(15);
            color: #333333;
            font-size: rem(15);
        }
        .input {
            padding: rem(9) rem(15) rem(25);
            .iconfont {
                vertical-align: middle;
                font-size: rem(17);
                color: #333333;
            }
            input {
                vertical-align: middle;
                padding: 5px rem(10);
                margin-left: rem(10);
                font-size: rem(22);
            }

        }
    }

    .pay-type {
        margin: 0 rem(10);
        height: rem(46);
        font-size: rem(15);
        border-bottom: 1px solid $border;
        color: #333333;
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-space-between;
        img {
            margin-right: 5px;
            width: rem(18);
            height: rem(18);
        }
        .title > * {
            vertical-align: middle;
        }
    }

    .pay-type:last-of-type {
        border-bottom: none;
    }

    .check {
        width: rem(18);
        height: rem(18);
        background: url("../../../assets/images/unselect1.png") no-repeat center;
        background-size: 100% 100%;
    }

    .check.active {
        background: url("../../../assets/images/select1.png") no-repeat center;
        background-size: 100% 100%;
    }

    .btn {
        width: rem(325);
        margin: rem(90) auto;
        height: rem(43);
        line-height: rem(43);
        text-align: center;
        color: #ffffff;
        font-size: rem(18);
        background: $them;
        border-radius: rem(100);
    }
</style>