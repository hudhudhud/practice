<template>
    <div>
        <div class="tabs">
            <div class="tab" :class="{active: status===0}" @click="check()">全部</div>
            <div class="tab" :class="{active: status===1}" @click="check(1)">已支付</div>
            <div class="tab" :class="{active: status===2}" @click="check(2)">已发货</div>
            <div class="tab" :class="{active: status===5}" @click="check(5)">已完成</div>
        </div>
       <div class="pad-top">
           <mt-loadmore :top-method="check"  ref="loadmore" topPullText="继续下拉刷新" topDropText="可以放手了" topLoadingText="正在刷新">
               <div style="background-color: #ffffff;"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-immediate-check="false"
                    auto-fill="false"
                    infinite-scroll-distance="40"
               >
                   <OrderItem v-for="item in list" :service="1" :item="item" :key="item.id" @order-detail="detail" />
               </div>
           </mt-loadmore>
       </div>
    </div>

</template>

<script>
    import { Toast, MessageBox } from 'mint-ui';
    import OrderItem from '@/components/personalOrderItem';
    import { outingFindPage} from '@/service/order.service.js'
    import {getOrderListService} from "../../../service/order.service";

    export default {
        name: "order-list",
        components: {
            OrderItem
        },
        data: function () {
            return {
                status: 0,
                list: [],//所有订单列表
                page: 1,
                size: 10,
                loading: true,
            }
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        activated: function () {
            this.check();
        },
        methods: {
            check: function (n) {
             //   this.list = [];
                this.status = n;
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
                let status = this.status;
                const res = await getOrderListService({
                    orderStatus: this.status,
                    pageNo: this.page,
                    pageSize: this.size,
                    load: this.page === 1,
                    isService: 1
                });
                if (res.status === '0'&& status === this.status) {
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

            detail: function (id) {
                this.$router.push({name: 'personalOrderDetail', params: id, query: {service: 1}})
            }
        },
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";
    .pad-top {
        padding-top: rem(44);
    }
    .tabs {
        z-index: 1000;
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        background-color: #ffffff;
        height: rem(44);
        color: #bbbbbb;
        font-size: rem(13);
        @extend %flex;
        @extend %flex-align-center;
        text-align: center;
        border-bottom: 1px solid $border;

        .tab {
            flex: 1;
        }
        .tab.active {
            color: $them;
            font-weight: bold;
        }
    }

</style>