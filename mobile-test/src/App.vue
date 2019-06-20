<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
  import myaxios from './assets/js/myaxios';
  export default {
    watch: {
        //检查登录，后续开启
        // 如果路由有变化，会再次执行该方法
        '$route': 'checkLogin'
    },
    mounted(){
        //检查登录，后续开启
        //this.checkLogin()
    },
    methods:{
        checkLogin(){
            //console.log(this.$router)
            // myaxios.get("login/api").then(res=>{
            //       console.log("res=",res)
            //       if(res.data.user){
            //           this.$store.commit('setUserInfo',res.data.user)
            //       }
            //       else{
            //           this.$router.push('/login')
            //       }
            // })

            // console.log("checkLogin")
            // setTimeout(()=>{
            //     var userInfo=this.$store.state.userInfo
            //     if(userInfo.id){
            //         this.$store.commit('setUserInfo',userInfo)
            //     }
            //     else{
            //         this.$router.push('/login')
            //     }
            // },1000)
        }
    }
  }
</script>
<style lang="less">
* {
    xbackground-color: rgba(0, 0, 0, 0.1)
}
#app {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;*/
    /*  background-color:@base;*/
    width:100%;
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
  .content-login{
      width: @contentWidth;
      xmin-height: 100%;
      margin: auto;
      xpadding-top: @headerLoginHeight;
      xpadding-bottom: @footerLoginHeight;
      xmargin-bottom:-@footerLoginHeight;
      box-sizing: border-box;
  }
}
.clearfix:after{
  content:'';
  display:block;
  clear:both;

}
</style>