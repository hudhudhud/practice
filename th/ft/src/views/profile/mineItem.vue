<template>
    <div>
        <div class="data-char">
            <div class="title" style="border: none">事业伙伴</div>
            <div id="echarts"></div>
        </div>
        <!--<div class="line1"></div>-->
        <!--<div class="line2"></div>-->
        <div>
            <div class="list-title">直属伙伴列表</div>
            <mt-search v-model="search" cancel-text="取消"
                       placeholder="名字/手机号"></mt-search>
            <div class="tabs">
                <div class="tab" :class="{active: select===-1}" @click="check(-1)">全部</div>
                <div class="tab" :class="{active: !select}" @click="check(0)">会员</div>
                <div class="tab" :class="{active: select===1}" @click="check(1)">店主</div>
                <div class="tab" :class="{active: select===2}" @click="check(2)">一星</div>
                <div class="tab" :class="{active: select===3}" @click="check(3)">二星</div>
                <div class="tab" :class="{active: select===4}" @click="check(4)">三星</div>
            </div>
          <!--  <div class="sort-type">
                <div class="active" @click="height = height?0:'6.7rem'">
                    <span>{{sorts[sort].text}}</span>
                    <i class="iconfont" :class="height?'icon-up':'icon-down'"></i>
                </div>
                <ul :style="{height: height}">
                    <li v-for="(item, index) in sorts" :key="item.key" :class="{them: sort===index}" @click="sortChange(index)">{{item.text}}</li>
                </ul>
            </div>-->
            <div class="list"
                 v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-immediate-check="false"
                 auto-fill="false"
                 infinite-scroll-distance="40">
                <div class="item" v-for="item in list">
                    <img class="avatar" :src="item.avatar" alt="">
                    <div>
                        <p>
                            <span class="nickname">{{item.name}}</span>
                            <span class="role">{{item.customerRankName}}</span>
                        </p>
                        <p class="quantity">
                            本月销量：{{item.quantity}}
                        </p>
                    </div>
                    <a :href="'tel:'+item.phone">
                        <i class="iconfont icon-tel"></i>
                    </a>
                </div>
                <div v-if="!list.length" style="text-align: center;padding: 10px">
                    暂无数据
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import lodash from 'lodash';
    import { Indicator  } from 'mint-ui';
    import { findNumberByRank, findTeamPage } from "../../service/mineItem.service";


    export default {
        name: "mine-item",
        data: function () {
            return {
                search: '',
                customerRank: 0,
                page: 1,
                size: 10,
                select: -1,
                list: [],
                loading: true,
                inter: null,
                sorts: [
                    {key: 'quantity', text: '订单'},
                    {key: 'number', text: '团队'},
                ],
                sort: 0,
                height: 0
            }
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        activated: function () {
            this.findNumberByRank();
            this.check();
        },
        watch: {
            search() {
                this.searchChange();
            }
        },
        methods: {
            init: function (data) {
                delete data.All;
                let option = {
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['30%', '55%'],
                            center: ['50%', '50%'],
                            data: Object.keys(data).map( i => {
                                return { name: i+'('+data[i]+')', value: data[i]}
                            }),
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#14FBEC','#0CD1CC','#FF3E00','#FF8604','#5FB2FF',
                                            '#FFE944','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                            '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                        ];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            }
                        }
                    ]
                };
                let myChart = this.$echarts.init(document.getElementById('echarts'));
                myChart.setOption(option);
            },
            findNumberByRank: async function () {
                const res = await findNumberByRank();
                if (res.status === '0') {
                    this.init(res.data);
                }
            },
            searchChange: lodash.debounce(function () {
                this.check();
            }, 500),
            sortChange: function (i) {
                this.sort = i;
                this.height = 0;
                this.check();
            },

            check: function (n=this.select) {
                this.select = n;
                this.loading = false; // 重新开启监听
                this.page = 0;
                this.loadMore();
            },
            loadMore: function () {
                this.loading = true;
                this.page++;
                this.getInfo();
            },
            getInfo: async function () {
                let select = this.select;
                const res = await findTeamPage({
                    load: !this.list.length,
                    pageNo: this.page,
                    pageSize: this.size,
                    phoneOrName: this.search,
                    customerRank: this.select===-1?'':this.select,
                   // queryType: 1
                });
                if (res.status === '0'&&select === this.select) {
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

            }
        }
    }
