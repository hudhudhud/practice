<template>
    <!-- 左边栏菜单 -->
     <el-scrollbar style='height:100%' class="left">
        <div class="logo" v-if="!isCollapse">
        </div>
        <el-menu :default-active="defaultMenu" router unique-opened text-color="#a4b3d7" :collapse="isCollapse">
            <sidebar-item v-for="(menu) in menus" :key="menu.id" :item='menu'></sidebar-item>
        </el-menu>
    </el-scrollbar>
</template>
<script>
  import * as cookie from '../util/util.js'
  import sidebarItem from '../component/sidebarItem'
  import cfg from '../config/config'
  import services from '../services'

  export default {
    components:{
        sidebarItem
    },
    data: function () {
      return {
        menus: [],
        defaultMenu: '',
        isCollapse:false,
      }
    },
    created: function(){
      if(localStorage.getItem("info")){
          this.menus = JSON.parse(localStorage.getItem("info")).menus;
      }else{
          this.$router.push('/login')
      }
    },
    mounted() {
      this.defaultMenu=this.$route.path
    }
  }
</script>
<style scoped lang="less">
    @leftWidth:250px;
    .left{
        position:fixed;
        left:0;
        top:0;
        width:@leftWidth;
        min-width: 200px;
        background-color:#525a8a;
        height: 100%;
        xoverflow-x:hidden;
        xoverflow-y:hidden;
        .logo{
            width:164px;
            height: 40px;
            margin:auto;
            margin-top:20px;
            text-align: center;
            background-image: url(../assets/img/logo.png);
            background-repeat: no-repeat;
            background-size: contain;
        }
    }   
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
    .el-menu{
        width:100%;
        padding-top:60px;
        background-color:#525a8a;
    }
</style>
<style>
    .el-scrollbar__bar.is-horizontal .el-scrollbar__thumb{
        display:none;
    }
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>

