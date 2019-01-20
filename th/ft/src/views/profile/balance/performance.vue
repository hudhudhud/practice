<template>
    <div class="performance">
        <header class="header util" :class="rolesCode[UserInfo.rank]">
            <div class="content">
                <div>
                    <img class="head-img" :src="UserInfo.headImgUrl" alt="" >
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

        <div class="performance-jinri">
            <p>今日业绩</p>
            <div class="performance-particulars">
                <div>
                    <span>{{jinri.todayShops}}</span>
                    <p>店主服务</p>
                </div>
                <div>
                    <span>{{jinri.todayProducts}}</span>
                    <p>商品订单</p>
                </div>
                <div>
                    <span>{{jinri.todaySales}}</span>
                    <p>销售额</p>
                </div>
                <div>
                    <span>{{jinri.todayProfit}}</span>
                    <p>收益</p>
                </div>
            </div>
        </div>
        <p class="top-time" @click="openPicker">
            <img src="../../../assets/img/profile/time.png" alt="">
            <span>{{monthText}}</span>
        </p>
        <div class="card">
            <div class="item"  @click="linkTo('dataList', {time: monthText, type: 0, value: monthData.monthShops,lc:'次'})">
                <span>店主服务</span>
                <span>{{monthData.monthShops}}次<i class="iconfont icon-right"></i></span>
            </div>
            <div class="item" @click="linkTo('dataList', {time: monthText, type: 1, value: monthData.monthProducts, lc:'单'})">
                <span>商品订单</span>
                <span>{{monthData.monthProducts}}单<i class="iconfont icon-right"></i></span>
            </div>
            <div class="item" @click="linkTo('dataList', {time: monthText, type: 2, value: monthData.monthSales})">
                <span>销售额</span>
                <span>{{monthData.monthSales}}<i class="iconfont icon-right"></i></span>
            </div>
            <div class="item">
                <span>收益</span>
                <span>{{monthData.monthProfit}}</span>
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
    import {getTodayPerformance,getMonthPerformance} from '../../../service/profile/newProfile'
    import UserComponent from '../../../components/userComponent'
    import {formatDate} from '../../../service/util'
    export default {
        name: "performance",
        data:function(){
            return {
                jinri:{},
                month: new Date(),
                monthValue: new Date(),
                monthData: {},
            }
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        components:{
            UserComponent
        },
        activated:function(){
            this.getTodayPerformance();
            this.getMonthPerformance();
        },
        methods:{
            getTodayPerformance:async function () {
                const res = await getTodayPerformance();
                if(res.status === '0'){
                    this.jinri = res.data
                }
            },
            getMonthPerformance:async function(load){
                const res = await getMonthPerformance({time: formatDate(this.monthValue, 'yyyy-MM'), load: load});
                if(res.status === '0'){
                    this.monthData = res.data;
                }
            },
            handleConfirm: function(time){
                this.monthValue = time;
                this.getMonthPerformance('load');
            },
            openPicker() {
                this.$refs.picker.open();
            },
            linkTo() {
                if (arguments[1]) {
                    this.$router.push({name: arguments[0], query: arguments[1]});
                } else {
                    this.$router.push({name: arguments[0]});
                }
            },
            formatDate: function () {
               return formatDate(...arguments);
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
    @import "../../../assets/public";
    @import "../../../assets/animation";
    .performance{
    }
    .performance-title{
        height: rem(43);
        line-height: rem(43);
        text-align: center;
        font-size: rem(18);
        color: #333333;
        background: #ffffff;
    }
    .performance-jinri{
        position: relative;
        z-index: 5;
        border-radius: rem(5);
        margin: 0 rem(10);
        background: #fff;
        margin-bottom: rem(17);
        >p{
            height: rem(35);
            line-height: rem(35);
            font-size: rem(15);
            color: #333333;
            text-indent: rem(20);
            font-weight: 500;
            border-bottom: 1px solid #F1F4F3;
        }
    }
    .performance-particulars{
        @extend %flex;
        div{
            flex: 1;
            text-align: center;
            height: rem(94);
            display: flex;
            flex-direction: column;
            @extend %justify-content-space-between;
            span{
                margin-top: rem(19);
                color: red;
                font-size: 14px;
            }
            p{
                margin-bottom: rem(30);
                font-size: 12px;
                color: #999999;
            }
        }
    }
    .card{
        margin: 0 rem(10);
        background-color: #ffffff;
        .item{
            border-bottom: 1px solid $border;
            height: rem(50);
            padding: 0 rem(35) 0 rem(30);
            font-size: rem(14);
            color: #666666;
            @extend %flex;
            @extend %flex-align-center;
            @extend %justify-content-space-between;
            .iconfont {
                margin-left: rem(6);
                color: #666666;
            }
        }
        .item:last-of-type{
            border-bottom: none;
        }
    }
</style>