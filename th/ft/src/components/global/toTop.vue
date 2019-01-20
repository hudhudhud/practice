<template>
    <div class="toTop" v-if="show" @click="toTop"><img src="../../assets/img/home/toTop.png" alt=""></div>
</template>

<script>
    export default {
        name: "toTop",
        data: function(){
          return {
              show: false
          }
        },
        activated: function(){
          window.onscroll= () => {
              let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
              if(scrollTop > 1000){
                  this.show = true;
              }else{
                  this.show = false;
              }
          }
        },
        methods: {
            toTop: function () {
                this.scroll();
            },
            scroll: function () {
                let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
                if (currentScroll > 0) {
                    window.requestAnimationFrame(this.scroll);
                    window.scrollTo (0,currentScroll - (currentScroll/5));
                }
            }
        }

    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    @import "../../assets/animation";
    .toTop{
        animation: opacity-show .3s ease-out;
        z-index: 100;
        position: fixed;
        right: rem(21);
        bottom: rem(70);
        img{
            width: rem(36);
            height: rem(36);
        }
    }
</style>