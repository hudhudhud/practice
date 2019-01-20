<template>
    <div>
        <header>
            <p>￥{{data.sumDelayAmount}}</p>
            <p>总冻结金额</p>
        </header>
        <!--   <div class="list">
               <p class="title">积分</p>
               <p class="intro" @click.stop="tip(1)">可提现积分总额 <span class="radio" >?</span></p>
               <p class="count">￥3303</p>
               <i class="iconfont icon-right"></i>
           </div>-->
        <div class="list" @click="routerTo('cashDepositList')">
            <p class="title">保证金 <span class="tip">三个月可提现</span></p>

            <p class="count">￥{{data.cashDepositAmount}}</p>
            <i class="iconfont icon-right"></i>
        </div>
        <div class="list" @click="routerTo('worldBonus')">
            <p class="title">创业基金</p>
            <p class="intro">分红奖励总额<span class="radio" @click.stop="tip(2)">?</span></p>
            <p class="count">￥{{data.frozenAmount}}</p>
            <i class="iconfont icon-right"></i>
        </div>
        <div class="list">
            <p class="title">待发放奖励</p>
            <p class="count">￥{{data.awardAmount}}</p>
        </div>
    </div>
</template>

<script>
    import {getForzenAccount} from '../../../../service/profile.service'
    import {getSumDelayAmount} from "../../../../service/profile/newProfile";

    export default {
        name: "frozenList",
        data: function () {
            return {
                promiseAccount: 0,//保证金
                dividendAmount: 0,//创业基金
                money: 0,
                data: {}
            }
        },
        activated: function () {
            this.money = this.$route.query.money;
            this.getData();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getData: async function () {
                getSumDelayAmount().then(res=>{
                    if(res.status === '0'){
                        this.data = res.data;
                        this.promiseAccount = res.data.cashDepositAmount;
                        this.dividendAmount = res.data.frozenAmount;
                    }
                });
            },
            routerTo: function (name) {
                if(name === 'worldBonus'){
                    this.$router.push({name: name, query: {money: this.dividendAmount}});
                }else{
                    this.$router.push({name: name});
                }

            },
            tip: function (type) {
                switch (type) {
                    case 1:
                        this.confirm('积分的月提现额度=团队月总业绩量*10%\n\n该积分额度进行实时结算！', '', {
                            confirmButtonText: '我知道了',
                            showCancelBtn: false
                        })
                        break;
                    case 2:
                        this.confirm('二星店主满2000可提现\n\n三星店主满3000可提现\n\n三星钻石店主满10000可提现\n\n三星皇冠店主满10000可提现', '', {
                            confirmButtonText: '我知道了',
                            showCancelBtn: false
                        })
                        break;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../../assets/public";

    header {
        overflow: hidden;
        height: rem(114);
        color: #ffffff;
        font-size: rem(13);
        text-align: center;
        background-color: $them;
        p:first-of-type {
            margin: rem(27) 0 rem(5);
            font-size: rem(30);
        }
    }

    .list {
        &:first-of-type {
            margin-top: rem(16);
        }
        border-bottom: 1px solid $border;
        position: relative;
        padding: rem(18) rem(21);
        font-size: rem(15);
        color: #333333;
        background-color: #ffffff;
        p {
            margin-bottom: rem(5);
        }
        .iconfont {
            position: absolute;
            right: rem(36);
            top: rem(20);
            color: #C0C0C0;
        }
        .intro {
            font-size: rem(12);
            color: #999999;
        }
        .count {
            font-size: rem(19);
        }
    }

    .tip {
        margin-left: rem(11);
        padding: 0 rem(7);
        background-color: lighten($them, 40%);
        border-radius: rem(9);
        font-size: rem(12);
        color: $them;
    }

    .radio {
        display: inline-block;
        margin-left: rem(5);
        vertical-align: middle;
        width: rem(15);
        height: rem(15);
        line-height: rem(15);
        border-radius: 50%;
        font-size: rem(11);
        text-align: center;
        color: #ffffff;
        background-color: $them;
    }
</style>