<template>
  <div class="page-manage">
      <Left />
      <Header />
      <div class="backstage">
        <router-view></router-view>
      </div>
  </div>
</template>
<script>
import header from '../component/header'
import left from '../component/left'
import cfg from '../config/config'
import services from '../services'
export default {
  components: {
    "Header":header,
    "Left":left,
  },
  created(){
    services.user_isLogin().then(res=>{
      if(!res.data.data){
        this.$router.push('/login');
      }
    })
  }

}
</script>