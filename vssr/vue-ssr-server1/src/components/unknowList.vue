<template>
  <div class="main">
    <div class="main-wrapper">
       <v-unknow
        v-for="item in list"
        :key="item.id"
        :item="item"
      ></v-unknow>
      <div v-if="!list||!list.length">加载中.。。</div>
    </div>
  </div>
</template>

<script>
import unknow from './unknow.vue'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    'v-unknow': unknow
  },
  data () {
    return {
      list: []
    }
  },
  beforeMount () {
    this.getUnkonw().then((res) => {
      console.log(777777777, res)
      this.list = res
    })
  },
  mounted () {
    console.log(this.$store.state)
  },
  asyncData ({ store }) {
    console.log('fetch data')
    return store.dispatch('getNav')
  },
  methods: {
    ...mapActions([
      'getUnkonw'
    ])
  }
}
</script>

<style lang="less">
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
</style>
