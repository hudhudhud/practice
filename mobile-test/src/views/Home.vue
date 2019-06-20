<template>
    <Page>
        <p class="hi">High网红</p>
        <div class="searchBar">
        	<i class="fa fa-th-large" @click="clickCatg"></i>
			<el-cascader
			    :options="options"
			    v-model="selectedOptions"
			    @change="catgChange"
			    size="medium"
			    :placeholder="searchType<=0?'请选择类目,或试试搜索导航':''"
			    separator="/"
			    expand-trigger="click"
			    :change-on-select="true"
			    :filterable="true"
			    :clearable="true"
			    @focus="clickCatg"
			    :class="{currentSearch:searchType==0,hidSearch:searchType!=0&&searchType!=-1}">
			</el-cascader>
			<el-autocomplete
			    :placeholder="Math.abs(searchType)==1?'请输入类目名或主播名(ID)':''"
			    prefix-icon="el-icon-search"
			    v-model="queryStr"
			    :fetch-suggestions="autoSearch"
			    size="medium"
			    :trigger-on-focus="true"
			    popper-class="auto-search-list"
			    @focus="clickQuery"
				@click.native="clickQuery"
			    :class="{currentSearch:searchType==1,hidSearch:searchType!=1&&searchType!=-1}">
			   	<template slot-scope="props"> <!-- 作用域插槽，数据由子组件决定，只是不同的样式 el-autocomplete组件插槽参数item-->
			   	  <span class="fl">{{props.item.value}}</span>
			   	  <span class="fr auto-type">{{props.item.type}}</span>
			   	</template>
			</el-autocomplete>
			<el-button round @click="search">搜索</el-button>
        </div>
        <div class="jxtj">
        	<p class="tit">精选推荐</p>
        	<el-tabs v-model="activeName" @tab-click="tabClick">
			    <el-tab-pane label="热门主播" name="first">
			    	<ul>
			    		<li v-for="(item,i) in rmzbList" :key="i">
			    			<router-link :to="'/detail/'+item.id">
				    			<img :src="item.img" >
				    			<p>{{item.desc}}</p>
				    		</router-link>
			    		</li>
			    	</ul>
			    </el-tab-pane>
			    <el-tab-pane label="热门直播" name="second">
			    	<ul>
			    		<li v-for="(item,i) in rmvedioList" :key="i">
			    			<img :src="item.img" >
			    			<p>{{item.desc}}</p>
			    		</li>
			    	</ul>
			    </el-tab-pane>
			    <el-tab-pane label="行业报告" name="third">
			    	<ul>
			    		<li v-for="(item,i) in hybgList" :key="i">
			    			<img :src="item.img" >
			    			<p>{{item.desc}}</p>
			    		</li>
			    	</ul>
			    </el-tab-pane>
			</el-tabs>
        </div>
    </Page>
