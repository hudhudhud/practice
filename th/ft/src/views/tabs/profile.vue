<template>
    <div id='mine'>
        <div class="profile" v-if="rank > 0">
            <header class="header" :class="roles[rank]">
                <!--<i class="iconfont icon-set-up" @click="showInfo=1"></i>-->
                <div class="content">
                    <div @click.stop="linkTo('myGrowth')">
                        <img class="head-img" :src="mineInfo.avatar" alt="" >
                        <p class="CustomerRank">{{CustomerRank}}</p>
                    </div>
                    <div class="content-center">
                        <div>
                            <div class="nickName">
                                <span>{{mineInfo.nickname}}</span>
                                <div class="role-img" :class="roles[rank]+'-img'"> </div>
                            </div>
                            <p class="code">会员号：{{mineInfo.customerNumber}}</p>
                        </div>
                        <div class="qr-code" @click.stop="showQrCode(1)">
                            <i class="iconfont icon-Qr-code"></i>
                        </div>
                        <!--{{CustomerRank}}-->
                    </div>

                </div>
            </header>
            <div class="block" style="position: relative;z-index: 10">
                <div class="total">
                    <div @click="linkTo('dataList', {type: 0, value: newData.shopOrders, lc:'次'})">
                        <p>{{newData.shopOrders}}</p>
                        <p>店主服务</p>
                    </div>
                    <div @click="linkTo('dataList', {type: 1, value: newData.productOrders, lc:'单'})">
                        <p>{{newData.productOrders}}</p>
                        <p>商品订单</p>
                    </div>
                    <div @click="linkTo('dataList', {type: 2, value: newData.thisMonthSales})">
                        <p>{{newData.thisMonthSales}}</p>
                        <p>本月销售</p>
                    </div>
                    <div @click="linkTo('performance')">
                        <p>{{newData.totalSales}}</p>
                        <p>累计销售</p>
                    </div>
                </div>
                <div class="total-tip" v-if="teamSales">
                    {{teamSales.targetQuantity<=teamSales.completionQuantity?'恭喜您，本月销售指标已完成！':('已销售'+teamSales.completionQuantity+'元，距离'+teamSales.targetQuantity+'元还差'+teamSales.unfinishedQuantity+'元')}}
                </div>
            </div>
            <div class="block invite-box">
                <div class="invite" @click="showQrCode(0.1)"></div>
                <div class="invite" @click="goToUpgrade"></div>
            </div>
            <div class="block account-assets">
                <p class="title">资产</p>
                <div class="icons">
                    <div @click="linkTo('profit')">
                        <img src="../../assets/img/profile/ass1.png" alt="">
                        <span>收益</span>
                    </div>
                    <div @click="linkTo('ucurrency')">
                        <img src="../../assets/img/profile/ass2.png" alt="">
                        <span>U币</span>
                    </div>
                    <div @click="linkTo('integralDetail')">
                        <img src="../../assets/img/profile/ass3.png" alt="">
                        <span>积分</span>
                    </div>
                    <div @click="linkTo('eka')">
                        <img src="../../assets/img/profile/ass4.png" alt="">
                        <span>火兔E卡</span>
                    </div>
                    <div @click="linkTo('option')">
                        <img src="../../assets/img/profile/ass5.png" alt="">
                        <span>期权</span>
                    </div>
                </div>
            </div>
            <div class="block program">
                <p class="title">应用</p>
                <div class="icons">
                    <div @click="linkTo('mineItem')">
                        <img src="../../assets/img/profile/icons/p1.png" alt="">
                        <span>我的客户</span>
                    </div>
                    <div @click.stop="linkTo('myGrowth')">
                        <img src="../../assets/img/profile/icons/p2.png" alt="">
                        <span>合作伙伴</span>
                    </div>
                    <div @click="linkTo('collection')">
                        <img src="../../assets/img/profile/icons/p3.png" alt="">
                        <span>我的收藏</span>
                    </div>
                    <div @click='ServicerClick'>
                        <img src="../../assets/img/profile/icons/p4.png" alt="">
                        <span>销售订单</span>
                    </div>
                    <div>
                        <a href="https://m.weike.fm/liveroom/24126337">
                            <img src="../../assets/img/profile/icons/p5.png" alt="">
                            <span>学习分享</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="block order">
                <p class="title" @click="myOrder(0)">
                    <span>我的订单</span>
                    <i class="iconfont icon-shuangjiantou"></i>
                </p>
                <div class="icons">
                    <div @click="myOrder(1)">
                        <img src="../../assets/img/profile/icons/o1.png" alt="">
                        <span>待支付</span>
                    </div>
                    <div @click="myOrder(2)">
                        <img src="../../assets/img/profile/icons/o2.png" alt="">
                        <span>待发货</span>
                    </div>
                    <div @click="myOrder(3)">
                        <img src="../../assets/img/profile/icons/o3.png" alt="">
                        <span>待收货</span>
                    </div>
                    <div @click="myOrder(6)">
                        <img src="../../assets/img/profile/icons/o4.png" alt="">
                        <span>已收货</span>
                    </div>
                    <div @click="$router.push({name: 'orderAfterSaleList'})">
                        <img src="../../assets/img/order/status/sale.png" alt="">
                        <span>售后</span>
                    </div>
                </div>
                <div class="order-tip">
                    <span style="width: 100%">亲爱的火兔店主，已累计为您节省<span class="them">{{saveMoney.saveMoney}}元</span></span>
                </div>
            </div>
            <div class="block action-list cell-group">
                <div class="cell" @click="linkTo('addressList')">
                    <span><img src="../../assets/img/profile/set/address.png"/>收货地址管理</span>
                    <i class="iconfont icon-right"></i>
                </div>
                <div class="cell" @click="linkTo('bankInfo')">
                    <span><img src="../../assets/img/profile/set/bankCard.png"/>银行卡管理</span>
                    <i class="iconfont icon-right"></i>
                </div>
                <div class="cell" @click="linkTo('userSet')">
                    <span><img src="../../assets/img/profile/set/user.png"/>帐号设置</span>
                    <i class="iconfont icon-right"></i>
                </div>
            </div>
        </div>
        <div class="member" v-if="rank == 0">
            <div class="member-header">
                <div class="head" @click='MyUserClick'>
                    <img class="head-img" :src="mineInfo.avatar" alt="">
                    <span class="role">{{CustomerRank}}</span>
                </div>
                <div class="intro">
                    <p class="nickName">{{mineInfo.nickname}}</p>
                    <p>{{mineInfo.customerNumber}}</p>
                </div>

                <!--<div class="member-set" @click="showInfo=1">设置</div>-->
            </div>
            <div class="my-order first" @click="myOrder(0)">
                <span>我的订单</span>
                <span>查看全部<i class="iconfont icon-right"></i></span>
            </div>
            <div class="order-group">
                <div @click="myOrder(1)">
                    <div class="badge" v-if="countList[0]">{{countList[0]}}</div>
                    <img src="../../assets/img/order/status/status.png" alt="">
                    <span>待支付</span>
                </div>
                <div @click="myOrder(2)">
                    <div class="badge" v-if="countList[1]">{{countList[1]}}</div>
                    <img src="../../assets/img/order/status/status1.png" alt="">
                    <span>待发货</span>
                </div>
                <div @click="myOrder(3)">
                    <div class="badge" v-if="countList[2]">{{countList[2]}}</div>
                    <img src="../../assets/img/order/status/status2.png" alt="">
                    <span>待收货</span>
                </div>
                <div @click="myOrder(6)">
                    <div class="badge" v-if="countList[3]">{{countList[3]}}</div>
                    <img src="../../assets/img/order/status/status4.png" alt="">
                    <span>已收货</span>
                </div>
                <!--<div @click="myOrder(5)">-->
                    <!--<div class="badge" v-if="countList[4]">{{countList[4]}}</div>-->
                    <!--<img src="../../assets/img/order/status/status5.png" alt="">-->
                    <!--<span>交易关闭</span>-->
                <!--</div>-->
                <div @click="$router.push({name: 'orderAfterSaleList'})">
                    <img src="../../assets/img/order/status/sale.png" alt="">
                    <span>售后</span>
                </div>
            </div>
            <div class="order-tip">
                <span>成为火兔店主，可省<span class="them">{{saveMoney.saveMoney}}元</span></span>
                <div class="open-btn" @click="$router.push({name: 'upgradeVip', query: {type:1}})">开通店主</div>
            </div>
            <div class="my-order">
                <span>我的钱包</span>
            </div>
            <div class="order-group money">
                <div @click="linkTo('ucurrency')">
                    <img src="../../assets/img/profile/ass2.png" alt="">
                    <span>U币</span>
                </div>
                <div @click="linkTo('vault')">
                    <img src="../../assets/img/profile/ass1.png" alt="">
                    <span>余额</span>
                </div>
                <div @click="linkTo('integralDetail')">
                    <img src="../../assets/img/profile/ass3.png" alt="">
                    <span>积分</span>
                </div>
                <div>
                    <img src="../../assets/img/profile/ass11.png" alt="">
                    <span>优惠券</span>
                </div>
            </div>
            <div class="cell-group">
                <div class="cell" @click="linkTo('collection')">
                    <span><img src="../../assets/images2/own_icon_shoucang.png"/>我的收藏</span>
                    <i class="iconfont icon-right"></i>
                </div>
                <div class="cell" @click="linkTo('addressList')">
                    <span><img src="../../assets/img/profile/set/address.png"/>收货地址管理</span>
                    <i class="iconfont icon-right"></i>
                </div>
                <div class="cell" @click="linkTo('bankInfo')">
                    <span><img src="../../assets/img/profile/set/bankCard.png"/>银行卡管理</span>
                    <i class="iconfont icon-right"></i>
                </div>

                <div class="cell" @click="linkTo('certification')">
                    <span><img src="../../assets/img/profile/set/user.png"/>实名认证</span>
                    <i class="iconfont icon-right"></i>
                </div>
                <div class="cell" @click="linkTo('userSet')">
                    <span><img src="../../assets/img/profile/set/user.png"/>帐号设置</span>
                    <i class="iconfont icon-right"></i>
                </div>

                <!--<div class="cell" >-->
                <!--<span><img src="../../assets/img/profile/set/help.png"/>帮助中心</span>-->
                <!--<i class="iconfont icon-right"></i>-->
                <!--</div>-->
                <!--<div class="cell" >-->
                <!--<span><img src="../../assets/img/profile/set/forWe.png"/>关于火兔</span>-->
                <!--<i class="iconfont icon-right"></i>-->
                <!--</div>-->
            </div>
        </div>
        <f-w></f-w>
    </div>
