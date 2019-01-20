<template>
    <div class="fw" @click="alertShow">点此关注公众号，获得更多超值商品！</div>
</template>

<script>
    export default {
        name: "followWe",
        methods: {
            alertShow: function () {
                this.$store.commit('handleWxCustomerShow', 1);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    .fw{
        margin-bottom: rem(10);
        height: rem(21);
        line-height: rem(21);
        background-color: #DDDDDD;
        font-size: rem(12);
        color: #666;
        text-align: center;
    }
</style>