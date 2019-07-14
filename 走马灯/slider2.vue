<template>
    <section class="slider-box">
            <ul class="slider-list" :class="{'go-top':animate}" :style='{"margin-top":(animate?-itemHeight:0) + "px"}'>
                <li v-for="(item, i) in list" :key='i' class="slider-item">
                    {{item}}
                </li>
            </ul>
    </section>
</template>
<script>
export default {
    name:'slider',
    props:{
        list:{
            type:Array,
            require:true,
            default:()=>{
                return []
            }
        },
        interval:{
            type:Number,
            default:2000
        },
        itemHeight:{
            type:Number,
            required:true,
            default:30
        }
    },
    data(){
        return {
            animate:false,
            timer:null,
        }
    },
    mounted(){
      this.timer=setInterval(this.scroll,this.interval)
    },
    methods:{
        scroll: function () {
            this.animate = true;
            setTimeout (() => {
                this.list.push (this.list[0]);
                this.list.shift ();
                this.animate = false;
            }, 1000);
        }
    },
    destroyed(){
        if(this.timer){
            clearTimeout(this.timer)
        }
    }
}
</script>
<style lang='scss' scoped>
.slider-box{
    width:100%;
    height:100%;
    overflow: hidden;
    position:relative;
    .slider-list{
        list-style: none;
        margin:0;
        padding:0;
        position:absolute;
        top:0;
        left:0;
        &.go-top{
            transition: all 1s linear;
        }
        .slider-item{
            margin:0;
            padding:0;
        }
    }
}
</style>


