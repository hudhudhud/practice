<template>
    <div>
        <div class="top">
            <p class="title">保证金明细</p>
            <table>
                <thead>
                <tr>
                    <th>日期</th>
                    <th>金额(元)</th>
                    <th>提现日期</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in data">
                    <td>{{item.day}}</td>
                    <td>{{item.number}}</td>
                    <td>{{getDay(item.day)}}</td>
                </tr>
                <tr v-if="!data.length">
                    <td colspan="3">无数据</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="bottom">
            <p class="title">保证金提现规则</p>
            <p class="intro">保证金可提现，每个月的保证金可在三个月提现，提现的金额直接转至“可提现金额”！</p>
        </div>
    </div>
</template>

<script>
    import { findCashDepositList } from '@/service/balance.service'

    export default {
        name: "ash-deposit-list",
        activated: function () {
            this.getData();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        data: function () {
            return {
                data: []
            }
        },
        methods: {
            getData: async function () {
                const res = await findCashDepositList();
                if (res.status === '0') {
                    this.data = res.data;
                }
            },
            getDay: function (day) {
                let date = new Date(day);
                date.setMonth(date.getMonth()+4);
                return date.toLocaleDateString().replace(/\//g,'-');
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../../assets/public";

    .top {
        background-color: #ffffff;
        padding-bottom: rem(36);
        .title {
            height: rem(57);
            line-height: rem(57);
            font-size: rem(18);
            text-align: center;
            color: #333333;
            font-weight: bold;
        }

        table {
            border: 1px solid $border;
            margin: 0 auto;
            width: rem(337);
            text-align: center;
            tbody {
                td{
                    border-top: 1px solid $border;
                }
            }
            th,td {
                &:last-of-type{
                    border-right: 0;
                }
                border-right: 1px solid $border;
            }
            tr {
                height: rem(42);
            }
        }
    }

    .bottom {
        margin-top: rem(15);
        padding-bottom: rem(108);
        background-color: #ffffff;
        font-size: rem(18);
        color: #333333;
        text-align: center;
        .title {
            line-height: rem(60);
            font-weight: bold;
        }
        .intro {
            padding: 0 rem(40);
            font-size: rem(14);
            color: #666666;
            text-align: left;
        }
    }


</style>