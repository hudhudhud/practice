<template>
    <header>
        <div class="bars clearfix">
            <ul class="fl">
                <li v-for="(item,i) in bars"  :class="{active:$router.currentRoute.path==item.link}" :key="i">
                    <router-link :to="item.link">
                    	<i :class="item.icon"></i>{{item.name}}
                    </router-link>
                </li>
            </ul>
            <div  v-if="userInfo.id">
            	<ul class="fr">
            		<li><a href="">{{userInfo.name}}</a></li>
            	</ul>
            	<Search class="fr search" @afterSearch="headerSearch" placeholder="输入类目或主播名称(ID)"/>
            </div>
            <ul class="fr" v-else>
            	<li>
                    <router-link to="/login">登录</router-link>
                </li>
                 <li>
                    <router-link to="/register">注册</router-link>
                </li>
            </ul>
        </div>
    </header>
</template>
<script>
import Search from '@/components/Search.vue'
export default {
	components:{
		Search,
	},
	data:function(){
		return {
			bars:[
				{name:"首页",link:"/",icon:"fa fa-home fa-lg"},
				{name:"品类行情概览",link:"/catg",icon:"fa fa-tasks"},
				{name:"主播排行",link:"/rank",icon:"fa fa-user"}
			],
			userInfo:this.$store.state.userInfo
		}
	},
	mounted:function(){
		//console.log("username="+this.userInfo.name)
	},
	methods:{
		headerSearch(data){
			console.log('emit it'+data.toString())
		}
	}
}
</script>
<style lang="less" scoped>
header {
    position: fixed;
    top: 0;
    width: 100%;
    min-width: @contentWidth;
    height: @headerHeight;
    background-color: #333;
    z-index: 9999;
    box-shadow: 3px 3px 5px rgba(0,0,0,.25);
    .bars {
        height: 100%;
        width: @contentWidth;
        margin: auto;
        ul {
            height: 100%;
            li {
                height: 100%;
                line-height: @headerHeight;
                display: inline-block;
                transition: background-color .1s linear;
                &.active{
                	background-color: #0079fe;
                	a{color:#fff;}
                }
                &:hover {
                   background-color: #666;
                }
                a {
                	display: inline-block;
                	padding: 0 20px;
                    color: #ccc;
                    &:hover {
                        color: #fff;
                    };
                    i{
                    	padding-right: 5px;
                    }
                }
                box-sizing: border-box;
                cursor: pointer;
            }
        }
        .search{
        	margin-right: 50px;
        	line-height: @headerHeight;
        }
    }
}
</style>