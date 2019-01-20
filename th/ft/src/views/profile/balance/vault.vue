<template>
    <div>
        <header>
            <div>
                <p class="type">余额（元）</p>
                <p class="balance">{{Number(balance).toFixed(2)}}</p>

            </div>
            <div class="withdrawal-btn" @click="withdrawal">提现</div>
            <!--<div class="recharge-btn">充值</div>-->
        </header>
       <!-- <section>

            <div class="top">
                <div>
                    <p class="withdrawal-title">金库分布</p>
                    <p class="withdrawal-text">可提现金额</p>
                    <p class="bold">{{Number(balance).toFixed(2)}}</p>
                </div>

            </div>
            <div class="bottom" @click="frozenList">
                <div>
                    <p class="margin">
                        <span>冻结金额</span>
                        <span class="tip">三个月可提现</span>
                    </p>
                    <p class="bold">{{CashDepositSum}}</p>
                </div>
                <i class="iconfont icon-right"></i>
            </div>
        </section>-->
        <p class="balance-detail">
            余额明细
        </p>
        <ListComponent :type="3"/>
    </div>
</template>

<script>
    import { getAccount } from '../../../service/pay/pay.service';
    import ListComponent from './list-component';
    import { findCashDepositSum } from "../../../service/profile.service";

    export default {
        name: "vault",
        components: {
            ListComponent
        },
        data: function () {
            return {
                balance: 0,
                CashDepositSum: 0
            }
        },
        activated: function () {
            this.getAccount();
            this.findCashDepositSum();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getAccount: async function () {
                ({data: {coffers: this.balance}} = await getAccount());
            },
            findCashDepositSum: async function () {
                ({data: this.CashDepositSum} = await findCashDepositSum());
            },
            withdrawal: function () {
                this.$router.push({name: 'withdrawal'})
            },
            frozenList: function () {
                this.$router.push({name: 'frozenList', query: {money: this.CashDepositSum}})
            }
        }

    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    header {
        height: rem(114);
        background: url("../../../assets/img/profile/top_back.png") no-repeat;
        background-size: 100% 100%;
        @extend %flex;
        @extend %justify-content-space-between;
        @extend %flex-align-center;
        font-size: rem(16);
        padding: 0 rem(38) 0 rem(30);
        color: #ffffff;
        .type {
            font-size: rem(15);
            margin-bottom: 3px;
        }
        .recharge-btn {
            padding: 0 rem(20);
            height: rem(30);
            line-height: rem(30);
            background: $them;
            border-radius: 2px;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.50);
        }
        .balance {
            font-size: rem(30);
        }
        .withdrawal-btn {
            float: right;
            border-radius: 3px;
            height: rem(25);
            line-height: rem(25);
            padding: 0 rem(20);
            color: $them;
            background-color: #fff;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
        }
    }

    .bold {
        font-weight: bold;
    }

    section {
        margin-top: rem(15);
        background-color: #ffffff;
        font-size: rem(16);
        color: #333333;
        .top {
            padding: 0 rem(23);
            height: rem(106);
            border-bottom: 1px solid lighten(gainsboro, 5%);
            @extend %flex;
            @extend %flex-align-center;
            @extend %justify-content-space-between;
        }
        .withdrawal-title {
            margin-bottom: rem(15);
            font-size: rem(15);
            border-left: 3px solid $them;
            text-indent: 5px;
            font-weight: 600;
        }
        .withdrawal-text {
            margin-bottom: rem(4);
            color: #666666;
            font-size: rem(14);
        }

        .bottom {
            padding: 0 rem(23);
            height: rem(71);
            @extend %flex;
            @extend %justify-content-space-between;
            @extend %flex-align-center;
        }
        .margin {
            margin-bottom: rem(5);
            color: #666666;
            font-size: rem(14);
            .tip {
                margin-left: rem(11);
                padding: 0 rem(7);
                background-color: lighten($them, 40%);
                border-radius: rem(9);
                font-size: rem(12);
                color: $them;
            }
        }
    }

    .balance-detail {
        font-weight: bold;
        padding: 0 rem(10);
        height: rem(57);
        line-height: rem(57);
        font-size: rem(15);
        color: #333333;
    }

</style>