</template>

<script>
    import {MessageBox} from 'mint-ui';
    import Shareselfinfo from '@/components/global/shareselfinfo.vue'
    import {findTeamSales, getSaveMoney, newProfileData} from "../../service/profile/newProfile";
    import {
        findAmountByCustomer,
        findCountByCustomer,
        getCustomer,
        getOrderCount,
        loginOut
    } from '../../service/profile.service'
    import {getRank} from "../../service/home.service";

    export default {
        name: "profile",

        data: function () {
            return {
                newsList: [],//通知
                //  UserInfo:[],//用户信息
                mineInfo: [],//我的信息
                CountByCustomer: null,//今日订单量
                AmountByCustomer: null,//今日销售额
                CustomerRank: null,//会员
                logintype: true,
                showInfo: 0, // 0初始 1显示  2隐藏
                rank: null,
                countList: {},
                newData: {},
                teamSales: null,
                saveMoney: {}
            }
        },
        conpotents:{
            Shareselfinfo
        },
        activated: function () {
            this.setTitle('我的');
            this.onRead();
            this.rank = +this.UserInfo.rank;
            this.getOrderCount();
            this.getTotalData();
            this.getTeamSales();
            this.getSaveMoney();
        },
        deactivated: function () {
            this.showInfo = 0;
        },
        methods: {
            goToUpgrade: function () {
                this.$router.push({name: 'upgradeVip', query: {type: 1}, params: {share: 1}})
            },
            getOrderCount: async function () {
                if (Number(this.rank) > 0) {
                    return;
                }
                const res = await getOrderCount();
                if (res.status === '0') {
                    res.data.list.map(i => {
                        this.countList[i.status] = i.count;
                        return i;
                    });
                }
            },
            /**
             * 改版 后 我的页面 获取数据
             * @returns {Promise<void>}
             */
            getTotalData: async function () {
                const res = await newProfileData();
                if (res.status === '0') {
                    this.newData = res.data;
                }
            },
            /**
             * 获得 省了多少钱
             * */
            getSaveMoney: async function(){
                const {status, data} = await getSaveMoney();
                if (status === '0') {
                    this.saveMoney = data;
                }
            },
            /**
             * 获得团队指标
             * @returns {Promise<void>}
             */
            getTeamSales: async function () {
                const {status, data} = await findTeamSales();
                if (status === '0') {
                    this.teamSales = data[0];
                }
            },
            showQrCode: function (type) {
                this.$store.commit('handleShowCode', type);
                this.$emit('canvasToImageFun',"1");
                // this.canvasToImage();//父组件canvas转图片的方法
            },
            hideInfo: function () {
                this.showInfo = 2;
                setTimeout(() => {
                    this.showInfo = 0;
                }, 300)
            },
            linkTo(name) {
                if (arguments[1]) {
                    this.$router.push({name: name, query: arguments[1]});
                } else {
                    this.$router.push({name: name});
                }
            },

            myOrder: function (orderType) {
                this.$router.push({name: 'personalOrder', params: {orderType: orderType || '0'}});
            },
            GetRequest: function () {
                return this.$route.query;
            },

            wdqbClick: function () {
                this.linkTo('balance');

            },

            ServicerClick: function () {
                this.linkTo('orderList')

            },

            accountSecurityClick: function () {
                const that = this;
                top.location = '../accountSecurity/accountSecurity.html';
            },

            MyUserClick: function () {
                this.linkTo('userSet')
            },

            onRead: function (num) {
                const that = this
                if (localStorage.UserInfo) {
                    getCustomer().then(
                        res => {
                            if (res.status === '0') {
                                that.mineInfo = res;
                                that.$store.commit('login', {...that.UserInfo, headImgUrl: that.mineInfo.avatar})
                            }
                        }
                    );
                    //是否会员
                    getRank().then(
                        res => {
                            if (res.status === '0') {
                                that.CustomerRank = res.data.rankName;
                                that.rank = res.data.rank;
                                that.$store.commit('login', {...that.UserInfo, rank: that.rank})
                            }
                        }
                    );
                    //今日订单量
                    // findCountByCustomer().then(
                    //     res => {
                    //         if (res.status === '0') {
                    //             that.CountByCustomer = res.data;
                    //         }
                    //     }
                    // );


                    //今日销售额
                    // findAmountByCustomer().then(
                    //     res => {
                    //         if (res.status === '0') {
                    //             that.AmountByCustomer = res.data;
                    //         }
                    //     }
                    // );
                } else {
                    that.logintype = false;
                }

            },

        },
        computed: {
            UserInfo() {
                return this.$store.state.userInfo;
            },
            roles() {
                return this.$store.state.STATIC_DATA.rolesCode;
            }
        }
    }
