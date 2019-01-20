<template>
    <div>
        <div class="tabs">
            <div class="tab" :class="{active: selected===0}" @click="check(0)"><span>全部</span></div>
            <div class="tab" :class="{active: selected===1}" @click="check(1)"><span>收入</span></div>
            <div class="tab" :class="{active: selected===2}" @click="check(2)"><span>支出</span></div>
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
                    <p v-if="item.transamount">{{item.inOrOut===1?'+':'-'}}{{item.transamount}}</p>
                    <p :class="{them: item.statusStr!== '成功'}">{{item.statusStr}}</p>
                </div>
            </div>
            <div v-if="!list.length" style="text-align: center;line-height: 100px">无记录</div>
        </div>
        </mt-loadmore>
    </div>
</template>

<script>
    import { getAccountLogList } from '../../../service/balance.service';

    export default {
        name: "list-component",
        props: ['type'],
        activated: function () {
            this.check();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        data: function () {
            return {
                selected: 0,
                list: [],
                page: 0,
                size: 10,
                loading: true,
            }
        },
        methods: {
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
                console.log(this.list)
            },
            getList: async function () {
                let selected = this.selected;
                const res = await getAccountLogList({
                    inOrOut: this.selected,
                    currencyType: this.type,
                    pageNo: this.page,
                    pageSize: this.size
                });
                if (res.status === '0'&& selected === this.selected) {
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

    .tabs {
        height: rem(45);
        line-height: rem(45);
        @extend %flex;
        @extend %justify-content-center;
        text-align: center;
        font-size: rem(15);
        color: #333333;
        background-color: #ffffff;
        border: 1px solid lighten(gainsboro, 5%);
        .tab {
            font-weight: bold;
            transition: background-color .2s ease-out;
            width: 33%;
           // border-right: 1px solid lighten(gainsboro, 5%);
        }
        .tab.active {
         //   background-color: $them;
            color: $them;
            span{
                padding-bottom: 3px;
                border-bottom: 2px solid $them;
            }
        }
    }
</style>