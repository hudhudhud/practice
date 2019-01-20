<template>
    <div class="page" style="background-color: transparent">
        <div class="fixed">
            <header class="header util" :class="rolesCode[UserInfo.rank]">
                <div class="content">
                    <div>
                        <img class="head-img" :src="UserInfo.headImgUrl" alt="">
                        <!--<p class="CustomerRank">{{roles[UserInfo.rank]}}</p>-->
                    </div>
                    <div class="content-center">
                        <div>
                            <div class="nickName">
                                <span>{{UserInfo.nickname}}</span>
                            </div>
                            <div class="rank">{{roles[UserInfo.rank]}}</div>
                        </div>
                    </div>

                </div>
            </header>
            <div class="card" style="position: relative;z-index: 5;margin-top: 0">
                <div class="title">
                    <span class="text-left" style="border-left: none">我的收益</span>
                </div>
                <div class="table">
                    <div>
                        <p>{{total.sumAmount}}</p>
                        <p>总收益</p>
                    </div>
                    <div @click="linkTo('frozenList')">
                        <p>{{total.frozenAmount}}</p>
                        <p>待发放</p>
                    </div>
                    <div @click="linkTo('vault')">
                        <p>{{total.coffers}}</p>
                        <p>余额
                            <span class="tag">可提现</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!--本月收益-->
        <div class="card mar-top">
            <div class="title">
                <span class="text-left" style="border-color: #ED1BA7">本月收益</span>
            </div>
            <div class="list">
                <div class="item"
                     @click="linkTo('dataList', { type: 0, value: currentInfo1.serviceMoney})">
                    <span>店主服务</span>
                    <span>{{currentInfo1.serviceNum}}次</span>
                    <span>{{currentInfo1.serviceMoney}}</span>
                </div>
                <div class="item"
                     @click="linkTo('dataList', { type: 1,value:currentInfo1.simpleMoney})">
                    <span>商品订单</span>
                    <span>{{currentInfo1.simpleNum}}笔</span>
                    <span>{{currentInfo1.simpleMoney}}</span>
                </div>
            </div>
        </div>
        <!--上月收益-->
        <p class="top-time right" @click="openPicker">
            <img src="../../assets/img/profile/time.png" alt="">
            <span>{{monthText}}</span>
        </p>
        <div class="card">
            <div class="title">
                <span class="text-left" style="border-color: #771BED">月结收益</span>
                <div class="time" @click="checkShow">
                    <!--<span>10788.88</span>-->
                    <i class="iconfont icon-up" v-if="show"></i>
                    <i class="iconfont icon-down" v-else></i>
                </div>
            </div>
            <div class="show-box" :class="{hide: !show,h276: Number(UserInfo.rank)<4}">
                <div class="order">
                    <span>市场支持服务费</span>
                    <span>{{info.flage === '0'?'结算中':info.bazaar}}</span>
                </div>

                <div class="order">
                    <span>培训管理费</span>
                    <span>{{info.flage === '0'?'结算中':info.train}}</span>
                </div>
                <div class="order" v-if="Number(UserInfo.rank)>=4">
                    <span>岗位津贴</span>
                    <span>{{info.flage === '0'?'结算中':info.job}}</span>
                </div>
                <div class="order">
                    <span>创业基金</span>
                    <span>{{info.flage === '0'?'结算中':info.bonus}}</span>
                </div>
                <div class="order">
                    <span>商品消费奖励</span>
                    <span>{{info.flage === '0'?'结算中':info.pv}}</span>
                </div>
                <div class="order">
                    <span>积分冲抵</span>
                    <span>{{info.flage === '0'?'结算中':info.integral}}</span>
                </div>
                <div class="order">
                    <span>保证金</span>
                    <span>{{info.flage === '0'?'结算中':info.other}}</span>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="title">
                <span class="text-left" style="border-color: #ED1BA7">即时收益</span>
            </div>
            <div class="list">
                <div class="item"
                     @click="linkTo('dataList', {time: monthText, type: 0, value: info1.serviceMoney})">
                    <span>店主服务</span>
                    <span>{{info1.serviceNum}}次</span>
                    <span>{{info1.serviceMoney}}</span>
                </div>
                <div class="item"
                     @click="linkTo('dataList', {time: monthText, type: 1,value:info1.simpleMoney})">
                    <span>商品订单</span>
                    <span>{{info1.simpleNum}}笔</span>
                    <span>{{info1.simpleMoney}}</span>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="title">
                <span class="text-left" style="border-color: #1BD4ED">月总计收益</span>
                <div class="time">
                    <span>{{(Number(info.sum)+Number(info1.serviceMoney)+Number(info1.simpleMoney)).toFixed(2)}}</span>
                </div>
            </div>
            <div class="total-item">
                <span>转入余额</span>
                <span>{{(Number(info.sum)-Number(info.deposit)).toFixed(2)}}</span>
            </div>
            <div class="total-item">
                <span>待转入余额</span>
                <span>{{info.deposit}}</span>
            </div>
        </div>
        <mt-datetime-picker
                ref="picker"
                type="date"
                year-format="{value} 年"
                month-format="{value} 月"
                @confirm="handleConfirm"
                id="picker" v-model="month">
        </mt-datetime-picker>
    </div>
</template>