</script>
<style lang="scss">
    @import "../../assets/public.scss";

    @each $role in member, shop, shop1, shop2, shop3, shop4, shop5 {
        .header.#{$role} {
            background: url("../../assets/img/profile/background/#{$role}.png") no-repeat bottom;
            background-size: 100% 100%;
        }
        .#{$role}-img {
            width: rem(27);
            height: rem(27);
            background: url("../../assets/img/profile/shop/#{$role}.png") no-repeat bottom;
            background-size: 100% 100%;
        }
        .#{$role}-img-d {
            width: rem(27);
            height: rem(27);
            background: url("../../assets/img/profile/shop/#{$role}_d.png") no-repeat bottom;
            background-size: 100% 100%;
        }
    }
    .header {
        position: relative;
        top: rem(66);
        margin-top: rem(-66);
        .head-img {
            display: block;
            margin: 0 auto;
            border-radius: 50%;
            width: rem(49);
            height: rem(49);
        }
        height: rem(164);
        //   background-color: $them;

        overflow: hidden;
        .icon-set-up {
            position: absolute;
            top: rem(10);
            right: rem(13);
            font-size: rem(21);
            color: #ffffff;
        }
        .content {
            //  height: rem(80);
            color: #ffffff;
            margin-top: rem(7);
            @extend %flex;
            @extend %justify-content-center;
            .content-center {
                .code{
                    color: rgba(255,255,255,.6);
                    white-space: nowrap;
                }
                width: rem(190);
                padding: 0 rem(10);
                @extend %flex;
                @extend %flex-align-center;
                font-size: rem(11);
                .nickName {
                    margin-bottom: rem(10);
                    font-size: rem(15);
                    & > * {
                        vertical-align: middle;
                    }
                }
            }
            .qr-code {
                margin-left: rem(15);
                display: inline-block;
                .icon-Qr-code {
                    font-size: rem(21);
                    color: #ffffff;
                }
            }
        }
    }

    .header.util {
        top: rem(80);
        margin-top: rem(-80);
        .content {
            margin-top: rem(17);
            .content-center {
                margin-left: rem(15);
            }
        }

        .rank {
            border-radius: rem(9);
            display: inline-block;
            padding: 0 rem(10);
            height: rem(17);
            line-height: rem(17);
            background-color: #ffffff;
            color: $them;
        }
    }

    .top-time {
        padding: 0 rem(23) rem(10);
        & > * {
            vertical-align: middle;
        }
        img {
            margin-right: rem(7);
            width: rem(23);
            height: rem(23);
        }
        color: #999999;
        font-size: rem(14);
    }

    .top-time.right {
        text-align: right;
    }

    #picker, .performance {
        .picker-slot-center:nth-of-type(3) {
            display: none;
        }
    }

