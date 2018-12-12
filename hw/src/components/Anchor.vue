<template>
     <ul class="navbar">
        <li v-for="(item,i) in data" :key="i" @click="goAnchor(i)" :class="{active:currentAnchor==i}">{{item}}
        </li>
    </ul>
</template>
<script>
export default {
    props:["data"],
    data(){
        return {
            currentAnchor:0,
        }
    },
    mounted(){
        window.addEventListener('scroll', this.scroll, true);
    },
    methods:{
           //锚点
            goAnchor(i) {
                if (scrollInterval) clearInterval(scrollInterval)
                var anchors =document.querySelectorAll(".part")
                var anchor = anchors[i]
                var headerTop = anchors[0].offsetTop
                // document.body.scrollTop = anchor.offsetTop-80; // chrome
                // document.documentElement.scrollTop = anchor.offsetTop-80; // firefox
                var top = i == 0 ? 0 : (anchor.offsetTop - headerTop)
                var scrollY = window.scrollY || window.pageYOffset || document.documentElement.offsetTop
                var dis = top - scrollY
                var time = 15, i = 0, sum = 0
                var scrollStep = parseInt(dis / time)
                var scrollInterval = setInterval(function () {
                    i++
                    if (i < time) {
                        sum += scrollStep
                        window.scrollBy(0, scrollStep)
                    }
                    else {
                        window.scrollBy(0, dis - sum)
                        clearInterval(scrollInterval)
                    }
                }, time)
            },
            scroll() {
                var y = window.scrollY || window.pageYOffset || document.documentElement.offsetTop
                var anchors = document.querySelectorAll(".part")
                var headerTop =anchors[0]? anchors[0].offsetTop:0
                for (var i = 0; i < anchors.length; i++) {
                    if (y <= anchors[i].offsetTop + anchors[i].offsetHeight - headerTop) {
                        this.currentAnchor = i
                        break;
                    }
                }
            },
    }
}
</script>
<style scoped lang="less">
    @import '../assets/css/anchor.less';
</style>
