<template>
    <!--头部-->
    <el-header>
        <!-- <a class="sidebar-toggle">
          <i class="el-icon-tickets"></i>
        </a> -->
        <div class="navbar-custom-menu">
          <span class="name">HI{{','+orgTypeRoleName[orgType]}}~{{userName}}</span>
          <el-button @click="loginout">退出</el-button>
        </div>
    </el-header>
</template>
<script>
  import services from '../services'
  import {orgTypeRoleName} from '../assets/js/const.js'
  export default {
    data(){
      return {
        userName:'',
        orgType:'',
        orgTypeRoleName,
      }
    },
    created: function(){
      if(localStorage.getItem("info")){
          this.userName = JSON.parse(localStorage.getItem("info")).loginname
          this.orgType=JSON.parse(localStorage.getItem("info")).orgType
      }
      else{
          this.$router.push('/login');
      }
    },
    methods: {
      loginout: function() {
        services.user_loginout().then((res) => {
            window.localStorage.removeItem('info')
            this.$router.push('/login');
        })
      }
    },
  }
</script>
<style scoped lang="less">
  @leftWidth:250px;
  @headerHeight:80px;
  element {
    height: 0px;
  }
  .el-header {
    position: fixed;
    top:0;
    right:0;
    left:@leftWidth;
    height: @headerHeight;
    z-index: 1030;
    background-color:#fff;
    box-shadow:0px 10px 46px 0px rgba(22,64,128,0.06);
  }

  .navbar-custom-menu {
    float: right;
    height: 60px;
    line-height: 60px;
    margin-right: 24px;
    .name{
      color:rgba(155,161,174,1);
      font-size:14px;
      margin-right: 60px;
    }
  }

  .el-button {
    color: #fff;
    width:55px;
    height:24px;
    background:rgba(166,176,201,1);
    border-radius:12px;
    text-align:center;
    line-height: 24px;
    padding:0;
    outline:none;
  }

  .el-aside {
    background-color: #222d32;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-col {
    width: 100%;
    text-align: left;
    height: auto;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }

  .high {
    height: 1212px;
    background-color: #222d32;
    width: 230px;
  }
</style>