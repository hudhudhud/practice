<template>
    <div>
        <div class="top">
            <img src="../../assets/img/vip/upgrade_top.png" v-if="type===1" alt="">
            <img src="../../assets/img/vip/upgrade_top_xing.png" v-else alt="">
        </div>
        <div class="bottom">
            <img src="../../assets/img/vip/shop_bottom.jpg" v-if="type===1" alt="">
            <img src="../../assets/img/vip/xing_bottom.jpg" v-else alt="">
            <div class="item-a" @click="detail(0)"></div>
            <div class="item-b" @click="detail(1)"></div>
            <div class="item-c" @click="detail(2)"></div>
            <div class="button" @click="upgrade"></div>
        </div>
        <div class="mask" v-if="share" @click="share=''">
            <img class="shareLogImg" src="http://p20gi5fjt.bkt.clouddn.com/shareLog.png">
        </div>
    </div>
</template>

<script>
    import {Toast} from 'mint-ui';
    import {findMealList} from '../../service/upgradeVip.service'

    export default {
        name: "upgrade-vip",
        data: function () {
            return {
                type: 0,
                infos: [],
                share: ''
            }
        },
        activated: function () {
            this.type = +this.$route.query.type;
            this.$store.dispatch('configShare', 'upgradeVip&type=' + this.type);
            this.share = this.$route.params.share;
            this.getInfo();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
            this.$store.dispatch('configShare');
        },
        methods: {
            getInfo: function () {
                findMealList({id: this.type, load: true}).then(
                    res => {
                        if (res.status == 0) {
                            this.infos = res.data;
                            //
                        }
                    }
                );
            },
            /**
             * 详情
             * */
            detail: function (index) {
                this.saveData(index);
                this.$router.push({
                    name: 'commodityBuyerVip',
                    query: {id: this.infos[index].id, hide: 'hide', type: 'upgrade', shopType: this.type}
                })
            },
            /**
             * 升级
             */
            upgrade: function () {
                if (!this.UserInfo.token) {
                    this.$router.push({name: 'login'})
                    return;
                }
                if (this.type == 1) {
                    if (Number(this.UserInfo.rank) >= 1) {
                        Toast('您已拥有此服务');
                        return;
                    }
                } else {
                    if (Number(this.UserInfo.rank) >= 2) {
                        Toast('您已拥有此服务');
                        return;
                    }
                }
                this.saveData();
                this.$router.push({name: 'myOrder', query: {type: 'upgrade', shopType: this.type}})
            },
            saveData: function (n = 1) {
                // 下单
                try {
                    this.infos[0].count = 0;
                    this.infos[1].count = 0;
                    this.infos[2].count = 0;
                    this.infos[n].count = 6;

                    this.infos.forEach(i => {
                        i.marketPrice = this.type===1? 1989:1989*6
                        i.price = this.type===1? 1989:1989*6
                    })
                } catch (e) {
                }
                localStorage.setItem('upgrade_data', JSON.stringify(this.infos));
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
    @import "../../assets/public";

    .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: rgba(0, 0, 0, .3);
        top: 0;
        left: 0;
        z-index: 50;
    }

    .shareLogImg {
        width: 100%;
    }

    .top {
        img {
            width: 100%;
        }
    }

    .bottom {
        position: relative;
        img {
            width: 100%;
        }
    }

    .item {
        position: absolute;
        height: rem(110);
        width: 100%;
        left: 0;

    }

    .item-a {
        @extend .item;
        top: rem(173);
    }

    .item-b {
        @extend .item;
        top: rem(290);
    }

    .item-c {
        @extend .item;
        top: rem(410);
    }

    .button {
        @extend .item;
        width: 50%;
        left: 50%;
        height: rem(30);
        @include translate(-50%, 0);
        top: rem(550);
    }
</style>