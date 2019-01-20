<template>
    <div style="display: inline-block">
        <div class="check" :class="{active: check}" @click="handleCheck"></div>
    </div>
</template>

<script>
    export default {
        name: "check",
        props: ['check'],
        methods: {
            handleCheck: function () {
                this.$emit('update:check', !this.check)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/public";

    .check {
        background: url("../assets/images2/selected_hui.png") no-repeat center;
        background-size: 100% 100%;
        min-height: rem(16);
        min-width: rem(16);
    }
    .active {
        background: url("../assets/images2/selected.png") no-repeat center;
        background-size: 100% 100%;
    }
</style>