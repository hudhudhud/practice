<template>
  <section class="page">
  		 <header-login title="个人中心">

  		 </header-login>
  		 <div class="content clearfix">
           	<ul class="left fl">
				<li  v-for="(item,i) in bars"   :key="i"  :class="{active:$route.path==item.to}" ><router-link :to="item.to" >{{item.name}}</router-link></li>
           	</ul>
            <div class="right fl">
                <router-view></router-view>
            </div>
  		 </div>
		<Footer/>
  </section>
</template>

<script>
import HeaderLogin from '@/components/HeaderLogin.vue'
import Footer from '@/components/Footer.vue'
export default {
  components:{
	  HeaderLogin,
	  Footer,
  },
  data:function(){
    return {
		bars:[{name:"我的资料",to:"/userCenter/info"},
				{name:"绑定手机",to:"/userCenter/phone"},
				{name:"绑定邮箱",to:"/userCenter/email"},
				{name:"设置密码",to:"/userCenter/password"},
				{name:"我的收藏",to:"/userCenter/fav"}],
    }
  },
  
}
</script>
<style scoped lang="less">
 .page{
     position:relative;
     padding-bottom:@footerHeight;
     box-sizing: border-box;
     footer{
         position:absolute;
         bottom:0;
     }
 }
@leftWidth:130px;
.content{
	.left,.right{
		border-radius:4px;
		background-color:#fff;
		margin-top:10px;
	}
	.left{
		margin-right: 10px;
		width:12%;
		box-sizing: border-box;
		background-color:#fff;
		padding:17px 0;
		border-radius:4px;
		height: 240px;
		li{
			width:100%;
			height: 40px;
			line-height: 40px;
			text-align: center;
			&:hover{
				a{
					color:@mainColor;
				}
			}
			&.active{
				background-color:@mainColor;
				opacity:1;
				a{
					color:#fff;
				}
			}
			opacity:0.54;
			a{
				color:#000;
			}
		}
	}
	.right{
		width:78%;
		min-height:240px;
		padding:10px;
		box-sizing: border-box;
	}
}
</style>
<style lang="less">
.userCenter-form{
	padding:70px 0;
    width:372px;
    margin:auto;
    .el-form-item__content {
        height: 50px;
        line-height:0;
    }
    .el-input__inner{
        height: 50px;
    }
    .submit{
        width:100%;
        height: 50px;
        background-color:@mainColor;
        color:#fff;
        font-size:18px;
        font-weight:bold;
        border:none;
        outline:none;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: @mainColor;
        border-color: @mainColor;
    }
    .el-checkbox__input.is-checked+.el-checkbox__label {
        color: @mainColor;
    }
    .el-input.is-active .el-input__inner, .el-input__inner:focus {
        border-color:@mainColor;
        outline: 0;
    }
    .yzm{
        position:relative;
        .el-button{
            height:50px;
            position:absolute;
            right:30px;
            
        }
    }
}
</style>