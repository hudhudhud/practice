<template>
    <div id='wuliu' class="wuliu">
        <!--1.0-->
        <div class="wuliu-one">
            <!--<Shop :detail="shoppingCartList"></Shop>-->
            <div class="wuliu-one-bottom">
                <div class="wuliu-one-bottom-page">
                    <div class="wuliu-one-bottom-one">
                        <div class="wuliu-one-bottom-one-top">
                            <span class="wuliu-one-bottom-one-top-spanOne">发货时间：</span>
                            <span class="wuliu-one-bottom-one-top-spanTwo">{{logisticsTop.time}}</span>
                        </div>
                        <div class="wuliu-one-bottom-one-center">
                            <span class="wuliu-one-bottom-one-center-spanOne">物流公司：</span>
                            <span class="wuliu-one-bottom-one-center-spanTwo">{{logisticsTop.logisticsName}}</span>
                        </div>
                        <div class="wuliu-one-bottom-one-bottom">
                            <span class="wuliu-one-bottom-one-bottom-spanOne">物流单号：</span>
                            <span class="wuliu-one-bottom-one-bottom-spanTwo"><input id="InviterPhoneText"
                                                                                     style="outline:none;color: #999" type="button"
                                                                                     value=""
                                                                                     v-model='logisticsTop.logisticsSn'/></span>
                        </div>
                        <div class="wuliu-one-bottom-one-bottom1" style="align-items: normal;">
                            <span class="wuliu-one-bottom-one-bottom1-spanOne" style="white-space: nowrap;">物流备注：</span>
                            <span class="wuliu-one-bottom-one-bottom1-spanTwo">{{logisticsTop.logisticsRemark}}</span>
                        </div>
                    </div>
                    <div @click='jsCopy' class="wuliu-one-bottom-two">
                        <span class="wuliu-one-bottom-two-span">复 制</span>
                    </div>
                </div>
            </div>
        </div>
        <!--2.0-->
        <div class="wuliu-two">
            <div class="wuliu-two-page">
                <div class="wuliu-two-page-one">
                    <span class="wuliu-two-page-one-spanOne">物流信息跟踪</span>
                    <span @click='loadingCLick' class="wuliu-two-page-one-spanTwo">刷新物流</span>
                </div>
                <div class="wuliu-two-page-three" v-for='item in logisticsData.logisticsInfoList'>
                    <p class="content">{{item.content}}</p>
                    <p class="time">{{item.time}}</p>
                </div>
                <div v-if="!logisticsData.logisticsInfoList.length" style="text-align: center;line-height: 30px">暂无物流信息</div>
            </div>
        </div>
    </div>

</template>

