<template>
    <div class="page">
        <header>
            <div :class="{active: type===0}" @click="check(0)">综合</div>
            <div :class="{active: type===1}" @click="check(1)">价格</div>
        </header>
        <mt-loadmore :top-method="check" ref="loadmore" topPullText="继续下拉刷新" topDropText="可以放手了"
                     topLoadingText="正在刷新">
            <div style="background-color: #ffffff"
                 v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-immediate-check="false"
                 auto-fill="false"
                 infinite-scroll-distance="50">
                <ShopList :classify="dataList"/>
            </div>
        </mt-loadmore>
    </div>
</template>

<script>
    import ShopList from '@/components/home/shop'
    import { findWelfarePage } from '../../service/home/welfare.service'
    import {  findProductList } from "../../service/home.service";
    // 废弃
    export default {
        name: "class-detail",
        components: {
            ShopList
        },
        data: function () {
            return {
                type: 0,
                page: 0,
                size: 10,
                list: [],
                parentId: '',
                loading: true
            }
        },
        activated: function () {
            this.parentId = this.$route.query.parentId;
            this.check();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            check: function (n) {
                if (n !== undefined)
                    this.type = n;
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
                try {
                    let  res ;
                    if(this.parentId){
                        res = await findProductList({
                            type: 0,
                            pageNo: this.page,
                            pageSize: this.size,
                            load: this.page === 1,
                            productTypeId: this.parentId,
                            orderBy: this.type ? 't1.v0_market_price' : undefined
                        });
                    } else {
                        res = await findWelfarePage({
                            pageNo: this.page,
                            pageSize: this.size,
                            load: this.page === 1,
                            type: 1,
                            orderBy: this.type ? 't1.v0_market_price' : undefined
                        });
                    }

                    if (res.status === '0') {
                        if (this.page === 1) {
                            this.list = res.data.list;
                        } else {
                            this.list = this.list.concat(res.data.list);
                        }
                        if (Number(res.data.list.length) < Number(this.size)) {
                            this.loading = true;
                        } else {
                            this.loading = false;
                        }
                    } else {
                        this.loading = false;
                    }
                } catch (e) {}
                this.$refs.loadmore.onTopLoaded();
            },
            detail: function (id) {
                this.$router.push({name: 'commodityBuyerVip', query: {id: id}})
            }
        },
        computed: {
            dataList: function () {
                return this.list.map(j => {
                    j.discountPrice = (j.marketPrice * j.discount / 10).toFixed(2);
                    return j
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    header {
        height: rem(45);
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-center;
        font-size: rem(18);
        color: #999999;
        background-color: #ffffff;
        div {
            padding: 0 rem(32);
            text-align: center;
        }
        div:nth-of-type(n+2) {
            border-left: 1px solid #999999;
        }
        div.active {
            color: $them;
        }

    }
</style>