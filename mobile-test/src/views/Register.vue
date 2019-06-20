<template>
  <section>
  		 <header-login title="欢迎注册">
	  		 	<div slot="right">
	  		 		<span>已有账号?</span>
	  		 		<router-link to="/Login">立即登录</router-link>
	  		 	</div>
  		 </header-login>
  		 <div class="content-register">
  		 		
  		 </div>
  </section>
</template>

<script>
import HeaderLogin from '@/components/HeaderLogin.vue'
export default {
  components:{
  	HeaderLogin,
  },
  data:function(){
    return {
      msg:"注册"
    }
  }
}
</script>
<style scoped lang="less">
	.content-register{
		width:@contentWidth;
		margin:auto;
		border-top:1px solid;
	}
</style>
