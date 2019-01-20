<template>
    <div style="padding-bottom: 50px">
        <keep-alive>
            <router-view/>
        </keep-alive>
        <Tabs></Tabs>
    </div>
</template>

<script>
    import Tabs from '@/components/tabs.vue'

    export default {
        name: "tabs",
        components: {
            Tabs
        }
    }
</script>

<style lang="scss">
    @import "../../assets/public";

    @keyframes tab-enter {
        0% {
            @include translate(100%, 0);
        }
        100% {
            @include translate(0, 0);
        }
    }

    @keyframes tab-leave {
        0% {
            @include translate(0, 0);
        }
        100% {
            @include translate(-100%, 0);
        }
    }

    /**
    左右滑动动画
     */
    .tab-transition {
        box-sizing: border-box;
    }

    .tab-transition-enter-active {
        pointer-events: none;
        animation: tab-enter .3s ease-in-out;
    }

    .tab-transition-leave-active {
        pointer-events: none;
        animation: tab-leave .3s ease-in-out;
    }

    .tab-transition-enter-active, .tab-transition-leave-active {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }


</style>