</script>


<style scoped lang="scss">
    @import "../../assets/public";
    @import "../../assets/animation";

    .mint-search {
        height: auto;
    }

    #echarts {
        margin: rem(10) auto;
        box-sizing: border-box;
        height: rem(195);
    }

    .data-char {
        margin: rem(20) rem(10);
        background: #FFFFFF;
        border-radius: rem(10);
        box-shadow: 0px 2px 3px 0px rgba(221, 221, 221, 0.50);
        overflow: hidden;
        .title {
            border-left: 4px solid black;
            margin-left: rem(15);
            margin-top: rem(20);
            font-size: rem(15);
            height: rem(15);
            line-height: rem(15);
            text-indent: 5px;
            font-weight: bold;
            color: #333333;
        }
        #echarts{
            border-top: 1px solid $border;
        }

    }

    .line1 {
        margin: 0 rem(10);
        height: rem(4);
        background-color: #333333;
    }

    .line2 {
        @extend .line1;
        margin-top: 2px;
        height: 2px;
    }

    .list-title {
        text-indent: rem(10);
        padding: rem(10) 0;
        margin: 0 rem(10);
        font-size: rem(15);
        color: #333333;
        background-color: #ffffff;
        font-weight: bold;
    }
    .tabs {
        margin: 0 rem(10);
        height: rem(40);
        line-height: rem(40);
        font-size: rem(13);
        color: #333333;
        background-color: #ffffff;
        text-align: center;
        @extend %flex;
        .tab {
            flex: 1;
         //   border-right: 1px solid $border;
        }
        .tab.active {
            color: $them;
          //  background-color: $them;
            border-bottom:1px solid $them;
        }
    }
    .sort-type{
        position: relative;
        margin: 0 rem(10);
        background-color: #ffffff;
        height: rem(40);
        .active{
            border-top: 1px solid $border;
            background-color: #ffffff;
            box-sizing: border-box;
            padding: 0 rem(10);
            font-size: rem(13);
            color: #333333;
            height: rem(40);
            @extend %flex-align-center;
            @extend %flex;
            @extend %justify-content-space-between;
        }
        ul{
            transition: height .3s ease-out;
            overflow: hidden;
            position: absolute;
            left: 0;
            top: rem(40);
            width: 100%;
            background-color: #ffffff;
            z-index: 10;
            color: #333333;
            border-bottom: 1px solid $border;
            li{
                border-top: 1px solid $border;
                box-sizing: border-box;
                padding: 0 rem(10);
                height: rem(40);
                line-height: rem(40);
            }
        }
    }

    .list {
        border-top: 1px solid $border;
        margin: 0 rem(10);
        background-color: #ffffff;
        font-size: rem(11);
        color: #333333;
        .role {
            margin-left: rem(20);
            color: #FF6666;
        }
        .item {
            position: relative;
            @extend %flex;
            @extend %flex-align-center;
            height: rem(61);
        }
        .avatar {
            border-radius: 50%;
            width: rem(40);
            height: rem(40);
        }
        .quantity {
            margin-top: rem(4);
        }
        a {
            right: rem(10);
            position: absolute;
            font-size: rem(18);
            color: #333333;
            text-decoration: none;
        }
        a:active {
            color: #333333;
        }
    }

</style>
<style lang="scss">
    .list-title+.mint-search {
        .mint-searchbar {
            padding-top: 0;
            padding-bottom: 0;
            background-color: transparent;
        }
        input{
            border-radius: 18px;
            background-color: #F7F7F7;
            text-indent: 10px;
        }
        .mint-searchbar-inner{
            background-color: #ffffff;
            border-radius: rem(18);
        }
        .mintui-search{
            display: none;
        }

    }


</style>