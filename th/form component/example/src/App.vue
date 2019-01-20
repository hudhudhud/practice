<template>
  <div id="app">
    <div class="nav">
      <Nav></Nav>
    </div>
    <div class="content">
        <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import Nav from './views/navMenu'
    export default {
       components: {
           Nav
       }
    }
</script>
<style lang="scss" scoped>
  .nav{
    position: absolute;
    width: 200px;
    left: 0;
    top: 0;
    z-index: 10;
  }
  .content{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding-left: 200px
  }
</style>
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
  width: 1000px!important;
}

</style>
