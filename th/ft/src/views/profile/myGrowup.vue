<template>
    <div class="page">
        <header>
            <img :src="img" alt="">
            <p>当前等级：{{roles[rank]}}</p>
        </header>
        <div class="upgrade">
            <div class="title" v-if="data.upgradeProgress2">第一种晋升类型</div>
            <div class="table">
                <div class="row">
                    <div class="col">晋升指标</div>
                    <div class="col">达成情况</div>
                </div>
                <div class="row" v-for="item in data.upgradeProgress">
                    <div class="col">{{item.conditionDesc}}</div>
                    <div class="col">
                        <div class="progress">
                            <span>{{item.finishInfo}}</span>
                            <span>{{item.remainInfo}}</span>
                            <div class="copy-progress" :style="{width: item.finishRate*100+'%'}">
                                <div class="content">
                                    <span>{{item.finishInfo}}</span>
                                    <span>{{item.remainInfo}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="upgrade" v-if="data.upgradeProgress2">
            <div class="title">第二种晋升类型</div>
            <div class="table">
                <div class="row">
                    <div class="col">晋升指标</div>
                    <div class="col">达成情况</div>
                </div>
                <div class="row" v-for="item in data.upgradeProgress2">
                    <div class="col">{{item.conditionDesc}}</div>
                    <div class="col">
                        <div class="progress">
                            <span>已有{{item.finishNum}}位</span>
                            <span>仅剩{{item.remainNum}}位</span>
                            <div class="copy-progress" :style="{width: item.finishRate*100+'%'}">
                                <div class="content">
                                    <span>已有{{item.finishNum}}位</span>
                                    <span>仅剩{{item.remainNum}}位</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ul class="tip">
            <h3>说明：</h3>
            <template v-if="rank ==1">
                <li>
                    1、第一种、第二种晋升类型只要满足 一条即可晋升，其中第一条晋升类型的两个条件必须同时满足；
                </li>
                <li>
                    2、达成情况，按照满足晋升的最低标准；
                </li>
                <li>
                    3、直推、间推分享业绩，次月清零；
                </li>
            </template>
            <template v-if="rank==2">
                <li>
                    1、以上条件必须同时满足；
                </li>
                <li>
                    2、达成情况，按照满足晋升的最低标准；
                </li>
                <li> 3、渠道内店主数 ，只显示已达标的店主数和未达标的
                    店主数量。
                </li>
            </template>
            <template v-if="rank==3">
                <li>
                    1、以上条件必须同时满足；
                </li>
                <li> 2、达成情况，按照满足晋升的最低标准；
                </li>
                <li>3、渠道内店主数 ，只显示已达标的店主数和未达标的
                    店主数量。
                </li>
            </template>
            <template v-if="rank==4">
                <li>
                    1、以上条件必须同时满足；
                </li>
                <li> 2、达成情况，按照满足晋升的最低标准；

                </li>
                <li> 3、渠道体系内店主数 ，只显示已达标的店主数和未达标的
                    店主数量。
                </li>
            </template>
            <template v-if="rank==5">
                <li>
                    1、以上条件必须同时满足；
                </li>
                <li>
                    2、达成情况，按照满足晋升的最低标准；
                </li>
                <li>
                    3、当月渠道销量1500万，当出现管理下属同时考
                    核三星皇冠店主时，计算其50%的业绩量
                </li>
            </template>
        </ul>
    </div>
</template>
<script>
    import {getUpgradeProgress} from "../../service/profile/newProfile";

    export default {
        name: 'myGrowup',
        data: function () {
            return {
                data: {},
                img: ''
            }
        },
        activated: function () {
            this.img = require('../../assets/img/profile/shopstart/start' + this.rank + '.png');
            this.setTitle('我的成长');
            this.getData();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getData: async function () {
                const res = await getUpgradeProgress();
                if (res.status === '0') {
                    this.data = res.data;
                }
            }
        },
        computed: {
            rank() {
                return +this.$store.state.userInfo.rank;
            },
            roles() {
                return this.$store.state.STATIC_DATA.roles;
            }
        }

    }
</script>
<style scoped lang="scss">
    @import "../../assets/public";

    .page {
        overflow-y: auto;
    }

    header {
        height: rem(170);
        background: url("../../assets/img/profile/shopstart/star_back .png") no-repeat center;
        background-size: 100% 100%;
        font-size: 0;
        text-align: center;
        img {
            margin: rem(10) 0;
            display: inline-block;
            width: rem(100);
            height: rem(100);
        }
        p {
            font-size: rem(15);
            color: #F5A623;
        }
    }

    .upgrade {
        .title {
            margin-top: rem(20);
            padding-left: rem(15);
            font-size: rem(12);
            color: #333333;
        }
        .table {
            margin-top: rem(25);
            text-align: center;
            font-size: rem(14);
            color: #666;
        }
        .row {
            margin-bottom: rem(20);
            @extend %flex;
            @extend %flex-align-center;
            .col {
                flex: 1;
            }
        }
        .progress {
            position: relative;
            box-sizing: border-box;
            border-radius: rem(6);
            width: rem(143);
            height: rem(12);
            background-color: #F5A623;
            font-size: rem(9);
            padding: 0 rem(10);
            color: #ffffff;
            @extend %inline-flex;
            @extend %flex-align-center;
            @extend %justify-content-space-between;
        }
        .copy-progress {
            .content {
                @extend .progress;
                background-color: #F8E71C;
                color: #CB8004;
            }
            position: absolute;
            left: 0;
            top: 0;
            width: 0;
            overflow: hidden;
            height: 100%;

        }
    }

    .tip {
        padding: 0 rem(30);
        color: #666;
        font-size: rem(12);
    }
</style>