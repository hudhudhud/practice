<template>
    <section class="fl breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item,i) in path" :key="i"  
           
            @click.native="goBack(i)"
            >{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
    </section>
</template>
<script>
import {
  Breadcrumb,
  BreadcrumbItem,
} from "element-ui";
export default {
    components:{
		elBreadcrumb:Breadcrumb,
		elBreadcrumbItem:BreadcrumbItem,
	},
	props:{
		path:Array,
    },
    methods:{
        goBack(i){
            let backLength=this.path.length-1-i
            if(backLength>0&&history.length>1){
                this.$router.go(-backLength)
            }
            else if(this.path[i].route){
                this.$router.push("/"+this.path[i].route)
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>
<style lang="less">
.breadcrumb{
     margin-top:20px;
 }
.el-breadcrumb__inner{
    cursor: pointer !important;
}
</style>


