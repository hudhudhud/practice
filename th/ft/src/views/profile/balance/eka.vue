<template>
    <div class="e-ka-mx">
        <div class="e-ka-title">E卡明细</div>
        <div class="e-ka-ye">
            <div class="e-ka-ye-title-div">
                <div class="e-ka-ye-title-left">
                    <i></i>
                    <span>火兔商城</span>
                </div>
                <div class="e-ka-ye-title-right">
                    <span>火兔E卡</span>
                </div>
            </div>
            <div class="e-ka-je">￥{{mineInfo.ecard}}</div>
        </div>
        <div class="e-ka-dk">
            <span>E卡抵扣明细</span>
        </div>
        <mt-loadmore :top-method="check"  ref="loadmore" topPullText="继续下拉刷新" topDropText="可以放手了" topLoadingText="正在刷新">
            <div style="background-color: #ffffff;min-height: 100px"
                 v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-immediate-check="false"
                 auto-fill="false"
                 infinite-scroll-distance="40"
            >
                <div class="item" v-for="item in list" :key="item.id">
                    <div class="type">
                        <p>{{item.remark}}</p>
                        <p>{{item.createDate}}</p>
                    </div>
                    <div class="count">
                        <p>{{item.inOrOut===1?'+':'-'}}{{item.transamount}}</p>
                        <p :class="{them: item.statusStr!== '成功'}">{{item.statusStr}}</p>
                    </div>
                </div>
                <div v-if="!list.length" style="text-align: center;line-height: 100px">无记录</div>
            </div>
        </mt-loadmore>
    </div>
</template>

<script>
    import {getAccount} from '../../../service/pay/pay.service'
    import { getAccountLogList } from '../../../service/balance.service';
    export default {
        name: "eka",
        data: function () {
            return {
                mineInfo:[],//我的信息
                inOrOut:1,
                selected: 0,
                list: [],
                page: 0,
                size: 10,
                loading: false,
            }
        },
        activated: function () {
            this.getAccount();
            this.check();
        },
        methods:{
            getAccount:async function () {
                const res = await getAccount();
                if(res.status === '0'){
                    this.mineInfo = res.data;
                }
            },
            check: function (n = 0) {
                this.list = [];
                this.selected = n;
                this.loading = false; // 重新开启监听
                this.page = 0;
                this.loadMore();
            },
            loadMore: function () {
                this.loading = true;
                this.page++;
                this.getList();
            },
            getList: async function () {
                let selected = this.selected;
                const res = await getAccountLogList({
                    inOrOut: this.selected,
                    currencyType: 5,
                    pageNo: this.page,
                    pageSize: this.size
                });
                if (res.status === '0') {
                    if (this.page === 1) {
                        this.list = res.data.list;
                    } else {
                        this.list = this.list.concat(res.data.list);
                    }
                    this.loading = Number(res.data.list.length) < Number(this.size);
                } else {
                    this.loading = false;
                }
                this.$refs.loadmore.onTopLoaded();
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";
    .e-ka-title{
    height: rem(44);
    background: #000000;
    color: #fff;
    font-size: rem(18);
    text-align: center;
    line-height: rem(44);
    }
    .e-ka-ye{
        height: rem(140);
        margin: rem(10) rem(16) 0;
        background:url("../../../assets/images2/Card_voucher_details.png") no-repeat center/cover;
        border-radius: rem(6);
    }
    .e-ka-ye-title-div{
        overflow: hidden;
    }
    .e-ka-ye-title-left{
        float: left;
        margin-left: rem(16);
        margin-top: rem(10);
        color: #ffffff;
        i{
            display: inline-block;
            vertical-align: bottom;
            height: rem(16);
            width: rem(14);
            background:url("../../../assets/images2/eka_icon.png") no-repeat center/cover;
        }
    }
    .e-ka-ye-title-right{
        float: right;
        width: rem(60);
        height: rem(20);
        text-align: center;
        line-height: rem(20);
        border-radius: rem(10);
        margin-right: rem(14);
        margin-top: rem(8);
        background: rgba(0,0,0,0.2);
        color: #fff;
        font-size: rem(12);
    }
    .e-ka-je{
        height: rem(54);
        font-size: rem(38);
        color: #fff;
        text-align: center;
        margin-top: rem(18);
    }
    .e-ka-dk{
        height: rem(24);
        margin:rem(26) 0 rem(16);
        font-size: rem(18);
        color: #333333;
        font-weight: 900;
        span{
            margin-left: rem(12);
        }
    }

    .item {
    height: rem(64);
    padding: 0 rem(22) 0 rem(11);
    font-size: rem(15);
    color: #333333;
    border-bottom: 1px solid lighten(gainsboro, 5%);
    @extend %flex;
    @extend %justify-content-space-between;
    @extend %flex-align-center;
    }
    .type {
        font-weight: bold;
        p:last-of-type {
            font-weight: 100;
            margin-top: 5px;
            font-size: rem(13);
            color: #BBBBBB;
        }
    }
    .count {
        text-align: right;
        p:last-of-type {
            color: #389E0D;
            font-size: rem(12);
        }
    }
</style>