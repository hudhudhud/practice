<template>
  <div class="main">
    <div class="main-wrapper">
      <input type="button" @click="showModal=!showModal;" value="showModel" />
      <input type="button" @click="showToolTip=!showToolTip" value="showToolTip" />
      <v-modal :show.sync="showModal" />
      <v-tooltip :show.sync="showToolTip" />
      <v-list
        v-for="item in list"
        :key="item.id"
        :item="item"
      ></v-list>
    </div>
  </div>
</template>

<script>
import List from './list.vue'
import { mapActions } from 'vuex'
import Modal from '@/components/Modal.vue'
import ToolTip from '@/components/ToolTip.vue'

export default {
  name: 'App',
  components: {
    'v-list': List,
    'v-modal': Modal,
    'v-tooltip': ToolTip
  },
  data () {
    return {
      list: [],
      showModal:false,
      showToolTip:false,
    }
  },
  beforeMount () {
    this.getList().then((res) => {
      this.list = res
    })
  },
  mounted () {
    console.log(this.$store.state)
  },
  // 在组件实例化之前调用，所以它无法访问 this,需要将 store 和路由信息作为参数传递进去
  asyncData ({ store }) {
    console.log('fetch data')
    return store.dispatch('getNav')
  },
  methods: {
    ...mapActions([
      'getList'
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
