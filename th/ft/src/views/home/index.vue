<template>
    <transition name="material-transition">
        <keep-alive >
            <router-view/>
        </keep-alive>

    </transition>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>

</style>