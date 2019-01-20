<template>
    <div>
        <header>
            <div>
                <p class="type">U币</p>
                <p class="balance">{{Number(balance).toFixed(2)}}</p>
            </div>
            <div class="recharge-btn" @click="recharge">充值</div>
        </header>
        <section>
            <p class="balance-detail">
                U币明细
            </p>
            <ListComponent :type="1" />

        </section>
    </div>
</template>

<script>
    import { getAccount } from '../../../service/pay/pay.service';

    import ListComponent from './list-component';
    export default {
        name: "ucurrency",
        data: function () {
            return {
                balance: 0
            }
        },
        components: {
            ListComponent
        },
        activated: function () {
            this.getAccount();
            console.log(this.$root.$children[0].$refs);
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getAccount: async function () {
                ({data: {uCurrency: this.balance}} = await getAccount());
            },
            recharge: function () {
                this.$router.push({name: 'recharge'})
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
            color: $them;
            font-weight: bold;
            background:#ffffff;
            border-radius: 2px;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.50);
        }
        .balance {
            font-size: rem(30);
        }
    }

    section {
        .balance-detail {
            font-weight: bold;
            padding: 0 rem(10);
            height: rem(57);
            line-height: rem(57);
            font-size: rem(15);
            color: #333333;
        }

    }
</style>