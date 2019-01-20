<template>
    <div>
        <mt-tabbar v-model="selected" :fixed="true">
            <mt-tab-item id="all" @click.native="check">
                全部
            </mt-tab-item>
            <mt-tab-item id="status1" @click.native="check">
                待支付
            </mt-tab-item>
            <mt-tab-item id="status2" @click.native="check">
                待发货
            </mt-tab-item>
            <mt-tab-item id="status3" @click.native="check">
                待收货
            </mt-tab-item>
            <mt-tab-item id="status6" @click.native="check">
                已收货
            </mt-tab-item>
            <mt-tab-item id="status4" @click.native="check">
                交易成功
            </mt-tab-item>
            <!--<mt-tab-item id="status5" @click.native="check">-->
                <!--已取消-->
            <!--</mt-tab-item>-->
        </mt-tabbar>
        <mt-loadmore :top-method="check" ref="loadmore" topPullText="继续下拉刷新" topDropText="可以放手了" topLoadingText="正在刷新">
            <mt-tab-container v-model="selected"
                              v-infinite-scroll="loadMore"
                              infinite-scroll-disabled="loading"
                              infinite-scroll-immediate-check="false"
                              auto-fill="false"
                              infinite-scroll-distance="40">
                <mt-tab-container-item id="all">
                    <OrderItem v-for="item in all" :key="item.id" :item="item" @order-detail="handleOrderDeatil"
                               @order-pay="handlePay" @order-logistice="handleLogistice"
                               @order-again="handleToCommodityBuyerVip" @cancel-order="cancelOrder"
                               @order-confirm="handleConfirm"></OrderItem>
                </mt-tab-container-item>
                <mt-tab-container-item id="status1">
                    <OrderItem v-for="item in status1" :key="item.id" :item="item" @order-pay="handlePay"
                               @order-detail="handleOrderDeatil" @cancel-order="cancelOrder"></OrderItem>
                </mt-tab-container-item>
                <mt-tab-container-item id="status2">
                    <OrderItem v-for="item in status2" :key="item.id" :item="item"
                               @order-detail="handleOrderDeatil"></OrderItem>
                </mt-tab-container-item>
                <mt-tab-container-item id="status3">
                    <OrderItem v-for="item in status3" :key="item.id" :item="item" @order-detail="handleOrderDeatil"
                               @order-confirm="handleConfirm"
                               @order-logistice="handleLogistice"></OrderItem>
                </mt-tab-container-item>
                <mt-tab-container-item id="status4">
                    <OrderItem v-for="item in status4" :key="item.id" :item="item" @order-detail="handleOrderDeatil"
                               @order-logistice="handleLogistice" @order-again="handleToCommodityBuyerVip"></OrderItem>
                </mt-tab-container-item>
                <mt-tab-container-item id="status5">
                    <OrderItem v-for="item in status5" :key="item.id" :item="item" @order-detail="handleOrderDeatil"
                               @order-again="handleToCommodityBuyerVip"></OrderItem>
                </mt-tab-container-item>
                <mt-tab-container-item id="status6">
                    <OrderItem v-for="item in status6" :key="item.id" :item="item" @order-detail="handleOrderDeatil"
                               @order-again="handleToCommodityBuyerVip" @order-logistice="handleLogistice"></OrderItem>
                </mt-tab-container-item>
            </mt-tab-container>
        </mt-loadmore>
    </div>

</template>

<script>
    import { Toast, MessageBox } from 'mint-ui';
    import OrderItem from '@/components/personalOrderItem';
    import { getOrderListService, cancelOrder, confirmAccept } from '@/service/order.service.js'

    const type = {
        'all': '',
        'status1': 0,
        'status2': 1,
        'status3': 2,
        'status4': 5,
        'status5': 4,
        'status6': 3
    }
    export default {
        name: "personal-order",
        components: {
            OrderItem
        },
        data: function () {
            return {
                'all': [],
                'status1': [],
                'status2': [],
                'status3': [],
                'status4': [],
                'status5': [],
                'status6': [],
                selected: 'all',
                page: 0,
                size: 10,
                loading: true,
            }
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        activated: function () {
            //  this.onRead();
            if (+this.$route.params.orderType) {
                this.selected = 'status' + this.$route.params.orderType;
            } else if (this.$route.params.orderType == 0) {
                this.selected = 'all';
            } else {
                this.selected = localStorage.getItem('orderType') || 'all'
            }
            this.check();
        },
        methods: {
            GetRequest: function () {
                return this.$route.query;
            },
            check: function () {
                localStorage.setItem('orderType', this.selected);
                // 切换页面
                this.loading = false; // 重新开启监听
                this.page = 0;
                this.loadMore();
            },
            loadMore: function () {
                this.loading = true;
                this.page++;
                this.getList();
            },
            getList: function () {

                getOrderListService({
                    "pageNo": this.page,
                    "pageSize": this.size,
                    orderStatus: type[this.selected],
                    load: this.page === 1,
                    isService: 0
                }).then(res => {

                    if (res.status === '0') {
                        if (this.page === 1) {
                            this[this.selected] = res.data.list;
                        } else {
                            this[this.selected] = this[this.selected].concat(res.data.list);
                        }
                        if (Number(res.data.list.length) < Number(this.size)) {
                            this.loading = true;
                        } else {
                            this.loading = false;
                        }
                    } else {
                        this.loading = false;
                    }
                    this.$refs.loadmore.onTopLoaded();
                }).catch(error => {
                    this.$refs.loadmore.onTopLoaded();
                });
            },
            /**
             * 取消订单
             */
            cancelOrder: async function (id) {
                const res = await cancelOrder({id: id, load: true, successMsg: '取消成功'});
                if (res.status === '0')
                    this.check();
            },
            /**
             * 跳转订单详情
             */
            handleOrderDeatil: function (id) {
                this.$router.push({name: 'personalOrderDetail', params:id})
            },
            /**
             * 立即支付
             */
            handlePay: function (data) {
                if(data.orderType === 4){
                    this.$router.push({
                        name: 'payIntegral',
                        query: {orderId: data.id}
                    })
                }else{
                    this.$router.push({
                        name: 'pay',
                        query: {OrderId: data.id}
                    })
                }

            },
            /**
             * 再次购买 跳转 商品详情
             */
            handleToCommodityBuyerVip: function (id) {
                this.$router.push({name: 'commodityBuyerVip', query: {id: id}});
            },
            /**
             * 物流信息
             */
            handleLogistice: function (id) {
                this.$router.push({name: 'logistics', query: {id: id}});
            },
            /**
             * 确认收货
             */
            handleConfirm: async function (id) {
                await this.confirm('确认收货?', '提示');
                const res = await confirmAccept({id: id, load: true, successMsg: '确认收货成功'});
                if (res.status === '0')
                    this.check();
            }

        },
        computed: {
            UserInfo() {
                return this.$store.state.userInfo;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

</style>
<style lang="scss">
    @import "../../../assets/public";

    .mint-tabbar {
        background-color: white;
        top: 0;
        height: rem(44);

        .mint-tab-item-label {
            line-height: rem(44);
        }
        .is-selected.mint-tab-item {
            background-color: white;
            .mint-tab-item-label {
                color: $them;
            }
        }
    }

    .mint-tab-item {
        padding: 0;
    }

    // 底部
    .mint-tab-container {
        padding-top: rem(44);
    }
</style>