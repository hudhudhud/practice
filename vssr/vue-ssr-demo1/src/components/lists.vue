<template>
    <div class="main">
      <div class="main-wrapper">
        <input type="button" @click="change"  value="切换">
        <!-- <v-list
          v-for="item in list"
          :key="item.id"
          :item="item"
        ></v-list> -->
        <ul>
          <li v-for="(item,i) in list" :key="i">{{i}}:{{item.title}}</li>
        </ul>
      </div>
    </div>
</template>

<script>
import mockData from '../../data.json'
import List from './list.vue'
import axios from 'axios'

export default {
  name: 'lists',
  components: {
    'v-list': List
  },
  data () {
    return {
      list: [],
      switch: true
    }
  },
  created () {
    axios.get('https://iamabj.club/admin/manage/article/api').then(data => {
      this.list = data.data
    })
  },
  watch: {
    switch (val) {
      this.list = val ? mockData.data : mockData.data1
    }
  },
  methods: {
    change () {
      this.switch = !this.switch
    }
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
