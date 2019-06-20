<template>
	<section class="topSearch">
		<!-- <i class="fa fa-search" aria-hidden="true" @click="search"></i> -->
		<el-autocomplete
			:placeholder="placeholder"
			prefix-icon="el-icon-search"
			v-model="queryStr"
			:fetch-suggestions="autoSearch"
			size="medium"
			:trigger-on-focus="true"
			popper-class="top-auto-search-list">
			<template slot-scope="props"> <!-- 作用域插槽，数据由子组件决定，只是不同的样式 el-autocomplete组件插槽参数item-->
				<span class="fl">{{props.item.value}}</span>
				<span class="fr auto-type">{{props.item.type}}</span>
			</template>
		</el-autocomplete>
	</section>
</template>
<script>
import {Autocomplete} from 'element-ui'
export default {
  components:{
	  elAutocomplete:Autocomplete
  },
  props: {
    placeholder: String
  },
  data: function() {
    return {
	  queryStr: "",
	  autoList:[],
    };
  },
  mounted(){
	 this.autoList=this.loadAutoList()
  },
  methods: {
    autoSearch(qstr, cb) {
      var results = qstr
        ? this.autoList.filter(
            item => item.value.toLowerCase().indexOf(qstr.toLowerCase()) >= 0
          )
        : this.autoList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    search() {
      //根据this.queryStr，axios获取到数据
      var data = [1, 2, 3];
      this.$emit("afterSearch", data);
	},
	loadAutoList(){
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
  }
};
</script>
<style lang="less">
.topSearch {
  .el-autocomplete{
	width:200px;
    color: #fff;
  }
}
 .top-auto-search-list{
	  width:200px;
	  z-index: 10000 !important;
	  .el-popper[x-placement^=bottom]{
		  margin-top:0;
	  }
  }
</style>