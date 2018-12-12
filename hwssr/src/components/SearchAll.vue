<template>
	<section class="topSearch">
		<i class="fa fa-search" aria-hidden="true"></i>
		<el-select
			v-model="obj"
			value-key="value"
			filterable
			remote
			reserve-keyword
			:placeholder="placeholder"
			:remote-method="remoteMethod"
			:loading="loading"
			popper-class="top-auto-search-list"
			@change="change"
			
			>
			<el-option
			v-for="(item,i) in autoList"
			:key="i"
			:label="item.label"
			:value="item">
			</el-option>
		</el-select>
	</section>
</template>
<script>
import { Option, Select } from "element-ui";
import myaxios from "../assets/js/myaxios";
export default {
  components: {
    elSelect: Select,
    elOption: Option
  },
  props: {
	model:{},
    placeholder: String,
  },
  data: function() {
    return {
      obj: this.model,
      autoList: [],
      loading: false
    };
  },
  mounted() {
  },
  methods: {
	change(){
		if(this.obj.value){
			this.$store.commit('setSearchObj',this.obj)
			this.$emit("cb",this.obj)
		}
    } ,
    async remoteMethod(query) {
      if (query !== "") {
		this.loading = true;
        	//获取模糊查询数据
		await	myaxios.post("/web/quertTypeByCondition",{isId:1,"Condition":query}).then(res=>{
					var res=res.data.data.List
					this.autoList=res.map(item => {
						item.value=item.id.join(',')
						item.label = item.label.join(" , ");
						item.route = "rank"
						return item;
					})
				});
				
        await   myaxios.post("/web/queryAnchor",{"name":query}).then(res=>{
					var res=res.data.data.List
					this.loading = false;
					this.autoList.push(...res.map(item=>{
						item.route="detail"
						return item
					}));
            	})
		}
		else {
            this.autoList = [];
		}
    }
  }
};
</script>
<style lang="less">
.topSearch {
	position:relative;
	i{
		position: absolute;
		left:8px;
		line-height: @headerHeight;
		color:#fff;
	}
  .el-autocomplete {
    width: 200px;
    color: #fff;
	}
 .el-input .el-input__inner{
		padding-left:30px;
		color:#fff;
	}
	:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
			color: #fff; opacity:0.54; 
	}

	::-moz-placeholder { /* Mozilla Firefox 19+ */
			color: #fff;opacity:0.54;
	}

	input:-ms-input-placeholder{
			color: #fff;opacity:0.54;
	}

	input::-webkit-input-placeholder{
			color: #fff;opacity:0.54;
	}
}
.top-auto-search-list {
  width: 200px;
  z-index: 10000 !important;
  .el-popper[x-placement^="bottom"] {
    margin-top: 0;
  }
}
</style>