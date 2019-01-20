<template>
    <div class="back" @click="$router.back()">
        <i class="iconfont icon-arrow-left"></i>
    </div>
</template>

<script>
    export default {
        name: "back"
    }
</script>

<style scoped lang="scss">
    .back {
        position: absolute;
        left: 0;
        top: 0;
        padding-left: 14px;
        padding-top: 14px;

    }

    .back .iconfont {
        font-size: 16px;
        color: #666666;
    }
</style>