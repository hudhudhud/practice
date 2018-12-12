<template>
  <div id="app">
    <v-header></v-header>
    <div class="main">
      <router-view style="padding-top:50px"></router-view>
    </div>
  </div>
</template>

<script>
import Header from './components/header'

export default {
  name: 'App',
  components: {
    'v-header': Header
  }
}
</script>

<style lang="less">
html {
  font-size: 12px;
}
body {
  background: #f4f5f5;
}
* {
  list-style: none;
}
#app {
  min-height: calc(100vh);
  .main {
    max-width: 960px;
    margin: 0 auto;
    overflow: hidden;
    .main-wrapper {
      margin-top: 5.6rem;
      border-radius: 2px;
      box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
    }
  }
}
</style>