<script>
    import Shop from '@/components/profile/shopDetail'
    import {findLogistics,findLogisticsLocal, getOrderDetail} from "../../../service/order.service";

    export default {
        name: "logistics",
        components: {
            Shop
        },
        data: function () {
            return {
                shoppingCartList: {},//通知
                logisticsData: {
                    logisticsInfoList: []
                },
                logisticsTop: {}
            }
        },
        activated: function () {
            this.shoppingCartList = JSON.parse(localStorage.getItem('logistics'));
            this.findLogistics();
            this.logistics();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            jsCopy: function () {
                const that = this;
                var e = document.getElementById("InviterPhoneText");//对象是copy-num1
                e.select(); //选择对象
                document.execCommand("Copy"); //执行浏览器复制命令
                layer.msg("复制成功");
            },

            loadingCLick: function () {
                this.findLogistics();
            },
            logistics: function () {
                findLogisticsLocal({id: this.$route.query.id, load: true}).then(
                    res => {
                        if (res.status === '0')
                            this.logisticsTop = res.data;
                    }
                );
            },
            findLogistics: async function () {
                const res = await findLogistics({id: this.$route.query.id});
                if (res.status === '0') {
                    this.logisticsData = res.data;
                }
            }

        },
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    .wuliu {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    /*1.0*/
    .wuliu-one {
        width: 100%;
        /*height: 230px;*/
        background: #ffffff;
        display: flex;
        flex-direction: column;
    }

    .wuliu-one-bottom {
        width: 100%;
        height: 45%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .wuliu-one-bottom-page {
        width: 95%;
        height: 90%;
        position: relative;
        /*display: flex;*/
        flex-direction: row;
    }

    .wuliu-one-bottom-one {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .wuliu-one-bottom-one-top {
        width: 100%;
        height: rem(18);
        padding-top: rem(10);
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .wuliu-one-bottom-one-top-spanOne {
        font-size: 14px;
        color: #333;
    }

    .wuliu-one-bottom-one-top-spanTwo {
        margin-left: 3%;
        font-size: 14px;
    }

    .wuliu-one-bottom-one-center {
        width: 100%;
        height: rem(18);
        padding-top: rem(5);
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .wuliu-one-bottom-one-center-spanOne {
        font-size: 14px;
        color: #333;
    }

    .wuliu-one-bottom-one-center-spanTwo {
        margin-left: 3%;
        font-size: 14px;
    }

    .wuliu-one-bottom-one-bottom {
        width: 100%;
        height: rem(18);
        padding-top: rem(5);
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
    }

    .wuliu-one-bottom-one-bottom-spanOne {
        font-size: 14px;
        color: #333;
    }

    .wuliu-one-bottom-one-bottom-spanTwo {
        margin-left: 3%;
        font-size: 14px;
        color: #999;
    }
    .wuliu-one-bottom-one-bottom1 {
        width: 100%;
        /*height: rem(18);*/
        padding-top: rem(5);
        padding-bottom: rem(10);
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
    }

    .wuliu-one-bottom-one-bottom1-spanOne {
        font-size: 14px;
        color: #333;
    }

    .wuliu-one-bottom-one-bottom1-spanTwo {
        margin-left: 3%;
        font-size: 14px;
    }

    .wuliu-one-bottom-two {
        position: absolute;
        top:rem(45);
        right: rem(8);
        width: rem(64);
        height: rem(26);
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
    }

    .wuliu-one-bottom-two-span {
        width: rem(64);
        height: rem(26);
        border: 1px solid #999999;
        color: #333;
        border-radius: rem(13);
        font-size: rem(13);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /*2.0*/
    .wuliu-two {
        width: 100%;
        height: auto;
        background: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2%;
    }

    .wuliu-two-page {
        width: 94%;
        height: auto;
        display: flex;
        flex-direction: column;
    }

    .wuliu-two-page-one {
        width: 100%;
        height: rem(38);
        border-bottom: 1px solid #F1F4F3;
        display: flex;
        justify-content: space-between;
    }

    .wuliu-two-page-one-spanOne {
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        color: #333;
    }

    .wuliu-two-page-one-spanTwo {
        width: rem(64);
        height: rem(26);
        line-height: rem(26);
        border: 1px solid #999999;
        color: #333;
        border-radius: rem(13);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: rem(13);
        text-align: center;
        margin-top: rem(6);
        margin-right: rem(8);
    }

    .wuliu-two-page-two {
        width: 100%;
        height: 160px;
        border-bottom: 1px solid #F1F4F3;
        display: flex;
        align-items: center;
    }

    .wuliu-two-page-two-page {
        width: 80%;
        height: 90%;
        display: flex;
        flex-direction: column;
    }

    .wuliu-two-page-two-page-one {
        width: 100%;
        height: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
    }

    .wuliu-two-page-two-page-two {
        width: 100%;
        height: 20%;
        display: flex;
        align-items: center;
        font-size: 14px;
    }

    .wuliu-two-page-three {
        width: 100%;
        color: #333333;
        padding: rem(10) 0;
        border-bottom: 1px solid $border;
        .content {
            font-size: rem(13);
        }
        .time {
            margin-top: rem(5);
            font-size: rem(11);
        }
    }

    input {
        background: none;
        outline: none;
        border: 0px;
    }

    input:focus {
        outline: none;
    }
</style>