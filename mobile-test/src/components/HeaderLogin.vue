<template>
	<header>
		<div class="bars clearfix">
			<div class="fl">
				<img src="/img/logo.jpg">
				<span class="title">{{title}}</span>
			</div>
			<div class="fr">
				<slot name="right"></slot>
			</div>
		</div>
	</header>
</template>
<script>

export default {
	props:{
		title:String
	},
	data(){
		return{
			
		}
	}
}
</script>
<style lang="less" scoped>
header{
	min-width: @contentWidth;
	width:100%;
	.bars{
		width: @contentWidth;
		margin: auto;
		height: @headerLoginHeight;
		div{
			&.fl{
				img{
					vertical-align: top;
				}
				.title{
					margin-left: 10px;
					font-size: 30px;
					line-height: @headerLoginHeight;
					border-left: 1px solid;
					padding:10px;
				}
			}
			&.fr{
				line-height: @headerLoginHeight;
			}
		}
	}

}
</style>