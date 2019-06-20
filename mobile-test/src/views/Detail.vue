<template>
 	<Page>
 		{{msg}}
 	</Page>
</template>

<script>
import Page from '@/components/Page.vue'
export default {
	components:{
		Page,
	},
	data:function(){
		return {
			msg: '主播详情'
		}
	}
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>