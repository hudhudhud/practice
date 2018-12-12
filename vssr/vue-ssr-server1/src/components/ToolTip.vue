<template>
    <span class="box" @click="toggleShow" v-show="isShow">
        i m tooltip
    </span>
</template>
<script>
import  toggle from '@/mixins/toggle.js'
export default {
    mixins:[toggle],
}
</script>
<style lang="less" scoped>
.box{
 padding:10px 50px;
 background-color:yellow;
 text-align: center;
 position:absolute;
}
</style>