</template>
<script>
// @ is an alias to /src
import Page from '@/components/Page.vue'
import moment from 'moment'
import {Cascader,Input,Button,Tabs,TabPane,Autocomplete} from 'element-ui'
import axios from 'axios'
export default {
	components: {
        Page,
        elCascader:Cascader,
        elInput:Input,
        elButton:Button,
        elTabs:Tabs,
        elTabPane:TabPane,
        elAutocomplete:Autocomplete,
    },
	data:function(){
		return {
			activeName:"third",
			selectedOptions: [],
			queryStr:"",
			restaurants:[],	
			searchType:-1,
			rmzbList:[{id:"1",desc:"i m aa",img:"/img/a.jpg"},{id:"2",desc:"i m bb",img:"/img/a.jpg"},{id:"3",desc:"i m cc",img:"/img/a.jpg"},{id:"4",desc:"i m dd",img:"/img/a.jpg"},{id:"5",desc:"i m ee",img:"/img/a.jpg"}],
			rmvedioList:[{id:"1",desc:"i m aa",img:"/img/a.jpg"},{id:"2",desc:"i m bb",img:"/img/b.jpg"},{id:"3",desc:"i m cc",img:"/img/b.jpg"},{id:"4",desc:"i m dd",img:"/img/b.jpg"},{id:"5",desc:"i m ee",img:"/img/a.jpg"}],
			hybgList:[{id:"1",desc:"i m aa",img:"/img/b.jpg"},{id:"2",desc:"i m bb",img:"/img/a.jpg"},{id:"3",desc:"i m cc",img:"/img/a.jpg"},{id:"4",desc:"i m dd",img:"/img/b.jpg"},{id:"5",desc:"i m ee",img:"/img/a.jpg"}],
			options:[
			{
	          value: 'zhinan',
	          label: '指南',
	          children: [
		          {
		            value: 'shejiyuanze',
		            label: '设计原则',
		            children: [{
				              value: 'yizhi',
				              label: '一致'
				            }, {
				              value: 'fankui',
				              label: '反馈'
				            }, {
				              value: 'xiaolv',
				              label: '效率'
				            }, {
				              value: 'kekong',
				              label: '可控'
				            }]
		          }, 
		          {
		            value: 'daohang',
		            label: '导航',
		            children: [{
		              value: 'cexiangdaohang',
		              label: '侧向导航'
		            }, {
		              value: 'dingbudaohang',
		              label: '顶部导航'
		            }]
		          }]
		    }],
		    
		}
	},
	computed:{
	},
    mounted(){
    	//获取精选数据 测试
    	//axios.get('/api/Article_cate/getlist').then(data=>console.log("66666",data))
    	this.restaurants = this.loadAll()
    },
    methods: {
    	catgChange(value) {
	        console.log(value);
	    },
    	clock(){
			setInterval(()=>{
				 this.msg=moment().format('YYYY-MM-DD hh:mm:ss')
			},1000)
    	},
    	tabClick(tab, event) {
	      console.log(tab);
	    },
	    search(){
	    	console.log(this.selectedOptions.toString())
	    	console.log(this.queryStr)
	    },
	    autoSearch(qstr, cb) {
	        var restaurants = this.restaurants
	        var results = qstr ? this.restaurants.filter(item=>item.value.toLowerCase().indexOf(qstr.toLowerCase()) >= 0) : this.restaurants
	        // 调用 callback 返回建议列表的数据
	        cb(results)
	    },
		clickCatg(){
			this.queryStr=""
			this.searchType=0
		},
		clickQuery(){
			this.selectedOptions=[]
			this.searchType=1
		},
	    loadAll() {
	        return [
	          { "value": "a", "type": "类目" },
	          { "value": "ab", "type": "类目" },
	          { "value": "acc", "type": "类目" },
	          { "value": "d", "type": "类目" },
	          { "value": "11", "type": "主播" },
	          { "value": "22", "type": "主播" },
	          { "value": "133", "type": "主播" },
	          { "value": "44", "type": "主播" },
	          { "value": "55", "type": "主播" },
	          { "value": "66", "type": "主播" },
	          { "value": "113", "type": "主播" },
	        ];
      },
    },
}
</script>
<style lang="less" scoped>
	.hi{
		font-size: 50px;
		text-align: center;
		margin-top: 150px;
	}
	.searchBar{
		width:700px;
		margin:auto;
		margin-top:100px;
		position: relative;
		.fa-th-large{
			position: absolute;
			color:#c0c4cc;
			font-size: 18px;
			top:50%;
			line-height: 50px;
			transform: translateY(-50%);
			z-index: 99;
			width:25px;
			height: 100%;
			cursor: pointer;
			text-align: center;
			left:5px;
		}
	}
	.jxtj{
		margin-top:100px;
		p.tit{
			text-align: center;
		}

	}
	
</style>
<style lang="less">
.searchBar{
	.el-button{
		margin-left: 10px;
	}
	.el-cascader{
		margin-right: -3px;
		.el-input--medium .el-input__inner{
			border-right: none;
		}
	}
	.el-autocomplete{
		.el-input--medium .el-input__inner{
			border-left: none;
		}
	}
	.el-cascader,.el-autocomplete{
			cursor: pointer;
			display: inline-block;
			width:300px;
			height: 50px;
			line-height: 50px;
			box-sizing: border-box;
			transition:width .1s linear;
			.el-input--medium .el-input__inner{
				height: 50px;
				line-height: 50px;
				padding:0 35px;				
			}
			&.currentSearch,&.hidSearch{
				.el-input--medium .el-input__inner{
					border: 1px solid #dcdfe6;
				}
			}
			&.currentSearch{
				width:500px;
			}
			&.hidSearch{
				width:50px;
				.el-input--medium .el-input__inner{
					padding:0 10px;
				}
			}
	}
	.el-cascader__label{
		padding: 0 25px 0 35px;
	}
}
.auto-search-list {
	width:500px !important;
	li{
		margin-top: 10px;
		transition: background-color .1s linear;
		.auto-type{
			background-color:#f2f2f2;
			border-radius: 20%;
			xborder:1px solid;
			padding:0px 8px;
		}
		&.highlighted, &:hover{
			background-color: rgba(0,0,0,0.1);
		}
	}
}
.jxtj{
	.el-tab-pane{
		ul{
			/*display: flex;
			flex-direction: row;
			justify-content:space-between;*/
			li{
				display: inline-block;
				width:20%;
				xborder: 1px solid;
				box-sizing: border-box;
				text-align: center;
				padding:5px;
				img{
					width:100%;
				}
			}
		}
	}
}
</style>