<template>
    <div id='newsLogistics' class="newsLogistics">
        <!--1.0-->
        <OrderItem v-for='item in newsList' :key="item.id" :item="item"></OrderItem>
        <!--2.0-->
        <!--         <div class="newsLogistics-two">
                    <span class="newsLogistics-two-span">一个月前</span>
                </div> -->
        <!--3.0-->
        <!--         <div class="newsLogistics-one">
                    <div class="newsLogistics-one-content">
                        <div class="newsLogistics-one-content-page">
                            <div class="newsLogistics-one-content-top">
                                <div class="newsLogistics-one-content-top-left">
                                    <span class="newsLogistics-one-content-top-left-spanOne">订单已支付</span>
                                </div>
                                <div class="newsLogistics-one-content-top-right">
                                    <span class="newsLogistics-one-content-top-right-spanTwo">2018-06-27</span>
                                </div>
                            </div>
                            <div class="newsLogistics-one-content-bottom">
                                <div class="newsLogistics-one-content-bottom-one">
                                    <div class="newsLogistics-one-content-bottom-one-left">
                                        <image class="newsLogistics-one-content-bottom-one-left-img" src="../../images/t01394b5b134fb81f0b.jpg"></image>
                                    </div>
                                    <div class="newsLogistics-one-content-bottom-one-right">
                                        <div class="newsLogistics-one-content-bottom-one-right-one">
                                            <span class="newsLogistics-one-content-bottom-one-right-one-span">Xiaomi/小米 笔记本Air  13.3英寸 I7 8G 256GB 2G独显</span>
                                        </div>
                                        <div class="newsLogistics-one-content-bottom-one-right-two">
                                            <span class="newsLogistics-one-content-bottom-one-right-two-span">金色：WiFi</span>
                                        </div>
                                        <div class="newsLogistics-one-content-bottom-one-right-three">
                                            <span class="newsLogistics-one-content-bottom-one-right-three-spanOne">￥4996</span>
                                            <span class="newsLogistics-one-content-bottom-one-right-three-spanTwo">￥4996</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="newsLogistics-one-content-bottom-two">
                                    <div class="newsLogistics-one-content-bottom-two-top">
                                        <span class="newsLogistics-one-content-bottom-two-top-sapn">承接快递：申通</span>
                                    </div>
                                    <div class="newsLogistics-one-content-bottom-two-bottom">
                                        <span class="newsLogistics-one-content-bottom-two-bottom-sapn">运单编号：315051ZFQ131</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->
    </div>
</template>

<script>
    import OrderItem from '@/components/orderItem';
    import {findPageLogistics} from "../../../service/msg.service";
    // 物流信息
    export default {
        name: "logistics",
        components: {
            OrderItem
        },
        data: function () {
            return {
                newsList: [],//通知
                UserInfo: [],//用户信息
            }
        },
        activated: function () {
            this.onRead();
        },
        methods: {
            GetRequest: function () {
                return this.$route.query;
            },

            onRead: function (num) {
                const that = this;
                findPageLogistics({"pageNo": "1", "pageSize": "9"}).then(
                    res => {
                        if (res.status === '0') {
                            that.newsList = res.data.list;
                        }
                    }
                );
            },

        },
    }
</script>

<style scoped>

    .newsLogistics {
        width: 100%;
    }

    /*1.0*/
    .newsLogistics-one {
        width: 100%;
        height: 200px;
        margin-top: 3%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newsLogistics-one-content {
        width: 96%;
        height: 100%;
        background: #ffffff;
        border-radius: 3%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .newsLogistics-one-content-page {
        width: 96%;
        height: 96%;
        display: flex;
        flex-direction: column;
    }

    .newsLogistics-one-content-top {
        width: 100%;
        height: 20%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 2px solid #F1F4F3;
    }

    .newsLogistics-one-content-top-left {
        width: 45%;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .newsLogistics-one-content-top-left-spanOne {
        font-size: 18px;
        font-weight: 800;
        color: #333333;
    }

    .newsLogistics-one-content-top-right {

        height: 100%;
        display: flex;
        align-items: center;
    }

    .newsLogistics-one-content-top-right-spanTwo {
        font-size: 14px;
        font-weight: 300;
        color: #ACACAC;
    }

    .newsLogistics-one-content-bottom {
        width: 100%;
        height: 80%;
        display: flex;
        flex-direction: column;
    }

    .newsLogistics-one-content-bottom-one {
        width: 100%;
        height: 65%;
        display: flex;
        flex-direction: row;
    }

    .newsLogistics-one-content-bottom-one-left {
        width: 40%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newsLogistics-one-content-bottom-one-left-img {
        width: 86%;
        height: 90%;
    }

    .newsLogistics-one-content-bottom-one-right {
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .newsLogistics-one-content-bottom-one-right-one {
        width: 100%;
        height: 40%;
    }

    .newsLogistics-one-content-bottom-one-right-one-span {
        font-size: 14px;
        font-weight: 800;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newsLogistics-one-content-bottom-one-right-two {
        width: 100%;
        height: 30%;
        display: flex;
        align-items: center;
    }

    .newsLogistics-one-content-bottom-one-right-two-span {
        font-size: 14px;
        font-weight: 300;
        color: #D1D1D1;
    }

    .newsLogistics-one-content-bottom-one-right-three {
        width: 100%;
        height: 30%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .newsLogistics-one-content-bottom-one-right-three-spanOne {
        font-size: 20px;
        color: #FF6666;
    }

    .newsLogistics-one-content-bottom-one-right-three-spanTwo {
        font-size: 15px;
        color: #BBBBBB;
        margin-left: 6%;
        text-decoration: line-through;
    }

    .newsLogistics-one-content-bottom-two {
        width: 100%;
        height: 30%;
        display: flex;
        flex-direction: column;
    }

    .newsLogistics-one-content-bottom-two-top {
        width: 100%;
        height: 50%;
        display: flex;
        align-items: center;
    }

    .newsLogistics-one-content-bottom-two-top-sapn {
        font-size: 14px;
        font-weight: 300;
    }

    .newsLogistics-one-content-bottom-two-bottom {
        width: 100%;
        height: 50%;
        display: flex;
        align-items: center;
    }

    .newsLogistics-one-content-bottom-two-bottom-sapn {
        font-size: 14px;
        font-weight: 300;
    }

    /*2.0*/
    .newsLogistics-two {
        width: 100%;
        height: 40px;
        margin-top: 3%;
        display: flex;
        align-items: center;
    }

    .newsLogistics-two-span {
        font-size: 16px;
        font-weight: 800;
    }
</style>