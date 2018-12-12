<template>
    <div class="pop" v-if="isShow" @click.stop="toggleShow">
        <div class="box">
            <p>i m modal</p>
            <input type="button" @click.stop="toggleShow" value="确定"/>
        </div>
    </div>
</template>
<script>
import toggle from '@/mixins/toggle.js'
export default {
  mixins: [toggle]
}
</script>
<style lang="less" scoped>
.pop{
    position: fixed;
    top:0;
    left:0;
    width:100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.1);
    .box{
        position:absolute;
        top:calc(50vh - 100px);
        left:calc(50vw - 100px);
        width:200px;
        height: 200px;
        background-color: #fff;
    }

}
</style>