<script>
    // 收益
    import {formatDate} from "../../service/util";
    import * as service from '../../service/profile/newProfile'

    export default {
        name: "profit",
        data: function () {
            return {
                month: '',
                monthValue: '',
                total: {},
                show: true,
                info: {},
                info1: {},
                currentInfo1: {},
            }
        },
        activated: function () {
            let now = new Date();
            now.setMonth(now.getMonth() - 1);
            this.month = this.monthValue = now;
            this.getTotal();
            this.getCurrentMonthEarningsSummary();
            this.getMonthEarningsSummary();
            this.getMonthEarnings();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
            let now = new Date();
            now.setMonth(now.getMonth() - 1);
            this.month = this.monthValue = now;
        },
        methods: {
            getTotal: async function () {
                const res = await service.getTotal();
                if (res.status === '0') {
                    this.total = res.data;
                }
            },
            getMonthEarnings: function () {
                service.getMonthEarnings({time: formatDate(this.monthValue, 'yyyy-MM')}).then(
                    res => {
                        if (res.status === '0') {
                            this.info = res.data;
                        }
                    }
                );
            },
            /**
             * 获得当前 月份 收益
             */
            getCurrentMonthEarningsSummary: function () {
                service.getMonthEarningsSummary({time: formatDate(new Date(), 'yyyy-MM')}).then(
                    res => {
                        if (res.status === '0') {
                            this.currentInfo1 = res.data;
                        }
                    }
                );
            },
            getMonthEarningsSummary: function () {
                service.getMonthEarningsSummary({time: formatDate(this.monthValue, 'yyyy-MM')}).then(
                    res => {
                        if (res.status === '0') {
                            this.info1 = res.data;
                        }
                    }
                );
            },
            linkTo(name, query) {
                if (query) {
                    this.$router.push({name: name, query: query});
                } else {
                    this.$router.push({name: name});
                }
            },
            openPicker() {
                this.$refs.picker.open();
            },
            checkShow: function () {
                this.show = !this.show;
            },
            handleConfirm(e) {
                this.monthValue = e;
                this.getMonthEarningsSummary();
                this.getMonthEarnings();
                //   this.getTotal();
            }
        },
        computed: {
            UserInfo() {
                return this.$store.state.userInfo;
            },
            monthText() {
                return formatDate(this.monthValue, 'yyyy-MM');
            },
            roles() {
                return this.$store.state.STATIC_DATA.roles;
            },
            rolesCode() {
                return this.$store.state.STATIC_DATA.rolesCode;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .fixed {
        position: fixed;
        top: 0;
        left: 0;
        min-height: rem(240);
        width: 100%;
    }

    .fixed + .mar-top {
        margin-top: rem(240);
    }

    .card:first-of-type {
        margin-top: rem(10);
    }

    .show-box {
        height: rem(322);
        transition: height .3s ease-out;
        overflow: hidden;
    }

    .show-box.h276 {
        height: rem(276);
    }

    .show-box.hide {
        height: 0 !important;
    }

    .card {
        margin: 0 rem(10) rem(15);
        border-radius: 5px;
        background-color: #ffffff;
        .title {
            height: rem(41);
            border-bottom: 1px solid $border;
            @extend %flex;
            @extend %flex-align-center;
            @extend %justify-content-space-between;
        }
        .time {
            margin-right: rem(20);
            & > * {
                vertical-align: middle;
            }
            color: #999999;
            font-size: rem(14);
            img {
                width: rem(18);
                height: rem(18);
                margin-right: rem(5);
            }
            .iconfont {
                margin-left: rem(13);
            }
        }
        .text-left {
            height: rem(19);
            line-height: rem(19);
            color: #333333;
            font-weight: bold;
            text-indent: rem(16);
            font-size: rem(15);
            border-left: 4px solid $them;
        }
        .table {
            @extend %flex;
            @extend %flex-align-center;
            @extend %justify-content-center;
            text-align: center;
            & > div {
                margin: rem(20) rem(27);
            }
            p:first-of-type {
                font-size: rem(18);
                color: $them;
            }
            p:last-of-type {
                display: inline-block;
                position: relative;
                margin-top: rem(10);
                font-size: rem(14);
                color: #999999;
                white-space: nowrap;
            }
            .tag {
                position: absolute;
                top: 0;
                right: 0;
                @include translate(110%, -20%);
                border: 1px solid $them;
                font-size: rem(8);
                padding: 0 1px;
                color: $them;
            }
        }

        .list {
            .item {
                margin: 0 auto;
                width: rem(300);
                font-size: rem(14);
                color: #666;
                height: rem(46);
                line-height: rem(46);
                padding: 0 rem(30);
                @extend %flex;
                span {
                    flex: 1
                }
                span:nth-of-type(2) {
                    text-align: center;
                }
                span:last-of-type {
                    text-align: right;
                }
                // @extend %justify-content-space-between;
            }
            .item:nth-of-type(n+2) {
                border-top: 1px solid $border;
            }
        }

        .order {
            box-sizing: border-box;
            margin: 0 auto;
            border-bottom: 1px solid $border;
            height: rem(46);
            width: rem(319);
            padding-right: rem(35);
            color: #666;
            font-size: rem(14);
            @extend %flex;
            @extend %flex-align-center;
            @extend %justify-content-space-between;
        }
        .total-item {
            @extend .order;
            width: 100%;
            padding: 0 rem(36) 0 rem(20);
        }
    }

</style>