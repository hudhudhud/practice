<template>
    <div>
        <header>
            <div>
                <p class="balance">￥{{mineInfo}}</p>
                <p class="type">消费积分</p>
            </div>
        </header>
        <section>
            <p class="balance-detail">
                积分明细
            </p>
            <ListComponent :type="7" />

        </section>
    </div>
</template>

<script>
    import {getIntegral} from '../../../service/pay/pay.service'
    import ListComponent from './list-component';
    export default {
        name: "usableIntegral",
        data: function () {
            return {
                balance: 0,
                mineInfo:0
            }
        },
        components: {
            ListComponent
        },
        activated: function () {
            this.getIntegral();
            console.log(this.$root.$children[0].$refs);
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getIntegral:async function () {
                const res = await getIntegral();
                if(res.status === '0'){
                    this.mineInfo = res.data.consumeIntegral;
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    header {
        height: rem(114);
        background-color: $them;
        @extend %flex;
        @extend %justify-content-space-between;
        @extend %flex-align-center;
        font-size: rem(16);
        padding: 0 rem(38) 0 rem(30);
        color: #ffffff;
        >div{
            width: 100%;
            text-align: center;
        }
        .type {
            font-size: rem(15);
            margin-bottom: 3px;
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