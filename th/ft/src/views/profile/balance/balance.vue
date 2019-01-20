<template>
    <div id='wdqb'>


        <div class="income">
            <div class="incomeCss">
                <p class="today">今日收益</p>
                <p class="number">{{DailyEarnings}}</p>
            </div>
            <div class="line"></div>
            <div class="incomeCss">
                <p class="today">本月收益</p>
                <p class="number">{{MonthlyIncome}}</p>
            </div>
            <div class="line"></div>
              <div class="incomeCss">
                <p class="today">上月收益</p>
                <p class="number">{{beforeMonth}}</p>
            </div>
        </div>

        <div class="message">
            <div class="account-title">
                账户资产
            </div>
            <div class="totalAssets">
                <p class="zhzzc">待发放收益</p>
                <p class="number">{{daiMoney}}</p>
            </div>
        </div>

        <div class="type">
            <div class="typeCss" @click="linkTo('ucurrency')">
                <p class="text"><img src="../../../assets/images/U.png" style="width: 20px"/>&nbsp;<span>U币</span></p>
                <p class="number2">{{mineInfo.uCurrency}}</p>
            </div>
            <div class="typeCss xiaojinku" @click="linkTo('vault')">
                <p class="text"><img src="../../../assets/images/Vault.png" style="width: 20px"/>&nbsp;<span>余额</span></p>
                <p class="number2">{{mineInfo.coffers}}</p>
            </div>

        </div>
        <div class="type2">
            <div class="typeCss2 jifen" @click="linkTo('eka')">
                <p class="text"><img src="../../../assets/img/balance/e.png" width="20px"/>&nbsp;<span>火兔E卡 <span class="small them">(代金券)</span></span></p>
                <p class="number2">{{mineInfo.ecard}}</p>
            </div>
            <div class="typeCss2"></div>
        </div>

        <!--<div class="message">
            <div class="totalAssets" @click='bankCardClick' >
                <p class="zhzzc">银行卡管理</p>
                <img src="../../../assets/images/enter.png" style="width: 10px"/>
            </div>
        </div>-->
    </div>
</template>

<script>
    import {getAccount,getfindTodayEarnings,getMonthlyIncome,getBeforeMonth} from '../../../service/pay/pay.service'
    export default {
        name: "balance",
        data: function () {
            return {
                newsList:[],//通知
                UserInfo:[],//用户信息
                mineInfo:[],//我的信息
                CountByCustomer:null,//今日订单量
                AmountByCustomer:null,//今日销售额
                CustomerRank:'',//会员
                DailyEarnings:0,//日收益
                MonthlyIncome:0,//本月收益
                beforeMonth: 0,//上月收益
                daiMoney: 0
            }
        },
        activated: function () {
            this.getAccount();
            this.getfindTodayEarnings();
            this.getMonthlyIncome();
            this.getBeforeMonth();
            this.getDaiMoney();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods:{

            linkTo(name){
                this.$router.push({name: name});
            },
            GetRequest :function () {
                return this.$route.query;
            },

            wdqbClick:function(){
                const that=this;

                location.href='../wdqb/wdqb.html';

            },

            ServicerClick:function(){
                const that=this;

                location.href='../mineServicer/mineServicer.html';

            },

            getAccount:async function () {
                const res = await getAccount();
                if(res.status === '0'){
                    this.mineInfo = res.data;
                }
            },
            getfindTodayEarnings:async function () {
                const res = await getfindTodayEarnings();
                if(res.status === '0'){
                    this.DailyEarnings = res.data;
                }
            },
            getMonthlyIncome:async function () {
                const res = await getMonthlyIncome({id: 1});
                if(res.status === '0'){
                    this.MonthlyIncome = res.data;
                }
            },
            getBeforeMonth:async function () {
                const res = await getMonthlyIncome({id: 0});
                if(res.status === '0'){
                    this.beforeMonth = res.data;
                }
            },
            getDaiMoney:async function () {
                const res = await getMonthlyIncome({id: 2});
                if(res.status === '0'){
                    this.daiMoney = res.data;
                }
            },
            bankCardClick:function(){
               this.linkTo('bankInfo');
            },

        },
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";
    .account-title{
        height: rem(61);
        line-height: rem(61);
        font-size: rem(18);
        color: #333333;
        font-weight: bold;
        text-indent: rem(10);
        border-bottom: 1px solid $border;
    }
    .income{
        background: #fff;
        display:flex;
        justify-content: space-around;
        padding: 15px 15px 15px 15px;
    }
    .incomeCss{
        margin-top: 10px;
        margin-bottom: 10px;
        width: 50%;
        text-align: center;
        color: #333333;
    }
    .line{
        border:1px solid #F1F4F3;
    }
    .today{
        font-size:15px ;
        font-weight: 600;
    }
    .number{
        margin-top: 5px;
        font-size: 26px;
        color:#FF6666
    }

    .message{
        background: #fff;
        margin-top: 10px;
        border-bottom: 1px solid #F1F4F3;
    }
    .totalAssets{
        box-sizing: border-box;
        padding: 0 rem(10);
        line-height: 50px;
        display:flex;
        justify-content: space-between;
        align-items: center;
        color: #666;
    }
    .zhzzc{
        font-size: 16px;
        font-weight:900;
    }

    .type{
        background: #fff;
        display: flex;
        justify-content: center;
        text-align: center;


    }
    .type,.type2 {
        .text{
            font-size: rem(15);
            color: #333333;
            font-weight: bold;
            & > *{
                vertical-align: middle;
            }
        }
    }
    .small{
        font-size: rem(11);
    }
    .typeCss{
        border-right: 1px solid #F1F4F3;
        border-bottom:  1px solid #F1F4F3;
        width: 50%;
        margin: auto;
        padding: 40px 0px 40px 0px;
    }
    .type2{
        background: #fff;
        display: flex;
        justify-content: center;
        text-align: center;

    }
    .typeCss2{
        border-right: 1px solid #F1F4F3;
        width: 50%;
        margin: auto;
        padding: 30px 0px 30px 0px;
    }
    .number2{
        margin-top: 5px;
        font-size: 20px;
        color:#FF6666
    }

    .typeCss3{
        background:#fff;
        line-height: 50px;
        font-size: 15px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    }
    .manage{
        font-size: 16px;
    }

</style>