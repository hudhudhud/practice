<template>
    <div class="scroll" v-if="list.length">
        <i class="iconfont icon-laba_"></i>
        <div class="animation">
            <div class="item" v-for="item in list" :key="item.id">
                <span>{{item.phone}}</span>
                <span v-if="item.upgradeInfo">{{item.upgradeInfo}}</span>
                <span v-if="item.quantity">下了{{item.quantity}}单</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {getScrollOrderByProductId, showUpgradeList} from "../../service/other.service";

    export default {
        name: "scrollComponent",
        props: ['type', 'id'],
        data: function () {
            return {
                list: [],
                index: 0,
                enable: false
            }
        },
        activated: function () {
            if (this.type === '1') {
                // 我的详情页面
                this.showUpgradeList();
            } else {
                // 订单详情轮播
                this.getScrollOrderByProductId();
            }
            this.enable = true;
            this.animationIndex();
        },
        deactivated: function () {
            this.enable = false;
        },
        watch: {
          id: function () {
             this.getScrollOrderByProductId();
          }
        },
        methods: {
            // 订单详情轮播
            getScrollOrderByProductId: async function () {
                if(!this.id){
                    return ;
                }
                ({data: this.list} = await getScrollOrderByProductId({id: this.id}));
            },
            // 我的详情页面
            showUpgradeList: async function () {
                ({data: this.list} = await showUpgradeList());
            },
            animationIndex: function () {
                if (!this.enable) {
                    return;
                }
                setTimeout(() => {
                    this.index++;
                    if (this.index >= this.list.length) {
                        this.index = 0;
                    }
                    this.animation();
                    this.animationIndex();
                }, 3000)
            },
            animation: function () {
                $('.animation').css('transform', 'translateY(-' + 20 * this.index + 'px)');
            }

        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .scroll {
        z-index: 999;
        overflow: hidden;
        position: absolute;
        border-radius: rem(10);
        width: rem(174);
        height: 20px;
        line-height: 20px;
      //  line-height: 18px;
        left: rem(20);
        top: rem(20);
        padding-left: rem(15);
        background-color: rgba(0, 0, 0, .5);
        .iconfont {
            position: absolute;
            left: 5px;
            top: 50%;
            @include translate(0,-50%);
            font-size: 16px;
            color: #ffffff;
            font-weight: bold;
        }
        .animation{
            transition: transform .3s ease-out;
        }
        .item {
            height: 20px;
            text-indent: 5px;
            font-size: 10px;
            color: #ffffff;
            white-space: nowrap;
            span {
                margin-left: rem(6);
            }

        }

    }
</style>