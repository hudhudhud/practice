<template>
    <div>
        <mt-loadmore :top-method="check" ref="loadmore" topPullText="继续下拉刷新" topDropText="可以放手了" topLoadingText="正在刷新">
            <div v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-immediate-check="false"
                 auto-fill="false"
                 infinite-scroll-distance="40">
                <!--1.0-->
                <div class="mineCollection" v-for='item in list'>
                    <!--1.1-->
                    <Shop :detail="{productImage: item.productImage,
            productTitle:item.productTitle,
            price: item.price,
            marketPrice: item.v0MarketPrice,
             tagInfo:item.productIntro,
             collectTime: item.collectTime}" @click.native="selClick(item.outId)"/>
                    <!--1.2-->
                    <div class="buttons">
                        <div class="btn" @click='delClick(item.outId)'>删 除</div>
                    </div>
                </div>
                <div v-if="!list.length" style="text-align: center">暂无</div>
                <!--2.0-->

            </div>
        </mt-loadmore>
    </div>

</template>

<script>
    import { MessageBox } from 'mint-ui';
    import Shop from '@/components/shop'
    import { cancelProductCollect, findPage } from "../../service/profile/collection.service";

    export default {
        name: "collection",
        components: {
            Shop
        },
        data: function () {
            return {
                list: [],//通知
                page: 0,
                size: 10,
                loading: true
            }
        },
        activated: function () {
            this.loadMore();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            check: function () {
                //   localStorage.setItem('orderType', this.selected);
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
                findPage({pageNo: this.page, pageSize: this.size, type: 1,load: this.page === 1}).then(
                    res => {
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
                        this.$refs.loadmore.onTopLoaded();
                    }
                ).catch(error => {
                    this.$refs.loadmore.onTopLoaded();
                });

            },


            selClick: function (id, type) {
                const that = this;
                if (type == 1) {
                    location.href = '../commodity_information/commodity_Infomation.html?id=' + id;
                } else {
                    //  location.href='../commodity_buyer_vip/commodity_buyer_vip.html?id='+id;
                    this.$router.push({name: 'commodityBuyerVip', query: {id: id}})
                }

            },

            delClick: async function (id) {
                await this.confirm('确认移除该收藏?', '确认', {confirmButtonText: '移除'});
                const res = await cancelProductCollect({id: id, load: true, successMsg: '移除成功'});
                if (res.status === '0') {
                    this.check();
                }
            },


        },
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .mineCollection {
        background-color: #ffffff;
        margin-bottom: rem(5);
    }

    .buttons {
        height: rem(44);
        box-sizing: border-box;
        overflow: hidden;
        .btn {
            border-radius: rem(13);
            float: right;
            margin-right: rem(10);
            box-sizing: border-box;
            margin-top: rem(9);
            width: rem(64);
            height: rem(26);
            line-height: rem(26);
            text-align: center;
            border: 1px solid #333333;
            font-size: rem(11);
        }
    }
</style>