<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
    export default {
        watch: {
            // 如果路由有变化，会再次执行该方法
            //'$route': 'checkLogin'
        },
        mounted() {
        },
        methods: {}
    }
</script>
<style lang="less">
    * {
        xbackground-color: rgba(0, 0, 0, 0.1)
    }

    #app {
        font-family: "Microsoft Yahei", sans-serif;
        /*font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;*/
        /*  background-color:@base;*/
        height: 100%;
        .page {
            min-height: 100%;
            background-color: #f0f0f0;
        }
        .content {
            width: @contentWidth;
            min-height: 100%;
            margin: auto;
            padding-top: @headerHeight;
            padding-bottom: @footerHeight;
            margin-bottom: -@footerHeight;
            box-sizing: border-box;
            /*padding-top: calc(@headerHeight * 2);*/
        }
        .content-login {
            width: @contentWidth;
            xmin-height: 100%;
            margin: auto;
            xpadding-top: @headerLoginHeight;
            xpadding-bottom: @footerLoginHeight;
            xmargin-bottom: -@footerLoginHeight;
            box-sizing: border-box;
        }
        .imgloading {
            width: 100%;
            text-align: center;
        }
    }
</style>