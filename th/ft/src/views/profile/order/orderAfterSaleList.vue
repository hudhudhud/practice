<template>
    <div>
        <div   v-infinite-scroll="loadMore"
               infinite-scroll-disabled="loading"
               infinite-scroll-immediate-check="false"
               auto-fill="false"
               infinite-scroll-distance="40">
        <div class="item" v-for="item in list" :key="item.id">
            <div class="title">售后单号：{{item.sn}}</div>
            <Shop :detail="item" />
            <div class="status">
                <span>{{item.afterSaleStatusStr}}</span>
                <div >
                    <span @click="toDetail(item.id)">查看详情</span>
                    <i class="iconfont icon-right"></i>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    import {findRefundPage, findSalesReturnPage} from "../../../service/profile/refund.service";
    import Shop from '@/components/profile/shopDetail'
    export default {
        name: "orderAfterSaleList",
        components: {
            Shop
        },
        data: function () {
            return {
                list: [],
                page: 0,
                size: 10,
                text: ['待处理', '申请通过', '驳回申请', '售后中', '重新申请', '补充物流', '取消申请'],
                loading: true,
        }
        },
        activated: function () {
            this.getList();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            loadMore: function () {
                this.loading = true;
                this.page++;
                this.getList();
            },
            getList: async function () {
                const res = await findRefundPage({pageNo: this.page,pageSize: this.size});
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
            },
            toDetail: function (id) {
                this.$router.push({name: 'afterSaleInfo',query: {id: id}});
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    .item {
        margin-top: rem(10);
        background-color: #ffffff;
    }

    .title {
        line-height: rem(38);
        font-size: rem(13);
        color: #333333;
        padding-left: rem(11);
        border-bottom: 1px solid $border;
    }

    .status {
        border-top: 1px solid $border;
        height: rem(38);
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-space-between;
        padding: 0 rem(15);
        color: $them;
    }
</style>