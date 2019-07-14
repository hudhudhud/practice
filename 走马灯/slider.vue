<template>
<ul class="slider-scroll">
    <li :class="{'slider-item':true,active:index === currentIndex,hidden:index !== currentIndex&flag}" v-for="(msg,index) in list" :key='index'>
        {{msg}}
    </li>
</ul>
</template>
<script>
export default {
    props:{
        list:{
            type:Array,
            require:true,
            default:()=>{
                return []
            }
        }
    },
    data(){
        return {
            currentIndex:0,
            timer:null,
            interval:2000,
            flag:false,
        }
    },
    mounted(){
        let self=this
        this.flag=true
        this.timer=setTimeout(function scoll(){
            // if(self.currentIndex===0){
            //     self.flag=true
            // }
            self.currentIndex++
            self.currentIndex=self.currentIndex%self.list.length
            clearTimeout(this.timer)
            setTimeout(scoll,self.interval);
        },self.interval)

    },
    destroyed(){
        if(this.timer){
            clearTimeout(this.timer)
        }
    }
}
</script>
<style lang="scss" scoped>
*{background-color:rgba(0,0,0,0.1)}
.slider-scroll{
    margin:0;
    padding:0;
    position: relative;
    width:100%;
    height: 100%;
    xoverflow: hidden;
    list-style: none;
    .slider-item {
        margin:0;
        padding:0;
        position: absolute;
        top: 100%;
        xbackground-color:pink;
        xline-height: 60px;
        // &.active {
        //      animation: ani 1s 1;
        // }
        &.active {
            top: 0;
            transition: top 1s linear;
            // animation: in 1s 1;
            animation: none;
        }
       &.hidden{
            animation: leave 1s linear 1;
        }
       // animation:none;
    }
}
@keyframes ani {
    33.3% {
        top: 100%;
    }
    66.6% {
        top: 0;
    }
    100% {
        top: -100%;
    }
}

@keyframes in {
    from {
        top: 100%;
    }
    to {
        top: 0;
    }
}
@keyframes leave {
    from {
        top: 0;
    }
    to {
        top: -100%;
    }
}
</style>
