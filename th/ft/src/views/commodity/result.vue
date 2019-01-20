<template>
    <div class="page">
        <img class="wx-icon" src="../../assets/img/pay/wx_success.png" alt="">
        <div class="back" @click="orderList">返回订单</div>
        <div class="home" @click="home">继续购物</div>
        <p class="tip">关注火兔公众号，实时查看订单状态！</p>
        <img class="img" src="../../assets/img/home/wxkf.jpg" alt="">
    </div>
</template>

<script>
    import { Toast } from 'mint-ui'

    export default {
        name: "result",
        data: function () {
            return {
                result: ''
            }
        },
        mounted: function () {
            let result = this.$route.query.errorDetail || '';
            if (result) {
                Toast(result);
            /*    setTimeout(() => {
                    if(this.$route.matched.some(record => record.meta.other)){
                        this.$router.replace('/');
                    } else {
                        this.$router.push({name: 'personalOrder', params: {orderType: 0}})
                    }
                }, 500);*/
            }

        },
        methods: {
            home: function () {
                this.$router.replace('/');
            },
            orderList: function () {
                this.$router.push({name: 'personalOrder', params: {orderType: 0}})
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    .wx-icon{
        display: block;
        width: rem(84);
        height: rem(84);
        margin: rem(64) auto rem(15);
    }
    %btn{
        border:1px solid #999;
        margin: rem(25) auto 0;
        width: rem(122);
        height: rem(35);
        border-radius: rem(25);
        font-size: rem(18);
        color: #999;
        text-align: center;
        line-height: rem(35);
    }
    .back{
        @extend %btn;
    }
    .home{
        @extend %btn;
        background-color: $them;
        color: #fff;
        border-color: $them;
    }
    .tip{
        margin-top: rem(50);
        text-align: center;
        font-size: rem(18);
        color: #333;
    }
    .img{
        margin: rem(25) auto;
        width: rem(180);
        height: rem(180);
        display: block;
    }
</style>