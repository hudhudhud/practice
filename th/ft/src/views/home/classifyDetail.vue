<template>
    <div style="background-color: #fff">
        <mt-loadmore :top-method="check" ref="loadmore" topPullText="继续下拉刷新" topDropText="可以放手了"
                     topLoadingText="正在刷新">
            <div v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-immediate-check="false"
                 auto-fill="false"
                 infinite-scroll-distance="40">

                <ShopList :classify="list"/>

                <div v-if="!list.length" class="no-data">
                    <img src="../../assets/img/home/class_back.png" alt="">
                    <p>新品即将上线<br>敬请期待！</p>
                </div>
            </div>
        </mt-loadmore>
        <to-top></to-top>
    </div>
</template>

<script>

    import {findLablePage, findProductList, findTypeList} from "../../service/home.service";
    import ShopList from '@/components/home/shop'

    export default {
        name: "classify-detail",
        components: {
            ShopList
        },
        data: function () {
            return {
                shopType: '',
                list: [],
                page: 1,
                size: 10,
                resource: '',
                loading: true
            }
        },
        activated: function () {
            this.shopType = this.$route.query.type + '';
            this.resource = this.$route.query.resource;
            this.getData();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },

        methods: {
            check: function () {
                this.page = 0;
                this.loadMore();
            },
            loadMore: function () {
                this.loading = true;
                this.page++;
                this.getData();
            },
            getData: async function () {
                let data = {
                    "pageNo": this.page,
                    "pageSize": this.size
                }
                if (this.$route.query.resource === 'class') {
                    if (this.$route.query.id)
                        data.productTypeId = this.$route.query.id;
                    else
                        data.supplierId = this.$route.query.supplierId
                } else {
                    data.type = this.shopType;
                }
                findProductList(data).then(res => {
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
                });
                this.$refs.loadmore.onTopLoaded();
            },
            detail: function (id) {
                this.$router.push({name: 'commodityBuyerVip', query: {id: id}})
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    .no-data{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: #fff;
        text-align: center;
        img{
            margin: rem(70) auto;
            width: rem(149);
            height: rem(128);
        }
        p{
            margin-top: rem(26);
            color: #666;
            font-size: rem(16);
        }
    }
    .classify {
        // back
        .title {
            padding: 0 rem(10);
            height: rem(40);
            line-height: rem(40);
            font-size: rem(18);
            color: #333333;
        }
    }
</style>