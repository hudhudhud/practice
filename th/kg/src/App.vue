<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created (){
  	//this.$router.push('/login');
  }
}
</script>

<style lang="less">
*{xbackground-color:rgba(0,0,0,0.1)}
  body,
  div,
  header,
  section,
  aside,
  div,
  h1,
  h2,
  h3,
  form,
  p {
    padding: 0px;
    margin: 0px;
  }

  a {
    text-decoration: none;
  }
html,body{
  width:100%;
  height: 100%;
}
#app{
  width:100%;
  height: 100%;
}
input{
  outline: none;
}

 @headerHeight:80px;
 @leftWidth:250px;
.page-manage{
  width:100%;
  height: 100%;
  .backstage {
    margin-left: @leftWidth;
    margin-top:@headerHeight;
    border: 1px solid #ddd;
    background-color: white;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  }
}
.required:before{
  content:"*";
  color:red;
}
.sub-btns{
  padding-top:30px;
  text-align: center;
}
.sub-btns-left{
  padding:20px 0 0 80px;
}
.fl{
  float:left;
}
.fr{
  float:right;
}
.clearfix:after{
  content:"";
  display: block;
  clear:both;
}
.form-line{padding: 10px 0;}
.form-label{
    display: inline-block;
    width:80px;
    text-align: right;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
a{
  cursor: pointer;
  xcolor:#525a8a;
}
.pagination{
    text-align: center;
    margin-top:20px;
}
.oneline{
  overflow:hidden; 
  text-overflow:ellipsis; 
  white-space:nowrap; 
}
.el-dialog{
    min-width:700px;
}
.table-row-elli{
  &.el-table .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis; 
    }
}
.form-search{
  .formInput,
  .formSelect,
  .formSelectOrg,
  .formSelectSchool,
  .formSelectRemote{
    padding-top:0 !important;
    padding-bottom:0 !important;
  }
  label{
    font-size:14px;
    color: #606266;
    line-height: 40px;
    &:after{
      content:':'
    }
    &:nth-of-type(n+2){
      margin-left:20px
    }
  }
}
ul li{
  list-style: none;
}
</style>


