<template>
    <div>
        <header class="top-back">
            <template v-if="lc">
                <p class="total">{{String(value)+lc}}</p>
                <p class="text">{{['店主服务','商品订单', '销售额'][type]}}</p>
            </template>
            <template v-else>
                <p class="total">￥{{value}}</p>
                <p class="text">{{['店主奖励','商品订单', '销售额'][type]}}</p>
            </template>
        </header>
        <section>
            <mt-loadmore :top-method="check" ref="loadmore" topPullText="继续下拉刷新" topDropText="可以放手了"
                         topLoadingText="正在刷新">
                <div style="background-color: #ffffff;min-height: 100px"
                     v-infinite-scroll="loadMore"
                     infinite-scroll-disabled="loading"
                     infinite-scroll-immediate-check="false"
                     auto-fill="false"
                     infinite-scroll-distance="40"
                >
                    <div class="item" v-for="item in list" :key="item.id">
                        <div class="info">
                            <p>{{text[item.orderType]}}
                                <img v-if="item.directFlag&&type===0" class="tag"
                                     src="../../../assets/img/profile/5xing.png" alt=""></p>
                            <p>{{item.createTime}}</p>
                            <p>订单编号：{{item.sn}}</p>
                        </div>
                        <div class="money" v-if="type===1">
                            +{{item.money}}
                        </div>
                        <div class="money" v-if="type===2">
                            {{item.customerAmount}}
                        </div>
                    </div>
                    <div v-if="!list.length" style="text-align: center;line-height: 100px">无记录</div>
                </div>
            </mt-loadmore>

        </section>
    </div>
</template>

<script>
    // 店主服务  商品订单
    import {getEarningsOrderList, orderOutingFindPage} from "../../../service/profile/newProfile";
    import {formatDate} from "../../../service/util";
    import {getOrderListService} from "../../../service/order.service";

    export default {
        name: "dataList",
        data: function () {
            return {
                list: [],
                page: 0,
                size: 10,
                loading: true,
                time: '',
                type: '',
                text: ['单品订单', '开启店主服务', '开启一星店主服务', '福利商品订单'],
                value: '',
                lc: ''
            }
        },
        activated: function () {
            this.time = this.$route.query.time || formatDate(new Date(), 'yyyy-MM');
            this.type = +this.$route.query.type;
            this.value = this.$route.query.value;
            this.lc = this.$route.query.lc;
            this.check();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            check: function () {
                this.list = [];
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
                let res;
                if (this.type === 2) {
                    res = await getOrderListService({
                        monthTime: this.time,
                    //    type: this.type,
                        pageNo: this.page,
                        pageSize: this.size,
                        isService: 1
                    });
                } else {
                    res = await getEarningsOrderList({
                        time: this.time,
                        type: this.type,
                        pageNo: this.page,
                        pageSize: this.size
                    });
                }

                if (res.status === '0') {
                    if (this.page === 1) {
                        res.data.list = res.data.list || [];
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

<style lang="scss">
    @import "../../../assets/public";

    .top-back {
        background: url("../../../assets/img/profile/top_back.png") no-repeat center;
        background-size: 100% 100%;
    }
</style>
<style scoped lang="scss">
    @import "../../../assets/public";

    header {
        overflow: hidden;
        height: rem(130);
        text-align: center;
        color: #ffffff;
        .total {
            margin-top: rem(34);
            font-size: rem(30);
        }
        .text {
            font-size: rem(14);
        }
    }

    section {
        margin-top: rem(15);
        background-color: #fff;
    }

    .tag {
        width: rem(13);
        height: rem(13);
    }

    .item {
        margin: 0 auto;
        padding: rem(10) 0;
        width: rem(337);
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-space-between;
        border-bottom: 1px solid $border;
        .info {
            p {
                white-space: nowrap;
                font-size: rem(13);
                color: #999999;
            }
            p:first-of-type {
                margin-bottom: rem(10);
                font-size: rem(15);
                color: #333333;
            }
        }
        .money {
            font-size: rem(15);
            color: $them;
        }
    }
</style>