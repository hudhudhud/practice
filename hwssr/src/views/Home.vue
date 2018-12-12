<template>
    <Page :class="{zb:isZb,lm:!isZb}">
		<div class="home-img"><img src="/img/hiwh.png" alt="" ></div>
        <div class="searchBar" >
			<p class="tab"><span  @click="isZb=false;" :class="{active:!isZb}">类目</span><span class="fg">|</span><span @click="isZb=true;" :class="{active:isZb}">主播</span></p>
			<CascaderCatg  @cb="goRank" v-show="!isZb" placeholder="请输入类目名称"/>
     		<SelectZb  popperClass="auto-search-list"  placeholder="请输入主播名"  v-show="isZb">
				<!-- 作用域插槽，数据由子组件决定，只是
				不同的样式 SelectZb组件插槽参数item-->
				<template slot-scope="slotProps">
					<router-link target="_blank" :to="'/detail/'+slotProps.item.value" class="zb-link">
						<p class="fl zbtx">
							<img  :src="slotProps.item.img" alt="">
							<span >{{slotProps.item.label}}</span>
						</p>
						<p class="fr zblm">
							<span>{{slotProps.item.identity}} | {{slotProps.item.field}} | {{slotProps.item.organ}}</span>
						</p>
					</router-link>
				</template>
			</SelectZb>
        </div>
    </Page>
</template>
<script>
// @ is an alias to /src
import Page from "@/components/Page.vue";
import SelectZb from '@/components/SelectZb.vue'
import CascaderCatg from '@/components/CascaderCatg.vue'
import moment from "moment";
import {
  Input,
  Button,
  Tabs,
  TabPane,
} from "element-ui";
import myaxios from "../assets/js/myaxios";
import common from '../assets/js/common'
export default {
  components: {
    Page,
	SelectZb,
	CascaderCatg,
    elInput: Input,
    elButton: Button,
    elTabs: Tabs,
    elTabPane: TabPane,
  },
  data: function() {
    return {
	  activeName: "first",
      searchType: -1,
	  isZb:false,
    };
  },
  methods: {
    clock() {
		setInterval(() => {
			this.msg = moment().format("YYYY-MM-DD hh:mm:ss");
		}, 1000);
    },
	goRank(payload){
        if(payload.catgs&&payload.catgs.length>0){
            if((payload.catgs[payload.catgs.length-1]+'').indexOf('-')>-1){
               payload.catgs.pop()
            }
            this.$router.push({path:"/rank",query:{catgs:payload.catgs.join(","),from:common.defaultDate.from,to:common.defaultDate.to}})
		}
	},
  }
};
</script>
<style lang="less" scoped>
.page{
	min-width: @contentWidth;
	transition: background-image .05s linear;
	&.lm{
		background:pink url(/img/home-bk.png)  center/cover no-repeat fixed;
		//background:pink url(/img/home-catg.jpg)  center/cover no-repeat fixed;
	}
	&.zb{
		background:pink url(/img/home-bk.png)  center/cover no-repeat fixed;
		//background:pink url(/img/home-zb.jpg)  center/cover no-repeat fixed;
	}
}
.searchBar-tab{
	width: 700px;
  	margin: auto;
    margin-top: 100px;
}
.home-img{
	width:941px;
	margin:auto;
	margin-top:82px;
	margin-bottom:60px;
	img{
		width:100%;
	}
}
.searchBar {
	width: 820px;
	height: 50px;
	margin: auto;
	position: relative;
	border-radius:4px;
	box-shadow:1px 1px 1px 1px rgba(0,0,0,0.1);
	margin-bottom:250px;
	.tab{
		position: absolute;
		font-size: 14px;
		line-height: 50px;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		span{
			cursor: pointer;
			padding:0 5px;
			box-sizing: border-box;
			&.active{
				color:@mainColor;
			}
			&.fg{
				color:rgba(0,0,0,0.1);
			}
		}
		left: 0;
		text-align: center;
		width:136px;
		background-color: #fff;
    }
}
.jxtj {
  margin-top: 100px;
  p.tit {
    text-align: center;
  }
}
.zb-link{
	color: #606266;
	width:100%;
	height:100%;
	display:inline-block;
}
</style>
<style lang="less">
.searchBar-tab{
	.el-button+.el-button {
		margin-left:0;
	}
}
.searchBar {
  .el-cascader,
  .el-select {
	box-sizing:border-box;
	position:absolute;
	top:0;
	left:0;
    cursor: pointer;
	display: block;
    width: 684px;
    height:100%;
    line-height: 50px;
	box-sizing: border-box;
	margin-left:136px;
    .el-input__inner {
      height: 50px;
	  line-height: 50px;
	  outline:none;
	  border:none;
	  
    }
  }
  .el-cascader__label {
    padding: 0 25px 0 35px;
  }
}
.auto-search-list {
  li.el-select-dropdown__item {
    padding: 0 10px;
    margin-top: 10px;
    transition: background-color 0.1s linear;
    .auto-type {
      background-color: #f2f2f2;
      border-radius: 20%;
      padding: 0px 8px;
    }
    &.highlighted,
    &:hover {
	
      background-color: rgba(0, 0, 0, 0.1);
	}
	.zbtx{
		img{
			margin-right:5px;
			width:20px;
			height: 20px;
			vertical-align:middle;
		} 
	}
  }
}
.jxtj {
  .el-tab-pane {
    ul {
      li {
        display: inline-block;
        width: 20%;
        xborder: 1px solid;
        box-sizing: border-box;
        text-align: center;
        padding: 5px;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>