</style>
<style scoped lang="scss">
    @import "../../assets/animation.scss";
    @import "../../assets/public.scss";
    .role-img{
        display: inline-block;
        width: rem(27);
        height: rem(27);
    }

    .order-tip{
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-center;
        height: rem(50);
        color: #666666;
        font-size: rem(12);
        background-color: #ffffff;
        position: relative;
        ::after{
            content: '';
            position: absolute;
            width: 90%;
            top: 0;
            left: 5%;
            border-top: 1px solid $border;
        }
        padding: 0 rem(15);
        .open-btn{
            margin-left: rem(27);
            border-radius: rem(14);
            display: inline-block;
            padding: 0 rem(15);
            height: rem(27);
            line-height: rem(27);
            font-size: rem(14);
            color: #ffffff;
            @include gradientToRight(#FFC026,#F87B22)
        }
    }
    /*会员*/
    .member-header {
        position: relative;
        @extend %flex;
        @extend %flex-align-center;
        font-size: rem(11);
        height: rem(130);
      //  background-color: #ffffff;
        background: url("../../assets/img/profile/vip_level/member.png") no-repeat;
        background-size: 100% 100%;
        text-align: center;
        color: #ffffff;
        .head {
            margin: 0 rem(22);
            text-align: center;
            .role {
                display: inline-block;
                background-color: #FFECEC;
                padding: 0 rem(15);
                height: rem(20);
                line-height: rem(20);
                border-radius: rem(89);
                color: $them;
            }
        }
        .intro {
            text-align: left;
            font-size: rem(12);

            .nickName {
                margin-bottom: rem(8);
                font-size: rem(17);
            }
        }
        .head-img {
            border-radius: 50%;
            margin: 0 auto;
            display: block;
            width: rem(58);
            height: rem(58);
            margin-bottom: rem(10);
        }
        .member-set {
            position: absolute;
            right: rem(12);
            top: rem(20);
            font-size: rem(15);
            color: #333;
        }
    }

    .my-order {
        margin-top: rem(10);
        background-color: #ffffff;
        padding: 0 rem(14);
        @extend %flex;
        @extend %justify-content-space-between;
        @extend %flex-align-center;
        height: rem(40);
        line-height: rem(40);
        color: #666666;
        font-size: rem(14);
        border-bottom: 1px solid $border;
    }

    .my-order.first {
        margin-top: rem(20);
    }

    .money.order-group {
        & > div {
            margin: rem(10) rem(25);
        }
    }

    .order-group {
        background-color: white;
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-center;
        text-align: center;
        & > div {
            position: relative;
            margin: rem(10) rem(16);
            white-space: nowrap;
        }
        img {
            margin: 0 auto rem(10);
            width: rem(25);
            height: rem(25);
            display: block;
        }
        .badge {
            position: absolute;
            right: 0;
            top: 0;
            height: rem(14);
            line-height: rem(14);
            width: rem(14);
            border-radius: 50%;
            text-align: center;
            font-size: rem(10);
            color: #ffffff;
            background-color: #FF6666;
        }
    }

    .cell-group.action-list {
        .cell {
            padding-left: rem(17);
        }
    }

    .cell-group {
        margin-top: rem(10);
        .cell {
            padding: 0 rem(16) 0 rem(30);
            border-bottom: 1px solid $border;
            height: rem(44);
            background-color: #ffffff;
            @extend %flex;
            @extend %justify-content-space-between;
            @extend %flex-align-center;
            font-size: rem(12);
            color: #666666;
            img {
                vertical-align: text-top;
                margin-right: rem(6);
                width: rem(20);
                height: rem(20);
            }
            .iconfont {
                color: #C0C0C0;
                font-size: rem(11);
            }
        }
    }

    /*不是会员*/
    .CustomerRank {
        margin: rem(9) auto 0;
        height: rem(17);
        line-height: rem(17);
        font-size: rem(12);
        padding: 0 rem(10);
        min-width: rem(60);
    //    border: 1px solid #F5A623;
        border-radius: rem(10);
        color: #ffffff;
        font-weight: bold;
        text-align: center;
        white-space: nowrap;
        background-color: rgba(0,0,0,.15);
        .iconfont {
            font-size: rem(10);
        }
    }

    .block {
        overflow: hidden;
        border-radius: 5px;
        margin: 0 rem(11) rem(10);
        background-color: #ffffff;
    }

    // 统计页面
    .total {
        margin-top: rem(21);
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-center;
        font-size: rem(11);
        color: #999999;
        text-align: center;
        padding-bottom: rem(10);
        p:first-of-type {
            margin-bottom: rem(9);
            font-size: rem(14);
            color: #333333;
            font-weight: bold;
        }
        div {
            flex: 1;
        }
    }

    .total-tip {
        text-indent: rem(15);
        height: rem(33);
        line-height: rem(33);
        font-size: rem(11);
        color: $them;
        background-color: #ffffff;
    }

    .invite-box {
        margin-bottom: 0;
        background-color: transparent;
        @extend %flex;
        @extend %justify-content-space-between;
        .invite {
            border-radius: 5px;
            width: rem(173);
            height: rem(76);
        }
        .invite:first-of-type {
            background: url("../../assets/img/profile/inviteMember.png") no-repeat center;
            background-size: 100% 100%;
        }
        .invite:last-of-type {
            background: url("../../assets/img/profile/inviteShop.png") no-repeat center;
            background-size: 100% 100%;
        }
    }

    .account-assets {
        .title {
            line-height: rem(37);
            font-size: rem(15);
            color: #333333;
            text-indent: rem(14);
            font-weight: bold;
            border-bottom: 1px solid $border;
        }
        .icons {
            @extend %flex;
            @extend %flex-align-center;
            @extend %justify-content-center;
            padding: rem(18) 0;
            text-align: center;
            font-size: rem(12);
            & > div {
                flex: 1;
            }
            img {
                margin: 0 auto rem(8);
                display: block;
                width: rem(18);
                height: rem(18);
            }
            a {
                color: #666666 !important;
                text-decoration: none;
            }
        }
    }

    .program {
        @extend .account-assets;
        .icons img {
            width: rem(23);
            height: rem(23);
            margin-bottom: rem(7);
        }
        color: #666666;
    }

    .order {
        @extend .program;
        .title {
            position: relative;
            .iconfont {
                position: absolute;
                right: rem(10);
                color: #999999;
            }
        }
    }

    /*旧 我的页面  店主*/
    /*  .card {
          position: relative;
       //   top: rem(-14);
          z-index: 99;
          margin: 0 rem(10);
          background: #FFFFFF;
          border-radius: rem(13);
          box-shadow: 0px 2px 4px 0px #999999;
          font-size: 0;
          padding-top: rem(14);
      }

      .profile-item {
          display: inline-block;
          box-sizing: border-box;
          margin-bottom: rem(9);
          width: 33.3%;
          font-size: rem(13);
          color: #666666;
          text-align: center;
          img {
              margin: 0 auto;
              display: block;
              width: rem(44);
              height: rem(44);
          }
          span {
              margin-top: 3px;
          }
      }

      .data {
          @extend %flex;
          font-size: rem(13);
          text-align: center;
          margin-top: rem(20);
          color: #333333;
          & > div {
              position: relative;
              margin-top: rem(5);
              padding-bottom: rem(15);
              flex: 1;
          }
          .value {
              margin-top: 5px;
              font-size: rem(30);
              color: #FF6666;
          }
          & > div:first-of-type::after {
              content: '';
              position: absolute;
              height: rem(59);
              border-right: 1px solid lighten(gainsboro, 5%);
              right: 0;
              top: calc(50% - .7rem);
              @include translate(0, -50%);
          }
      }*/

    .mine {
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    /*弹出层*/
    .tanchuceng {
        width: 100%;
        /*background: #A6A6A6;*/
        z-index: 999999;
        display: flex;
        position: absolute;
        flex-direction: row;
    }

    .hide {
        animation: .3s hide ease-out;
        animation-fill-mode: forwards;
    }

    .show {
        animation: .3s toRight ease-out;
        animation-fill-mode: forwards;
    }

    .tanchuceng_left {
        position: absolute;
        top: 0;
        left: 0;
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-image: url("../../assets/images/sidebar.png");
        background-position: top;
        justify-content: center;
        align-items: center;
        z-index: 100001;
    }

    .tanchuceng_left_content {
        width: 100%;
        height: 80%;
        display: flex;
        flex-direction: column;
    }

    .touxiang {
        width: 100%;
        height: 30%;
        display: flex;
        flex-direction: column;
    }

    .touxiang_one {
        width: 100%;
        height: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .touxiang_one_img {
        width: 24%;
        height: 100%;
        margin-bottom: -21%;
        margin-left: 23%;
        border-radius: 50%;
    }

    .touxiang_two {
        width: 100%;
        height: 75%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .touxiang_two_img {
        width: 43%;
        height: 78%;
        border-radius: 50%;
    }

    .name {
        width: 100%;
        height: 15%;
        display: flex;
        flex-direction: column;
    }

    .name_one {
        width: 100%;
        height: 40%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: rem(15);
        color: #ffffff;
    }

    .name_two {
        width: 100%;
        height: 60%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .name_two_span {
        padding: 0 rem(15);
        height: rem(24);
        font-size: rem(11);
        border-radius: 89px;
        color: #ffffff;
        background: #FF6666;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .guanli {
        width: 100%;
        height: 32%;
        display: flex;
        flex-direction: column;
    }

    .guanli_one {
        width: 100%;
        height: 33.33%;
        display: flex;
        flex-direction: row;
    }

    .guanli_one_left {
        width: 36%;
        height: 100%;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
    }

    .guanli_one_left_img {
        width: 30%;
        height: 32%;
    }

    .guanli_one_right {
        width: 60%;
        height: 100%;
        display: flex;
        align-items: center;
        color: #ffffff;
        font-size: 18px;
        margin-left: 3%;
    }

    .guanli_two {
        width: 100%;
        height: 33.33%;
        display: flex;
        flex-direction: row;
    }

    .guanli_two_left {
        width: 40%;
        height: 100%;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
    }

    .guanli_two_left_img {
        width: 30%;
        height: 32%;
    }

    .guanli_two_right {
        width: 60%;
        height: 100%;
        display: flex;
        align-items: center;
        color: #ffffff;
        font-size: 18px;
        margin-left: 3%;
    }

    .guanli_three {
        width: 100%;
        height: 33.33%;
        display: flex;
        flex-direction: row;
    }

    .guanli_three_left {
        width: 40%;
        height: 100%;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
    }

    .guanli_three_left_img {
        width: 30%;
        height: 32%;
    }

    .guanli_three_right {
        width: 60%;
        height: 100%;
        display: flex;
        align-items: center;
        color: #ffffff;
        font-size: 18px;
        margin-left: 3%;
    }

    .tuichu {
        width: 100%;
        height: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .tuichu_four {
        width: 50%;
        height: 66%;
        background: #FF6666;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        border-radius: 8px;
    }

    .tanchuceng_right {
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
    }

    .mine_top_one_top_two_content-right-two-span {
        font-size: rem(11);
        color: #ffffff;
    }


</style>