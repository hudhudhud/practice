<template>
    <div class="page">
        <img class="img" src="../../assets/img/signIn/error.png" alt="">
        <p class="tip" >很遗憾，您未能签到成功。请核实签到手机号是否准确或咨询现场工作人员。</p>
        <div class="btn" @click="again">重新签到</div>
    </div>
</template>

<script>
    export default {
        name: "error",
        methods: {
            again: function () {
                this.$router.back();
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    .img {
        display: block;
        margin: rem(75) auto;
        width: rem(255);
        height: rem(198);
    }
    .tip{
        margin: rem(23) auto 0;
        width: rem(268);
        font-size: rem(15);
        color: #333333;
    }
    .btn{
        margin: rem(27) auto;
        @include btn(rem(40) ,#fff);
        width: rem(255);
        background-color: $them;
        border-radius: rem(20);
    }
</style>