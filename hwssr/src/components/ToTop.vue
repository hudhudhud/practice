<template>
    <div @click="goTop"  :class="{active:show,'to-top':true}">
        <!-- <i class="fa fa-chevron-up" aria-hidden="true"></i> -->
        <img src="/img/totop.png" alt="">
    </div>
</template>
<script>
export default {
    data(){
        return {
            show:false,
            minWidth:1600,
        }
    },
    mounted(){
        window.addEventListener('scroll', this.scroll, true);
        // if(!window.onresize){
        //     window.onresize = ()=>{
        //         if(document.documentElement.clientWidth<=this.minWidth){
        //             this.show=false
        //         }
        //         else{
        //             this.show=true
        //         }   
        //     }
        // }
    },
    methods:{
        scroll(){
            var scrollY=window.scrollY || window.pageYOffset || document.documentElement.offsetTop
            var viewHeight=window.innerHeight
            if(scrollY >= 10){
                this.show=true
            }
            else{
                this.show=false
            }
        },
        goTop(){
           // this.scrollTo(document.documentElement, 0,100)
            //法一，同锚
            if (scrollInterval) clearInterval(scrollInterval)
            // document.body.scrollTop = anchor.offsetTop-80; // chrome
            // document.documentElement.scrollTop = anchor.offsetTop-80; // firefox
            var dis=window.scrollY || window.pageYOffset || document.documentElement.offsetTop
            var time = 15, i = 0, sum = 0
            var scrollStep = parseInt(dis / time)
            var scrollInterval = setInterval(function () {
                i++
                if (i < time) {
                    sum += scrollStep
                    window.scrollBy(0, -scrollStep)
                }
                else {
                    window.scrollBy(0, sum-dis)
                    clearInterval(scrollInterval)
                }
            }, time)
        },
        //法2
        scrollTo(element, to, duration) {
            if (duration <= 0) return;
            var difference = to - element.scrollTop;
            var perTick = difference / duration * 10;

            setTimeout(()=> {
                element.scrollTop = element.scrollTop + perTick;
                if (element.scrollTop == to) return;
                this.scrollTo(element, to, duration - 10);
            }, 10);
        }
    }
}
</script>
<style scoped lang="less">
@width:80px;
.to-top{
    position:fixed;
    right: 50%;
    margin-right: -665px;
    bottom:100px;
    width:@width;
    height:@width;
    transform:scale(0,0);
    opacity: 0;
    xborder-radius: 50%;
    border-radius:4px;
    background-color:@mainColor;
    text-align: center;
    line-height: @width;
    color:#fff;
    font-size:20px;
    cursor: pointer;
    box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
    overflow: hidden;
    transition:all .2s linear;
    &.active{
        transform:scale(1,1);
        opacity:1;
        z-index: 999;
    }
    img{
        margin-top:17px;
    }
}
</style>
