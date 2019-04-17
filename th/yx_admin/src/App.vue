<template>
  <div id="app">
       <router-view></router-view>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.el-message-box{
  xwidth: 1000px!important;
}
.search-form{
    padding:20px 10px;
    .el-form-item__label{
        width:unset !important;
    }
}

.fl {
    float:left;
}

.fr {
    float:right;
}

.clearfix {
    &:after {
        content: "";
        display: block;
        clear: both;
    }
}
.pagination{
    text-align: center;
    padding:20px;
}
.row-img{
    width:50px;
    height: 50px;
}

.detail_table{
    margin:10px 0;
    width:90%;
    border-collapse:collapse;
    font-size:14px;
    td{
        &.label{
            color: #99a9bf;
            width:120px;
        }
        padding:10px;
        border:1px solid $borderColor;
    }
}
.fa.fa-picture-o{
    font-size:30px;
}
</style>
