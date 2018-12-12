<template>
  <div class="main">
    <div class="main-wrapper">
       <v-user
        v-for="item in users"
        :key="item.id"
        :item="item"
      ></v-user>
      <div v-if="!users||!users.length">加载中.。。</div>
    </div>
  </div>
</template>

<script>
import user from './user.vue'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    'v-user': user
  },
  data () {
    return {
      users: []
    }
  },
  beforeMount () {
    this.getUsers().then((res) => {
      this.users = res
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
      'getUsers'
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
