<template>
    <div class="index-bottom-all">
        <!--1首页-->
        <div class="index-bottom" @click="link('/')">
            <div class="index-bottom-top">
                <img class="index-bottom-all-top-img"  v-if="name==='home'" src="../assets/img/home/tab/tab.png" />
                <img class="index-bottom-all-top-img" v-else src="../assets/img/home/tab/tab_gray.png" />
            </div>
            <div class="index-bottom-bottom">
                <span class="index-bottom-one-bottom-text" :class="{active: name === 'home'}">首 页</span>
            </div>
        </div>
        <div class="index-bottom" @click="link('/classification')">
            <div class="index-bottom-top">
                <img class="index-bottom-all-top-img"  v-if="name==='classification'" src="../assets/img/home/tab/tab_1.png" />
                <img class="index-bottom-all-top-img" v-else src="../assets/img/home/tab/tab1_gray.png" />
            </div>
            <div class="index-bottom-bottom">
                <span class="index-bottom-one-bottom-text" :class="{active: name === 'classification'}">分 类</span>
            </div>
        </div>
        <!--2消息-->
        <div class="index-bottom" @click="link('/msg')">
            <div class="index-bottom-top">
                <div class="msgCount" v-if="msgCount">{{msgCount}}</div>
                <img class="index-bottom-all-top-img" v-if="name==='msg'"  src="../assets/img/home/tab/tab2.png" />
                <img class="index-bottom-all-top-img" v-else src="../assets/img/home/tab/tab2_gray.png" />
            </div>
            <div class="index-bottom-bottom">
                <span class="index-bottom-two-bottom-text" :class="{active: name === 'msg'}">消 息</span>
            </div>
        </div>
        <!--3购物车-->
        <div class="index-bottom" @click="link('/cart')">
            <div class="index-bottom-top">
                <img class="index-bottom-all-top-img" v-if="name==='cart'" src="../assets/img/home/tab/tab3.png" />
                <img class="index-bottom-all-top-img" v-else src="../assets/img/home/tab/tab3_gray.png" />
            </div>
            <div class="index-bottom-bottom">
                <span class="index-bottom-three-bottom-text" :class="{active: name === 'cart'}">购物车</span>
            </div>
        </div>
        <!--4我的-->
        <div class="index-bottom" @click="link('/profile')">
            <div class="index-bottom-top">

                <img class="index-bottom-all-top-img" v-if="name==='profile'" src="../assets/img/home/tab/tab4.png" />
                <img class="index-bottom-all-top-img" v-else src="../assets/img/home/tab/tab4_gray.png" />
            </div>
            <div class="index-bottom-bottom">
                <span class="index-bottom-four-bottom-text" :class="{active: name === 'profile'}">我 的</span>
            </div>
        </div>
    </div>
</template>

<script>
    import VueRouter from 'vue-router';
    export default {
        name: "tabs",
        data: function () {
            return {
                name: ''
            }
        },
        computed: {
            msgCount: function() {
                return this.$store.state.msgCount;
            }
        },
        created: function () {
            this.$router.afterEach(({name}, from, next) => {
                // ...
                this.name = name;
            })
            try {
                this.name = this.$router.history.current.name || 'commodity';
            }catch (e){}

        },
        methods: {
            link: function (href) {
                this.$router.push(href)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/public";
    .msgCount{
        position: absolute;
        top: 0;
        right: rem(20);
        background-color: #ED1B24;
        padding: 0 rem(3);
        height: rem(15);
        line-height: rem(15);
        border-radius: 50%;
        color: #fff;
      //  @include translate(-50%,0)
    }
    /*底部导航栏*/
    .index-bottom-all{
        width: 100%;
        height: 50px;
        position: fixed;
        bottom: 0;
        background: #ffffff;
        color: #999999;
        display: flex;
        flex-direction: row;
        text-align: center;
    }
    .index-bottom{
        width: 25%;
        height: 100%;
    }
    .index-bottom{
        .index-bottom-all-top-img{
           // width: rem(15);
            height: rem(20);
            margin-bottom: 2px;
        }
    }

    .index-bottom-top{
        position: relative;
        width: 100%;
        padding-top: rem(5);
    }
    .index-bottom-bottom{
        width: 100%;
     //   margin-top: 2px;
        line-height: rem(10);
        font-size: rem(13);
        span{
            font-weight: 300;
        }

    }

    .active {
        color: $them;
    }
</style>