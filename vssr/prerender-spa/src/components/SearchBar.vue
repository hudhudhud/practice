<template>
    <section class="searchBar_wh clearfix">
        <div class="fr">
			<CascaderCatg  @cb="change"  :model="selectCatgIn"/>
			<!-- <el-date-picker
				v-model="selectDate"
				type="daterange"
				:picker-options="dateShortcut"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				align="left"
				@change="search"
				:clearable="false"
				:editable="false">
			</el-date-picker> -->
			<div class="date-select">
				<div class="hidePanel" v-if="showDate" @click="showDate=false"></div>
				<el-input type="button" @click.native="showDate=!showDate" v-model="inputShowDate"></el-input>
				<!-- max="2018-09" min="2018-01" -->
				<v-date-picker 
								color="#f2487d" @input="dateChange" locale="zh-cn"
								v-model="dateDefaultPicker" :landscape="false" type="month"  
								:style="showDate?'z-index:9999':''"
								:class="{active:showDate}"
				></v-date-picker>
			</div>
        </div>
    </section>
</template>
<script>
import myaxios from "../assets/js/myaxios";
import moment from 'moment'
import {
  Input,
  DatePicker,
} from "element-ui";
import CascaderCatg from '@/components/CascaderCatg.vue'
export default {
	components:{
		CascaderCatg,
		elInput:Input,
		elDatePicker:DatePicker,
	},
	watch:{
		$route:'init'
	},
	props:{
		 selectCatg: {
			 type:Array,
			 // 对象或数组默认值必须从一个工厂函数获取
			//  default: function () {
			// 	return []
			//  },
		 }
	},
    data:function(){
        return {
            selectCatgIn:this.selectCatg,

			inputShowDate:'',
			selectDate:[],//[new Date(2018,7,1),new Date(2018,7,31)],
			dateShortcut: {},
			dateDefaultPicker: '',
			showDate:false,
			catgName:"",
        }
	},
	mounted() {
		//初始化时间
		this.init()
	},
	methods:{
		init(){
			//初始化时间
			var from=this.$route.query.from
			var to=this.$route.query.to
			var catgs=this.$route.query.catgs
			if(from&&to){
				this.selectDate=[from,to]
				this.dateDefaultPicker=from.split('.')[0]+'-'+from.split('.')[1]
				this.inputShowDate=from.split('.')[0]+'年'+from.split('.')[1]+'月'
				// this.selectDate=[
				// new Date(from.substr(0,4),parseInt(from.substr(4,2))-1, from.substr(6,2)), 
				// new Date(to.substr(0,4),parseInt(to.substr(4,2))-1,to.substr(6,2))
				// ]
			}
			if(catgs){
				this.selectCatgIn=catgs.split(',')
			}
			//this.search()
		},
		change(payload){
			this.selectCatgIn=payload.catgs
			this.catgName=payload.label
			var catgLength=this.selectCatgIn.length
			if(catgLength==0){
				return
			}
			this.search()
		},
		dateChange(date) {
			this.showDate=false
			this.inputShowDate=date.replace('-','年')+'月'

			let yearMonth=date.split('-')
			let year=yearMonth[0]
			let month=yearMonth[1]
			this.selectDate=[`${year}.${month}.01`,`${year}.${month}.31`]
			this.search()
		},
		search(){
			let catgs=this.selectCatgIn.join(",")
			let catgLength=this.selectCatgIn.length
			let id=this.selectCatgIn[catgLength-1]
			let from="",to="";
			if(this.selectDate&&this.selectDate.length>0){
				// from=moment(this.selectDate[0]).format('YYYY.MM.DD')
				// to=moment(this.selectDate[1]).format('YYYY.MM.DD')
				from=this.selectDate[0]
				to=this.selectDate[1]
			}
			this.$router.push({"path":this.$route.name,query:{catgs,from,to}})
			this.$emit("cb", {id,label:this.catgName,level:catgLength-1,from,to});
		},
	}
}
</script>
<style lang="less" scoped>
@import '~vuetify/dist/vuetify.min.css';
@import '~material-design-icons-iconfont/dist/material-design-icons.css';
.searchBar_wh{
    width:100%;
	background-color: #fff;
	box-sizing: border-box;
	.date-select{
		z-index: 1;
		display: inline-block;
		position:relative;
		margin-right: 20px;
		.v-picker{
			margin-top:10px;
			position:absolute;
			top:100%;
			right:0;
			height:0;
			overflow: hidden;
			transition: height .1s linear;
			&.active{
				height: 374px;
			}
		}
	}
}
</style>
<style lang="less">
.searchBar_wh{
	.CascaderCatg{
		.el-cascader{
			width:350px;
			height:30px;
			.el-input__inner {
				border-radius: 15px;
				height: 30px;
				line-height: 30px;
				background-color:#f0f0f0;
			}
		}
		margin-right:9px;
	}
	.date-select{
		.el-input__inner{
			width:190px;
			height: 30px;
			border-radius:15px;
			line-height: 30px;
			background-color:#f0f0f0;
		}
		.v-btn{
			height: 50px;
		}
	}
}
// .searchBar-cas{
// 	ul:nth-child(n+3){
// 		li{
// 			&:first-child{
// 				background-color:rgba(0,0,0,0.1);
// 			}

// 		}
// 	}
// }

</style>

