<template>
    <div id='indexPage' class="indexPage" @click="customerOpen=false">
        <Search />
        <div class="customer" :class="{open: customerOpen}" @click.stop="customerOpen=!customerOpen">
            <img src="../../assets/img/home/customer.png" alt="">
            <div class="text">
                <div class="cus-btn" @click.stop="handleCustomer(1)"></div>
                <div class="wx-btn" @click.stop="handleCustomer(0)"></div>
            </div>
        </div>
        <!--1-->
        <div class="indexPage-one">
            <div class="indexPage-one-top">
                <div class="wrapper">
                    <mt-swipe :auto="3000">
                        <mt-swipe-item v-for="(item, index) in wrapper" :key="index">
                            <a :href="item.url">
                                <img v-lazy="item.image" alt="">
                            </a>
                        </mt-swipe-item>
                    </mt-swipe>
                </div>
            </div>
            <div class="upgrade">
                <div class="upgrade-title">
                    <span>加盟服务</span>
                    <span>Upgrade services</span>
                </div>
                <div class="upgrade-wrapper">
                    <div class="upload-item" @click="toUpgradeVip(1)">
                        <img src="../../assets/img/vip/upgrade1.png" alt="">
                    </div>
                    <div class="upload-item" @click="toUpgradeVip(2)">
                        <img src="../../assets/img/vip/upgrade2.png" alt="">
                    </div>
                </div>
            </div>
        </div>
        <!--爆款单品-->
        <div class="welfare">
            <div class="welfare-title">
                <div class="text" style="color: #FFAFAF">爆款单品</div>
            </div>
            <div class="welfare-img-box" @click="handleClassify(5)">
                <img src="../../assets/img/order/baok.jpg" alt="">
            </div>
            <div class="welfare-shop-group">
                <div class="welfare-shop" v-for="item in baokShop" :key="item.id"
                     @click.stop="classifyProductClick(item.id)">
                    <div style="position: relative">
                        <div class="health_num_box" v-if="item.healthCount!=null && item.healthCount!=undefined">
                            <div class="health_num_box_ch1">{{item.healthCount!=null && item.healthCount!=undefined?item.healthCount:''}}</div>
                        </div>
                        <div class="new-shop" v-if="item.isNew">新品</div>
                        <img :src="item.mainImg+'@200w'" alt="">
                        <p class="welfare-name">{{item.title}}</p>
                        <div class="activity_lable_box">
                            <div class="activity_e_card" v-if="item.useEcard"></div>
                            <div class="activity_limit_icon" v-if="item.isLimitedSale==1"></div>
                        </div>
                    </div>
                    <div>
                        <p class="welfare-price">
                            <span class="them">￥{{isShop?item.v1Price:item.v0Price}}</span>
                            <span style=" text-decoration:line-through" v-if="item.discountPrice!==item.marketPrice">￥{{Number(item.marketPrice).toFixed(2)}}</span>
                        </p>
                        <!--<div class="btn" >
                            立即购买
                        </div>-->
                    </div>
                </div>
            </div>
        </div>
        <!--福利商品-->
        <div class="welfare" >
            <div class="welfare-title" >
                <div class="text" style="color: #FFAFAF">福利商城</div>
            </div>
            <div class="welfare-img-box" @click="handleClassify('3')">
                <img src="../../assets/img/order/welfare.jpg" alt="">
            </div>
            <div class="welfare-shop-group">
                <div class="welfare-shop" v-for="item in welfareList" :key="item.id"
                     @click.stop="classifyProductClick(item.id)">
                    <div style="position: relative">
                        <div class="health_num_box" v-if="item.healthCount!=null && item.healthCount!=undefined">
                            <div class="health_num_box_ch1">{{item.healthCount!=null && item.healthCount!=undefined?item.healthCount:''}}</div>
                        </div>
                        <div class="new-shop" v-if="item.isNew">新品</div>
                        <img :src="item.mainImg+'@200w'" alt="">
                        <p class="welfare-name">{{item.title}}</p>
                        <div class="activity_lable_box">
                            <div class="activity_e_card" v-if="item.useEcard"></div>
                            <div class="activity_limit_icon" v-if="item.isLimitedSale==1"></div>
                        </div>
                    </div>
                    <div>
                        <p class="welfare-price">
                            <span class="them">￥{{isShop?item.v1Price:item.v0Price}}</span>
                            <span style=" text-decoration:line-through" v-if="item.discountPrice!==item.marketPrice">￥{{Number(item.marketPrice).toFixed(2)}}</span>
                        </p>
                        <!--<div class="btn" >
                            立即购买
                        </div>-->
                    </div>
                </div>
            </div>
        </div>
        <!--积分商城-->
        <div class="welfare" >
            <div class="welfare-title">
                <div class="text" style="color: #FFD186">积分商城</div>
            </div>
            <div class="welfare-img-box" @click="handleClassify(4)">
                <img src="../../assets/img/product/jifen.jpg" alt="">
            </div>
            <div class="welfare-shop-group">
                <div class="welfare-shop" v-for="item in jifenShop" :key="item.id"
                     @click.stop="classifyProductClick(item.id)">
                    <div style="position: relative">
                        <div class="health_num_box" v-if="item.healthCount!=null && item.healthCount!=undefined">
                            <div class="health_num_box_ch1">{{item.healthCount!=null && item.healthCount!=undefined?item.healthCount:''}}</div>
                        </div>
                        <div class="new-shop" v-if="item.isNew">新品</div>
                        <img :src="item.mainImg+'@200w'" alt="">
                        <p class="welfare-name">{{item.title}}</p>
                        <div class="activity_lable_box">
                            <div class="activity_e_card" v-if="item.useEcard"></div>
                            <div class="activity_limit_icon" v-if="item.isLimitedSale==1"></div>
                        </div>
                    </div>
                    <div>
                        <p class="welfare-price">
                            <span class="them">{{parseInt(isShop?item.v1Price:item.v0Price)}}积分</span>
                            <span  style=" text-decoration:line-through">￥{{Number(item.marketPrice).toFixed(2)}}</span>
                        </p>
                        <!--<div class="btn" >
                            立即购买
                        </div>-->
                    </div>
                </div>
            </div>
        </div>
        <div v-if="guangaoShow" class="advertising_cover">
            <div class="advertising_box">
                <div class="guangao_chahao" @click="guangaoShow=false"></div>
                <img class="guangao_img" :src="guanggaoData.image" @click="imgUrlFun"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Search from '@/components/global/search'
    import {getBanner, findTypeList, findProductList, findLablePage,getOne} from "../../service/home.service";
    import {findWelfarePage} from '../../service/home/welfare.service'

    export default {
        name: "commodity",
        components: {
            Search
        },
        data: function () {
            return {
                wrapper: [], // bannaer 图
                welfareList: [],
                jifenShop: [],
                baokShop: [],
                customerOpen: false,
                guangaoShow:false,//广告显示
                guanggaoData:'',//广告图片数据
            }
        },
        created: function(){
            this.guangaoFun();
            this.getBanner();
            this.findLablePage();
            this.findWelfarePage();
            this.findJiFenPage();
        },
        activated: function () {
            this.customerOpen = false;
            this.setTitle('火兔商城');
            let that = this;
            window.onscroll = function () {
                that.customerOpen = false;
            }
        },
        deactivated: function(){

        },
        methods: {
            guangaoFun:function(){//广告弹窗显示与否
                if(window.sessionStorage.getItem("guanggaoShow") === "true"){
                    this.guangaoShow = false;
                }else{
                    getOne().then(
                        res => {
                            console.log(res)
                            if (res.status === '0') {
                                this.guanggaoData = res.data;
                                this.guangaoShow = true;
                                window.sessionStorage.setItem("guanggaoShow","true");
                            }
                        }
                    );
                }
            },
            imgUrlFun:function(){//链接跳转
                window.location.href = this.guanggaoData.url;
                this.guangaoShow = false;
            },
            handleCustomer: function (type) {
                if (type) {
                    window.location.href = "tel:4000658899";
                    this.customerOpen = false;
                } else {
                    this.$store.commit('handleWxCustomerShow', 1);
                }
            },
            toUpgradeVip: function (type) {
                this.$router.push({name: 'upgradeVip', query: {type: type}})
            },
            getBanner: function () {
                getBanner({id: '1'}).then(
                    res => {
                        if (res.status === '0') {
                            this.wrapper = res.data;
                        }
                    }
                );
            },
            // 爆款
            findLablePage: function () {
                findProductList({type: '5',  mainPushed: 1,pageNo: 1, pageSize: 6}).then(
                    res => {
                        if (res.status === '0') {
                            this.baokShop = res.data.list;
                        }
                    }
                );
            },
            // 福利
            findWelfarePage: function () {
                findProductList({type: '3', mainPushed: 1, pageNo: 1, pageSize: 6}).then(
                    res => {
                        if (res.status === '0') {
                            this.welfareList = res.data.list;
                        }
                    }
                );
            },
            // 积分
            findJiFenPage: function () {
                findProductList({type: '4', mainPushed: 1, pageNo: 1, pageSize: 6}).then(
                    res => {
                        if (res.status === '0') {
                            this.jifenShop = res.data.list;
                        }
                    }
                );
            },

            classifyProductClick: function (id) {
                // const that = this;
                // top.location = '../commodity_buyer_vip/commodity_buyer_vip.html?id=' + id;
                this.$router.push({name: 'commodityBuyerVip', query: {id: id}})
            },
            /**
             * 福利商品 分类
             */
            handleClassify: function (type) {
                this.$router.push('/home/classifyList?' + 'type=' + type);
            },

        },
        computed: {
            UserInfo() {
                return this.$store.state.userInfo;
            },
            isShop() {
                return this.$store.state.userInfo.rank&&this.$store.state.userInfo.rank>0;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    /* 升级服务*/
    .upgrade {
        margin-top: rem(10);
        background-color: white;
        .upgrade-title {
            margin: 0 rem(15);
            height: rem(40);
            line-height: rem(40);
            font-size: rem(18);
            color: #333333;
            span {
                vertical-align: middle;
            }
            span:last-of-type {
                margin-left: rem(5);
                font-size: rem(13);
                color: #999999;
            }

        }
        .upgrade-wrapper {
            margin: rem(15) 0;
            height: rem(100);
            padding: 0 rem(10);
            @extend %flex;
            @extend %flex-align-center;
            .upload-item {
                margin: 0 rem(10);
                img {
                    width: rem(160);
                }

            }
        }
    }

    .welfare {

        margin-top: rem(10);
        padding: rem(10);
        padding-top: 0;
        background-color: #ffffff;
        .welfare-title {
            height: rem(45);
            line-height: rem(45);
            text-align: center;
            & > * {
                vertical-align: middle;
            }
            &::before {
                vertical-align: middle;
                content: '';
                display: inline-block;
                width: rem(37);
                height: rem(18);
                background: url("../../assets/img/home/home_left.png") no-repeat center;
                background-size: 100% 100%;
            }
            &::after {
                @extend ::before;
                transform: matrix(-1, 0, 0, 1, 0, 0)
            }
            .text {
                margin: 0 rem(12);
                display: inline-block;
                color: #E028FF;
                font-size: rem(17);
                //  font-weight: bold;
            }
        }
        .title-img {
            border-radius: 5px;
            display: block;
            margin: 0 auto;
            width: rem(344);
            height: rem(120);
        }
        .welfare-img-box {
            position: relative;
            overflow: hidden;
            @extend .title-img;
            img {
                width: 100%;
                height: 100%;
            }
            &::after {
                content: '';
                width: rem(14);
                height: rem(14);
                position: absolute;
                background-color: #ffffff;
                left: 50%;
                bottom: rem(-7);
                -webkit-transform: translateX(-50%) rotate(45deg);
                -moz-transform: translateX(-50%) rotate(45deg);
                -ms-transform: translateX(-50%) rotate(45deg);
                -o-transform: translateX(-50%) rotate(45deg);
                transform: translateX(-50%) rotate(45deg);
            }
        }
        .welfare-shop-group {
            margin-top: rem(7);
            @extend %flex;
          //  @extend %justify-content-center;
            flex-wrap: wrap;
            .welfare-shop {
                width: rem(118);
                padding-bottom: rem(10);
           //     box-shadow: 2px 2px 4px #dddddd;
                @extend %flex;
                @extend %justify-content-space-between;
                flex-direction: column;
            }
            img {
                display: block;
                margin: rem(10) auto;
                width: rem(96);
                height: rem(96);
            }
            .welfare-name {
                box-sizing: border-box;
                padding: 0 rem(5);
                width: rem(118);
                font-size: rem(12);
                @extend %nowrap;
                color: #000000;
            }
            .welfare-price {
                white-space: nowrap;
                margin-top: rem(5);
                box-sizing: border-box;
                padding-left: rem(5);
                text-align: left;
                .them {
                    font-size: rem(14);
                }
                span{
                    display: block;
                }
                font-size: rem(12);
                color: #999999;
            }
            .btn {
                margin: rem(6) auto 0;
                border-radius: 2px;
                width: rem(100);
                height: rem(26);
                line-height: rem(26);
                text-align: center;
                font-size: rem(11);
                color: #ffffff;
                background-color: $them;
            }
        }
    }

    .index {
        width: 100%;
        height: auto;
        position: relative;
    }

    .new-shop{
        position: absolute;
        left: rem(5);
        top: rem(5);
        width: rem(46);
        height: rem(25);
        line-height: rem(30);
        font-size: rem(13);
        text-indent: rem(6);
        color: #ffffff;
        background: url("../../assets/img/home/new_shop.png") no-repeat;
        background-size: 100% 100%;
    }
    .customer {
        z-index: 999;
        .text {
            display: none;
        }
        position: fixed;
        right: 0;
        top: 50%;
        @include translate(0, -50%);
        width: 0;
        transition: width .3s ease-out;
        height: rem(50);
        @include gradientToRight(#FCDB4B, #FBA030);
        background-color: #FCDB4B;
        border-radius: 10px 0 0 10px;
        img {
            transition: left .3s ease-out;
            position: absolute;
            left: rem(-50);
            top: 0;
            display: block;
            width: rem(50);
            height: rem(50);
        }
        .text {
            animation: cus .3s ease-out;
            margin-top: rem(14);
            margin-right: rem(10);
            width: rem(135);
            height: rem(23);
            line-height: rem(22);
            float: right;
            color: #ffffff;
            font-size: rem(16);
            @extend %flex;
            .cus-btn {
                flex: 1;
                text-align: center;
                &::after {
                    margin-right: rem(10);
                    content: '热线';
                    display: inline-block;
                    border-radius: rem(12);
                    width: rem(56);
                    height: rem(23);
                    @include gradientToRight(#F88F5B, #FA4747);
                    background-color: #F88F5B;
                }
            }
            .wx-btn {
                @extend .cus-btn;
                margin-right: 0;
                margin-left: rem(10);
                &::after {
                    content: '微信';
                }
            }
            div:first-of-type {
                border-right: 2px solid #fff;
            }
        }
    }

    .customer.open {
        //  overflow: visible;
        width: rem(188);
        img {
            left: rem(-20);
        }
        .text {
            @extend %flex;
        }
    }

    /*首页内容*/
    .indexPage {
        width: 100%;
        /*height: auto;*/
        display: flex;
        flex-direction: column;
    }

    /*1*/
    .indexPage-one {
        width: 100%;
        /*height: 500px;*/
        background: #ffffff;
        display: flex;
        flex-direction: column;
    }

    .indexPage-one-top {
        width: 100%;
        height: 200px;
        //  background: goldenrod;
    }

    /*轮播图*/
    .wrapper {
        width: 100%;
        height: 200px;
        overflow: hidden;
        position: absolute;
    }

    .wrapper ul {
        width: 400%;
        height: 200px;
        font-size: 0;
        position: relative;
    }

    .wrapper ul li {
        display: inline-block;

    }

    .wrapper img {
        width: 100%;
        height: 200px;
    }

    .wrapper .dots {
        position: absolute;
        right: 5px;
        top: 180px;
    }

    .wrapper .dots span {
        width: 16px;
        height: 16px;
        display: inline-block;
        background: #FFF;
        opacity: .5;
        border-radius: 50%;
    }

    .indexPage-one-bottom {
        width: 100%;
        /*height: 300px;*/
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 5px;
    }

    .indexPage-one-bottom-one {
        width: 92%;
        height: 50px;
        display: flex;
        align-items: center;
    }

    .indexPage-one-bottom-one-text {
        font-size: 18px;
        color: #CEAF43;
    }

    .indexPage-one-bottom-two {
        width: 92%;
        height: 145px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-one-bottom-two-img {
        width: 100%;
        height: 92%;
    }

    .indexPage-one-bottom-three {
        width: 92%;
        height: 125px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-one-bottom-three-img {
        width: 100%;
        height: 92%;
    }

    /*2*/
    .indexPage-two {
        width: 100%;
        //  height: 340px;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 2%;
    }

    .indexPage-two-top {
        width: 100%;
        height: 50px;
        /*border: 1px solid #F1F4F3;*/
        display: flex;
        justify-content: center;
    }

    .indexPage-two-top-content {
        width: 92%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .indexPage-two-top-content-one {
        width: 30%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .indexPage-two-top-content-one-textOne {
        font-size: rem(18);
        font-weight: 300;
        color: #333333;
    }

    .indexPage-two-top-content-one-textTwo {
        font-size: 13px;
        font-weight: 200;
        margin-left: 5%;
    }

    .indexPage-two-top-content-two {
        width: 30%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    .indexPage-two-top-content-two-left {
        width: 65%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-two-top-content-two-left-text {
        font-size: rem(16);
        font-weight: 600;
        color: #333333;
    }

    .indexPage-two-top-content-two-right {
        width: 35%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-two-top-content-two-right-img {
        width: 25%;
        height: 30%;
    }

    .indexPage-two-bottom {
        width: 92%;
        // height: 290px;
        display: flex;
        flex-direction: column;
    }

    .indexPage-two-bottom-one {
        width: 100%;
        height: rem(140);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-two-bottom-one-img {
        width: 100%;
        height: 92%;
    }

    .indexPage-two-bottom-two {
        width: 100%;
        height: rem(45);
        display: flex;
        flex-direction: row;
    }

    .indexPage-two-bottom-two-left {
        width: 65%;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .indexPage-two-bottom-two-left-text {
        font-size: rem(15);
        font-weight: 600;
        color: #000000;
    }

    .indexPage-two-bottom-two-right {
        width: 25%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-two-bottom-two-right-text {
        width: 80%;
        height: 60%;
        background: #9466DA;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-two-bottom-three {
        width: 100%;
        height: rem(37);
        margin-bottom: rem(15);
        display: flex;
        flex-direction: row;
    }

    .indexPage-two-bottom-three-left {
        width: 30%;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .indexPage-two-bottom-three-left-text {
        background: #FF6161;
        background-image: linear-gradient(-135deg, #FF4C76 0%, #FF3B56 100%);
        border-radius: 2px;
        font-size: rem(13);
        color: #ffffff;
        width: 80%;
        height: rem(30);
        line-height: rem(30);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-two-bottom-three-right {
        width: 70%;
        height: 100%;
        display: flex;
        flex-direction: row-reverse;
    }

    .indexPage-two-bottom-three-right-one {
        width: 25%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-two-bottom-three-right-one-text {
        font-size: 14px;
        color: #999999;
        font-weight: 200;
        text-decoration: line-through;
    }

    .indexPage-two-bottom-three-right-two {
        margin-right: rem(10);
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-two-bottom-three-right-two-text {
        font-size: 20px;
        color: #FF6161;
        font-weight: 600;
    }

    /*3*/
    .indexPage-three {
        width: 100%;
        height: 230px;
        background: #ffffff;
        margin-top: 2%;
        display: flex;
        flex-direction: column;
    }

    .indexPage-three-top {
        width: 100%;
        height: 50px;
        /*border: 1px solid #F1F4F3;*/
        display: flex;
        justify-content: center;
    }

    .indexPage-three-top-content {
        width: 92%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .indexPage-three-top-content-one {
        width: 30%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .indexPage-three-top-content-one-textOne {
        font-size: rem(18);
        color: #333333;
    }

    .indexPage-three-top-content-one-textTwo {
        font-size: 13px;
        font-weight: 200;
        margin-left: 5%;
    }

    .indexPage-three-top-content-two {
        line-height: 50px;
        color: #999999;
        font-size: rem(14);
    }

    .indexPage-three-bottom {
        width: 100%;
        height: 180px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-three-bottom-content {
        width: 92%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    .indexPage-three-bottom-content-one {
        width: 45%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-three-bottom-content-one-img {
        width: 90%;
        height: 85%;
    }

    .indexPage-three-bottom-content-two {
        width: 55%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-three-bottom-content-two-content {
        width: 100%;
        height: 85%;
        display: flex;
        flex-direction: column;
    }

    .indexPage-three-bottom-content-two-content-top {
        width: 100%;
        height: 50%;
        display: flex;
        flex-direction: row;
    }

    .indexPage-three-bottom-content-two-content-top-left {
        width: 75%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-three-bottom-content-two-content-top-left-text {
        font-size: 16px;
        font-weight: 600;
    }

    .indexPage-three-bottom-content-two-content-top-right {
        width: 25%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-three-bottom-content-two-content-top-right-text {
        width: 100%;
        height: 40%;
        background: #9466DA;
        color: #ffffff;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-three-bottom-content-two-content-bottom {
        width: 100%;
        height: 50%;
        display: flex;
        flex-direction: row;
    }

    .indexPage-three-bottom-content-two-content-bottom-one {
        width: 55%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .indexPage-three-bottom-content-two-content-bottom-one-top {
        width: 100%;
        height: 60%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-three-bottom-content-two-content-bottom-one-top-text {
        color: #FF6161;
        font-size: 24px;
        font-weight: 600;
    }

    .indexPage-three-bottom-content-two-content-bottom-one-bottom {
        width: 100%;
        height: 40%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-three-bottom-content-two-content-bottom-one-bottom-text {
        color: #A5A5A5;
        font-size: 18px;
        text-decoration: line-through;
    }

    .indexPage-three-bottom-content-two-content-bottom-two {
        width: 45%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-three-bottom-content-two-content-bottom-two-text {
        font-size: 15px;
        color: #ffffff;
        width: 90%;
        height: 60%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FF6161;
    }

    /*4*/
    .indexPage-four {
        width: 100%;
        // height: 450px;
        background: #ffffff;
        margin-top: 2%;
        display: flex;
        flex-direction: column;
    }

    /*4.1*/
    .indexPage-four-top {
        width: 100%;
        height: 50px;
        /*border: 1px solid #F1F4F3;*/
        display: flex;
        justify-content: center;
    }

    .indexPage-four-top-content {
        width: 92%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .indexPage-four-top-content-one {
        width: 30%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .indexPage-four-top-content-one-textOne {
        font-size: 18px;
        font-weight: 600;
    }

    .indexPage-four-top-content-one-textTwo {
        font-size: 13px;
        font-weight: 200;
        margin-left: 5%;
    }

    .indexPage-four-top-content-two {
        width: 30%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    .indexPage-four-top-content-two-left {
        width: 65%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-four-top-content-two-left-text {
        font-size: 16px;
        font-weight: 600;
    }

    .indexPage-four-top-content-two-right {
        width: 35%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indexPage-four-top-content-two-right-img {
        width: 25%;
        height: 30%;
    }

    /*5*/
    .indexPage-five {
        width: 100%;
        height: 100px;
    }

    .wrapperimage {
        width: 750px;
        height: 360px;
    }
    .advertising_cover{
        /*display: none;*/
        width:100%;
        height: 100%;
        position: fixed;
        top:0;
        left: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
        .advertising_box{
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: - rem(210);
            margin-left: - rem(130);
            width:rem(260);
            height: rem(420);
            background: #fff;
        }
        .guangao_chahao{
            width: rem(30);
            height: rem(30);
            position: absolute;
            top:- rem(66);
            right: - rem(38);
            background-image: url("../../assets/img/home/gg_tc_chahao.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;
        }
        .guangao_img{
            width: 100%;
            height: 100%;
        }
    }
    .health_num_box{
        width: rem(24);
        height: rem(37);
        position: absolute;
        top: rem(10);
        right: rem(15);
        /*z-index: 0;*/
        background-image: url("../../assets/images/health_bg@2x.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        .health_num_box_ch1{
            color: #fff;
            text-align: center;
            font-size: rem(12);
        }
    }
    .activity_lable_box{
        display: flex;
        .activity_e_card{
            width: rem(18);
            height: rem(18);
            background-image: url("../../assets/img/balance/e.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;
            margin-left: rem(5);
        }
        .activity_limit_icon{
            width: rem(33);
            height: rem(13);
            margin-top: rem(5);
            background-image: url("../../assets/images/limit_time_icon@2x.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;
            margin-left: rem(5);
            align-self: flex-end;
        }
    }
</style>